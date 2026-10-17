import { useSyncExternalStore } from 'react';

/** Host installs this boundary after authenticating. Public artwork is not account state. */
export interface SourceReward { id: string; image: string; count: number; title?: string }
export interface SourceFeatureSnapshot {
  viewerId: string | null;
  leagueParticipation?: boolean;
  /** Last get_league result: server state, 'loading' before the first read, 'error' when the read failed. */
  leagueState?: string;
  /** Viewer's league level from get_league, also outside a running round (welcome/idle). */
  leagueLevel?: number;
  leagueHeader?: { type: 'unknown' | 'welcome' | 'running' | 'finished'; positionText?: string; leftTimeShortText?: string };
  kickout?: { price: number; vip: boolean; freeAt?: number; targets: Record<string, { kickAt?: number }> };
  profile?: { name: string; birthday: string; male: boolean; photo?: string; changePrice?: number };
  tables?: { friends: SourceTableEntry[]; history: SourceTableEntry[]; canViewById?: boolean };
  league?: { level: number; score: number; endsAt: number; players: Array<{ id: string; name: string; score: number; photo?: string }>;
    state?: 'running' | 'finished'; roundId?: number; usersMax?: number; moveUp?: number; moveDown?: number; maxLeague?: number;
    kisses?: number; kissesLim?: number; limit?: 'kiss' | 'gift' | 'all' | null; gold?: number; gifts?: string[];
    finalPos?: number | null; rewardGold?: number | null; rewardGifts?: string[] | null };
  roulette?: { freeSpins: number; price: number; prizes: SourceReward[]; winner?: { id: string; name: string; photo?: string; amount: number } };
  pass?: { points: number; premium: boolean; endsAt: number; levels: Array<{ points: number; free: SourceReward[]; premium: SourceReward[]; claimed: boolean }> };
}
export interface SourceTableEntry { id: string; name?: string; photo?: string; bottle: string; men: number; women: number; blockedUntil?: number; current?: boolean }
export type SourceFeatureAction = 'change-table' | 'invite' | 'save-profile' | 'feedback' | 'roulette-spin' | 'pass-claim' | 'pass-buy' | 'league-join' | 'league-settings' | 'league-seen' | 'league-refresh' | 'roulette-buy-chances' | 'user-kick' | 'user-save';
export interface SourceFeatureResult { confirmed: boolean; rewards?: SourceReward[]; message?: string; rewardIndex?: number; inviteUrl?: string; testOnly?: boolean }
export interface SourceFeatureAdapter {
  getSnapshot: () => SourceFeatureSnapshot;
  subscribe: (listener: () => void) => () => void;
  execute: (action: SourceFeatureAction, input?: Record<string, string | number>) => Promise<SourceFeatureResult>;
}
const empty: SourceFeatureSnapshot = { viewerId: null };
let adapter: SourceFeatureAdapter | null = null;
let snapshot = empty;
let cleanup: (() => void) | undefined;
const listeners = new Set<() => void>();
export function attachSourceFeatureSession(next: SourceFeatureAdapter | null) {
  cleanup?.(); adapter = next;
  const notify = () => { snapshot = adapter?.getSnapshot() ?? empty; listeners.forEach(fn => fn()); };
  cleanup = next?.subscribe(notify); notify();
}
export function useSourceFeatureSession() {
  return useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, () => snapshot, () => empty);
}
export async function executeSourceFeature(action: SourceFeatureAction, input?: Record<string, string | number>) {
  if (!adapter || !snapshot.viewerId) throw new Error('Oyuncu hesabı bağlı değil.');
  return adapter.execute(action, input);
}