import { describe, expect, it } from "vitest";
import { CUSTOM_FRAMES, LEVEL_FRAMES, customFrameUrl, injectCustomFrames, isLevelFrameOpen } from "@/lib/custom-frames";

describe("ureyimsen custom frames", () => {
  it("has 15 level frames from level 20 to 100", () => {
    expect(LEVEL_FRAMES).toHaveLength(15);
    expect(LEVEL_FRAMES[0]).toEqual({ key: "cf_42", level: 20 });
    expect(LEVEL_FRAMES.at(-1)).toEqual({ key: "cf_1135", level: 100 });
    for (const f of LEVEL_FRAMES) expect(CUSTOM_FRAMES[f.key]).toBeTruthy();
  });

  it("opens a level frame only when the gift level reaches it", () => {
    expect(isLevelFrameOpen(20, 19)).toBe(false);
    expect(isLevelFrameOpen(20, 20)).toBe(true);
  });

  it("registers frames and resolves animated image urls", () => {
    const assets = { frames: {}, images: {} } as Parameters<typeof injectCustomFrames>[0];
    injectCustomFrames(assets);
    expect(assets.frames["cf_42"]?.custom).toBe("cf_42");
    expect(customFrameUrl("cfimg_cf_42_store")).toBe("/custom-frames/42_3_female.anim.png");
  });
});
