import { describe, expect, it } from "vitest";
import { luckyBonusAmount } from "@/lib/game-session";

// Ciliz game_lucky_gold: spin_bottle returns the lucky bonus hearts (0 = no bonus).
describe("luckyBonusAmount", () => {
  it("passes through a positive server award", () => {
    expect(luckyBonusAmount(15)).toBe(15);
  });

  it("treats zero as no bonus", () => {
    expect(luckyBonusAmount(0)).toBe(0);
  });

  it("rejects negative, junk and missing payloads", () => {
    expect(luckyBonusAmount(-5)).toBe(0);
    expect(luckyBonusAmount(null)).toBe(0);
    expect(luckyBonusAmount(undefined)).toBe(0);
    expect(luckyBonusAmount("abc")).toBe(0);
  });

  it("floors fractional awards to whole hearts", () => {
    expect(luckyBonusAmount(12.9)).toBe(12);
  });
});
