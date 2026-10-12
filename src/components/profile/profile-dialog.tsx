import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import type { SeatPlayer } from "@/components/table/table-seats";

export function ProfileDialog({ player, self, assets, onClose, onGift, onDecor, onMusic }: {
  player: SeatPlayer; self: boolean; assets: CilizAssets; onClose: () => void;
  onGift: () => void; onDecor: () => void; onMusic: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState("");
  const [claims, setClaims] = useState(false);
  const t = (key: string) => translate(assets, key);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") claims ? setClaims(false) : onClose(); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose, claims]);
  const needsAccount = () => setNotice("Oyuncu hesabı bağlı değil; bu işlem sunucuda gerçekleştirilemiyor.");
  const counter = (kind: string) => <div className="user-profile__stats-item" key={kind}><span className={`user-profile__stats-icon user-profile__stats-icon--${kind}`} /><span className={`user-profile__stats-item-title user-profile__stats-item-title--${kind}`}>—</span></div>;
  const action = (kind: string, title: string, callback: () => void) => <Button variant="ghost" className={`user-profile__action user-profile__action--${kind}`} title={title} aria-label={title} onClick={callback} />;
  return createPortal(<div className="profile-layer portrait">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-label={`${player.name} profili`} className="popup popup--center popup--show user-profile__x_popup">
      <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Profili kapat" onClick={onClose}><span className="popup__close-icon" /></Button>
      <div className="user-profile">
        <div className="user-profile__info">
          <img className="user-profile__photo" src={player.photoUrl} alt={player.name} />
          <div className="user-profile__shadow" />
          <div className="user-profile__title"><div className="user-profile__name">{player.name}</div></div>
          {self ? <Button variant="ghost" className="user-profile__decor" title="Süsleme" aria-label="Süsleme" onClick={onDecor} /> : <Button variant="ghost" className="user-profile__claim" title="Şikayet ve engelleme" aria-label="Şikayet ve engelleme" onClick={() => setClaims(true)} />}
        </div>
        <div className="user-profile__details">
          <div className="user-profile__scrollable">
            <div className="user-profile__stats"><div className="user-profile__counters">{counter("kiss")}{counter("dj")}<div className={`user-profile__hidden-stats-items user-profile__hidden-stats-items--${expanded ? "expanded" : "narrowed"}`}>{counter("price")}{counter("harem-price")}</div>{counter("gesture")}</div></div>
            <div className="user-profile__stats-border-item"><div className="user-profile__stats-border" /><Button variant="ghost" className={`user-profile__stats-expand-icon ${expanded ? "user-profile__stats-expand-icon--expanded" : ""}`} aria-label="İstatistikleri genişlet" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} /><div className="user-profile__stats-border" /></div>
            <div className="user-profile__harem"><img className="user-profile__owner-photo" src={player.photoUrl} alt="" /><div className="user-profile__harem-info"><div className="user-profile__owner-description">—</div>{counter("price")}<Button className="user-profile__x_button" onClick={() => self ? setNotice(t("dlg:profile:harem:tooltip")) : needsAccount()}>{t("dlg:profile:harem:btn")}</Button></div></div>
            {notice && <p role="status" className="profile-notice">{notice}</p>}
          </div>
          <div className="user-profile__actions">
            {self ? action("music", "Müzik seç", onMusic) : action("gift", "Hediye gönder", onGift)}
            {action("achievements", "Başarılar", needsAccount)}
            {action("message", "Mesaj gönder", () => self ? setNotice(t("warning:self_chat:desc")) : needsAccount())}
          </div>
        </div>
      </div>
    </section>
    {claims && <section role="dialog" aria-modal="true" aria-label="Şikayet ve engelleme" className="popup popup--center popup--show"><div className="profile-menu">{["dlg:block:title", "hint:report_photo", "dlg:report_user:title"].map(key => <Button key={key} variant="secondary" onClick={needsAccount}>{t(key)}</Button>)}<Button variant="ghost" onClick={() => setClaims(false)}>Vazgeç</Button>{notice && <p role="status">{notice}</p>}</div></section>}
  </div>, document.body);
}