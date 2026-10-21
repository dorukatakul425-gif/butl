// butl WebSocket hub: one socket per player, room-scoped push from Postgres LISTEN.
import http from "node:http";
import pg from "pg";
import { WebSocketServer } from "ws";
import { verifyJwt, applyMembership, audience, touchesTables } from "./routing.mjs";

const PORT = Number(process.env.WS_PORT || 3100);
const SECRET = process.env.JWT_SECRET;
const DB = process.env.DATABASE_URL;
if (!SECRET || !DB) { console.error("JWT_SECRET/DATABASE_URL missing"); process.exit(1); }

const pool = new pg.Pool({ connectionString: DB, max: 10 });
const socks = new Set();
const byRoom = new Map();
const byUser = new Map();
const watchers = new Set();
let tablesDirty = false;
// Closing the game removes the seat for everyone; a short grace lets a page refresh reconnect first.
const GRACE_MS = 60000; // mobile networks/backgrounded tabs drop sockets; a blip must never cost the seat
const departures = new Map();
function scheduleDeparture(uid, room) {
  clearTimeout(departures.get(uid));
  departures.set(uid, setTimeout(async () => {
    departures.delete(uid);
    if ((byUser.get(uid)?.size ?? 0) > 0 || process.env.EXTERNAL_HUB_ACTIVE === "1") return;
    try { await pool.query("delete from public.room_players where user_id = $1 and room_id::text = $2", [uid, room]); }
    catch (e) { console.error("departure failed", e.message); }
  }, GRACE_MS));
}

const addTo = (m, k, s) => { let set = m.get(k); if (!set) m.set(k, (set = new Set())); set.add(s); };
const delFrom = (m, k, s) => { const set = m.get(k); if (!set) return; set.delete(s); if (!set.size) m.delete(k); };
function setRoom(s, room) {
  if (s.room === room) return;
  if (s.room) delFrom(byRoom, s.room, s);
  s.room = room;
  if (room) addTo(byRoom, room, s);
}
function send(s, obj) {
  const ws = s.ws;
  if (ws.readyState !== 1) return;
  if (ws.bufferedAmount > 2_000_000) { ws.terminate(); return; }
  ws.send(typeof obj === "string" ? obj : JSON.stringify(obj));
}

async function fullRow(evt) {
  if (!evt.big || evt.op === "DELETE") return evt;
  const tables = new Set(["rooms", "room_players", "chat_messages", "kickout_events", "gift_events", "premium_gift_events", "gesture_events", "profiles"]);
  if (!tables.has(evt.t)) return null;
  const col = evt.t === "room_players" ? "user_id" : "id";
  const { rows } = await pool.query(`select to_jsonb(x) j from public.${evt.t} x where ${col}::text = $1`, [evt.key]);
  return rows[0] ? { ...evt, new: rows[0].j } : null;
}

function dispatch(evt) {
  const targets = new Set();
  for (const r of evt.rooms ?? []) for (const s of byRoom.get(r) ?? []) targets.add(s);
  if (evt.t === "premium_gift_events") for (const s of socks) targets.add(s);
  const uid = evt.new?.target_id ?? evt.new?.user_id ?? evt.old?.user_id;
  if (uid) for (const s of byUser.get(uid) ?? []) targets.add(s);
  for (const s of targets) {
    const prev = s.room;
    applyMembership(evt, s);
    if (s.room !== prev) { const next = s.room; s.room = prev; setRoom(s, next); }
    const msg = audience(evt, s);
    if (msg) send(s, msg);
  }
  if (touchesTables(evt)) tablesDirty = true;
}
setInterval(() => {
  if (!tablesDirty) return;
  tablesDirty = false;
  for (const s of watchers) send(s, '{"type":"tables"}');
}, 700);

let listener = null;
async function listen() {
  const c = new pg.Client({ connectionString: DB });
  c.on("notification", (n) => {
    let evt; try { evt = JSON.parse(n.payload); } catch { return; }
    if (!evt.big) return dispatch(evt);
    fullRow(evt).then((e) => e && dispatch(e)).catch(() => undefined);
  });
  const retry = () => {
    if (listener !== c) return;
    listener = null;
    c.end().catch(() => undefined);
    setTimeout(() => { listen().then(() => { for (const s of socks) send(s, '{"type":"resync"}'); }); }, 1000);
  };
  c.on("error", retry); c.on("end", retry);
  try { await c.connect(); await c.query("LISTEN butl_rt"); listener = c; console.log("listening"); }
  catch (e) { console.error("listen failed", e.message); setTimeout(listen, 2000); }
}

const server = http.createServer((req, res) => {
  if (req.url === "/ws/health") { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify({ ok: !!listener, sockets: socks.size, rooms: byRoom.size })); return; }
  res.writeHead(404); res.end();
});
const wss = new WebSocketServer({ server, path: "/ws", perMessageDeflate: false, maxPayload: 16 * 1024 });

wss.on("connection", (ws) => {
  const s = { ws, uid: null, exp: 0, room: null, alive: true, tokens: 40, last: Date.now() };
  socks.add(s);
  const authTimer = setTimeout(() => { if (!s.uid) ws.close(4001, "auth"); }, 10000);
  ws.on("pong", () => { s.alive = true; });
  ws.on("message", async (data) => {
    const now = Date.now();
    s.tokens = Math.min(40, s.tokens + ((now - s.last) / 1000) * 20); s.last = now;
    if (s.tokens < 1) return; s.tokens--;
    let m; try { m = JSON.parse(data.toString()); } catch { return; }
    if (!m || typeof m.type !== "string") return;
    if (m.type === "ping") return send(s, { type: "pong", c: m.c, s: Date.now() });
    if (m.type === "auth") {
      const claims = verifyJwt(m.token, SECRET);
      if (!claims || (s.uid && claims.sub !== s.uid)) return ws.close(4001, "auth");
      if (!s.uid) { s.uid = claims.sub; addTo(byUser, s.uid, s); clearTimeout(authTimer); clearTimeout(departures.get(s.uid)); departures.delete(s.uid); }
      s.exp = Number(claims.exp) || 0;
      return send(s, { type: "ready", s: Date.now() });
    }
    if (!s.uid) return;
    if (m.type === "join") {
      const room = String(m.room ?? "");
      try {
        const { rows } = await pool.query("select room_id::text r from public.room_players where user_id = $1", [s.uid]);
        if (rows.some((x) => x.r === room)) { setRoom(s, room); send(s, { type: "joined", room }); }
        else send(s, { type: "join_denied", room });
      } catch { send(s, { type: "join_denied", room }); }
      return;
    }
    if (m.type === "leave") return setRoom(s, null);
    if (m.type === "watch") { if (m.on) watchers.add(s); else watchers.delete(s); return; }
    if (m.type === "bc" && m.event === "gift" && s.room) {
      const out = JSON.stringify({ type: "bc", event: "gift", from: s.uid, payload: m.payload ?? null });
      if (out.length > 8192) return;
      for (const o of byRoom.get(s.room) ?? []) if (o !== s) send(o, out);
    }
  });
  ws.on("close", () => {
    clearTimeout(authTimer);
    const room = s.room;
    socks.delete(s); watchers.delete(s); setRoom(s, null);
    if (s.uid) { delFrom(byUser, s.uid, s); if (room && !byUser.has(s.uid)) scheduleDeparture(s.uid, room); }
  });
});

setInterval(() => {
  const nowSec = Date.now() / 1000;
  for (const s of socks) {
    if (!s.alive || (s.exp && s.exp < nowSec - 60)) { s.ws.terminate(); continue; }
    s.alive = false; s.ws.ping();
  }
}, 5000);

await listen();
server.listen(PORT, "127.0.0.1", () => console.log("butl-ws on", PORT));
