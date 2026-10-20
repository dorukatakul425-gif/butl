import catalog from "./source-premium-gifts-data.json";
import type { CilizAssets, CilizGift, CilizGiftStoreEntry } from "./ciliz-assets";

/**
 * ureyimsen live gift catalog: premium packs (p1_…p79_) with their image meta, plus the
 * exact gifts.__store order (premium entries interleaved with ordinary ones).
 */
export const SOURCE_PREMIUM_GIFTS = catalog.gifts as unknown as Record<string, CilizGift>;
export const SOURCE_PREMIUM_IMAGES = catalog.images as Record<string, { size: number[]; size_v2?: number[] }>;
export const SOURCE_GIFT_STORE = catalog.store as unknown as CilizGiftStoreEntry[];

const PREMIUM_IMAGE = /^[gs]_p[0-9]+_/;

export function isPremiumImage(name: string) {
  return PREMIUM_IMAGE.test(String(name));
}

/** Wa.url(): premium images live next to the vendor bundles under /room-assets/premium-gifts/<bundle>/. */
export function premiumImageUrl(bundleTemplate: string, name: string) {
  if (!isPremiumImage(name)) return "";
  const match = /\/bundle\/(dlg\d+|\d+)\//.exec(bundleTemplate);
  return match ? `/room-assets/premium-gifts/${match[1]}/${name}.webp` : "";
}

/** Adds premium definitions and switches the store list to the live source order. */
export function injectSourcePremiumGifts(assets: Pick<CilizAssets, "gifts" | "giftStore" | "images">) {
  for (const [id, gift] of Object.entries(SOURCE_PREMIUM_GIFTS)) assets.gifts[id] ??= gift;
  for (const [name, meta] of Object.entries(SOURCE_PREMIUM_IMAGES)) assets.images[name] ??= meta;
  const known = new Map(assets.giftStore.map(entry => [entry.id, entry]));
  const order: CilizGiftStoreEntry[] = [];
  const seen = new Set<string>();
  for (const entry of SOURCE_GIFT_STORE) {
    if (seen.has(entry.id)) continue;
    if (!entry.id.startsWith("__") && !assets.gifts[entry.id]) continue;
    seen.add(entry.id);
    order.push(known.get(entry.id) ?? entry);
  }
  // Keep anything the vendor list has that the source list does not (e.g. scheduled entries).
  for (const entry of assets.giftStore) if (!seen.has(entry.id)) { seen.add(entry.id); order.push(entry); }
  assets.giftStore = order;
}
