// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

const user = '00000000-0000-0000-0000-000000000001';
const admin = '00000000-0000-0000-0000-000000000002';
let db: PGlite;
let revision = 0;
const request = () => crypto.randomUUID();
async function config(winner: number) {
  const value = { enabled: true, spinCost: 1, dailyChances: 0, bundleChances: 10, bundleDat: 10, revision, prizes: Array.from({ length: 16 }, (_, id) => ({ id, percentage: id === winner ? 100 : 0 })) };
  await db.query('select set_config($1,$2,false)', ['request.jwt.claim.sub', admin]);
  const rows = await db.query<{ revision: number }>('select admin_roulette_save($1::jsonb) revision', [JSON.stringify(value)]);
  revision = rows.rows[0]?.revision ?? -1;
  await db.query('select set_config($1,$2,false)', ['request.jwt.claim.sub', user]);
}
const action = async (kind = 'spin', id = request()) => (await db.query<{ r: { rewardIndex: number; rewards: Array<{ image: string; count: number }>; confirmed: boolean } }>('select roulette_action($1,$2,$3) r', [id, kind, revision])).rows[0]?.r;
const balance = async () => (await db.query<{ gold: number; tokens: number; dat: number }>('select gold,tokens,dat from profiles where id=$1', [user])).rows[0];
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role;
  create schema auth; create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
  create table profiles(id uuid primary key,gold integer default 0,tokens integer default 0,dat integer default 1000);
  create table user_boosters(user_id uuid,booster text,count integer default 0,primary key(user_id,booster));
  create function has_role(u uuid,r text) returns boolean language sql as $$select u='${admin}'::uuid and r='admin'$$;
  create function is_banned(u uuid) returns boolean language sql as $$select coalesce(current_setting('test.banned',true),'')='true'$$;
  insert into profiles(id) values('${user}'),('${admin}');`);
  await db.exec(readFileSync(new URL('../../drizzle/migrations/0071_roulette.sql', import.meta.url), 'utf8'));
  await config(3);
  await action('buy');
}, 30000);
afterAll(async () => { await db?.close(); });
describe('authoritative roulette percentages and awards', () => {
  it('a 100% heart prize always wins, all 0% prizes never win', async () => {
    await db.query('update roulette_accounts set chances=100 where user_id=$1', [user]);
    const before = await balance();
    for (let i = 0; i < 100; i++) expect(await action()).toMatchObject({ rewardIndex: 3, rewards: [{ image: 'gold', count: 10 }] });
    expect((await balance())?.gold).toBe((before?.gold ?? -1) + 1000);
    expect((await db.query<{ n: number }>('select count(*)::int n from roulette_events where action=$1 and prize_id<>3', ['spin'])).rows[0]?.n).toBe(0);
  });
  it('retrying the same spin debits and awards exactly once', async () => {
    await action('buy'); const id = request(); const before = await balance();
    const first = await action('spin', id); expect(await action('spin', id)).toEqual(first);
    expect((await balance())?.gold).toBe((before?.gold ?? -1) + 10);
    expect((await db.query<{ n: number }>('select count(*)::int n from roulette_events where request_id=$1', [id])).rows[0]?.n).toBe(1);
  });
  it('buying 10 chances costs exactly 10 DAT once on retry', async () => {
    const before = await balance(), id = request(); await action('buy', id); await action('buy', id);
    expect((await balance())?.dat).toBe((before?.dat ?? -1) - 10);
  });
  it('insufficient DAT rolls back chance purchase and creates no event', async () => {
    await db.query('update profiles set dat=0 where id=$1', [user]); const id=request();
    await expect(action('buy', id)).rejects.toThrow('insufficient_dat');
    expect((await db.query<{ n: number }>('select count(*)::int n from roulette_events where request_id=$1',[id])).rows[0]?.n).toBe(0);
  });
  it('zero chances cannot spin or mint a reward', async () => {
    await db.query('update roulette_accounts set chances=0 where user_id=$1',[user]);
    const before = await balance(); await expect(action()).rejects.toThrow('kifayət'); expect(await balance()).toEqual(before);
  });
  it('a 100% chance prize credits 3 chances and spends 1', async () => {
    await config(0); await db.query('update roulette_accounts set chances=1 where user_id=$1',[user]);
    expect(await action()).toMatchObject({ rewardIndex: 0, rewards: [{ image:'chances',count:3 }] });
    expect((await db.query<{ chances: number }>('select chances from roulette_accounts where user_id=$1',[user])).rows[0]?.chances).toBe(3);
  });
  it('a 100% booster prize is persisted in the owner inventory', async () => {
    await config(2); expect(await action()).toMatchObject({ rewardIndex:2 });
    expect((await db.query<{ count: number }>('select count from user_boosters where user_id=$1 and booster=$2',[user,'kiss_fire'])).rows[0]?.count).toBe(3);
  });
  it('ordinary players cannot change probabilities', async () => {
    await expect(db.query('select admin_roulette_save($1::jsonb)',['{}'])).rejects.toThrow('forbidden');
  });
  it('rejects 99% totals rather than silently normalizing percentages', async () => {
    await db.query('select set_config($1,$2,false)', ['request.jwt.claim.sub', admin]);
    const v={ revision, prizes:Array.from({length:16},(_,id)=>({id,percentage:id===3?99:0})) };
    await expect(db.query('select admin_roulette_save($1::jsonb)',[JSON.stringify(v)])).rejects.toThrow('100%');
    await db.query('select set_config($1,$2,false)', ['request.jwt.claim.sub', user]);
  });
  it('stale configuration is rejected before any wallet change', async () => {
    const before=await balance(); await expect(db.query('select roulette_action($1,$2,$3)',[request(),'spin',revision-1])).rejects.toThrow('dəyişib'); expect(await balance()).toEqual(before);
  });
  it('daily free chances are granted once per Baku day', async () => {
    await db.exec('update roulette_config set daily_chances=2; update roulette_accounts set chances=0,daily_claimed=null');
    expect(await action()).toMatchObject({rewardIndex:2}); expect(await action()).toMatchObject({rewardIndex:2});
    await expect(action()).rejects.toThrow('kifayət');
  });
  it('signed-out callers cannot spin', async () => {
    await db.query('select set_config($1,$2,false)',['request.jwt.claim.sub','']); await expect(action()).rejects.toThrow('not authenticated');
  });
  it('banned accounts cannot spin with a previously issued session', async () => {
    await db.query('select set_config($1,$2,false)', ['request.jwt.claim.sub', user]);
    await db.query('select set_config($1,$2,false)', ['test.banned', 'true']);
    await expect(action()).rejects.toThrow('user_banned');
  });
});