// game-socket.ts — single WebSocket to the butl hub (/ws): room-scoped push, gift relay,
// precise server clock. Callers fall back to the old realtime feed when it is unavailable.
import { getSupabase } from "./supabase";

export type SocketMessage = { type: string; [k: string]: unknown };
type Handler = (m: SocketMessage) => void;

let ws: WebSocket | null = null;
let ready = false;
let started = false;
let retry = 0;
let wantRoom: string | null = null;
let watching = 0;
let bestRtt = Infinity;
let offset = 0;
let pingTimer: ReturnType<typeof setInterval> | null = null;
const handlers = new Set<Handler>();

const emit = (m: SocketMessage) => handlers.forEach((h) => { try { h(m); } catch (e) { console.error(e); } });
const raw = (obj: unknown) => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); };

async function accessToken(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token ?? null;
}

function ping() { raw({ type: "ping", c: Date.now() }); }

function connect() {
  if (typeof window === "undefined" || ws) return;
  const s = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`);
  ws = s;
  ready = false;
  s.onopen = async () => {
    const token = await accessToken();
    if (ws !== s) return;
    if (!token) { s.close(); return; }
    s.send(JSON.stringify({ type: "auth", token }));
  };
  s.onmessage = (e) => {
    let m: SocketMessage;
    try { m = JSON.parse(String(e.data)) as SocketMessage; } catch { return; }
    if (m.type === "pong") {
      const now = Date.now();
      const rtt = now - Number(m["c"]);
      if (rtt >= 0 && rtt <= bestRtt * 1.3 + 5) { bestRtt = Math.min(bestRtt, rtt); offset = Number(m["s"]) + rtt / 2 - now; }
      return;
    }
    if (m.type === "ready") {
      const first = !ready;
      ready = true; retry = 0;
      if (first) {
        bestRtt = Infinity;
        for (let i = 0; i < 4; i++) setTimeout(ping, i * 250);
        if (wantRoom) raw({ type: "join", room: wantRoom });
        if (watching > 0) raw({ type: "watch", on: true });
        emit({ type: "open" });
      }
      return;
    }
    emit(m);
  };
  s.onclose = () => {
    if (ws !== s) return;
    ws = null;
    const was = ready;
    ready = false;
    if (was) emit({ type: "closed" });
    setTimeout(connect, document.visibilityState === "hidden" ? 3000 : Math.min(3000, 200 * 2 ** retry++));
  };
}

/** Start the shared socket once per page. Safe to call repeatedly. */
export function ensureSocket() {
  if (typeof window === "undefined" || started) return;
  started = true;
  connect();
  pingTimer = setInterval(ping, 15000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && !ws) { retry = 0; connect(); } });
  window.addEventListener("online", () => { if (!ws) { retry = 0; connect(); } });
  getSupabase()?.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") { ws?.close(); return; }
    if (session?.access_token && ready) raw({ type: "auth", token: session.access_token });
  });
  void pingTimer;
}

export const socketReady = () => ready;
export function onSocket(h: Handler) { handlers.add(h); return () => { handlers.delete(h); }; }
export function joinSocketRoom(room: number | null) {
  wantRoom = room == null ? null : String(room);
  if (ready) raw(wantRoom ? { type: "join", room: wantRoom } : { type: "leave" });
}
export function socketSend(obj: SocketMessage): boolean {
  if (!ready) return false;
  raw(obj);
  return true;
}
export function watchTables(on: boolean) {
  watching = Math.max(0, watching + (on ? 1 : -1));
  if (ready) raw({ type: "watch", on: watching > 0 });
}
/** Server clock offset (ms) measured over the socket, or null before the first sample. */
export const socketClockOffset = () => (Number.isFinite(bestRtt) ? offset : null);
