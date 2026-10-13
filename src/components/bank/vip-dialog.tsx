import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import { showSourceToast } from "@/components/source-dialogs";

// Port of VipDialog.tsx + VipPresenter (OK social bank.vipOptions), Pager and
// PageScroller Controls. Purchases need the OK payment session (backend later).
const SCROLL_INTERVAL = 5000;

export function vipDescriptions(t: (k: string) => string, lang: "ru" | "en" = "en") {
  return { gifts: t("mobile:vip:hint1"), [`smile-${lang}`]: t("mobile:vip:hint2"), bottle: t("mobile:vip:hint3"), ribbon: t("mobile:vip:hint4"), tokens: t("mobile:vip:hint6") } as Record<string, string>;
}
export function vipOptions(t: (k: string) => string) {
  return [
    { id: "vip7", period: t("dlg:vip:option:1w"), isPopular: false, price: "120 OK", term: "нед." },
    { id: "vip30", period: t("dlg:vip:option:1m"), isPopular: true, price: "390 OK", term: "мес." },
  ];
}

function usePagerScroller() {
  const [selected, setSelected] = useState(0);
  const anim = useRef<number | null>(null);
  const tid = useRef(0);
  const scroll = useCallback((from: number, to: number) => {
    if (anim.current) cancelAnimationFrame(anim.current);
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / 200);
      const e = 1 - (1 - k) * (1 - k); // EASE_OUT
      setSelected(from + e * (to - from));
      anim.current = k < 1 ? requestAnimationFrame(step) : null;
    };
    anim.current = requestAnimationFrame(step);
  }, []);
  const onScroll = useCallback((to: number) => {
    window.clearTimeout(tid.current);
    if (anim.current) return;
    setSelected(to);
    tid.current = window.setTimeout(() => { if (!anim.current) scroll(to, Math.round(to)); }, 150);
  }, [scroll]);
  const selectedRef = useRef(selected); selectedRef.current = selected;
  const onSelect = useCallback((to: number) => scroll(selectedRef.current, to), [scroll]);
  return [selected, onScroll, onSelect] as const;
}

function Pager({ selected, onScroll, children }: { selected: number; onScroll: (v: number) => void; children: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let ticking = false;
    const on = () => {
      if (programmatic.current) { programmatic.current = false; return; }
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { ticking = false; if (ref.current) onScroll(ref.current.scrollLeft / ref.current.offsetWidth); });
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, [onScroll]);
  useEffect(() => { const el = ref.current; if (el) { programmatic.current = true; el.scrollLeft = selected * el.offsetWidth; } }, [selected]);
  return <div ref={ref} className="pager vip__previews">{children.map((c, i) => <div key={i} className="pager__page vip__preview">{c}</div>)}</div>;
}

function Controls({ numItems, selected, onSelect }: { numItems: number; selected: number; onSelect: (i: number) => void }) {
  const SIZE = 6, MARGIN = 12;
  return <div className="page-scroller-controls__container vip__controls">
    <div className="page-scroller-controls__dots-container vip__pages-indicator">
      {Array.from({ length: numItems }, (_, i) => {
        const current = Math.round(selected) === i;
        return <div key={i} className={`page-scroller-controls__dot${current ? "" : " page-scroller-controls__dot--clickable"}`} onClick={() => onSelect(i)} />;
      })}
      <div className="page-scroller-controls__indicator" style={{ left: SIZE * selected + MARGIN * (selected + 1) }} />
    </div>
  </div>;
}

export function VipDialog({ assets, onClose }: { assets: CilizAssets; onClose: () => void }) {
  const t = (k: string) => translate(assets, k);
  const descriptions = vipDescriptions(t);
  const options = vipOptions(t);
  const pages = Object.keys(descriptions);
  const [selected, onScroll, onSelect] = usePagerScroller();
  const page = useRef(0);
  const bank = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => { page.current = (page.current + 1) % pages.length; onSelect(page.current); }, SCROLL_INTERVAL);
    return () => window.clearInterval(id);
  }, [onSelect, pages.length]);
  useEffect(() => {
    if (!bank.current) return;
    const max = Math.max(...Array.from(bank.current.querySelectorAll<HTMLElement>(".button")).map(e => e.clientWidth));
    if (buttonWidth < max) setButtonWidth(max);
  });
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } };
    document.addEventListener("keydown", key, true);
    return () => document.removeEventListener("keydown", key, true);
  }, [onClose]);
  return createPortal(
    <div className="source-feature-layer" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup-shade" onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-label={t("mobile:bank:vip")} className="popup vip__x_popup popup--center popup--show">
        <div className="popup__header vip__x_popup__header">
          <div className="popup__title vip__x_popup__title">{t("mobile:bank:vip")}</div>
          <div className="popup__close popup__close--dlg" role="button" aria-label="Kapat" onClick={onClose}><div className="popup__close-icon" /></div>
        </div>
        <div className="popup__content vip__x_popup__content">
          <div className="vip__desc vip__desc--main">{t("mobile:vip:desc1")}</div>
          <div className="vip__offer">
            <div className="vip__media">
              <Pager selected={selected} onScroll={onScroll}>
                {pages.map(d => <><div className={`vip__image vip__image--${d}`} /><div className="vip__desc vip__desc--item">{descriptions[d]}</div></>)}
              </Pager>
              <Controls numItems={pages.length} selected={selected} onSelect={i => { page.current = i; onSelect(i); }} />
            </div>
            <div className="vip__bank" ref={bank}>
              {options.map(o => <div key={o.id} className="vip__item">
                <div className="vip__item-info">
                  <div className="vip__crown" />
                  <div className="vip__item-period">{o.period}</div>
                  {o.isPopular && <div className="vip__popular">{t("bank:popular")}</div>}
                </div>
                <div role="button" className="button button--confirm vip__x_button" style={buttonWidth > 0 ? { width: buttonWidth } : undefined}
                  onClick={() => showSourceToast("Ödeme sistemi henüz bağlı değil.")}>{`${o.price}/${o.term}`}</div>
              </div>)}
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
