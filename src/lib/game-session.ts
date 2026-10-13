export interface VerifiedHeartAward { id: string; viewerId: string; amount: number; lucky: boolean }
export type GameConnectionState = 'connected' | 'disconnected' | 'reconnecting';
export interface EffectsSessionAdapter {
 getSnapshot: () => { viewer: { id: string } | null };
 subscribeHeartAwards?: (listener: (award: VerifiedHeartAward) => void) => () => void;
 subscribeConnection?: (listener: (state: GameConnectionState) => void) => () => void;
 reconnect?: () => Promise<void>;
}
let adapter: EffectsSessionAdapter | null = null;
let cleanupAwards: (() => void) | undefined;
let cleanupConnection: (() => void) | undefined;
const awardListeners = new Set<(award: VerifiedHeartAward) => void>();
const connectionListeners = new Set<(state: GameConnectionState) => void>();
export function subscribeHeartAwards(listener: (award: VerifiedHeartAward) => void) { awardListeners.add(listener); return () => { awardListeners.delete(listener); }; }
export function subscribeGameConnection(listener: (state: GameConnectionState) => void) { connectionListeners.add(listener); return () => { connectionListeners.delete(listener); }; }
export async function reconnectGameSession() { await adapter?.reconnect?.(); }
/** Install only a verified authenticated game transport; never emit client-invented awards. */
export function attachGameSession(next: EffectsSessionAdapter | null) {
 cleanupAwards?.(); cleanupConnection?.(); adapter = next;
 cleanupAwards = next?.subscribeHeartAwards?.(award => {
  if (award.viewerId !== adapter?.getSnapshot().viewer?.id || !Number.isSafeInteger(award.amount) || award.amount <= 0 || !award.id) return;
  awardListeners.forEach(fn => fn(award));
 });
 cleanupConnection = next?.subscribeConnection?.(state => connectionListeners.forEach(fn => fn(state)));
}
