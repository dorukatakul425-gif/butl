// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

const a = '00000000-0000-0000-0000-000000000001';
let db: PGlite;
const mig = (f: string) => readFileSync(new URL(`../../supabase/migrations/${f}`, import.meta.url), 'utf8');
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE TABLE profiles(id uuid PRIMARY KEY, name text, photo_url text, male boolean, owned_items text[] NOT NULL DEFAULT '{}', frame text DEFAULT '', stone text DEFAULT '');
    CREATE TABLE room_players(room_id bigint, user_id uuid PRIMARY KEY);
    CREATE TABLE gift_prices(gift_type text PRIMARY KEY, price integer NOT NULL);
    CREATE TABLE gift_events(sender_id uuid, gift_type text, created_at timestamptz NOT NULL DEFAULT now());
    INSERT INTO profiles(id,name) VALUES ('${a}','Ayla'); INSERT INTO gift_prices VALUES ('rose',700);
    INSERT INTO gift_events(sender_id,gift_type) VALUES ('${a}','rose');`);
  await db.exec(mig('20261028090000_tops_level_activity.sql'));
  await db.exec(mig('20261029090000_level_custom_frames.sql'));
  await db.exec(mig('20261030100000_admin_gift_level.sql'));
}, 30000);
afterAll(async () => { await db?.close(); });
const q = async (sql: string) => (await db.query<Record<string, unknown>>(sql)).rows[0]!;

describe('admin gift level', () => {
  it('sets an exact level: 1400 points per level', async () => {
    expect(await q(`SELECT admin_set_gift_level('${a}', 37) l`)).toMatchObject({ l: 37 });
    expect(await q(`SELECT gift_points_of('${a}') p`)).toMatchObject({ p: 37 * 1400 });
  });
  it('level can be lowered back to 0', async () => {
    expect(await q(`SELECT admin_set_gift_level('${a}', 0) l`)).toMatchObject({ l: 0 });
  });
  it('a granted frame can be applied without the level', async () => {
    await db.query(`SELECT admin_grant_frame('${a}', 'cf_1135', true)`);
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [a]);
    await db.query(`SELECT set_decor('cf_1135', '')`);
    expect(await q(`SELECT frame FROM profiles WHERE id='${a}'`)).toMatchObject({ frame: 'cf_1135' });
  });
});
