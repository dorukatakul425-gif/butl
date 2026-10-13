import { useSyncExternalStore } from 'react';

export interface CompletedAchievement { achievement_id: string; level: number; acknowledged_at: string | null }
export interface AchievementSnapshot { verified: boolean; completed: CompletedAchievement[] }
export interface AchievementAdapter {
  getSnapshot: () => AchievementSnapshot;
  subscribe: (listener: () => void) => () => void;
  acknowledge: (id: string, level: number) => Promise<void>;
}
const empty: AchievementSnapshot = { verified: false, completed: [] };
let adapter: AchievementAdapter | null = null;
let snapshot = empty;
let unsubscribe: (() => void) | undefined;
const listeners = new Set<() => void>();
export function attachAchievementSession(next: AchievementAdapter | null) {
  unsubscribe?.(); adapter = next;
  const notify = () => { snapshot = next?.getSnapshot() ?? empty; listeners.forEach(fn => fn()); };
  unsubscribe = next?.subscribe(notify); notify();
}
export function useAchievementSession() {
  return useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, () => snapshot, () => empty);
}
export async function acknowledgeAchievement(id: string, level: number) {
  if (!adapter || !snapshot.verified) throw new Error('Oyuncu hesabı bağlı değil.');
  await adapter.acknowledge(id, level);
}