import { describe, expect, it } from 'vitest';
import { tableLayout } from '@/lib/table-layout';

describe('source table boundary', () => {
  it.each([[393, 388, 48], [393, 660, 48], [1280, 1000, 84]])('anchors the lowest name above chat at %s×%s', (width, height, header) => {
    const layout = tableLayout(width, height, header);
    const bottomName = layout.y + (143.5 + 42) * layout.scale;
    expect(height - bottomName).toBeCloseTo(2 * layout.scale);
    expect(layout.y - 187.5 * layout.scale).toBeGreaterThanOrEqual(header - 0.001);
  });
});