import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { pushSystemLine, pushBottleLine, resetRoomMusic } from "@/lib/music-session";

describe("table chat works the same at every table", () => {
  it("keeps only the last 100 lines for every line kind", () => {
    resetRoomMusic();
    for (let i = 0; i < 120; i++) pushSystemLine("admin_chat", `m${i}`, i);
    for (let i = 0; i < 30; i++) pushBottleLine({ id: "u", name: "A", photoUrl: "", male: true } as never, "", "", "", "", 1000 + i);
    // The oldest 50 lines were dropped, so id 49 is new again while id 50 is still kept.
    expect(pushSystemLine("admin_chat", "again", 50)).toBe(false);
    expect(pushSystemLine("admin_chat", "again", 49)).toBe(true);
  });
  it("hides banned players' messages at every table", () => {
    const sql = readFileSync("supabase/migrations/20261027120000_table_chat_ban_filter.sql", "utf8");
    expect(sql).toContain("NOT public.is_banned(user_id)");
    expect(readFileSync("drizzle/migrations/0055_table_chat_ban_filter.sql", "utf8")).toBe(sql);
  });
});
