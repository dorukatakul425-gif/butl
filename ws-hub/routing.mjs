// Pure routing rules for the butl WebSocket hub (unit-tested).
import crypto from "node:crypto";

const b64json = (s) => JSON.parse(Buffer.from(s, "base64url").toString("utf8"));

/** Verify a Supabase HS256 access token; returns claims or null. */
export function verifyJwt(token, secret, nowSec = Date.now() / 1000) {
  try {
    if (typeof token !== "string" || !secret) return null;
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return null;
    if (b64json(h).alg !== "HS256") return null;
    const want = crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest();
    const got = Buffer.from(sig, "base64url");
    if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null;
    const c = b64json(p);
    if (c.role !== "authenticated" || typeof c.sub !== "string") return null;
    if (typeof c.exp === "number" && c.exp < nowSec) return null;
    return c;
  } catch { return null; }
}

/** Update a socket's known room when its own membership row changes. */
export function applyMembership(evt, sock) {
  if (evt.t !== "room_players" || !sock.uid) return;
  const row = evt.op === "DELETE" ? evt.old : evt.new;
  if (!row || row.user_id !== sock.uid) return;
  if (evt.op === "DELETE") { if (sock.room === String(row.room_id)) sock.room = null; }
  else sock.room = String(row.room_id);
}

/** What (if anything) this socket may receive for a database event. */
export function audience(evt, sock) {
  if (!sock.uid) return null;
  const inRoom = sock.room != null && Array.isArray(evt.rooms) && evt.rooms.includes(sock.room);
  const msg = { type: "pg", t: evt.t, op: evt.op, new: evt.new ?? null, old: evt.old ?? null };
  switch (evt.t) {
    case "premium_gift_events":
      return msg; // global announcement, readable by everyone
    case "kickout_events":
      return inRoom || evt.new?.target_id === sock.uid ? msg : null;
    case "chat_messages": {
      if (!inRoom) return null;
      if (evt.op === "DELETE") return { ...msg, new: null, old: { id: evt.old?.id } };
      const n = evt.new;
      if (!n || evt.banned) return null;
      if (n.is_private && n.user_id !== sock.uid && n.receiver_id !== sock.uid) return null;
      return msg;
    }
    default:
      return inRoom ? msg : null;
  }
}

/** Does this event change the public table list? */
export const touchesTables = (evt) =>
  (evt.t === "room_players" && evt.op !== "UPDATE") || (evt.t === "rooms" && evt.bottle_changed === true);
