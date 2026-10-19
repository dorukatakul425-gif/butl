// Shared ban state: filled from my_ban() for signed-in players or ban_info() after a refused sign-in.
import { useSyncExternalStore } from "react";
import { getSupabase } from "./supabase";

export interface BanInfo { reason: string; banned_at: string; banned_until: string | null; username?: string; male?: boolean | null }

let ban: BanInfo | null = null;
const listeners = new Set<() => void>();
const set = (b: BanInfo | null) => { ban = b; listeners.forEach((l) => l()); };

export function useBan() {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => ban, () => null);
}
export const clearBan = () => set(null);

/** Ciliz rule: remaining ban time rounds to minutes under 1 h, hours under 1 day, else days. */
export function formatBanRemaining(ms: number): { value: number; unit: "dəqiqə" | "saat" | "gün" } {
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 60) return { value: minutes, unit: "dəqiqə" };
  const hours = Math.ceil(ms / 3600000);
  if (hours < 24) return { value: hours, unit: "saat" };
  return { value: Math.ceil(ms / 86400000), unit: "gün" };
}

/** Checks the signed-in player; signs them out when banned. */
export async function checkOwnBan() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.rpc("my_ban");
  const row = (Array.isArray(data) ? data[0] : data) as BanInfo | undefined;
  if (row) { set(row); await sb.auth.signOut().catch(() => undefined); return row; }
  return null;
}

/** Called after a sign-in error; shows the ban screen if that username is banned. */
export async function checkBanForUsername(username: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.rpc("ban_info", { _username: username });
  const row = (Array.isArray(data) ? data[0] : data) as BanInfo | undefined;
  if (row) { set({ ...row, username }); return row; }
  return null;
}

export const isBanError = (message: string | undefined) => !!message && /banned|user_banned/i.test(message);
