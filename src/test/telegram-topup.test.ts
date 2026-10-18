import { describe, expect, it } from 'vitest';
import { shouldContactTelegramAdmin, telegramTopupUrl } from '../lib/telegram-topup';

describe('Telegram-only DAT contact', () => {
  it('uses the exact chosen DAT amount in an Azerbaijani draft to deltagameadmin', () => {
    const url = new URL(telegramTopupUrl(200, 87));
    expect(url.origin + url.pathname).toBe('https://t.me/deltagameadmin');
    expect(url.searchParams.get('text')).toContain('200 DAT yükləmək istəyirəm.');
    expect(url.searchParams.get('text')).toContain('#87');
  });
  it('does not redirect website launches even for Telegram-linked players', () => {
    expect(shouldContactTelegramAdmin(true, 42, undefined)).toBe(false);
  });
  it('does not redirect non-Telegram accounts', () => {
    expect(shouldContactTelegramAdmin(true, null, 'launch')).toBe(false);
  });
  it('redirects only insufficient-balance errors inside Telegram', () => {
    expect(shouldContactTelegramAdmin(true, 42, 'launch')).toBe(true);
    expect(shouldContactTelegramAdmin(false, 42, 'launch')).toBe(false);
  });
  it('rejects invalid DAT amounts', () => {
    expect(() => telegramTopupUrl(-5)).toThrow();
    expect(() => telegramTopupUrl(1.5)).toThrow();
  });
});