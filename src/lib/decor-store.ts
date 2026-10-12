import { useSyncExternalStore } from "react";

export interface DecorState {
  frame: string;
  stone: string;
  ownedItems: string[];
}

const STORAGE_KEY = "bottle-decor";
const DEFAULT_STATE: DecorState = { frame: "", stone: "", ownedItems: [] };

let state: DecorState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    state = DEFAULT_STATE;
  }
}

function emit() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable: keep the in-memory state
  }
  listeners.forEach((listener) => listener());
}

export function setDecorations(frame: string, stone: string) {
  load();
  state = { ...state, frame, stone };
  emit();
}

export function purchaseItem(id: string) {
  load();
  if (state.ownedItems.includes(id)) return;
  state = { ...state, ownedItems: [...state.ownedItems, id] };
  emit();
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDecorState() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => DEFAULT_STATE,
  );
}
