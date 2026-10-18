// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
const c = '00000000-0000-0000-0000-000000000003';
let db: PGlite;
async function as(id: string) { await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]); }
async function action(id: string, kind: string, price: number) { return db.query('SELECT kickout_action($1,$2,$3)', [id, kind, price]); }
async function state() { return (await db.query<{ s: { price: number; freeAt: number; targets: Record<string, { kickAt: number }> } }>('SELECT kickout_refresh() s')).rows[0]?.s; }
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE TABLE profiles(id uuid PRIMARY KEY,gold integer NOT NULL,vip_until timestamptz);
    CREATE TABLE rooms(id bigint PRIMARY KEY);
    CREATE TABLE room_players(room_id bigint REFERENCES rooms(id),user_id uuid PRIMARY KEY REFERENCES profiles(id));
    CREATE PUBLICATION supabase_realtime;`);
  await db.exec(readFileSync(new URL('../../supabase/migrations/20261018160000_kickout.sql', import.meta.url), 'utf8'));
}, 30000);
beforeEach(async () => {
  await db.exec(`TRUNCATE room_players,kickout_targets,kickout_usage,profiles,rooms CASCADE;
    UPDATE kickout_config SET paid_price=7,free_cooldown_seconds=600;
    INSERT INTO rooms VALUES(1),(2);
    INSERT INTO profiles VALUES('${a}',50,now()+interval '1 day'),('${b}',50,null),('${c}',50,now()+interval '1 day');
    INSERT INTO room_players VALUES(1,'${a}'),(1,'${b}'),(1,'${c}');`);
  await as(a);
});
afterAll(async () => { await db?.close(); });
describe('Telegram kick/save database rules', () => {
  it('schedules removal exactly 30 seconds later and blocks the same table for 15 minutes after removal', async () => {
    await action(b,'kick',0);
    const r = await db.query<{ delay: number; ban: number }>('SELECT round(extract(epoch from kick_at-now()))::int delay,extract(epoch from blocked_until-kick_at)::int ban FROM kickout_targets');
    expect(r.rows[0]?.delay).toBe(30); expect(r.rows[0]?.ban).toBe(900);
    expect((await db.query('SELECT * FROM room_players WHERE user_id=$1',[b])).rows).toHaveLength(1);
  });
  it('allows a non-VIP target to save themselves and cancel the pending ban', async () => {
    await action(b,'kick',0); await as(b); await action(b,'save',0);
    expect((await db.query('SELECT * FROM kickout_targets')).rows).toHaveLength(0);
    expect((await db.query('SELECT * FROM room_players WHERE user_id=$1',[b])).rows).toHaveLength(1);
  });
  it('requires VIP to kick another player', async () => {
    await as(b); await expect(action(a,'kick',0)).rejects.toThrow('vip_required');
    expect((await db.query('SELECT * FROM kickout_targets')).rows).toHaveLength(0);
  });
  it('requires VIP to save another player', async () => {
    await action(c,'kick',0); await as(b); await expect(action(c,'save',0)).rejects.toThrow('vip_required');
  });
  it('does not allow kicking oneself', async () => { await expect(action(a,'kick',0)).rejects.toThrow('cannot_kick_self'); });
  it('gives VIPs exactly half the configured free-action cooldown', async () => {
    await action(b,'kick',0);
    const vip = await db.query<{ secs: number }>('SELECT round((kickout_refresh()->>\'freeAt\')::numeric/1000-extract(epoch from last_free_at))::int secs FROM kickout_usage WHERE user_id=$1',[a]);
    expect(vip.rows[0]?.secs).toBe(300);
    await as(b); await action(b,'save',0);
    const regular = await db.query<{ secs: number }>('SELECT round((kickout_refresh()->>\'freeAt\')::numeric/1000-extract(epoch from last_free_at))::int secs FROM kickout_usage WHERE user_id=$1',[b]);
    expect(regular.rows[0]?.secs).toBe(600);
  });
  it('rejects stale prices without debiting the wallet', async () => {
    await action(b,'kick',0); await expect(action(c,'kick',0)).rejects.toThrow('price_changed');
    expect((await db.query<{ gold: number }>('SELECT gold FROM profiles WHERE id=$1',[a])).rows[0]?.gold).toBe(50);
  });
  it('debits only the authoritative configured price and rejects duplicate kicks without spending again', async () => {
    await action(b,'kick',0); expect((await state())?.price).toBe(7);
    await action(c,'kick',7); await expect(action(c,'kick',7)).rejects.toThrow('already_kicked');
    expect((await db.query<{ gold: number }>('SELECT gold FROM profiles WHERE id=$1',[a])).rows[0]?.gold).toBe(43);
  });
  it('requires both players at the same table', async () => {
    await db.query('UPDATE room_players SET room_id=2 WHERE user_id=$1',[b]);
    await expect(action(b,'kick',0)).rejects.toThrow('target_not_at_table');
  });
  it('removes a due target, rejects same-table re-entry, allows another table, and allows return after expiry', async () => {
    await action(b,'kick',0); await db.exec("UPDATE kickout_targets SET kick_at=now()-interval '1 second'"); await state();
    expect((await db.query('SELECT * FROM room_players WHERE user_id=$1',[b])).rows).toHaveLength(0);
    await expect(db.query('INSERT INTO room_players VALUES(1,$1)',[b])).rejects.toThrow('kickout_room_blocked');
    await db.query('INSERT INTO room_players VALUES(2,$1)',[b]);
    await db.exec("UPDATE kickout_targets SET blocked_until=now()-interval '1 second'");
    await db.query('UPDATE room_players SET room_id=1 WHERE user_id=$1',[b]);
    expect((await db.query('SELECT * FROM room_players WHERE room_id=1 AND user_id=$1',[b])).rows).toHaveLength(1);
  });
  it('keeps actions disabled rather than inventing source prices or free cooldowns', async () => {
    await db.exec('UPDATE kickout_config SET paid_price=null,free_cooldown_seconds=null');
    await expect(action(b,'kick',0)).rejects.toThrow('kickout_not_configured');
  });
});