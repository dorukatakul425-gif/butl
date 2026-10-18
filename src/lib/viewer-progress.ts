import { useSyncExternalStore } from "react";
import { getSupabase } from "@/lib/supabase";

/**
 * Viewer session counters. Kisses come from the server profile; VIP and Premium
 * come from the server's vip_until / premium_until and switch off by themselves
 * the moment the paid period ends (the server enforces the same expiry).
 */
export interface ViewerProgress { kisses: number; vip: boolean; vipUntil: number | null; vipPlan: string | null; premium: boolean; premiumUntil: number | null }
/** Hearts balance: unknown until the game backend exists, so paid items need hearts (0). */
export const VIEWER_GOLD = 0;
export const VIEWER_STATUS_CHANGED = "viewer:status-changed";
const KEY = "bottle:viewer-progress";
const listeners = new Set<() => void>();
let state: ViewerProgress = { kisses: 0, vip: false, vipUntil: null, vipPlan: null, premium: false, premiumUntil: null };
let loaded = false;
let watching = false;
let expiryTimer: number | undefined;

const emit = () => listeners.forEach(l => l());
const set = (patch: Partial<ViewerProgress>) => { state = { ...state, ...patch }; emit(); };

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const kisses = Number(JSON.parse(window.localStorage.getItem(KEY) ?? "{}").kisses);
    if (Number.isFinite(kisses) && kisses > 0) state = { ...state, kisses: Math.floor(kisses) };
  } catch { /* ignore corrupt storage */ }
}

function applyTimes(vipUntil: number | null, premiumUntil: number | null) {
  const now = Date.now();
  set({ vipUntil, premiumUntil, vip: !!vipUntil && vipUntil > now, premium: !!premiumUntil && premiumUntil > now });
  window.clearTimeout(expiryTimer);
  const next = [vipUntil, premiumUntil].filter((t): t is number => !!t && t > now).sort((a, b) => a - b)[0];
  if (next) expiryTimer = window.setTimeout(() => applyTimes(state.vipUntil, state.premiumUntil), Math.min(next - now + 50, 2 ** 31 - 1));
}

export async function refreshViewerStatus() {
  const sb = getSupabase();
  if (!sb?.auth) return;
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return applyTimes(null, null);
  let { data, error } = await sb.from("profiles").select("vip_until, vip_plan, premium_until").eq("id", u.user.id).maybeSingle();
  // Server not yet updated with vip_plan: still read the VIP time.
  if (error) ({ data } = await sb.from("profiles").select("vip_until, premium_until").eq("id", u.user.id).maybeSingle());
  const p = data as { vip_until: string | null; vip_plan?: string | null; premium_until: string | null } | null;
  set({ vipPlan: p?.vip_plan ?? null });
  applyTimes(p?.vip_until ? Date.parse(p.vip_until) : null, p?.premium_until ? Date.parse(p.premium_until) : null);
}

function watch() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  void refreshViewerStatus();
  window.addEventListener(VIEWER_STATUS_CHANGED, () => void refreshViewerStatus());
  window.setInterval(() => void refreshViewerStatus(), 60_000);
  // VIP granted elsewhere (other device, admin) unlocks VIP gestures/sounds without reload.
  window.addEventListener("focus", () => void refreshViewerStatus());
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") void refreshViewerStatus(); });
}

export function getViewerProgress(): ViewerProgress { load(); return state; }

export function addViewerKiss(count = 1) {
  load();
  set({ kisses: state.kisses + Math.max(0, Math.floor(count)) });
  try { window.localStorage.setItem(KEY, JSON.stringify({ kisses: state.kisses })); } catch { /* storage full */ }
}

const SERVER: ViewerProgress = { kisses: 0, vip: false, vipUntil: null, vipPlan: null, premium: false, premiumUntil: null };
export function useViewerProgress(): ViewerProgress {
  return useSyncExternalStore(cb => { watch(); listeners.add(cb); return () => listeners.delete(cb); }, getViewerProgress, () => SERVER);
}

/** Server profile counter is the truth once signed in. */
export function setViewerKisses(kisses: number) {
  load();
  if (state.kisses === kisses) return;
  set({ kisses: Math.max(0, Math.floor(kisses)) });
}
