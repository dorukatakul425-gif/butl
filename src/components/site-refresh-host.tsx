import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { needsRefresh } from '@/lib/player-appearance';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type RefreshEvent = { id: string; created_at: string };
export function SiteRefreshHost() {
  const { session } = useAuth();
  const [pending, setPending] = useState<RefreshEvent | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setPending(null); setOpen(false);
    const sb = getSupabase();
    if (!sb || !session) return;
    const openedAt = Date.now();
    const seen = new Set<string>();
    let disposed = false, reading = false;
    const accept = (event: RefreshEvent | null) => {
      if (disposed || !needsRefresh(event, openedAt, seen) || !event) return;
      seen.add(event.id); setPending(event); setOpen(true);
    };
    const read = async () => {
      if (disposed || reading) return;
      reading = true;
      try {
        const { data, error } = await sb.from('site_refresh_requests').select('id,created_at').eq('singleton', 1).maybeSingle();
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
  return <Dialog open={open && Boolean(pending)} onOpenChange={setOpen}>
    <DialogContent className="site-refresh-dialog">
      <DialogTitle>Yeni versiya hazırdır</DialogTitle>
      <DialogDescription>Yeni versiya hazırdır. Davam etmək üçün səhifəni yeniləyin.</DialogDescription>
      <Button onClick={() => { if (!pending) return; const url = new URL(window.location.href); url.searchParams.set('oyun-versiya', pending.id); window.location.replace(url.href); }}>İndi yenilə</Button>
    </DialogContent>
  </Dialog>;
}