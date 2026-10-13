import { useEffect } from "react";
import { createHintAsset, runHintAnimation } from "@/lib/interactive-hint";
import { loadCilizAssets, translate } from "@/lib/ciliz-assets";
import { GIFT_SENT_EVENT, locateSeat, markHintFinished, pendingScenarios, readHintFlags, type HintScenario } from "@/lib/interactive-hint-flags";
import { VIEWER_GOLD } from "@/lib/viewer-progress";

// Port of InteractiveHintPresenter with MessageHint (1<<0), ChoiceHint (1<<1), GiftHint (1<<2).
export const HINT_SET_INPUT_EVENT = "source:hint-set-input";
export const CHAT_SENT_EVENT = "source:chat-sent";
const PAUSE_AFTER_TABLE_CHANGE = 10000;
const PAUSE_BETWEEN_HINTS = 15000;
const PAUSE_AFTER_DIALOG = 500;
const MESSAGE_STEP_TIMEOUT = 15000;
const CHOICE_STEP_TIMEOUT = 7000;
const GIFT_STEP_TIMEOUT = 15000;
const CONTROLS_SHOWN_THRESHOLD = 1000;
const OSK_ANIMATION_TIME = 300;
const VIEWER_SEAT = 5;
const VIEWER_MALE = true;

const isAnyDialogOpen = () => !!document.querySelector('[role="dialog"]');
const giftDialog = () => document.querySelector<HTMLElement>(".send-gift");
const kissButton = () => document.querySelector<HTMLElement>(".bottle-kiss-button");
const isViewerPlayingRound = () => {
  const o = document.querySelector<HTMLElement>(".bottle-play-overlay");
  return !!o && o.dataset["phase"] !== "offer" && (o.dataset["spinner"] === "5" || o.dataset["target"] === "5");
};
// Preview only: hearts come from the account; `?hint=gift` lets designers watch the gift hint.
const hasGold = () => VIEWER_GOLD > 0 || new URLSearchParams(window.location.search).get("hint") === "gift";
const center = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
const angleForSeat = (seat: number) => (360 / 12) * seat + 360 / 24;
const oppositeSeat = () => { for (let s = 0; s < 12; s++) if (s !== VIEWER_SEAT && (s % 2 === 0) !== VIEWER_MALE) return s; return null; };
const delay = (ms: number) => new Promise(r => window.setTimeout(r, ms));

export function InteractiveHints() {
  useEffect(() => {
    if (pendingScenarios(readHintFlags()).length === 0) return;
    let disposed = false, running = false;
    let next = Date.now() + PAUSE_AFTER_TABLE_CHANGE;
    const bump = (t: number) => { if (next < t) next = t; };
    const dialogListeners = new Set<() => void>();
    let dialogOpen = isAnyDialogOpen();
    let controlsShownAt = 0, controlsShown = !!kissButton();
    const observer = new MutationObserver(() => {
      const open = isAnyDialogOpen();
      if (open !== dialogOpen) { dialogOpen = open; bump(Date.now() + PAUSE_AFTER_DIALOG); dialogListeners.forEach(l => l()); }
      const shown = !!kissButton();
      if (shown && !controlsShown) controlsShownAt = Date.now();
      controlsShown = shown;
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const layer = document.createElement("div");
    layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:1200;font-family:Arial,Helvetica,sans-serif";
    document.body.appendChild(layer);
    const asset = createHintAsset(layer);

    const step = <T,>(timeout: number, setup: (resolve: (v: T) => void, reject: () => void) => () => void, ignoreDialog?: () => boolean) => new Promise<T>((resolve, reject) => {
      let cleanup = () => {};
      const timer = window.setTimeout(() => { cleanup(); reject(); }, timeout);
      const dialog = () => { if (ignoreDialog?.()) return; cleanup(); reject(); };
      dialogListeners.add(dialog);
      const inner = setup(v => { cleanup(); resolve(v); }, () => { cleanup(); reject(); });
      cleanup = () => { window.clearTimeout(timer); dialogListeners.delete(dialog); inner(); };
    });
    const follow = (update: (p: { x: number; y: number }) => void, get: () => { x: number; y: number } | null) => {
      const h = () => { const p = get(); if (p) update(p); };
      window.addEventListener("resize", h);
      return () => window.removeEventListener("resize", h);
    };

    const conditions: Record<HintScenario, () => boolean> = {
      message: () => !isAnyDialogOpen() && !isViewerPlayingRound(),
      choice: () => controlsShown && Date.now() - controlsShownAt < CONTROLS_SHOWN_THRESHOLD && !isAnyDialogOpen(),
      gift: () => !isAnyDialogOpen() && !isViewerPlayingRound() && hasGold() && oppositeSeat() !== null,
    };

    const message = async (t: (k: string) => string) => {
      const input = document.querySelector<HTMLInputElement>(".original-chat-input-field");
      const send = document.querySelector<HTMLElement>(".original-chat-send");
      if (!input || !send) return false;
      const a1 = runHintAnimation(asset, center(input), 180, t("tutorial:post:message_label"));
      const off1 = follow(a1.update, () => center(input));
      const ok = await step<boolean>(MESSAGE_STEP_TIMEOUT, resolve => {
        const onClick = () => {
          window.dispatchEvent(new CustomEvent(HINT_SET_INPUT_EVENT, { detail: t("tutorial:post:message_text") }));
          window.setTimeout(() => input.select(), 0);
          window.setTimeout(() => { a1.cancel(false); void a1.finished.then(() => resolve(true)); }, OSK_ANIMATION_TIME);
        };
        input.addEventListener("click", onClick);
        return () => input.removeEventListener("click", onClick);
      }).catch(() => { a1.cancel(true); return false; });
      off1();
      if (!ok || disposed) return false;
      const a2 = runHintAnimation(asset, center(send), 135, t("tutorial:post:message_label2"));
      const off2 = follow(a2.update, () => center(send));
      const sent = await step<boolean>(MESSAGE_STEP_TIMEOUT, resolve => {
        const onSent = () => { a2.cancel(false); void a2.finished.then(() => resolve(true)); };
        window.addEventListener(CHAT_SENT_EVENT, onSent);
        return () => window.removeEventListener(CHAT_SENT_EVENT, onSent);
      }).catch(() => { a2.cancel(true); return false; });
      off2();
      return sent;
    };

    const choice = async (t: (k: string) => string) => {
      const btn = kissButton();
      if (!btn) return false;
      const target = () => { const b = kissButton(); if (!b) return null; const c = center(b); return { x: c.x, y: c.y - 2 }; };
      const a = runHintAnimation(asset, target()!, 300, t("tutorial:post:kiss_label"));
      const off = follow(a.update, target);
      const result = await step<boolean>(CHOICE_STEP_TIMEOUT, (resolve, reject) => {
        const onClick = (e: Event) => {
          const el = (e.target as HTMLElement).closest(".bottle-kiss-button, .bottle-refuse-button");
          if (!el) return;
          a.cancel(false); void a.finished.then(() => resolve(true));
        };
        document.addEventListener("click", onClick, true);
        const frame = window.setInterval(() => { if (!kissButton()) reject(); }, 100);
        return () => { document.removeEventListener("click", onClick, true); window.clearInterval(frame); };
      }, () => !!giftDialog()).catch(() => { a.cancel(true); return false; });
      off();
      return result;
    };

    const gift = async (t: (k: string) => string) => {
      const seat = oppositeSeat();
      if (seat === null) return false;
      const p = locateSeat(seat);
      if (!p) return false;
      const a1 = runHintAnimation(asset, p, angleForSeat(seat), t("tutorial:post:gift_label1"));
      const off1 = follow(a1.update, () => locateSeat(seat));
      const proceed = await step<boolean>(GIFT_STEP_TIMEOUT, (resolve, reject) => {
        const frame = window.setInterval(() => {
          if (!hasGold()) { reject(); return; }
          if (giftDialog()) { a1.cancel(false); window.clearInterval(frame); void a1.finished.then(() => resolve(true)); }
          else if (isAnyDialogOpen()) reject();
        }, 50);
        return () => window.clearInterval(frame);
      }, () => true).catch(() => { a1.cancel(true); return false; });
      off1();
      if (!proceed || disposed) return false;
      const gem = giftDialog()?.querySelector<HTMLElement>('[data-code="gem"] .send-gift__image-block');
      if (!gem) return false;
      const scroller = gem.closest(".popup__content");
      const landscape = window.innerWidth > window.innerHeight;
      await delay(10);
      gem.scrollIntoView(landscape ? { block: "nearest" } : { block: "start" });
      await delay(10);
      const a2 = runHintAnimation(asset, center(gem), landscape ? 85 : 0, t("tutorial:post:gift_label2"));
      const off2 = follow(a2.update, () => center(gem));
      const sent = await step<boolean>(GIFT_STEP_TIMEOUT, (resolve, reject) => {
        let armed = false;
        const arm = window.setTimeout(() => { armed = true; }, 50);
        const onScroll = () => { if (armed) reject(); };
        scroller?.addEventListener("scroll", onScroll);
        const onSent = () => { a2.cancel(false); void a2.finished.then(() => resolve(true)); };
        window.addEventListener(GIFT_SENT_EVENT, onSent);
        return () => { window.clearTimeout(arm); scroller?.removeEventListener("scroll", onScroll); window.removeEventListener(GIFT_SENT_EVENT, onSent); };
      }).catch(() => { a2.cancel(true); return false; });
      off2();
      return sent;
    };
    const runners: Record<HintScenario, (t: (k: string) => string) => Promise<boolean>> = { message, choice, gift };

    const tick = window.setInterval(() => {
      if (disposed || running || Date.now() < next) return;
      const name = pendingScenarios(readHintFlags()).find(n => conditions[n]());
      if (!name) return;
      running = true;
      void loadCilizAssets().then(assets => runners[name](k => translate(assets, k))).catch(() => false).finally(() => {
        // Original marks the scenario finished whether completed or cancelled.
        markHintFinished(name);
        bump(Date.now() + PAUSE_BETWEEN_HINTS);
        running = false;
        if (pendingScenarios(readHintFlags()).length === 0) { disposed = true; window.clearInterval(tick); }
      });
    }, 100);

    return () => { disposed = true; window.clearInterval(tick); observer.disconnect(); layer.remove(); };
  }, []);
  return null;
}
