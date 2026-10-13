import { describe, expect, it } from "vitest";
import { CENTER_SECONDS, RETURN_SECONDS, CENTER_PLAYER_SCALE, SPIN_SECONDS, TABLE_SEATS, eligibleTargets, leftRight, pickTarget, spinAngle, turnOfferSound, decisionArrowsVisible, decisionTimerVisible, spinDelayMs } from "@/lib/bottle-game";

describe("source-derived bottle game geometry", () => {
  it("spins the bottle automatically 9 seconds into the viewer's turn", () => {
    expect(spinDelayMs(5,5)).toBe(9000);
    expect(spinDelayMs(4,5,0)).toBe(1400);
  });
  it("removes decision arrows as soon as the players start returning", () => {
    expect(decisionArrowsVisible("choose")).toBe(true);
    expect(decisionArrowsVisible("result")).toBe(true);
    expect(decisionArrowsVisible("return")).toBe(false);
    expect(decisionArrowsVisible("offer")).toBe(false);
  });
  it("hides the viewer countdown after their decision while observers retain it", () => {
    expect(decisionTimerVisible("choose",true,false)).toBe(true);
    expect(decisionTimerVisible("choose",true,true)).toBe(false);
    expect(decisionTimerVisible("choose",false,true)).toBe(true);
    expect(decisionTimerVisible("return",false,false)).toBe(false);
  });
  it("uses the original half-second return and 69-pixel centered photo scale", () => {
    expect(RETURN_SECONDS).toBe(0.5);
    expect(CENTER_PLAYER_SCALE*64).toBe(69);
  });
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