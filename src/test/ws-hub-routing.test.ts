import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { applyMembership, audience, touchesTables, verifyJwt } from "../../ws-hub/routing.mjs";

const secret = "test-secret";
const jwt = (claims: object, key = secret) => {
  const h = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const p = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const sig = crypto.createHmac("sha256", key).update(`${h}.${p}`).digest("base64url");
  return `${h}.${p}.${sig}`;
};
const me = { uid: "u1", room: "7" };

describe("ws hub auth", () => {
  it("accepts a valid player token", () => {
    expect(verifyJwt(jwt({ sub: "u1", role: "authenticated", exp: 2e9 }), secret, 1e9)?.sub).toBe("u1");
  });
  it("rejects forged, expired and anon tokens", () => {
    expect(verifyJwt(jwt({ sub: "u1", role: "authenticated" }, "other"), secret)).toBeNull();
    expect(verifyJwt(jwt({ sub: "u1", role: "authenticated", exp: 10 }), secret, 1e9)).toBeNull();
    expect(verifyJwt(jwt({ role: "anon" }), secret)).toBeNull();
  });
});

describe("ws hub routing", () => {
  it("delivers room events only to that room", () => {
    const gift = { t: "gift_events", op: "INSERT", rooms: ["7"], new: { id: 1 } };
    expect(audience(gift, me)).not.toBeNull();
    expect(audience(gift, { uid: "u2", room: "8" })).toBeNull();
  });
  it("hides private chat from other players and banned senders from everyone", () => {
    const priv = { t: "chat_messages", op: "INSERT", rooms: ["7"], new: { user_id: "a", receiver_id: "b", is_private: true } };
    expect(audience(priv, { uid: "c", room: "7" })).toBeNull();
    expect(audience(priv, { uid: "b", room: "7" })).not.toBeNull();
    expect(audience({ ...priv, banned: true, new: { ...priv.new, is_private: false } }, me)).toBeNull();
  });
  it("sends premium gifts to every signed-in player and kickouts to their target", () => {
    expect(audience({ t: "premium_gift_events", op: "INSERT", rooms: [], new: {} }, { uid: "x", room: null })).not.toBeNull();
    expect(audience({ t: "kickout_events", op: "INSERT", rooms: ["9"], new: { target_id: "u1" } }, me)).not.toBeNull();
  });
  it("follows the player's own membership moves", () => {
    const s = { uid: "u1", room: "7" as string | null };
    applyMembership({ t: "room_players", op: "UPDATE", new: { user_id: "u1", room_id: 9 } }, s);
    expect(s.room).toBe("9");
    applyMembership({ t: "room_players", op: "DELETE", old: { user_id: "u1", room_id: 9 } }, s);
    expect(s.room).toBeNull();
  });
  it("pings the table list only on seat changes or bottle changes", () => {
    expect(touchesTables({ t: "room_players", op: "INSERT" })).toBe(true);
    expect(touchesTables({ t: "rooms", op: "UPDATE" })).toBe(false);
    expect(touchesTables({ t: "rooms", op: "UPDATE", bottle_changed: true })).toBe(true);
  });
});
