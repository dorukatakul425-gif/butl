import { describe, expect, it } from "vitest";
import { needsTranslation } from "@/lib/chat-translation";

describe("chat translation link", () => {
  it("shows only for other players with a different locale", () => {
    expect(needsTranslation({ locale: "ru" }, "tr")).toBe(true);
    expect(needsTranslation({ locale: "tr" }, "tr")).toBe(false);
    expect(needsTranslation({}, "tr")).toBe(false);
    expect(needsTranslation({ locale: "ru", isViewer: true }, "tr")).toBe(false);
  });
});

describe("chat translation by message language", () => {
  it("offers translation for a foreign-language message when the sender has no locale", () => {
    expect(needsTranslation({}, "tr", "Привет, как дела?")).toBe(true);
    expect(needsTranslation({}, "tr", "hello how are you")).toBe(true);
    expect(needsTranslation({}, "tr", "merhaba nasılsın")).toBe(false);
    expect(needsTranslation({ isViewer: true }, "tr", "hello")).toBe(false);
  });
});
