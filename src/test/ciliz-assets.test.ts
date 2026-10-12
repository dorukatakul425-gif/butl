import { describe, expect, it } from "vitest";
import { bundleUrl, dialogImage, type CilizAssets } from "@/lib/ciliz-assets";

const assets: CilizAssets = {
  frames: {}, stones: {}, decor: [], translation: {}, gifts: {}, giftStore: [], spines: {}, sfxUrl: "",
  images: { fp_nitrodecor_v2: { size: [0, 0, 42, 42] } },
  bundles: [{ size: 450, url: "https://example.com/table120/${name}" }],
  dialogBundles: [
    { dpr: 1, url: "https://example.com/dlg100/${name}" },
    { dpr: 2, url: "https://example.com/dlg200/${name}" },
    { dpr: 3, url: "https://example.com/dlg300/${name}" },
  ],
};

describe("Ciliz source bundle selection", () => {
  it("loads store thumbnails from the dedicated dialog bundle", () => {
    expect(dialogImage(assets, "fp_nitrodecor_v2", 42, 42).src).toBe("https://example.com/dlg100/fp_nitrodecor_v2.png");
  });
  it("keeps animated table skeletons in the table bundle", () => {
    expect(bundleUrl(assets, "s_f_nitrodecor", "json", 375)).toBe("https://example.com/table120/s_f_nitrodecor.json");
  });
  it("selects the sharper dialog bundle on high density screens", () => {
    const original = window.devicePixelRatio;
    Object.defineProperty(window, "devicePixelRatio", { value: 2, configurable: true });
    try {
      expect(dialogImage(assets, "fp_nitrodecor_v2", 42, 42).src).toBe("https://example.com/dlg200/fp_nitrodecor_v2.png");
    } finally {
      Object.defineProperty(window, "devicePixelRatio", { value: original, configurable: true });
    }
  });
});