// ============================================================
// room-session.ts — Lovable Cloud RPC + realtime versiyası
// ============================================================
import { useSyncExternalStore } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase, type Profile } from "./supabase";
import { applyRoomMusic, resetRoomMusic, type RoomMusic } from "./music-session";
import { DEFAULT_PHOTO } from "./ciliz-default-photo";
import { installCloudFeatureSession } from "./cloud-feature-session";
import { selectBottle } from "./bottle-game";
import { eventDeduper, haremTransition, revisionGuard } from './live-event-guards';

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
  bottle?: string;
}
export interface ChatRow {
  id: number;
  user_id: string;
  receiver_id: string | null;
  text: string;
  kind?: string; // 'chat' | 'admin_chat' | 'ban' | 'disabled_ban'
  created_at: string;
  is_private?: boolean;
}
export interface KickoutEventRow { id: number; room_id: number; actor_id: string | null; target_id: string; kind: 'kick' | 'save' | 'kicked'; kick_at: string | null; created_at: string }
const kickoutListeners = new Set<(row: KickoutEventRow) => void>();
/** Telegram user_kickout / user_save / user_kicked, shared with every player at the table. */
export type RoomHaremEvent = { targetId: string; newOwnerId: string; oldOwnerId: string | null; price: number };
const haremListeners = new Set<(ev: RoomHaremEvent) => void>();
/** ChatPresenter.harem: a seated player's admirer changed (realtime profiles update). */
export const onRoomHarem = (fn: (ev: RoomHaremEvent) => void) => { haremListeners.add(fn); return () => { haremListeners.delete(fn); }; };
export const onRoomKickout = (fn: (row: KickoutEventRow) => void) => { kickoutListeners.add(fn); return () => { kickoutListeners.delete(fn); }; };
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
/** Server chat history: messages of this table from the last 24 hours, oldest first. */
export const CHAT_HISTORY_HOURS = 24;
export async function loadRoomChatHistory(roomId: number, now = Date.now()) {
  const sb = getSupabase();
  if (!sb) return [];
  const since = new Date(now - CHAT_HISTORY_HOURS * 3600_000).toISOString();
  const { data } = await sb.from("chat_messages").select("id, room_id, user_id, receiver_id, text, created_at, is_private, kind")
    .eq("room_id", roomId).gte("created_at", since).order("id", { ascending: false }).limit(100);
  const rows = ((data ?? []) as unknown as ChatRow[]).reverse();
  const ids = [...new Set(rows.flatMap(r => [r.user_id, r.receiver_id].filter((x): x is string => !!x)))];
  if (!ids.length) return [];
  const { data: profs } = await sb.from("profiles").select("*").in("id", ids);
  const byId = new Map(((profs ?? []) as unknown as Profile[]).map(p => [p.id, p]));
  return rows.flatMap(row => { const sender = byId.get(row.user_id); if (!sender) return []; const receiver = row.receiver_id ? byId.get(row.receiver_id) : undefined; return [{ row, sender, ...(receiver ? { receiver } : {}) }]; });
}
const chatDeleteListeners = new Set<(id: number) => void>();
export const onRoomChatDelete = (fn: (id: number) => void) => { chatDeleteListeners.add(fn); return () => { chatDeleteListeners.delete(fn); }; };
/** Admin-only (server re-checks the role); the DELETE reaches every client over the live feed. */
export async function deleteChatMessage(id: number) {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.rpc("admin_delete_chat" as never, { p_id: id } as never);
  if (error) return false;
  chatDeleteListeners.forEach(fn => fn(id));
  return true;
}
let adminFlag: boolean | null = null;
const adminListeners = new Set<() => void>();
async function loadAdmin() {
  const sb = getSupabase();
  if (!sb) return;
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return;
  const { data } = await sb.from("user_roles" as never).select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
  adminFlag = Boolean(data); adminListeners.forEach(l => l());
}
export function useIsChatAdmin() {
  return useSyncExternalStore((l) => { adminListeners.add(l); if (adminFlag === null) { adminFlag = false; void loadAdmin(); } return () => adminListeners.delete(l); }, () => Boolean(adminFlag), () => false);
}
export const onRoomChat = (fn: (row: ChatRow) => void) => {
  chatListeners.add(fn);
  return () => { chatListeners.delete(fn); };
};
export interface GestureRow { id: number; room_id: number; sender_id: string; gesture: string; created_at: string }
const gestureListeners = new Set<(row: GestureRow) => void>();
export const onRoomGesture = (fn: (row: GestureRow) => void) => {
  gestureListeners.add(fn);
  return () => { gestureListeners.delete(fn); };
};
export const onRoomGift = (fn: (row: GiftRow) => void) => {
  giftListeners.add(fn);
  return () => { giftListeners.delete(fn); };
};

let serverOffsetMs = 0;
let channel: RealtimeChannel | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let seatMap = new Map<number, string>(); // server seat -> user id
let generation = 0;
let playerRead = 0;
type PlayerRow = { seat: number; user_id: string; profiles: Profile | null };
function mapPlayers(rows: PlayerRow[], mySeat: number) {
  const players: Array<Profile | null> = Array(12).fill(null);
  seatMap = new Map();
  for (const row of rows) {
    seatMap.set(row.seat, row.user_id);
    if (row.profiles) players[toDisplay(row.seat, mySeat)] = row.profiles;
  }
  return players;
}

function applyRoom(room: RoomRow) {
  if (room.id !== state.roomId) return;
  const changed =
    !state.room || state.room.phase !== room.phase || state.room.round !== room.round;
  set({ room, ...(changed ? { phaseReceivedAt: Date.now() } : {}) });
  // The table bottle is room state: whoever buys it, everyone sees it.
  selectBottle(room.bottle || "standart");
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

async function loadPlayers(roomId: number, mySeat: number) {
  const sb = getSupabase();
  if (!sb) return;
  const version = generation, read = ++playerRead;
  const { data, error } = await sb
    .from("room_players")
    .select("seat, user_id, profiles(*)")
    .eq("room_id", roomId);
  if (error || version !== generation || read !== playerRead || state.roomId !== roomId) return;
  const viewerId = state.players[VIEWER_DISPLAY_SEAT]?.id;
  if (viewerId && !(data ?? []).some(row => row.user_id === viewerId)) {
    // The server removed our membership. Never leave a ghost seat able to send actions.
    set({ connected: false, error: 'Masadan ayrıldınız.', players: mapPlayers((data ?? []) as unknown as PlayerRow[], mySeat) });
    return;
  }
  set({ players: mapPlayers((data ?? []) as unknown as PlayerRow[], mySeat) });
}

async function teardown() {
  generation++;
  stopTokenUpdates?.();
  stopTokenUpdates = null;
  const sb = getSupabase();
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
  if (channel && sb) await sb.removeChannel(channel);
  channel = null;
}

let queue: Promise<unknown> = Promise.resolve();
const serial = <T,>(fn: () => Promise<T>) => {
  const p = queue.then(fn, fn);
  queue = p.catch(() => undefined);
  return p;
};

export const joinRoom = () => serial(joinRoomNow);
/** Consume the membership already committed by change_table, without joining a second time. */
export const switchRoom = (membership: { room_id: number; seat: number }) => serial(() => joinRoomNow(membership));

async function joinRoomNow(membership?: { room_id: number; seat: number }) {
  const sb = getSupabase();
  if (!sb) {
    set({ error: "Server bağlantısı yoxdur." });
    return;
  }
  await teardown();
  const { data: sess } = await sb.auth.getSession();
  accessToken = sess.session?.access_token ?? null;
  const tokenGeneration = generation;
  const { data: tokenSubscription } = sb.auth.onAuthStateChange((_event, session) => {
    if (generation === tokenGeneration) accessToken = session?.access_token ?? null;
  });
  stopTokenUpdates = () => tokenSubscription.subscription.unsubscribe();

  const t0 = Date.now();
  const { data: nowData } = await sb.rpc("server_now");
  if (nowData) serverOffsetMs = new Date(nowData as string).getTime() - (t0 + Date.now()) / 2;

  const result = membership ? { data: [membership], error: null } : await sb.rpc("join_room");
  const { data, error } = result;
  const joined = Array.isArray(data) ? data[0] : null;
  if (error || !joined) {
    set({ error: error?.message ?? "Masaya qoşulmaq olmadı." });
    throw new Error(error?.message ?? "Masaya qoşulmaq olmadı.");
  }
  const roomId = Number(joined.room_id);
  const mySeat = Number(joined.seat);
  const version = generation;
  const current = () => version === generation && state.roomId === roomId;
  // Keep the previous rendered table until the destination snapshot is complete.
  const [initialRoom, initialPlayers] = await Promise.all([
    sb.from("rooms").select("*").eq("id", roomId).single(),
    sb.from("room_players").select("seat, user_id, profiles(*)").eq("room_id", roomId),
  ]);
  if (initialRoom.error || initialPlayers.error || !initialRoom.data) {
    const message = initialRoom.error?.message ?? initialPlayers.error?.message ?? "Masaya qoşulmaq olmadı.";
    set({ connected: false, error: message });
    throw new Error(message);
  }
  if (state.roomId !== roomId) resetRoomMusic();
  set({ roomId, mySeat, room: initialRoom.data as unknown as RoomRow, players: mapPlayers(initialPlayers.data as unknown as PlayerRow[], mySeat), connected: false, error: null });
  applyRoom(initialRoom.data as unknown as RoomRow);
  const { data: auth } = await sb.auth.getUser();
  if (auth.user) installCloudFeatureSession(auth.user.id, switchRoom);
  const refreshRoom = async () => {
    const read = roomRevision.next();
    const { data: room } = await sb.from("rooms").select("*").eq("id", roomId).single();
    if (room && current() && roomRevision.current(read)) applyRoom(room as unknown as RoomRow);
  };
  const roomRevision = revisionGuard();
  const acceptKickout = eventDeduper();

  channel = sb
    .channel(`room-${roomId}`)
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
      (p) => { if (current()) { roomRevision.next(); applyRoom(p.new as RoomRow); } })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` },
      () => { if (current()) { void loadPlayers(roomId, mySeat); nudgeRoom(); } })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` },
      (p) => { const old = p.old as { seat?: number; room_id?: number }; const next = p.new as { seat?: number; room_id?: number }; if (current() && (old.seat !== next.seat || old.room_id !== next.room_id)) void loadPlayers(roomId, mySeat); })
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "room_players" },
      () => {
        // DELETE cannot be filtered reliably under RLS; old fields can be redacted.
        if (current()) { void loadPlayers(roomId, mySeat); void refreshRoom(); }
      })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
      (p) => { if (current()) chatListeners.forEach((fn) => fn(p.new as ChatRow)); })
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" },
      (p) => { const id = Number((p.old as { id?: number }).id); if (current() && id) chatDeleteListeners.forEach((fn) => fn(id)); })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "kickout_events", filter: `room_id=eq.${roomId}` },
      (p) => { const row = p.new as KickoutEventRow; if (current() && acceptKickout(row.id)) kickoutListeners.forEach((fn) => fn(row)); })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "gift_events", filter: `room_id=eq.${roomId}` },
      (p) => { if (current()) giftListeners.forEach((fn) => fn(p.new as GiftRow)); })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "gesture_events", filter: `room_id=eq.${roomId}` },
      (p) => { if (current()) gestureListeners.forEach((fn) => fn(p.new as GestureRow)); })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" },
      (p) => {
        if (!current()) return;
        const prof = p.new as Profile;
        const i = state.players.findIndex((x) => x?.id === prof.id);
        if (i >= 0) {
          playerRead++;
          const before = state.players[i] as (Profile & { harem_owner?: string | null }) | null;
          const after = prof as Profile & { harem_owner?: string | null; harem_value?: number };
          const event = before ? haremTransition(prof.id, before.harem_owner, after.harem_owner, Number(after.harem_value ?? 0)) : null;
          if (event) haremListeners.forEach(fn => fn(event));
          const players = [...state.players];
          players[i] = prof;
          set({ players });
        }
      })
    .subscribe((status) => {
      if (!current()) return;
      if (status === "SUBSCRIBED") { set({ connected: true, error: null }); void loadPlayers(roomId, mySeat); void refreshRoom(); nudgeRoom(); }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        set({ connected: false, error: "Bağlantı kəsildi, yenidən qoşulunur..." });
    });

  let pulse = 0;
  heartbeatTimer = setInterval(() => {
    if (!current()) return;
    void sb.rpc("heartbeat").then(async () => {
      if (!current()) return;
      await sb.rpc('kickout_refresh');
      if (current()) { await sb.rpc("room_tick", { p_room: roomId }); void loadPlayers(roomId, mySeat); }
    });
    if (++pulse % 5 === 0) { void loadPlayers(roomId, mySeat); void refreshRoom(); }
    // A late keepalive leave_room from the previous page can delete the fresh seat: re-join when it is gone.
    if (pulse % 2 === 0) void sb.auth.getUser().then(async ({ data: u }) => {
      if (!u.user || !current()) return;
      const { data: mine, error: missingErr } = await sb.from("room_players").select("room_id").eq("user_id", u.user.id).maybeSingle();
      if (!missingErr && !mine && current()) void joinRoom().catch(() => undefined);
    });
  }, 2000);
  await Promise.all([loadPlayers(roomId, mySeat), refreshRoom()]);
  nudgeRoom();
}

let accessToken: string | null = null;
let stopTokenUpdates: (() => void) | null = null;
/** pagehide: a keepalive request survives tab close, so others see the seat free at once. */
export function leaveRoomNow() {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  const key = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? import.meta.env["VITE_SUPABASE_ANON_KEY"]) as string | undefined;
  if (!url || !key || !accessToken) return;
  try {
    void fetch(`${url}/rest/v1/rpc/leave_room`, { method: "POST", keepalive: true,
      headers: { apikey: key, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: "{}" });
  } catch { /* ignore */ }
}

export const leaveRoom = () =>
  serial(async () => {
    const sb = getSupabase();
    await teardown();
    if (sb) {
      const { error } = await sb.rpc("leave_room");
      if (error) { set({ error: error.message, connected: false }); throw error; }
    }
    resetRoomMusic();
    accessToken = null;
    set(EMPTY);
  });

export function seatOccupied(serverSeat: number | null) {
  return serverSeat !== null && Boolean(state.players[toDisplay(serverSeat, state.mySeat)]);
}

export function nudgeRoom() {
  const sb = getSupabase();
  if (sb && state.roomId !== null) void Promise.resolve(sb.rpc("room_tick", { p_room: state.roomId }));
}

export function profileBySeat(display: number) {
  return state.players[display] ?? null;
}

export function displaySeatOf(userId: string) {
  return state.players.findIndex((p) => p?.id === userId);
}

export async function spinBottle(): Promise<void> {
  await getSupabase()?.rpc("spin_bottle");
}

export async function decide(kiss: boolean): Promise<void> {
  await getSupabase()?.rpc("decide", { p_kiss: kiss });
}

export async function sendChat(text: string, receiverId?: string, isPrivate = false): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.rpc("send_chat", { p_text: text, p_receiver: receiverId ?? null, p_private: Boolean(isPrivate && receiverId) } as never);
  return !error;
}

export async function sendGift(
  giftType: string,
  receiverIds: string[],
  seed: number
): Promise<{ ok: true; gold: number } | { ok: false; reason: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "offline" };
  const { data, error } = await sb.rpc("send_gift", { p_gift: giftType, p_receivers: receiverIds, p_seed: seed });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, gold: Number(data ?? 0) };
}

export function useRoom(): RoomState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => EMPTY
  );
}

export const getRoom = () => state;
/** Server clock (sampled at join), so every client counts the same phase deadline. */
export const serverNow = () => Date.now() + serverOffsetMs;

export async function buyBottle(type: string): Promise<{ ok: true; gold: number } | { ok: false; reason: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "offline" };
  const { data, error } = await sb.rpc("buy_bottle", { p_bottle: type });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, gold: Number(data ?? 0) };
}

/** Server charges tokens and broadcasts the gesture to everyone at the table. */
export async function sendGesture(gesture: string): Promise<{ ok: true; tokens: number } | { ok: false; reason: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "offline" };
  const { data, error } = await sb.rpc("send_gesture", { p_gesture: gesture });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, tokens: Number(data ?? 0) };
}
