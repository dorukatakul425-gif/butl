import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { needsRefresh } from '@/lib/player-appearance';

type RefreshEvent = { id: string; created_at: string; title?: string | null; countdown?: number | null };
const COUNTDOWN = 10;

function reloadFor(id: string) {
  try { sessionStorage.setItem('appUpdateReload', JSON.stringify({ v: id, at: Date.now() })); } catch { /* ignore */ }
  const url = new URL(window.location.href);
  url.searchParams.set('oyun-versiya', id);
  window.location.replace(url.href);
}
function recentlyReloadedFor(id: string) {
  try { const raw = sessionStorage.getItem('appUpdateReload'); return Boolean(raw && JSON.parse(raw)?.v === id); } catch { return false; }
}

export function SiteRefreshHost() {
  const { session } = useAuth();
  const [pending, setPending] = useState<RefreshEvent | null>(null);
  const [left, setLeft] = useState(COUNTDOWN);
  const [box, setBox] = useState<{ left: number; top: number; width: number } | null>(null);

  useEffect(() => {
    setPending(null);
    const sb = getSupabase();
    if (!sb || !session) return;
    const openedAt = Date.now();
    const seen = new Set<string>();
    let disposed = false, reading = false;
    const accept = (event: RefreshEvent | null) => {
      if (disposed || !needsRefresh(event, openedAt, seen) || !event) return;
      seen.add(event.id);
      if (recentlyReloadedFor(event.id)) return;
      setPending(event);
    };
    const read = async () => {
      if (disposed || reading) return;
      reading = true;
      try {
        const { data, error } = await sb.from('site_refresh_requests').select('id,created_at,title,countdown').eq('singleton', 1).maybeSingle();
        if (!error) accept(data);
      } finally { reading = false; }
    };
    const channel = sb.channel(`site-refresh:${session.user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_refresh_requests' }, event => accept(event.new as RefreshEvent))
      .subscribe(status => { if (status === 'SUBSCRIBED') void read(); });
    const timer = window.setInterval(() => { void read(); }, 10000);
    const onVisible = () => { if (document.visibilityState === 'visible') void read(); };
    window.addEventListener('online', onVisible); document.addEventListener('visibilitychange', onVisible);
    void read();
    return () => { disposed = true; window.clearInterval(timer); window.removeEventListener('online', onVisible); document.removeEventListener('visibilitychange', onVisible); void sb.removeChannel(channel); };
  }, [session?.user.id]);

  // Ureyimsen app-update.js: 10 saniyəlik geri sayım, gizli tabda görünənə qədər gözləyir.
  useEffect(() => {
    if (!pending) return;
    let count = Math.min(300, Math.max(3, Number(pending.countdown) || COUNTDOWN)), timer = 0;
    const start = () => {
      setLeft(count);
      timer = window.setInterval(() => {
        count -= 1;
        if (count <= 0) { window.clearInterval(timer); reloadFor(pending.id); return; }
        setLeft(count);
      }, 1000);
    };
    const onVisible = () => { if (!document.hidden) { document.removeEventListener('visibilitychange', onVisible); start(); } };
    if (document.hidden) document.addEventListener('visibilitychange', onVisible); else start();
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [pending]);

  // Söhbət panelinin sol yuxarı küncünə yapışdır.
  useEffect(() => {
    if (!pending) return;
    let raf = 0;
    const place = () => {
      const chat = document.querySelector<HTMLElement>('.original-chat');
      const r = chat?.getBoundingClientRect();
      setBox(prev => {
        const next = r && r.width > 0 && r.height > 0 ? { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width) } : null;
        return prev?.left === next?.left && prev?.top === next?.top && prev?.width === next?.width ? prev : next;
      });
      raf = window.requestAnimationFrame(place);
    };
    place();
    return () => window.cancelAnimationFrame(raf);
  }, [pending]);

  if (!pending || typeof document === 'undefined') return null;
  const total = Math.min(300, Math.max(3, Number(pending.countdown) || COUNTDOWN));
  const style = box
    ? { left: box.left + 8, top: box.top + 8, width: Math.min(420, box.width - 16) }
    : undefined;
  return createPortal(
    <div id="app-update-banner" role="status" className={`app-update-banner${box ? ' app-update-banner--chat' : ''}`} style={style}>
      <div className="app-update-banner__icon" aria-hidden>✨</div>
      <div className="app-update-banner__text">
        <div className="app-update-banner__title">{pending.title?.trim() || 'Yeni versiya hazırdır'}</div>
        <div className="app-update-banner__body">{left} saniyə sonra yenilənəcək</div>
      </div>
      <button type="button" className="app-update-banner__now" onClick={() => reloadFor(pending.id)}>İndi yenilə</button>
      <i className="app-update-banner__bar" style={{ width: `${(Math.max(0, left - 1) / total) * 100}%` }} />
    </div>,
    document.body,
  );
}
