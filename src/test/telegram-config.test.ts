// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { encryptBotToken, decryptBotToken, loadBotToken } from '../../bot/telegram-config.mjs';
afterEach(() => vi.unstubAllGlobals());
describe('Shared encrypted Telegram token config', () => {
  it('round-trips confidential configuration and rejects a different encryption key', async () => {
    const value = await encryptBotToken('synthetic-test-value', 'synthetic-test-key');
    expect(await decryptBotToken(value, 'synthetic-test-key')).toBe('synthetic-test-value');
    await expect(decryptBotToken(value, 'different-test-key')).rejects.toThrow();
  });
  it('uses the replacement rather than the initial environment value', async () => {
    const value = await encryptBotToken('new-test-value', 'synthetic-test-key');
    vi.stubGlobal('fetch', vi.fn(async () => Response.json([value])));
    expect(await loadBotToken({ url: 'https://backend.test', key: 'synthetic-test-key', fallback: 'old-test-value' })).toBe('new-test-value');
  });
  it('does not silently use the old bot after a configuration read failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    await expect(loadBotToken({ url: 'https://backend.test', key: 'test', fallback: 'old-test-value' })).rejects.toThrow('oxunmadı');
  });
});