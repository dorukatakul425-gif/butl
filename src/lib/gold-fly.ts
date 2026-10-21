import heartIcon from "@/assets/ui_btn_gold_add_heart_up.svg";

/**
 * ureyimsen GiftAnimations.addViewerGold / inplaceGold, birebir:
 * kalp simgesi çıkış noktasında belirir, 2 sn EASE_OUT ile sol üstteki kalp
 * sayacına uçar, son 0.3 sn'de sönümlenir; varınca sayaç nabız gibi atar
 * (scale 1 → 1.2 → 0.9 → 1, toplam 0.5 sn). Alıcı başkasıysa kalp yerinde
 * belirip 32 px yukarı süzülerek 2 sn'de kaybolur.
 */

const FLY_MS = 2000;
const FADE_MS = 300;
const PULSE_MS = 500;
const INPLACE_MS = 2000;
const INPLACE_RISE_PX = 32;
const HEART_SIZE = 36;

function heartEl(at: { x: number; y: number }): HTMLImageElement {
  const el = document.createElement("img");
  el.src = heartIcon;
  el.alt = "";
  el.className = "gold-fly__heart";
  el.style.left = `${at.x - HEART_SIZE / 2}px`;
  el.style.top = `${at.y - HEART_SIZE / 2}px`;
  document.body.appendChild(el);
  return el;
}

/** Sol üst kalp sayacının ekran koordinatı; sayaç yoksa null. */
export function goldCounterPoint(): { x: number; y: number } | null {
  const btn = document.querySelector<HTMLElement>(".original-heart-button");
  if (!btn) return null;
  const r = btn.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Sayaç nabzı: scale 1 → 1.2 → 0.9 → 1 (source playGoldIncreasedAnimation). */
export function pulseGoldCounter() {
  const btn = document.querySelector<HTMLElement>(".original-heart-button");
  if (!btn) return;
  btn.classList.remove("gold-fly-pulse");
  // Sınıfın yeniden başlaması için reflow.
  void btn.offsetWidth;
  btn.classList.add("gold-fly-pulse");
  window.setTimeout(() => btn.classList.remove("gold-fly-pulse"), PULSE_MS);
}

/** Kalp, çıkış noktasından sol üst kalp sayacına uçar; varınca sayaç nabzı atar. */
export function flyGoldToCounter(from: { x: number; y: number }, onArrive?: () => void) {
  const target = goldCounterPoint();
  if (!target) return;
  const el = heartEl(from);
  if (typeof el.animate !== "function") {
    // Web Animations API olmayan ortamlar (test): süre dolunca aynı sonuç.
    window.setTimeout(() => { el.remove(); pulseGoldCounter(); onArrive?.(); }, FLY_MS);
    return;
  }
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const anim = el.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 1, offset: (FLY_MS - FADE_MS) / FLY_MS },
      { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0 },
    ],
    { duration: FLY_MS, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", fill: "forwards" },
  );
  anim.onfinish = () => {
    el.remove();
    pulseGoldCounter();
    onArrive?.();
  };
}

/** Alıcı başkasıysa: kalp yerinde belirir, yukarı süzülüp kaybolur (inplaceGold). */
export function inplaceGold(at: { x: number; y: number }) {
  const el = heartEl(at);
  if (typeof el.animate !== "function") {
    window.setTimeout(() => el.remove(), INPLACE_MS);
    return;
  }
  const anim = el.animate(
    [
      { transform: "translateY(0)", opacity: 1 },
      { transform: `translateY(-${INPLACE_RISE_PX}px)`, opacity: 0 },
    ],
    { duration: INPLACE_MS, easing: "ease-out", fill: "forwards" },
  );
  anim.onfinish = () => el.remove();
}
