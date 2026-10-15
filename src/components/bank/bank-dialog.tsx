import { DatPrice } from "@/components/bank/dat-price";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadCilizAssets, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { bankOptions, bonusPercent } from "@/lib/bank";
import { getSupabase } from "@/lib/supabase";
import { emitServerHeartAward, setPendingGold } from "@/lib/game-session";
import { showSourceToast } from "@/components/source-dialogs";
import { ReceivedGoldDialog } from "@/components/bank/received-gold-dialog";
import { useViewerProgress, VIEWER_STATUS_CHANGED } from "@/lib/viewer-progress";

const PREMIUM_PRICE = 499; // BankPresenter.premiumOption(): 499, season pass (30 days here).
function leftText(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return d > 0 ? `${d} g. ${h} sa.` : h > 0 ? `${h} sa. ${m} dk.` : `${m} dk. ${sec} sn.`;
}
function useNow(on: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { if (!on) return; const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, [on]);
  return now;
}

function PremiumPassDialog({ t, onClose }: { t: (k: string) => string; onClose: () => void }) {
  const { premium, premiumUntil } = useViewerProgress();
  const now = useNow(premium);
  const busy = useRef(false);
  const [done, setDone] = useState(false);
  const buy = async () => {
    const sb = getSupabase();
    if (!sb || busy.current) return;
    busy.current = true;
    const { error } = await sb.rpc("buy_premium", { p_option: "pass30" });
    busy.current = false;
    if (error) { showSourceToast(error.message.includes("insufficient") ? "Yeterli DAT yok." : "Satın alma başarısız."); return; }
    window.dispatchEvent(new Event(VIEWER_STATUS_CHANGED));
    setDone(true);
  };
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <div role="dialog" aria-modal="true" aria-label={t("dlg:bottle_pass:premium_pass")} className="popup popup--center popup--show info__x_popup">
          <div className="popup__header">
            <div className="popup__title">{t("dlg:bottle_pass:premium_pass")}</div>
            <div className="popup__close popup__close--dlg" role="button" aria-label="Kapat" onClick={onClose}><div className="popup__close-icon" /></div>
          </div>
          <div className="popup__content" style={{ textAlign: "center", padding: "12px 16px" }}>
            <div className="bank__opt-icon bank__opt-icon--premium-pass" style={{ position: "relative", margin: "0 auto 10px", left: "auto", top: "auto" }} />
            <div style={{ fontSize: 14, lineHeight: 1.35 }}>{done ? t("dlg:premium_pass:purchased") : t("dlg:bottle_pass_info:desc2")}</div>
            <div style={{ fontSize: 13, marginTop: 8, opacity: 0.85 }}>{t("ok:premium:hint")}</div>
            {premium && premiumUntil && <div className="bank__premium-pass-timer" style={{ position: "static", marginTop: 10 }}>{leftText(premiumUntil - now)}</div>}
          </div>
          <div className="popup__buttons" style={{ display: "flex", justifyContent: "center", padding: "0 0 14px" }}>
            {done ? <div role="button" className="button button--confirm" onClick={onClose}>{t("dlg:navigate_vip:btn")}</div>
              : <div role="button" className="button button--confirm" onClick={() => void buy()}>{premium ? "+30 g. " : ""}<DatPrice text={`${PREMIUM_PRICE} OK`} /></div>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

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
  const [received, setReceived] = useState<{ gold: number; position: number } | null>(null);
  const busy = useRef(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const viewer = useViewerProgress();
  const now = useNow(open && viewer.premium);
  // BankPresenter purchase -> _recv_gold_bought -> showReceivedGold(gold, 'html:dlg:gold:purchased2:v2', true).
  const buy = async (real: number, position: number) => {
    const sb = getSupabase();
    if (!sb || busy.current) return;
    busy.current = true;
    const { data, error } = await sb.rpc("buy_gold", { p_real: real });
    busy.current = false;
    if (error) { showSourceToast(error.message.includes("insufficient") ? "Yeterli DAT yok." : "Satın alma başarısız."); return; }
    const got = Number(data);
    setPendingGold(got);
    onClose();
    setReceived({ gold: got, position });
  };
  const receivedDialog = received && assets ? <ReceivedGoldDialog assets={assets} gold={received.gold} position={received.position} onContinue={async (pt) => {
    const r = received; setReceived(null);
    const { data } = await getSupabase()!.auth.getUser();
    emitServerHeartAward({ id: `buy:${Date.now()}:${Math.random()}`, viewerId: data.user?.id ?? "", amount: r.gold, lucky: false, prepaid: true, from: pt });
  }} /> : null;
  const premiumDialog = premiumOpen && assets ? <PremiumPassDialog t={(k) => translate(assets, k)} onClose={() => setPremiumOpen(false)} /> : null;
  if (!mounted || !assets) return <>{receivedDialog}{premiumDialog}</>;
  const t = (key: string) => translate(assets, key);
  const options = bankOptions(assets);
  const bonusDesc = t("bank:bonus:big");
  const itemsNum = options.length + (isVip ? 1 : 0) + 1;

  return <>{receivedDialog}{premiumDialog}{createPortal(
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
              {/* BankDialog PremiumPass: shown before VIP; timer + purchased mark while active. */}
              <div className={cls("item")}>
                <div className={cls("item-bg", ["gold"])} />
                <div className={cls("desc")}><span className={cls("premium-pass")}>{t("dlg:bottle_pass:premium_pass").toLocaleUpperCase("tr-TR")}</span></div>
                <div className={cls("opt-icon", ["premium-pass"])} />
                {viewer.premium && viewer.premiumUntil && <><div className={cls("premium-pass-timer")}>{leftText(viewer.premiumUntil - now)}</div><div className={cls("purchased")} /></>}
                <DialogButton title={t("mobile:vip:know")} mods={["vip"]} onClick={() => setPremiumOpen(true)} />
              </div>
              {isVip && (
                <div className={cls("item")}>
                  <div className={cls("item-bg", ["gold"])} />
                  <div className={cls("desc")}>
                    <span className={cls("vip")}>{t("dlg:needvip:title")}</span>
                    <span className={cls("bonus", ["vip"])}>{t("bank:vip:status")}</span>
                  </div>
                  <div className={cls("opt-icon", ["vip"])} />
                  {(vipPurchased || viewer.vip) && <div className={cls("purchased")} />}
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
                  <DialogButton title={<DatPrice text={opt.price} />} onClick={() => void buy(opt.real, opt.idx - 1)} />
                </div>
              ))}
            </div>
          </div>
          <div />
        </div>
      </div>
    </div>,
    document.body,
  )}</>;
}
