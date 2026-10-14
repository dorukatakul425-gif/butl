// ============================================================
// room-session.ts — Socket.io versiyası
// Supabase Realtime əvəzinə Socket.io istifadə edir
// ============================================================
import { useSyncExternalStore } from "react";
import { getSupabase, type Profile } from "./supabase";
import { getSocket, disconnectSocket } from "./socket";
import { applyRoomMusic, type RoomMusic } from "./music-session";
import { DEFAULT_PHOTO } from "./ciliz-default-photo";

export type RoomPhase = "offer" | "spin" | "choose" | "result" | "return";
export interface RoomRow {
  id: number;
  phase: RoomPhase;
  spinner: number | null;
  target: number | null;
  decisions: Record<string, "kiss" | "refuse">;
  round: number;
  phase_at: string;
  music?: RoomMusic | null;
}
export interface ChatRow {
  id: number;
  user_id: string;
  receiver_id: string | null;
  text: string;
  created_at: string;
}
export interface GiftRow {
  id: number;
  sender_id: string;
  receiver_id: string;
  gift_type: string;
  seed: number;
}

export const VIEWER_DISPLAY_SEAT = 5;
export const toDisplay = (seat: number, mySeat: number) =>
  (seat - mySeat + VIEWER_DISPLAY_SEAT + 24) % 12;
export const fromDisplay = (display: number, mySeat: number) =>
  (display - VIEWER_DISPLAY_SEAT + mySeat + 24) % 12;

interface RoomState {
  roomId: number | null;
  mySeat: number;
  room: RoomRow | null;
  players: Array<Profile | null>;
  phaseReceivedAt: number;
  error: string | null;
  connected: boolean;
}

const EMPTY: RoomState = {
  roomId: null,
  mySeat: 0,
  room: null,
  players: Array(12).fill(null),
  phaseReceivedAt: 0,
  error: null,
  connected: false,
};

let state: RoomState = EMPTY;
const listeners = new Set<() => void>();
const set = (next: Partial<RoomState>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

const chatListeners = new Set<(row: ChatRow) => void>();
const giftListeners = new Set<(row: GiftRow) => void>();
export const onRoomChat = (fn: (row: ChatRow) => void) => {
  chatListeners.add(fn);
  return () => { chatListeners.delete(fn); };
};
export const onRoomGift = (fn: (row: GiftRow) => void) => {
  giftListeners.add(fn);
  return () => { giftListeners.delete(fn); };
};

let serverOffsetMs = 0;

function applyRoom(room: RoomRow) {
  const changed =
    !state.room ||
    state.room.phase !== room.phase ||
    state.room.round !== room.round;
  set({ room, ...(changed ? { phaseReceivedAt: Date.now() } : {}) });

  // Musiqi sinxronizasiyası
  const music = room.music;
  if (music) {
    const p = state.players.find((x) => x?.id === music.sender);
    applyRoomMusic(music, serverOffsetMs, {
      id: music.sender,
      name: p?.name ?? "",
      photoUrl: p?.photo_url || DEFAULT_PHOTO,
      musicLevel: 0,
    });
  }
}

function buildPlayers(
  rows: Array<{ seat: number; user_id: string; profiles: Profile | null }>,
  mySeat: number
): Array<Profile | null> {
  const players: Array<Profile | null> = Array(12).fill(null);
  for (const row of rows) {
    if (row.profiles) {
      players[toDisplay(row.seat, mySeat)] = row.profiles;
    }
  }
  return players;
}

// Join/leave ardıcıl işləsin
let queue: Promise<unknown> = Promise.resolve();
const serial = <T,>(fn: () => Promise<T>) => {
  const p = queue.then(fn, fn);
  queue = p.catch(() => undefined);
  return p;
};

export const joinRoom = () => serial(joinRoomNow);

async function joinRoomNow() {
  set({ ...EMPTY, error: null });

  const socket = await getSocket();
  if (!socket) {
    set({ error: "Server bağlantısı yoxdur." });
    return;
  }

  // Socket hadisələrini qur
  setupSocketListeners(socket);

  // Server-ə qoşulmaq üçün sorğu göndər
  const t0 = Date.now();
  socket.emit(
    "join_room",
    {},
    (res: {
      ok?: boolean;
      error?: string;
      room_id?: number;
      seat?: number;
      room?: RoomRow;
      players?: Array<{ seat: number; user_id: string; profiles: Profile | null }>;
    }) => {
      if (res.error || !res.ok) {
        set({ error: res.error ?? "Masaya qoşulmaq olmadı." });
        return;
      }

      const elapsed = Date.now() - t0;
      serverOffsetMs = elapsed / 2; // Təxmini server-client fərqi

      const mySeat = res.seat!;
      const players = buildPlayers(res.players ?? [], mySeat);
      set({
        roomId: res.room_id!,
        mySeat,
        players,
        connected: true,
        error: null,
      });

      if (res.room) applyRoom(res.room);
    }
  );
}

function setupSocketListeners(socket: ReturnType<typeof import("socket.io-client").io>) {
  // Əvvəlki dinləyiciləri təmizlə
  socket.off("room_update");
  socket.off("player_joined");
  socket.off("player_left");
  socket.off("chat_message");
  socket.off("gift_event");
  socket.off("disconnect");

  socket.on("room_update", (room: RoomRow) => {
    applyRoom(room);
  });

  socket.on(
    "player_joined",
    ({ seat, profile }: { seat: number; profile: Profile }) => {
      const players = [...state.players];
      players[toDisplay(seat, state.mySeat)] = profile;
      set({ players });
    }
  );

  socket.on("player_left", ({ seat }: { seat: number }) => {
    const players = [...state.players];
    players[toDisplay(seat, state.mySeat)] = null;
    set({ players });
  });

  socket.on("chat_message", (row: ChatRow) => {
    chatListeners.forEach((fn) => fn(row));
  });

  socket.on("gift_event", (row: GiftRow) => {
    giftListeners.forEach((fn) => fn(row));
  });

  socket.on("disconnect", () => {
    set({ connected: false, error: "Bağlantı kəsildi, yenidən qoşulunur..." });
  });

  socket.on("connect", () => {
    if (state.roomId !== null) {
      // Yenidən qoşulduqda avtomatik rejoin
      void joinRoomNow();
    }
  });
}

export const leaveRoom = () =>
  serial(async () => {
    const socket = await getSocket();
    if (socket) {
      socket.emit("leave_room", {}, () => {});
      socket.off("room_update");
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("chat_message");
      socket.off("gift_event");
    }
    disconnectSocket();
    set(EMPTY);
  });

export function seatOccupied(serverSeat: number | null) {
  return (
    serverSeat !== null &&
    Boolean(state.players[toDisplay(serverSeat, state.mySeat)])
  );
}

export function nudgeRoom() {
  getSocket().then((socket) => {
    if (socket && state.roomId !== null) {
      socket.emit("room_tick", { room_id: state.roomId });
    }
  });
}

export function profileBySeat(display: number) {
  return state.players[display] ?? null;
}

export function displaySeatOf(userId: string) {
  return state.players.findIndex((p) => p?.id === userId);
}

// ── Oyun əməliyyatları ──────────────────────────────────────

export async function spinBottle(): Promise<void> {
  const socket = await getSocket();
  return new Promise((resolve) => {
    socket?.emit("spin_bottle", {}, () => resolve());
  });
}

export async function decide(kiss: boolean): Promise<void> {
  const socket = await getSocket();
  return new Promise((resolve) => {
    socket?.emit("decide", { kiss }, () => resolve());
  });
}

export async function sendChat(
  text: string,
  receiverId?: string
): Promise<boolean> {
  const socket = await getSocket();
  return new Promise((resolve) => {
    socket?.emit(
      "send_chat",
      { text, receiver_id: receiverId ?? null },
      (res: { ok?: boolean }) => resolve(Boolean(res?.ok))
    );
    if (!socket) resolve(false);
  });
}

export async function sendGift(
  giftType: string,
  receiverIds: string[],
  seed: number
): Promise<{ ok: true; gold: number } | { ok: false; reason: string }> {
  const socket = await getSocket();
  return new Promise((resolve) => {
    if (!socket) return resolve({ ok: false, reason: "offline" });
    socket.emit(
      "send_gift",
      { gift_type: giftType, receiver_ids: receiverIds, seed },
      (res: { ok?: boolean; gold?: number; error?: string }) => {
        if (res?.ok) resolve({ ok: true, gold: res.gold ?? 0 });
        else resolve({ ok: false, reason: res?.error ?? "xəta" });
      }
    );
  });
}

export function useRoom(): RoomState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => EMPTY
  );
}

export const getRoom = () => state;
