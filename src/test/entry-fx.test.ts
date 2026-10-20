import { describe, expect, it } from "vitest";
import { joinedIds, shouldPlayEntry, tier, ENTRY_MIN } from "@/lib/entry-fx";

describe("entry fx rules", () => {
  it("level 0 gets no effect", () => { expect(shouldPlayEntry(new Map(), "a", 0, 0)).toBe(false); });
  it("same player is not replayed within 8 seconds", () => {
    const m = new Map<string, number>();
    expect(shouldPlayEntry(m, "a", 5, 0)).toBe(true);
    expect(shouldPlayEntry(m, "a", 5, 7999)).toBe(false);
    expect(shouldPlayEntry(m, "a", 5, 8000)).toBe(true);
  });
  it("banner starts at level 10", () => { expect(ENTRY_MIN).toBe(10); });
  it("tiers match ureyimsen", () => {
    expect(tier(1).name).toBe("Bürünc");
    expect(tier(10).name).toBe("Qızıl");
    expect(tier(50).name).toBe("Əfsanə");
    expect(tier(51).name).toBe("Kosmos");
    expect(tier(100).name).toBe("Mütləq");
  });
  it("detects newly seated players", () => { expect(joinedIds(["a", undefined], ["a", "b"])).toEqual(["b"]); });
});
