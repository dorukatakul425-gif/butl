import { useEffect, useState } from "react";
import type React from "react";
import { createPortal } from "react-dom";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import type { SeatPlayer } from "@/components/table/table-seats";
import { useSourceFeatureSession } from "@/lib/source-feature-session";
import { SourceLockedPopup, SourceProfileSettings, useFrameUnlocked } from "@/components/profile/source-own-profile";
import { SourceDialogLayer, SourceInfoDialog, SourceButtons, showSourceToast } from "@/components/source-dialogs";
import { formatHarem, formatStats, okProfileUrl, type ServerUserProfile } from "@/lib/user-profile";
import { OK_SUPPORT_EMAIL as SUPPORT_EMAIL, CLIENT_VERSION } from "@/components/settings/settings-items";

const Div = (p: React.HTMLAttributes<HTMLDivElement>) => <div role={p.onClick ? "button" : undefined} {...p} />;

/** Port of UserProfileDialog + UserProfilePresenter (OK.ru client 1.6.393). */
export function ProfileDialog({ player, self, assets, onClose, onGift, onDecor, onMusic, profile = null }: {
  player: SeatPlayer; self: boolean; assets: CilizAssets; onClose: () => void;
  onGift: () => void; onDecor: () => void; onMusic: () => void;
  /** queryUserProfile result; null until the game session adapter provides it. */
  profile?: ServerUserProfile | null;
}) {
  const t = (key: string, ...a: string[]) => translate(assets, key, ...a);
  const [statsState, setStatsState] = useState<"narrowed" | "expanded">("narrowed");
  const [popup, setPopup] = useState<"settings" | "frame-locked" | "claims" | "report-photo" | "report-user" | null>(null);
  const [report, setReport] = useState("");
  const feature = useSourceFeatureSession();
  const frameUnlocked = useFrameUnlocked();
  const stats = profile ? formatStats(profile) : null;
  const userId = self ? feature.viewerId ?? undefined : player.id;
  const harem = formatHarem(self, userId ?? "", profile);
  const socialHref = okProfileUrl(userId);
  const noServer = () => showSourceToast("Oyuncu hesabı bağlı değil; bu işlem sunucuda gerçekleştirilemiyor.");

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (!popup && e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose, popup]);

  const statItem = (kind: string, title?: string, sub?: string) => (
    <div className="user-profile__stats-item" key={kind}>
      <div className={`user-profile__stats-icon user-profile__stats-icon--${kind}`} />
      <div className={`user-profile__stats-item-title user-profile__stats-item-title--${kind}`}>{title ?? "—"}</div>
      {sub && <div className="user-profile__stats-item-subtitle">{sub} {t("dlg:profile:rank")}</div>}
    </div>
  );
  const big = !!(stats && profile!.total_kisses && profile!.dj_score && profile!.gestures);

  const onSendMessage = () => {
    if (self) { showSourceToast(t("warning:self_chat:desc")); return; }
    if (!player.id) { noServer(); return; }
    window.dispatchEvent(new CustomEvent("game-reply-to", { detail: { id: player.id, name: player.name, photoUrl: player.photoUrl, male: player.male } }));
    onClose();
  };
  const onHarem = () => {
    if (self && harem.noOwner) { showSourceToast(t("dlg:profile:harem:tooltip")); return; }
    if (harem.owner?.viewer) { showSourceToast(t("dlg:profile:harem:purchased", player.name)); return; }
    noServer();
  };

  return createPortal(<div className="profile-layer portrait">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-label={player.name} className="popup popup--center popup--show user-profile__x_popup">
      <Div className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></Div>
      <div className="user-profile">
        <div className="user-profile__info">
          {self
            ? <Div className="user-profile__photo-controls" aria-label={t("dlg:profile_info:title")} onClick={() => setPopup("settings")}><img className="user-profile__photo" src={player.photoUrl} alt={player.name} /></Div>
            : <img className="user-profile__photo" src={player.photoUrl} alt={player.name} />}
          <div className="user-profile__shadow" />
          <div className="user-profile__title">
            <div className="user-profile__name">{player.name}{player.age ? `, ${player.age}` : ""}</div>
            {player.city && <div className="user-profile__city">{player.city}</div>}
          </div>
          {player.zodiac !== undefined && <Div className={`user-profile__zodiac user-profile__zodiac--${player.zodiac}`} title={t(`hint:zodiac:${player.zodiac}`)} onClick={() => showSourceToast(t(`hint:zodiac:${player.zodiac}`))} />}
          {self && <Div className={`user-profile__decor${frameUnlocked ? "" : " user-profile__action--greyscaled"}`} aria-label="Süsleme" onClick={() => frameUnlocked ? onDecor() : setPopup("frame-locked")} />}
          {!self && <Div className="user-profile__claim" aria-label="Şikayet" onClick={() => setPopup("claims")} />}
        </div>
        <div className="user-profile__details">
          <div className="user-profile__scrollable">
            {profile?.status && <><div className="user-profile__status">{profile.status}</div><div className="user-profile__stats-border" /></>}
            <div className={`user-profile__stats${big ? " user-profile__stats--big" : ""}`}>
              <div className="user-profile__counters">
                {statItem("kiss", stats?.totalKisses, stats?.totalKissesRank)}
                {statItem("dj", stats?.djScore, stats?.djRank)}
                <div className={`user-profile__hidden-stats-items user-profile__hidden-stats-items--${statsState}`}>
                  {statItem("price", stats?.price, stats?.priceRank)}
                  {statItem("harem-price", stats?.haremPrice, stats?.haremPriceRank)}
                </div>
                {statItem("gesture", stats?.gestures, stats?.gesturesRank)}
              </div>
            </div>
            <div className="user-profile__stats-border-item">
              <div className="user-profile__stats-border" />
              <Div className={`user-profile__stats-expand-icon${statsState === "expanded" ? " user-profile__stats-expand-icon--expanded" : ""}`} aria-label="İstatistikler"
                onClick={() => setStatsState(s => s === "expanded" ? "narrowed" : "expanded")} />
              <div className="user-profile__stats-border" />
            </div>
            <div className="user-profile__harem">
              <Div className="user-profile__owner-photo" style={harem.owner ? { backgroundImage: `url('${harem.owner.photoUrl}')` } : undefined} />
              <div className="user-profile__harem-info">
                <div className="user-profile__owner-description">
                  {harem.owner ? t("dlg:profile:harem:owner_v2") : t("dlg:profile:harem:no_owner")}
                  {harem.owner && <span className="user-profile__owner-name" style={{ color: `#${harem.owner.color}` }}>{harem.owner.name}</span>}
                </div>
                <div className="user-profile__stats-item user-profile__stats-item--harem">
                  <div className="user-profile__stats-icon user-profile__stats-icon--price" />
                  <div className="user-profile__stats-item-title">{harem.price ?? "—"}</div>
                </div>
                <Div className={`button button--confirm user-profile__x_button${harem.btnIsDisabled ? " button--disabled" : ""}`} onClick={onHarem}>{t(harem.btnKey)}</Div>
              </div>
            </div>
          </div>
          <div className="user-profile__actions user-profile__actions--justify">
            {socialHref
              ? <a className="user-profile__action user-profile__action--ok" href={socialHref} target="_blank" rel="noreferrer" aria-label="OK" />
              : <div className="user-profile__action user-profile__action--ok user-profile__action--disabled" aria-label="OK" />}
            {self
              ? <Div className="user-profile__action user-profile__action--music" aria-label="Müzik" onClick={onMusic} />
              : <Div className="user-profile__action user-profile__action--gift" aria-label="Hediye" onClick={onGift} />}
            <Div className="user-profile__action user-profile__action--achievements" aria-label="Başarılar" onClick={noServer} />
            <Div className="user-profile__action user-profile__action--message" aria-label="Mesaj" onClick={onSendMessage} />
          </div>
        </div>
      </div>
    </section>

    {popup === "claims" && createPortal(<div className="source-feature-layer">
      <div className="popup-shade" onClick={() => setPopup(null)} />
      <section role="dialog" aria-modal="true" className="popup popup--center popup--show message-actions__x_popup">
        {[
          { key: "dlg:block:title", icon: "ignore", action: () => { setPopup(null); noServer(); } },
          { key: "hint:report_photo", icon: "adult", action: () => setPopup("report-photo") },
          { key: "dlg:report_user:title", icon: "report", action: () => setPopup("report-user") },
        ].map(i => <div key={i.key} role="button" className="settings__item settings__item--selectable" onClick={i.action}><div className={`settings__icon settings__icon--${i.icon}`} />{t(i.key)}</div>)}
      </section>
    </div>, document.body)}

    {popup === "report-photo" && <SourceInfoDialog hasClose title={t("dlg:report_photo:title")} context={t("dlg:report_photo:desc")} onClose={() => setPopup(null)}
      confirm={{ title: t("dlg:report_photo:ok"), onClick: () => { setPopup(null); noServer(); } }}
      cancel={{ title: t("dlg:report_photo:cancel"), onClick: () => setPopup(null) }} />}

    {popup === "report-user" && <SourceDialogLayer title={t("dlg:report_user:title")} onClose={() => setPopup(null)} onShade={() => setPopup(null)}>
      <div className="popup__content"><div className="report">
        <textarea rows={5} placeholder={t("dlg:report_user:hint")} onInput={e => setReport((e.target as HTMLTextAreaElement).value.trim())} />
      </div></div>
      <SourceButtons cancel={{ title: t("dlg:report_user:cancel"), onClick: () => setPopup(null) }}
        confirm={{ title: t("dlg:report_user:send"), onClick: () => {
          const body = [`User id: ${feature.viewerId ?? ""}`, "Social: ok", `Accused User: ${player.id ?? ""}`, `Accused User social: ${profile?.social ?? ""}`, `Date: ${new Date().toISOString()}`, `Client version: ${CLIENT_VERSION}`, "Text:", report].join("\n");
          window.open(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`HTML5 User report: ok_id: ${player.id ?? ""}`)}&body=${encodeURIComponent(body)}`, "_blank");
          setPopup(null);
        } }} />
    </SourceDialogLayer>}

    {popup === "settings" && <SourceProfileSettings assets={assets} name={player.name} photo={player.photoUrl} onClose={() => setPopup(null)} />}
    {popup === "frame-locked" && <SourceLockedPopup assets={assets} title={t("dlg:league_locked_gift:title")} desc={t("dlg:profile:frame:unavailable")} onClose={() => setPopup(null)} />}
  </div>, document.body);
}
