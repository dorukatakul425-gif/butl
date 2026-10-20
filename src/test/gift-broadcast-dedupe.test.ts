import { describe, it, expect } from "vitest";
import { acceptGift } from "@/lib/room-session";
describe("gift instant broadcast", () => {
  it("plays a gift once even when broadcast and DB insert both arrive", () => {
    const r = { sender_id: "a", receiver_id: "b", seed: 42, gift_type: "air_kiss" };
    expect(acceptGift(r)).toBe(true);
    expect(acceptGift({ ...r })).toBe(false);
    expect(acceptGift({ ...r, seed: 43 })).toBe(true);
  });
});
