import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export function SourceFeaturePopup({ title, children, onClose, help, inactive = false, className = '' }: { title: string; children: ReactNode; onClose: () => void; help?: () => void; inactive?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (inactive) return;
    const previous = document.activeElement;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onClose(); }
      if (e.key === 'Tab') {
        const controls = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]');
        if (!controls?.length) { e.preventDefault(); return; }
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', key, true);
    return () => { document.removeEventListener('keydown', key, true); if (previous instanceof HTMLElement) previous.focus(); };
  }, [inactive, onClose]);
  return <div className="source-feature-layer"><div className="popup-shade" onClick={inactive ? undefined : onClose} />
    <section ref={ref} tabIndex={-1} role="dialog" aria-modal={!inactive} inert={inactive} aria-label={title} className={`popup popup--center source-feature-popup ${className}`}>
      <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></Button>
      <header className="popup__header"><div className="popup__title">{title}</div>{help && <Button variant="ghost" className="source-feature-help" aria-label="Yardım" onClick={help}>?</Button>}</header>
      <div className="popup__content">{children}</div>
    </section>
  </div>;
}