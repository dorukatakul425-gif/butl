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
    // Scroll offset reduces the shift (original: keyboardHeight - scrollY).
    expect(keyboardScrollTarget(300, 100, 700, 500)).toBe(0);
    // Never scrolls to a negative position.
    expect(keyboardScrollTarget(100, 0, 560, 500)).toBe(40);
  });
});
