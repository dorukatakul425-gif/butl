import { describe, expect, it } from "vitest";
import { injectSourcePremiumGifts, premiumImageUrl, SOURCE_GIFT_STORE } from "@/lib/source-premium-gifts";
import { sfxUrl } from "@/lib/sfx";

describe("source premium gifts", () => {
  it("adds premium definitions and keeps the live store order", () => {
    const assets = { gifts: { tomato: { type: "tomato" } }, images: {}, giftStore: [{ id: "tomato" }] } as never;
    injectSourcePremiumGifts(assets);
    const ids = (assets as { giftStore: { id: string }[] }).giftStore.map(e => e.id);
    expect(ids).toContain("p71_crown1");
    expect(ids).toContain("p1_firework");
    expect(ids.indexOf("p71_crown1")).toBeLessThan(ids.indexOf("p79_latte"));
    expect(SOURCE_GIFT_STORE.length).toBe(621);
  });

  it("serves premium images from room-assets in the same bundle folder", () => {
    expect(premiumImageUrl("https://x/bottle/bundle/180/${name}?v", "g_p2_crown1")).toBe("/room-assets/premium-gifts/180/g_p2_crown1.webp");
    expect(premiumImageUrl("https://x/bottle/bundle/dlg200/${name}?v", "g_p6_crown1")).toBe("/room-assets/premium-gifts/dlg200/g_p6_crown1.webp");
    expect(premiumImageUrl("https://x/bottle/bundle/180/${name}?v", "g_tomato1")).toBe("");
  });

  it("plays mg_ sounds from room-assets", () => {
    expect(sfxUrl("https://cdn/sfx/${name}", "mg_p6_crown_queen")).toBe("/room-assets/sfx/mg_p6_crown_queen.mp3");
    expect(sfxUrl("https://cdn/sfx/${name}", "tick")).toBe("https://cdn/sfx/tick.mp3");
  });
});
