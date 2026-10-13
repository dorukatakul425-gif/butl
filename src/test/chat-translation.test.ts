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
