import { useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useCloudAccount } from '@/lib/cloud-account';
import { supabase } from '@/integrations/supabase/client';
import { syncAchievementProgress } from '@/lib/achievement-progress.functions';
import { attachAchievementSession, type AchievementSnapshot } from '@/lib/achievement-session';

export function CloudAchievementBridge() {
  const { user } = useCloudAccount();
  const sync = useServerFn(syncAchievementProgress);
  useEffect(() => {
    if (!user) { attachAchievementSession(null); return; }
    let alive = true, pending = false;
    let snapshot: AchievementSnapshot = { verified: false, completed: [] };
    const listeners = new Set<() => void>();
    const refresh = async () => {
      if (!alive || pending) return;
      pending = true;
      try {
        const completed = await sync();
        if (alive) { snapshot = { verified: true, completed }; listeners.forEach(fn => fn()); }
      } catch (e) { console.error('Başarılar okunamadı', e); }
      finally { pending = false; }
    };
    attachAchievementSession({
      getSnapshot: () => snapshot,
      subscribe: fn => { listeners.add(fn); return () => { listeners.delete(fn); }; },
      acknowledge: async (achievement, completed_level) => {
        const { error } = await supabase.rpc('acknowledge_achievement', { achievement, completed_level });
        if (error) throw new Error(error.message);
        snapshot = { ...snapshot, completed: snapshot.completed.map(row => row.achievement_id === achievement && row.level === completed_level ? { ...row, acknowledged_at: new Date().toISOString() } : row) };
        listeners.forEach(fn => fn());
      },
    });
    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 5000);
    return () => { alive = false; clearInterval(interval); attachAchievementSession(null); };
  }, [user?.id]);
  return null;
}