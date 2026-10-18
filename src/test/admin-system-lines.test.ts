import { describe, expect, it } from "vitest";
import { pushSystemLine } from "@/lib/music-session";

describe("admin system chat lines", () => {
  it("accepts admin_chat, ban and disabled_ban styles", () => {
    expect(pushSystemLine("admin_chat", "Yarışma başladı!", 900001)).toBe(true);
    expect(pushSystemLine("ban", "Ali", 900003)).toBe(true);
    expect(pushSystemLine("disabled_ban", "Ali", 900004)).toBe(true);
  });

  it("never shows the same system message twice (reconnect replay)", () => {
    expect(pushSystemLine("ban", "Oyuncu", 900002)).toBe(true);
    expect(pushSystemLine("ban", "Oyuncu", 900002)).toBe(false);
  });
});
