import { useEffect, useRef } from "react";
import logo from "@/assets/ui_loading_logo_en.svg.asset.json";
import pattern from "@/assets/ui_loading_pattern.svg.asset.json";
import { useGameLoading } from "@/lib/game-loading";
import { unlockSfx } from "@/lib/sfx";
import { Button } from "@/components/ui/button";
import { loadingLogoFallback, loadingPatternFallback } from "@/lib/loading-artwork";
import { completeLoadingStage } from "@/lib/game-loading";

export function OriginalLoadingScreen() {
  const { progress, ready, error } = useGameLoading();
  const artwork = useRef(new Set<string>());
  const logoImage = useRef<HTMLImageElement>(null);
  const patternImage = useRef<HTMLImageElement>(null);
  const artworkReady = (name: string) => {
    artwork.current.add(name);
    if (artwork.current.size === 2) completeLoadingStage("artwork");
  };
  useEffect(() => {
    // SSR images can finish (or fail) before React attaches load/error handlers.
    for (const [name, image, fallback] of [["logo", logoImage.current, loadingLogoFallback], ["pattern", patternImage.current, loadingPatternFallback]] as const) {
      if (!image?.complete) continue;
      if (image.naturalWidth > 0) artworkReady(name);
      else image.src = fallback;
    }
    const unlock = () => unlockSfx();
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => { document.removeEventListener("pointerdown", unlock); document.removeEventListener("keydown", unlock); };
  }, []);
  if (ready) return null;
  return <div className="original-loading-screen" aria-label="Spin the Bottle yükleniyor">
    <img ref={patternImage} className="original-loading-pattern" src={pattern.url} alt="" onLoad={()=>artworkReady("pattern")} onError={e=>{e.currentTarget.src=loadingPatternFallback;}} />
    <img ref={logoImage} className="original-loading-logo" src={logo.url} width={1034.01} height={543.06} alt="Spin the Bottle" onLoad={()=>artworkReady("logo")} onError={e=>{e.currentTarget.src=loadingLogoFallback;}} />
    <div className="splash__bg" role="progressbar" aria-label="Oyun yükleniyor" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
      <div className="splash__bar" style={{ width: `${progress}%` }} />
    </div>
    {error && <Button className="original-loading-retry" onClick={() => window.location.reload()}>Yeniden dene</Button>}
  </div>;
}