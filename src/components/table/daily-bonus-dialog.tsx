import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { loadCilizAssets, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { getSupabase } from "@/lib/supabase";
import { emitServerHeartAward, setPendingGold } from "@/lib/game-session";

/** DailyBonusDialog.tsx + DailyBonusPresenter: the server decides day/gold; closing starts addViewerGold. */
const bem = (block: string) => (element = "", mods: (string | false | undefined)[] = []) => {
  const base = element ? `${block}__${element}` : block;
  return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
const cls = bem("daily-bonus");
const popup = bem("popup");
interface Bonus { id: string; day: number; gold_diff: number }
const DAY_FALLBACK = ["1. gün", "2. gün", "3. gün", "4. gün", "5. gün"];

export function DailyBonusHost({ viewerId }: { viewerId: string }) {
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [assets, setAssets] = useState<CilizAssets | null>(null);
  useEffect(() => {
    let alive = true;
    void (async () => {
      const [a, res] = await Promise.all([loadCilizAssets().catch(() => null), getSupabase()?.rpc("claim_daily_bonus")]);
      if (!alive || !res || res.error || !res.data) return;
      const b = res.data as unknown as Bonus;
      setPendingGold(b.gold_diff); setAssets(a); setBonus(b);
    })();
    return () => { alive = false; };
  }, [viewerId]);
  if (!bonus) return null;
  const t = (key: string, fb: string) => (assets ? translate(assets, key, fb) : fb);
  const close = () => {
    emitServerHeartAward({ id: `daily:${bonus.id}`, viewerId, amount: bonus.gold_diff, lucky: false, prepaid: true });
    setBonus(null);
  };
  const title = t("dlg:day_bonus:title", "Günlük bonus");
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" />
        <div role="dialog" aria-modal="true" aria-label={title} className={`popup ${cls("x_popup")} popup--center popup--show`}>
          <div className={cls("bg")} />
          <div className={popup("header")}>
            <div className={`${popup("title")} ${cls("x_popup__title")}`}>{title}</div>
            <div className={popup("close", ["dlg"])} role="button" aria-label="Kapat" onClick={close}>
              <div className={popup("close-icon")} />
            </div>
          </div>
          <div className={popup("content")}>
            <div className={cls()}>
              <div className={cls("description")}>{t("dlg:day_bonus:desc", "Her gün oyuna gir ve bonus kazan!")}</div>
              <div className={cls("items")}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={cls("item", [i <= bonus.day && "activated", i === bonus.day && "today"])}>
                    <div className={cls("day")}>
                      <div className={cls("checkbox")} />
                      <div className={cls("day-title")}>{t(`dlg:day_bonus:day:${i}`, DAY_FALLBACK[i - 1] ?? `${i}`)}</div>
                    </div>
                    <div className={cls("heart")}><span className={cls("heart-title")}>{i}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={`${popup("buttons", ["center"])} ${cls("x_popup__buttons")}`}>
            <div className="button button--confirm" role="button" onClick={close}>{t("dlg:day_bonus:btn", "Bonusu al")}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
