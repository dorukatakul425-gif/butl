import { createPortal } from "react-dom";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";

/** ReceivedGoldDialog.tsx: "Tebrikler!", package artwork, "<gold/> ödülü aldınız!", "Devam". */
export function ReceivedGoldDialog({ assets, gold, position, onContinue }: {
  assets: CilizAssets; gold: number; position: number | "heart"; onContinue: (pt: { x: number; y: number }) => void;
}) {
  const t = (k: string) => translate(assets, k);
  const context = t("html:dlg:gold:purchased2:v2");
  const [before, after = ""] = context.split("<gold/>");
  const go = (e: React.MouseEvent) => onContinue({ x: e.clientX, y: e.clientY });
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1001, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" />
        <div role="dialog" aria-modal="true" aria-label={t("dlg:kiss_bonus:title")} className="popup popup--center popup--show">
          <div className="popup__header received-gold__x_popup__header">
            <div className="popup__title">{t("dlg:kiss_bonus:title")}</div>
            <div className="popup__close popup__close--dlg" role="button" aria-label="Kapat" onClick={go}><div className="popup__close-icon" /></div>
          </div>
          <div className="popup__content popup__content--center">
            <div className="received-gold">
              {typeof position === "number" ? (
                <div className="received-gold__image">
                  <div className="received-gold__bg"><div className="received-gold__bg-image" /></div>
                  <div className={`received-gold__opt-icon received-gold__opt-icon--${position + 1}`}>
                    <div className="received-gold__blicks">{[1, 2, 3, 4].map(n => <div key={n} className={`received-gold__blick received-gold__blick--${n}`} />)}</div>
                  </div>
                </div>
              ) : <div className={`received-gold__image received-gold__image--${position}`} />}
              <div className="received-gold__context">{before}<div className="received-gold__heart">{gold}</div>{after}</div>
            </div>
          </div>
          <div className="popup__buttons popup__buttons--center">
            <div role="button" className="button button--confirm" onClick={go}>{t("dlg:gold:btn")}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** VipPresenter.showBought(): InfoDialog with imageId 'vip-purchase'. */
export function VipBoughtDialog({ assets, onClose }: { assets: CilizAssets; onClose: () => void }) {
  const t = (k: string) => translate(assets, k);
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1001, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <div role="dialog" aria-modal="true" aria-label={t("dlg:kiss_bonus:title")} className="popup popup--center popup--show">
          <div className="popup__header">
            <div className="popup__title">{t("dlg:kiss_bonus:title")}</div>
            <div className="popup__close popup__close--dlg" role="button" aria-label="Kapat" onClick={onClose}><div className="popup__close-icon" /></div>
          </div>
          <div className="popup__content popup__content--wrap popup__content--center">
            <div className="info__image info__image--vip-purchase" />
            <div className="info__context">{t("html:dlg:vip:purchased")}</div>
          </div>
          <div className="popup__buttons popup__buttons--center">
            <div role="button" className="button button--confirm" onClick={onClose}>{t("dlg:gold:btn")}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
