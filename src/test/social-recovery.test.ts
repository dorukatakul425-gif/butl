import { afterEach, describe, expect, it, vi } from 'vitest';
const mock = vi.hoisted(() => ({ handlers: [] as { filter: Record<string, string>; callback: (payload: any) => void }[], status: null as null | ((value: string) => void), profile: Promise.resolve({ data: [] as any[] }) }));
vi.mock('@/lib/supabase', () => ({ getSupabase: () => ({
  from: (table: string) => {
    const query: any = { select: () => query, order: () => query, in: () => mock.profile, limit: async () => ({ data: [] }) };
    query.then = (fn: any) => Promise.resolve({ data: [] }).then(fn);
    return query;
  },
  channel: () => {
    const channel: any = { on: (_: string, filter: Record<string, string>, callback: (payload: any) => void) => { mock.handlers.push({ filter, callback }); return channel; }, subscribe: (fn: (value: string) => void) => { mock.status = fn; return channel; } };
    return channel;
  }, removeChannel: vi.fn(),
}) }));
import { onDirectMessage, onSocialRecovery, startSocial } from '@/lib/social';
afterEach(() => { mock.handlers = []; mock.status = null; vi.restoreAllMocks(); });
describe('message subscription recovery', () => {
  it('delivers sender-side inserts from another signed-in device', () => {
    const stop = startSocial('me'); const received = vi.fn(); const off = onDirectMessage(received);
    const handler = mock.handlers.find(h => h.filter['table'] === 'direct_messages' && h.filter['event'] === 'INSERT' && h.filter['filter'] === 'sender_id=eq.me');
    const message = { id: 'real-id', sender_id: 'me', recipient_id: 'friend', body: 'hello', created_at: '2026-10-18T18:30:00Z', read_at: null };
    expect(handler).toBeDefined(); handler?.callback({ new: message });
    expect(received).toHaveBeenCalledWith(message, 'insert'); off(); stop();
  });
  it('requests active-thread recovery on subscription and foreground', () => {
    const recover = vi.fn(); const off = onSocialRecovery(recover); const stop = startSocial('me');
    mock.status?.('SUBSCRIBED'); expect(recover).toHaveBeenCalledTimes(1);
    document.dispatchEvent(new Event('visibilitychange')); expect(recover).toHaveBeenCalledTimes(2);
    stop(); mock.status?.('SUBSCRIBED'); expect(recover).toHaveBeenCalledTimes(2); off();
  });
  it('discards a delayed friendship notification after logout', async () => {
    let resolve: (value: { data: any[] }) => void = () => {};
    mock.profile = new Promise(done => { resolve = done; });
    const stop = startSocial('me');
    const handler = mock.handlers.find(h => h.filter['table'] === 'friendships' && h.filter['filter'] === 'addressee_id=eq.me');
    const notice = vi.spyOn(window, 'setTimeout');
    handler?.callback({ eventType: 'INSERT', new: { id: 'f', requester_id: 'other' } });
    stop(); resolve({ data: [{ id: 'other', name: 'Other' }] });
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    expect(notice).not.toHaveBeenCalled(); mock.profile = Promise.resolve({ data: [] });
  });
});