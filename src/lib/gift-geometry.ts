import { seededRandom, type SentGift } from "@/lib/gifts";
import { ASSETS_TO_VIRTUAL, type CilizAssets } from "@/lib/ciliz-assets";

// TableUserView.photoFrame and GiftAnimations, in the source's 375px table space.
export const PHOTO_SIZE = 64;
export const PHOTO_SHADOW_SIZE = 8;
export const GIFT_SCALE = 0.75;
export const OVER_SCALE = 1.3 * GIFT_SCALE;
export const FLY_SEC = 5;
export const PHOTO_FRAME = { x: -32, y: -32, width: 64, height: 64 };

export function giftImageFrame(assets: CilizAssets, name: string) {
  const meta = assets.images[name];
  const size = meta?.size_v2 || meta?.size || [];
  return {
    x: -(size[0] ?? 0) * ASSETS_TO_VIRTUAL,
    y: -(size[1] ?? 0) * ASSETS_TO_VIRTUAL,
    width: (size[2] ?? 0) * ASSETS_TO_VIRTUAL,
    height: (size[3] ?? 0) * ASSETS_TO_VIRTUAL,
  };
}

export function calcGiftPosition(gift: Pick<SentGift, "stickPoint" | "random">) {
  switch (gift.stickPoint) {
    case "ava": {
      const random = seededRandom(gift.random);
      return { x: -32 + random() * 64, y: -32 + random() * 64, scale: GIFT_SCALE, rotation: 360 * random() };
    }
    case "drink": return { x: 32, y: 32, scale: GIFT_SCALE, rotation: 0 };
    case "hat": return { x: -32, y: -32, scale: GIFT_SCALE, rotation: -45 };
  }
}