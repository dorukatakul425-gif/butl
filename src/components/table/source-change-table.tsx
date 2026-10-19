import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { translate } from '@/lib/ciliz-assets';
import { executeSourceFeature, useSourceFeatureSession, type SourceTableEntry } from '@/lib/source-feature-session';
import { SourceButtons } from '@/components/source-dialogs';
import { SourceFeaturePopup } from './source-feature-popup';

// Markup mirrors the original ChangeTableDialog (bem "change-table") from the game bundle 1:1.
const EMBEDDED_IMAGES = ['baby', 'champagne', 'champagnebot', 'cognac', 'cola', 'jackdaniels', 'ketchup', 'lemonade', 'martini', 'martinibot', 'milk', 'milkbot', 'nybottle', 'pirate', 'ship', 'skeleton', 'skewer', 'sprite', 'standart', 'vipbottle', 'vodka', 'vodkabot', 'yacht'];
const cls = (el: string, mods: string[] = []) => { const b = el ? `change-table__${el}` : 'change-table'; return [b, ...mods.filter(Boolean).map(m => `${b}--${m}`)].join(' '); };
const press = (fn: () => void) => ({ role: 'button', tabIndex: 0, onClick: fn, onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } } });
const mmss = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

function Stats({ men, women, timer }: { men: number; women: number; timer?: string | undefined }) {
  const [timerSub, setTimerSub] = useState(''), [playersSub, setPlayersSub] = useState('');
  useEffect(() => {
    if (timer === undefined) { setTimerSub(''); setPlayersSub(''); }
    else if (timer === '00:00') { setTimerSub('hide'); setPlayersSub('show'); }
    else { setTimerSub(v => v || 'show'); setPlayersSub(v => v || 'hide'); }
  }, [timer]);
  return <div className={cls('stats')}>
    {timer !== undefined && <div className={cls('kickout-timer', [timerSub])}>{timer}</div>}
    <div className={cls('stats-players', [playersSub])}>
      <div className={cls('men')}><div className={cls('stats-icon', ['men'])} />{men}</div>
      <div className={cls('women')}><div className={cls('stats-icon', ['women'])} />{women}</div>
    </div>
  </div>;
}

export function SourceChangeTable({ onClose }: { onClose: () => void }) {
  const assets = useCilizAssets(), session = useSourceFeatureSession();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [now, setNow] = useState(Date.now()), [info, setInfo] = useState<SourceTableEntry | null>(null);
  const [fullTable, setFullTable] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  if (!assets) return null;
  const t = (key: string) => translate(assets, key);
  const change = async (id?: string) => {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      const result = await executeSourceFeature('change-table', id ? { tableId: id } : undefined);
      if (result.confirmed) onClose();
      // Original GameQueuePresenter: a full table opens the "Boş yer yoxdur" popup.
      else if (result.message === 'table_full' || result.message === 'Masa dolu') setFullTable(id ?? '');
      else setMessage(result.message ?? t('dlg:music:unavailable'));
    }
    catch (e) { setMessage(e instanceof Error ? e.message : t('dlg:music:unavailable')); }
    finally { setBusy(false); }
  };
  const timerOf = (e: SourceTableEntry) => { if (!e.blockedUntil) return undefined; return mmss(Math.max(0, Math.ceil((e.blockedUntil - now) / 1000))); };
  // Original ChangeTableDialog: tapping a counting-down table opens the kickout info dialog, never a plain toast.
  const click = (e: SourceTableEntry, timer?: string) => () => { if (timer && timer !== '00:00') setInfo(e); else void change(e.id); };
  const infoDesc = (e: SourceTableEntry) => {
    const k = e.kicker;
    return translate(assets, 'kickout:info:desc', k?.name ?? '', e.id)
      .replace(/%2d\(([^|]+)\|([^)]+)\)/g, (_m, a, b) => (k?.male === false ? b : a))
      .replace(/<\/?styled>/g, '').replace(/<\/?b>/g, '');
  };
  const PlayerItem = (e: SourceTableEntry) => { const timer = timerOf(e); return <div key={`f${e.id}`} className={cls('item')} aria-label={e.name ?? `#${e.id}`} {...press(click(e, timer))}>
    <div className={cls('info')}><div className={cls('photo')} style={e.photo ? { backgroundImage: `url(${e.photo})` } : undefined} /><div className={cls('item-border')}>{e.name}</div></div>
    <Stats men={e.men} women={e.women} timer={timer} />
  </div>; };
  const TableItem = (e: SourceTableEntry) => { const timer = timerOf(e), image = EMBEDDED_IMAGES.includes(e.bottle) ? e.bottle : 'standart'; return <div key={`h${e.id}`} className={cls('item')} aria-label={`#${e.id}`} {...press(click(e, timer))}>
    <div className={cls('info')}><div className={cls('table-icon')}><div className={cls('bottle', [image])} /></div><div className={cls('item-border')}>#{e.id}</div></div>
    <Stats men={e.men} women={e.women} timer={timer} />
  </div>; };
  const friends = session.tables?.friends ?? [], tables = session.tables?.history ?? [];
  const isBrokenBorders = /Android 8\.1\.0.*Chrome\/(91|94)/.test(navigator.userAgent);
  return createPortal(<><SourceFeaturePopup title={t('dlg:change_table:title')} onClose={onClose} contentClass="popup__content--no-padding" footer={<div className="popup__footer change-table__x_popup__footer" />}>
    <div className={cls('', [isBrokenBorders ? '' : 'support-borders'])}>
      <div className={cls('random-button')} aria-disabled={busy || !session.viewerId} {...press(() => { if (session.viewerId) void change(); })}>{t('dlg:change_table:btn_random2')}</div>
      {session.tables?.canViewById && <form className={cls('view-form')} onSubmit={e => { e.preventDefault(); const v = inputRef.current?.value ?? ''; if (/^\d+$/.test(v)) void change(String(Number(v))); }}>
        <label htmlFor="table-id" className={cls('subtitle', ['input'])}>Указать стол</label>
        <div className={cls('input-line')}><input type="number" id="table-id" className={cls('input')} placeholder="Id стола" step="1" min="0" ref={inputRef} required /><span className="validity" /><input className={cls('submit')} type="submit" value="Перейти" disabled={busy} /></div>
      </form>}
      <div className={cls('items')}>
        {friends.length > 0 && <div className={cls('subtitle')}>{t('ios:dlg:change_table:desc_friends_and_fellows')}</div>}
        {friends.map(PlayerItem)}
        {friends.length > 0 && tables.length > 0 && <div className={cls('border')} />}
        {tables.length > 0 && <div className={cls('subtitle')}>{t('dlg:change_table:desc_recent2')}</div>}
        {tables.map(TableItem)}
      </div>
    </div>
    {!session.viewerId && <div className="source-feature-message">{t('dlg:music:unavailable')}</div>}{message && <div role="status" className="source-feature-message">{message}</div>}
  </SourceFeaturePopup>
  {info && <SourceFeaturePopup title={t('kickout:info:header')} onClose={() => setInfo(null)} className="source-kickout-popup" footer={<SourceButtons confirm={{ title: t('kickout:help:btn_ok'), onClick: () => setInfo(null) }} />}>
    <div className="kickout"><div className="kickout__user">
      <div className="kickout__photo">{info.kicker?.photo ? <img src={info.kicker.photo} alt={info.kicker.name} /> : null}<div className="kickout__icon kickout__icon--kicked" /></div>
      <div className="kickout__description">{infoDesc(info)}</div>
    </div>
    <div className="kickout__info"><div className="kickout__info-text">{t('kickout:info:return')}</div><div className="kickout__info-time">{Math.max(0, Math.ceil(((info.blockedUntil ?? now) - now) / 1000))}</div></div>
    </div>
  </SourceFeaturePopup>}
  {fullTable !== null && <SourceFeaturePopup title="Boş yer yoxdur" onClose={() => setFullTable(null)} className="source-kickout-popup" footer={<SourceButtons confirm={{ title: 'Başqa masa seç', onClick: () => setFullTable(null) }} />}>
    <div className="kickout"><div className="kickout__description" style={{ whiteSpace: 'pre-line' }}>
      {`Masa ${fullTable} ətrafında boş yer yoxdur.\nLütfən boş yer üçün gözlə.`}
    </div></div>
  </SourceFeaturePopup>}</>, document.body);
}
