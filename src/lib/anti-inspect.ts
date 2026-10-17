// Client-side code protection: discourages DevTools / web inspector usage.
// Note: no browser-side technique can make client code unreadable to a
// determined attacker. This raises the cost; real secrets must stay server-side.

const MESSAGE = "Bu səhifə qorunur. Developer tools bağlayın.";

let started = false;

function lockScreen() {
  try {
    const el = document.createElement("div");
    el.setAttribute("data-protection-overlay", "1");
    el.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;background:#0b0b0f;color:#e7c9a0;" +
      "display:flex;align-items:center;justify-content:center;text-align:center;" +
      "font:600 18px/1.5 system-ui,sans-serif;padding:24px";
    el.textContent = MESSAGE;
    document.body.appendChild(el);
  } catch {
    // Never let the guard break the game.
  }
}

function silenceConsole() {
  try {
    const noop = () => undefined;
    const c = console as unknown as Record<string, unknown>;
    for (const k of ["log", "debug", "info", "warn", "table", "dir", "trace", "group", "groupEnd"]) {
      c[k] = noop;
    }
  } catch {
    // ignore
  }
}

function blockShortcuts() {
  const handler = (e: KeyboardEvent) => {
    const k = e.key?.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    if (
      e.key === "F12" ||
      (ctrl && e.shiftKey && ["i", "j", "c", "k"].includes(k)) ||
      (ctrl && ["u", "s"].includes(k))
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  window.addEventListener("keydown", handler, { capture: true });
}

function watchDevtools() {
  let locked = false;
  const trip = () => {
    if (locked) return;
    locked = true;
    lockScreen();
  };

  // 1) Docked DevTools change the gap between outer and inner viewport size.
  const bySize = () => {
    const gapW = window.outerWidth - window.innerWidth;
    const gapH = window.outerHeight - window.innerHeight;
    if (window.outerWidth > 0 && (gapW > 220 || gapH > 220)) trip();
  };

  // 2) A `debugger` statement only pauses while an inspector is attached.
  const byDebugger = () => {
    const t = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    if (performance.now() - t > 180) trip();
  };

  window.setInterval(() => {
    bySize();
    byDebugger();
  }, 1500);
}

export function startCodeProtection() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (!import.meta.env.PROD) return;
  silenceConsole();
  blockShortcuts();
  watchDevtools();
}
