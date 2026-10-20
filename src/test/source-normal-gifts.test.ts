import { describe, expect, it } from "vitest";
import { SOURCE_NORMAL_ENTRIES, SOURCE_NORMAL_GIFTS, injectSourceNormalGifts } from "@/lib/source-normal-gifts";
import { createSentGift } from "@/lib/gifts";
import type { CilizAssets } from "@/lib/ciliz-assets";

describe("source ordinary gift additions", () => {
  it("adds all 267 verified non-premium store entries exactly once", () => {
    const assets = { gifts: {}, giftStore: [] } as Pick<CilizAssets, "gifts" | "giftStore">;
    injectSourceNormalGifts(assets);
    injectSourceNormalGifts(assets);
    expect(assets.giftStore).toHaveLength(267);
    expect(assets.giftStore.some(entry => /^p\d+_/.test(entry.id) || entry.id.endsWith("_premium"))).toBe(false);
    expect(assets.gifts['bbq']?.storePrice).toBe(1);
  });
  it("preserves original BBQ flight, sound and skeleton selection", () => {
    const gift = SOURCE_NORMAL_GIFTS['bbq'];
    if (!gift) throw new Error("BBQ missing");
    const assets = { spines: { s_bbq: { finishSec: 4.5 } } } as unknown as CilizAssets;
    const sent = createSentGift(assets, gift, 0);
    expect(sent.flyImage).toBe(gift.flyImages[0]);
    expect(sent.startSound).toBe(gift.startSounds[0]);
    expect(sent.finishSound).toBe(gift.finishSounds[0]);
    expect(sent.spine).toBe("s_bbq");
    expect(sent.spineFinishSec).toBe(4.5);
  });
  it("keeps current CDN metadata and existing store entries intact", () => {
    const gift = SOURCE_NORMAL_GIFTS['bbq'];
    if (!gift) throw new Error("BBQ missing");
    const latest = { ...gift, storePrice: 7 };
    const assets = { gifts: { bbq: latest }, giftStore: [{ id: "bbq" }] };
    injectSourceNormalGifts(assets);
    expect(assets.gifts.bbq).toBe(latest);
    expect(assets.giftStore.filter(entry => entry.id === "bbq")).toHaveLength(1);
    expect(SOURCE_NORMAL_ENTRIES).toHaveLength(267);
  });
});