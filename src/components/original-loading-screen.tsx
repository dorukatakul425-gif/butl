import { useEffect, useRef } from "react";
import pattern from "@/assets/ui_loading_pattern.svg";
import logo from "@/assets/ui_loading_logo_en.svg";
import { useGameLoading } from "@/lib/game-loading";
import { unlockSfx } from "@/lib/sfx";
import { Button } from "@/components/ui/button";
import { loadingPatternFallback } from "@/lib/loading-artwork";
import { completeLoadingStage } from "@/lib/game-loading";

/** Telegram splash.ts: green pattern with a centred white progress track, no logo. */
export function OriginalLoadingScreen() {
  const { progress, ready, error } = useGameLoading();
  const patternImage = useRef<HTMLImageElement>(null);
  const artworkReady = () => completeLoadingStage("artwork");
  useEffect(() => {
    // SSR images can finish (or fail) before React attaches load/error handlers.
    const image = patternImage.current;
    if (image?.complete) {
      if (image.naturalWidth > 0) artworkReady();
      else image.src = loadingPatternFallback;
    }
    const unlock = () => unlockSfx();
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => { document.removeEventListener("pointerdown", unlock); document.removeEventListener("keydown", unlock); };
  }, []);
  if (ready) return null;
  return <div className="original-loading-screen" aria-label="Spin the Bottle yükleniyor">
    <img ref={patternImage} className="original-loading-pattern" src={pattern} alt="" onLoad={artworkReady} onError={e=>{e.currentTarget.src=loadingPatternFallback;}} />
    <img className="original-loading-logo" src={logo} alt="Spin The Bottle" />
    <div className="splash__bg" role="progressbar" aria-label="Oyun yükleniyor" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
      <div className="splash__bar" style={{ width: `${progress}%` }} />
    </div>
    {error && <Button className="original-loading-retry" onClick={() => window.location.reload()}>Yeniden dene</Button>}
  </div>;
}
