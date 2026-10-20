import catalog from "./live-premium-gifts-data.json";

/**
 * ureyimsen "💎 Premium" live gifts (premium_gift_info entries with live:true).
 * Each one plays a full-screen alpha video (left half colour, right half alpha) with sound
 * for everyone at the table (game_live_gift -> Fd.play).
 */
export interface LivePremiumGift { name: string; effect_id: number; gift_id: number; icon: string; video: string; dat: number; reward_dat: number }

export const LIVE_PREMIUM_GIFTS = catalog as Record<string, LivePremiumGift>;

export function livePremiumGift(type: string): LivePremiumGift | undefined {
  return Object.prototype.hasOwnProperty.call(LIVE_PREMIUM_GIFTS, type) ? LIVE_PREMIUM_GIFTS[type] : undefined;
}

export const isLivePremiumGift = (type: string) => Boolean(livePremiumGift(type));
