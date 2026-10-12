import { describe, expect, it } from "vitest";
import { bankOptions, bonusPercent, translatePrice } from "@/lib/bank";
import type { CilizAssets } from "@/lib/ciliz-assets";

const assets = { translation: { "mobile:ok:bank:real": "% OK", "bank:hit": "En popüler", "bank:profitable": "Hesaplı" } } as unknown as CilizAssets;

describe("bank", () => {
  it("lists the seven OK heart packs from largest to smallest", () => {
    const opts = bankOptions(assets);
    expect(opts.map((o) => o.gold)).toEqual([5000, 1000, 500, 200, 100, 50, 10]);
    expect(opts.map((o) => o.idx)).toEqual([7, 6, 5, 4, 3, 2, 1]);
  });
  it("labels 200 as most popular and 5000 as profitable", () => {
    const opts = bankOptions(assets);
    expect(opts.find((o) => o.gold === 200)?.label?.text).toBe("En popüler");
    expect(opts.find((o) => o.gold === 5000)?.label?.type).toBe("profitable");
  });
  it("formats prices and bonus percent like the original", () => {
    expect(translatePrice(assets, 200)).toBe("200 OK");
    expect(bonusPercent(5000, 1750)).toBe(35);
  });
});
