import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { SourceButtons, OPEN_VIP_EVENT } from '@/components/source-dialogs';
import { SourceFeaturePopup } from '@/components/table/source-feature-popup';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';
import { executeSourceFeature, useSourceFeatureSession } from '@/lib/source-feature-session';
import type { SeatPlayer } from '@/components/table/table-seats';

/** Original KickoutPresenter presentation; unknown prices never become free actions. */
export function SourceKickoutDialog({ player, self, assets, onClose, onConfirmed }: {
  player: SeatPlayer; self: boolean; assets: CilizAssets; onClose: () => void; onConfirmed: () => void;
}) {
  const session = useSourceFeatureSession();
  const [help, setHelp] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const inFlight = useRef(false);
  const t = (key: string, ...args: string[]) => translate(assets, key, ...args);
  const state = player.id ? session.kickout?.targets[player.id] : undefined;
  const type = state?.kickAt ? 'save' : 'kick';
  const permitted = Boolean(session.kickout && state && (session.kickout.vip || (self && type === 'save')));
  const description = self ? t(type === 'save' ? 'kickout:defend' : 'kickout:desc') : t(type === 'save' ? 'kickout:save' : 'kickout:kick', player.name, '30', '15');
  const text = (value: string) => value.replace(/<\/?styled>/g, '').replace(/<\/?b>/g, '').replace(/%\d+d\(([^|]+)\|[^)]+\)/g, '$1');
  const act = async () => {
    if (!permitted || !player.id || inFlight.current || (self && type === 'kick')) return;
    inFlight.current = true; setBusy(true); setMessage('');
    try {
      const result = await executeSourceFeature(type === 'kick' ? 'user-kick' : 'user-save', { userId: player.id, expectedPrice: session.kickout?.price ?? 0, referrer: 'profile' });
      if (result.confirmed) onConfirmed(); else setMessage(result.message ?? t('kickout:toast4'));
    } catch { setMessage(t('kickout:toast4')); }
    finally { inFlight.current = false; setBusy(false); }
  };
  return createPortal(<>
    <SourceFeaturePopup title={t('kickout:header')} onClose={onClose} help={() => setHelp(true)} inactive={help} className="source-kickout-popup" footer={<SourceButtons
      cancel={{ title: t('kickout:btn_cancel'), onClick: onClose }}
      confirm={permitted ? { title: t(self ? type === 'save' ? 'kickout:btn_defend' : 'kickout:btn_ok' : type === 'save' ? 'kickout:btn_save' : 'kickout:btn_kick'), enabled: !busy, onClick: self && type === 'kick' ? onClose : () => void act() } : undefined}
      info={session.kickout && !session.kickout.vip && !(self && type === 'save') ? { title: t('kickout:btn_know'), onClick: () => window.dispatchEvent(new Event(OPEN_VIP_EVENT)) } : undefined}
    />}>
      <div className="kickout"><div className="kickout__user">
        {!(self && type === 'kick') && <div className="kickout__photo"><img src={player.photoUrl} alt={player.name} /><div className={`kickout__icon kickout__icon--${type}`} /></div>}
        <div className={`kickout__description${self && type === 'kick' ? ' kickout__description--center' : ''}`}>{text(description)}</div>
      </div>
      {type === 'kick' && !self && <div className="kickout__warning">{t('kickout:warning')}</div>}
      {session.kickout ? <div className="kickout__price-info"><div className="kickout__price-info-text">{text(t(!session.kickout.vip && !(self && type === 'save') ? self ? 'kickout:vip3' : 'kickout:vip1' : session.kickout.price ? 'kickout:price' : 'kickout:free'))}</div>
        {permitted && session.kickout.price > 0 && <div className="kickout__price">{session.kickout.price}</div>}</div>
       : <div className="source-feature-message" role="status">Şutla ve Koru hizmeti bağlı değil; ücret ve koruma süresi doğrulanamadı.</div>}
      {message && <div className="source-feature-message" role="status">{message}</div>}
      </div>
    </SourceFeaturePopup>
    {help && <SourceFeaturePopup title={t('kickout:help:header')} onClose={() => setHelp(false)} className="source-kickout-popup" footer={<SourceButtons confirm={{ title: t('kickout:help:btn_ok'), onClick: () => setHelp(false) }} />}>
      {['kickout:help:text1', 'kickout:help:text2', 'kickout:help:text3'].map(key => <div key={key} className="source-kickout-help">{text(t(key, '30', '15'))}</div>)}
    </SourceFeaturePopup>}
  </>, document.body);
}