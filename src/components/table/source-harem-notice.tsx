import { useEffect, useRef, useState } from 'react';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { SourceButtons, SourceDialogLayer, showSourceToast } from '@/components/source-dialogs';
import { acknowledgeHaremNotice, subscribeHaremInbox } from '@/lib/harem-inbox';
import { haremNotice, type VerifiedHaremPurchase } from '@/lib/source-harem';
import { translate } from '@/lib/ciliz-assets';
import { sourceHeart } from '@/lib/source-bonus-artwork';
import { Button } from '@/components/ui/button';
import { haremSourceText } from '@/lib/harem-source-text';

/** Original HaremPurchaseDialog, fed only by authenticated host events. */
export function SourceHaremNotice({ viewerId }: { viewerId: string }) {
  const assets = useCilizAssets();
  const [queue, setQueue] = useState<VerifiedHaremPurchase[]>([]);
  const [busy, setBusy] = useState(false);
  const seen = useRef(new Set<string>());
  useEffect(() => {
    seen.current.clear(); setQueue([]); setBusy(false);
    return subscribeHaremInbox(viewerId, p => {
      if (seen.current.has(p.id)) return;
      seen.current.add(p.id);
      setQueue(q => [...q, p].sort((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id)));
    }, id => { seen.current.add(id); setQueue(q => q.filter(item => item.id !== id)); });
  }, [viewerId]);
  const p = queue[0]; const notice = p ? haremNotice(p) : null;
  if (!assets || !p || p.viewerId !== viewerId || !notice) return null;
  const sourceAssets = { ...assets, translation: { ...assets.translation, ...haremSourceText } };
  const close = () => {
    if (busy) return;
    setBusy(true);
    void acknowledgeHaremNotice(p.id).then(() => setQueue(q => q.filter(item => item.id !== p.id)), () => showSourceToast('Bildirişi təsdiqləmək mümkün olmadı. Yenidən cəhd et.')).finally(() => setBusy(false));
  };
  return <SourceDialogLayer title={translate(sourceAssets, 'dlg:harem:title')} hasClose={false} onClose={close}>
    <div className="popup__content"><div className="source-harem">
      <div className="source-harem-user"><Button variant="ghost" className="source-harem-photo" aria-label={notice.user.name} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: notice.user.id }))}><img src={notice.user.photoUrl} alt="" /></Button><div className="source-harem-name">{notice.user.name}</div></div>
      <div className="source-harem-description">{translate(sourceAssets, notice.key, ...notice.args)} {translate(sourceAssets, 'dlg:harem:for')} <span className="source-harem-price" style={{ backgroundImage: `url(${sourceHeart})` }}>{String(p.price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span></div>
    </div></div>
    <SourceButtons confirm={{ title: translate(sourceAssets, 'dlg:harem:btn:v2'), enabled: !busy, onClick: close }} />
  </SourceDialogLayer>;
}