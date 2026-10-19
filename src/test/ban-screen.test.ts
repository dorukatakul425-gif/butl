import { describe, expect, it } from "vitest";
import { formatBanRemaining } from "@/lib/ban";

describe("formatBanRemaining (Ciliz rounding rules)", () => {
  it("under 1 hour shows minutes", () => {
    expect(formatBanRemaining(45 * 60000)).toEqual({ value: 45, unit: "dəqiqə" });
  });
  it("rounds partial minutes up", () => {
    expect(formatBanRemaining(61000)).toEqual({ value: 2, unit: "dəqiqə" });
  });
  it("under 1 day shows hours", () => {
    expect(formatBanRemaining(5 * 3600000)).toEqual({ value: 5, unit: "saat" });
  });
  it("rounds partial hours up", () => {
    expect(formatBanRemaining(3600000 + 1)).toEqual({ value: 2, unit: "saat" });
  });
  it("1 day and more shows days", () => {
    expect(formatBanRemaining(3 * 86400000)).toEqual({ value: 3, unit: "gün" });
  });
  it("rounds partial days up", () => {
    expect(formatBanRemaining(86400000 + 1)).toEqual({ value: 2, unit: "gün" });
  });
});
