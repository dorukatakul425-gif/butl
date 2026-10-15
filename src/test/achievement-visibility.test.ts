import { describe, expect, it } from 'vitest';
import { buildItems } from '@/components/table/source-achievements-dialog';
import type { CilizAssets } from '@/lib/ciliz-assets';

const assets: CilizAssets = {
  gifts: {}, giftStore: [], spines: {}, sfxUrl: '', frames: {}, stones: {}, decor: [],
  images: {}, translation: {}, bundles: [], dialogBundles: [],
  achievements: { future: { since_ms: Date.now() + 1000000, counters: [25, 1000], image: 'badge' } },
};
describe('verified achievement visibility', () => {
  it('does not expose an unearned scheduled achievement', () => {
    expect(buildItems(assets, true)).toHaveLength(0);
  });
  it('never hides a server-confirmed level behind a public release date', () => {
    const items = buildItems(assets, true, [{ achievement_id: 'future', level: 0, acknowledged_at: null }]);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ disabled: false, level: 0, maxLevel: 2 });
  });
});