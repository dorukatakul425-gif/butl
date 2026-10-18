// supabase.ts — dəyişmədi, yalnız Profile tipi export edilir
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (client !== undefined) return client;
  const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  const key = (
    import.meta.env["VITE_SUPABASE_ANON_KEY"] ??
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]
  ) as string | undefined;
  client =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: true, autoRefreshToken: true },
        })
      : null;
  return client;
}

export function normalizeUsername(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_.]/g, "");
}
export function usernameEmail(name: string) {
  return `${normalizeUsername(name)}@butl.local`;
}

export interface Profile {
  id: string;
  player_no: number;
  username: string;
  name: string;
  male: boolean;
  age: number | null;
  birthday?: string | null;
  /** Telegram-style first-entry gender/age setup finished (complete_profile_setup RPC). */
  profile_setup_done?: boolean;
  city: string | null;
  photo_url: string | null;
  frame: string;
  stone: string;
  kisses: number;
  gold: number;
  tokens?: number;
  dat?: number;
  vip_until: string | null;
  owned_items?: string[];
  created_at: string;
}
