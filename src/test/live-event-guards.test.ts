import { describe, expect, it } from 'vitest';
import { eventDeduper, haremTransition, revisionGuard } from '@/lib/live-event-guards';
describe('live state guards', () => {
  it('rejects a snapshot started before a live update', () => { const guard = revisionGuard(); const read = guard.next(); guard.next(); expect(guard.current(read)).toBe(false); });
  it('rejects older overlapping reads', () => { const guard = revisionGuard(); const old = guard.next(); const newest = guard.next(); expect(guard.current(old)).toBe(false); expect(guard.current(newest)).toBe(true); });
  it('delivers one kickout per ID, with an independent room scope', () => { const accept = eventDeduper(); expect(accept(12)).toBe(true); expect(accept(12)).toBe(false); expect(accept(13)).toBe(true); expect(eventDeduper()(12)).toBe(true); });
  it('emits a release when the server clears admiration ownership', () => { expect(haremTransition('target', 'owner', null, 20)).toEqual({ targetId: 'target', newOwnerId: 'target', oldOwnerId: 'owner', price: 20 }); });
  it('distinguishes first purchase, transfer and unchanged ownership', () => { expect(haremTransition('t', null, 'a', 5)?.newOwnerId).toBe('a'); expect(haremTransition('t', 'a', 'b', 6)?.oldOwnerId).toBe('a'); expect(haremTransition('t', 'a', 'a', 6)).toBeNull(); });
});