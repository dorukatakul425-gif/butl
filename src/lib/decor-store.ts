import { useEffect, useState, useSyncExternalStore } from "react";
import { levelFromPoints } from "@/lib/top-level-activity";
import { getSupabase } from "@/lib/supabase";

export interface DecorState {
  frame: string;
  stone: string;
  ownedItems: string[];
}

/** New accounts own nothing; ownership and the applied decor live on the server profile. */
const DEFAULT_STATE: DecorState = { frame: "", stone: "", ownedItems: [] };

let state: DecorState = DEFAULT_STATE;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

/** Mirror the confirmed server profile (realtime profile updates included). */
export function syncDecorFromProfile(p: { frame: string; stone: string; owned_items?: string[] | undefined }) {
  const owned = p.owned_items ?? [];
  if (state.frame === p.frame && state.stone === p.stone && state.ownedItems.join() === owned.join()) return;
  state = { frame: p.frame, stone: p.stone, ownedItems: owned };
  emit();
}

/** set_decor RPC: the server only accepts owned items (or empty). */
export async function setDecorations(frame: string, stone: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.rpc("set_decor", { p_frame: frame, p_stone: stone });
  if (error) return false;
  state = { ...state, frame, stone };
  emit();
  return true;
}

/** buy_decor RPC: price from the server list, hearts deducted in one transaction. */
export async function purchaseItem(id: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "offline" };
  const { error } = await sb.rpc("buy_decor", { p_item: id });
  if (error) return { ok: false, reason: error.message };
  if (!state.ownedItems.includes(id)) state = { ...state, ownedItems: [...state.ownedItems, id] };
  emit();
  return { ok: true };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDecorState() {
  return useSyncExternalStore(subscribe, () => state, () => DEFAULT_STATE);
}

/** Viewer gift level from the server (hearts spent on gifts); refreshed whenever the dialog opens. */
export function useGiftLevel(open: boolean) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!open) return;
    const sb = getSupabase();
    if (!sb) return;
    let alive = true;
    sb.rpc("my_gift_points").then(({ data, error }) => {
      if (alive && !error) setLevel(levelFromPoints(Number(data) || 0));
    });
    return () => {
      alive = false;
    };
  }, [open]);
  return level;
}
