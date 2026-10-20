import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { fetchPassInfo, getCachedPass, hasClaimable, passShortLeft, subscribePass } from "@/lib/season-pass";
import backgroundUp from "@/assets/ui_btn_bg_up.svg";
import backgroundDown from "@/assets/ui_btn_bg_down.svg";
import ticket from "@/assets/ui_btn_bottle_pass.svg";
import infoBackground from "@/assets/ui_btn_league_info.svg";

const SeasonPassDialog = lazy(() => import("@/components/table/season-pass-dialog").then((m) => ({ default: m.SeasonPassDialog })));

/** Header BottlePassButton: ticket icon, "21 gün" season pill and a red dot when a reward can be collected. */
export function SeasonPassButton({ skin }: { skin?: [string, string] }) {
  const info = useSyncExternalStore(subscribePass, getCachedPass, () => null);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    void fetchPassInfo();
    const tick = window.setInterval(() => setNow(Date.now()), 30_000);
    const refresh = window.setInterval(() => void fetchPassInfo(), 120_000);
    return () => { window.clearInterval(tick); window.clearInterval(refresh); };
  }, []);
  const t = info ? now + (info.now_ms - Date.now()) : now;
  const left = info ? info.finish_ms - t : 0;
  const dot = hasClaimable(info, t);
  return <>
    <Button variant="ghost" aria-label="Mövsümi icazənamə" title="Mövsümi icazənamə" aria-haspopup="dialog" onClick={() => setOpen(true)}
      className="original-header-button original-icon-bottle-pass original-league-button">
      <img src={skin?.[0] ?? backgroundUp} alt="" className="original-button-background original-button-up" />
      <img src={skin?.[1] ?? backgroundDown} alt="" className="original-button-background original-button-down" />
      <img src={ticket} alt="" className="original-button-icon" />
      {info && left > 0 && <span className="original-league-info"><img src={infoBackground} alt="" /><span>{passShortLeft(left)}</span></span>}
      {dot && <span aria-hidden="true" style={{ position: "absolute", top: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "#ff4b1f", border: "1.5px solid #fff" }} />}
    </Button>
    {open && <Suspense fallback={null}><SeasonPassDialog onClose={() => { setOpen(false); void fetchPassInfo(); }} /></Suspense>}
  </>;
}
