import { describe, expect, it } from "vitest";
import { CENTER_SECONDS, SPIN_SECONDS, TABLE_SEATS, eligibleTargets, leftRight, pickTarget, spinAngle, turnOfferSound } from "@/lib/bottle-game";

describe("source-derived bottle game geometry", () => {
  it("plays the original ding only when the loaded bottle offers the viewer a turn", () => {
    expect(turnOfferSound("offer", 5, 5, true)).toBe("ding");
    expect(turnOfferSound("offer", 4, 5, true)).toBeNull();
    expect(turnOfferSound("spin", 5, 5, true)).toBeNull();
    expect(turnOfferSound("offer", 5, 5, false)).toBeNull();
  });
  it("uses the twelve original seats", () => {
    expect(TABLE_SEATS).toHaveLength(12);
    expect(TABLE_SEATS[5]).toEqual([41.5,143.5]);
  });
  it("spins for five seconds and moves players to center in one second", () => {
    expect(SPIN_SECONDS).toBe(5);
    expect(CENTER_SECONDS).toBe(1);
  });
  it("points the neck at the selected seat after the source rotation", () => {
    const angle = spinAngle(0,0);
    expect(angle).toBeCloseTo(1800+Math.atan2(41.5,140.5)*180/Math.PI);
  });
  it("the local bot simulation selects an opposite alternating seat, never itself", () => {
    expect(eligibleTargets(5)).toEqual([0,2,4,6,8,10]);
    expect(pickTarget(5,0)).toBe(0);
    expect(pickTarget(5,1)).toBe(10);
  });
  it("places the selected pair in source-defined left-right order", () => {
    expect(leftRight(0,5)).toEqual([0,5]);
    expect(leftRight(5,6)).toEqual([6,5]);
  });
});