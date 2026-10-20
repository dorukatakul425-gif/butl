// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
it('requires authentication and returns latest twenty unique gift senders only', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      CREATE TABLE profiles(id uuid PRIMARY KEY, name text, photo_url text);
      CREATE TABLE gift_events(sender_id uuid, receiver_id uuid, created_at timestamptz);
      INSERT INTO profiles SELECT md5(n::text)::uuid, n::text, null FROM generate_series(1,25) n;
      INSERT INTO gift_events SELECT id, md5('1')::uuid, now() - (name::int * interval '1 minute') FROM profiles;
      INSERT INTO gift_events VALUES (md5('2')::uuid, md5('1')::uuid, now());`);
    await db.exec(readFileSync(new URL('../../drizzle/migrations/0061_player_heart_senders.sql', import.meta.url), 'utf8'));
    await expect(db.query("SELECT * FROM player_heart_senders(md5('1')::uuid)")).rejects.toThrow('not_authenticated');
    await db.query("SELECT set_config('request.jwt.claim.sub',md5('1')::uuid::text,false)");
    const { rows } = await db.query<{name: string}>("SELECT * FROM player_heart_senders(md5('1')::uuid)");
    expect(rows).toHaveLength(20);
    expect(rows[0]?.name).toBe('2');
    expect(new Set(rows.map(r => r.name)).size).toBe(20);
    expect(rows.some(r => r.name === '1')).toBe(false);
    expect((await db.query("SELECT * FROM player_heart_senders(md5('25')::uuid)")).rows).toEqual([]);
  } finally { await db.close(); }
}, 30000);
