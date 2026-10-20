// ureyimsen premium gift store (Zd) and gift toolbar state (ca), with DAT coin instead of crystals.

/** ca.setCount: "Say" is clamped to 1..100. */
export function clampGiftCount(value: unknown): number {
  const n = Math.floor(Number(value));
  return Math.max(1, Math.min(100, Number.isFinite(n) ? n : 1));
}

/** Total DAT for one tap: price is charged per receiver. */
export function premiumTotal(price: number, receivers: number): number {
  return price * Math.max(0, receivers);
}

/** Receiver payout: half the price (reward_crystals = floor(crystals / 2)). */
export function premiumReward(price: number): number {
  return Math.floor(price / 2);
}

/** Zd.tap: the first tap arms the gift for 3.5 s and only shows the price; a second tap sends. */
export const ARM_MS = 3500;
export interface ArmState { type: string | null; at: number }
export function tapPremium(state: ArmState, type: string, now: number): { send: boolean; next: ArmState } {
  if (state.type === type && now - state.at < ARM_MS) return { send: true, next: { type: null, at: 0 } };
  return { send: false, next: { type, at: now } };
}

export function armMessage(name: string, price: number, receivers: number): string {
  const total = premiumTotal(price, receivers);
  return receivers > 1
    ? `💎 ${name} · ${total} DAT (${receivers} nəfərə) — göndərmək üçün yenidən toxun`
    : `💎 ${name} · ${total} DAT — göndərmək üçün yenidən toxun`;
}

/** Zd.onResult error toasts. */
export function premiumReasonText(reason: string): string {
  if (reason.includes("insufficient")) return "Kifayət qədər DAT yoxdur 💎";
  if (reason.includes("receiver_left")) return "Alıcı masadan çıxıb";
  if (reason.includes("self_gift")) return "Özünə hədiyyə göndərmək olmaz";
  return "Hədiyyə göndərilmədi";
}

export function announceText(row: { gift_name: string; dat: number; reward_dat: number; room_id: number }): string {
  return `${row.gift_name} · 💎 ${row.dat} DAT${row.reward_dat ? ` · alana +${row.reward_dat} DAT` : ""}${row.room_id ? ` · Masa ${row.room_id}` : ""}`;
}

/** localStorage giftAutoMode: anything but "manual" means auto. */
export function readAutoMode(stored: string | null): boolean {
  return stored !== "manual";
}
