import type { Profile } from './supabase';
/** Message identity survives departures, but never bypasses send eligibility. */
export function roomProfileResolver(current: (id: string) => Profile | null, load: (id: string) => Promise<Profile | null>) {
  const cached = new Map<string, Profile>();
  const pending = new Map<string, Promise<Profile | null>>();
  return {
    remember: (profiles: readonly (Profile | null)[]) => { for (const p of profiles) if (p) cached.set(p.id, p); },
    find: (id: string | null): Promise<Profile | null> => {
      if (!id) return Promise.resolve(null);
      const hit = current(id) ?? cached.get(id);
      if (hit) return Promise.resolve(hit);
      const existing = pending.get(id);
      if (existing) return existing;
      const job = load(id).then(p => { if (p) cached.set(p.id, p); return p; }).catch(() => null).finally(() => pending.delete(id));
      pending.set(id, job);
      return job;
    },
  };
}