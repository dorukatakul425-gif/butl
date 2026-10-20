import { useSyncExternalStore } from "react";
import { getSupabase } from "@/lib/supabase";

// ureyimsen "Masa fonu" (preloader_new.js: Md list, Va header skins, headerBtnSvg).
export const TABLE_BGS: ReadonlyArray<readonly [string, string]> = [
  ["", "Standart"], ["royal_velvet", "Kral məxməri"], ["lux_hall", "Lüks zal"], ["night_city", "Gecə şəhəri"],
  ["space", "Kosmos"], ["seaside", "Dəniz kənarı"], ["vip_club", "VIP klub"], ["golden_lounge", "Qızıl lounge"],
  ["crystal_cave", "Kristal mağara"], ["royal_garden", "Saray bağı"], ["aurora_lake", "Şimal parıltısı"],
  ["underwater", "Sualtı dünya"], ["desert_night", "Səhra gecəsi"], ["sakura_garden", "Sakura bağı"],
];

export const TABLE_BG_SKINS: Record<string, readonly [string, string, string]> = {
  royal_velvet: ["#b3203f", "#4a0514", "#e9c46a"], lux_hall: ["#8a5a2a", "#2a1408", "#f0cf80"],
  night_city: ["#1f5aa8", "#06122a", "#8fd8ff"], space: ["#6a3ad0", "#10062a", "#e0d0ff"],
  seaside: ["#e0784a", "#3a1a30", "#ffd8a0"], vip_club: ["#b0208a", "#1a0418", "#ff8ad8"],
  golden_lounge: ["#3a2f1f", "#0d0a06", "#e8c66a"], crystal_cave: ["#2a8ac8", "#062040", "#c0f0ff"],
  royal_garden: ["#2a7a3a", "#0a2010", "#f0d890"], aurora_lake: ["#1f8f7a", "#061a2a", "#9dffd9"],
  underwater: ["#1ba8b8", "#063a4a", "#d8fbff"], desert_night: ["#a8502a", "#2a1008", "#f0c070"],
  sakura_garden: ["#d0608a", "#4a1030", "#ffe0ec"],
};

export const isTableBg = (id: string) => TABLE_BGS.some(([k]) => k === id);
export const tableBgName = (id: string | null | undefined) => (TABLE_BGS.find(([k]) => k === (id || "")) ?? ["", id ?? ""])[1];
export const tableBgUrl = (id: string) => `/room-assets/table-bg/${id}.webp?v=4`;
export const tableBgThumbUrl = (id: string) => `/room-assets/table-bg/${id}_thumb.webp?v=4`;

/** Original headerBtnSvg: themed round header button for the chosen background. */
export function headerBtnSvg(id: string, down: boolean): string | null {
  const skin = TABLE_BG_SKINS[id];
  if (!skin) return null;
  const [a, b, c] = skin;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62"><defs><radialGradient id="b" cx="0.5" cy="0.3" r="0.8"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.35" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0.55"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><circle cx="31" cy="32.6" r="29" fill="#000" opacity="0.35"/><circle cx="31" cy="${down ? 31.8 : 31}" r="28.3" fill="url(#b)" stroke="url(#r)" stroke-width="2.4"/>${down ? '<circle cx="31" cy="31.8" r="27" fill="#000" opacity="0.22"/>' : '<ellipse cx="31" cy="17.5" rx="18.5" ry="9.5" fill="url(#g)"/>'}</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Current table background: room state, so every seated player sees the same one.
let current = "";
const listeners = new Set<() => void>();
export function setCurrentTableBg(id: string | null | undefined) {
  const next = id && isTableBg(id) ? id : "";
  if (next === current) return;
  current = next;
  if (next && typeof Image !== "undefined") { const img = new Image(); img.src = tableBgUrl(next); }
  listeners.forEach((l) => l());
}
export function useTableBg() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => current, () => "");
}

export interface TableBgInfo { current: string; price: number; crystals: number; free: number }
export type TableBgResult =
  | { ok: true; bg_type: string; same?: boolean; free_used?: boolean; crystals?: number }
  | { ok: false; reason: string; crystals?: number };

/** table_bg_info: price, the viewer's crystals (DAT) and the room's current background. */
export async function fetchTableBgInfo(): Promise<TableBgInfo | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc("table_bg_info" as never);
  if (error || !data) return null;
  const d = data as unknown as TableBgInfo;
  return { current: d.current || "", price: Number(d.price), crystals: Number(d.crystals), free: Number(d.free) || 0 };
}

/** game_table_bg: the server validates, charges crystals and updates the room atomically. */
export async function buyTableBg(bg: string): Promise<TableBgResult> {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "offline" };
  const { data, error } = await sb.rpc("set_table_bg" as never, { p_bg: bg } as never);
  if (error || !data) return { ok: false, reason: error?.message ?? "failed" };
  return data as unknown as TableBgResult;
}
