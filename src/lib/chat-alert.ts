import { playSfx, preloadSfx } from './sfx';

// Original ChatPresenter.chatMessage: an addressed message plays personal_message.
export const PERSONAL_MESSAGE_SOUND = 'personal_message';
export const PERSONAL_MESSAGE_TEMPLATE = 'https://butilochka.cdnvideo.ru/bottle/bundle/sfx/${name}?c89b36585ce26adf';
const heard = new Set<string>();
export function chatAlertEligible(sender: string, receiver: string | null | undefined, viewer: string) {
  return Boolean(viewer && sender !== viewer && receiver === viewer);
}
export function preloadChatAlert() { preloadSfx(PERSONAL_MESSAGE_TEMPLATE, PERSONAL_MESSAGE_SOUND); }
export function playChatAlert(id: string, sender: string, receiver: string | null | undefined, viewer: string) {
  if (!chatAlertEligible(sender, receiver, viewer) || heard.has(id)) return;
  heard.add(id);
  if (heard.size > 1000) { const oldest = heard.values().next().value; if (oldest) heard.delete(oldest); }
  try { if (localStorage.getItem('deltagame.social.sound') === 'off') return; } catch { /* defaults on */ }
  void playSfx(PERSONAL_MESSAGE_TEMPLATE, PERSONAL_MESSAGE_SOUND);
}