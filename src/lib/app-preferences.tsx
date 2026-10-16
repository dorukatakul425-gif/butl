import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';
import dictionary from './app-translations.json';
export type Language = 'az' | 'tr' | 'ru' | 'en';
export type Appearance = 'light' | 'dark';
export const languages: Array<{code:Language; name:string; flag:string}> = [{code:'az',name:'Azərbaycan',flag:'🇦🇿'},{code:'tr',name:'Türkçe',flag:'🇹🇷'},{code:'ru',name:'Русский',flag:'🇷🇺'},{code:'en',name:'English',flag:'🇬🇧'}];
export const PREFERENCE_KEY = 'butl.app.preferences.v1';
const initial = { language:'az' as Language, theme:'light' as Appearance };
let current = initial;
const listeners = new Set<() => void>();
export function parsePreferences(raw: string | null) {
  try { const p = JSON.parse(raw ?? '{}'); return {language: languages.some(l=>l.code===p?.language) ? p.language as Language : 'az' as Language, theme:p?.theme==='dark'?'dark' as Appearance:'light' as Appearance}; } catch { return initial; }
}
function emit() { listeners.forEach(fn=>fn()); }
export function setPreferences(next: Partial<typeof initial>) {
 current={...current,...next}; try {localStorage.setItem(PREFERENCE_KEY,JSON.stringify(current));} catch { /* Session selection still works when storage is blocked. */ } emit();
}
export function usePreferences() {return useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},()=>current,()=>initial);}
export function translate(text:string, language:Language=current.language):string { if (typeof window !== 'undefined' && window.location.pathname === '/game') language='az'; return (dictionary as Record<string,Record<Language,string>>)[text]?.[language] ?? text;}
const GameScope=createContext(false);
export function useAppTranslation() {const p=usePreferences();const game=useContext(GameScope);return (text:string)=>translate(text,game?'az':p.language);}
export function PreferencesProvider({children}:{children:ReactNode}) {
 const preferences=usePreferences(); const path=useRouterState({select:s=>s.location.pathname}); const game=path==='/game';
 useEffect(()=>{try {current=parsePreferences(localStorage.getItem(PREFERENCE_KEY));emit();}catch{} const onStorage=(e:StorageEvent)=>{if(e.key===PREFERENCE_KEY){current=parsePreferences(e.newValue);emit();}};window.addEventListener('storage',onStorage);return()=>window.removeEventListener('storage',onStorage);},[]);
 useEffect(()=>{document.documentElement.lang=game?'az':preferences.language;},[game,preferences.language]);
 return <GameScope value={game}><div className={game?undefined:'app-preferences'} data-theme={game?undefined:preferences.theme}>{children}</div></GameScope>;
}
