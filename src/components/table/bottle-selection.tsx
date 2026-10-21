import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { bottleItems, selectBottle, useBottle } from "@/lib/bottle-game";
import { dialogImage, translate } from "@/lib/ciliz-assets";
import { VIEWER_STORE } from "@/lib/viewer";
import { buyBottle, useRoom, VIEWER_DISPLAY_SEAT } from "@/lib/room-session";
import { OPEN_BANK_EVENT } from "@/components/source-dialogs";
import { useViewerProgress } from "@/lib/viewer-progress";

export function BottleSelection({ open, onClose }: { open: boolean; onClose: () => void }) {
  const assets = useCilizAssets();
  const active = useBottle();
  const [notice, setNotice] = useState('');
  const [buying, setBuying] = useState(false);
  const room = useRoom();
  const { vip } = useViewerProgress();
  const [scrolled, setScrolled] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState<{top: number; left: number; width: number; height: number; landscape: boolean} | null>(null);
  const items = useMemo(() => assets ? bottleItems(assets, VIEWER_STORE.social, vip) : [], [assets, vip]);
  useEffect(() => {
    if (!open) return;
    setNotice('');
    setScrolled(false);
    const place = () => {
      const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
      const game = document.querySelector(".original-game")?.getBoundingClientRect();
      if (!chat || !game) return;
      const viewport = window.visualViewport;
      const landscape = (viewport?.width ?? window.innerWidth) > (viewport?.height ?? window.innerHeight);
      const top = landscape ? game.top : chat.top;
      setBox({top, left: chat.left, width: chat.width, height: game.bottom - top, landscape});
    };
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); onClose(); }
      if (e.key !== 'Tab') return;
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const observer = new ResizeObserver(place);
    const game = document.querySelector('.original-game');
    const chat = document.querySelector('.original-chat');
    if (game) observer.observe(game);
    if (chat) observer.observe(chat);
    place(); window.addEventListener("resize",place); document.addEventListener("keydown",key, true);
    window.visualViewport?.addEventListener('resize', place);
    window.visualViewport?.addEventListener('scroll', place);
    return () => {
      observer.disconnect(); window.removeEventListener("resize",place); document.removeEventListener("keydown",key, true);
      window.visualViewport?.removeEventListener('resize', place);
      window.visualViewport?.removeEventListener('scroll', place);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open,onClose]);
  useEffect(() => { if (open && box && assets) closeRef.current?.focus({ preventScroll: true }); }, [open, Boolean(box), Boolean(assets)]);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const align = () => {
      const itemWidth = box?.landscape ? 77 : 90;
      const cols = Math.max(1, Math.floor(list.clientWidth/itemWidth));
      const spacing = Math.max(0, Math.floor((list.clientWidth-cols*itemWidth)/(cols+1)));
      list.style.padding = `${spacing}px 0 ${spacing}px ${spacing}px`;
      Array.from(list.children).forEach(child => { if (child instanceof HTMLElement) child.style.margin = `0 ${spacing}px ${spacing}px 0`; });
    };
    align(); const observer = new ResizeObserver(align); observer.observe(list);
    return () => observer.disconnect();
  }, [open,box,items.length]);
  if (!open || !assets || !box) return null;
  return createPortal(<div className="bottle-drawer-overlay" onClick={onClose}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={translate(assets,"dlg:change_bottle:title")} className={`popup popup--absolute bottle-drawer${box.landscape ? ' bottle-drawer--landscape' : ''}`} style={{top:box.top,left:box.left,width:box.width,height:box.height}} onClick={e=>e.stopPropagation()}>
      <Button ref={closeRef} variant="ghost" className="popup__close-drawer-bg" aria-label="Bağla" title="Bağla" onClick={onClose}><span className="popup__close popup__close--drawer"><span className="popup__close-icon" /></span></Button>
      <div className={`popup__header send-gift__x_header${scrolled ? ' popup__border--bottom' : ''}`}><div className="popup__title popup__title--left send-gift__x_popup__title">{translate(assets,"dlg:change_bottle:title")}</div></div>
      <div className="popup__content popup__content--no-padding send-gift__x_popup__content" onScroll={e => setScrolled(e.currentTarget.scrollTop > 0)}><div ref={listRef} className="send-gift send-gift--bottle">
        {items.map(item => {
          const image = dialogImage(assets,item.bottle.image,70,70);
          const locked = item.locked;
          return <Button variant="ghost" key={item.bottle.type} className="send-gift__item bottle-store-item" aria-label={item.name} title={item.name} aria-pressed={active===item.bottle.type} onClick={()=>{
            if (locked) { setNotice(translate(assets, 'dlg:locked_bottle:vip:desc')); return; }
            if (active === item.bottle.type) { onClose(); return; }
            // Server checks price and balance, then sets the bottle for the whole table.
            const gold = room.players[VIEWER_DISPLAY_SEAT]?.gold;
            if (gold !== undefined && gold < item.bottle.storePrice) { onClose(); window.dispatchEvent(new Event(OPEN_BANK_EVENT)); return; }
            if (buying) return;
            setBuying(true);
            void buyBottle(item.bottle.type).then(res => {
              setBuying(false);
              if (res.ok) { selectBottle(item.bottle.type); onClose(); return; }
              if (res.reason.includes('insufficient')) { onClose(); window.dispatchEvent(new Event(OPEN_BANK_EVENT)); }
              else if (res.reason.includes('vip')) setNotice(translate(assets, 'dlg:locked_bottle:vip:desc'));
              else setNotice('Şüşə dəyişdirilmədi.');
            });
          }}>
            <span className="send-gift__image-block"><img className={`send-gift__image${locked ? ' send-gift__image--locked' : ''}`} src={image.src} width={image.width} height={image.height} alt="" /></span>
            {locked ? <span className="send-gift__icon send-gift__icon--viplock" /> : <span className={`send-gift__subitem${item.bottle.storePrice ? '' : ' send-gift__subitem--invisible'}`}><span className="send-gift__icon send-gift__icon--heart" /><span className="send-gift__price">{item.bottle.storePrice}</span></span>}
          </Button>;
        })}
      </div></div>
      {notice && <p className="source-tops-notice" role="status">{notice}</p>}
    </div>
  </div>,document.body);
}