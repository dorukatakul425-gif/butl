import { useSyncExternalStore } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase, type Profile } from "./supabase";

export type RoomPhase = "offer" | "spin" | "choose" | "result" | "return";
export interface RoomRow { id: number; phase: RoomPhase; spinner: number | null; target: number | null; decisions: Record<string, "kiss" | "refuse">; round: number; phase_at: string }
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

function applyRoom(room: RoomRow) {
  const changed = !state.room || state.room.phase !== room.phase || state.room.round !== room.round;
  set({ room, ...(changed ? { phaseReceivedAt: Date.now() } : {}) });
}

async function loadPlayers() {
  const sb = getSupabase();
  if (!sb || state.roomId === null) return;
  const { data } = await sb.from("room_players").select("seat, profiles(*)").eq("room_id", state.roomId);
  const players: Array<Profile | null> = Array(12).fill(null);
  for (const row of (data ?? []) as unknown as Array<{ seat: number; profiles: Profile | null }>) {
    if (row.profiles) players[toDisplay(row.seat, state.mySeat)] = row.profiles;
  }
  set({ players });
}

export function profileBySeat(display: number) { return state.players[display] ?? null; }
export function displaySeatOf(userId: string) { return state.players.findIndex(p => p?.id === userId); }

export async function joinRoom() {
  const sb = getSupabase();
  if (!sb) { set({ error: "Sunucu ayarlanmamış." }); return; }
  leaveRoomLocal();
  const { data, error } = await sb.rpc("join_room");
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) { set({ error: error?.message ?? "Masaya katılınamadı." }); return; }
  const roomId = Number(row.room_id), mySeat = Number(row.seat);
  set({ ...EMPTY, roomId, mySeat });
  const { data: room } = await sb.from("rooms").select("*").eq("id", roomId).single();
  if (room) applyRoom(room as RoomRow);
  await loadPlayers();
  channel = sb.channel(`room-${roomId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` }, p => { if (p.new && "id" in p.new) applyRoom(p.new as RoomRow); })
    .on("postgres_changes", { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` }, () => void loadPlayers())
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
  timers.push(window.setInterval(() => void sb.rpc("heartbeat"), 15000));
}

function leaveRoomLocal() {
  timers.forEach(t => window.clearInterval(t)); timers = [];
  if (channel) { void getSupabase()?.removeChannel(channel); channel = null; }
}
export async function leaveRoom() {
  leaveRoomLocal();
  set(EMPTY);
  await getSupabase()?.rpc("leave_room");
}

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
