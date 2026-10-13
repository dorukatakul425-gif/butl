import { useSyncExternalStore } from "react";
import type { CilizAssets } from "./ciliz-assets";

// TableView and GameAnimations source coordinates and timings.
export const TABLE_SEATS: Array<[number, number]> = [
  [41.5,-140.5],[123.5,-120.5],[138.5,-38.5],[138.5,42.5],[123.5,124.5],[41.5,143.5],
  [-40.5,143.5],[-122.5,124.5],[-137.5,42.5],[-137.5,-38.5],[-122.5,-120.5],[-40.5,-140.5],
];
export const SPIN_SECONDS = 5;
export const CENTER_SECONDS = 1;
export const RETURN_SECONDS = 0.5;
export const CENTER_PLAYER_SCALE = 69 / 64;
export const DECISION_SECONDS = 9;
/** When the viewer does not tap, the bottle spins itself after this many seconds. */
export const AUTO_SPIN_SECONDS = 9;
export function spinDelayMs(spinner: number, viewer: number, random = Math.random()) {
  return spinner === viewer ? AUTO_SPIN_SECONDS * 1000 : 1400 + random * 1400;
}
export function decisionArrowsVisible(phase: string) { return phase === "choose" || phase === "result"; }
export function decisionTimerVisible(phase: string, participating: boolean, decided: boolean) {
  return phase === "choose" && (!participating || !decided);
}
export type Decision = "kiss" | "refuse";
export function turnOfferSound(phase: string, spinner: number, viewer: number, ready: boolean) {
  return phase === "offer" && spinner === viewer && ready ? "ding" : null;
}
export function spinAngle(seat: number, random = Math.random()) {
  const pt = TABLE_SEATS[seat];
  if (!pt) throw new Error("Unknown seat");
  return Math.atan2(pt[0], -pt[1]) * 180 / Math.PI + 360 * Math.round(5 + 10 * random);
}
export function leftRight(a: number, b: number): [number, number] {
  const p = TABLE_SEATS[a], q = TABLE_SEATS[b];
  if (!p || !q) throw new Error("Unknown seat");
  return p[0] < q[0] || (p[0] === q[0] && p[1] < q[1]) ? [a,b] : [b,a];
}
// The live service selects opponents in production; this table intentionally uses local bots.
export function eligibleTargets(spinner: number) {
  return TABLE_SEATS.map((_, i) => i).filter(i => i !== spinner && i % 2 !== spinner % 2);
}
export function pickTarget(spinner: number, random = Math.random()) {
  const candidates = eligibleTargets(spinner);
  return candidates[Math.min(candidates.length - 1, Math.floor(Math.max(0, random) * candidates.length))] ?? 0;
}
export function bottleItems(assets: CilizAssets, social: string) {
  return (assets.bottleStore ?? []).flatMap(entry => {
    if (entry.social && !entry.social.includes(social)) return [];
    const bottle = assets.bottles?.[entry.id];
    return bottle ? [{ bottle, locked: Boolean(entry.vip_s), name: assets.translation[`bottle:${bottle.type}`] ?? bottle.type }] : [];
  });
}
let selectedBottle = "standart";
const listeners = new Set<() => void>();
export function selectBottle(type: string) { selectedBottle = type; listeners.forEach(l => l()); }
export function useBottle() {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => { listeners.delete(cb); }; }, () => selectedBottle, () => "standart");
}