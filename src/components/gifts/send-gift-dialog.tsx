import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import type { GiftStoreItem } from "@/lib/gifts";

// Markup and class names ported from SendGiftDialog.tsx (giftType 'gift', html5 layout) and Dialog.Header.
const bem = (block: string) => (element?: string, mods: Array<string | false | undefined> = []) => {
  const base = element ? `${block}__${element}` : block;
  return [base, ...mods.filter(Boolean).map((mod) => `${base}--${mod}`)].join(" ");
};
const cls = bem("send-gift");
const ITEM_WIDTH = 72;

export interface SendGiftDialogProps {
  open: boolean;
  assets: CilizAssets;
  items: GiftStoreItem[];
  receiverName: string;
  onSend: (item: GiftStoreItem) => void;
  onPreload: (item: GiftStoreItem) => void;
  onClose: () => void;
  onLocked?: (item: GiftStoreItem) => void;
  onProfile?: () => void;
  selective?: boolean;
  multiselect?: { title: string; onSelectState: (on: boolean) => void; onSelectMen: () => void; onSelectWomen: () => void };
}

function GiftItem({ assets, item, onSend, onPreload, onLocked }: { assets: CilizAssets; item: GiftStoreItem; onSend: (item: GiftStoreItem) => void; onPreload: (item: GiftStoreItem) => void; onLocked?: ((item: GiftStoreItem) => void) | undefined }) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const img = dialogImage(assets, item.image, 60, 60);
  const hold = useRef<{ delay?: number; repeat?: number; fired: boolean }>({ fired: false });
  const stopHold = () => { window.clearTimeout(hold.current.delay); window.clearInterval(hold.current.repeat); };
  useEffect(() => () => { window.clearTimeout(timer.current); stopHold(); }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        timer = window.setTimeout(() => onPreload(item), 120);
        observer.disconnect();
      }
    }, { root: element.closest(".popup__content"), rootMargin: "80px" });
    observer.observe(element);
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, [item, onPreload]);
  const activate = () => {
    if (item.lock) { onLocked?.(item); return; }
    onSend(item);
    const el = ref.current;
    if (!el) return;
    window.clearTimeout(timer.current);
    el.classList.add(cls("item", ["active"]).split(" ")[1] ?? "");
    timer.current = window.setTimeout(() => el.classList.remove("send-gift__item--active"), 500);
  };
  return (
    <div ref={ref} className={`${cls("item")} touch-manipulation`} data-code={item.type} title={item.name} onClick={() => { if (hold.current.fired) { hold.current.fired = false; return; } activate(); }} onPointerEnter={() => onPreload(item)} onPointerDown={() => { onPreload(item); stopHold(); hold.current.fired = false; if (item.lock) return; hold.current.delay = window.setTimeout(() => { hold.current.fired = true; activate(); hold.current.repeat = window.setInterval(activate, 120); }, 350); }} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} onContextMenu={e => e.preventDefault()} role="button" aria-label={item.name} tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } }}>
      <div className={cls("image-block")}>
        <img className={cls("image", [item.lock && "locked"])} draggable={false} src={img.src} width={img.width} height={img.height} alt="" crossOrigin="anonymous" loading="lazy" decoding="async" />
      </div>
      {item.lock ? (
        <div className={cls("subitem")}>
          <div className={cls("icon", [item.lock.kind === "vip" ? "viplock" : "lock"])} />
          {item.lock.kind === "kisses" && <div className={cls("price")}>{item.lock.need}</div>}
        </div>
      ) : (
        <div className={cls("subitem", [!item.price && "invisible"])}>
          <div className={cls("icon", ["heart"])} />
          <div className={cls("price")}>{item.price}</div>
        </div>
      )}
    </div>
  );
}

export function SendGiftDialog({ open, assets, items, receiverName, onSend, onPreload, onClose, onLocked, onProfile, selective = false, multiselect }: SendGiftDialogProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // DrawerTransition: the drawer covers the chat area.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
      const top = chat && chat.height > 120 ? chat.top : Math.round(window.innerHeight * 0.5);
      const left = chat ? chat.left : 0;
      const width = chat ? chat.width : window.innerWidth;
      setBox({ top, left, width });
    };
    place();
    window.addEventListener("resize", place);
    const id = window.setTimeout(() => setShowProfile(true), 0);
    return () => {
      window.removeEventListener("resize", place);
      window.clearTimeout(id);
      setShowProfile(false);
    };
  }, [open]);

  // A new receiver re-runs the name reveal like a freshly opened dialog.
  useEffect(() => {
    if (!open) return;
    setShowProfile(false);
    const id = window.setTimeout(() => setShowProfile(true), 0);
    return () => window.clearTimeout(id);
  }, [open, receiverName]);

  // alignGiftsImpl(): evenly spaced columns.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !list) return;
    const align = () => {
      const width = list.clientWidth;
      const cols = Math.max(1, Math.floor(width / ITEM_WIDTH));
      const spacing = Math.floor((width - cols * ITEM_WIDTH) / (cols + 1));
      list.style.padding = `${spacing}px 0 ${spacing}px ${spacing}px`;
      for (const child of Array.from(list.children) as HTMLElement[]) child.style.margin = `0 ${spacing}px ${spacing}px 0`;
    };
    align();
    const ro = new ResizeObserver(align);
    ro.observe(list);
    return () => ro.disconnect();
  }, [open, box, items.length]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose]);

  if (!open || !box) return null;
  const title = translate(assets, "dlg:gift:title", "").replace("%", "").trim();

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, fontFamily: "Arial, Helvetica, sans-serif", pointerEvents: "none" }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} ${receiverName}`}
        className="popup popup--absolute"
        style={{ top: box.top, left: box.left, width: box.width, bottom: 0, pointerEvents: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup__close-drawer-bg" style={{ zIndex: 1 }} onClick={onClose} role="button" aria-label="Kapat">
          <div className="popup__close popup__close--drawer">
            <div className="popup__close-icon" />
          </div>
        </div>
        <div className={`popup__header ${cls("x_header")}`}>
          <div className={`popup__title popup__title--left ${cls("x_popup__title")}`}>
            {selective && multiselect ? (
              <div className={cls("multi-title")}>{multiselect.title}</div>
            ) : (
              <>
              {onProfile && <div className={`${cls("btn", ["profile"])} ${showProfile ? "send-gift__show-profile" : ""}`} role="button" aria-label="Profil" onClick={(e) => { e.stopPropagation(); onProfile(); }} />}
              <div>
                <div className={cls("gift-title")}>{title.charAt(0).toLocaleUpperCase("tr") + title.slice(1)}</div>
                <div className={`${cls("name")} ${showProfile ? "send-gift__show-name" : ""}`}>{receiverName}</div>
              </div>
              </>
            )}
          </div>
          {multiselect && (
            <div className={cls("multigift-btn-list")}>
              {selective ? (
                <div className={cls("multigift-gender-list")}>
                  <div className={cls("btn", ["men"])} role="button" aria-label="Erkekleri seç" onClick={(e) => { e.stopPropagation(); multiselect.onSelectMen(); }} />
                  <div className={cls("btn", ["women"])} role="button" aria-label="Kadınları seç" onClick={(e) => { e.stopPropagation(); multiselect.onSelectWomen(); }} />
                  <div className={cls("btn", ["cancel"])} role="button" aria-label="Toplu seçimi iptal et" onClick={(e) => { e.stopPropagation(); multiselect.onSelectState(false); }} />
                </div>
              ) : (
                <div className={cls("btn", ["add"])} role="button" aria-label="Toplu hediye" onClick={(e) => { e.stopPropagation(); multiselect.onSelectState(true); }} />
              )}
            </div>
          )}
        </div>
        <div className={`popup__content popup__content--no-padding ${cls("x_popup__content")}`} style={{ flex: 1 }}>
          <div ref={listRef} className={cls("", ["gift"])}>
            {items.map((item) => (
              <GiftItem key={item.type} assets={assets} item={item} onSend={onSend} onPreload={onPreload} onLocked={onLocked} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
