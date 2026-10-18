// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, beforeEach, expect, it } from 'vitest';
let db: PGlite;
const id = '00000000-0000-0000-0000-000000000001';
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE TABLE profiles(id uuid PRIMARY KEY,birthday date);
    CREATE TABLE rooms(id bigint PRIMARY KEY,music jsonb);
    CREATE TABLE room_players(room_id bigint,user_id uuid);
    CREATE TABLE chat_messages(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,room_id bigint,user_id uuid,text text,kind text,created_at timestamptz DEFAULT now());`);
  await db.exec(readFileSync(new URL('../../supabase/migrations/20261019180000_chat_event_history.sql', import.meta.url),'utf8'));
}, 30000);
afterAll(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec(`TRUNCATE profiles,rooms,room_players,chat_messages;
    INSERT INTO profiles(id,birthday) VALUES('${id}',((now() at time zone 'Asia/Baku')::date - interval '25 years')::date);
    INSERT INTO rooms VALUES(1,null),(2,null);`);
});
it('announces a newcomer once per account across leaving and joining another table', async () => {
  await db.exec(`INSERT INTO room_players VALUES(1,'${id}'); DELETE FROM room_players; INSERT INTO room_players VALUES(2,'${id}');`);
  expect((await db.query("SELECT * FROM chat_messages WHERE kind='newcomer'")).rows).toHaveLength(1);
});
it('creates one birthday gift widget per table and birthday day, including after rejoining', async () => {
  await db.exec(`INSERT INTO room_players VALUES(1,'${id}'); DELETE FROM room_players; INSERT INTO room_players VALUES(1,'${id}');`);
  expect((await db.query("SELECT * FROM chat_messages WHERE kind='birthday'")).rows).toHaveLength(1);
});
it('does not announce a birthday on a different day', async () => {
  await db.exec(`UPDATE profiles SET birthday=birthday+interval '1 day'; INSERT INTO room_players VALUES(1,'${id}');`);
  expect((await db.query("SELECT * FROM chat_messages WHERE kind='birthday'")).rows).toHaveLength(0);
});
it('persists every music notice even after playback finishes or the room changes song', async () => {
  for (const key of [1,2]) await db.query('UPDATE rooms SET music=$1 WHERE id=1',[JSON.stringify({sender:id,key,started_at:new Date().toISOString(),item:{artist:'DJ',title:`Track ${key}`}})]);
  await db.exec('UPDATE rooms SET music=null WHERE id=1');
  const rows = (await db.query<{payload:{title:string}}>("SELECT payload FROM chat_messages WHERE kind='music' ORDER BY id")).rows;
  expect(rows.map(r=>r.payload.title)).toEqual(['Track 1','Track 2']);
});