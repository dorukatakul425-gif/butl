import { useEffect, useState } from "react";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { RESPONSE_GIFT_AUTO_CLOSE_MS, RESPONSE_GIFT_HEIGHT, RESPONSE_GIFT_WIDTH, supportsResponseGift } from "@/lib/response-gift";

export interface ResponseGiftSender { id: string; name: string; photoUrl: string; male: boolean; premium?: boolean; nameColor?: string }

/** Port of ResponseGiftDialog.tsx: "X sent you a gift" + "Send a return gift" over the chat. */
export function ResponseGiftPopup({ assets, sender, giftType, onConfirm, onClose, onTimeout }: {
  assets: CilizAssets; sender: ResponseGiftSender; giftType: string;
  onConfirm: () => void; onClose: () => void; onTimeout: () => void;
}) {
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    const place = () => {
      const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
      if (!chat || !supportsResponseGift(chat)) { setBox(null); return; }
      setBox({ top: chat.top + 20 + 30, left: chat.left + (chat.width - RESPONSE_GIFT_WIDTH) / 2 });
    };
    place();
    window.addEventListener("resize", place);
    window.visualViewport?.addEventListener("resize", place);
    return () => { window.removeEventListener("resize", place); window.visualViewport?.removeEventListener("resize", place); };
  }, []);
  useEffect(() => {
    const id = window.setTimeout(onTimeout, RESPONSE_GIFT_AUTO_CLOSE_MS);
    return () => window.clearTimeout(id);
  }, [onTimeout, sender.id, giftType]);
  const gift = assets.gifts[giftType];
  if (!box || !gift) return null;
  const image = dialogImage(assets, gift.storeImage, 50, 50).src;
  const message = translate(assets, "chat:gift_response:text");
  return (
    <div className="response-gift-layer" style={{ top: box.top, left: box.left, width: RESPONSE_GIFT_WIDTH, height: RESPONSE_GIFT_HEIGHT }}>
      <div className="popup response-gift__x_popup" role="dialog">
        <div className="popup__header response-gift__x_popup__header">
          <div className="response-gift__photo" style={{ backgroundImage: `url(${sender.photoUrl})` }} />
          <div className="response-gift__titles">
            <div className={`response-gift__name${sender.premium ? " response-gift__name--premium" : ""}`} style={sender.premium || !sender.nameColor ? undefined : { color: `#${sender.nameColor}` }}>{sender.name}</div>
            <div className="response-gift__message">{message}</div>
          </div>
          <button type="button" aria-label="Kapat" className="popup__close popup__close--response-gift" onClick={onClose}><div className="popup__close-icon" /></button>
        </div>
        <div className="popup__content response-gift__x_popup__content"><img className="response-gift__image" src={image} alt="" /></div>
        <div className="popup__buttons response-gift__x_popup__buttons">
          <button type="button" className="button button--confirm response-gift__x_button" onClick={onConfirm}>{translate(assets, "chat:gift_response:btn")}</button>
        </div>
      </div>
    </div>
  );
}
