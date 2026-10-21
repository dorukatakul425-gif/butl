import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from './supabase';
import { useAuth } from './auth';
import { levelFromPoints } from './top-level-activity';
import { DEFAULT_APPEARANCE, validNameStyle, type PlayerAppearance } from './player-appearance';

/** Cosmetic grants are separate from roles; levels reuse authoritative gift points. */
export function usePlayerAppearances(userIds: readonly string[]) {
  const { session } = useAuth();
  const qc = useQueryClient();
  const key = [...new Set(userIds.filter(Boolean))].sort().join(',');
  const ids = useMemo(() => key ? key.split(',') : [], [key]);
  const query = useQuery({
    queryKey: ['player-appearance', session?.user.id, key],
    enabled: Boolean(session && ids.length), staleTime: 15000, refetchInterval: 30000,
    queryFn: async () => {
      const sb = getSupabase();
      if (!sb) return {} as Record<string, PlayerAppearance>;
      const result: Record<string, PlayerAppearance> = Object.fromEntries(ids.map(id => [id, { ...DEFAULT_APPEARANCE }]));
      const styles = await sb.from('player_name_styles').select('user_id,name_style,creator').in('user_id', ids);
      if (styles.error) throw new Error(styles.error.message);
      for (const row of styles.data ?? []) result[row.user_id] = { ...DEFAULT_APPEARANCE, nameStyle: validNameStyle(row.name_style), creator: row.creator === true };
      // The existing trusted level RPC accepts at most twelve identities per read.
      for (let i = 0; i < ids.length; i += 12) {
        const levels = await sb.rpc('gift_levels', { p_ids: ids.slice(i, i + 12) });
        if (levels.error) throw new Error(levels.error.message);
        for (const row of levels.data ?? []) result[row.id] = { ...(result[row.id] ?? DEFAULT_APPEARANCE), level: levelFromPoints(Number(row.points)) };
      }
      return result;
    },
  });
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !session || !ids.length) return;
    const channel = sb.channel(`appearance:${session.user.id}:${key}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_name_styles' }, () => { void qc.invalidateQueries({ queryKey: ['player-appearance'] }); })
      .subscribe(status => { if (status === 'SUBSCRIBED') void qc.invalidateQueries({ queryKey: ['player-appearance'] }); });
    return () => { void sb.removeChannel(channel); };
  }, [session?.user.id, key, qc, ids]);
  return query.data ?? {};
}