import { useSyncExternalStore } from "react";
import type { MusicItem, MusicService } from "@/lib/music";
import type { ChatProfile } from "@/lib/chat-format";

export interface MusicSender { id: string; name: string; photoUrl: string; musicLevel: number }
export interface PlayingSong {
  key: number;
  musicItem: MusicItem;
  isVideo: boolean;
  service: MusicService;
  sender: MusicSender;
  startedAt: number;
}
export interface ChatMusicLine { kind?: "music"; key: number; sender: MusicSender; artist: string; title: string; messageId?: number; eventKey?: number; createdAt?: string }
export interface ChatUser extends ChatProfile { name: string; photoUrl: string }
export interface ChatGiftLine { kind: "gift"; key: number; sender: ChatUser; receivers: ChatUser[]; giftType: string; image: string; imageWidth?: number; imageHeight?: number; name: string; count: number }
export interface ChatTextLine { kind: "text"; key: number; sender: ChatUser; receiver?: ChatUser; text: string; messageId?: number; private?: boolean; createdAt?: string }
/** ChatView.createKickoutLine: kicker photo, kick/kicked/save icon, arrows, target photo. */
export interface ChatKickoutLine { kind: "kickout"; key: number; icon: "kick" | "kicked" | "save"; sender: ChatUser; receiver: ChatUser; eventId: number }
export type ChatActionPart = { text: string } | { user: ChatUser };
/** ChatContent.pushActionLine: newcomer / birthday / vip / rewarded-video widget rows. */
export interface ChatActionLine { kind: "action"; key: number; style: "newcomer" | "birthday" | "vip" | "rewarded-video"; icon: "gift" | "chat" | "vip" | "rewarded-video"; parts: ChatActionPart[]; sender?: ChatUser; seat?: number; messageId?: number; createdAt?: string }
/** ChatView.createBottleLine: sender photo, old bottle (grayscale, 45°), green arrows, new bottle. No text. */
export interface ChatBottleLine { kind: "bottle"; key: number; sender: ChatUser; oldImage: string; oldName: string; newImage: string; newName: string; messageId?: number }
/** ChatView.createHaremLine: sender photo, harem icon, grey text with <heart>price, receiver photo. */
export interface ChatHaremLine { kind: "harem"; key: number; icon: "harem_free" | "harem_busy"; sender: ChatUser; receiver: ChatUser; text: string; price: number }
/** Original system lines: admin_chat (green 6fbf5c), ban / disabled_ban (red ff4545). */
export interface ChatSystemLine { kind: "system"; key: number; style: "admin_chat" | "ban" | "disabled_ban"; text: string; messageId?: number; createdAt?: string }
/** ChatView.createGestureLine: performer's clickable photo followed by the gesture image (40x40), no sentence. */
export interface ChatGestureLine { kind: "gesture"; key: number; sender: ChatUser; gestureType: string; gestureName: string; image: string; eventId: number }
export type ChatLine = ChatMusicLine | ChatGiftLine | ChatTextLine | ChatActionLine | ChatKickoutLine | ChatHaremLine | ChatSystemLine | ChatGestureLine | ChatBottleLine;
/** Everyone at the table sees who used the gesture: the performer's photo plus the gesture image. */
/** Everyone at the table sees the bottle change: sender photo, old bottle, arrows, new bottle. */
export function pushBottleLine(sender: ChatUser, oldImage: string, oldName: string, newImage: string, newName: string, messageId?: number) {
  if (messageId !== undefined && state.lines.some(l => l.kind === "bottle" && l.messageId === messageId)) return false;
  set({ lines: capLines([...state.lines, { kind: "bottle", key: ++seq, sender, oldImage, oldName, newImage, newName, ...(messageId !== undefined ? { messageId } : {}) }]) });
  return true;
}
export function pushGestureLine(sender: ChatUser, gestureType: string, gestureName: string, image: string, eventId: number) {
  if (state.lines.some(l => l.kind === "gesture" && l.eventId === eventId)) return false;
  set({ lines: capLines([...state.lines, { kind: "gesture", key: ++seq, sender, gestureType, gestureName, image, eventId }]) });
  return true;
}
export function pushSystemLine(style: ChatSystemLine["style"], text: string, messageId?: number) {
  if (messageId !== undefined && state.lines.some(l => l.kind === "system" && l.messageId === messageId)) return false;
  set({ lines: capLines([...state.lines, { kind: "system", key: ++seq, style, text, ...(messageId !== undefined ? { messageId } : {}) }]) });
  return true;
}
export function pushHaremLine(line: Omit<ChatHaremLine, "kind" | "key">) {
  set({ lines: capLines([...state.lines, { kind: "harem", key: ++seq, ...line }]) });
}

interface State { song: PlayingSong | null; lines: ChatLine[]; muted: boolean; volume: number }
const MUSIC_KEY = "deltagame.music.volume";
const savedMusic = (() => { try { const v = Number(typeof window !== "undefined" ? window.localStorage.getItem(MUSIC_KEY) ?? 1 : 1); return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1; } catch { return 1; } })();
let state: State = { song: null, lines: [], muted: savedMusic === 0, volume: savedMusic };
const listeners = new Set<() => void>();
let batching = 0;
let changed = false;
const set = (next: Partial<State>) => { state = { ...state, ...next }; if (batching) changed = true; else listeners.forEach(l => l()); };
/** History is one snapshot, not 100 nested external-store notifications. */
export function batchChatHistory(work: () => void) {
  batching++;
  try { work(); } finally {
    batching--;
    if (!batching && changed) { changed = false; listeners.forEach(l => l()); }
  }
}
let seq = 0;
// Sohbet listesi sınırsız büyüyünce telefon kasmaya başlıyordu; Ciliz gibi son 100 satır tutulur.
const MAX_CHAT_LINES = 100;
const capLines = (lines: ChatLine[]) => (lines.length > MAX_CHAT_LINES ? lines.slice(lines.length - MAX_CHAT_LINES) : lines);

/** Local chat only; real multiplayer transport is not configured. */
export function pushKickoutLine(icon: ChatKickoutLine["icon"], sender: ChatUser, receiver: ChatUser, eventId: number) {
  if (state.lines.some(l => l.kind === "kickout" && l.eventId === eventId)) return;
  set({ lines: capLines([...state.lines, { kind: "kickout", key: ++seq, icon, sender, receiver, eventId }]) });
}
export function pushTextLine(sender: ChatUser, text: string, receiver?: ChatUser, messageId?: number, isPrivate = false) {
  if (!text.trim()) return false;
  if (messageId !== undefined && state.lines.some(line => line.kind === 'text' && line.messageId === messageId)) return false;
  set({ lines: capLines([...state.lines, { kind: "text", key: ++seq, sender, text, ...(receiver ? { receiver } : {}), ...(messageId !== undefined ? { messageId } : {}), ...(isPrivate ? { private: true } : {}) }]) });
  return true;
}

/** Admin deleted a message: drop it for everyone with no placeholder. */
export function removeTextLine(messageId: number) {
  set({ lines: state.lines.filter(l => !("messageId" in l && l.messageId === messageId)) });
}

export function pushActionLine(line: Omit<ChatActionLine, "kind" | "key">) {
  if (line.messageId !== undefined && state.lines.some(l => "messageId" in l && l.messageId === line.messageId)) return;
  set({ lines: capLines([...state.lines, { kind: "action", key: ++seq, ...line }]) });
}

/** session.viewerSendMusic + ChatPresenter.music(): start the track for the table and log it in the chat. */
// Mobile browsers (iOS Safari) only allow play() inside the tap itself, so the shared
// audio element is started synchronously from the confirm click.
let sharedAudio: HTMLAudioElement | null = null;
export function getSharedAudio() {
  if (!sharedAudio && typeof Audio !== "undefined") { sharedAudio = new Audio(); sharedAudio.preload = "auto"; sharedAudio.muted = state.muted; sharedAudio.volume = state.volume; (sharedAudio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true; }
  return sharedAudio;
}
/** Prepare playback in the actual tap, without overriding the viewer's sound settings. */
export function resumeMusicAudio() {
  const audio = getSharedAudio();
  if (!audio) return;
  audio.muted = state.muted;
  audio.volume = state.volume;
  if (audio.src && audio.paused && !audio.ended) void audio.play().catch(() => {});
}
/** Table-scoped media and chat must not follow the viewer to another room. */
export function resetRoomMusic() {
  sharedAudio?.pause();
  set({ song: null, lines: [] });
}
/** Server-confirmed table song (rooms.music). */
export interface RoomMusic { service: "cz" | "yt"; item: MusicItem; sender: string; started_at: string; key: number }
const serviceRegistry: Partial<Record<"cz" | "yt", MusicService>> = {};
export function registerMusicServices(services: MusicService[]) { services.forEach(s => { serviceRegistry[s.id] = s; }); }
const stubService = (id: "cz" | "yt"): MusicService => ({ id, musicPrice: id === "yt" ? 9 : 5, confirmationTitleId: "", mediaSearchCooldown: 200, supportsMusicTabs: true,
  search: async () => [], getPopular: async () => [], getMusicByIds: async () => [] });

/** session.viewerSendMusic: the server charges the price and stores the song on the table; everyone (sender included) plays it from the room feed. */
export async function sendMusic(music: MusicItem, service: MusicService): Promise<{ ok: true } | { ok: false; reason: string }> {
  const audio = getSharedAudio();
  const previous = audio ? { src: audio.src, time: audio.currentTime, paused: audio.paused } : null;
  // Unlock audio inside the tap (iOS); the feed then sets the real start position.
  if (audio && service.id !== "yt") { audio.src = music.url; audio.currentTime = 0; resumeMusicAudio(); }
  const { getSupabase } = await import("@/lib/supabase");
  const sb = getSupabase();
  if (!sb) { audio?.pause(); return { ok: false, reason: "offline" }; }
  const { error } = await sb.rpc("play_music", { p_service: service.id, p_item: music });
  if (error) {
    if (audio && previous) { audio.pause(); audio.src = previous.src; audio.currentTime = previous.time; if (!previous.paused) resumeMusicAudio(); }
    return { ok: false, reason: error.message };
  }
  return { ok: true };
}

/** Apply rooms.music: same song for everyone, resumed at the shared position after a reload. */
export function applyRoomMusic(music: RoomMusic | null | undefined, serverOffsetMs: number, sender: MusicSender | null) {
  if (!music || !sender) return;
  if (state.song?.key === music.key) return;
  const startedAt = Date.parse(music.started_at) - serverOffsetMs;
  if (Date.now() - startedAt > music.item.duration * 1000) return; // already finished
  set({ song: { key: music.key, musicItem: music.item, isVideo: music.service === "yt", service: serviceRegistry[music.service] ?? stubService(music.service), sender, startedAt } });
}
const sameUsers = (a: ChatUser[], b: ChatUser[]) => a.length === b.length && a.every(u => b.some(v => v.id === u.id));
const intersects = (a: ChatUser[], b: ChatUser[]) => a.some(u => b.some(v => v.id === u.id));
/** Batcher.sendGift + GiftBatch.merge: consecutive same gifts from one sender collapse into one line with a count. */
export function pushGiftLine(sender: ChatUser, receiver: ChatUser, gift: { type: string; image: string; name: string; width?: number; height?: number }) {
  let line: ChatGiftLine = { kind: "gift", key: ++seq, sender, receivers: [receiver], giftType: gift.type, image: gift.image, ...(gift.width ? { imageWidth: gift.width } : {}), ...(gift.height ? { imageHeight: gift.height } : {}), name: gift.name, count: 1 };
  const lines = [...state.lines];
  for (;;) {
    const prev = lines[lines.length - 1];
    if (!prev || prev.kind !== "gift" || prev.sender.id !== line.sender.id || prev.giftType !== line.giftType) break;
    if (sameUsers(prev.receivers, line.receivers)) line = { ...prev, count: prev.count + line.count };
    else if (!intersects(prev.receivers, line.receivers) && prev.count === line.count) line = { ...prev, receivers: [...prev.receivers, ...line.receivers] };
    else break;
    lines.pop();
  }
  lines.push(line);
  set({ lines: capLines(lines) });
}
export const finishMusic = (key: number) => { if (state.song?.key === key) { sharedAudio?.pause(); set({ song: null }); } };
export const setMusicMuted = (muted: boolean) => {
  set({ muted });
  if (sharedAudio) sharedAudio.muted = muted;
};
export const setMusicVolume = (value: number) => {
  const volume = Math.max(0, Math.min(1, value));
  const muted = volume === 0;
  set({ volume, muted });
  try { window.localStorage.setItem(MUSIC_KEY, String(volume)); } catch { /* ignore */ }
  if (sharedAudio) { sharedAudio.volume = volume; sharedAudio.muted = muted; }
};

const serverSnapshot: State = state;
export function useMusicSession() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => serverSnapshot,
  );
}

/** Music notices are independent from current playback and replay from chat_messages. */
export function pushMusicHistoryLine(sender: MusicSender, artist: string, title: string, messageId: number, eventKey?: number) {
  if (state.lines.some(l => "messageId" in l && l.messageId === messageId)) return false;
  set({ lines: capLines([...state.lines, { kind: "music", key: ++seq, sender, artist, title, messageId, ...(eventKey !== undefined ? { eventKey } : {}) }]) });
  return true;
}
export function stampChatHistory(messageId: number, createdAt: string) {
  const lines = state.lines.map(l => "messageId" in l && l.messageId === messageId ? { ...l, createdAt } : l);
  // Keep replayed and realtime rows in server order, without rearranging local animations/widgets.
  const stored = lines.filter(l => "messageId" in l && l.messageId !== undefined).sort((a,b) => ("messageId" in a ? a.messageId ?? 0 : 0) - ("messageId" in b ? b.messageId ?? 0 : 0));
  let i = 0;
  set({ lines: lines.map(l => "messageId" in l && l.messageId !== undefined ? stored[i++] ?? l : l) });
}
export function expireChatHistory(now = Date.now()) {
  const lines = state.lines.filter(l => !("createdAt" in l && l.createdAt && Date.parse(l.createdAt) <= now - 24 * 3600_000));
  if (lines.length !== state.lines.length) set({ lines });
}
