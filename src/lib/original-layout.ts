import { useEffect, useRef, useState } from "react";

// Original preloader.js getLayout(), verbatim: 4 screen layouts.
// headerSize = min(w,h) <= 500 ? 48 : 84; isWide = long/short > 4/3.
export type TableLayout = {
  header: number;
  table: { x: number; y: number; size: number };
  chat: { x: number; y: number; w: number; h: number };
};

export function computeLayout(width: number, height: number): TableLayout {
  if (width <= 100) width = 100;
  if (height <= 100) height = 100;
  const S = Math.min(width, height) <= 500 ? 48 : 84;
  const isLandscape = width >= height;
  const isWide = isLandscape ? width / height > 4 / 3 : height / width > 4 / 3;
  if (isLandscape) {
    if (isWide) {
      const size = height;
      return { header: S, table: { x: S, y: 0, size }, chat: { x: S + size, y: 0, w: width - S - size, h: height } };
    }
    const size = height - S;
    return { header: S, table: { x: 0, y: S, size }, chat: { x: size, y: 0, w: width - size, h: height } };
  }
  if (isWide) {
    const size = width;
    return { header: S, table: { x: 0, y: S, size }, chat: { x: 0, y: S + size, w: width, h: height - S - size } };
  }
  const size = width - S;
  return { header: S, table: { x: S, y: 0, size }, chat: { x: 0, y: S + size, w: width, h: height - S - size } };
}

// Original dampSoftInput: when the keyboard opens (same width, smaller height)
// the old table/chat geometry is kept and the whole game shifts up by the
// keyboard height, so the chat input stays visible and the table never squashes.
export function useOriginalLayout(): { layout: TableLayout | null; shift: number } {
  const [layout, setLayout] = useState<TableLayout | null>(null);
  const [shift, setShift] = useState(0);
  const baseSize = useRef({ w: 0, h: 0 });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const viewport = window.visualViewport;
      const base = baseSize.current;
      if (base.w === w && base.h > h) {
        setShift(-(base.h - h));
        return;
      }
      baseSize.current = { w, h };
      setLayout(computeLayout(w, h));
      setShift(viewport && viewport.height < h ? -(h - viewport.height) : 0);
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);
  return { layout, shift };
}
