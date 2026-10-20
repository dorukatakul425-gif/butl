import { describe, expect, it } from "vitest";
import { canClaim, passChestGold, passLevelFor, passProgress, prizeView, type PassInfo, type PassLevel } from "@/lib/season-pass";

const DAY = 86_400_000;
const start = 1_000_000;
const levels: PassLevel[] = Array.from({ length: 35 }, (_, i) => ({
  level: i, score: i * 100, start_ms: start + i * DAY,
  free: { claimed: false, items: { league_kiss_lim10: 2 } }, paid: { claimed: false, gold: 100 },
}));

describe("season pass rules", () => {
  it("one new level unlocks per day even with enough points", () => {
    expect(passLevelFor(levels, 1000, start + 2 * DAY)).toBe(2);
    expect(passLevelFor(levels, 1000, start + 20 * DAY)).toBe(10);
  });
  it("bonus chest: 1 heart per 50 points past level 35 score (3400), max 100", () => {
    const chest = { gold_max: 100, overscore2gold: 50 };
    expect(passChestGold(levels, 3400, chest)).toBe(0);
    expect(passChestGold(levels, 3549, chest)).toBe(2);
    expect(passChestGold(levels, 999_999, chest)).toBe(100);
  });
  it("header shows 40/100 towards level 2 at 40 points", () => {
    expect(passProgress(levels, 40, 0)).toEqual({ value: 40, max: 100, next: 2 });
  });
  it("premium rewards need the premium pass", () => {
    const info = { pass_premium: false, score: 500 } as PassInfo;
    expect(canClaim(info, levels[1]!, true, start + 5 * DAY)).toBe(false);
    expect(canClaim(info, levels[1]!, false, start + 5 * DAY)).toBe(true);
    expect(canClaim({ ...info, pass_premium: true }, levels[1]!, true, start + 5 * DAY)).toBe(true);
  });
  it("multi-booster rewards show as a league chest", () => {
    expect(prizeView({ claimed: false, items: { league_kiss2x: 2, league5: 1 } })?.kind).toBe("chest-league");
    expect(prizeView({ claimed: false, items: { kiss_fire: 7, refuse_slap: 3 } })?.kind).toBe("chest-choice");
  });
});
