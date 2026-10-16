// Live "who is playing" counter for the home join popup.
// Reads seated players (room_players + profiles.male) and listens to Cloud realtime
// (WebSocket) table changes, so the count updates instantly when someone joins or leaves.
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export type OnlinePlayer = { userId: string; name: string; photo: string | null; male: boolean };
export type OnlineSummary = { total: number; boys: number; girls: number; players: OnlinePlayer[] };

/** Players whose heartbeat is older than this are treated as gone (server removes them at 45s). */
export const STALE_MS = 45_000;

type Row = {
  user_id: string;
  last_seen: string;
  profiles: { name: string; photo_url: string | null; male: boolean } | Array<{ name: string; photo_url: string | null; male: boolean }> | null;
};

export function summarize(rows: Row[], now = Date.now()): OnlineSummary {
  const seen = new Set<string>();
  const players: OnlinePlayer[] = [];
  for (const r of rows) {
    if (seen.has(r.user_id)) continue;
    const t = new Date(r.last_seen).getTime();
    if (!Number.isFinite(t) || now - t > STALE_MS) continue;
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    if (!p) continue;
    seen.add(r.user_id);
    players.push({ userId: r.user_id, name: p.name, photo: p.photo_url, male: Boolean(p.male) });
  }
  const boys = players.filter(p => p.male).length;
  return { total: players.length, boys, girls: players.length - boys, players };
}

export function useOnlinePlayers(enabled: boolean) {
  const [summary, setSummary] = useState<OnlineSummary | null>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const sb = getSupabase();
    if (!sb) return;
    let alive = true;
    let timer: number | undefined;
    const load = async () => {
      const { data, error } = await sb.from("room_players").select("user_id, last_seen, profiles(name, photo_url, male)").limit(500);
      if (!alive || error) return;
      setSummary(summarize((data ?? []) as unknown as Row[]));
    };
    const soon = () => { window.clearTimeout(timer); timer = window.setTimeout(() => void load(), 400); };
    void load();
    const channel = sb.channel(`online-players-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "room_players" }, soon)
      .subscribe(status => { if (alive) setLive(status === "SUBSCRIBED"); });
    // Safety refresh drops players whose tab died without a leave event.
    const poll = window.setInterval(() => void load(), 15_000);
    return () => { alive = false; window.clearTimeout(timer); window.clearInterval(poll); void sb.removeChannel(channel); };
  }, [enabled]);
  return { summary, live };
}
