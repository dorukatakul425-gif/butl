import { describe, expect, it } from "vitest";
import { fromDisplay, toDisplay, VIEWER_DISPLAY_SEAT } from "@/lib/room-session";

describe("room seat rotation", () => {
  it("always shows the viewer at seat 5", () => {
    for (let mySeat = 0; mySeat < 12; mySeat++) expect(toDisplay(mySeat, mySeat)).toBe(VIEWER_DISPLAY_SEAT);
  });
  it("round-trips every seat", () => {
    for (let mySeat = 0; mySeat < 12; mySeat++) for (let s = 0; s < 12; s++) expect(fromDisplay(toDisplay(s, mySeat), mySeat)).toBe(s);
  });
});
