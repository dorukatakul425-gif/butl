import { describe, expect, it } from "vitest";
import { cleanDisplayName, seatLabel } from "../lib/display-name";
import { telegramIdentity } from "../lib/telegram-profile-sync";

describe("masa isim etiketi (Ciliz parity)", () => {
  it("emojiler ve semboller silinir", () => {
    expect(cleanDisplayName("Aysel 😍🔥")).toBe("Aysel");
    expect(cleanDisplayName("⭐Elvin⭐")).toBe("Elvin");
    expect(cleanDisplayName("💃🏻 Nigar ❤️")).toBe("Nigar");
  });

  it("harfler, rakamlar ve temel noktalama kalır", () => {
    expect(cleanDisplayName("Əli Qəribov")).toBe("Əli Qəribov");
    expect(cleanDisplayName("O'Neil Jr.")).toBe("O'Neil Jr.");
    expect(cleanDisplayName("Дмитрий 1990")).toBe("Дмитрий 1990");
  });

  it("ardışık boşluklar tekle iner ve kenarlar kırpılır", () => {
    expect(cleanDisplayName("  Aysel   M.  ")).toBe("Aysel M.");
  });

  it("etiket Ciliz formatında: yaş varsa 'Ad, yaş'", () => {
    expect(seatLabel("Aysel", 25)).toBe("Aysel, 25");
    expect(seatLabel("Aysel 😍", 25)).toBe("Aysel, 25");
  });

  it("yaş yoksa ya da sıfırsa sadece ad gösterilir", () => {
    expect(seatLabel("Aysel")).toBe("Aysel");
    expect(seatLabel("Aysel", 0)).toBe("Aysel");
  });

  it("Telegram kimliği Ciliz gibi sadece first_name kullanır ve emojiyi temizler", () => {
    expect(telegramIdentity({ id: 42, first_name: "Bey 😎", last_name: "Hanım" }).name).toBe("Bey");
    expect(telegramIdentity({ id: 42, first_name: "🔥🔥" }).name).toBe("Telegram");
  });
});
