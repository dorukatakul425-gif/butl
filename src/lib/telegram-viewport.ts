// Telegram Mini App viewport handling — port of the original client's behavior:
// WebApp.expand() on load and on every viewportChanged, vertical swipes disabled,
// and the original iOS keyboard scroll algorithm so opening the chat keyboard
// never squashes the table (the game keeps its initial height; the page scrolls
// just enough to keep the focused input visible).

interface TelegramWebApp {
  initData?: string;
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  onEvent?: (event: string, cb: () => void) => void;
  openTelegramLink?: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function isTelegramWebApp(win: Pick<Window, "Telegram"> = window): boolean {
  return Boolean(win.Telegram?.WebApp?.initData);
}

/**
 * Original onIosKeyboardWillChangeFrame algorithm, verbatim:
 * returns the smooth-scroll target that keeps the focused input above the
 * keyboard, or null when no scroll is needed.
 */
export function keyboardScrollTarget(
  keyboardHeight: number,
  scrollY: number,
  inputBottom: number,
  innerHeight: number,
): number | null {
  const keyboardShift = Math.max(0, keyboardHeight - scrollY);
  if (keyboardShift <= 0) return null;
  const distanceToInput = inputBottom - innerHeight;
  if (distanceToInput > keyboardShift) return null;
  return Math.max(0, keyboardHeight - distanceToInput);
}

/**
 * Sets up the Telegram viewport lock. Only runs inside the Mini App; the
 * website build is untouched. Returns a cleanup function.
 */
export function setupTelegramViewport(): () => void {
  if (!isTelegramWebApp()) return () => undefined;

  const webApp = window.Telegram?.WebApp;
  if (!webApp) return () => undefined;
  webApp.ready?.();
  webApp.expand?.();
  webApp.disableVerticalSwipes?.();
  webApp.onEvent?.("viewportChanged", () => webApp.expand?.());

  const root = document.documentElement;
  root.classList.add("tg-webapp");

  // Stable height captured before the keyboard ever opens: the game keeps this
  // height while typing, so the table proportions never change.
  let stableHeight = window.innerHeight;
  const applyHeight = (h: number) => root.style.setProperty("--tg-app-height", `${h}px`);
  applyHeight(stableHeight);

  const vv = window.visualViewport;
  const onResize = () => {
    const current = vv ? vv.height : window.innerHeight;
    const keyboardHeight = Math.max(0, stableHeight - current);
    if (keyboardHeight < 80) {
      // Keyboard closed (or tiny fluctuation): track the new full height.
      stableHeight = window.innerHeight;
      applyHeight(stableHeight);
      window.scrollTo({ top: 0, left: 0 });
      return;
    }
    // Keyboard open: freeze the layout at the stable height and scroll like the
    // original client so the focused input stays visible.
    applyHeight(stableHeight);
    const active = document.activeElement as HTMLElement | null;
    if (!active) return;
    const rect = active.getBoundingClientRect();
    const target = keyboardScrollTarget(keyboardHeight, window.scrollY, rect.bottom, current);
    if (target !== null) window.scrollTo({ top: target, left: 0, behavior: "smooth" });
  };

  vv?.addEventListener("resize", onResize);
  window.addEventListener("resize", onResize);

  return () => {
    vv?.removeEventListener("resize", onResize);
    window.removeEventListener("resize", onResize);
    root.classList.remove("tg-webapp");
    root.style.removeProperty("--tg-app-height");
  };
}
