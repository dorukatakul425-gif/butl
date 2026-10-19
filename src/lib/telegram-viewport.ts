// Telegram Mini App viewport handling — port of the original client's behavior:
// WebApp.expand() on load and on every viewportChanged, vertical swipes disabled,
// and the original iOS keyboard scroll algorithm so opening the chat keyboard
// never squashes the table (the game keeps its initial height; the page scrolls
// just enough to keep the focused input visible).

interface TelegramWebApp {
  initData?: string;
  platform?: string;
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  onEvent?: (event: string, cb: () => void) => void;
  openTelegramLink?: (url: string) => void;
  /** Telegram WebApp 8.0+: system safe area (notch / gesture bar). */
  safeAreaInset?: { top: number; bottom: number; left: number; right: number };
  /** Telegram WebApp 8.0+: safe area minus Telegram's own UI (bottom bar). */
  contentSafeAreaInset?: { top: number; bottom: number; left: number; right: number };
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
 * Original iosSafeArea.ts, verbatim: per-device portrait insets keyed by
 * `screen.width x screen.height x devicePixelRatio`. Telegram iOS uses the
 * bottom inset as the white strip under the chat input; unknown devices get
 * no inset (the original only logs them).
 */
const IOS_PORTRAIT_SAFE_AREA: Record<string, [number, number, number, number] | undefined> = {
  "320x568x2": undefined,
  "320x693x3": [38, 0, 29, 0],
  "375x667x2": undefined,
  "375x667x3": undefined,
  "375x812x2": [44, 0, 31, 0],
  "375x812x3": [44, 0, 34, 0],
  "390x844x3": [47, 0, 34, 0],
  "393x852x3": [59, 0, 34, 0],
  "402x874x3": [62, 0, 34, 0],
  "414x736x3": undefined,
  "414x896x2": [48, 0, 34, 0],
  "414x896x3": [44, 0, 34, 0],
  "420x912x3": [68, 0, 34, 0],
  "428x926x3": [47, 0, 34, 0],
  "430x932x3": [59, 0, 34, 0],
  "440x956x3": [62, 0, 34, 0],
  "744x1133x2": undefined,
  "768x1024x2": undefined,
  "810x1080x2": undefined,
  "820x1180x2": undefined,
  "834x1112x2": undefined,
  "834x1194x2": undefined,
  "1024x1366x2": undefined,
};

export function iosPortraitSafeArea(w: number, h: number, dpr: number) {
  const v = IOS_PORTRAIT_SAFE_AREA[`${w}x${h}x${dpr}`];
  if (!v) return undefined;
  return { top: v[0], right: v[1], bottom: v[2], left: v[3] };
}

/** Original iosAppSafeArea(): device insets with top forced to 0. */
export function iosAppSafeArea() {
  const sa = iosPortraitSafeArea(screen.width, screen.height, window.devicePixelRatio);
  return sa ? { ...sa, top: 0 } : undefined;
}

/**
 * Android (and other non-iOS) Telegram builds: the white strip under the chat
 * input equals Telegram's contentSafeAreaInset.bottom (gesture/navigation
 * bar), falling back to safeAreaInset.bottom. Pure for testing.
 */
export function telegramSafeAreaBottom(
  webApp: Pick<TelegramWebApp, "platform" | "safeAreaInset" | "contentSafeAreaInset">,
  iosBottom = 0,
): number {
  // Unknown iPhones (not in the original map) fall back to Telegram's own inset.
  if (webApp.platform === "ios") return iosBottom || webApp.safeAreaInset?.bottom || 0;
  return webApp.contentSafeAreaInset?.bottom ?? webApp.safeAreaInset?.bottom ?? 0;
}

/**
 * Sets up the Telegram viewport lock. Only runs inside the Mini App; the
 * website build is untouched. Returns a cleanup function.
 */
export function setupTelegramViewport(): () => void {
  // The Telegram script can finish loading after the game mounts (or the Mini
  // App opened straight on the game): wait briefly instead of skipping setup,
  // otherwise the white strip under the chat input never appears.
  if (!isTelegramWebApp()) {
    let cleanup: (() => void) | null = null;
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (isTelegramWebApp()) { clearInterval(timer); cleanup = startTelegramViewport(); }
      else if (tries >= 50) clearInterval(timer);
    }, 100);
    return () => { clearInterval(timer); cleanup?.(); };
  }
  return startTelegramViewport();
}

function startTelegramViewport(): () => void {

  const webApp = window.Telegram?.WebApp;
  if (!webApp) return () => undefined;
  webApp.ready?.();
  webApp.expand?.();
  webApp.disableVerticalSwipes?.();
  webApp.onEvent?.("viewportChanged", () => webApp.expand?.());

  const root = document.documentElement;
  root.classList.add("tg-webapp");

  // Original: Telegram iOS reserves a white strip under the chat input equal
  // to the device home-indicator inset (chat__safe-area), from the original
  // iosSafeArea device table. On Android the original Telegram build takes the
  // same strip from Telegram's own contentSafeAreaInset/safeAreaInset (the
  // gesture/navigation bar height), updating on safeAreaChanged events.
  const applySafeAreaBottom = () => {
    const bottom = telegramSafeAreaBottom(webApp, iosAppSafeArea()?.bottom ?? 0);
    if (bottom > 0) {
      root.style.setProperty("--tg-safe-area-bottom", `${bottom}px`);
    } else {
      root.style.removeProperty("--tg-safe-area-bottom");
    }
  };
  applySafeAreaBottom();
  webApp.onEvent?.("safeAreaChanged", applySafeAreaBottom);
  webApp.onEvent?.("contentSafeAreaChanged", applySafeAreaBottom);

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
    root.style.removeProperty("--tg-safe-area-bottom");
  };
}
