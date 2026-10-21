import { describe, expect, it } from 'vitest';
import { appearanceInput, needsRefresh, validNameStyle } from '@/lib/player-appearance';
import { levelFromPoints } from '@/lib/top-level-activity';

describe('player identity and refresh rules', () => {
  it('uses actual gift points, not a chosen frame, for the displayed level', () => {
    expect(levelFromPoints(1399)).toBe(0);
    expect(levelFromPoints(1400)).toBe(1);
    expect(levelFromPoints(140000)).toBe(100);
  });
  it('rejects arbitrary CSS or an invalid Creator grant', () => {
    expect(appearanceInput.safeParse({ userId: '00000000-0000-0000-0000-000000000001', nameStyle: 'url(evil)', creator: true }).success).toBe(false);
    expect(appearanceInput.safeParse({ userId: '00000000-0000-0000-0000-000000000001', nameStyle: 'rainbow', creator: 'admin' }).success).toBe(false);
    expect(validNameStyle('unknown')).toBe('default');
  });
  it('shows a new administrator refresh request, but never replays it after reload', () => {
    const event = { id: 'revision-a', created_at: '2026-10-21T08:00:00Z' };
    expect(needsRefresh(event, Date.parse('2026-10-21T07:59:00Z'), new Set())).toBe(true);
    expect(needsRefresh(event, Date.parse('2026-10-21T08:01:00Z'), new Set())).toBe(false);
  });
  it('deduplicates the same refresh revision received through polling and realtime', () => {
    expect(needsRefresh({ id: 'revision-a', created_at: '2026-10-21T08:00:00Z' }, 0, new Set(['revision-a']))).toBe(false);
    expect(needsRefresh({ id: 'revision-b', created_at: '2026-10-21T08:00:00Z' }, 0, new Set(['revision-a']))).toBe(true);
  });
});