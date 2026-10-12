import { translate, type CilizAssets, type CilizGift, type GiftStickPoint } from "@/lib/ciliz-assets";

/** Ported from the Gift class in preloader.js: one concrete sent gift. */
export interface SentGift {
  type: string;
  random: number;
  flyImage: string;
  stickImage: string;
  spine?: string | undefined;
  spineFinishSec?: number | undefined;
  startSound: string;
  finishSound: string;
  stickPoint: GiftStickPoint;
  vfx?: string | undefined;
}

export const RAND_MOD = 233280;

/** random(seed) LCG from preloader.js (used for the 'ava' stick position). */
export function seededRandom(seed: number) {
  let s = Math.round(seed || 0);
  return () => {
    s = ((s % RAND_MOD) * 9301 + 49297) % RAND_MOD;
    return s / RAND_MOD;
  };
}

export function createSentGift(assets: CilizAssets, d: CilizGift, randomValue: number): SentGift {
  const random = Math.round(randomValue || 0);
  const pick = <T,>(list: T[]) => list[random % list.length] as T;
  const spines = d.spine_v2 || d.spine;
  const spine = spines?.length ? pick(spines) : undefined;
  return {
    type: d.type,
    random,
    flyImage: pick(d.flyImages),
    stickImage: pick(d.stickImages),
    spine,
    spineFinishSec: spine ? assets.spines[spine]?.finishSec : undefined,
    startSound: pick(d.startSounds),
    finishSound: pick(d.finishSounds),
    stickPoint: d.stickPoint,
    vfx: d.vfx,
  };
}

export interface GiftStoreItem {
  type: string;
  name: string;
  image: string;
  price: number;
  gift: CilizGift;
}

/** Store list (gifts.__store) filtered the same way the game hides unavailable entries. */
export function buildGiftItems(assets: CilizAssets, social: string): GiftStoreItem[] {
  const seen = new Set<string>();
  const items: GiftStoreItem[] = [];
  for (const entry of assets.giftStore) {
    if (entry.id.startsWith("__") || entry.birthday || seen.has(entry.id)) continue;
    if (entry.social && !entry.social.includes(social)) continue;
    const gift = assets.gifts[entry.id];
    if (!gift || !gift.storeImage || !assets.images[gift.storeImage]) continue;
    seen.add(entry.id);
    items.push({
      type: entry.id,
      name: translate(assets, `${gift.category}:${gift.type}`),
      image: gift.storeImage,
      price: gift.storePrice,
      gift,
    });
  }
  return items;
}
