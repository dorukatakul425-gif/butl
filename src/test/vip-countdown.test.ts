import { describe, expect, it } from "vitest";
import { vipCountdown } from "@/lib/vip-countdown";
describe("vipCountdown", () => {
  it("7-day plan just bought", () => expect(vipCountdown(7 * 86400_000)).toBe("7g 00:00:00"));
  it("under a day", () => expect(vipCountdown(3661_000)).toBe("01:01:01"));
  it("expired shows zero", () => expect(vipCountdown(-5)).toBe("00:00:00"));
});
