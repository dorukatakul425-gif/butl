import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { showSourceToast } from "@/components/source-dialogs";
import { TABLE_BGS, buyTableBg, fetchTableBgInfo, tableBgName, tableBgThumbUrl, tableBgUrl, type TableBgInfo } from "@/lib/table-bg";
import "@/styles/table-bg.css";

const SEATS = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
  return { left: `${50 + 39 * Math.cos(a)}%`, top: `${50 + 39 * Math.sin(a)}%` };
});

/** Port of ureyimsen's "Masa fonu" popup (preloader_new.js `vd`). */
export function TableBgDialog({ onClose }: { onClose: () => void }) {
  const [info, setInfo] = useState<TableBgInfo | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { let alive = true; void fetchTableBgInfo().then((d) => { if (alive) setInfo(d); }); return () => { alive = false; }; }, []);

  const current = info ? info.current : null;
  const price = info ? info.price : 500;
  const free = info?.free ?? 0;

  const confirm = async () => {
    if (busy || pending === null) return;
    setBusy(true);
    const r = await buyTableBg(pending);
    setBusy(false);
    if (r.ok) {
      onClose();
      if (!r.same) showSourceToast(`✨ Masa fonu dəyişdi: ${tableBgName(r.bg_type)}${r.free_used ? " (pulsuz)" : ""}`);
      return;
    }
    if (info && r.crystals !== undefined) setInfo({ ...info, crystals: r.crystals });
    setPending(null);
    showSourceToast(r.reason.includes("insufficient_crystals") ? "Kifayət qədər kristal yoxdur 💎" : "Fon dəyişmədi, yenidən yoxla");
  };

  return createPortal(
    <div className="table-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="table-bg__panel" role="dialog" aria-label="Masa fonu">
        <div className="table-bg__head">
          <div className="table-bg__title">Masa fonu</div>
          <button type="button" className="table-bg__close" onClick={onClose} aria-label="Bağla">✕</button>
        </div>
        <div className="table-bg__sub">Masadakı hamı görəcək · dəyişmək {price} 💎{info ? ` · Kristalın: ${info.crystals}` : ""}</div>
        {free > 0 && <div className="table-bg__free">🎁 Köhnə fon üçün ödədiyin pula görə yeni fonlardan birini PULSUZ seçə bilərsən{free > 1 ? ` (${free} dəfə)` : ""}</div>}
        <div className="table-bg__grid">
          {TABLE_BGS.map(([id, name]) => (
            <button key={id || "default"} type="button"
              className={`table-bg__item${id === current ? " table-bg__item--current" : ""}${id === pending ? " table-bg__item--pending" : ""}`}
              onClick={() => { if (!busy && id !== current && current !== null) setPending(id); }}>
              <div className={`table-bg__img${id ? "" : " table-bg__img--default"}`} style={id ? { backgroundImage: `url(${tableBgThumbUrl(id)})` } : undefined} />
              <div className="table-bg__name">{name}</div>
              {id === current && <div className="table-bg__badge">Hazırkı</div>}
            </button>
          ))}
        </div>
        {pending !== null && <>
          <div className={`table-bg__preview${pending ? "" : " table-bg__preview--default"}`} style={pending ? { backgroundImage: `url(${tableBgUrl(pending)})` } : undefined}>
            {SEATS.map((s, i) => <div key={i} className="table-bg__pv-seat" style={s} />)}
            <div className="table-bg__pv-bottle">🍾</div>
          </div>
          <div className="table-bg__confirm">
            <div className="table-bg__confirm-text">{free > 0 ? `“${tableBgName(pending)}” fonu PULSUZ qoyulsun?` : `“${tableBgName(pending)}” fonu ${price} kristala qoyulsun?`}</div>
            <button type="button" className="table-bg__yes" disabled={busy} onClick={() => void confirm()}>{busy ? "..." : "Bəli, dəyiş"}</button>
            <button type="button" className="table-bg__no" onClick={() => setPending(null)}>Ləğv et</button>
          </div>
        </>}
      </div>
    </div>,
    document.body,
  );
}
