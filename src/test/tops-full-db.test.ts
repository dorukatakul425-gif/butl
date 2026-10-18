// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
const c = '00000000-0000-0000-0000-000000000003';
let db: PGlite;
async function as(id: string) { await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]); }

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE TABLE profiles(id uuid PRIMARY KEY, name text, photo_url text, male boolean, bio text,
      gold integer NOT NULL DEFAULT 0, kisses integer NOT NULL DEFAULT 0,
      vip_until timestamptz, harem_value integer NOT NULL DEFAULT 0, harem_owner uuid);
    CREATE TABLE league_players(user_id uuid, level integer);
    CREATE TABLE rooms(id bigint PRIMARY KEY, music jsonb);
    CREATE TABLE room_players(room_id bigint REFERENCES rooms(id), user_id uuid PRIMARY KEY REFERENCES profiles(id), seat smallint);
    CREATE TABLE gift_prices(gift_type text PRIMARY KEY, price integer NOT NULL, vip_only boolean NOT NULL DEFAULT false, kisses_required integer NOT NULL DEFAULT 0);
    CREATE TABLE gift_events(room_id bigint, sender_id uuid, receiver_id uuid, gift_type text, seed int);
    CREATE TABLE gesture_events(sender_id uuid, created_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE kickout_config(id boolean PRIMARY KEY DEFAULT true, paid_price integer, free_cooldown_seconds integer,
      kick_delay_seconds integer NOT NULL DEFAULT 30, ban_seconds integer NOT NULL DEFAULT 900);
    INSERT INTO kickout_config(id) VALUES (true);
    CREATE PUBLICATION supabase_realtime;`);
  await db.exec(readFileSync(new URL('../../supabase/migrations/20261019140000_tops_full.sql', import.meta.url), 'utf8'));
}, 30000);

beforeEach(async () => {
  await db.exec(`TRUNCATE kiss_events, dj_events, profile_notifications, gift_events, gesture_events, room_players, rooms, profiles CASCADE;
    INSERT INTO rooms VALUES (1, null);
    INSERT INTO profiles(id, name, male, gold, kisses) VALUES
      ('${a}', 'Ayla', false, 100, 5), ('${b}', 'Oruc', true, 100, 9), ('${c}', 'Ceyla', false, 100, 0);
    INSERT INTO room_players VALUES (1, '${a}', 1), (1, '${b}', 2), (1, '${c}', 3);`);
  await as(a);
});
afterAll(async () => { await db?.close(); });

describe('Telegram top ratings', () => {
  it('ranks DJs by hearts spent on music', async () => {
    await as(b);
    await db.query(`SELECT play_music('cz', '{"duration": 120, "song_id": "s1"}')`);
    await as(a);
    const { rows } = await db.query<{ id: string; score: number }>(`SELECT * FROM top_players('dj_score', '')`);
    expect(rows[0]).toMatchObject({ id: b, score: 5 });
  });
  it('counts a gift received while your song plays as one DJ point', async () => {
    await as(b);
    await db.query(`SELECT play_music('cz', '{"duration": 120, "song_id": "s1"}')`);
    await as(a);
    await db.query(`INSERT INTO gift_prices VALUES ('rose', 3, false, 0)`);
    await db.query(`SELECT send_gift('rose', ARRAY['${b}']::uuid[], 1)`);
    const { rows } = await db.query<{ id: string; score: number }>(`SELECT * FROM top_players('dj_score', '')`);
    expect(rows[0]).toMatchObject({ id: b, score: 6 });
  });
  it('limits the daily kiss rating to kisses received today', async () => {
    await db.query(`INSERT INTO kiss_events(user_id, created_at) VALUES ('${a}', now() - interval '2 days'), ('${b}', now())`);
    const { rows } = await db.query<{ id: string; score: number }>(`SELECT * FROM top_players('total_kisses', 'daily')`);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ id: b, score: 1 });
  });
  it('ranks the absolute kiss rating from the lifetime counter', async () => {
    const { rows } = await db.query<{ id: string; score: number }>(`SELECT * FROM top_players('total_kisses', '')`);
    expect(rows[0]).toMatchObject({ id: b, score: 9 });
  });
  it('ranks price by last admiration price and harem_price by hearts spent admiring', async () => {
    await db.query(`UPDATE profiles SET harem_value = 7, harem_owner = '${a}' WHERE id = '${b}'`);
    const price = await db.query<{ id: string; score: number }>(`SELECT * FROM top_players('price', '')`);
    expect(price.rows[0]).toMatchObject({ id: b, score: 7 });
    const harem = await db.query<{ id: string; score: number }>(`SELECT * FROM top_players('harem_price', '')`);
    expect(harem.rows[0]).toMatchObject({ id: a, score: 7 });
  });
  it('reports the real DJ score in the profile popup stats', async () => {
    await as(b);
    await db.query(`SELECT play_music('yt', '{"duration": 120, "song_id": "s2"}')`);
    await as(a);
    const { rows } = await db.query<{ s: { dj_score: number; dj_score_rank: number } }>(`SELECT user_profile_stats('${b}') s`);
    expect(rows[0]?.s.dj_score).toBe(9);
    expect(rows[0]?.s.dj_score_rank).toBe(1);
  });
});

describe('admiration notifications', () => {
  it('notifies the previous admirer when someone else admires the same person', async () => {
    await as(a);
    await db.query(`SELECT harem_purchase('${c}')`);
    await as(b);
    await db.query(`SELECT harem_purchase('${c}')`);
    const { rows } = await db.query<{ user_id: string; actor_id: string; kind: string; body: string }>(`SELECT * FROM profile_notifications`);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ user_id: a, actor_id: b, kind: 'harem_stolen' });
    expect(rows[0]?.body).toContain('Oruc');
  });
  it('notifies the admirer when the person rejects them', async () => {
    await as(a);
    await db.query(`SELECT harem_purchase('${c}')`);
    await as(c);
    await db.query(`SELECT harem_purchase('${c}')`);
    const { rows } = await db.query<{ kind: string }>(`SELECT * FROM profile_notifications`);
    expect(rows[0]?.kind).toBe('harem_rejected');
  });
});

describe('kickout live prices', () => {
  it('sets a 30-heart paid price and a one-day free cooldown', async () => {
    const { rows } = await db.query<{ paid_price: number; free_cooldown_seconds: number }>(`SELECT * FROM kickout_config`);
    expect(rows[0]).toMatchObject({ paid_price: 30, free_cooldown_seconds: 86400 });
  });
});
