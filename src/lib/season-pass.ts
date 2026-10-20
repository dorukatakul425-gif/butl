import { getSupabase } from "@/lib/supabase";

/** ureyimsen "Mövsümi icazənamə" (Ciliz BottlePass) — data shape mirrors the source pass_info packet. */
export interface PassReward { claimed: boolean; gold?: number; tokens?: number; items?: Record<string, number> }
export interface PassLevel { level: number; score: number; start_ms: number; free: PassReward; paid: PassReward }
export interface PassChest { claimed: boolean; gold: number; gold_max: number; next_gold_score: number; overscore2gold: number }
export interface PassInfo {
  state: "running" | "finished";
  pass_premium: boolean;
  score: number;
  level: number;
  start_ms: number;
  finish_ms: number;
  now_ms: number;
  price: number;
  dat: number;
  chest: PassChest;
  prev_chest: number;
  levels: PassLevel[];
}
export type PassResult = { ok: true; reward?: PassReward; dat?: number; gold?: number } | { ok: false; reason: string; dat?: number };

/** Source updatePassScore: highest level whose score is reached AND whose daily start has passed. */
export function passLevelFor(levels: PassLevel[], score: number, nowMs: number): number {
  const reached = levels.filter((l) => l.score <= score && l.start_ms <= nowMs);
  return reached.at(-1)?.level ?? 0;
}

/** Source chest: every overscore2gold points beyond the last level adds 1 heart, capped at gold_max. */
export function passChestGold(levels: PassLevel[], score: number, chest: Pick<PassChest, "gold_max" | "overscore2gold">): number {
  const last = levels.at(-1)?.score ?? 0;
  return Math.min(chest.gold_max, Math.trunc(Math.max(score - last, 0) / chest.overscore2gold));
}

/** Header progress: points inside the current level span (source: score - level.score / next.score - level.score). */
export function passProgress(levels: PassLevel[], score: number, level: number): { value: number; max: number; next: number } {
  const cur = levels[level];
  const next = levels[level + 1];
  if (!cur) return { value: 0, max: 100, next: 1 };
  if (!next) return { value: score - cur.score, max: Math.max(1, score - cur.score), next: level + 1 };
  return { value: Math.max(0, score - cur.score), max: next.score - cur.score, next: level + 2 };
}

export function canClaim(info: PassInfo, l: PassLevel, premium: boolean, nowMs: number): boolean {
  const r = premium ? l.paid : l.free;
  if (r.claimed) return false;
  if (premium && !info.pass_premium) return false;
  return l.score <= info.score && l.start_ms <= nowMs;
}

export function hasClaimable(info: PassInfo | null, nowMs: number): boolean {
  if (!info) return false;
  return info.levels.some((l) => canClaim(info, l, false, nowMs) || canClaim(info, l, true, nowMs)) || info.prev_chest > 0;
}

/** Source secondsToShortText: "21 gün 15 saat" / "15 saat 3 dəq." / "29 dəq." */
export function passLeftText(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}\u00a0gün ${h}\u00a0saat`;
  if (h > 0) return `${h}\u00a0saat ${m}\u00a0dəq.`;
  return `${m}\u00a0dəq.`;
}
export function passShortLeft(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor(s / 3600), m = Math.floor(s / 60);
  return d > 0 ? `${d} gün` : h > 0 ? `${h} saat` : `${Math.max(1, m)} dəq.`;
}
export function passClock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

/** How a reward is drawn in the level list (source BottlePassDialog prize()). */
export type PrizeView =
  | { kind: "heart"; value: number }
  | { kind: "tokens"; value: number }
  | { kind: "booster"; id: string; count: number }
  | { kind: "decor"; id: string }
  | { kind: "chest-league" | "chest-choice"; items: Record<string, number> };
export function prizeView(r: PassReward): PrizeView | null {
  const items = Object.entries(r.items ?? {});
  if (items.length > 1) return { kind: items.some(([k]) => k.startsWith("league")) ? "chest-league" : "chest-choice", items: r.items! };
  const first = items[0];
  if (first) {
    const [id, count] = first;
    return id.endsWith("decor") ? { kind: "decor", id } : { kind: "booster", id, count };
  }
  if (r.gold) return { kind: "heart", value: r.gold };
  if (r.tokens) return { kind: "tokens", value: r.tokens };
  return null;
}

let cache: { info: PassInfo; at: number } | null = null;
const listeners = new Set<() => void>();
export function subscribePass(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
export function getCachedPass() { return cache?.info ?? null; }

export async function fetchPassInfo(): Promise<PassInfo | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc("pass_info" as never);
  if (error || !data) return null;
  cache = { info: data as unknown as PassInfo, at: Date.now() };
  listeners.forEach((fn) => fn());
  return cache.info;
}

async function call(name: string, args?: Record<string, unknown>): Promise<PassResult> {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "offline" };
  const { data, error } = await sb.rpc(name as never, args as never);
  if (error) return { ok: false, reason: error.message };
  void fetchPassInfo();
  return data as unknown as PassResult;
}
export const claimPassLevel = (level: number, premium: boolean) => call("pass_claim", { p_level: level, p_premium: premium });
export const buyPassPremium = () => call("pass_buy_premium");
export const claimPassChest = () => call("pass_claim_chest");
