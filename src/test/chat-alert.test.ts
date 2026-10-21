import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../lib/sfx', () => ({ playSfx: vi.fn(), preloadSfx: vi.fn() }));
import { playSfx } from '../lib/sfx';
import { playChatAlert, PERSONAL_MESSAGE_TEMPLATE } from '../lib/chat-alert';
beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); });
it('plays the original personal_message for an incoming private message once', () => {
  playChatAlert('direct:one', 'sender', 'me', 'me');playChatAlert('direct:one', 'sender', 'me', 'me');
  expect(playSfx).toHaveBeenCalledExactlyOnceWith(PERSONAL_MESSAGE_TEMPLATE, 'personal_message');
});
it('plays for a public reply addressed to the viewer', () => {
  playChatAlert('room:two', 'sender', 'me', 'me');
  expect(playSfx).toHaveBeenCalledExactlyOnceWith(PERSONAL_MESSAGE_TEMPLATE, 'personal_message');
});
it('does not play on outgoing or unrelated messages', () => {
  playChatAlert('room:three', 'me', 'other', 'me');playChatAlert('room:four', 'other', null, 'me');
  expect(playSfx).not.toHaveBeenCalled();
});
it('respects notification sound off', () => {
  localStorage.setItem('deltagame.social.sound','off');playChatAlert('room:five','other','me','me');
  expect(playSfx).not.toHaveBeenCalled();
});