import { useEffect } from "react";
import logo from "@/assets/ui_loading_logo_en.svg.asset.json";
import pattern from "@/assets/ui_loading_pattern.svg.asset.json";
import { useGameLoading } from "@/lib/game-loading";
import { unlockSfx } from "@/lib/sfx";
import { Button } from "@/components/ui/button";

export function OriginalLoadingScreen() {
  const { progress, ready, error } = useGameLoading();
  useEffect(() => {
    const unlock = () => unlockSfx();
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => { document.removeEventListener("pointerdown", unlock); document.removeEventListener("keydown", unlock); };
  }, []);
  if (ready) return null;
  return <div className="original-loading-screen" aria-label="Spin the Bottle yükleniyor">
    <img className="original-loading-pattern" src={pattern.url} alt="" />
    <img className="original-loading-logo" src={logo.url} alt="Spin the Bottle" />
    <div className="splash__bg" role="progressbar" aria-label="Oyun yükleniyor" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
      <div className="splash__bar" style={{ width: `${progress}%` }} />
    </div>
    {error && <Button className="original-loading-retry" onClick={() => window.location.reload()}>Yeniden dene</Button>}
  </div>;
}