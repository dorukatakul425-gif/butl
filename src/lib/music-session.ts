import { useSyncExternalStore } from "react";
import type { MusicItem, MusicService } from "@/lib/music";

export interface MusicSender { id: string; name: string; photoUrl: string; musicLevel: number }
export interface PlayingSong {
  key: number;
  musicItem: MusicItem;
  isVideo: boolean;
  service: MusicService;
  sender: MusicSender;
  startedAt: number;
}
export interface ChatMusicLine { key: number; sender: MusicSender; artist: string; title: string }

interface State { song: PlayingSong | null; lines: ChatMusicLine[]; muted: boolean; volume: number }
let state: State = { song: null, lines: [], muted: false, volume: 1 };
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => { state = { ...state, ...next }; listeners.forEach(l => l()); };
let seq = 0;

/** session.viewerSendMusic + ChatPresenter.music(): start the track for the table and log it in the chat. */
export function sendMusic(music: MusicItem, service: MusicService, sender: MusicSender) {
  const key = ++seq;
  set({
    song: { key, musicItem: music, isVideo: service.id === "yt", service, sender, startedAt: Date.now() },
    lines: [...state.lines, { key, sender, artist: music.artist, title: music.title }],
  });
}
export const finishMusic = (key: number) => { if (state.song?.key === key) set({ song: null }); };
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
