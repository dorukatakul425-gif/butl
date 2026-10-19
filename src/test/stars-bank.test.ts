import { describe, expect, it } from "vitest";
import { buildStarsPayload, matchStarsPackage, parseStarsPayload, starsBankOptions, TG_STARS_PACKAGES } from "@/lib/stars-bank";

describe("Telegram Stars bankası (Ciliz ile birebir)", () => {
  it("paketler orijinal Telegram sürümüyle aynı", () => {
    expect(TG_STARS_PACKAGES).toEqual([
      { stars: 50, gold: 50, bonus: 0 },
      { stars: 250, gold: 250, bonus: 0 },
      { stars: 500, gold: 500, bonus: 0 },
      { stars: 1000, gold: 1000, bonus: 200, label: "hit" },
      { stars: 2500, gold: 2500, bonus: 625 },
      { stars: 5000, gold: 5000, bonus: 2000, label: "profitable" },
    ]);
  });

  it("görünüm büyük paket üstte, idx tersten numaralı", () => {
    const opts = starsBankOptions();
    expect(opts.map((o) => o.stars)).toEqual([5000, 2500, 1000, 500, 250, 50]);
    expect(opts.map((o) => o.idx)).toEqual([6, 5, 4, 3, 2, 1]);
    expect(opts[0]?.label?.type).toBe("profitable");
    expect(opts[2]?.label?.type).toBe("hit");
  });

  it("fatura payload'ı kurulup geri çözülebiliyor", () => {
    const payload = buildStarsPayload(1200, 1000, 123456789);
    expect(payload).toBe("hearts.1200.1000.123456789");
    expect(parseStarsPayload(payload)).toEqual({ totalGold: 1200, stars: 1000, telegramId: 123456789 });
  });

  it("bozuk payload reddedilir", () => {
    expect(parseStarsPayload("hearts.abc")).toBeNull();
    expect(parseStarsPayload("gold.100.50.1")).toBeNull();
    expect(parseStarsPayload("")).toBeNull();
  });

  it("paket eşleşmesi toplam kalbi doğrular", () => {
    expect(matchStarsPackage(1000, 1200)?.gold).toBe(1000);
    expect(matchStarsPackage(5000, 7000)?.bonus).toBe(2000);
    expect(matchStarsPackage(1000, 1000)).toBeNull(); // bonus eksik
    expect(matchStarsPackage(999, 999)).toBeNull(); // tanımsız paket
  });
});
