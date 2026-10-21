// butl WebSocket hub (Railway): all player sockets live here. The database stays on the VPS;
// a single outbound "bridge" socket from the VPS streams room events in and answers 3 fixed queries.
import http from "node:http";
import crypto from "node:crypto";
import { WebSocketServer } from "ws";
import { verifyJwt, applyMembership, audience, touchesTables } from "./routing.mjs";

const PORT = Number(process.env.PORT || 3100);
const SECRET = process.env.JWT_SECRET;
const BRIDGE_KEY = process.env.BRIDGE_KEY;
if (!SECRET || !BRIDGE_KEY) { console.error("JWT_SECRET/BRIDGE_KEY missing"); process.exit(1); }

const socks = new Set();
const byRoom = new Map();
const byUser = new Map();
const watchers = new Set();
let tablesDirty = false;

// ---- bridge (VPS) ----
let bridge = null;
let qid = 0;
const pending = new Map();
function bq(op, args) {
  return new Promise((resolve, reject) => {
    if (!bridge || bridge.readyState !== 1) return reject(new Error("bridge offline"));
    const id = ++qid;
    const t = setTimeout(() => { pending.delete(id); reject(new Error("bridge timeout")); }, 8000);
    pending.set(id, { resolve, reject, t });
    bridge.send(JSON.stringify({ type: "q", id, op, args }));
  });
}

// Membership leases on the VPS are authoritative. A socket reconnect/failover
// must never delete a seat: another transport may already serve that player.

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

function dispatch(evt) {
  const targets = new Set();
  for (const r of evt.rooms ?? []) for (const s of byRoom.get(r) ?? []) targets.add(s);
  if (evt.t === "premium_gift_events") for (const s of socks) targets.add(s);
  const uid = evt.new?.target_id ?? evt.new?.user_id ?? evt.old?.user_id;
  if (uid) for (const s of byUser.get(uid) ?? []) targets.add(s);
  const cache = new Map(); // same JSON string reused for every socket that gets the identical message
  for (const s of targets) {
    const prev = s.room;
    applyMembership(evt, s);
    if (s.room !== prev) { const next = s.room; s.room = prev; setRoom(s, next); }
    const msg = audience(evt, s);
    if (!msg) continue;
    const key = msg.new === evt.new && msg.old === evt.old ? "full" : null;
    let str = key && cache.get(key);
    if (!str) { str = JSON.stringify(msg); if (key) cache.set(key, str); }
    send(s, str);
  }
  if (touchesTables(evt)) tablesDirty = true;
}
setInterval(() => {
  if (!tablesDirty) return;
  tablesDirty = false;
  for (const s of watchers) send(s, '{"type":"tables"}');
}, 700);

const server = http.createServer((req, res) => {
  if (req.url === "/ws/health" || req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json", "access-control-allow-origin": "*" });
    res.end(JSON.stringify({ ok: !!bridge, sockets: socks.size, rooms: byRoom.size }));
    return;
  }
  res.writeHead(404); res.end();
});
const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false, maxPayload: 16 * 1024 });
const bwss = new WebSocketServer({ noServer: true, perMessageDeflate: false, maxPayload: 8 * 1024 * 1024 });
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

server.on("upgrade", (req, socket, head) => {
  const path = (req.url || "").split("?")[0];
  if (path === "/bridge") {
    if (!safeEq(req.headers["x-bridge-key"] || "", BRIDGE_KEY)) { socket.destroy(); return; }
    bwss.handleUpgrade(req, socket, head, (ws) => onBridge(ws));
  } else if (path === "/ws") {
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
  } else socket.destroy();
});

function onBridge(ws) {
  if (bridge) bridge.terminate();
  bridge = ws; ws.alive = true;
  console.log("bridge connected");
  ws.on("error", () => undefined);
  for (const s of socks) send(s, '{"type":"resync"}');
  ws.on("pong", () => { ws.alive = true; });
  ws.on("message", (data) => {
    let m; try { m = JSON.parse(data.toString()); } catch { return; }
    if (m.type === "evt") { if (m.evt) dispatch(m.evt); return; }
    if (m.type === "r") {
      const p = pending.get(m.id); if (!p) return;
      pending.delete(m.id); clearTimeout(p.t);
      m.error ? p.reject(new Error(m.error)) : p.resolve(m.rows);
    }
  });
  ws.on("close", () => {
    if (bridge !== ws) return;
    bridge = null; console.log("bridge lost");
    for (const s of socks) s.ws.close(1013, "bridge unavailable");
    for (const [id, p] of pending) { clearTimeout(p.t); p.reject(new Error("bridge lost")); pending.delete(id); }
  });
}

wss.on("connection", (ws) => {
  ws.on("error", () => undefined);
  if (!bridge || bridge.readyState !== 1) { ws.close(1013, "bridge unavailable"); return; }
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
      if (!s.uid) { s.uid = claims.sub; addTo(byUser, s.uid, s); clearTimeout(authTimer); }
      s.exp = Number(claims.exp) || 0;
      return send(s, { type: "ready", s: Date.now() });
    }
    if (!s.uid) return;
    if (m.type === "join") {
      const room = String(m.room ?? "");
      try {
        const rows = await bq("rooms_of", [s.uid]);
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
    socks.delete(s); watchers.delete(s); setRoom(s, null);
    if (s.uid) delFrom(byUser, s.uid, s);
  });
});

setInterval(() => {
  const nowSec = Date.now() / 1000;
  for (const s of socks) {
    if (!s.alive || (s.exp && s.exp < nowSec - 60)) { s.ws.terminate(); continue; }
    s.alive = false; s.ws.ping();
  }
  if (bridge) { if (!bridge.alive) bridge.terminate(); else { bridge.alive = false; bridge.ping(); } }
}, 5000);

server.listen(PORT, "0.0.0.0", () => console.log("butl-ws (railway) on", PORT));
