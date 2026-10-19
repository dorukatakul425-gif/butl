// Telegram Stars bankası — Ciliz Telegram sürümünün purchaseOptions() çıktısıyla birebir aynı paketler.
// Fiyatlar Stars (⭐) cinsinden; ödeme Telegram'ın kendi fatura ekranıyla alınır.

export const TG_STARS_PACKAGES = [
  { stars: 50, gold: 50, bonus: 0 },
  { stars: 250, gold: 250, bonus: 0 },
  { stars: 500, gold: 500, bonus: 0 },
  { stars: 1000, gold: 1000, bonus: 200, label: "hit" },
  { stars: 2500, gold: 2500, bonus: 625 },
  { stars: 5000, gold: 5000, bonus: 2000, label: "profitable" },
] as const;

export interface StarsOptionView {
  stars: number;
  gold: number;
  bonus: number;
  idx: number;
  label?: { type: "hit" | "profitable" } | undefined;
}

/** BankDialog ile aynı sıralama: büyük paket üstte, idx = options.length - i. */
export function starsBankOptions(): StarsOptionView[] {
  const sorted = [...TG_STARS_PACKAGES].sort((a, b) => b.gold - a.gold);
  return sorted.map((o, i) => ({
    stars: o.stars,
    gold: o.gold,
    bonus: o.bonus,
    idx: sorted.length - i,
    label: "label" in o ? { type: o.label } : undefined,
  }));
}

/** Fatura payload'ı: hearts.{toplamKalp}.{stars}.{telegramId} — bot ödemeyi buna göre doğrular. */
export function buildStarsPayload(totalGold: number, stars: number, telegramId: number) {
  return `hearts.${totalGold}.${stars}.${telegramId}`;
}

export function parseStarsPayload(payload: string): { totalGold: number; stars: number; telegramId: number } | null {
  const m = /^hearts\.(\d+)\.(\d+)\.(\d+)$/.exec(payload);
  if (!m) return null;
  return { totalGold: Number(m[1]), stars: Number(m[2]), telegramId: Number(m[3]) };
}

/** Paket tanımlı mı ve payload'daki toplam kalp paketle uyuşuyor mu? */
export function matchStarsPackage(stars: number, totalGold: number) {
  const pk = TG_STARS_PACKAGES.find((p) => p.stars === stars);
  return pk && pk.gold + pk.bonus === totalGold ? pk : null;
}
