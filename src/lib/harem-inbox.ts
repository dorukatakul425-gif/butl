import { getSupabase } from './supabase';
import { DEFAULT_PHOTO } from './ciliz-default-photo';
import { haremNotice, type VerifiedHaremPurchase } from './source-harem';
import type { ChatUser } from './music-session';

function user(value: unknown): ChatUser | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== 'string' || !v.id || typeof v.name !== 'string' || typeof v.male !== 'boolean') return null;
  return { id: v.id, name: v.name, male: v.male, photoUrl: typeof v.photoUrl === 'string' && v.photoUrl ? v.photoUrl : DEFAULT_PHOTO };
}

/** Accept only persisted, recipient-matched server events, never ownership guesses. */
export function decodeHaremNotice(value: unknown, viewerId: string): VerifiedHaremPurchase | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  if (row.user_id !== viewerId || row.read_at != null || !row.payload || typeof row.payload !== 'object') return null;
  const id = String(row.id ?? '');
  if (!/^\d+$/.test(id) || id === '0') return null;
  const payload = row.payload as Record<string, unknown>;
  if (payload.type !== 'harem_purchase' || typeof payload.price !== 'number' || !Number.isSafeInteger(payload.price) || payload.price < 1) return null;
  const target = user(payload.target), newOwner = user(payload.newOwner), oldOwner = user(payload.oldOwner);
  if (!target || !newOwner || !oldOwner) return null;
  const purchase = { id, viewerId, target, newOwner, oldOwner, price: payload.price };
  return haremNotice(purchase) ? purchase : null;
}

export async function acknowledgeHaremNotice(id: string) {
  const sb = getSupabase();
  if (!sb) throw new Error('not_authenticated');
  const { error } = await sb.rpc('acknowledge_harem_notice', { p_id: id });
  if (error) throw error;
}

/** Subscribe before reading; recover unread rows after reconnect, tab return and lost packets. */
export function subscribeHaremInbox(viewerId: string, receive: (p: VerifiedHaremPurchase) => void, acknowledged: (id: string) => void) {
  const sb = getSupabase();
  if (!sb || !viewerId) return () => {};
  let alive = true, reading = false, retry = false;
  const deliver = (row: unknown) => {
    if (!alive) return;
    const p = decodeHaremNotice(row, viewerId);
    if (p) receive(p);
  };
  const recover = async () => {
    if (!alive) return;
    if (reading) { retry = true; return; }
    reading = true;
    try {
      let after = '0';
      while (alive) {
        const { data, error } = await sb.from('profile_notifications').select('id,user_id,payload,read_at')
          .eq('user_id', viewerId).is('read_at', null).eq('payload->>type', 'harem_purchase')
          .gt('id', after).order('id', { ascending: true }).limit(100);
        if (!alive || error || !data?.length) break;
        data.forEach(deliver);
        after = String(data[data.length - 1]?.id ?? after);
        if (data.length < 100) break;
      }
    } finally {
      reading = false;
      if (alive && retry) { retry = false; void recover(); }
    }
  };
  const channel = sb.channel(`harem-inbox:${viewerId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profile_notifications', filter: `user_id=eq.${viewerId}` }, p => deliver(p.new))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profile_notifications', filter: `user_id=eq.${viewerId}` }, p => {
      const row = p.new as { id?: number; user_id?: string; read_at?: string | null };
      if (alive && row.user_id === viewerId && row.read_at && row.id) acknowledged(String(row.id));
    })
    .subscribe(status => { if (status === 'SUBSCRIBED') void recover(); });
  void recover();
  const visible = () => { if (document.visibilityState === 'visible') void recover(); };
  document.addEventListener('visibilitychange', visible);
  const timer = window.setInterval(visible, 30000);
  return () => { alive = false; window.clearInterval(timer); document.removeEventListener('visibilitychange', visible); void sb.removeChannel(channel); };
}