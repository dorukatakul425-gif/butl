// Live voice-room gift catalog (TikTok-style tiers). "small" = side combo banner + fly to seat,
// "medium" = banner + centre pop, "big" = full-screen scene, "video" = the Pegasus clip.
import type { Language } from "@/lib/app-preferences";

export type GiftTier = "small" | "medium" | "big" | "video";
export type LiveGift = { key: string; icon: string; tier: GiftTier; name: Record<Language, string> };

const n = (az: string, tr: string, ru: string, en: string): Record<Language, string> => ({ az, tr, ru, en });

export const LIVE_GIFTS: LiveGift[] = [
  { key: "rose", icon: "🌹", tier: "small", name: n("Qızılgül", "Gül", "Роза", "Rose") },
  { key: "heart", icon: "💖", tier: "small", name: n("Ürək", "Kalp", "Сердце", "Heart") },
  { key: "fingerheart", icon: "🫰", tier: "small", name: n("Barmaq ürək", "Parmak kalp", "Сердечко", "Finger Heart") },
  { key: "donut", icon: "🍩", tier: "small", name: n("Donut", "Donut", "Пончик", "Doughnut") },
  { key: "icecream", icon: "🍦", tier: "small", name: n("Dondurma", "Dondurma", "Мороженое", "Ice Cream") },
  { key: "perfume", icon: "🧴", tier: "medium", name: n("Ətir", "Parfüm", "Духи", "Perfume") },
  { key: "sunglasses", icon: "🕶️", tier: "medium", name: n("Eynək", "Gözlük", "Очки", "Sunglasses") },
  { key: "teddy", icon: "🧸", tier: "medium", name: n("Ayıcıq", "Ayıcık", "Мишка", "Teddy Bear") },
  { key: "fireworks", icon: "🎆", tier: "medium", name: n("Fişəng", "Havai fişek", "Салют", "Fireworks") },
  { key: "car", icon: "🏎️", tier: "big", name: n("İdman maşını", "Spor araba", "Спорткар", "Sports Car") },
  { key: "rocket", icon: "🚀", tier: "big", name: n("Raket", "Roket", "Ракета", "Rocket") },
  { key: "lion", icon: "🦁", tier: "big", name: n("Şir", "Aslan", "Лев", "Lion") },
  { key: "castle", icon: "🏰", tier: "big", name: n("Qala", "Şato", "Замок", "Castle") },
  { key: "universe", icon: "🌌", tier: "big", name: n("Kainat", "Evren", "Вселенная", "Universe") },
  { key: "video", icon: "🦄", tier: "video", name: n("Peqas", "Pegasus", "Пегас", "Pegasus") },
];

export const giftByKey = (k?: string) => LIVE_GIFTS.find((g) => g.key === k);
export const isLiveGift = (k?: string) => Boolean(giftByKey(k));
/** Combo window: same sender + gift + receiver within this many ms counts up "x2, x3…". */
export const COMBO_MS = 3000;
