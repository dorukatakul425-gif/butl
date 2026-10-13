import { useSyncExternalStore } from "react";

/** ChatPresenter.needsTranslation: only for other players whose locale differs from the viewer's. */
export function needsTranslation(sender: { locale?: string; isViewer?: boolean }, viewerLocale: string | undefined) {
  if (sender.isViewer || !viewerLocale || !sender.locale) return false;
  return sender.locale.slice(0, 2).toLowerCase() !== viewerLocale.slice(0, 2).toLowerCase();
}

/** session.translateText → server "translate" reply. Installed by the authenticated game session. */
export type ChatTranslator = (text: string, key: number) => Promise<string>;
let translator: ChatTranslator | null = null;
export function registerChatTranslator(fn: ChatTranslator | null) { translator = fn; }
export function chatTranslator() { return translator; }

/** ChatContent.msg2trans: translated text and whether it is currently shown. */
type Entry = { translated?: string; shown: boolean };
let state: Record<number, Entry> = {};
const listeners = new Set<() => void>();
const set = (key: number, entry: Entry) => { state = { ...state, [key]: entry }; listeners.forEach(l => l()); };
export function toggleTranslation(key: number) {
  const e = state[key];
  if (e?.translated) set(key, { ...e, shown: !e.shown });
}
export function applyTranslation(key: number, text: string) { set(key, { translated: ` ${text}`, shown: true }); }
export function useChatTranslations() {
  return useSyncExternalStore(l => { listeners.add(l); return () => { listeners.delete(l); }; }, () => state, () => state);
}
