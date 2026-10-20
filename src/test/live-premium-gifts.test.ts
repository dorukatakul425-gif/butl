import { describe, expect, it } from "vitest";
import { LIVE_PREMIUM_GIFTS, livePremiumGift } from "@/lib/live-premium-gifts";

describe("live premium gifts", () => {
  it("has all 69 source live gifts", () => {
    expect(Object.keys(LIVE_PREMIUM_GIFTS)).toHaveLength(69);
  });
  it("receiver gets half the DAT price (Balina Dalışı 215 -> 107)", () => {
    const g = livePremiumGift("live_6820")!;
    expect(g.dat).toBe(215);
    expect(g.reward_dat).toBe(107);
    expect(g.video).toBe("/room-assets/live-gifts/8000.mp4");
  });
  it("unknown types are not live", () => {
    expect(livePremiumGift("heartangel")).toBeUndefined();
    expect(livePremiumGift("toString")).toBeUndefined();
  });
});
