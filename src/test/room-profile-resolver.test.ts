import { describe, expect, it, vi } from 'vitest';
import { roomProfileResolver } from '@/lib/room-profile-resolver';
import type { Profile } from '@/lib/supabase';
const p = { id: 'departed', name: 'Real player' } as Profile;
describe('chat participant identity', () => {
  it('keeps the real sender after a table departure', async () => { const load = vi.fn(); const resolver = roomProfileResolver(() => null, load); resolver.remember([p]); expect(await resolver.find(p.id)).toBe(p); expect(load).not.toHaveBeenCalled(); });
  it('shares a verified lookup for simultaneous messages', async () => { const load = vi.fn(async () => p); const resolver = roomProfileResolver(() => null, load); const result = await Promise.all([resolver.find(p.id), resolver.find(p.id)]); expect(result).toEqual([p, p]); expect(load).toHaveBeenCalledTimes(1); });
  it('does not fabricate missing players and retries failed lookups', async () => { const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(p); const resolver = roomProfileResolver(() => null, load); expect(await resolver.find(p.id)).toBeNull(); expect(await resolver.find(p.id)).toBe(p); });
});