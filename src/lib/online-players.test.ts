import { describe, expect, it } from "vitest";
import { summarize } from "./online-players";

const now = Date.parse("2026-10-16T12:00:00Z");
const row = (id: string, male: boolean, agoMs: number) => ({
  user_id: id, last_seen: new Date(now - agoMs).toISOString(), profiles: { name: id, photo_url: null, male },
});

describe("online players summary", () => {
  it("counts boys and girls separately", () => {
    const s = summarize([row("a", true, 1000), row("b", false, 2000), row("c", false, 3000)], now);
    expect([s.total, s.boys, s.girls]).toEqual([3, 1, 2]);
  });
  it("drops expired presence without dropping a brief reconnect", () => {
    const s = summarize([row("a", true, 121_000), row("b", false, 30_000)], now);
    expect(s.total).toBe(1);
  });
});
