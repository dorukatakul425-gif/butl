// ============================================================
// socket.ts — Socket.io bağlantısı (Supabase Realtime-ın əvəzi)
// ============================================================
import { io, type Socket } from "socket.io-client";
import { getSupabase } from "./supabase";

const SOCKET_URL = import.meta.env["VITE_SOCKET_URL"] as string | undefined;

let socket: Socket | null = null;
let connecting = false;

export async function getSocket(): Promise<Socket | null> {
  if (!SOCKET_URL) return null;
  if (socket?.connected) return socket;
  if (connecting) {
    // Bağlantı gözləyirik
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (socket?.connected) { clearInterval(check); resolve(socket); }
        if (!connecting)       { clearInterval(check); resolve(null); }
      }, 100);
    });
  }

  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;

  connecting = true;
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  return new Promise((resolve) => {
    socket!.once("connect", () => { connecting = false; resolve(socket); });
    socket!.once("connect_error", (e) => {
      console.error("Socket bağlantı xətası:", e.message);
      connecting = false;
      resolve(null);
    });
  });
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
  connecting = false;
}

export function getSocketInstance() { return socket; }
