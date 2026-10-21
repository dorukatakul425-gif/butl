import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';

export type TopsCategory = 'total_kisses' | 'dj_score' | 'price' | 'harem_price' | 'gestures' | 'glv' | 'activity';

// Telegram-only sections: ureyimsen showHelp texts (level points come from hearts spent on gifts).
const EXTRA_HELP: Partial<Record<TopsCategory, { title: string; text: string }>> = {
  glv: { title: 'Səviyyə liderləri', text: 'Hədiyyə atdıqca səviyyən qalxır: hədiyyəyə xərclənən hər ürək 1 səviyyə xalıdır, 1400 xal 1 səviyyədir (maksimum 100). Ümumi siyahıda səviyyəyə (bərabər səviyyədə xala), dövri siyahılarda həmin dövrdə qazanılan xala görə sıralanır.' },
  activity: { title: 'Aktivlik liderləri', text: 'Oyunda keçirdiyin hər dəqiqə sayılır. Ümumi siyahı bütün vaxt üzrə, aylıq, həftəlik və günlük siyahılar həmin dövrdə oyunda keçirilən vaxta görə sıralanır.' },
};

/** TopsPresenter.showHelp -> InfoDialog, using the original translation keys. */
export function SourceTopsHelp({ category, assets, onClose }: {
  category: TopsCategory; assets: CilizAssets; onClose: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  const extra = EXTRA_HELP[category];
  const title = extra ? extra.title : translate(assets, `dlg:top:help:${category}:title`);
  const context = extra ? extra.text : `${translate(assets, `dlg:top:help:${category}:text`)}\n\n${translate(assets, 'dlg:top:help:text:common')}`;
  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); onClose(); }
      if (event.key !== 'Tab') return;
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keyboard, true);
    return () => {
      document.removeEventListener('keydown', keyboard, true);
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [onClose]);
  return <div className="source-tops-help-layer">
    <div className="popup-shade" onClick={onClose} />
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="popup popup--center source-tops-help-popup">
      <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Liderlər haqqında məlumatı bağla" onClick={onClose}><span className="popup__close-icon" /></Button>
      <header className="popup__header"><div className="popup__title">{title}</div></header>
      <div className="popup__content popup__content--wrap popup__content--center"><div className="info__context">{context}</div></div>
      <div className="popup__buttons popup__buttons--center"><Button variant="ghost" className="button button--confirm" onClick={onClose}>{translate(assets, 'dlg:navigate_vip:btn')}</Button></div>
    </section>
  </div>;
}