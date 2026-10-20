import { describe, expect, it } from 'vitest';
import { shouldContactTelegramAdmin, telegramTopupUrl } from '../lib/telegram-topup';

describe('DAT admin contact (Telegram + website)', () => {
  it('uses the exact chosen DAT amount in an Azerbaijani draft to deltagameadmin', () => {
    const url = new URL(telegramTopupUrl(200, 87));
    expect(url.origin + url.pathname).toBe('https://t.me/deltagameadmin');
    expect(url.searchParams.get('text')).toContain('200 DAT yükləmək istəyirəm.');
    expect(url.searchParams.get('text')).toContain('#87');
  });
  it('redirects Telegram-linked players on the website too', () => {
    expect(shouldContactTelegramAdmin(true, 42)).toBe(true);
  });
  it('does not redirect non-Telegram accounts', () => {
    expect(shouldContactTelegramAdmin(true, null)).toBe(false);
    expect(shouldContactTelegramAdmin(true, undefined)).toBe(false);
  });
  it('redirects only insufficient-balance errors', () => {
    expect(shouldContactTelegramAdmin(false, 42)).toBe(false);
  });
  it('rejects invalid DAT amounts', () => {
    expect(() => telegramTopupUrl(-5)).toThrow();
    expect(() => telegramTopupUrl(1.5)).toThrow();
  });
});
