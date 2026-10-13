import { useSyncExternalStore } from "react";

/**
 * Local stand-in for the viewer's session counters (totalKisses, vip) until the
 * game backend exists. VIP is never granted here; kisses grow only from real
 * mutual kisses in rounds, so kiss-locked gifts unlock like the original.
 */
export interface ViewerProgress { kisses: number; vip: false }
/** Hearts balance: unknown until the game backend exists, so paid items need hearts (0). */
export const VIEWER_GOLD = 0;
const KEY = "bottle:viewer-progress";
const listeners = new Set<() => void>();
let state: ViewerProgress = { kisses: 0, vip: false };
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const kisses = Number(JSON.parse(window.localStorage.getItem(KEY) ?? "{}").kisses);
    if (Number.isFinite(kisses) && kisses > 0) state = { kisses: Math.floor(kisses), vip: false };
  } catch { /* ignore corrupt storage */ }
}

export function getViewerProgress(): ViewerProgress { load(); return state; }

export function addViewerKiss(count = 1) {
  load();
  state = { kisses: state.kisses + Math.max(0, Math.floor(count)), vip: false };
  try { window.localStorage.setItem(KEY, JSON.stringify({ kisses: state.kisses })); } catch { /* storage full */ }
  listeners.forEach(l => l());
}

const SERVER: ViewerProgress = { kisses: 0, vip: false };
export function useViewerProgress(): ViewerProgress {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, getViewerProgress, () => SERVER);
}

/** Server profile counter is the truth once signed in. */
export function setViewerKisses(kisses: number) {
  load();
  if (state.kisses === kisses) return;
  state = { kisses: Math.max(0, Math.floor(kisses)), vip: false };
  listeners.forEach(l => l());
}
