import { describe, expect, it } from 'vitest';
import { telegramHtml, telegramPayload, telegramNoticeSchema } from '@/lib/telegram-notifications';
import { playerPhoto, TELEGRAM_NO_PHOTO } from '@/lib/player-photo';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';
import { profileRibbon } from '@/lib/user-profile';
const base = { text: 'Salam', bold: true, silent: false, kind: 'text' as const, media: '', after: null };
describe('Telegram account photos', () => {
 it('keeps the no-photo placeholder on repeated missing-photo reads', () => { expect(playerPhoto(null, 42)).toBe(TELEGRAM_NO_PHOTO); expect(playerPhoto('', 42)).toBe(TELEGRAM_NO_PHOTO); });
 it('keeps a photo saved by the user', () => expect(playerPhoto('https://example.test/saved.jpg', 42)).toBe('https://example.test/saved.jpg'));
 it('does not change ordinary website placeholders', () => expect(playerPhoto(null)).toBe(DEFAULT_PHOTO));
});
describe('profile ribbon priority', () => {
 it('shows TOP instead of VIP for current TOP', () => expect(profileRibbon(true, true)).toBe('top'));
 it('shows VIP outside current TOP', () => expect(profileRibbon(false, true)).toBe('vip'));
 it('does not claim membership for a non-VIP outside TOP', () => expect(profileRibbon(false, false)).toBeNull());
});
describe('Telegram notices', () => {
 it('escapes markup before applying bold', () => expect(telegramHtml('<b>A&B</b>', true)).toBe('<b>&lt;b&gt;A&amp;B&lt;/b&gt;</b>'));
 it('sends bold notifications through sendMessage', () => expect(telegramPayload(base, 42)).toEqual({ method: 'sendMessage', body: { chat_id: 42, parse_mode: 'HTML', disable_notification: false, text: '<b>Salam</b>' } }));
 it('uses sendPhoto with the actual selected image', () => { const p = telegramPayload({ ...base, kind: 'photo', media: 'photo-file' }, 42); expect(p.method).toBe('sendPhoto'); expect(p.body).toMatchObject({ photo: 'photo-file', caption: '<b>Salam</b>' }); });
 it('uses sendVideo with the actual selected video', () => { const p = telegramPayload({ ...base, kind: 'video', media: 'video-file' }, 42); expect(p.method).toBe('sendVideo'); expect(p.body).toMatchObject({ video: 'video-file' }); });
 it('rejects a media send without a selected file', () => expect(telegramNoticeSchema.safeParse({ ...base, kind: 'photo' }).success).toBe(false));
});
