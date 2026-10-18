/** Invalidate reads begun before a newer read or live event. */
export function revisionGuard() {
  let revision = 0;
  return { next: () => ++revision, current: (value: number) => value === revision };
}
/** Bounded IDs are scoped to one room subscription, not all historical rooms. */
export function eventDeduper(limit = 256) {
  const ids = new Set<number>();
  return (id: number) => {
    if (ids.has(id)) return false;
    ids.add(id);
    if (ids.size > limit) { const first = ids.values().next().value; if (first !== undefined) ids.delete(first); }
    return true;
  };
}
export function haremTransition(targetId: string, before: string | null | undefined, after: string | null | undefined, price: number) {
  if ((before ?? null) === (after ?? null)) return null;
  return { targetId, newOwnerId: after ?? targetId, oldOwnerId: before ?? null, price };
}