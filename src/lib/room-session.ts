import { useSyncExternalStore } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase, type Profile } from "./supabase";
import { applyRoomMusic, type RoomMusic } from "./music-session";
import { DEFAULT_PHOTO } from "./ciliz-default-photo";

export type RoomPhase = "offer" | "spin" | "choose" | "result" | "return";
export interface RoomRow { id: number; phase: RoomPhase; spinner: number | null; target: number | null; decisions: Record<string, "kiss" | "refuse">; round: number; phase_at: string; music?: RoomMusic | null }
export interface ChatRow { id: number; user_id: string; receiver_id: string | null; text: string; created_at: string }
export interface GiftRow { id: number; sender_id: string; receiver_id: string; gift_type: string; seed: number }

/** The viewer always sits at display seat 5; server seats rotate around them. */
export const VIEWER_DISPLAY_SEAT = 5;
export const toDisplay = (seat: number, mySeat: number) => (seat - mySeat + VIEWER_DISPLAY_SEAT + 24) % 12;
export const fromDisplay = (display: number, mySeat: number) => (display - VIEWER_DISPLAY_SEAT + mySeat + 24) % 12;

interface RoomState {
  roomId: number | null;
  mySeat: number;
  room: RoomRow | null;
  /** Indexed by display seat. */
  players: Array<Profile | null>;
  /** Local clock when the current phase was received (for countdowns). */
  phaseReceivedAt: number;
  error: string | null;
}
const EMPTY: RoomState = { roomId: null, mySeat: 0, room: null, players: Array(12).fill(null), phaseReceivedAt: 0, error: null };
let state: RoomState = EMPTY;
const listeners = new Set<() => void>();
const set = (next: Partial<RoomState>) => { state = { ...state, ...next }; listeners.forEach(l => l()); };
const chatListeners = new Set<(row: ChatRow) => void>();
const giftListeners = new Set<(row: GiftRow) => void>();
export const onRoomChat = (fn: (row: ChatRow) => void) => { chatListeners.add(fn); return () => { chatListeners.delete(fn); }; };
export const onRoomGift = (fn: (row: GiftRow) => void) => { giftListeners.add(fn); return () => { giftListeners.delete(fn); }; };

let channel: RealtimeChannel | null = null;
let timers: number[] = [];

let serverOffsetMs = 0;
function syncMusic() {
  const music = state.room?.music;
  if (!music) return;
  const p = state.players.find(x => x?.id === music.sender);
  // Sender may have left the table; the song keeps playing for everyone.
  applyRoomMusic(music, serverOffsetMs, { id: music.sender, name: p?.name ?? "", photoUrl: p?.photo_url || DEFAULT_PHOTO, musicLevel: 0 });
}
function applyRoom(room: RoomRow) {
  // A target/spinner we have not loaded yet means our seat list is stale: reload before animating.
  for (const seat of [room.spinner, room.target]) if (seat !== null && !state.players[toDisplay(seat, state.mySeat)]) { void loadPlayers(); break; }
  const changed = !state.room || state.room.phase !== room.phase || state.room.round !== room.round;
  set({ room, ...(changed ? { phaseReceivedAt: Date.now() } : {}) });
  syncMusic();
}

let rejoining = false;
async function loadPlayers() {
  const sb = getSupabase();
  if (!sb || state.roomId === null) return;
  const roomId = state.roomId;
  const { data, error } = await sb.from("room_players").select("seat, user_id, profiles(*)").eq("room_id", roomId);
  if (error || state.roomId !== roomId) return;
  const rows = (data ?? []) as unknown as Array<{ seat: number; user_id: string; profiles: Profile | null }>;
  const uid = (await sb.auth.getSession()).data.session?.user.id;
  if (state.roomId !== roomId) return;
  const mine = rows.find(r => r.user_id === uid);
  // The server dropped our seat (tab slept, network lost): take a seat again instead of watching a ghost table.
  if (!mine) { if (uid && !rejoining) { rejoining = true; void joinRoom().finally(() => { rejoining = false; }); } return; }
  const mySeat = mine.seat;
  const players: Array<Profile | null> = Array(12).fill(null);
  for (const row of rows) if (row.profiles) players[toDisplay(row.seat, mySeat)] = row.profiles;
  set({ players, mySeat });
}

/** True when the server seat is occupied by a loaded player. */
export function seatOccupied(serverSeat: number | null) { return serverSeat !== null && Boolean(state.players[toDisplay(serverSeat, state.mySeat)]); }
/** Asks the server to fix a stale round right away (e.g. the spinner left). */
export function nudgeRoom() { const sb = getSupabase(); if (sb && state.roomId !== null) void sb.rpc("room_tick", { p_room: state.roomId }); }

export function profileBySeat(display: number) { return state.players[display] ?? null; }
export function displaySeatOf(userId: string) { return state.players.findIndex(p => p?.id === userId); }

// Join/leave run strictly in order so a late leave_room never removes a fresh seat.
let queue: Promise<unknown> = Promise.resolve();
const serial = <T,>(fn: () => Promise<T>) => { const p = queue.then(fn, fn); queue = p.catch(() => undefined); return p; };
export const joinRoom = () => serial(joinRoomNow);
async function joinRoomNow() {
  const sb = getSupabase();
  if (!sb) { set({ error: "Sunucu ayarlanmamış." }); return; }
  leaveRoomLocal();
  const { data, error } = await sb.rpc("join_room");
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) { set({ error: error?.message ?? "Masaya katılınamadı." }); return; }
  const roomId = Number(row.room_id), mySeat = Number(row.seat);
  set({ ...EMPTY, roomId, mySeat });
  const t0 = Date.now();
  const { data: now } = await sb.rpc("server_now");
  if (now) serverOffsetMs = Date.parse(String(now)) - (t0 + Date.now()) / 2;
  await loadPlayers();
  const { data: room } = await sb.from("rooms").select("*").eq("id", roomId).single();
  if (room) applyRoom(room as RoomRow);
  channel = sb.channel(`room-${roomId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` }, p => { if (p.new && "id" in p.new) applyRoom(p.new as RoomRow); })
    // DELETE events cannot be filtered by column, so listen unfiltered and reload this table's seats.
    .on("postgres_changes", { event: "*", schema: "public", table: "room_players" }, () => void loadPlayers())
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, p => {
      const prof = p.new as Profile;
      const i = state.players.findIndex(x => x?.id === prof.id);
      if (i >= 0) { const players = [...state.players]; players[i] = prof; set({ players }); }
    })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` }, p => chatListeners.forEach(fn => fn(p.new as ChatRow)))
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "gift_events", filter: `room_id=eq.${roomId}` }, p => giftListeners.forEach(fn => fn(p.new as GiftRow)))
    .subscribe();
  // Server owns timing; any seated client nudges expired phases forward.
  timers.push(window.setInterval(() => void sb.rpc("room_tick", { p_room: roomId }), 1000));
  timers.push(window.setInterval(() => void sb.rpc("heartbeat"), 5000));
  timers.push(window.setInterval(() => void loadPlayers(), 5000));
}

function leaveRoomLocal() {
  timers.forEach(t => window.clearInterval(t)); timers = [];
  if (channel) { void getSupabase()?.removeChannel(channel); channel = null; }
}
export const leaveRoom = () => serial(async () => {
  leaveRoomLocal();
  set(EMPTY);
  await getSupabase()?.rpc("leave_room");
});

export async function spinBottle() { await getSupabase()?.rpc("spin_bottle"); }
export async function decide(kiss: boolean) { await getSupabase()?.rpc("decide", { p_kiss: kiss }); }
export async function sendChat(text: string, receiverId?: string) {
  const { error } = (await getSupabase()?.rpc("send_chat", { p_text: text, p_receiver: receiverId ?? null })) ?? { error: null };
  return !error;
}
export async function sendGift(giftType: string, receiverIds: string[], seed: number): Promise<{ ok: true; gold: number } | { ok: false; reason: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "offline" };
  const { data, error } = await sb.rpc("send_gift", { p_gift: giftType, p_receivers: receiverIds, p_seed: seed });
  return error ? { ok: false, reason: error.message } : { ok: true, gold: Number(data) };
}

export function useRoom(): RoomState {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, () => state, () => EMPTY);
}
export const getRoom = () => state;
