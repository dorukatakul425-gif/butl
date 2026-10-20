import { useEffect, useState } from 'react';
import { backgrounds, fonts, setChatPreferences, useChatPreferences } from '@/lib/chat-preferences';
import { getSupabase } from '@/lib/supabase';
import { setUserBlocked, useBlockedUsers } from '@/lib/block-session';
import { showSourceToast } from '@/components/source-dialogs';
import type { SettingsItem } from './settings-items';

export function useGameSettings(viewerId: string | null, open: boolean) {
  const preferences = useChatPreferences();
  const blocked = useBlockedUsers();
  const [frozen, setFrozen] = useState(false);
  const [busy, setBusy] = useState(true);
  const [names, setNames] = useState<Record<string, string>>({});
  const [child, setChild] = useState<'background' | 'font' | 'blocks' | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const fail = (e: unknown) => showSourceToast(e instanceof Error ? e.message : 'Əməliyyat alınmadı');
  useEffect(() => {
    let alive = true;
    setBusy(true);
    if (open && viewerId) void getSupabase()?.from('profiles').select('freeze_kiss_ranking').eq('id', viewerId).single().then(({ data, error }) => {
      if (!alive) return;
      if (error) { fail(error); return; }
      setFrozen(Boolean(data?.freeze_kiss_ranking)); setBusy(false);
    });
    return () => { alive = false; };
  }, [open, viewerId]);
  useEffect(() => {
    let alive = true;
    const ids = [...blocked];
    if (child === 'blocks' && ids.length) void getSupabase()?.from('profiles').select('id,name').in('id', ids).then(({ data, error }) => {
      if (!alive) return;
      if (error) fail(error);
      else setNames(Object.fromEntries((data ?? []).map(p => [p.id, p.name])));
    });
    return () => { alive = false; };
  }, [blocked, child]);
  const items: SettingsItem[] = [
    { type: 'simple', icon: 'chatbg', name: 'Çat fonu', action: () => setChild('background') },
    { type: 'simple', icon: 'chatfont', name: 'Çat şrifti', action: () => setChild('font') },
    { type: 'checkbox', icon: 'premiumfx', name: 'Premium hədiyyə effektləri', enabled: preferences.premium, onChange: premium => setChatPreferences({ premium }) },
    { type: 'checkbox', icon: 'chatgestures', name: 'Çatda smayliklər', enabled: preferences.smileys, onChange: smileys => setChatPreferences({ smileys }) },
  ];
  const tail: SettingsItem[] = [
    { type: 'checkbox', icon: 'kissfreeze', name: 'Öpüş liderliyini dondur', enabled: frozen, busy, onChange: value => {
      const sb = getSupabase(); if (!sb || !viewerId) return;
      setBusy(true);
      void sb.rpc('set_kiss_ranking_frozen', { p_frozen: value }).then(({ error }) => { if (error) fail(error); else setFrozen(value); setBusy(false); });
    } },
    { type: 'simple', icon: 'blocklist', name: 'Bloklanmış oyunçular', action: () => setChild('blocks') },
    { type: 'link', icon: 'admincontact', name: 'Adminlə əlaqə', href: 'https://t.me/cilizbot' },
    { type: 'simple', icon: 'exit', name: 'Başqa cihazlardan çıx', action: () => {
      if (!window.confirm('Bu hesabla başqa telefon / kompüterdə girən hamı çıxarılsın? Siz burada qalırsınız.')) return;
      const sb = getSupabase(); if (!sb) return;
      void sb.auth.signOut({ scope: 'others' }).then(({ error }) => { if (error) fail(error); else showSourceToast('Başqa cihazlardan çıxıldı'); });
    } },
  ];
  const childTitle = child === 'background' ? 'Çat fonu' : child === 'font' ? 'Çat şrifti' : 'Bloklanmış oyunçular';
  const content = child === 'blocks' ? <div>{!blocked.size && <p>Bloklanmış oyunçu yoxdur</p>}{[...blocked].map(id => <div key={id} className="settings__item"><span>{names[id] ?? id}</span><button disabled={pending !== null} onClick={() => { setPending(id); void setUserBlocked(id, false).catch(fail).finally(() => setPending(null)); }}>Blokdan çıxar</button></div>)}</div> : <div className="settings">{(child === 'background' ? backgrounds : fonts).map((value, i) => <button key={value} className="settings__item settings__item--selectable" aria-pressed={(child === 'background' ? preferences.background : preferences.font) === value} style={child === 'background' ? { background: value === 'default' ? undefined : value } : { fontFamily: value }} onClick={() => setChatPreferences(child === 'background' ? { background: value } : { font: value })}>{i === 0 ? 'Standart' : child === 'background' ? ['','Krem','Yaşıl','Mavi'][i] : ['','Arial','Georgia','Monospace'][i]}{(child === 'background' ? preferences.background : preferences.font) === value ? ' ✓' : ''}</button>)}</div>;
  return { items, tail, child, setChild, childTitle, content };
}
