// One shared campaign deadline: never derived from a visit or browser storage.
export const ANIMATED_GIFT_STARTS_AT = Date.parse("2026-10-18T23:32:25Z");
export const ANIMATED_GIFT_ENDS_AT = Date.parse("2026-10-25T23:32:25Z");

export function animatedGiftRemaining(now: number) {
  const seconds = Math.max(0, Math.ceil((ANIMATED_GIFT_ENDS_AT - now) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}

export function animatedGiftCountdownLabel(now: number) {
  const remaining = animatedGiftRemaining(now);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${remaining.days} gün ${pad(remaining.hours)}:${pad(remaining.minutes)}:${pad(remaining.seconds)}`;
}