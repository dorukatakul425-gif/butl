import { useSyncExternalStore } from "react";

export type LoadingStage = "server" | "assets" | "renderer" | "icons" | "bottle";
type LoadingState = { progress: number; ready: boolean; error: boolean };
const initial: LoadingState = { progress: 10, ready: false, error: false };
let state = initial;
const completed = new Set<LoadingStage>();
const listeners = new Set<() => void>();
// Original Progress weights, attached to actual tasks in this port.
const weights: Record<LoadingStage, number> = { server: 10, assets: 15, renderer: 25, icons: 25, bottle: 15 };
export function completeLoadingStage(stage: LoadingStage) {
  completed.add(stage);
  state = { progress: 10 + [...completed].reduce((sum, key) => sum + weights[key], 0), ready: completed.size === 5, error: false };
  listeners.forEach(listener => listener());
}
export function failGameLoading() {
  state = { ...state, error: true };
  listeners.forEach(listener => listener());
}
export function useGameLoading() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => state, () => initial);
}