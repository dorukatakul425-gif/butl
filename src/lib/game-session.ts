export interface VerifiedHeartAward { id: string; viewerId: string; amount: number; lucky: boolean; prepaid?: boolean; from?: { x: number; y: number } }
import type { VerifiedHaremPurchase } from './source-harem';
export type GameConnectionState = 'connected' | 'disconnected' | 'reconnecting';
export interface EffectsSessionAdapter {
 getSnapshot: () => { viewer: { id: string } | null };
 subscribeHeartAwards?: (listener: (award: VerifiedHeartAward) => void) => () => void;
 subscribeHaremPurchases?: (listener: (purchase: VerifiedHaremPurchase) => void) => () => void;
 acknowledgeHaremPurchase?: (id: string) => Promise<void>;
 subscribeConnection?: (listener: (state: GameConnectionState) => void) => () => void;
 reconnect?: () => Promise<void>;
}
let adapter: EffectsSessionAdapter | null = null;
let cleanupAwards: (() => void) | undefined;
let cleanupConnection: (() => void) | undefined;
let cleanupHarem: (() => void) | undefined;
const haremListeners = new Set<(p: VerifiedHaremPurchase) => void>();
export function subscribeHaremPurchases(fn: (p: VerifiedHaremPurchase) => void) { haremListeners.add(fn); return () => { haremListeners.delete(fn); }; }
export async function acknowledgeHaremPurchase(id: string) { await adapter?.acknowledgeHaremPurchase?.(id); }
const awardListeners = new Set<(award: VerifiedHeartAward) => void>();
const connectionListeners = new Set<(state: GameConnectionState) => void>();
export function subscribeHeartAwards(listener: (award: VerifiedHeartAward) => void) { awardListeners.add(listener); return () => { awardListeners.delete(listener); }; }
export function subscribeGameConnection(listener: (state: GameConnectionState) => void) { connectionListeners.add(listener); return () => { connectionListeners.delete(listener); }; }
export async function reconnectGameSession() { await adapter?.reconnect?.(); }
/** Install only a verified authenticated game transport; never emit client-invented awards. */
export function attachGameSession(next: EffectsSessionAdapter | null) {
 cleanupAwards?.(); cleanupConnection?.(); cleanupHarem?.(); adapter = next;
 cleanupHarem = next?.subscribeHaremPurchases?.(p => {
  if (!p.id || p.viewerId !== next.getSnapshot().viewer?.id || !Number.isSafeInteger(p.price) || p.price < 0) return;
  haremListeners.forEach(fn => fn(p));
 });
 cleanupAwards = next?.subscribeHeartAwards?.(award => {
  if (award.viewerId !== adapter?.getSnapshot().viewer?.id || !Number.isSafeInteger(award.amount) || award.amount <= 0 || !award.id) return;
  awardListeners.forEach(fn => fn(award));
 });
 cleanupConnection = next?.subscribeConnection?.(state => connectionListeners.forEach(fn => fn(state)));
}

/** Hearts already credited by the server but still flying toward the header (addViewerGold timeline). */
let pendingGold = 0;
const pendingListeners = new Set<() => void>();
export const getPendingGold = () => pendingGold;
export function subscribePendingGold(fn: () => void) { pendingListeners.add(fn); return () => { pendingListeners.delete(fn); }; }
export function setPendingGold(delta: number) { pendingGold = Math.max(0, pendingGold + delta); pendingListeners.forEach(fn => fn()); }
/** Emit only awards confirmed by an authenticated server RPC response. */
export function emitServerHeartAward(award: VerifiedHeartAward) { awardListeners.forEach(fn => fn(award)); }
/** spin_bottle returns the lucky bonus hearts (0 = no bonus); guard against junk payloads. */
export function luckyBonusAmount(data: unknown): number {
  const n = Number(data ?? 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
