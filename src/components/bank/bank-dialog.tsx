import { DatPrice } from "@/components/bank/dat-price";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { loadCilizAssets, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { bankOptions, bonusPercent } from "@/lib/bank";

// Markup and class names ported from BankDialog.tsx, Dialog.Header/Content/Button and BankPresenter.
const bem = (block: string) => (element = "", mods: Array<string | false | undefined> = []) => {
  const base = element ? `${block}__${element}` : block;
  return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
const cls = bem("bank");
const popup = bem("popup");
const button = bem("button");

function usePopupPhase(open: boolean) {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<"show" | "hide" | null>(null);
  useEffect(() => {
    if (open) {
      setMounted(true);
      setPhase("show");
      const id = window.setTimeout(() => setPhase(null), 300);
      return () => window.clearTimeout(id);
    }
    if (!mounted) return;
    setPhase("hide");
    const id = window.setTimeout(() => { setMounted(false); setPhase(null); }, 100);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return { mounted, phase };
}

function DialogButton({ title, mods = [], onClick }: { title: React.ReactNode; mods?: string[]; onClick: () => void }) {
  return (
    <div role="button" className={`${button("")} ${cls("x_button", mods)}`} onClick={onClick}>{title}</div>
  );
}

export function BankDialog({ open, onClose, isVip, vipPurchased = false, onVip }: { open: boolean; onClose: () => void; isVip: boolean; vipPurchased?: boolean; onVip?: () => void }) {
  const [assets, setAssets] = useState<CilizAssets | null>(null);
  const { mounted, phase } = usePopupPhase(open);
  useEffect(() => {
    if (open && !assets) loadCilizAssets().then(setAssets).catch(() => undefined);
  }, [open, assets]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose]);
  if (!mounted || !assets) return null;
  const t = (key: string) => translate(assets, key);
  const options = bankOptions(assets);
  const bonusDesc = t("bank:bonus:big");
  const itemsNum = options.length + (isVip ? 1 : 0);

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <div role="dialog" aria-modal="true" aria-label={t("bank:title")}
          className={["popup", cls("x_popup"), "popup--center", phase === "show" && "popup--show", phase === "hide" && "popup--hide"].filter(Boolean).join(" ")}>
          <div className={cls("bg")} />
          <div className={`${popup("header")} ${cls("x_popup__header")}`}>
            <div className={`${popup("title")} ${cls("x_popup__title")}`}>{t("bank:title")}</div>
            <div className={popup("close", ["dlg"])} role="button" aria-label="Kapat" onClick={onClose}>
              <div className={`${popup("close-icon")} ${cls("x_popup__close-icon")}`} />
            </div>
          </div>
          <div className={`${popup("content")} ${cls("x_popup__content")}`}>
            <div className={cls("items-container", [itemsNum > 8 && "many-items"])}>
              {isVip && (
                <div className={cls("item")}>
                  <div className={cls("item-bg", ["gold"])} />
                  <div className={cls("desc")}>
                    <span className={cls("vip")}>{t("dlg:needvip:title")}</span>
                    <span className={cls("bonus", ["vip"])}>{t("bank:vip:status")}</span>
                  </div>
                  <div className={cls("opt-icon", ["vip"])} />
                  {vipPurchased && <div className={cls("purchased")} />}
                  <DialogButton title={t("mobile:vip:know")} mods={["vip"]} onClick={onVip ?? onClose} />
                </div>
              )}
              {options.map((opt) => (
                <div key={opt.real} className={cls("item")}>
                  {opt.label && (
                    <div className={cls("label", [opt.label.type])}>
                      <div className={cls("label-blick")} />
                      <div className={cls("label-text")}>{opt.label.text}</div>
                    </div>
                  )}
                  <div className={cls("item-bg", ["gold"])} />
                  <div className={cls("desc")}>
                    <span className={cls("gold")}>{opt.gold + opt.bonus}</span>
                    {opt.bonus > 0 && <span className={cls("bonus")}>{bonusPercent(opt.gold, opt.bonus)}% {bonusDesc}</span>}
                  </div>
                  <div className={cls("opt-icon", [String(opt.idx)])}>
                    <div className={cls("blicks")}>
                      {[1, 2, 3, 4].map((n) => <div key={n} className={cls("blick", [String(n)])} />)}
                    </div>
                  </div>
                  <DialogButton title={<DatPrice text={opt.price} />} onClick={onClose} />
                </div>
              ))}
            </div>
          </div>
          <div />
        </div>
      </div>
    </div>,
    document.body,
  );
}
