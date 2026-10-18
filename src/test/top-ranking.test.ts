import { describe, expect, it } from 'vitest';
import { topRankingRows } from '@/lib/top-ranking';
describe('server ranking', () => {
  it('preserves rank 500 for a viewer outside the top 50', () => {
    const rows = topRankingRows([{ id: 'me', name: 'Me', photo_url: null, score: '5', rank: '500' }, { id: 'first', name: 'First', photo_url: null, score: 100, rank: 1 }]);
    expect(rows.map(row => row.rank)).toEqual([1, 500]);
    expect(rows[1]?.score).toBe(5);
  });
  it('keeps host ranks for tied scores instead of sorting by player ID', () => {
    expect(topRankingRows([{ id: 'a', name: 'A', photo_url: null, score: 20, rank: 2 }, { id: 'z', name: 'Z', photo_url: null, score: 20, rank: 1 }]).map(row => row.id)).toEqual(['z', 'a']);
  });
});