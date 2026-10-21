import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { translate } from '@/lib/ciliz-assets';
import { SourceTopsHelp } from './source-tops-help';
import { getSupabase } from '@/lib/supabase';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';
import { topRankingRows, type TopPlayerRow } from '@/lib/top-ranking';
import { revisionGuard } from '@/lib/live-event-guards';
import { isTelegramWebApp } from '@/lib/telegram-viewport';
import { extraScoreText } from '@/lib/top-level-activity';

// All five sections of the original TopDialog are real and server-ranked.
const sections = [
  { id: 'total_kisses', title: 'dlg:top:title' },
  { id: 'dj_score', title: 'dlg:top:title:dj' },
  { id: 'price', title: 'dlg:top:title:price' },
  { id: 'harem_price', title: 'dlg:top:title:harem_price' },
  { id: 'gestures', title: 'dlg:top:title:gestures' },
] as const;
// Telegram only (ureyimsen TopsDialog): level and activity leaders after the five original sections.
const telegramSections = [
  { id: 'glv', title: 'Səviyyə liderləri' },
  { id: 'activity', title: 'Aktivlik liderləri' },
] as const;
type Section = (typeof sections)[number] | (typeof telegramSections)[number];
const isExtra = (id: string): id is 'glv' | 'activity' => id === 'glv' || id === 'activity';
// Original dialog: price and harem_price have no period selector (absolute-only).
const PERIODLESS: ReadonlyArray<string> = ['price', 'harem_price'];
type Row = { id: string; name: string; photo: string; score: number; rank: number };

export function SourceTopsDialog({ onClose }: { onClose: () => void }) {
  const assets = useCilizAssets();
  const [viewerId, setViewerId] = useState<string | undefined>();
  const [section, setSection] = useState<Section>(sections[0]);
  const [telegram, setTelegram] = useState(false);
  useEffect(() => setTelegram(isTelegramWebApp()), []);
  const tabs: readonly Section[] = telegram ? [...sections, ...telegramSections] : sections;
  const title = (item: Section) => isExtra(item.id) ? item.title : translate(assets!, item.title);
  const [period, setPeriod] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [notice, setNotice] = useState<string | null>('Yüklənir…');
  // Server-ranked, refreshed live while the dialog is open.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let alive = true;
    const revision = revisionGuard();
    const load = async () => {
      const read = revision.next();
      const [{ data: u }, { data, error }] = await Promise.all([sb.auth.getUser(), sb.rpc(isExtra(section.id) ? 'top_players_extra' as 'top_players' : 'top_players', { p_section: section.id, p_period: period })]);
      if (!alive || !revision.current(read)) return;
      setViewerId(u.user?.id);
      if (error) { setNotice('Liderlər siyahısı yüklənmədi.'); return; }
      setRows(topRankingRows((data ?? []) as TopPlayerRow[]).map(r => ({ id: r.id, name: r.name, photo: r.photo_url || DEFAULT_PHOTO, score: r.score, rank: r.rank })));
      setNotice((data ?? []).length ? null : 'Hələ nəticə yoxdur.');
    };
    setNotice('Yüklənir…'); void load();
    const id = window.setInterval(() => void load(), 5000);
    return () => { alive = false; window.clearInterval(id); };
  }, [section, period]);
  const [help, setHelp] = useState(false);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); };
  }, []);
  if (!assets) return null;
  // Rank 0 = viewer not ranked yet (shown without a number, after the list).
  const ranked = [...rows.filter(row => row.rank > 0), ...rows.filter(row => row.rank <= 0)];
  const visible = ranked.slice(0, 50);
  const self = ranked.find(row => row.id === viewerId);
  if (self && !visible.includes(self)) visible.push(self);
  return createPortal(<div className="source-tops-layer">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal={!help} inert={help} aria-label="Liderlər" className="popup popup--center popup--show top-dlg__x_popup">
      <header className="popup__header top-dlg__x_popup__header">
        <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Liderlər siyahısını bağla" onClick={onClose}><span className="top-dlg__x_popup__close-icon" /></Button>
        <Button variant="ghost" className="top-dlg__help" aria-label="Liderlər haqqında məlumat" aria-haspopup="dialog" onClick={() => setHelp(true)}><span className="top-dlg__help-icon" /></Button>
        <div className="top-dlg__tabs" role="tablist" aria-label="Reytinq kateqoriyası">{tabs.map(item => <Button key={item.id} variant="ghost" role="tab" aria-selected={section.id === item.id} aria-label={title(item)} title={title(item)} className={`top-dlg__tab top-dlg__tab--${item.id}${section.id !== item.id ? ` top-dlg__tab--${item.id}-inactive` : ''}`} onClick={() => { setSection(item); setPeriod(''); setHelp(false); }} />)}</div>
        <div className="top-dlg__desc"><span className="top-dlg__title">{title(section)}</span>{!PERIODLESS.includes(section.id) && <select aria-label="Reytinq dövrü" className="top-dlg__period" value={period} onChange={event => setPeriod(event.target.value)}>{['', 'monthly', 'weekly', 'daily'].map(value => <option key={value} value={value}>{translate(assets, `dlg:top:${value || 'absolute'}`)}</option>)}</select>}</div>
      </header>
      <div className="top-dlg__content top-dlg__bg">
        {notice ? <p className="source-tops-notice" role="status">{notice}</p> : visible.map(row => <div key={row.id} className={`top-dlg__item${row.id === viewerId ? ' top-dlg__item--sticked' : ''}`}>
          <img className="top-dlg__photo" src={row.photo} alt={row.name} style={{ cursor: "pointer" }} onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("source:open-profile", { detail: row.id })); }} />
          <div className={`top-dlg__user-info${row.id === viewerId ? ' top-dlg__user-info--viewer' : ''}`}><span className="top-dlg__rank">{row.rank > 0 ? `${row.rank}. ` : ''}</span><span className="top-dlg__name">{row.name}</span><span className={`top-dlg__icon top-dlg__icon--${section.id}`} /><span className={`top-dlg__score top-dlg__score--${section.id}`}>{isExtra(section.id) ? extraScoreText(section.id, row.score, period) : row.score.toLocaleString('tr-TR')}</span></div>
        </div>)}
      </div>
    </section>
    {help && <SourceTopsHelp category={section.id} assets={assets} onClose={() => setHelp(false)} />}
  </div>, document.body);
}
