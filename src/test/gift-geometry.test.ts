import { describe, expect, it } from "vitest";
import { calcGiftPosition, giftImageFrame, PHOTO_SIZE, PHOTO_SHADOW_SIZE, FLY_SEC, OVER_SCALE } from "@/lib/gift-geometry";
import { ASSETS_TO_VIRTUAL, type CilizAssets } from "@/lib/ciliz-assets";

describe("original game profile and gift geometry", () => {
  it("keeps the original 64px photo and 8px shadow", () => {
    expect(PHOTO_SIZE).toBe(64);
    expect(PHOTO_SHADOW_SIZE).toBe(8);
  });
  it("attaches drinks at the bottom right at original scale", () => {
    expect(calcGiftPosition({ stickPoint: "drink", random: 0 })).toEqual({ x: 32, y: 32, scale: 0.75, rotation: 0 });
  });
  it("attaches hats at the top left with original rotation", () => {
    expect(calcGiftPosition({ stickPoint: "hat", random: 0 })).toEqual({ x: -32, y: -32, scale: 0.75, rotation: -45 });
  });
  it("uses source seeded positions for avatar gifts", () => {
    const point = calcGiftPosition({ stickPoint: "ava", random: 0 });
    expect(point.x).toBeCloseTo(-32 + 49297 / 233280 * 64);
    expect(point.y).toBeCloseTo(-32 + 165494 / 233280 * 64);
    expect(point.rotation).toBeCloseTo(127551 / 233280 * 360);
  });
  it("retains server image offsets and v2 dimensions before flight scaling", () => {
    const assets = { images: { tomato: { size: [1, 2, 3, 4], size_v2: [-20, -30, 40, 60] } } } as unknown as CilizAssets;
    expect(giftImageFrame(assets, "tomato")).toEqual({ x: 20 * ASSETS_TO_VIRTUAL, y: 30 * ASSETS_TO_VIRTUAL, width: 40 * ASSETS_TO_VIRTUAL, height: 60 * ASSETS_TO_VIRTUAL });
  });
  it("keeps the five-second source flight and overshoot", () => {
    expect(FLY_SEC).toBe(5);
    expect(OVER_SCALE).toBeCloseTo(0.975);
  });
});