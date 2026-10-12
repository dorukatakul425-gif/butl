import { useSyncExternalStore } from "react";

export interface ChatPlayer { id: string; name: string; photoUrl: string; locale?: string; frame?: string; stone?: string }
export interface ChatMessage { id: string; sender: ChatPlayer; text: string; receiver?: ChatPlayer; canTranslate?: boolean }
export interface GameSessionSnapshot { viewer: ChatPlayer | null; hearts: number | null; messages: ChatMessage[] }
export interface GameSessionAdapter {
  getSnapshot: () => GameSessionSnapshot;
  subscribe: (listener: () => void) => () => void;
  sendMessage: (text: string, receiverId?: string) => Promise<void>;
  translateMessage: (id: string) => Promise<string>;
  reportMessage: (id: string) => Promise<void>;
  blockUser: (id: string) => Promise<void>;
}
const empty: GameSessionSnapshot = { viewer: null, hearts: null, messages: [] };
let adapter: GameSessionAdapter | null = null;
let snapshot = empty;
let unsubscribe: (() => void) | undefined;
const listeners = new Set<() => void>();
const notify = () => { snapshot = adapter?.getSnapshot() ?? empty; listeners.forEach(fn => fn()); };
/** Install only after the host game has authenticated the current player. */
export function attachGameSession(next: GameSessionAdapter | null) {
  unsubscribe?.();
  adapter = next;
  unsubscribe = next?.subscribe(notify);
  notify();
}
export function useGameSession() {
  return useSyncExternalStore(fn => { listeners.add(fn); return () => listeners.delete(fn); }, () => snapshot, () => empty);
}
function requireSession() {
  if (!adapter || !snapshot.viewer) throw new Error("Oyuncu hesabı bağlı değil; sohbet işlemleri için hesabınızı bağlayın.");
  return adapter;
}
export async function sendChatMessage(text: string, receiverId?: string) {
  const value = text.trim();
  if (!value) return;
  await requireSession().sendMessage(value, receiverId);
}
export const translateChatMessage = (id: string) => requireSession().translateMessage(id);
export const reportChatMessage = (id: string) => requireSession().reportMessage(id);
export const blockChatUser = (id: string) => requireSession().blockUser(id);