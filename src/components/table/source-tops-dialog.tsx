import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { translate } from '@/lib/ciliz-assets';
import { SourceTopsHelp } from './source-tops-help';
import { getSupabase } from '@/lib/supabase';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';

const sections = [
  { id: 'total_kisses', title: 'dlg:top:title', statistic: 'kisses' },
  { id: 'dj_score', title: 'dlg:top:title:dj', statistic: null },
  { id: 'price', title: 'dlg:top:title:price', statistic: null },
  { id: 'harem_price', title: 'dlg:top:title:harem_price', statistic: null },
  { id: 'gestures', title: 'dlg:top:title:gestures', statistic: 'gestures' },
] as const;
type Row = { id: string; name: string; photo: string; kisses: number; gestures: number };

export function SourceTopsDialog({ onClose }: { onClose: () => void }) {
  const assets = useCilizAssets();
  const [viewerId, setViewerId] = useState<string | undefined>();
  const [section, setSection] = useState<(typeof sections)[number]>(sections[0]);
  const [period, setPeriod] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [notice, setNotice] = useState<string | null>('Yükleniyor…');
  // Server-ranked, refreshed live while the dialog is open.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || section.statistic === null) return;
    if (section.statistic === 'kisses' && period) return;
    let alive = true;
    const load = async () => {
      const [{ data: u }, { data, error }] = await Promise.all([sb.auth.getUser(), sb.rpc('top_players', { p_section: section.id, p_period: period })]);
      if (!alive) return;
      setViewerId(u.user?.id);
      if (error) { setNotice('Puanlar yüklenemedi.'); return; }
      const stat = section.statistic;
      setRows((data ?? []).map((r: { id: string; name: string; photo_url: string | null; score: number }) => ({ id: r.id, name: r.name, photo: r.photo_url || DEFAULT_PHOTO, kisses: stat === 'kisses' ? Number(r.score) : 0, gestures: stat === 'gestures' ? Number(r.score) : 0 })));
      setNotice((data ?? []).length ? null : 'Henüz kayıt yok.');
    };
    setNotice('Yükleniyor…'); void load();
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
  const supported = section.statistic === 'gestures' || (section.statistic === 'kisses' && !period);
  const statistic = section.statistic ?? 'kisses';
  const ranked = [...rows].sort((a, b) => b[statistic] - a[statistic] || a.id.localeCompare(b.id));
  const visible = ranked.slice(0, 50);
  const self = ranked.find(row => row.id === viewerId);
  if (self && !visible.includes(self)) visible.push(self);
  return createPortal(<div className="source-tops-layer">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal={!help} inert={help} aria-label="Puanlar" className="popup popup--center top-dlg__x_popup">
      <header className="popup__header top-dlg__x_popup__header">
        <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Puanları kapat" onClick={onClose}><span className="top-dlg__x_popup__close-icon" /></Button>
        <Button variant="ghost" className="top-dlg__help" aria-label="Puan bilgisi" aria-haspopup="dialog" onClick={() => setHelp(true)}><span className="top-dlg__help-icon" /></Button>
        <div className="top-dlg__tabs" role="tablist" aria-label="Puan türü">{sections.map(item => <Button key={item.id} variant="ghost" role="tab" aria-selected={section.id === item.id} aria-label={translate(assets, item.title)} title={translate(assets, item.title)} className={`top-dlg__tab top-dlg__tab--${item.id}${section.id !== item.id ? ` top-dlg__tab--${item.id}-inactive` : ''}`} onClick={() => { setSection(item); setPeriod(''); setHelp(false); }} />)}</div>
        <div className="top-dlg__desc"><span className="top-dlg__title">{translate(assets, section.title)}</span>{!['price', 'harem_price'].includes(section.id) && <select aria-label="Puan dönemi" className="top-dlg__period" value={period} onChange={event => setPeriod(event.target.value)}>{['', 'monthly', 'weekly', 'daily'].map(value => <option key={value} value={value}>{translate(assets, `dlg:top:${value || 'absolute'}`)}</option>)}</select>}</div>
      </header>
      <div className="top-dlg__content top-dlg__bg">
        {!supported ? <p className="source-tops-notice" role="status">Bu puan türü veya dönem için doğrulanmış kayıt bulunmuyor.</p> : notice ? <p className="source-tops-notice" role="status">{notice}</p> : visible.map(row => <div key={row.id} className={`top-dlg__item${row.id === viewerId ? ' top-dlg__item--sticked' : ''}`}>
          <img className="top-dlg__photo" src={row.photo} alt={row.name} />
          <div className={`top-dlg__user-info${row.id === viewerId ? ' top-dlg__user-info--viewer' : ''}`}><span className="top-dlg__rank">{ranked.indexOf(row) + 1}. </span><span className="top-dlg__name">{row.name}</span><span className={`top-dlg__icon top-dlg__icon--${section.id}`} /><span className={`top-dlg__score top-dlg__score--${section.id}`}>{row[statistic].toLocaleString('tr-TR')}</span></div>
        </div>)}
      </div>
    </section>
    {help && <SourceTopsHelp category={section.id} assets={assets} onClose={() => setHelp(false)} />}
  </div>, document.body);
}
