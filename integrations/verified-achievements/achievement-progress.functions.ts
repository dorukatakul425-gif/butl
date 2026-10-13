import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { CilizAchievement } from '@/lib/ciliz-assets';

// Each counter is written by a trusted game transaction, never by the browser.
const supported = new Set(['csar', 'pantomime', 'rulesofdecorum', 'barista', 'romantic', 'jack', 'magic', 'vegan', 'coffeeman', 'cuba', 'cupid', 'hemingway', 'kinoman', 'leaf', 'mexico', 'redoctober', 'seniorpomidor', 'slug', 'sommelier', 'sportsman', 'sweet', 'snow']);
export const syncAchievementProgress = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { purchaseManifest } = await import('@/lib/purchase-manifest.server');
  const manifest = await purchaseManifest();
  const { data: counters, error: counterError } = await context.supabase.from('achievement_counters').select('counters').eq('user_id', context.userId).maybeSingle();
  if (counterError) throw new Error(counterError.message);
  if (counters) {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const values = counters.counters as Record<string, number>;
    for (const [id, entry] of Object.entries(manifest['achievement'] ?? {})) {
      const asset = entry as CilizAchievement;
      if (!supported.has(id) || !values[id] || asset.since_ms && asset.since_ms > Date.now()) continue;
      const thresholds = asset.counters ?? (id === 'vegan' ? [5] : []);
      if (!thresholds.length || !thresholds.every(n => typeof n === 'number' && Number.isSafeInteger(n) && n > 0)) continue;
      const { error } = await supabaseAdmin.rpc('record_verified_achievement', { player: context.userId, achievement: id, thresholds });
      if (error) throw new Error(error.message);
    }
  }
  const { data, error } = await context.supabase.from('player_achievements').select('achievement_id,level,acknowledged_at').eq('user_id', context.userId).order('completed_at');
  if (error) throw new Error(error.message);
  return data ?? [];
});