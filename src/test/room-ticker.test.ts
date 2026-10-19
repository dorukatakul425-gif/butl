import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..", "..");
const bot = readFileSync(join(root, "bot", "telegram-bot.mjs"), "utf8");
const migration = readFileSync(
  join(root, "supabase", "migrations", "20261026150000_tick_all_rooms.sql"),
  "utf8",
);

describe("sunucu-taraflı masa saati (Ciliz parity)", () => {
  it("bot her 2 saniyede tick_all_rooms çağırır", () => {
    expect(bot).toContain("tick_all_rooms");
    expect(bot).toContain("}, 2000)");
  });

  it("tick_all_rooms oyunculu tüm masalarda room_tick işletir", () => {
    expect(migration).toContain("select distinct room_id from public.room_players");
    expect(migration).toContain("perform public.room_tick(r.room_id)");
  });

  it("tick_all_rooms sadece service_role tarafından çağrılabilir", () => {
    expect(migration).toContain("revoke all on function public.tick_all_rooms() from public, anon, authenticated");
    expect(migration).toContain("grant execute on function public.tick_all_rooms() to service_role");
  });
});
