import { useEffect } from "react";

/** Safari's visible viewport excludes the browser bars and on-screen keyboard. */
export function useGameViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    document.documentElement.classList.add('game-active');
    const update = () => {
      document.documentElement.style.setProperty("--game-viewport-height", `${viewport?.height ?? window.innerHeight}px`);
      document.documentElement.style.setProperty("--game-viewport-top", `${viewport?.offsetTop ?? 0}px`);
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      document.documentElement.classList.remove('game-active');
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--game-viewport-height");
      document.documentElement.style.removeProperty("--game-viewport-top");
    };
  }, []);
}