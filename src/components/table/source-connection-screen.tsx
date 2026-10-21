import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { loadCilizAssets } from '@/lib/ciliz-assets';
import { joinRoom, useRoom } from '@/lib/room-session';
import { sourceDisconnect } from '@/lib/source-connection-artwork';

export function SourceConnectionScreen() {
  const room = useRoom();
  const [offline, setOffline] = useState(false);
  const [lost, setLost] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    let active = true;
    void loadCilizAssets().then(assets => { if (active) setTranslations(assets.translation); }, () => {});
    const off = () => setOffline(true);
    const on = () => { setOffline(false); };
    setOffline(!navigator.onLine);
    window.addEventListener('offline', off); window.addEventListener('online', on);
    return () => { active = false; window.removeEventListener('offline', off); window.removeEventListener('online', on); };
  }, []);
  const visible = offline || lost || Boolean(room.error && !room.connected);
  useEffect(() => {
    if (!visible) return;
    const previous = document.activeElement;
    dialog.current?.focus();
    const blocked: HTMLElement[] = [];
    const screen = dialog.current?.parentElement;
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('body > *'))) {
      if (element.contains(screen ?? null)) continue;
      if (!element.inert) { element.inert = true; blocked.push(element); }
    }
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); }
      if (event.key === 'Tab') { event.preventDefault(); dialog.current?.querySelector<HTMLButtonElement>('button')?.focus(); }
    };
    document.addEventListener('keydown', keyboard, true);
    return () => { blocked.forEach(element => { element.inert = false; }); document.removeEventListener('keydown', keyboard, true); if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
  }, [visible]);
  const retry = async () => {
    if (retrying || !navigator.onLine) return;
    setRetrying(true);
    try { await joinRoom(); setLost(false); } catch { setLost(true); }
    finally { setRetrying(false); }
  };
  if (!visible) return null;
  const title = translations['html:dlg:server_error:title'] ?? 'Bağlantı yoxdur';
  return <div className="source-connection-screen">
    <section ref={dialog} tabIndex={-1} role="alertdialog" aria-modal="true" aria-label={title} className="popup popup--center source-connection-popup">
      <header className="popup__header"><div className="popup__title">{title}</div></header>
      <div className="popup__content popup__content--wrap popup__content--center"><img className="source-disconnect-image" src={sourceDisconnect} alt="" /><div className="info__context">{offline ? 'İnternet bağlantısı kəsildi. Bağlantı qayıdanda masana yenidən qoşulacaqsan.' : room.error ?? 'Bağlantı kəsildi. Masana qayıtmaq üçün yenidən qoşul.'}</div></div>
      <div className="popup__buttons popup__buttons--center"><Button variant="ghost" className="button button--confirm" disabled={offline || retrying} onClick={() => void retry()}>{retrying ? 'Qoşulur…' : 'Qayıt'}</Button></div>
    </section>
  </div>;
}