import { getSupabase } from '@/lib/supabase';
import { attachAchievementSession, type AchievementSnapshot } from '@/lib/achievement-session';

/** Authenticated bridge: levels come only from my_achievements() (trusted counters + original thresholds). */
export function startCloudAchievements() {
  const sb = getSupabase();
  if (!sb) return () => {};
  let snap: AchievementSnapshot = { verified: false, completed: [] };
  const listeners = new Set<() => void>();
  let alive = true;
  let request = 0;
  let debounce: ReturnType<typeof setTimeout> | undefined;
  const load = async () => {
    const version = ++request;
    const { data, error } = await sb.rpc('my_achievements');
    if (!alive || error || version !== request) return;
    snap = { verified: true, completed: (data ?? []).map((r: { achievement_id: string; level: number; acknowledged_at: string | null }) => ({ achievement_id: r.achievement_id, level: r.level, acknowledged_at: r.acknowledged_at })) };
    listeners.forEach(fn => fn());
  };
  attachAchievementSession({
    getSnapshot: () => snap,
    subscribe: fn => { listeners.add(fn); return () => { listeners.delete(fn); }; },
    acknowledge: async (id, level) => { const { error } = await sb.rpc('ack_achievement', { p_id: id, p_level: level }); if (error) throw error; await load(); },
  });
  void load();
  const refresh = () => { clearTimeout(debounce); debounce = setTimeout(() => void load(), 120); };
  const channel = sb.channel(`achievements-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, refresh)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gift_events' }, refresh)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gesture_events' }, refresh)
    .subscribe(status => { if (status === 'SUBSCRIBED') refresh(); });
  const timer = window.setInterval(() => void load(), 10000);
  return () => { alive = false; request++; clearTimeout(debounce); window.clearInterval(timer); void sb.removeChannel(channel); attachAchievementSession(null); };
}
