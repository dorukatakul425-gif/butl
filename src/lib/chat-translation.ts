import { useSyncExternalStore } from "react";

const eqLocale = (a: string, b: string) => a.slice(0, 2).toLowerCase() === b.slice(0, 2).toLowerCase();

const WORDS: Record<string, string[]> = {
  tr: ["ve", "bir", "bu", "ne", "nasılsın", "merhaba", "selam", "evet", "hayır", "ben", "sen", "çok", "değil", "için", "gibi", "var", "yok", "naber", "iyi", "tamam"],
  az: ["və", "salam", "necəsən", "mən", "sən", "yaxşı", "bəli", "xeyr", "çox", "deyil", "üçün", "nə", "harda", "bu", "var", "yox"],
  en: ["the", "and", "you", "are", "is", "what", "hello", "hi", "how", "i", "my", "your", "this", "that", "yes", "no", "love", "with", "for", "not"],
  de: ["und", "ich", "du", "nicht", "das", "ist", "wie", "hallo", "ja", "nein", "mit", "der", "die"],
  es: ["hola", "que", "como", "estas", "el", "la", "y", "si", "no", "por", "para", "muy", "bien"],
};

/** Language of a chat message (stand-in for the bundled `detect(text)`); undefined when unsure. */
export function detectLocale(text: string): string | undefined {
  if (/[\u0400-\u04FF]/.test(text)) return /[іїєґ]/i.test(text) ? "uk" : "ru";
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u0590-\u05FF]/.test(text)) return "he";
  if (/[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(text)) return "zh";
  if (/[əƏ]/.test(text)) return "az";
  if (/[ğĞıİşŞ]/.test(text)) return "tr";
  if (/[ñ¿¡]/.test(text)) return "es";
  if (/[ß]/.test(text)) return "de";
  const words = text.toLowerCase().match(/[a-zçöüğışə]+/g) ?? [];
  if (words.length === 0) return undefined;
  let best: string | undefined, score = 0;
  for (const [lang, list] of Object.entries(WORDS)) {
    const s = words.filter(w => list.includes(w)).length;
    if (s > score) { best = lang; score = s; }
  }
  return best;
}

/** ChatPresenter.needsTranslation: other players only; sender locale or detected text language differs from the viewer's. */
export function needsTranslation(sender: { locale?: string; isViewer?: boolean }, viewerLocale: string | undefined, text = "") {
  if (sender.isViewer || !viewerLocale) return false;
  if (!text.trim()) return false;
  const found = detectLocale(text);
  // No server locale: offer translation unless the text is clearly in the viewer's language.
  if (!sender.locale) return !found || !eqLocale(found, viewerLocale);
  const detected = found ?? viewerLocale;
  return !eqLocale(sender.locale, viewerLocale) || !eqLocale(detected, viewerLocale);
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
