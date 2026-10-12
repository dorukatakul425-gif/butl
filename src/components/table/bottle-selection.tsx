import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { bottleItems, selectBottle, useBottle } from "@/lib/bottle-game";
import { dialogImage, translate } from "@/lib/ciliz-assets";
import { VIEWER_STORE } from "@/lib/viewer";

export function BottleSelection({ open, onClose }: { open: boolean; onClose: () => void }) {
  const assets = useCilizAssets();
  const active = useBottle();
  const listRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{top: number; left: number; width: number} | null>(null);
  const items = useMemo(() => assets ? bottleItems(assets, VIEWER_STORE.social) : [], [assets]);
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
      setBox({top: chat?.top ?? window.innerHeight/2, left: chat?.left ?? 0, width: chat?.width ?? window.innerWidth});
    };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    place(); window.addEventListener("resize",place); document.addEventListener("keydown",key);
    return () => { window.removeEventListener("resize",place); document.removeEventListener("keydown",key); };
  }, [open,onClose]);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const align = () => {
      const cols = Math.max(1, Math.floor(list.clientWidth/72));
      const spacing = Math.floor((list.clientWidth-cols*72)/(cols+1));
      list.style.padding = `${spacing}px 0 ${spacing}px ${spacing}px`;
      Array.from(list.children).forEach(child => { if (child instanceof HTMLElement) child.style.margin = `0 ${spacing}px ${spacing}px 0`; });
    };
    align(); const observer = new ResizeObserver(align); observer.observe(list);
    return () => observer.disconnect();
  }, [open,box,items.length]);
  if (!open || !assets || !box) return null;
  return createPortal(<div className="bottle-drawer-overlay" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label={translate(assets,"dlg:change_bottle:title")} className="popup popup--absolute bottle-drawer" style={{top:box.top,left:box.left,width:box.width,bottom:0}} onClick={e=>e.stopPropagation()}>
      <Button variant="ghost" className="popup__close-drawer-bg" aria-label="Kapat" onClick={onClose}><span className="popup__close popup__close--drawer"><span className="popup__close-icon" /></span></Button>
      <div className="popup__header send-gift__x_header"><div className="popup__title popup__title--left send-gift__x_popup__title">{translate(assets,"dlg:change_bottle:title")}</div></div>
      <div className="popup__content popup__content--no-padding send-gift__x_popup__content"><div ref={listRef} className="send-gift send-gift--bottle">
        {items.map(item => {
          const image = dialogImage(assets,item.bottle.image,60,60);
          return <Button variant="ghost" key={item.bottle.type} className="send-gift__item bottle-store-item" aria-label={item.name} aria-pressed={active===item.bottle.type} disabled={item.locked} onClick={()=>{selectBottle(item.bottle.type);onClose();}}>
            <span className="send-gift__image-block"><img className="send-gift__image" src={image.src} width={image.width} height={image.height} alt="" /></span>
            <span className={`send-gift__price${item.locked ? " bottle-store-lock" : ""}`}>{item.locked ? "VIP" : item.bottle.storePrice}</span>
          </Button>;
        })}
      </div></div>
    </div>
  </div>,document.body);
}