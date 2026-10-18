// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
describe('current league TOP authority', () => {
 it('uses live promotion positions, excludes expired rounds and nonparticipants', async () => {
  const db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT '00000000-0000-0000-0000-000000000001'::uuid $$;
    CREATE TABLE league_config(move_up int); INSERT INTO league_config VALUES(3);
    CREATE TABLE league_members(round_id int, user_id uuid, score int, joined_at timestamptz);
    CREATE TABLE league_rounds(id int, state text, finish_at timestamptz);
    CREATE FUNCTION _league_participates(p_user uuid) RETURNS boolean LANGUAGE sql AS $$ SELECT p_user <> '00000000-0000-0000-0000-000000000005'::uuid $$;
    INSERT INTO league_rounds VALUES (1,'running',now()+interval '1 hour');
    INSERT INTO league_members SELECT 1, ('00000000-0000-0000-0000-'||lpad(n::text,12,'0'))::uuid, 100-n, now() FROM generate_series(1,5) n;`);
  await db.exec(await readFile(new URL('../../drizzle/migrations/0039_profile_league_top.sql', import.meta.url), 'utf8'));
  const top = async (n: number) => (await db.query<{top: boolean}>(`select profile_league_top($1::uuid) as top`, [`00000000-0000-0000-0000-${String(n).padStart(12,'0')}`])).rows[0]?.top;
  expect(await top(3)).toBe(true); expect(await top(4)).toBe(false);
  await db.exec('UPDATE league_members SET score=200 WHERE user_id=\'00000000-0000-0000-0000-000000000005\'');
  expect(await top(5)).toBe(false);
  await db.exec("UPDATE league_rounds SET finish_at=now()-interval '1 second'");
  expect(await top(1)).toBe(false);
  await db.close();
 });
});
