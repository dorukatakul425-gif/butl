// Lovable Cloud adapter for the source feature dialogs (currently: change table).
import { attachSourceFeatureSession, type SourceFeatureSnapshot, type SourceTableEntry } from './source-feature-session';
import { getSupabase } from './supabase';

let snapshot: SourceFeatureSnapshot = { viewerId: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let tableRead = 0;

async function refreshTables() {
  const sb = getSupabase();
  if (!sb) return;
  const read = ++tableRead;
  const { data, error } = await sb.rpc('list_tables');
  if (error || read !== tableRead) return;
  const history: SourceTableEntry[] = ((data ?? []) as Array<{ room_id: number; men: number; women: number; bottle: string; is_current: boolean }>).map((r) => ({
    id: String(r.room_id), bottle: r.bottle || 'standart', men: r.men, women: r.women, ...(r.is_current ? { current: true } : {}),
  }));
  snapshot = { ...snapshot, tables: { friends: [], history, canViewById: true } };
  emit();
}

export function installCloudFeatureSession(viewerId: string, rejoin: (membership: { room_id: number; seat: number }) => Promise<unknown>) {
  snapshot = { viewerId, tables: { friends: [], history: [], canViewById: true } };
  attachSourceFeatureSession({
    getSnapshot: () => snapshot,
    subscribe: (l) => { listeners.add(l); return () => { listeners.delete(l); }; },
    execute: async (action, input) => {
      const sb = getSupabase();
      if (!sb) return { confirmed: false, message: 'Server bağlantısı yoxdur.' };
      if (action !== 'change-table') return { confirmed: false };
      const tableId = input?.['tableId'];
      if (tableId !== undefined && snapshot.tables?.history.find((h) => h.id === String(tableId))?.current) return { confirmed: true };
      const { data, error } = await sb.rpc('change_table', tableId !== undefined ? { p_room: Number(tableId) } : {});
      if (error) return { confirmed: false, message: error.message };
      const membership = Array.isArray(data) ? data[0] : null;
      if (!membership) return { confirmed: false, message: 'Masaya qoşulmaq olmadı.' };
      await rejoin({ room_id: Number(membership.room_id), seat: Number(membership.seat) });
      await refreshTables();
      return { confirmed: true };
    },
  });
  void refreshTables();
  // Live men/women counts: any seat change anywhere refreshes the list.
  const sb = getSupabase();
  if (sb && !liveChannel) {
    let t: ReturnType<typeof setTimeout> | undefined;
    liveChannel = sb.channel('tables-live').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_players' }, () => {
      clearTimeout(t); t = setTimeout(() => void refreshTables(), 300);
    }).on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'room_players' }, () => {
      clearTimeout(t); t = setTimeout(() => void refreshTables(), 300);
    }).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms' }, (p) => {
      const n = p.new as { id?: number; bottle?: string };
      if (snapshot.tables?.history.some((h) => h.id === String(n.id) && h.bottle !== n.bottle)) { clearTimeout(t); t = setTimeout(() => void refreshTables(), 300); }
    }).subscribe();
  }
}
let liveChannel: ReturnType<NonNullable<ReturnType<typeof getSupabase>>['channel']> | null = null;
