// VPS -> Railway bridge: one outbound socket. Streams Postgres room events (LISTEN butl_rt)
// to the Railway hub and answers its 3 whitelisted queries. Players never connect to the VPS hub.
import pg from "pg";
import WebSocket from "ws";

const DB = process.env.DATABASE_URL;
const HUB = process.env.RAILWAY_HUB_URL; // wss://.../bridge
const KEY = process.env.BRIDGE_KEY;
if (!DB || !HUB || !KEY) { console.error("DATABASE_URL/RAILWAY_HUB_URL/BRIDGE_KEY missing"); process.exit(1); }

const pool = new pg.Pool({ connectionString: DB, max: 4 });
const TABLES = new Set(["rooms", "room_players", "chat_messages", "kickout_events", "gift_events", "premium_gift_events", "gesture_events", "profiles"]);
const Q = {
  rooms_of: ([uid]) => pool.query("select room_id::text r from public.room_players where user_id = $1", [uid]),
};

let ws = null;
const backlog = [];
function push(evt) {
  const s = JSON.stringify({ type: "evt", evt });
  if (ws && ws.readyState === 1) ws.send(s);
  else if (backlog.length < 2000) backlog.push(s);
}

async function fullRow(evt) {
  if (!evt.big || evt.op === "DELETE") return evt;
  if (!TABLES.has(evt.t)) return null;
  const col = evt.t === "room_players" ? "user_id" : "id";
  const { rows } = await pool.query(`select to_jsonb(x) j from public.${evt.t} x where ${col}::text = $1`, [evt.key]);
  return rows[0] ? { ...evt, new: rows[0].j } : null;
}

function connectHub() {
  const s = new WebSocket(HUB, { headers: { "x-bridge-key": KEY }, perMessageDeflate: false });
  let alive = true;
  const hb = setInterval(() => { if (!alive) return s.terminate(); alive = false; try { s.ping(); } catch {} }, 5000);
  s.on("pong", () => { alive = true; });
  s.on("open", () => { ws = s; console.log("hub connected"); while (backlog.length) s.send(backlog.shift()); });
  s.on("message", async (data) => {
    let m; try { m = JSON.parse(data.toString()); } catch { return; }
    if (m.type !== "q" || !Q[m.op]) return;
    try { const r = await Q[m.op](Array.isArray(m.args) ? m.args : []); if (s.readyState === 1) s.send(JSON.stringify({ type: "r", id: m.id, rows: r.rows })); }
    catch { if (s.readyState === 1) s.send(JSON.stringify({ type: "r", id: m.id, error: "query unavailable" })); }
  });
  const down = () => { clearInterval(hb); if (ws === s) ws = null; setTimeout(connectHub, 1000); };
  s.on("close", down);
  s.on("error", () => undefined);
}

let listener = null;
async function listen() {
  const c = new pg.Client({ connectionString: DB });
  c.on("notification", (n) => {
    let evt; try { evt = JSON.parse(n.payload); } catch { return; }
    if (!evt.big) return push(evt);
    fullRow(evt).then((e) => e && push(e)).catch(() => undefined);
  });
  const retry = () => { if (listener !== c) return; listener = null; c.end().catch(() => undefined); setTimeout(listen, 1000); };
  c.on("error", retry); c.on("end", retry);
  try { await c.connect(); await c.query("LISTEN butl_rt"); listener = c; console.log("listening"); }
  catch (e) { console.error("listen failed", e.message); setTimeout(listen, 2000); }
}

await listen();
connectHub();
