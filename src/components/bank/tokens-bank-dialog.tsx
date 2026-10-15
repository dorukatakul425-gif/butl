import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadCilizAssets, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { getSupabase } from "@/lib/supabase";
import { OPEN_BANK_EVENT, showSourceToast } from "@/components/source-dialogs";

/** TokensPresenter.showBank + TokensBankDialog.tsx: options from the server, bought with hearts. */
export const OPEN_TOKENS_BANK_EVENT = "source:open-tokens-bank";
const bem = (block: string) => (element = "", mods: string[] = []) => {
  const base = element ? `${block}__${element}` : block;
  return [base, ...mods.map((m) => `${base}--${m}`)].join(" ");
};
const cls = bem("tokens-bank");
const popup = bem("popup");

interface Option { gold: number; tokens: number }

export function TokensBankHost() {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<CilizAssets | null>(null);
  const [options, setOptions] = useState<Option[] | null>(null);
  const busy = useRef(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_TOKENS_BANK_EVENT, show);
    return () => window.removeEventListener(OPEN_TOKENS_BANK_EVENT, show);
  }, []);
  useEffect(() => {
    if (!open) return;
    if (!assets) loadCilizAssets().then(setAssets).catch(() => undefined);
    const sb = getSupabase();
    void sb?.from("token_prices").select("gold,tokens").then(({ data }) => setOptions((data ?? []) as Option[]));
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, assets]);
  if (!open || !assets || !options) return null;
  const sorted = [...options].sort((a, b) => b.gold - a.gold);
  const close = () => setOpen(false);
  // session.buyTokens(gold): one purchase per open dialog; server validates price and balance.
  const buy = async (gold: number) => {
    if (busy.current) return;
    busy.current = true;
    const { error } = await getSupabase()!.rpc("buy_tokens", { p_gold: gold });
    busy.current = false;
    if (!error) { close(); return; }
    if (error.message.includes("insufficient")) { close(); window.dispatchEvent(new Event(OPEN_BANK_EVENT)); }
    else showSourceToast("Jeton satın alınamadı.");
  };
  const title = translate(assets, "dlg:tokens_store:title", "Jeton dükkanı");
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={close} />
        <div role="dialog" aria-modal="true" aria-label={title} className={`popup ${cls("x_popup")} popup--center popup--show`}>
          <div className={cls("bg")} />
          <div className={`${popup("header")} ${cls("x_popup__header")}`}>
            <div className={`${popup("title")} ${cls("x_popup__title")}`}>{title}</div>
            <div className={popup("close", ["dlg"])} role="button" aria-label="Kapat" onClick={close}>
              <div className={`${popup("close-icon")} ${cls("x_popup__close-icon")}`} />
            </div>
          </div>
          <div className={`${popup("content")} ${cls("x_popup__content")}`}>
            <div className={cls("")}>
              {sorted.map((opt, i) => (
                <div key={opt.gold} role="button" className={cls("item")} onClick={() => void buy(opt.gold)}>
                  <div className={cls("item-bg")}>
                    <div className={cls("desc")}>{opt.tokens}</div>
                    <div className={cls("opt-icon", [`${sorted.length - i}`])} />
                  </div>
                  <div className={cls("heart")}>{opt.gold}</div>
                  <div className={cls("item-shadow")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
