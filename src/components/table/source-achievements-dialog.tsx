import { gameError } from '@/lib/game-language';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { dialogImage, type CilizAchievement, type CilizAssets } from '@/lib/ciliz-assets';
import { Button } from '@/components/ui/button';
import { acknowledgeAchievement, useAchievementSession, type CompletedAchievement } from '@/lib/achievement-session';
import { toast } from 'sonner';
import { getSupabase } from '@/lib/supabase';

/** Source TranslatorTemplate: %N args, %b(male|female), %N`d(...)` treated as plain arg. */
function tr(assets: CilizAssets, key: string, ...args: Array<string | number | boolean>) {
  const tmpl = assets.translation[key] ?? key;
  return tmpl.replace(/%(\d*)(?:([bd])\(([^)]*)\))?/g, (_m, i: string, kind?: string, opts?: string) => {
    const arg = args[Number(i) || 0];
    if (kind === 'b') return (opts ?? '').split('|')[arg ? 0 : 1] ?? '';
    if (kind === 'd') return (opts ?? '').split('|')[0] ?? '';
    return arg === undefined ? '' : String(arg);
  });
}
const STAR_PAD: Record<number, number> = { 3: 3, 5: 2, 7: 1 };

interface ViewItem {
  id: string; asset: CilizAchievement; level: number; maxLevel: number; disabled: boolean;
  name: string; image: string; term: string;
}

function select(v: CilizAchievement['image'], male: boolean, a: CilizAchievement, level: number) {
  let value = v ?? (male ? a.image_male : a.image_female);
  if (Array.isArray(value)) value = value[Math.max(level, 0)];
  return value ?? '';
}

export function buildItems(assets: CilizAssets, male: boolean, completed: CompletedAchievement[] = []): ViewItem[] {
  const now = Date.now();
  return Object.entries(assets.achievements ?? {})
    .filter(([id, a]) => a.since_ms === undefined || a.since_ms <= now || completed.some(row => row.achievement_id === id))
    .map(([id, a]) => {
      const verifiedLevel = completed.filter(row => row.achievement_id === id).reduce((max, row) => Math.max(max, row.level), -1);
      const maxLevel = a.counters?.length ?? 1;
      const level = Math.max(0, Math.min(verifiedLevel, maxLevel - 1));
      const nameKey = a.name_depends_on_level ? `achievement:${id}:name:${level}` : `achievement:${id}:name`;
      let counter = a.counters?.[verifiedLevel >= 0 && level < maxLevel - 1 ? level + 1 : level];
      if (a.translate_counters && typeof counter === 'string') counter = tr(assets, counter);
      const term = a.counters ? tr(assets, `achievement:${id}:terms`, counter ?? '') : tr(assets, `achievement:${id}:terms`);
      return { id, asset: a, level, maxLevel, disabled: verifiedLevel < 0, name: tr(assets, nameKey, male), image: select(a.image, male, a, level), term };
    });
}

function Stars({ item }: { item: ViewItem }) {
  const pad = STAR_PAD[item.maxLevel] ?? 0;
  return <div className="achievement-item__stars">{Array.from({ length: item.maxLevel }, (_, i) =>
    <div key={i} className={`achievement-item__star achievement-item__star--${i + pad}${i <= item.level && !item.disabled ? ' achievement-item__star--active' : ''}`} />)}</div>;
}

function useEscape(onClose: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onClose(); } };
    document.addEventListener('keydown', key, true);
    return () => document.removeEventListener('keydown', key, true);
  }, [onClose, enabled]);
}

function Detail({ assets, item, onClose, completion = false, pending = false, owner }: { assets: CilizAssets; item: ViewItem; onClose: () => void; completion?: boolean; pending?: boolean; owner?: { name: string; male: boolean } | undefined }) {
  useEscape(onClose);
  const img = dialogImage(assets, item.image, 103, 103);
  const termDisabled = !completion && (item.disabled || item.level < item.maxLevel - 1);
  const done = !item.disabled && item.level === item.maxLevel - 1;
  const subtitle = completion ? tr(assets, 'achievement:congratulation2')
    : !owner ? tr(assets, done ? 'achievement:term:completed:host' : 'achievement:info2')
    : item.disabled ? tr(assets, 'achievement:term:locked', owner.male)
    : done ? tr(assets, 'achievement:term:completed', owner.male) : tr(assets, 'achievement:term:progress');
  return <div className="achievement-detail-layer">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-label={tr(assets, completion ? 'dlg:kiss_bonus:title' : 'dlg:achievement:info_title')} className="popup popup--center">
      {!completion && <Button variant="ghost" type="button" className="popup__close popup__close--dlg" aria-label="Bağla" onClick={onClose}><span className="popup__close-icon" /></Button>}
      <header className="popup__header"><div className="popup__title">{tr(assets, completion ? 'dlg:kiss_bonus:title' : 'dlg:achievement:info_title')}</div></header>
      <div className="popup__content"><div className="achievement">
        <div className="achievement__subtitle">{owner && !completion && <span className="achievement__username">{owner.name}</span>}{subtitle}</div>
        <div className="achievement-item achievement-item--big">
          <Stars item={item} />
          <div className="achievement-item__icons">
            {completion && <div className="achievement__background" />}
            <img className={`achievement-item__image${item.disabled ? ' achievement-item__image--disabled' : ''}`} src={img.src} width={img.width} height={img.height} alt="" />
          </div>
        </div>
        <div className="achievement__name">{item.name}</div>
        <div className={`achievement__term${termDisabled ? ' achievement__term--disabled' : ''}`}><div className="achievement__term-icon" />{item.term}</div>
      </div></div>
      {completion ? <div className="popup__buttons"><Button disabled={pending} className="achievement-continue" onClick={onClose}>{tr(assets, 'dlg:achievement:btn_continue')}</Button></div> : <div className="popup__footer" />}
    </section>
  </div>;
}

/** Source AchievementsListDialog + AchievementPresenter.showList for the viewer. */
export function SourceAchievementsDialog({ onClose, male = true, user }: { onClose: () => void; male?: boolean; user?: { id: string; name: string; male: boolean } | undefined }) {
  const assets = useCilizAssets();
  const own = useAchievementSession();
  const [other, setOther] = useState<CompletedAchievement[]>([]);
  useEffect(() => {
    const sb = getSupabase();
    if (!user || !sb) return;
    let alive = true;
    let request = 0;
    let debounce: ReturnType<typeof setTimeout> | undefined;
    setOther([]);
    const load = async () => {
      const version = ++request;
      const { data, error } = await sb.rpc('user_achievements', { p_user: user.id });
      if (alive && version === request && !error) setOther(((data ?? []) as Array<{ achievement_id: string; level: number }>).map(r => ({ achievement_id: r.achievement_id, level: r.level, acknowledged_at: null })));
    };
    void load();
    const refresh = () => { clearTimeout(debounce); debounce = setTimeout(() => void load(), 120); };
    const channel = sb.channel(`other-achievements-${user.id}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, refresh)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gift_events' }, refresh)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gesture_events' }, refresh)
      .subscribe();
    const timer = window.setInterval(() => void load(), 10000);
    return () => { alive = false; clearTimeout(debounce); window.clearInterval(timer); void sb.removeChannel(channel); };
  }, [user?.id]);
  const session = user ? { completed: other } : own;
  if (user) male = user.male;
  const [tab, setTab] = useState<'enabled' | 'disabled'>('enabled');
  const [open, setOpen] = useState<ViewItem | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => assets ? buildItems(assets, male, session.completed) : [], [assets, male, session.completed]);
  const total = useMemo(() => items.reduce((acc, item) => acc + item.maxLevel, 0), [items]);
  const ordered = useMemo(() => {
    const done = items.filter(f => !f.disabled && f.level === f.maxLevel - 1);
    const progress = items.filter(f => !f.disabled && f.level < f.maxLevel - 1);
    const locked = items.filter(f => f.disabled);
    return tab === 'enabled' ? [...done, ...progress, ...locked] : [...locked, ...progress, ...done];
  }, [items, tab]);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [tab]);
  useEscape(onClose, !open);
  if (!assets) return null;
  const current = items.reduce((acc, a) => acc + (a.disabled ? 0 : Math.max(0, a.level) + 1), 0);
  const title = user ? tr(assets, 'dlg:finished_achievements:other:title', user.name) : tr(assets, 'dlg:finished_achievements:title');
  const portrait = typeof window === 'undefined' || window.innerHeight >= window.innerWidth;
  return createPortal(<div className={`achievements-layer ${portrait ? 'portrait' : 'landscape'}`}>
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal={!open} aria-label={title} inert={Boolean(open)} className="popup popup--center achievements-list__x_popup">
      <button type="button" className="popup__close popup__close--dlg" aria-label="Bağla" onClick={onClose}><span className="popup__close-icon" /></button>
      <header className="popup__header achievements-list__x_popup__header">
        <div className="popup__title achievements-list__x_popup__title">{title}<div className="achievements-list__title-star" />{current}/{total}</div>
        <div className="achievements-list__sort">
          <div className="achievements-list__tabs-title">{tr(assets, 'dlg:achievements:sort_title')}</div>
          <div className="achievements-list__tabs">
            <div role="button" tabIndex={0} className={`achievements-list__tab${tab === 'enabled' ? ' achievements-list__tab--active' : ''}`} onClick={() => setTab('enabled')}>{tr(assets, 'dlg:achievements:completed')}</div>
            <div role="button" tabIndex={0} className={`achievements-list__tab${tab === 'disabled' ? ' achievements-list__tab--active' : ''}`} onClick={() => setTab('disabled')}>{tr(assets, 'dlg:achievements:locked')}</div>
          </div>
        </div>
      </header>
      <div ref={contentRef} className="popup__content popup__content--no-padding"><div className="achievements-list">
        {ordered.map(item => {
          const img = dialogImage(assets, item.image, 78, 78);
          return <button type="button" key={item.id} className={`achievements-list__item js-${item.id}`} title={item.name} onClick={() => setOpen(item)}>
            <div className="achievement-item"><Stars item={item} />
              <div className="achievement-item__icons"><img className={`achievement-item__image achievement-item__image--medium${item.disabled ? ' achievement-item__image--disabled' : ''}`} src={img.src} width={img.width} height={img.height} alt={item.name} loading="lazy" /></div>
            </div>
          </button>;
        })}
      </div></div>
    </section>
    {open && <Detail assets={assets} item={items.find(item => item.id === open.id) ?? open} owner={user} onClose={() => setOpen(null)} />}
  </div>, document.body);
}

/** Mounted at the table, so earned achievements appear even while the list is closed. */
export function SourceAchievementNotifications({ male = true }: { male?: boolean }) {
  const assets = useCilizAssets();
  const session = useAchievementSession();
  const [pending, setPending] = useState(false);
  const next = session.completed.find(row => !row.acknowledged_at);
  if (!assets || !session.verified || !next) return null;
  const item = buildItems(assets, male, [next]).find(row => row.id === next.achievement_id);
  if (!item) return null;
  const counter = item.asset.counters?.[next.level];
  item.term = tr(assets, `achievement:${item.id}:terms`, counter ?? '');
  const close = async () => {
    if (pending) return;
    setPending(true);
    try { await acknowledgeAchievement(next.achievement_id, next.level); }
    catch (e) { toast.error(gameError(e)); }
    finally { setPending(false); }
  };
  return createPortal(<div className="achievements-layer"><Detail assets={assets} item={item} completion pending={pending} onClose={() => { void close(); }} /></div>, document.body);
}
