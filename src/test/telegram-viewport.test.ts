import { describe, expect, it } from "vitest";
import { isTelegramWebApp, keyboardScrollTarget } from "@/lib/telegram-viewport";

describe("telegram viewport", () => {
  it("detects the Mini App only when initData is present", () => {
    expect(isTelegramWebApp({} as Window)).toBe(false);
    expect(isTelegramWebApp({ Telegram: { WebApp: {} } } as unknown as Window)).toBe(false);
    expect(isTelegramWebApp({ Telegram: { WebApp: { initData: "query_id=abc" } } } as unknown as Window)).toBe(true);
  });

  it("mirrors the original iOS keyboard scroll algorithm", () => {
    // Keyboard 300px, input bottom at 700, visible height 500 → scroll 100
    // (original: scrollTo = keyboardHeight - (inputBottom - innerHeight)).
    expect(keyboardScrollTarget(300, 0, 700, 500)).toBe(100);
    // No keyboard → no scroll.
    expect(keyboardScrollTarget(0, 0, 700, 500)).toBeNull();
    // Verbatim original: input above the visible area still scrolls by
    // keyboardHeight - distanceToInput (the original only fires while an
    // input is focused, so this path keeps that exact behavior).
    expect(keyboardScrollTarget(300, 0, 400, 500)).toBe(400);
    // Scroll offset reduces the shift check, but the target stays
    // keyboardHeight - distanceToInput (verbatim original).
    expect(keyboardScrollTarget(300, 100, 700, 500)).toBe(100);
    // Never scrolls to a negative position.
    expect(keyboardScrollTarget(100, 0, 560, 500)).toBe(40);
  });
});

describe("iosPortraitSafeArea (original iosSafeArea.ts map)", () => {
  it("returns the device bottom inset for known iPhones", async () => {
    const { iosPortraitSafeArea } = await import("@/lib/telegram-viewport");
    expect(iosPortraitSafeArea(393, 852, 3)).toEqual({ top: 59, right: 0, bottom: 34, left: 0 });
    expect(iosPortraitSafeArea(375, 812, 2)).toEqual({ top: 44, right: 0, bottom: 31, left: 0 });
  });
  it("returns undefined for devices without a home-indicator inset", async () => {
    const { iosPortraitSafeArea } = await import("@/lib/telegram-viewport");
    expect(iosPortraitSafeArea(320, 568, 2)).toBeUndefined();
    expect(iosPortraitSafeArea(768, 1024, 2)).toBeUndefined();
  });
});

describe("telegramSafeAreaBottom (Android white strip)", () => {
  it("uses contentSafeAreaInset.bottom on Android", async () => {
    const { telegramSafeAreaBottom } = await import("@/lib/telegram-viewport");
    expect(
      telegramSafeAreaBottom({
        platform: "android",
        contentSafeAreaInset: { top: 24, bottom: 16, left: 0, right: 0 },
        safeAreaInset: { top: 24, bottom: 48, left: 0, right: 0 },
      }),
    ).toBe(16);
  });
  it("falls back to safeAreaInset.bottom when contentSafeAreaInset is absent", async () => {
    const { telegramSafeAreaBottom } = await import("@/lib/telegram-viewport");
    expect(
      telegramSafeAreaBottom({
        platform: "android",
        safeAreaInset: { top: 24, bottom: 48, left: 0, right: 0 },
      }),
    ).toBe(48);
  });
  it("keeps the iOS device-table inset on iOS and 0 when nothing is known", async () => {
    const { telegramSafeAreaBottom } = await import("@/lib/telegram-viewport");
    expect(telegramSafeAreaBottom({ platform: "ios" }, 34)).toBe(34);
    expect(telegramSafeAreaBottom({ platform: "android" })).toBe(0);
  });
});
