import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { dialogImage, type CilizAchievement, type CilizAssets } from '@/lib/ciliz-assets';

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

/** No verified achievement records exist for this account yet: every item is the source "disabled" (locked) view. */
function buildItems(assets: CilizAssets, male: boolean): ViewItem[] {
  const now = Date.now();
  return Object.entries(assets.achievements ?? {})
    .filter(([, a]) => a.since_ms === undefined || a.since_ms <= now)
    .map(([id, a]) => {
      const level = 0;
      const nameKey = a.name_depends_on_level ? `achievement:${id}:name:${level}` : `achievement:${id}:name`;
      let counter = a.counters?.[level];
      if (a.translate_counters && typeof counter === 'string') counter = tr(assets, counter);
      const term = a.counters ? tr(assets, `achievement:${id}:terms`, counter ?? '') : tr(assets, `achievement:${id}:terms`);
      return { id, asset: a, level, maxLevel: a.counters?.length ?? 0, disabled: true, name: tr(assets, nameKey, male), image: select(a.image, male, a, level), term };
    });
}

function Stars({ item }: { item: ViewItem }) {
  const pad = STAR_PAD[item.maxLevel] ?? 0;
  return <div className="achievement-item__stars">{Array.from({ length: item.maxLevel }, (_, i) =>
    <div key={i} className={`achievement-item__star achievement-item__star--${i + pad}${i <= item.level && !item.disabled ? ' achievement-item__star--active' : ''}`} />)}</div>;
}

function useEscape(onClose: () => void) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onClose(); } };
    document.addEventListener('keydown', key, true);
    return () => document.removeEventListener('keydown', key, true);
  }, [onClose]);
}

function Detail({ assets, item, onClose }: { assets: CilizAssets; item: ViewItem; onClose: () => void }) {
  useEscape(onClose);
  const img = dialogImage(assets, item.image, 103, 103);
  const termDisabled = item.disabled || item.level < item.maxLevel - 1;
  return <div className="achievement-detail-layer">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-label={tr(assets, 'dlg:achievement:info_title')} className="popup popup--center">
      <button type="button" className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></button>
      <header className="popup__header"><div className="popup__title">{tr(assets, 'dlg:achievement:info_title')}</div></header>
      <div className="popup__content"><div className="achievement">
        <div className="achievement__subtitle">{tr(assets, 'achievement:info2')}</div>
        <div className="achievement-item achievement-item--big">
          <Stars item={item} />
          <div className="achievement-item__icons">
            <img className={`achievement-item__image${item.disabled ? ' achievement-item__image--disabled' : ''}`} src={img.src} width={img.width} height={img.height} alt="" />
          </div>
        </div>
        <div className="achievement__name">{item.name}</div>
        <div className={`achievement__term${termDisabled ? ' achievement__term--disabled' : ''}`}><div className="achievement__term-icon" />{item.term}</div>
      </div></div>
      <div className="popup__footer" />
    </section>
  </div>;
}

/** Source AchievementsListDialog + AchievementPresenter.showList for the viewer. */
export function SourceAchievementsDialog({ onClose, male = true }: { onClose: () => void; male?: boolean }) {
  const assets = useCilizAssets();
  const [tab, setTab] = useState<'enabled' | 'disabled'>('enabled');
  const [open, setOpen] = useState<ViewItem | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => assets ? buildItems(assets, male) : [], [assets, male]);
  const total = useMemo(() => Object.values(assets?.achievements ?? {}).reduce((acc, a) =>
    a.since_ms && a.since_ms > Date.now() ? acc : acc + (a.counters ? a.counters.length : 1), 0), [assets]);
  const ordered = useMemo(() => {
    const done = items.filter(f => !f.disabled && f.level === f.maxLevel - 1);
    const progress = items.filter(f => !f.disabled && f.level < f.maxLevel - 1);
    const locked = items.filter(f => f.disabled);
    return tab === 'enabled' ? [...done, ...progress, ...locked] : [...locked, ...progress, ...done];
  }, [items, tab]);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [tab]);
  useEscape(open ? () => {} : onClose);
  if (!assets) return null;
  const current = items.reduce((acc, a) => acc + (a.disabled ? 0 : Math.max(0, a.level) + 1), 0);
  const portrait = typeof window === 'undefined' || window.innerHeight >= window.innerWidth;
  return createPortal(<div className={`achievements-layer ${portrait ? 'portrait' : 'landscape'}`}>
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal={!open} aria-label={tr(assets, 'dlg:finished_achievements:title')} inert={Boolean(open)} className="popup popup--center achievements-list__x_popup">
      <button type="button" className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></button>
      <header className="popup__header achievements-list__x_popup__header">
        <div className="popup__title achievements-list__x_popup__title">{tr(assets, 'dlg:finished_achievements:title')}<div className="achievements-list__title-star" />{current}/{total}</div>
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
    {open && <Detail assets={assets} item={open} onClose={() => setOpen(null)} />}
  </div>, document.body);
}
