import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

// Ports of the original Dialog.Buttons/Dialog.Button, InfoDialog, GiftLockedDialog
// and ToastDialog markup (bem "popup", "button", "info", "gift-locked", "toast").

export interface SourceAction { title: string; onClick: () => void; enabled?: boolean }

export function SourceButtons({ cancel, confirm, info, danger }: { cancel?: SourceAction | undefined; confirm?: SourceAction | undefined; info?: SourceAction | undefined; danger?: SourceAction | undefined }) {
  const btn = (type: string, a?: SourceAction) => a && (
    <Button variant="ghost" type="button" className={`button button--${type}${a.enabled === false ? " button--disabled" : ""}`}
      disabled={a.enabled === false} onClick={a.onClick}>{a.title}</Button>
  );
  return <div className="popup__buttons popup__buttons--center">{btn("danger", danger)}{btn("cancel", cancel)}{btn("confirm", confirm)}{btn("info", info)}</div>;
}

export function SourceDialogLayer({ title, onClose, hasClose = true, onShade, children, label }: { title: string; onClose: () => void; hasClose?: boolean; onShade?: (() => void) | undefined; children: ReactNode; label?: string }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } };
    document.addEventListener("keydown", key, true);
    return () => document.removeEventListener("keydown", key, true);
  }, [onClose]);
  return createPortal(
    <div className="source-feature-layer">
      <div className="popup-shade" onClick={onShade} />
      <section role="dialog" aria-modal="true" aria-label={label ?? title} className="popup popup--center popup--show">
        <div className="popup__header">
          <div className="popup__title">{title}</div>
          {hasClose && <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></Button>}
        </div>
        {children}
      </section>
    </div>,
    document.body,
  );
}

/** InfoDialog: header, centered context text, then the original button row. */
export function SourceInfoDialog({ title, context, hasClose = false, onClose, ...buttons }: {
  title: string; context: string; hasClose?: boolean; onClose: () => void;
  cancel?: SourceAction; confirm?: SourceAction; info?: SourceAction; danger?: SourceAction;
}) {
  return <SourceDialogLayer title={title} onClose={onClose} hasClose={hasClose} onShade={hasClose ? onClose : undefined}>
    <div className="popup__content popup__content--wrap popup__content--center"><div className="info__context">{context}</div></div>
    <SourceButtons {...buttons} />
  </SourceDialogLayer>;
}

export type SourceLock = { type: "kisses" | "friends" | "dj_score" | "price" | "harem_price" | "gestures"; current?: number; needed: number } | { type: "vip" | "league" | "achievement" };

/** GiftLockedDialog: grayscale item image, description, optional progress. */
export function SourceGiftLockedDialog({ title, description, kind, image, lock, onClose, cancel, confirm, info }: {
  title: string; description: string; kind: "gift" | "gesture" | "bottle";
  image: { src: string; width: number; height: number }; lock?: SourceLock; onClose: () => void;
  cancel?: SourceAction; confirm?: SourceAction; info?: SourceAction;
}) {
  const mods = kind === "gift" ? "gift-locked__image gift-locked__image--grayscale" : `gift-locked__image gift-locked__image--${kind} gift-locked__image--grayscale`;
  const progress = lock && "needed" in lock;
  return <SourceDialogLayer title={title} onClose={onClose} onShade={onClose}>
    <div className="popup__content"><div className="gift-locked">
      <img className={mods} src={image.src} width={image.width} height={image.height} alt="" />
      <div className="gift-locked__description">{description}</div>
      {progress && <>
        <div className="gift-locked__progress"><div className="gift-locked__progress gift-locked__progress--bar" style={{ width: `${((lock.current ?? 0) / lock.needed) * 100}%` }} /></div>
        <div className="gift-locked__amount"><div className={`gift-locked__icon gift-locked__icon--${lock.type}`} /><div><strong>{lock.current ?? "-"}</strong>/{lock.needed}</div></div>
      </>}
    </div></div>
    <SourceButtons cancel={cancel} confirm={confirm} info={info} />
  </SourceDialogLayer>;
}

// ToastDialog: rounded black message at the bottom of the screen.
const TOAST_EVENT = "source:toast";
export function showSourceToast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

export function SourceToastHost() {
  const [toast, setToast] = useState<{ id: number; message: string; phase: "show" | "hide" } | null>(null);
  useEffect(() => {
    let hide: number | undefined, remove: number | undefined;
    const on = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      window.clearTimeout(hide); window.clearTimeout(remove);
      const id = Date.now();
      setToast({ id, message, phase: "show" });
      hide = window.setTimeout(() => setToast(t => t && t.id === id ? { ...t, phase: "hide" } : t), 2000);
      remove = window.setTimeout(() => setToast(t => t && t.id === id ? null : t), 2300);
    };
    window.addEventListener(TOAST_EVENT, on);
    return () => { window.removeEventListener(TOAST_EVENT, on); window.clearTimeout(hide); window.clearTimeout(remove); };
  }, []);
  if (!toast) return null;
  return createPortal(<div className="source-toast-layer"><div role="status" className={`toast toast--bottom toast--${toast.phase}`}>{toast.message.replace("&nbsp;", "\u00A0")}</div></div>, document.body);
}

// Cross-component navigation used by lock dialogs ("Ayrıntılar").
export const OPEN_TOPS_EVENT = "source:open-tops";
export const OPEN_VIP_EVENT = "source:open-vip";
// Viewer.onGoldNeeded -> BankPresenter.show() (insufficient hearts).
export const OPEN_DECOR_EVENT = "source:open-decor";
export const OPEN_BANK_EVENT = "source:open-bank";
