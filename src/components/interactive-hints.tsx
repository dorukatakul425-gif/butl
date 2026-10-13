import { useEffect } from "react";
import { createHintAsset, runHintAnimation } from "@/lib/interactive-hint";
import { loadCilizAssets, translate } from "@/lib/ciliz-assets";

// Port of InteractiveHintPresenter + MessageHint (mask 1 << 0): first-time players
// get the animated hand pointing at the chat field, then at the send button.
export const HINT_SET_INPUT_EVENT = "source:hint-set-input";
export const CHAT_SENT_EVENT = "source:chat-sent";
const STORAGE_KEY = "bottle:interactive-hints";
const MESSAGE_MASK = 1 << 0;
const PAUSE_AFTER_TABLE_CHANGE = 10000;
const PAUSE_AFTER_DIALOG = 500;
const STEP_TIMEOUT = 15000;
const OSK_ANIMATION_TIME = 300;

const readFlags = () => { try { return Number(window.localStorage.getItem(STORAGE_KEY)) || 0; } catch { return 0; } };
const writeFlags = (v: number) => { try { window.localStorage.setItem(STORAGE_KEY, String(v)); } catch { /* ignore */ } };
const isAnyDialogOpen = () => !!document.querySelector('[role="dialog"]');
const isViewerPlayingRound = () => {
  const o = document.querySelector<HTMLElement>(".bottle-play-overlay");
  return !!o && o.dataset["phase"] !== "offer" && (o.dataset["spinner"] === "5" || o.dataset["target"] === "5");
};
const center = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

export function InteractiveHints() {
  useEffect(() => {
    if (readFlags() & MESSAGE_MASK) return;
    let disposed = false, running = false;
    let next = Date.now() + PAUSE_AFTER_TABLE_CHANGE;
    const bump = (t: number) => { if (next < t) next = t; };
    const dialogListeners = new Set<() => void>();
    let dialogOpen = isAnyDialogOpen();
    const observer = new MutationObserver(() => {
      const open = isAnyDialogOpen();
      if (open !== dialogOpen) { dialogOpen = open; bump(Date.now() + PAUSE_AFTER_DIALOG); dialogListeners.forEach(l => l()); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const layer = document.createElement("div");
    layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:1200;font-family:Arial,Helvetica,sans-serif";
    document.body.appendChild(layer);
    const asset = createHintAsset(layer);

    const step = <T,>(setup: (resolve: (v: T) => void, reject: () => void) => () => void) => new Promise<T>((resolve, reject) => {
      let cleanup = () => {};
      const timer = window.setTimeout(() => { cleanup(); reject(); }, STEP_TIMEOUT);
      const onDialog = () => { cleanup(); reject(); };
      dialogListeners.add(onDialog);
      const inner = setup(v => { cleanup(); resolve(v); }, () => { cleanup(); reject(); });
      cleanup = () => { window.clearTimeout(timer); dialogListeners.delete(onDialog); inner(); };
    });

    const run = async (t: (k: string) => string) => {
      const input = document.querySelector<HTMLInputElement>(".original-chat-input-field");
      const send = document.querySelector<HTMLElement>(".original-chat-send");
      if (!input || !send) return false;
      const a1 = runHintAnimation(asset, center(input), 180, t("tutorial:post:message_label"));
      const r1 = () => a1.update(center(input));
      window.addEventListener("resize", r1);
      const ok = await step<boolean>(resolve => {
        const onClick = () => {
          window.dispatchEvent(new CustomEvent(HINT_SET_INPUT_EVENT, { detail: t("tutorial:post:message_text") }));
          window.setTimeout(() => input.select(), 0);
          window.setTimeout(() => { a1.cancel(false); void a1.finished.then(() => resolve(true)); }, OSK_ANIMATION_TIME);
        };
        input.addEventListener("click", onClick);
        return () => input.removeEventListener("click", onClick);
      }).catch(() => { a1.cancel(true); return false; });
      window.removeEventListener("resize", r1);
      if (!ok || disposed) return false;
      const a2 = runHintAnimation(asset, center(send), 135, t("tutorial:post:message_label2"), { isSendMessage: true });
      const r2 = () => a2.update(center(send));
      window.addEventListener("resize", r2);
      const sent = await step<boolean>(resolve => {
        const onSent = () => { a2.cancel(false); void a2.finished.then(() => resolve(true)); };
        window.addEventListener(CHAT_SENT_EVENT, onSent);
        return () => window.removeEventListener(CHAT_SENT_EVENT, onSent);
      }).catch(() => { a2.cancel(true); return false; });
      window.removeEventListener("resize", r2);
      return sent;
    };

    const tick = window.setInterval(() => {
      if (disposed || running || Date.now() < next) return;
      if (isAnyDialogOpen() || isViewerPlayingRound()) return;
      running = true;
      void loadCilizAssets().then(assets => run(k => translate(assets, k))).catch(() => false).finally(() => {
        // Original marks the scenario finished whether it was completed or cancelled.
        writeFlags(readFlags() | MESSAGE_MASK);
        disposed = true;
        window.clearInterval(tick);
      });
    }, 1000);

    return () => { disposed = true; window.clearInterval(tick); observer.disconnect(); layer.remove(); };
  }, []);
  return null;
}
