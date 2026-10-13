import { describe, expect, it } from "vitest";
import { closedTarget, giftReceivers, openFor, seatSelection, selectGender, setSelective } from "@/lib/gift-selection";

const V = 5;
const males = Array.from({ length: 12 }, (_, i) => i % 2 === 0);

describe("bulk gift selection", () => {
  it("solo mode sends only to the tapped player", () => {
    expect(giftReceivers(openFor(closedTarget, 2, V))).toEqual([2]);
  });
  it("tapping another player in solo mode retargets", () => {
    expect(giftReceivers(openFor(openFor(closedTarget, 2, V), 7, V))).toEqual([7]);
  });
  it("selective mode toggles players and sends to all selected at once", () => {
    let s = setSelective(openFor(closedTarget, 2, V), true);
    s = openFor(s, 7, V);
    s = openFor(s, 9, V);
    s = openFor(s, 2, V);
    expect(giftReceivers(s)).toEqual([7, 9]);
  });
  it("viewer can never be selected", () => {
    const s = openFor(setSelective(openFor(closedTarget, 2, V), true), V, V);
    expect(giftReceivers(s)).toEqual([2]);
    expect(seatSelection(s, V, V)).toBe("none");
  });
  it("men button adds every male player except the viewer", () => {
    const s = selectGender(setSelective(openFor(closedTarget, 1, V), true), males, true, V);
    expect(giftReceivers(s)).toEqual([0, 1, 2, 4, 6, 8, 10]);
  });
  it("women + men select everyone except the viewer", () => {
    let s = setSelective(openFor(closedTarget, 1, V), true);
    s = selectGender(selectGender(s, males, true, V), males, false, V);
    expect(giftReceivers(s)).toEqual([0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11]);
  });
  it("cancelling bulk mode returns to the original receiver only", () => {
    let s = selectGender(setSelective(openFor(closedTarget, 3, V), true), males, true, V);
    s = setSelective(s, false);
    expect(giftReceivers(s)).toEqual([3]);
    expect(seatSelection(s, 3, V)).toBe("highlighted");
  });
});
