import { useSyncExternalStore } from 'react';
export const backgrounds = ['default', '#fff8ef', '#edf5e5', '#e8f0fa'] as const;
export const fonts = ['inherit', 'Arial, sans-serif', 'Georgia, serif', 'monospace'] as const;
export interface ChatPreferences { background: string; font: string; premium: boolean; smileys: boolean }
export const defaults: ChatPreferences = { background: 'default', font: 'inherit', premium: true, smileys: true };
export function parsePreferences(raw: string | null): ChatPreferences {
  try { const p = JSON.parse(raw ?? '{}'); return { background: backgrounds.includes(p?.background) ? p.background : defaults.background, font: fonts.includes(p?.font) ? p.font : defaults.font, premium: typeof p?.premium === 'boolean' ? p.premium : true, smileys: typeof p?.smileys === 'boolean' ? p.smileys : true }; } catch { return { ...defaults }; }
}
const key = 'butl:chat-preferences';
const listeners = new Set<() => void>();
let state = defaults;
try { if (typeof localStorage !== 'undefined') state = parsePreferences(localStorage.getItem(key)); } catch { /* private mode */ }
export const getChatPreferences = () => state;
export function setChatPreferences(patch: Partial<ChatPreferences>) {
  state = parsePreferences(JSON.stringify({ ...state, ...patch }));
  try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* session still works */ }
  listeners.forEach(fn => fn());
}
if (typeof window !== 'undefined') window.addEventListener('storage', e => { if (e.key === key || e.key === null) { state = parsePreferences(e.newValue); listeners.forEach(fn => fn()); } });
export const useChatPreferences = () => useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, getChatPreferences, () => defaults);
