import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { translate } from '@/lib/ciliz-assets';
import { executeSourceFeature, useSourceFeatureSession, type SourceTableEntry } from '@/lib/source-feature-session';
import { SourceFeaturePopup } from './source-feature-popup';

export function SourceChangeTable({ onClose }: { onClose: () => void }) {
  const assets = useCilizAssets(), session = useSourceFeatureSession();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [now, setNow] = useState(Date.now()), [tableId, setTableId] = useState('');
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  if (!assets) return null;
  const t = (key: string) => translate(assets, key);
  const change = async (id?: string) => {
    if (busy) return;
    setBusy(true); setMessage('');
    try { const result = await executeSourceFeature('change-table', id ? { tableId: id } : undefined); if (result.confirmed) onClose(); else setMessage(result.message ?? t('dlg:music:unavailable')); }
    catch (e) { setMessage(e instanceof Error ? e.message : t('dlg:music:unavailable')); }
    finally { setBusy(false); }
  };
  const row = (entry: SourceTableEntry) => {
    const seconds = Math.max(0, Math.ceil(((entry.blockedUntil ?? 0) - now) / 1000));
    const timer = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    return <Button variant="ghost" key={entry.id} className="change-table__item" disabled={busy} onClick={() => seconds ? setMessage(timer) : void change(entry.id)}>
      <span className="change-table__info">{entry.photo ? <img className="change-table__photo" src={entry.photo} alt="" /> : <span className="change-table__table-icon"><span className={`change-table__bottle change-table__bottle--${assets.bottles?.[entry.bottle] ? entry.bottle : 'standart'}`} /></span>}<span className="change-table__item-border">{entry.name ?? `#${entry.id}`}</span></span>
      <span className="change-table__stats">{seconds ? <span className="change-table__kickout-timer">{timer}</span> : <span className="change-table__stats-players"><span className="change-table__men"><span className="change-table__stats-icon change-table__stats-icon--men" />{entry.men}</span><span className="change-table__women"><span className="change-table__stats-icon change-table__stats-icon--women" />{entry.women}</span></span>}</span>
    </Button>;
  };
  return createPortal(<SourceFeaturePopup title={t('dlg:change_table:title')} onClose={onClose}>
    <div className="change-table change-table--support-borders"><Button variant="ghost" className="change-table__random-button" disabled={busy || !session.viewerId} onClick={() => void change()}>{t('dlg:change_table:btn_random2')}</Button>
      {session.tables?.canViewById && <form className="change-table__view-form" onSubmit={e => { e.preventDefault(); if (/^\d+$/.test(tableId)) void change(tableId); }}><input aria-label="Masa numarası" type="number" min="0" step="1" required value={tableId} onChange={e => setTableId(e.target.value)} /><Button variant="ghost" type="submit" disabled={busy}>{t('dlg:change_table:btn_number')}</Button></form>}
      <div className="change-table__items">{Boolean(session.tables?.friends.length) && <div className="change-table__subtitle">{t('ios:dlg:change_table:desc_friends_and_fellows')}</div>}{session.tables?.friends.map(row)}{Boolean(session.tables?.history.length) && <><div className="change-table__border" /><div className="change-table__subtitle">{t('dlg:change_table:desc_recent2')}</div>{session.tables?.history.map(row)}</>}</div>
    </div>{!session.viewerId && <div className="source-feature-message">{t('dlg:music:unavailable')}</div>}{message && <div role="status" className="source-feature-message">{message}</div>}
  </SourceFeaturePopup>, document.body);
}
