import { describe, expect, it } from "vitest";
import { entryParticipantCurrent } from "@/lib/entry-fx-lifetime";

describe("entry effect lifetime", () => {
  const table = {};
  const expected = { roomId: 1, table, playerId: "alice" };
  it("does not replay an old entrance after changing rooms", () => {
    expect(entryParticipantCurrent(expected, { ...expected, roomId: 2 })).toBe(false);
  });
  it("does not transfer an entrance to a replacement occupant", () => {
    expect(entryParticipantCurrent(expected, { ...expected, playerId: "bob" })).toBe(false);
  });
  it("accepts the same player only in the original active renderer", () => {
    expect(entryParticipantCurrent(expected, expected)).toBe(true);
    expect(entryParticipantCurrent(expected, { ...expected, table: {} })).toBe(false);
  });
});