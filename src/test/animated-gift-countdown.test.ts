import { describe, expect, it } from "vitest";
import { ANIMATED_GIFT_STARTS_AT, ANIMATED_GIFT_ENDS_AT, animatedGiftRemaining } from "@/lib/animated-gift-countdown";

describe("shared animated gift countdown", () => {
  it("runs for exactly seven days", () => {
    expect(ANIMATED_GIFT_ENDS_AT - ANIMATED_GIFT_STARTS_AT).toBe(7 * 86400 * 1000);
    expect(animatedGiftRemaining(ANIMATED_GIFT_STARTS_AT).days).toBe(7);
  });
  it("does not reset for a reload or a different visitor", () => {
    const afterTwoDays = ANIMATED_GIFT_STARTS_AT + 2 * 86400 * 1000;
    expect(animatedGiftRemaining(afterTwoDays)).toEqual({ days: 5, hours: 0, minutes: 0, seconds: 0 });
    expect(animatedGiftRemaining(afterTwoDays + 1000)).toEqual({ days: 4, hours: 23, minutes: 59, seconds: 59 });
  });
  it("stays at zero after expiry instead of restarting", () => {
    expect(animatedGiftRemaining(ANIMATED_GIFT_ENDS_AT + 86400000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});