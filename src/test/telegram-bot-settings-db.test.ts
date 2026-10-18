// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key);');
  await db.exec(readFileSync(new URL('../../drizzle/migrations/0040_telegram_bot_settings.sql', import.meta.url), 'utf8'));
}, 30000);
afterAll(async () => { await db?.close(); });
describe('Bot credential table permissions', () => {
  it('blocks browser reads and writes, including signed-in players', async () => {
    for (const role of ['anon', 'authenticated']) {
      await db.exec(`set role ${role}`);
      await expect(db.query('select * from public.telegram_bot_settings')).rejects.toThrow('permission denied');
      await expect(db.query("insert into public.telegram_bot_settings(id,ciphertext,iv) values(1,'fixture','fixture')")).rejects.toThrow('permission denied');
      await db.exec('reset role');
    }
  });
  it('allows the authorized server service to persist configuration', async () => {
    await db.exec('set role service_role');
    await db.exec("insert into public.telegram_bot_settings(id,ciphertext,iv) values(1,'fixture','fixture')");
    expect((await db.query('select id from public.telegram_bot_settings')).rows).toEqual([{ id: 1 }]);
    await db.exec('reset role');
  });
});