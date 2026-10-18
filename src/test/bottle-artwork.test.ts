import { describe, expect, it, vi } from "vitest";
vi.mock("pixi.js", () => {
  class Sprite {
    width = 0; height = 0;
    anchor = { set: vi.fn() };
    static from(image: HTMLImageElement) { return Object.assign(new Sprite(), { image }); }
  }
  return { Sprite, Texture: { from: (image: HTMLImageElement) => image }, Container: class {}, Mesh: class {}, Program: {}, QuadUv: class {}, Rectangle: class {}, Shader: class {} };
});
import { originalBottle } from "@/components/table/original-bottle";
import { realBottleFallback } from "@/lib/real-bottle-fallback";
import type { CilizAssets } from "@/lib/ciliz-assets";
const assets = {
  bottles: { cola: { type: "cola", image: "b_cola_v2", bottle3d: "b_cola_v2", storePrice: 5 } },
  bottle3d: { b_cola_v2: {} },
  images: { b_cola_v2: { size: [-30, -90, 60, 160] } },
  bundles: [{ size: 1125, url: "https://example.com/${name}" }],
} as unknown as CilizAssets;
describe("real bottle artwork recovery", () => {
  for (const missing of ["base", "luminosity", "normal", "shadow"]) {
    it(`keeps selected cola artwork when its ${missing} texture fails`, async () => {
      const load = vi.fn(async (url: string) => {
        if (url.endsWith(`.${missing}.png`)) throw new Error("CDN failure");
        return { src: url } as HTMLImageElement;
      });
      const sprite = await originalBottle(assets, "cola", 1125, load, { rotation: 0 } as never);
      expect((sprite as unknown as { image: HTMLImageElement }).image.src).toBe("https://example.com/b_cola_v2.png");
      expect(load).not.toHaveBeenCalledWith(realBottleFallback);
    });
  }
  it("uses embedded real artwork when all hosted textures are unavailable", async () => {
    const load = vi.fn(async (url: string) => {
      if (url !== realBottleFallback) throw new Error("Offline");
      return { src: url } as HTMLImageElement;
    });
    const sprite = await originalBottle(assets, "cola", 1125, load, { rotation: 0 } as never);
    expect((sprite as unknown as { image: HTMLImageElement }).image.src).toBe(realBottleFallback);
    expect(sprite.width).toBeCloseTo(63 * (375 / 704) * 1.17);
    expect(sprite.height).toBeCloseTo(173 * (375 / 704) * 1.17);
  });
});
