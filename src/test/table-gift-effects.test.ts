import { describe, expect, it } from "vitest";
import { matchingTableEffects } from "@/lib/table-gift-effects";

const rules: Array<[string, Array<[string, number]>]> = [
  ["balloon1", [["leninbadge", 10], ["lenincap", 9]]],
  ["balloon2", [["smilecup", 10], ["smile", 11]]],
  ["confetti", [["birthdaycake", 9], ["partyhat", 9]]],
  ["flower", [["perfume", 9], ["roser", 11]]],
  ["ghost", [["candle", 12], ["pumpkin", 12], ["witch", 12]]],
  ["heart", [["romanticcandle", 9], ["valentine", 9]]],
  ["heart2", [["lipstick", 8], ["bikinitop", 10]]],
  ["leaf", [["mushroomsbasket", 9], ["leaf", 11], ["wreath", 9]]],
  ["pacifier", [["bomb", 11], ["clownhat", 9]]],
  ["photo", [["camera", 7], ["polaroid", 11]]],
  ["roll", [["trout", 11], ["japanesesushi", 6]]],
  ["snow", [["winterhat", 6], ["snowman8", 6]]],
  ["sock", [["canteen", 6], ["goldstar", 11], ["helmet", 9]]],
];
describe("original 12-player gift combo thresholds", () => {
  it.each(rules)("triggers %s at the source thresholds, not below", (name, requirements) => {
    const seats = Array.from({ length: 12 }, (_, seat) => requirements.filter(([, count]) => seat < count).map(([type]) => type));
    expect(matchingTableEffects(seats)).toContain(name);
    for (const [type, count] of requirements) {
      const below = seats.map((types, index) => index === count - 1 ? types.filter(value => value !== type) : [...types]);
      expect(matchingTableEffects(below)).not.toContain(name);
    }
  });
  it("requires all twelve seats to be occupied", () => {
    expect(matchingTableEffects(Array.from({ length: 11 }, () => ["snowman1", "winterhat"]))).toEqual([]);
  });
  it("counts matching players, not repeated gifts on one player", () => {
    expect(matchingTableEffects([Array(12).fill("camera").concat(Array(12).fill("polaroid")), ...Array.from({ length: 11 }, () => [])])).not.toContain("photo");
  });
});