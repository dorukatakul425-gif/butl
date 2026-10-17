import { describe, expect, it } from "vitest";
import { leagueHeader, splitLeague } from "@/lib/league";

describe("league rules", () => {
  const users = Array.from({ length: 20 }, (_, i) => i + 1);
  it("top 3 go up, last 3 go down, the rest stay (20 players)", () => {
    const s = splitLeague(users, 3, 3, 20);
    expect(s.up).toEqual([1, 2, 3]);
    expect(s.stay).toHaveLength(14);
    expect(s.down).toEqual([18, 19, 20]);
  });
  it("a group that is not full has nobody in the drop zone", () => {
    expect(splitLeague(users.slice(0, 10), 3, 3, 20).down).toEqual([]);
  });
  it("header shows the viewer's position while running", () => {
    const h = leagueHeader({ state: "running", finish_ms: 3 * 86400000, users: [{ id: "a", name: "", score: 5 }, { id: "me", name: "", score: 1 }] }, "me", 0);
    expect(h).toEqual({ type: "running", positionText: "2", leftTimeShortText: "3g" });
  });
});
