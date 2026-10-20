/** ureyimsen Bd/Ud entrance rules: a player with gift level >= 1 gets a profile effect when joining the table. */
export const ENTRY_MAX = 100;
export const ENTRY_BASE_MAX = 50;
/** Level from which the top banner ("masaya daxil oldu") is shown too. */
export const ENTRY_MIN = 10;
/** The same player's effect does not replay within this window. */
export const ENTRY_REPEAT_MS = 8000;

export type Emblem = "star" | "gem" | "crown" | "wings" | "flame";
export const TIERS: Array<[string, string, string, string, Emblem]> = [
  ["Bürünc", "#f0b27a", "#8a4a1f", "#ffe0c2", "star"], ["Gümüş", "#eef3fa", "#7f8ea3", "#ffffff", "star"],
  ["Qızıl", "#ffe27a", "#c98a09", "#fff6c4", "gem"], ["Zümrüd", "#6ff5bb", "#0b7a4a", "#d2ffec", "gem"],
  ["Sapfir", "#7cc0ff", "#1c4fd6", "#dcefff", "crown"], ["Ametist", "#dba8ff", "#6d1fc4", "#f3e2ff", "crown"],
  ["Yaqut", "#ff8595", "#b0102a", "#ffdbe0", "wings"], ["Qızılgül", "#ffaad8", "#c21f7a", "#ffe4f3", "wings"],
  ["Brilyant", "#c4f7ff", "#2a8fd6", "#ffffff", "flame"], ["Əfsanə", "#ffd86b", "#ff2f6d", "#fff3c4", "flame"],
  ["Kosmos", "#9fb4ff", "#2a1b6e", "#e3e8ff", "star"], ["Aurora", "#8dffd8", "#3a2fb8", "#e6fff7", "gem"],
  ["Lava", "#ffb36b", "#c2210c", "#ffe5cc", "flame"], ["Okean", "#7ff0ff", "#0a5a8c", "#dffbff", "gem"],
  ["Şimşək", "#fff36b", "#6b4dff", "#fffbe0", "crown"], ["Kristal", "#e8f6ff", "#5f86c9", "#ffffff", "gem"],
  ["Feniks", "#ffcf5c", "#e0341d", "#fff0c8", "wings"], ["Ulduz tozu", "#ffe1fb", "#8a2be2", "#fff4fe", "star"],
  ["İmperator", "#ffe79a", "#7a1fa2", "#fff7d6", "crown"], ["Mütləq", "#fff3c4", "#ff2f6d", "#ffffff", "crown"],
];

export type Particle = "spark" | "star4" | "star5" | "coin" | "leaf" | "drop" | "flame" | "petal" | "shard" | "feather";
export type Motion = "rise" | "orbit" | "burst" | "spiral" | "ripple" | "runes" | "fall" | "wings";
export const ENTRY_STYLES: Array<[Particle, Motion]> = [
  ["spark", "rise"], ["star4", "orbit"], ["coin", "burst"], ["leaf", "spiral"], ["drop", "ripple"],
  ["star5", "runes"], ["flame", "rise"], ["petal", "fall"], ["shard", "burst"], ["feather", "wings"],
  ["star4", "spiral"], ["leaf", "orbit"], ["flame", "burst"], ["drop", "spiral"], ["shard", "runes"],
  ["shard", "orbit"], ["feather", "fall"], ["star5", "orbit"], ["coin", "wings"], ["star5", "wings"],
];
export const EXTRA_STYLES: Array<[Particle, Motion]> = [["star4", "orbit"], ["star5", "runes"], ["petal", "fall"], ["shard", "burst"], ["coin", "fall"]];

export interface Tier { i: number; name: string; c1: string; c2: string; rim: string; emblem: Emblem }
export function tier(level: number): Tier {
  const z = Math.max(1, level | 0);
  const i = z <= ENTRY_BASE_MAX ? Math.min(9, Math.floor(z / 5)) : Math.min(TIERS.length - 1, 10 + Math.floor((z - ENTRY_BASE_MAX - 1) / 5));
  const t = TIERS[i]!;
  return { i, name: t[0], c1: t[1], c2: t[2], rim: t[3], emblem: t[4] };
}

/** Ids present in `next` but not in `prev` (players who just sat down). */
export function joinedIds(prev: ReadonlyArray<string | undefined>, next: ReadonlyArray<string | undefined>): string[] {
  const before = new Set(prev.filter(Boolean));
  return [...new Set(next.filter((id): id is string => Boolean(id) && !before.has(id)))];
}

/** Ud.entrance + 8s guard: returns true when the effect should play now (and records it). */
export function shouldPlayEntry(seen: Map<string, number>, id: string, level: number, now: number): boolean {
  if (level < 1) return false;
  const last = seen.get(id);
  if (last !== undefined && now - last < ENTRY_REPEAT_MS) return false;
  seen.set(id, now);
  return true;
}
