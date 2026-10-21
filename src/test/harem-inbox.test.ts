import { expect, it, vi } from 'vitest';
vi.mock('@/lib/supabase', () => ({getSupabase:()=>null}));
import { decodeHaremNotice, acknowledgeHaremNotice } from '@/lib/harem-inbox';
const user = (id:string) => ({id,name:id,male:true,photoUrl:''});
const row = {id:169,user_id:'target',read_at:null,payload:{type:'harem_purchase',price:169,target:user('target'),newOwner:user('buyer'),oldOwner:user('previous')}};
it('uses the server price 169 and event ID, not a computed reward', () => {
  expect(decodeHaremNotice(row,'target')).toMatchObject({id:'169',price:169,viewerId:'target'});
});
it('rejects an event intended for another account', () => {expect(decodeHaremNotice(row,'other')).toBeNull();});
it('does not replay acknowledged notifications', () => {expect(decodeHaremNotice({...row,read_at:'2026-10-21'},'target')).toBeNull();});
it('does not show the purchaser an inbox dialog', () => {expect(decodeHaremNotice({...row,user_id:'buyer'},'buyer')).toBeNull();});
it('rejects fabricated invalid prices and missing identities', () => {
  expect(decodeHaremNotice({...row,payload:{...row.payload,price:0}},'target')).toBeNull();
  expect(decodeHaremNotice({...row,payload:{...row.payload,newOwner:null}},'target')).toBeNull();
});
it('cannot silently acknowledge without an authenticated client', async () => {await expect(acknowledgeHaremNotice('169')).rejects.toThrow('not_authenticated');});