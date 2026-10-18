import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
const mock = vi.hoisted(() => ({ onAuth: null as null | ((event: string, session: any) => void), reads: [] as ((value: { data: any }) => void)[] }));
vi.mock('@/lib/supabase', () => ({ getSupabase: () => ({ auth: { onAuthStateChange: (fn: any) => { mock.onAuth = fn; }, signOut: async () => {} }, from: () => { const query: any = { select: () => query, eq: () => query, maybeSingle: () => new Promise(done => mock.reads.push(done)) }; return query; } }) }));
import { getAuth, refreshProfile, signOut, useAuth } from '@/lib/auth';
function Auth() { useAuth(); return null; }
afterEach(async () => { cleanup(); await signOut(); mock.reads = []; });
it('never resurrects account A after logout while its profile is loading', async () => {
  render(<Auth />); act(() => mock.onAuth?.('SIGNED_IN', { user: { id: 'A' } }));
  await act(async () => { await signOut(); mock.reads[0]?.({ data: { id: 'A' } }); });
  expect(getAuth().session).toBeNull(); expect(getAuth().profile).toBeNull();
});
it('keeps account B when account A resolves later', async () => {
  render(<Auth />); act(() => { mock.onAuth?.('SIGNED_IN', { user: { id: 'A' } }); mock.onAuth?.('SIGNED_IN', { user: { id: 'B' } }); });
  await act(async () => { mock.reads[1]?.({ data: { id: 'B' } }); mock.reads[0]?.({ data: { id: 'A' } }); });
  expect(getAuth().session?.user.id).toBe('B'); expect(getAuth().profile?.id).toBe('B');
});
it('discards an older profile refresh when a newer refresh has completed', async () => {
  render(<Auth />); await act(async () => { mock.onAuth?.('SIGNED_IN', { user: { id: 'B' } }); mock.reads[0]?.({ data: { id: 'B', gold: 10 } }); });
  const old = refreshProfile(), fresh = refreshProfile();
  await act(async () => { mock.reads[2]?.({ data: { id: 'B', gold: 20 } }); await fresh; mock.reads[1]?.({ data: { id: 'B', gold: 10 } }); await old; });
  expect(getAuth().profile?.gold).toBe(20);
});