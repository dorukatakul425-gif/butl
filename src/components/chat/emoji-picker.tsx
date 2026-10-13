import { memo, useState } from "react";
import { EMOJI_UNICODES } from "@/lib/emoji-unicodes";
import { EMOJI_IMAGE_BASE, stringFromCodepoint } from "@/lib/emoji";

// ChatView.initEmojiPicker / createEmojiImg: CDN images with a text fallback,
// and the VIP shade (chat:emoji:hint / chat:emoji:activate) for non-VIP players.
const Item = memo(function Item({ code, onPick }: { code: string; onPick: (emoji: string) => void }) {
  const emoji = stringFromCodepoint(code);
  const [failed, setFailed] = useState(false);
  return (
    <div className="emoji-picker emoji-picker__item" onClick={() => onPick(emoji)}>
      <img className={`emoji-picker emoji-picker__item--image${failed ? " emoji-picker__item--alt" : ""}`} alt={emoji}
        src={`${EMOJI_IMAGE_BASE}${code}.png`} loading="lazy" onError={() => setFailed(true)} />
      <div className={`emoji-picker emoji-picker__item--txt${failed ? "" : " emoji-picker__item--alt"}`}>{emoji}</div>
    </div>
  );
});

export function EmojiPicker({ size, vip, lockText, activateText, onPick, onBecomeVip }: {
  size: number; vip: boolean; lockText: string; activateText: string;
  onPick: (emoji: string) => void; onBecomeVip: () => void;
}) {
  return (
    <div className="emoji-picker emoji-picker__body" style={{ width: size, height: size }}>
      <div className="emoji-picker emoji-picker__body-layer emoji-picker__list">
        {EMOJI_UNICODES.map(code => <Item key={code} code={code} onPick={onPick} />)}
      </div>
      <div className={`emoji-picker emoji-picker__body-layer emoji-picker__vip-shade${vip ? " emoji-picker__vip-shade-hidden" : ""}`}>
        <div className="emoji-picker emoji-picker__vip-lock" />
        <div className="emoji-picker emoji-picker__vip-lock-text">{lockText}</div>
        <div className="emoji-picker button button--confirm button--no-width" role="button" onClick={onBecomeVip}>{activateText}</div>
      </div>
    </div>
  );
}
