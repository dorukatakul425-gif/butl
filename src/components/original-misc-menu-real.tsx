// @ts-nocheck
// Orijinal Ciliz MiscMenuDialog'u (preloader bundle'ından birebir çıkarılan kod).
// Öğeler ve eylemler mevcut menüyle aynı; sadece görünüm/davranış orijinal koddan.
import { useEffect } from 'react';
import { openMiscMenu } from '@/lib/ciliz-original';

const items = [
  { id: 'achievements', title: 'Nailiyyətlər' },
  { id: 'tops', title: 'Liderlər' },
  { id: 'bottle', title: 'Şüşə' },
  { id: 'tablebg', title: 'Masa fonu' },
  { id: 'decor', title: 'Stil' },
  { id: 'boosters', title: 'Gücləndiricilər' }
] as const;

export function OriginalMiscMenuReal({ open, triggerRef, onClose, onSelect }: {
  open: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSelect?: (id: (typeof items)[number]['id']) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const root = document.createElement('div');
    root.className = 'game-dialog-root';
    document.body.appendChild(root);
    const rect = triggerRef.current?.getBoundingClientRect();
    const dlg = openMiscMenu(root, {
      btnCenterPoint: {
        x: (rect?.left ?? 0) + (rect?.width ?? 0) / 2,
        y: (rect?.top ?? 0) + (rect?.height ?? 0) / 2
      },
      items: items.map(item => ({
        icon: item.id,
        title: item.title,
        action: () => { onSelect?.(item.id); onClose(); }
      }))
    });
    const origClose = dlg.close.bind(dlg);
    dlg.close = (...args: unknown[]) => { onClose(); return origClose(...args); };
    return () => { dlg.closeImmediately?.(); root.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return null;
}
