// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

let db: PGlite;
const admin = '00000000-0000-0000-0000-000000000001';
const player = '00000000-0000-0000-0000-000000000002';
const claims = async (id: string) => { await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]); };
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    CREATE TABLE public.profiles(id uuid PRIMARY KEY);
    CREATE TABLE public.user_roles(user_id uuid, role text);
    CREATE FUNCTION public.has_role(_user_id uuid,_role text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$SELECT EXISTS(SELECT 1 FROM user_roles WHERE user_id=_user_id AND role=_role)$$;
    INSERT INTO auth.users VALUES('${admin}'),('${player}');
    INSERT INTO profiles VALUES('${admin}'),('${player}');
    INSERT INTO user_roles VALUES('${admin}','admin');`);
  await db.exec(readFileSync(new URL('../../drizzle/migrations/0072_player_names_refresh.sql', import.meta.url), 'utf8'));
}, 30000);
afterAll(async () => { await db?.close(); });

describe('admin cosmetic grants and global refresh', () => {
  it('only an administrator can assign colored names and Creator', async () => {
    await claims(player);
    await expect(db.query(`SELECT admin_set_name_style('${player}','rainbow',true)`)).rejects.toThrow('İcazə yoxdur');
    await claims(admin);
    await db.query(`SELECT admin_set_name_style('${player}','rainbow',true)`);
    expect((await db.query(`SELECT name_style,creator FROM player_name_styles WHERE user_id='${player}'`)).rows).toEqual([{ name_style: 'rainbow', creator: true }]);
  });
  it('Creator does not confer any role and can be revoked independently', async () => {
    expect((await db.query(`SELECT role FROM user_roles WHERE user_id='${player}'`)).rows).toEqual([]);
    await claims(admin);
    await db.query(`SELECT admin_set_name_style('${player}','ruby',false)`);
    expect((await db.query(`SELECT name_style,creator FROM player_name_styles WHERE user_id='${player}'`)).rows).toEqual([{ name_style: 'ruby', creator: false }]);
  });
  it('ordinary players cannot write cosmetics or broadcast a refresh', async () => {
    await claims(player);
    await expect(db.query('SELECT admin_request_site_refresh()')).rejects.toThrow('İcazə yoxdur');
    await db.exec('SET ROLE authenticated');
    await expect(db.query(`UPDATE player_name_styles SET creator=true WHERE user_id='${player}'`)).rejects.toThrow('permission denied');
    await expect(db.query('INSERT INTO site_refresh_requests(singleton) VALUES(1)')).rejects.toThrow('permission denied');
    await db.exec('RESET ROLE');
  });
  it('one administrator action produces a new readable revision for all authenticated players', async () => {
    await claims(admin);
    const first = (await db.query<{ id: string }>('SELECT admin_request_site_refresh() id')).rows[0];
    const second = (await db.query<{ id: string }>('SELECT admin_request_site_refresh() id')).rows[0];
    expect(first?.id).toBeTruthy(); expect(second?.id).toBeTruthy(); expect(first?.id).not.toBe(second?.id);
    await claims(player); await db.exec('SET ROLE authenticated');
    expect((await db.query('SELECT id FROM site_refresh_requests')).rows).toEqual([{ id: second?.id }]);
    await db.exec('RESET ROLE');
  });
});