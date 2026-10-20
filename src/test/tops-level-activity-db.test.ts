// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
let db: PGlite;
async function as(id: string) { await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]); }

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE TABLE profiles(id uuid PRIMARY KEY, name text, photo_url text, male boolean);
    CREATE TABLE room_players(room_id bigint, user_id uuid PRIMARY KEY);
    CREATE TABLE gift_prices(gift_type text PRIMARY KEY, price integer NOT NULL);
    CREATE TABLE gift_events(sender_id uuid, gift_type text, created_at timestamptz NOT NULL DEFAULT now());`);
  await db.exec(readFileSync(new URL('../../supabase/migrations/20261028090000_tops_level_activity.sql', import.meta.url), 'utf8'));
}, 30000);
beforeEach(async () => {
  await db.exec(`TRUNCATE activity_minutes, gift_events, gift_prices, room_players, profiles CASCADE;
    INSERT INTO profiles VALUES ('${a}','Ayla',null,false),('${b}','Oruc',null,true);
    INSERT INTO gift_prices VALUES ('rose', 700);`);
  await as(a);
});
afterAll(async () => { await db?.close(); });
const top = async (s: string, p = '') => (await db.query<{ id: string; score: string; rank: string }>('SELECT id, score, rank FROM top_players_extra($1,$2)', [s, p])).rows;

describe('level and activity rankings', () => {
  it('level points are hearts spent on gifts, sender only', async () => {
    await db.exec(`INSERT INTO gift_events(sender_id, gift_type) VALUES ('${b}','rose'),('${b}','rose')`);
    const rows = await top('glv');
    expect(rows.find(r => r.id === b)).toMatchObject({ score: 1400, rank: 1 });
    expect(rows.find(r => r.id === a)).toMatchObject({ score: 0, rank: 0 });
  });
  it('a minute counts only while seated and once per minute', async () => {
    expect((await db.query('SELECT activity_ping() n')).rows[0]).toMatchObject({ n: 0 });
    await db.exec(`INSERT INTO room_players VALUES (1, '${a}')`);
    await db.query('SELECT activity_ping()');
    await db.query('SELECT activity_ping()');
    expect((await top('activity', 'daily')).find(r => r.id === a)).toMatchObject({ score: 1, rank: 1 });
  });
});
