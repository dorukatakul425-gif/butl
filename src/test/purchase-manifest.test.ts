import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe('public purchase catalogue', () => {
  it('uses the same verified catalogue for twenty rapid independent purchases', async () => {
    const manifest = { gifts: { kiss: { storePrice: 0 } } };
    const fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ assets: { url: 'https://cdn-s.ciliz.com/assets.json' } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => manifest });
    vi.stubGlobal('fetch', fetch);
    const { purchaseManifest } = await import('@/lib/purchase-manifest.server');
    const results = await Promise.all(Array.from({ length: 20 }, () => purchaseManifest()));
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(results.every(result => result === manifest)).toBe(true);
  });
  it('does not retain failed catalogue loads', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal('fetch', fetch);
    const { purchaseManifest } = await import('@/lib/purchase-manifest.server');
    await expect(purchaseManifest()).rejects.toThrow();
    await expect(purchaseManifest()).rejects.toThrow();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});