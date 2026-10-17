/**
 * Port of SendGiftPresenter.showResponseGift state machine from preloader.js:
 * ready -> dialog (auto-closes after 30s) ; closing with X puts it on hold for 5 minutes.
 */
export const RESPONSE_GIFT_AUTO_CLOSE_MS = 30 * 1000;
export const RESPONSE_GIFT_HOLD_MS = 5 * 60 * 1000;
/** ChatView.supportsResponseGiftDialog: chat area must fit the 236x174 popup. */
export const RESPONSE_GIFT_WIDTH = 236;
export const RESPONSE_GIFT_HEIGHT = 174;

export type ResponseGiftState = { type: "ready" } | { type: "dialog"; senderId: string; giftType: string } | { type: "onhold"; until: number };

export function supportsResponseGift(chat: { width: number; height: number } | null | undefined) {
  return Boolean(chat && chat.width >= RESPONSE_GIFT_WIDTH && chat.height >= 175);
}

/** Returns the next state when a gift reaches the viewer, or null when no popup must open. */
export function onGiftToViewer(state: ResponseGiftState, senderId: string, giftType: string, now: number): ResponseGiftState | null {
  if (state.type === "dialog") return null;
  if (state.type === "onhold" && now < state.until) return null;
  return { type: "dialog", senderId, giftType };
}

export function closeByUser(now: number): ResponseGiftState {
  return { type: "onhold", until: now + RESPONSE_GIFT_HOLD_MS };
}
