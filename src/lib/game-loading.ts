import { useSyncExternalStore } from "react";

export type LoadingStage = "server" | "assets" | "renderer" | "icons" | "bottle" | "artwork";
type LoadingState = { progress: number; ready: boolean; error: boolean };
const initial: LoadingState = { progress: 10, ready: false, error: false };
let state = initial;
const completed = new Set<LoadingStage>();
const listeners = new Set<() => void>();
// Original Progress weights, attached to actual tasks in this port.
const weights: Record<LoadingStage, number> = { server: 10, assets: 15, renderer: 25, icons: 20, bottle: 15, artwork: 5 };
export function completeLoadingStage(stage: LoadingStage) {
  completed.add(stage);
  state = { progress: 10 + [...completed].reduce((sum, key) => sum + weights[key], 0), ready: completed.size === 6, error: false };
  listeners.forEach(listener => listener());
}
export function failGameLoading() {
  state = { ...state, error: true };
  listeners.forEach(listener => listener());
}
/** Oyuna her girişte yükleme ekranı baştan başlar (Ciliz splash her açılışta görünür). */
export function resetGameLoading() {
  completed.clear();
  state = initial;
  listeners.forEach(listener => listener());
}
/** Testler için anlık ilerleme/ready durumu. */
export function getGameLoadingState() {
  return state;
}
export function useGameLoading() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => state, () => initial);
}
