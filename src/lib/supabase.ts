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
  if (client) hardenRealtime(client);
  return client;
}

// Database-change-only channels: their topic is local, so every subscriber gets its own
// instance. A shared instance made a second mount call .on() after subscribe(), which threw
// inside React and replaced the table with "This page didn't load" during gift bursts.
const PRIVATE_TOPICS = ["appearance:", "harem-inbox:", "table-direct-alert:", "social:", "site-refresh:", "league-"];
type AnyChannel = ReturnType<SupabaseClient["channel"]> & { __safe?: boolean };
function hardenRealtime(sb: SupabaseClient) {
  const create = sb.channel.bind(sb);
  const safe = (ch: AnyChannel): AnyChannel => {
    if (ch.__safe) return ch;
    ch.__safe = true;
    const on = ch.on.bind(ch) as (...a: unknown[]) => AnyChannel;
    const subscribe = ch.subscribe.bind(ch) as (...a: unknown[]) => AnyChannel;
    (ch as unknown as { on: unknown }).on = (...a: unknown[]) => {
      try { return on(...a); } catch (e) { console.warn("[realtime] listener skipped", (e as Error)?.message); return ch; }
    };
    (ch as unknown as { subscribe: unknown }).subscribe = (...a: unknown[]) => {
      try { return subscribe(...a); } catch (e) { console.warn("[realtime] subscribe skipped", (e as Error)?.message); return ch; }
    };
    return ch;
  };
  (sb as unknown as { channel: unknown }).channel = (name: string, opts?: Parameters<SupabaseClient["channel"]>[1]) => {
    const topic = PRIVATE_TOPICS.some((p) => name.startsWith(p)) ? `${name}:u${Math.random().toString(36).slice(2, 9)}` : name;
    return safe(create(topic, opts) as AnyChannel);
  };
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
  /** Scripted first-entry tutorial with fake table finished (complete_tutorial RPC). */
  tutorial_done?: boolean;
  telegram_id?: number | null;
  city: string | null;
  photo_url: string | null;
  frame: string;
  stone: string;
  kisses: number;
  /** Original game.kisses: kisses collected at the current table (room_players.kisses), reset on leave. */
  table_kisses?: number;
  gold: number;
  tokens?: number;
  dat?: number;
  vip_until: string | null;
  owned_items?: string[];
  created_at: string;
}
