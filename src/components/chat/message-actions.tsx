import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';

/** Original MessageActionsDialog: no heading, close control, source settings icons. */
export function MessageActions({ assets, blocked, translationShown, canTranslate, busy, onClose, onIgnore, onReport, onTranslate }: {
  assets: CilizAssets; blocked: boolean; translationShown: boolean; canTranslate: boolean; busy: boolean;
  onClose: () => void; onIgnore: () => void; onReport: () => void; onTranslate: () => void;
}) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [onClose]);
  const items = [
    { key: blocked ? 'dlg:unblock:title' : 'dlg:block:title', icon: 'ignore', action: onIgnore },
    { key: 'dlg:report_issue:title', icon: 'complain', action: onReport },
    ...(canTranslate ? [{ key: translationShown ? 'dlg:translate:show_original' : 'dlg:translate:show_translation', icon: 'translate', action: onTranslate }] : []),
  ];
  return createPortal(<div className="source-feature-layer source-message-actions">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-label={translate(assets, 'dlg:report_issue:title')} className="popup popup--center popup--show message-actions__x_popup">
      <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></Button>
      {items.map(item => <Button key={item.key} variant="ghost" disabled={busy} className="settings__item settings__item--selectable" onClick={item.action}>
        <span className={`settings__icon settings__icon--${item.icon}`} />{translate(assets, item.key)}
      </Button>)}
    </section>
  </div>, document.body);
}