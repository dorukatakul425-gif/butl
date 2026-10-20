import { describe, expect, it } from "vitest";
import { ARM_MS, armMessage, clampGiftCount, premiumReasonText, premiumReward, premiumTotal, readAutoMode, tapPremium } from "@/lib/premium-gifts";

describe("premium DAT gifts", () => {
  it("charges the price once per receiver", () => {
    expect(premiumTotal(500, 1)).toBe(500);
    expect(premiumTotal(1000, 3)).toBe(3000);
  });
  it("pays the receiver half the price", () => {
    expect(premiumReward(500)).toBe(250);
    expect(premiumReward(5000)).toBe(2500);
  });
  it("needs a second tap within 3.5 seconds to send", () => {
    const first = tapPremium({ type: null, at: 0 }, "comet", 1000);
    expect(first.send).toBe(false);
    expect(tapPremium(first.next, "comet", 1000 + ARM_MS - 1).send).toBe(true);
    expect(tapPremium(first.next, "comet", 1000 + ARM_MS).send).toBe(false);
    expect(tapPremium(first.next, "salute", 1200).send).toBe(false);
  });
  it("shows the total for several receivers", () => {
    expect(armMessage("Kometa", 1000, 2)).toContain("2000 DAT (2 nəfərə)");
  });
  it("clamps the Say count to 1..100", () => {
    expect(clampGiftCount(0)).toBe(1);
    expect(clampGiftCount(250)).toBe(100);
    expect(clampGiftCount("7")).toBe(7);
  });
  it("maps server reasons", () => {
    expect(premiumReasonText("insufficient_dat")).toBe("Kifayət qədər DAT yoxdur 💎");
    expect(premiumReasonText("self_gift")).toBe("Özünə hədiyyə göndərmək olmaz");
  });
  it("defaults to auto mode", () => {
    expect(readAutoMode(null)).toBe(true);
    expect(readAutoMode("manual")).toBe(false);
  });
});
