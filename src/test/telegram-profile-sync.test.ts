// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchTelegramProfile } from '../lib/telegram-profile-sync.server';
import { telegramIdentity } from '../lib/telegram-profile-sync';
const user = { id: 42, first_name: 'Old', username: 'old' };
afterEach(() => vi.unstubAllGlobals());
function mockApi(chat: object, photos: object, file?: object) {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (url.includes('/file/bot')) return new Response(new Uint8Array([1,2,3]));
    const result = url.endsWith('/getChat') ? chat : url.endsWith('/getFile') ? file : photos;
    return Response.json(result);
  }));
}
describe('Telegram login profile refresh', () => {
  it('uses current Telegram display name and username instead of saved identity', async () => {
    mockApi({ok:true,result:{id:42,type:'private',first_name:'New',last_name:'Name',username:'NEW_USER'}}, {ok:true,result:{total_count:0,photos:[]}});
    const p = await fetchTelegramProfile('test-token', user);
    expect(p.name).toBe('New Name'); expect(p.username).toBe('new_user');
  });
  it('downloads the latest changed photo', async () => {
    mockApi({ok:false}, {ok:true,result:{total_count:1,photos:[[{file_id:'new-photo'}]]}}, {ok:true,result:{file_path:'photos/new.jpg'}});
    expect((await fetchTelegramProfile('test-token', user)).photo).toEqual(new Uint8Array([1,2,3]));
  });
  it('clears a confirmed removed photo for NO PHOTO', async () => {
    mockApi({ok:false}, {ok:true,result:{total_count:0,photos:[]}});
    expect((await fetchTelegramProfile('test-token', user)).photo).toBeNull();
  });
  it('preserves saved photo and bio on API failure', async () => {
    mockApi({ok:false}, {ok:false});
    const p = await fetchTelegramProfile('test-token', user);
    expect(p.photo).toBeUndefined(); expect(p.bio).toBeUndefined(); expect(p.name).toBe('Old');
  });
  it('copies actual Telegram bio into the shared profile bio', async () => {
    mockApi({ok:true,result:{id:42,type:'private',first_name:'New',bio:'Salam!'}}, {ok:false});
    expect((await fetchTelegramProfile('test-token', user)).bio).toBe('Salam!');
  });
  it('clears bio when the accessible private chat has no bio', async () => {
    mockApi({ok:true,result:{id:42,type:'private',first_name:'New'}}, {ok:false});
    expect((await fetchTelegramProfile('test-token', user)).bio).toBe('');
  });
  it('uses a stable id when Telegram username is removed', () => {
    expect(telegramIdentity({...user,username:undefined}).username).toBe('tg42');
  });
});
