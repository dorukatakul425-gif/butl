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
export interface ChatMusicLine { kind?: "music"; key: number; sender: MusicSender; artist: string; title: string }
export interface ChatUser extends ChatProfile { name: string; photoUrl: string }
export interface ChatGiftLine { kind: "gift"; key: number; sender: ChatUser; receivers: ChatUser[]; giftType: string; image: string; name: string; count: number }
export interface ChatTextLine { kind: "text"; key: number; sender: ChatUser; receiver?: ChatUser; text: string }
export type ChatActionPart = { text: string } | { user: ChatUser };
/** ChatContent.pushActionLine: newcomer / birthday / vip / rewarded-video widget rows. */
export interface ChatActionLine { kind: "action"; key: number; style: "newcomer" | "birthday" | "vip" | "rewarded-video"; icon: "gift" | "chat" | "vip" | "rewarded-video"; parts: ChatActionPart[]; sender?: ChatUser; seat?: number }
export type ChatLine = ChatMusicLine | ChatGiftLine | ChatTextLine | ChatActionLine;

interface State { song: PlayingSong | null; lines: ChatLine[]; muted: boolean; volume: number }
let state: State = { song: null, lines: [], muted: false, volume: 1 };
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => { state = { ...state, ...next }; listeners.forEach(l => l()); };
let seq = 0;

/** Local chat only; real multiplayer transport is not configured. */
export function pushTextLine(sender: ChatUser, text: string, receiver?: ChatUser) {
  if (!text.trim()) return false;
  set({ lines: [...state.lines, { kind: "text", key: ++seq, sender, text, ...(receiver ? { receiver } : {}) }] });
  return true;
}

export function pushActionLine(line: Omit<ChatActionLine, "kind" | "key">) {
  set({ lines: [...state.lines, { kind: "action", key: ++seq, ...line }] });
}

/** session.viewerSendMusic + ChatPresenter.music(): start the track for the table and log it in the chat. */
// Mobile browsers (iOS Safari) only allow play() inside the tap itself, so the shared
// audio element is started synchronously from the confirm click.
let sharedAudio: HTMLAudioElement | null = null;
export function getSharedAudio() {
  if (!sharedAudio && typeof Audio !== "undefined") { sharedAudio = new Audio(); sharedAudio.preload = "auto"; (sharedAudio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true; }
  return sharedAudio;
}
export function sendMusic(music: MusicItem, service: MusicService, sender: MusicSender) {
  const key = ++seq;
  const audio = getSharedAudio();
  if (audio) {
    if (service.id === "yt") audio.pause();
    else { audio.src = music.url; audio.currentTime = 0; void audio.play().catch(() => {}); }
  }
  set({
    song: { key, musicItem: music, isVideo: service.id === "yt", service, sender, startedAt: Date.now() },
    lines: [...state.lines, { key, sender, artist: music.artist, title: music.title }],
  });
}
const sameUsers = (a: ChatUser[], b: ChatUser[]) => a.length === b.length && a.every(u => b.some(v => v.id === u.id));
const intersects = (a: ChatUser[], b: ChatUser[]) => a.some(u => b.some(v => v.id === u.id));
/** Batcher.sendGift + GiftBatch.merge: consecutive same gifts from one sender collapse into one line with a count. */
export function pushGiftLine(sender: ChatUser, receiver: ChatUser, gift: { type: string; image: string; name: string }) {
  let line: ChatGiftLine = { kind: "gift", key: ++seq, sender, receivers: [receiver], giftType: gift.type, image: gift.image, name: gift.name, count: 1 };
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
  set({ lines });
}
export const finishMusic = (key: number) => { if (state.song?.key === key) { sharedAudio?.pause(); set({ song: null }); } };
export const setMusicMuted = (muted: boolean) => set({ muted });
export const setMusicVolume = (volume: number) => set({ volume, muted: volume === 0 ? state.muted : false });

const serverSnapshot: State = state;
export function useMusicSession() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => serverSnapshot,
  );
}
