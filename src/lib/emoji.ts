// Ports of utils/Emoji.ts + utils/EMOJI_RE.ts + ChatView emoji helpers from the original client.
export const EMOJI_IMAGE_BASE = "https://butilochka.cdnvideo.ru/club/emoji/";
export const EMOJI_PICKER_MAX = 28 * 20;

function hexcodeToString(code: number) {
  if (code <= 0xffff) return String.fromCharCode(code);
  const h = Math.floor((code - 0x10000) / 0x400) + 0xd800;
  const l = ((code - 0x10000) % 0x400) + 0xdc00;
  return String.fromCharCode(h, l);
}
export const stringFromCodepoint = (codePoint: string) => codePoint.split("-").map(v => hexcodeToString(parseInt(v, 16))).join("\u200d");

const EMOJI_RE = (() => {
  try { return new RegExp("(\\p{RGI_Emoji})+", "v"); } catch { return /(\p{Extended_Pictographic})+/u; }
})();
export const containsEmoji = (text: string) => EMOJI_RE.test(text);

/** measureEmojiPicker: square, 90% of the chat width, capped at 20 rows of 28px. */
export const emojiPickerSize = (chatWidth: number) => Math.min(chatWidth * 0.9, EMOJI_PICKER_MAX);

/** addEmojiToInput: replace the selection and return the new caret position. */
export function insertEmoji(text: string, selStart: number, selEnd: number, emoji: string) {
  return { text: text.slice(0, selStart) + emoji + text.slice(selEnd), caret: selStart + emoji.length };
}

export type EmojiSendDecision = "send" | "warn";
/** chatPresenter.onsend: non-VIP messages containing emoji open EmojiPresenter.showWarning(onSkip). */
export const emojiSendDecision = (text: string, vip: boolean): EmojiSendDecision => (!vip && containsEmoji(text) ? "warn" : "send");
