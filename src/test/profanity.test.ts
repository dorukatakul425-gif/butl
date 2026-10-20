import { describe, it, expect } from "vitest";
import { checkProfanity, isClean } from "@/lib/profanity";

describe("room title profanity filter", () => {
  it.each(["peyser", "Peysər", "gijdillax", "gicdilax", "gicdillax", "gicdıllax", "gıcdıllaq", "gıcdıllax", "seks", "porn", "qəhbə", "üəhvə", "qəhi"])("blocks user-listed word %s", (w) => {
    expect(isClean(w)).toBe(false);
  });
  it.each(["P3YS3R otağı", "q e h b e", "QƏHBƏƏƏ", "s.i.k.d.i.r", "сука", "blyat", "f u c k", "Orospu", "ПОРНО", "s3ks"])("blocks evasion %s", (w) => {
    expect(isClean(w)).toBe(false);
  });
  it.each(["Xalalar gelmesin", "Dubai", "Musiqi otağı", "Qəhvə və söhbət", "Nikostudio", "Amina", "Analiz", "By_Riko", "Bakı gecələri"])("allows clean title %s", (w) => {
    expect(checkProfanity(w).clean).toBe(true);
  });
});
describe("no false positives on common words", () => {
  it.each(["Şəhər otağı", "Səhifə", "Nigar", "Sugar", "Mandarin", "Salavat", "Pedigree"])("allows %s", (w) => {
    expect(isClean(w)).toBe(true);
  });
  it.each(["sex", "сука", "nigga"])("still blocks whole word %s", (w) => {
    expect(isClean(w)).toBe(false);
  });
});
import { SEAT_COUNT } from "@/lib/voice-rtc";
describe("voice room seats", () => {
  it("has 10 numbered seats (two rows of five)", () => { expect(SEAT_COUNT).toBe(10); });
});
