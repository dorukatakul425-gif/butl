import catalog from "./source-normal-gifts-data.json";
import type { CilizAssets, CilizGift } from "./ciliz-assets";

/** Verified ordinary additions from the live source store; premium packs remain unchanged. */
export const SOURCE_NORMAL_GIFTS = catalog.gifts as Record<string, CilizGift>;
export const SOURCE_NORMAL_ENTRIES = catalog.entries;

export function injectSourceNormalGifts(assets: Pick<CilizAssets, "gifts" | "giftStore">) {
  const seen = new Set(assets.giftStore.map(entry => entry.id));
  for (const entry of SOURCE_NORMAL_ENTRIES) {
    // Prefer the live CDN definition so geometry, sound and Spine versions stay together.
    const source = SOURCE_NORMAL_GIFTS[entry.id];
    if (!source) continue;
    assets.gifts[entry.id] ??= source;
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    assets.giftStore.push(entry);
  }
}