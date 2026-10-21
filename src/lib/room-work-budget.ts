/** Prevent slow background checks from queueing behind themselves. */
export function singleFlight() {
  let pending: Promise<void> | null = null;
  return (work: () => Promise<void>) => {
    if (pending) return pending;
    pending = Promise.resolve().then(work).finally(() => { pending = null; });
    return pending;
  };
}

/** A visual-only budget: confirmed gift transactions/chat are never discarded. */
export function presentationBudget(limit: number) {
  const active = new Set<() => void>();
  return {
    acquire() {
      if (active.size >= limit) return null;
      const release = () => { active.delete(release); };
      active.add(release);
      return release;
    },
    clear() { active.clear(); },
  };
}