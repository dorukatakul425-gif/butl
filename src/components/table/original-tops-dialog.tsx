// @ts-nocheck
// Orijinal Ciliz TopsDialog'u (preloader bundle'ından birebir çıkarılan kod) canlı
// sunucu verisiyle açar. Səviyyə (glv) və Aktivlik sekmeleri korunur.
import { useEffect, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';
import { topRankingRows, type TopPlayerRow } from '@/lib/top-ranking';
import { openTopsDialog } from '@/lib/ciliz-original';
import { TOP_TAB_CONFIG, categories } from '@/lib/ciliz-original/runtime';

const SECTION_TITLES: Record<string, string> = {
  total_kisses: 'Öpücüklər',
  dj_score: 'DJ xalı',
  price: 'Dəyər',
  harem_price: 'Harem dəyəri',
  gestures: 'Jestlər',
  glv: 'Səviyyə liderləri',
  activity: 'Aktivlik liderləri'
};
const PERIOD_TITLES: Record<string, string> = { '': 'Bütün zamanlar', monthly: 'Aylıq', weekly: 'Həftəlik', daily: 'Günlük' };
const EXTRA = new Set(['glv', 'activity']);
const TAB_CONFIG: Record<string, { periods: string[] }> = TOP_TAB_CONFIG;

export function OriginalTopsDialog({ onClose }: { onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    const root = document.createElement('div');
    root.className = 'game-dialog-root';
    document.body.appendChild(root);
    rootRef.current = root;

    const cache: Record<string, unknown[]> = {};
    let viewerId: string | undefined;
    let dlg: any;

    const params = {
      titles: SECTION_TITLES,
      periodsOptions: Object.fromEntries(categories.map(c => [c, TAB_CONFIG[c]!.periods.map((p: string) => ({ key: p, title: PERIOD_TITLES[p] ?? p }))])),
      tops: cache,
      topBorderLabel: 'İlk <top>',
      onsection: (section: string) => void load(section),
      onuser: () => {},
      onhelp: () => {}
    };

    const load = async (section: string) => {
      if (!sb) return;
      const [category, period = ''] = section.split(':');
      const [{ data: u }, { data, error }] = await Promise.all([
        sb.auth.getUser(),
        sb.rpc(EXTRA.has(category) ? 'top_players_extra' as 'top_players' : 'top_players', { p_section: category, p_period: period })
      ]);
      if (error) return;
      viewerId = u.user?.id ?? viewerId;
      cache[section] = topRankingRows((data ?? []) as TopPlayerRow[]).map(r => ({
        id: r.id,
        name: r.name,
        photo_url: r.photo_url || DEFAULT_PHOTO,
        rank: r.rank,
        score: r.score,
        isViewer: r.id === viewerId
      }));
      dlg?.setParams({ ...params, tops: cache });
    };

    dlg = openTopsDialog(root, params);
    void load('total_kisses');
    const refresh = window.setInterval(() => void load('total_kisses'), 30000);

    const origClose = dlg.close.bind(dlg);
    dlg.close = (...args: unknown[]) => { onClose(); return origClose(...args); };

    return () => {
      window.clearInterval(refresh);
      dlg.closeImmediately?.();
      root.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
