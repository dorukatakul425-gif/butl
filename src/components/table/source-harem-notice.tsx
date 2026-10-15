import { useEffect, useRef, useState } from 'react';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { SourceButtons, SourceDialogLayer, showSourceToast } from '@/components/source-dialogs';
import { acknowledgeHaremPurchase, subscribeHaremPurchases } from '@/lib/game-session';
import { haremNotice, type VerifiedHaremPurchase } from '@/lib/source-harem';
import { translate } from '@/lib/ciliz-assets';
import { sourceHeart } from '@/lib/source-bonus-artwork';
import { Button } from '@/components/ui/button';

/** Original HaremPurchaseDialog, fed only by authenticated host events. */
export function SourceHaremNotice() {
  const assets = useCilizAssets();
  const [queue, setQueue] = useState<VerifiedHaremPurchase[]>([]);
  const [busy, setBusy] = useState(false);
  const seen = useRef(new Set<string>());
  useEffect(() => subscribeHaremPurchases(p => {
    if (seen.current.has(p.id) || !haremNotice(p)) return;
    seen.current.add(p.id); setQueue(q => [...q, p]);
  }), []);
  const p = queue[0]; const notice = p ? haremNotice(p) : null;
  if (!assets || !p || !notice) return null;
  const close = () => {
    if (busy) return;
    setBusy(true);
    void acknowledgeHaremPurchase(p.id).then(() => setQueue(q => q.filter(item => item.id !== p.id)), () => showSourceToast('Bildirim onaylanamadı.')).finally(() => setBusy(false));
  };
  return <SourceDialogLayer title={translate(assets, 'dlg:harem:title')} hasClose={false} onClose={close}>
    <div className="popup__content"><div className="source-harem">
      <div className="source-harem-user"><Button variant="ghost" className="source-harem-photo" aria-label={notice.user.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: notice.user.id }))}><img src={notice.user.photoUrl} alt="" /></Button><div className="source-harem-name">{notice.user.name}</div></div>
      <div className="source-harem-description">{translate(assets, notice.key, ...notice.args)} {translate(assets, 'dlg:harem:for')} <span className="source-harem-price" style={{ backgroundImage: `url(${sourceHeart})` }}>{p.price.toLocaleString('tr-TR')}</span></div>
    </div></div>
    <SourceButtons confirm={{ title: translate(assets, 'dlg:harem:btn:v2'), enabled: !busy, onClick: close }} />
  </SourceDialogLayer>;
}