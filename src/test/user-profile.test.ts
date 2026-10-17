import { describe, expect, it } from "vitest";
import { formatHarem, okProfileUrl, okXorId, splitThousands } from "@/lib/user-profile";

describe("user profile (original presenter)", () => {
  it("splits thousands with spaces", () => expect(splitThousands(53949)).toBe("53 949"));
  it("xor-decodes OK ids back and forth", () => expect(okXorId(okXorId(123456789))).toBe(123456789));
  it("has no OK link without a numeric server id", () => {
    expect(okProfileUrl("seat-1")).toBeUndefined();
    expect(okProfileUrl("42")).toBe(`https://ok.ru/profile/${okXorId(42)}`);
  });
  it("disables the harem button on own profile without an owner", () => {
    expect(formatHarem(true, "me", null).btnIsDisabled).toBe(true);
    expect(formatHarem(false, "u", null).btnIsDisabled).toBe(false);
  });
  it("shows price + 1", () => expect(formatHarem(false, "u", { total_kisses: 0, dj_score: 0, gestures: 0, price: 102, harem_price: 0 }).price).toBe("103"));
});

import { leagueCupImage, splitStatusEmoji } from "@/lib/user-profile";
describe("profile league cup", () => {
  const leagues = [{ image: "wood" }, { image: "stone" }];
  it("is hidden below 100 received kisses", () => {
    expect(leagueCupImage({ total_kisses: 99, league: 1 }, leagues)).toBe("");
  });
  it("shows the player's league cup from 100 kisses", () => {
    expect(leagueCupImage({ total_kisses: 100, league: 1 }, leagues)).toBe("stone");
    expect(leagueCupImage({ total_kisses: 100 }, leagues)).toBe("wood");
  });
  it("wraps status emoji separately", () => {
    expect(splitStatusEmoji("hi 😀")).toEqual([{ text: "hi ", emoji: false }, { text: "😀", emoji: true }]);
  });
});
