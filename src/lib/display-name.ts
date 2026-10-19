/**
 * Ciliz parity: masadaki etiket "Ad, yaş" formatındadır ve Telegram adındaki
 * emojiler/semboller masada gösterilmez. Harfler (ə, ğ, ı, кириллица dahil),
 * rakamlar, boşluk ve temel noktalama kalır; gerisi silinir.
 */
export function cleanDisplayName(name: string): string {
  return name
    .replace(/[^\p{L}\p{N} .,'-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Ciliz generateNames: yaş varsa "Ad, yaş", yoksa sadece "Ad". */
export function seatLabel(name: string, age?: number): string {
  const clean = cleanDisplayName(name);
  return age && age > 0 ? `${clean}, ${age}` : clean;
}
