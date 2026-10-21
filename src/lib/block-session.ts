import { useSyncExternalStore } from 'react';
import { getSupabase } from './supabase';

const empty = new Set<string>();
let blocked: ReadonlySet<string> = empty;
let generation = 0;
let mutation = 0;
let mutationQueue: Promise<void> = Promise.resolve();
const listeners = new Set<() => void>();
const publish = (next: ReadonlySet<string>) => { blocked = next; listeners.forEach(fn => fn()); };
// Değişmeyen listeyi yayınlamak tüm masa/sohbet abonelerini boşuna yeniden çizdiriyordu.
const sameBlocked = (a: ReadonlySet<string>, b: ReadonlySet<string>) => a.size === b.size && [...a].every(v => b.has(v));

/** Owner-scoped ignore state shared by table, profiles and chat. */
export function startCloudBlocks(viewerId: string) {
  const sb = getSupabase();
  const current = ++generation;
  let read = 0;
  publish(empty);
  if (!sb) return () => {};
  const load = async () => {
    const request = ++read;
    const revision = mutation;
    const { data, error } = await sb.from('user_blocks').select('blocked').eq('blocker', viewerId);
    if (error || current !== generation || request !== read || revision !== mutation) return;
    const next = new Set((data ?? []).map(row => String(row.blocked)));
    if (!sameBlocked(next, blocked)) publish(next);
  };
  void load();
  const channel = sb.channel(`ignore-${viewerId}-${current}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_blocks' }, () => void load())
    .subscribe(status => { if (status === 'SUBSCRIBED') void load(); });
  const local = () => { read++; void load(); };
  window.addEventListener('source:ignore-changed', local);
  const timer = window.setInterval(() => void load(), 5000);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener('source:ignore-changed', local);
    void sb.removeChannel(channel);
    if (generation === current) { generation++; publish(empty); }
  };
}
export function useBlockedUsers() {
  return useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, () => blocked, () => empty);
}
export const isUserBlocked = (id: string) => blocked.has(id);
export function setUserBlocked(id: string, value: boolean): Promise<void> {
  const current = generation;
  const operation = mutationQueue.then(async () => {
    if (generation === current) await commitBlock(id, value, current);
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}
async function commitBlock(id: string, value: boolean, current: number) {
  const sb = getSupabase();
  if (!sb) throw new Error('Oyunçu hesabına giriş edilməyib.');
  mutation++;
  const { error } = await sb.rpc('block_user', { p_user: id, p_block: value });
  if (error) throw error;
  if (generation !== current) return;
  mutation++;
  const next = new Set(blocked);
  if (value) next.add(id); else next.delete(id);
  publish(next);
  window.dispatchEvent(new Event('source:ignore-changed'));
}
