import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { buildGestureItems, gestureEligibility, type GestureAccount, type GestureItem } from "@/lib/gestures";

export function GestureDialog({ open, assets, account = null, onClose, onPreview, onSend, onProfile }: {
  open: boolean; assets: CilizAssets; account?: GestureAccount | null; onClose: () => void;
  onPreview: (item: GestureItem) => Promise<void>; onSend?: (item: GestureItem) => Promise<void>;
  onProfile: () => void;
}) {
  const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(null);
  const [selected, setSelected] = useState<GestureItem | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  const items = buildGestureItems(assets, account);
  const t = (key: string) => translate(assets, key);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
      setBox(chat ? { top: chat.top, left: chat.left, width: chat.width } : { top: window.innerHeight / 2, left: 0, width: window.innerWidth });
    };
    place(); window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);
  useLayoutEffect(() => { if (open && listRef.current) listRef.current.scrollTop = savedScroll.current; }, [open, box]);
  useEffect(() => {
    if (!open) { setSelected(null); setStatus(""); return; }
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") selected ? setSelected(null) : onClose(); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, selected, onClose]);
  const activate = async (item: GestureItem) => {
    setStatus("");
    if (item.lock) { setSelected(item); return; }
    const eligibility = gestureEligibility(item, account);
    if (eligibility !== "available" || !onSend) {
      setSelected(item); setStatus(eligibility === "tokens" ? "Bu jest için yeterli jeton yok." : "Oyuncu hesabı bağlı değil; jeton harcanamaz."); return;
    }
    setBusy(true);
    try { await onSend(item); } catch { setStatus("Jest gönderilemedi; tekrar deneyin."); } finally { setBusy(false); }
  };
  if (!open || !box) return null;
  const preview = async () => {
    if (!selected) return;
    setBusy(true); setStatus("");
    try { await onPreview(selected); setSelected(null); } catch { setStatus("Jest animasyonu yüklenemedi; tekrar deneyin."); } finally { setBusy(false); }
  };
  const image = selected ? dialogImage(assets, selected.gesture.storeImage || selected.gesture.image, 100, 100) : null;
  return createPortal(<>
    <section role="dialog" aria-label={t("dlg:gesture:send")} className="gesture-drawer" style={{ top: box.top, left: box.left, width: box.width }}>
      <header className="gesture-header"><Button variant="ghost" className="send-gift__btn send-gift__btn--profile gesture-profile" title="Profilim" aria-label="Profilim" onClick={onProfile} /><span className="gesture-title">{t("dlg:gesture:send")}</span><Button variant="ghost" className="send-gift__tokens gesture-balance" title="Jetonlar" aria-label="Jeton bakiyesi" onClick={() => setStatus("Oyuncu hesabı bağlı değil; jeton bakiyesi doğrulanamıyor.")}>{account?.tokens ?? "—"}</Button></header>
      {status && !selected && <p role="status" className="gesture-status">{status}</p>}
      <div ref={listRef} className="gesture-scroll" onScroll={e => { savedScroll.current = e.currentTarget.scrollTop; }}><div className="send-gift--gesture gesture-grid">
        {items.map(item => {
          const img = dialogImage(assets, item.gesture.storeImage || item.gesture.image, 60, 60);
          return <Button key={item.gesture.type} variant="ghost" className="send-gift__item gesture-item" title={item.name} aria-label={item.name} disabled={busy} onClick={() => void activate(item)}><span className="send-gift__image-block"><img className={item.lock ? "send-gift__image send-gift__image--locked" : "send-gift__image"} src={img.src} width={img.width} height={img.height} alt="" loading="lazy" /></span><span className="send-gift__subitem"><span className={`send-gift__icon send-gift__icon--${item.lock ? item.lock.kind === "vip" ? "viplock" : "lock" : "token"}`} />{!item.lock && <span className="send-gift__price">{item.gesture.storePrice}</span>}</span></Button>;
        })}
      </div></div>
      <Button variant="ghost" className="popup__close popup__close--drawer gesture-close" aria-label="Jestleri kapat" title="Kapat" onClick={onClose}><span className="popup__close-icon" /></Button>
    </section>
    {selected && <div className="gesture-modal-layer"><div className="popup-shade" onClick={() => setSelected(null)} /><section role="dialog" aria-modal="true" aria-label={selected.lock?.kind === "vip" ? t("dlg:locked:vip:title") : selected.lock ? t("dlg:locked_gift:title") : selected.name} className="popup popup--center popup--show gesture-lock">
      <header className="popup__header"><div className="popup__title">{selected.lock?.kind === "vip" ? t("dlg:locked:vip:title") : selected.lock ? t("dlg:locked_gift:title") : selected.name}</div><Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Pencereyi kapat" onClick={() => setSelected(null)}><span className="popup__close-icon" /></Button></header>
      <div className="popup__content gift-locked">{image && <img src={image.src} width={image.width} height={image.height} alt={selected.name} />}<p className="gift-locked__description">{selected.lock?.kind === "vip" ? t("dlg:locked_gesture:vip:desc") : selected.lock ? t("dlg:locked_gesture:kiss:desc") : status}</p>{selected.lock?.kind === "kisses" && <><progress className="gesture-progress" value={selected.lock.current} max={selected.lock.needed} /><div>{account ? selected.lock.current : "—"} / {selected.lock.needed}</div></>}{selected.lock && !account && <p className="gesture-status">Oyuncu hesabı bağlı değil; kilit durumu doğrulanamıyor.</p>}{busy && <p role="status">Yükleniyor…</p>}{status && selected.lock && <p role="status">{status}</p>}</div>
      <div className="gesture-actions"><Button variant="secondary" disabled={busy} onClick={() => setSelected(null)}>{t("dlg:navigate_vip:btn")}</Button><Button disabled={busy} onClick={() => void preview()}>Önizle</Button></div>
    </section></div>}
  </>, document.body);
}