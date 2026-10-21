import { describe, expect, it } from 'vitest';
import { getLayout } from '@/lib/original-table-layout';

describe('original preloader background geometry', () => {
  it('draws the phone wood larger than the seats, using the original 48px overscan', () => {
    const layout = getLayout(393, 720, false, false, undefined);
    expect(layout.background).toEqual({ x: 196.5, y: 244.5, width: 489, height: 489 });
    expect(layout.game).toEqual({ x: 0, y: 0, width: 393, height: 441 });
    expect(layout.table.width).toBe(393);
  });
  it('preserves original landscape background overscan', () => {
    const layout = getLayout(844, 390, false, false, undefined);
    expect(layout.background).toEqual({ x: 243, y: 195, width: 486, height: 486 });
    expect(layout.table).toEqual({ x: 48, y: 0, width: 390, height: 390 });
  });
});