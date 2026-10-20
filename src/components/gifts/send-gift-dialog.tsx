import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { Button } from "@/components/ui/button";
import type { GiftStoreItem } from "@/lib/gifts";
import { clampGiftCount, readAutoMode } from "@/lib/premium-gifts";

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
  /** GiftPanelToolbar: Avtomatik / Əl ilə is shown to VIP players only. */
  vip?: boolean;
  /** Zd.items: premium (DAT) gifts; the "💎 Premium" button appears only when the list is not empty. */
  premiumItems?: GiftStoreItem[];
  dat?: number | null;
  onPremiumTap?: (item: GiftStoreItem) => void;
  onPremiumOpen?: () => void;
}

// ca: toolbar state shared by every open of the drawer (count resets per page load, mode is remembered).
const toolbar = {
  auto: (() => { try { return readAutoMode(typeof window !== "undefined" ? window.localStorage.getItem("giftAutoMode") : null); } catch { return true; } })(),
  count: 1,
  setAuto(on: boolean) { this.auto = on; try { window.localStorage.setItem("giftAutoMode", on ? "auto" : "manual"); } catch { /* ignore */ } },
  setCount(v: unknown) { this.count = clampGiftCount(v); return this.count; },
};

function GiftPanelToolbar({ vip, premium, hasPremium, dat, auto, onPremium, onAuto }: { vip: boolean; premium: boolean; hasPremium: boolean; dat: number | null | undefined; auto: boolean; onPremium: (on: boolean) => void; onAuto: (on: boolean) => void }) {
  const [count, setCount] = useState(toolbar.count);
  const apply = (v: unknown) => setCount(toolbar.setCount(v));
  const stop = (e: SyntheticEvent) => e.stopPropagation();
  const btn = hasPremium && <button type="button" className={cls("premium-btn", [premium && "on"])} onClick={() => onPremium(!premium)}>{premium ? "← Adi" : "💎 Premium"}</button>;
  if (premium) return (
    <div className={cls("toolbar", ["premium"])} onTouchStart={stop} onMouseDown={stop}>
      {btn}
      <div className={cls("premium-info")}>{(dat !== null && dat !== undefined ? `💎 ${dat} DAT · ` : "") + "alıcı qiymətin yarısını DAT kimi alır"}</div>
    </div>
  );
  return (
    <div className={cls("toolbar")} onTouchStart={stop} onMouseDown={stop}>
      {btn}
      {vip && <div className={cls("mode")}>
        <button type="button" className={cls("mode-btn", [auto && "on"])} onClick={() => onAuto(true)}>Avtomatik</button>
        <button type="button" className={cls("mode-btn", [!auto && "on"])} onClick={() => onAuto(false)}>Əl ilə</button>
      </div>}
      <div className={cls("qty")}>
        <span className={cls("qty-label")}>Say</span>
        <button type="button" className={cls("qty-btn")} onClick={() => apply(count - 1)}>−</button>
        <input className={cls("qty-input")} type="number" inputMode="numeric" min={1} max={100} value={count}
          onChange={e => { const v = parseInt(e.currentTarget.value, 10); if (v >= 1) { toolbar.setCount(v); setCount(toolbar.count); } else setCount(e.currentTarget.value as unknown as number); }}
          onBlur={e => apply(e.currentTarget.value)} onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }} />
        <button type="button" className={cls("qty-btn")} onClick={() => apply(count + 1)}>+</button>
      </div>
    </div>
  );
}

function GiftItem({ assets, item, onSend, onPreload, onLocked, crystal = false, autoRepeat = true }: { assets: CilizAssets; item: GiftStoreItem; onSend: (item: GiftStoreItem) => void; onPreload: (item: GiftStoreItem) => void; onLocked?: ((item: GiftStoreItem) => void) | undefined; crystal?: boolean; autoRepeat?: boolean }) {
  const run = useRef<{ left: number; timer?: number } | null>(null);
  useEffect(() => () => { if (run.current) window.clearInterval(run.current.timer); }, []);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const img = dialogImage(assets, item.image, 60, 60);
  const hold = useRef<{ delay?: number; repeat?: number; fired: boolean; x?: number; y?: number; moved?: boolean; tapped?: boolean }>({ fired: false });
  const stopHold = () => { window.clearTimeout(hold.current.delay); window.clearInterval(hold.current.repeat); };
  useEffect(() => () => { window.clearTimeout(timer.current); stopHold(); }, []);
  // Scrolling the gift list is never a tap: cancel any pending hold-to-send.
  useEffect(() => {
    const root = ref.current?.closest(".popup__content");
    if (!root) return;
    const onScroll = () => { hold.current.moved = true; stopHold(); };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);
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
  const showLeft = (n: number) => { const el = ref.current; if (!el) return; if (n > 0) el.setAttribute("data-left", String(n)); else el.removeAttribute("data-left"); };
  const fire = () => {
    onSend(item);
    const el = ref.current;
    if (!el) return;
    window.clearTimeout(timer.current);
    el.classList.add(cls("item", ["active"]).split(" ")[1] ?? "");
    timer.current = window.setTimeout(() => el.classList.remove("send-gift__item--active"), 500);
  };
  // OpenedItem.onPress: "Say" > 1 sends that many gifts one after another (180 ms); a tap while running stops it.
  const activate = () => {
    if (item.lock) { onLocked?.(item); return; }
    if (run.current) { window.clearInterval(run.current.timer); run.current = null; showLeft(0); return; }
    const count = crystal ? 1 : toolbar.count;
    if (count <= 1) { fire(); return; }
    const state: { left: number; timer?: number } = { left: count };
    run.current = state;
    const step = () => {
      if (run.current !== state) return;
      fire(); state.left--; showLeft(state.left);
      if (state.left <= 0) { window.clearInterval(state.timer); run.current = null; showLeft(0); }
    };
    state.timer = window.setInterval(step, 180);
    step();
  };
  return (
    <div ref={ref} className={`${cls("item")} touch-manipulation`} data-code={item.type} title={item.name} onClick={() => { if (hold.current.tapped) { hold.current.tapped = false; return; } if (hold.current.fired || hold.current.moved) { hold.current.fired = false; hold.current.moved = false; return; } stopHold(); activate(); }} onPointerEnter={() => onPreload(item)} onPointerDown={e => { onPreload(item); stopHold(); hold.current.fired = false; hold.current.moved = false; hold.current.x = e.clientX; hold.current.y = e.clientY; if (item.lock || !autoRepeat) return; hold.current.delay = window.setTimeout(() => { hold.current.fired = true; fire(); hold.current.repeat = window.setInterval(fire, 120); }, 350); }} onPointerMove={e => { if (Math.abs(e.clientX - (hold.current.x ?? e.clientX)) > 8 || Math.abs(e.clientY - (hold.current.y ?? e.clientY)) > 8) { hold.current.moved = true; stopHold(); } }} onPointerUp={e => { stopHold(); if (e.pointerType !== "mouse" && !hold.current.fired && !hold.current.moved) { hold.current.tapped = true; activate(); } }} onPointerLeave={stopHold} onPointerCancel={() => { hold.current.moved = true; stopHold(); }} onContextMenu={e => e.preventDefault()} role="button" aria-label={item.name} tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } }}>
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
          <div className={cls("icon", [crystal ? "crystal" : "heart"])} />
          <div className={cls("price")}>{item.price}</div>
        </div>
      )}
    </div>
  );
}

export function SendGiftDialog({ open, assets, items, receiverName, onSend, onPreload, onClose, onLocked, onProfile, selective = false, multiselect, vip = false, premiumItems = [], dat, onPremiumTap, onPremiumOpen }: SendGiftDialogProps) {
  const [premium, setPremium] = useState(false);
  const [auto, setAuto] = useState(toolbar.auto);
  useEffect(() => { if (!open) setPremium(false); else onPremiumOpen?.(); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const listRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; header: number } | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // DrawerTransition: the drawer covers the chat area.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
      const top = chat && chat.height > 120 ? chat.top : Math.round(window.innerHeight * 0.5);
      const left = chat ? chat.left : 0;
      const width = chat ? chat.width : window.innerWidth;
      // Ciliz setHeader: dikey modda çekmecenin beyaz başlığı üst simge çubuğunun
      // üzerine çıkar ve onu tamamen kaplar (yarı şeffaf üst üste binme olmaz).
      const headerBar = document.querySelector(".original-table-header")?.getBoundingClientRect().height ?? 84;
      setBox({ top, left, width, header: Math.min(headerBar, top) });
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
  }, [open, box, items.length, premium, premiumItems.length]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose]);

  if (!open || !box) return null;
  const title = translate(assets, "dlg:gift:title", "").replace("%", "").trim();

  const openMusic = (type: "audio" | "video") => {
    onClose();
    window.dispatchEvent(new CustomEvent("source:open-music-list", { detail: { type } }));
  };
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, fontFamily: "Arial, Helvetica, sans-serif", pointerEvents: "none" }}>
      {/* Ciliz setHeader: dikey modda çekmece başlığı üst simge çubuğunun üzerine
          opak beyaz şerit olarak çıkar; simgeler başlığın altında kalır. */}
      <div
        className={`popup__header ${cls("x_header")} send-gift__x_header--teaser`}
        style={{ position: "absolute", top: 0, left: box.left, width: box.width, height: box.header, paddingTop: "env(safe-area-inset-top, 0px)", boxSizing: "border-box", pointerEvents: "auto", zIndex: 2 }}
      >
        <div className={`popup__title popup__title--left ${cls("x_popup__title")}`}>
          {selective && multiselect ? (
            <div className={cls("multi-title")}>{multiselect.title}</div>
          ) : (
            <>
            {onProfile && <div className={`${cls("btn", ["profile"])} ${showProfile ? "send-gift__show-profile" : ""}`} role="button" aria-label="Profil" onClick={(e) => { e.stopPropagation(); onProfile(); }} />}
            <div className="send-gift__recipient">
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
        <div className={`popup__content popup__content--no-padding ${cls("x_popup__content")}`} style={{ flex: 1 }}>
          <GiftPanelToolbar vip={vip} premium={premium} hasPremium={premiumItems.length > 0} dat={dat} auto={auto}
            onPremium={setPremium} onAuto={on => { toolbar.setAuto(on); setAuto(on); }} />
          <div ref={listRef} className={cls("", ["gift"])}>
            {premium && premiumItems.map(item => (
              <GiftItem key={`p-${item.type}`} assets={assets} item={item} crystal autoRepeat={false} onSend={i => onPremiumTap?.(i)} onPreload={onPreload} />
            ))}
            {!premium && !selective && ([{ type: "video" as const, image: "g_video_v3", price: 9, label: "music:video" }, { type: "audio" as const, image: "g_music_v3", price: 5, label: "music:audio" }]).map(media => {
              const image = dialogImage(assets, media.image, 60, 60);
              return <Button key={media.type} variant="ghost" className={`${cls("item")} p-0 gap-0 whitespace-normal`} aria-label={translate(assets, media.label)} title={translate(assets, media.label)} onClick={() => openMusic(media.type)}>
                <div className={cls("image-block")}><img className={cls("image")} src={image.src} width={image.width} height={image.height} alt="" crossOrigin="anonymous" /></div>
                <div className={cls("subitem")}><div className={cls("icon", ["heart"])} /><div className={cls("price")}>{media.price}</div></div>
              </Button>;
            })}
            {!premium && items.map((item) => (
              <GiftItem key={item.type} assets={assets} item={item} autoRepeat={vip && auto} onSend={onSend} onPreload={onPreload} onLocked={onLocked} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
