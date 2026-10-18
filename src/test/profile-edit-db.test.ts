// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
const uid='00000000-0000-0000-0000-000000000001';
let db: PGlite;
async function edit(date:string, male:boolean,price:number,old='1999-01-01',oldMale=true) { return db.query('select save_profile_info($1,$2,$3,$4,$5)',[date,male,price,old,oldMale]); }
async function row() { return (await db.query<{ gold:number; birthday:string; profile_updated_at:string|null; male:boolean }>('select gold,birthday::text,profile_updated_at,male from profiles')).rows[0]; }
beforeAll(async()=>{
 db=new PGlite(); await db.exec(`create role anon; create role authenticated; create role service_role; create schema auth;
 create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table profiles(id uuid primary key,name text,male boolean,age int,photo_url text,gold int,profile_setup_done boolean default true);
 grant select,update on profiles to authenticated;`);
 await db.exec(readFileSync(new URL('../../supabase/migrations/20261018180000_telegram_profile_settings.sql',import.meta.url),'utf8'));
},30000);
beforeEach(async()=>{ await db.exec(`reset role; truncate profiles; insert into profiles(id,name,male,age,gold,birthday) values('${uid}','Duru',true,27,50,'1999-01-01'); select set_config('request.jwt.claim.sub','${uid}',false);`); });
afterAll(async()=>{await db?.close();});
describe('Telegram profile information rules',()=>{
 it('first information edit costs zero hearts and records use',async()=>{await edit('1998-01-01',true,0);expect((await row())?.gold).toBe(50);expect((await row())?.profile_updated_at).not.toBeNull();});
 it('subsequent information changes cost exactly 20 hearts',async()=>{await edit('1998-01-01',true,0);await edit('1997-01-01',false,20,'1998-01-01');expect((await row())?.gold).toBe(30);expect((await row())?.male).toBe(false);});
 it('photo-only edits remain free without consuming first edit',async()=>{await db.exec("update profiles set photo_url='https://example.test/photo.jpg'");await edit('1999-01-01',true,0);expect((await row())?.gold).toBe(50);expect((await row())?.profile_updated_at).toBeNull();});
 it('no-op retries never charge twice',async()=>{await edit('1998-01-01',true,0);await edit('1997-01-01',false,20,'1998-01-01');await edit('1997-01-01',false,20,'1998-01-01');expect((await row())?.gold).toBe(30);});
 it('rejects stale zero price after first edit without spending',async()=>{await edit('1998-01-01',true,0);await expect(edit('1997-01-01',true,0,'1998-01-01')).rejects.toThrow('price_changed');expect((await row())?.gold).toBe(50);});
 it('insufficient hearts roll back all profile fields',async()=>{await edit('1998-01-01',true,0);await db.exec('update profiles set gold=19');await expect(edit('1997-01-01',false,20,'1998-01-01')).rejects.toThrow('insufficient_hearts');expect(await row()).toMatchObject({gold:19,birthday:'1998-01-01',male:true});});
 it('rejects births younger than 18',async()=>{const d=(await db.query<{d:string}>("select (current_date-interval '18 years'+interval '1 day')::date::text d")).rows[0]?.d;await expect(edit(d??'',true,0)).rejects.toThrow('invalid_profile');});
 it('rejects births older than 98',async()=>{const d=(await db.query<{d:string}>("select (current_date-interval '98 years'-interval '1 day')::date::text d")).rows[0]?.d;await expect(edit(d??'',true,0)).rejects.toThrow('invalid_profile');});
 it('rejects unauthenticated edits',async()=>{await db.exec("select set_config('request.jwt.claim.sub','',false)");await expect(edit('1998-01-01',true,0)).rejects.toThrow('not_signed_in');});
 it('does not accept a stale prior profile from another window',async()=>{await edit('1998-01-01',true,0);await expect(edit('1997-01-01',false,20)).rejects.toThrow('profile_changed');});
 it('prevents direct age edits bypassing the charge',async()=>{await db.exec('set role authenticated');await expect(db.exec('update profiles set age=22')).rejects.toThrow('use_profile_info_action');});
 it('registration cannot be replayed after setup',async()=>{await expect(db.query('select complete_profile_setup(false,25)')).rejects.toThrow('profile_setup_already_done');});
});
