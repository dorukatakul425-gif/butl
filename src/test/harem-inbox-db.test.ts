// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, expect, it } from 'vitest';

const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
const c = '00000000-0000-0000-0000-000000000003';
let db: PGlite;
const as = (id: string) => db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE TABLE profiles(id uuid PRIMARY KEY, name text, photo_url text, male boolean, gold integer NOT NULL DEFAULT 100, harem_value integer NOT NULL DEFAULT 0, harem_owner uuid);
    CREATE TABLE profile_notifications(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id uuid NOT NULL, actor_id uuid, kind text NOT NULL, body text NOT NULL, created_at timestamptz DEFAULT now());
    GRANT SELECT ON profile_notifications TO authenticated;
    ALTER TABLE profile_notifications ENABLE ROW LEVEL SECURITY;
    CREATE POLICY own ON profile_notifications FOR SELECT TO authenticated USING(user_id=auth.uid());
    GRANT USAGE ON SCHEMA auth TO authenticated;
    GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;`);
  await db.exec(readFileSync(new URL('../../supabase/migrations/20261109090000_harem_inbox.sql', import.meta.url), 'utf8'));
}, 30000);
beforeEach(async () => {
  await db.exec(`RESET ROLE; TRUNCATE profiles, profile_notifications;
    INSERT INTO profiles(id,name,male) VALUES ('${a}','A',true),('${b}','B',true),('${c}','C',false);`);
  await as(a);
});
afterAll(async () => { await db?.close(); });

it('first admiration creates one persisted notice for the target, not the purchaser', async () => {
  await db.query(`SELECT harem_purchase('${c}')`);
  const { rows } = await db.query<{user_id:string;payload:{price:number;oldOwner:{id:string}}}>(`SELECT * FROM profile_notifications`);
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ user_id:c, payload:{price:1, oldOwner:{id:c}} });
});
it('transfer notifies both target and previous admirer with the actual charged price', async () => {
  await db.query(`SELECT harem_purchase('${c}')`); await as(b);
  await db.query(`SELECT harem_purchase('${c}')`);
  const { rows } = await db.query<{user_id:string;payload:{price:number}}>(`SELECT * FROM profile_notifications WHERE payload->>'price'='2' ORDER BY user_id`);
  expect(rows.map(r=>r.user_id)).toEqual([a,c]);
  expect(rows.every(r=>r.payload.price===2)).toBe(true);
});
it('release notifies only the previous admirer and clears ownership', async () => {
  await db.query(`SELECT harem_purchase('${c}')`); await as(c);
  await db.query(`SELECT harem_purchase('${c}')`);
  const { rows } = await db.query<{user_id:string;kind:string}>(`SELECT * FROM profile_notifications WHERE kind='harem_rejected'`);
  expect(rows).toMatchObject([{user_id:a,kind:'harem_rejected'}]);
  expect((await db.query<{harem_owner:null}>(`SELECT harem_owner FROM profiles WHERE id='${c}'`)).rows[0]?.harem_owner).toBeNull();
});
it('insufficient funds cannot create notifications or change ownership', async () => {
  await db.query(`UPDATE profiles SET gold=0 WHERE id='${a}'`);
  await expect(db.query(`SELECT harem_purchase('${c}')`)).rejects.toThrow('not_enough_gold');
  expect((await db.query(`SELECT * FROM profile_notifications`)).rows).toHaveLength(0);
  expect((await db.query<{harem_value:number}>(`SELECT harem_value FROM profiles WHERE id='${c}'`)).rows[0]?.harem_value).toBe(0);
});
it('purchasing never credits hearts to the target', async () => {
  await db.query(`SELECT harem_purchase('${c}')`);
  expect((await db.query<{gold:number}>(`SELECT gold FROM profiles WHERE id='${c}'`)).rows[0]?.gold).toBe(100);
  expect((await db.query<{gold:number}>(`SELECT gold FROM profiles WHERE id='${a}'`)).rows[0]?.gold).toBe(99);
});
it('only the notice recipient can acknowledge, and acknowledgement is idempotent', async () => {
  await db.query(`SELECT harem_purchase('${c}')`);
  const {rows} = await db.query<{id:number}>(`SELECT id FROM profile_notifications`);
  const id = rows[0]?.id; expect(id).toBeDefined();
  await expect(db.query(`SELECT acknowledge_harem_notice(${id})`)).rejects.toThrow('unknown_notice');
  await as(c); await db.query(`SELECT acknowledge_harem_notice(${id})`); await db.query(`SELECT acknowledge_harem_notice(${id})`);
  expect((await db.query(`SELECT * FROM profile_notifications WHERE read_at IS NULL`)).rows).toHaveLength(0);
});
it('RLS denies another player reading the target inbox', async () => {
  await db.query(`SELECT harem_purchase('${c}')`); await db.exec('SET ROLE authenticated');
  expect((await db.query(`SELECT * FROM profile_notifications`)).rows).toHaveLength(0);
  await as(c); expect((await db.query(`SELECT * FROM profile_notifications`)).rows).toHaveLength(1);
  await db.exec('RESET ROLE');
});
it('anonymous purchases and acknowledgements are rejected', async () => {
  await as('');
  await expect(db.query(`SELECT harem_purchase('${c}')`)).rejects.toThrow('not_authenticated');
  await expect(db.query(`SELECT acknowledge_harem_notice(1)`)).rejects.toThrow('not_authenticated');
});