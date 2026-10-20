// Global lobby chat over Cloud realtime: last 100 messages, live inserts/deletes, online presence.
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

export type GlobalMessage = { id: string; sender_id: string; body: string; reply_to: string | null; created_at: string; pending?: boolean };

export const GLOBAL_MAX_LENGTH = 500;
export const GLOBAL_SLOW_MODE_MS = 3000;
export const GLOBAL_HISTORY = 100;
const COLS = "id,sender_id,body,reply_to,created_at";

export function normalizeGlobal(text: string): string | null {
  const t = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!t || t.length > GLOBAL_MAX_LENGTH) return null;
  return t;
}
/** Milliseconds the player still has to wait before the next message (0 = may send). */
export function slowModeWait(lastSentAt: number | null, now: number): number {
  if (lastSentAt == null) return 0;
  return Math.max(0, GLOBAL_SLOW_MODE_MS - (now - lastSentAt));
}
export function mergeGlobal(list: readonly GlobalMessage[], rows: readonly GlobalMessage[]): GlobalMessage[] {
  const map = new Map(list.map(m => [m.id, m]));
  for (const r of rows) map.set(r.id, r);
  return [...map.values()].sort((a, b) => a.created_at.localeCompare(b.created_at)).slice(-GLOBAL_HISTORY * 2);
}
export function mentionsMe(body: string, myName: string | null | undefined): boolean {
  if (!myName) return false;
  return body.toLocaleLowerCase().includes("@" + myName.toLocaleLowerCase());
}

export async function loadGlobal(): Promise<GlobalMessage[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from("global_messages").select(COLS).order("created_at", { ascending: false }).limit(GLOBAL_HISTORY);
  return ((data ?? []) as GlobalMessage[]).reverse();
}
export async function sendGlobal(body: string, replyTo: string | null): Promise<{ ok: true; message: GlobalMessage } | { ok: false; error: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Bağlantı yoxdur" };
  const { data, error } = await sb.from("global_messages").insert({ body, reply_to: replyTo }).select(COLS).single();
  if (error) return { ok: false, error: /slow_mode/.test(error.message) ? "Çox tez yazırsan, bir az gözlə" : /banned/.test(error.message) ? "Hesabın bloklanıb" : "Mesaj göndərilmədi" };
  return { ok: true, message: data as GlobalMessage };
}
export async function deleteGlobal(id: string) {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("global_messages").delete().eq("id", id);
  return !error;
}
export function subscribeGlobal(me: string, on: { insert: (m: GlobalMessage) => void; remove: (id: string) => void; online: (n: number) => void; typing: (id: string) => void }) {
  const sb = getSupabase();
  if (!sb) return { leave() {}, typing() {} };
  const ch: RealtimeChannel = sb.channel("global-chat", { config: { presence: { key: me }, broadcast: { self: false } } })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "global_messages" }, p => on.insert(p.new as GlobalMessage))
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "global_messages" }, p => { const id = (p.old as { id?: string }).id; if (id) on.remove(id); })
    .on("presence", { event: "sync" }, () => on.online(Object.keys(ch.presenceState()).length))
    .on("broadcast", { event: "typing" }, p => { const id = (p["payload"] as { id?: string }).id; if (id) on.typing(id); });
  ch.subscribe(s => { if (s === "SUBSCRIBED") void ch.track({ at: Date.now() }); });
  let last = 0;
  return {
    leave() { void sb.removeChannel(ch); },
    typing() { const n = Date.now(); if (n - last > 2500) { last = n; void ch.send({ type: "broadcast", event: "typing", payload: { id: me } }); } },
  };
}
