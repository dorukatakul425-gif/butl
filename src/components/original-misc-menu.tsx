import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import achievements from "@/assets/original-menu-achievements.svg";
import tops from "@/assets/original-menu-tops.svg";
import bottle from "@/assets/original-menu-bottle.svg";
import decor from "@/assets/original-menu-decor.svg";
import boosters from "@/assets/original-menu-boosters.svg";
import { useCilizAssets } from '@/components/decor/decor-selection';
import { translate } from '@/lib/ciliz-assets';
import "@/styles/table-bg.css";

// MiscMenuPresenter order, MiscMenuDialog geometry and the live assets.json Turkish strings.
const items = [
  { id: "achievements", title: "Başarılar", key: 'table:hint:achievement', icon: achievements },
  { id: "tops", title: "Puanlar", key: 'table:hint:top', icon: tops },
  { id: "bottle", title: "Şişe", key: 'table:menu:change_bottle', icon: bottle },
  // ureyimsen: "Masa fonu" sits between bottle and decor (preloader_new.js misc menu items).
  { id: "tablebg", title: "Masa fonu", key: '', icon: bottle },
  { id: "decor", title: "Stil", key: 'table:menu:decor', icon: decor },
  { id: "boosters", title: "Booster'lar", key: 'table:menu:boosters', icon: boosters },
] as const;

interface OriginalMiscMenuProps {
  open: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSelect?: (id: (typeof items)[number]["id"]) => void;
}

export function OriginalMiscMenu({ open, triggerRef, onClose, onSelect }: OriginalMiscMenuProps) {
  const assets = useCilizAssets();
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMounted(false), 100);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const position = () => {
      const menu = menuRef.current;
      const trigger = triggerRef.current;
      if (!menu || !trigger) return;
      const button = trigger.getBoundingClientRect();
      const header = trigger.closest(".original-table-header")?.getBoundingClientRect();
      const center = button.left + button.width / 2;
      const width = menu.offsetWidth;
      // Original: center under the trigger, or center on screen near the right edge.
      const left = window.innerWidth - center < width / 2 + 15
        ? (window.innerWidth - width) / 2
        : center - width / 2;
      menu.style.left = `${Math.max(0, left)}px`;
      menu.style.top = `${header?.bottom ?? button.bottom}px`;
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [mounted, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      if (!(event.target instanceof Node)) return;
      if (menuRef.current?.contains(event.target) || triggerRef.current?.contains(event.target)) return;
      onClose();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const buttons = Array.from(menuRef.current?.querySelectorAll("button") ?? []);
        const current = buttons.findIndex((button) => button === document.activeElement);
        const index = event.key === "ArrowDown"
          ? (current + 1) % buttons.length
          : (current <= 0 ? buttons.length - 1 : current - 1);
        buttons[index]?.focus();
      }
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("touchstart", outside, { passive: true });
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("touchstart", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open, onClose, triggerRef]);

  if (!mounted) return null;
  return createPortal(
    <div
      ref={menuRef}
      id="original-misc-menu"
      role="dialog"
      aria-label="Masa menüsü"
      className={`original-misc-menu original-misc-menu--${open ? "show" : "hide"}`}
    >
      {items.map((item) => (
        <Button key={item.id} type="button" variant="ghost" className="original-misc-menu-item" onClick={() => { onClose(); onSelect?.(item.id); }}>
          <span className="original-misc-menu-icon"><span aria-hidden="true" className={`original-misc-menu-image--${item.id}`} /></span>
          {assets && item.key ? translate(assets, item.key) : item.title}
        </Button>
      ))}
    </div>,
    document.body,
  );
}