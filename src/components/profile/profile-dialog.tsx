import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { setUserBlocked, useBlockedUsers } from "@/lib/block-session";
import { SourceAchievementsDialog } from "@/components/table/source-achievements-dialog";
import { SourceKickoutDialog } from './source-kickout-dialog';
import { Button } from '@/components/ui/button';
import type React from "react";
import { createPortal } from "react-dom";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import type { SeatPlayer } from "@/components/table/table-seats";
import { useSourceFeatureSession } from "@/lib/source-feature-session";
import { SourceProfileSettings } from "@/components/profile/source-own-profile";
import { SourceDialogLayer, SourceInfoDialog, SourceButtons, showSourceToast, OPEN_BANK_EVENT } from "@/components/source-dialogs";
import { formatHarem, formatStats, leagueCupImage, okProfileUrl, splitStatusEmoji, OPEN_LEAGUE_EVENT, type ServerUserProfile } from "@/lib/user-profile";
import { OK_SUPPORT_EMAIL as SUPPORT_EMAIL, CLIENT_VERSION } from "@/components/settings/settings-items";

const Div = (p: React.HTMLAttributes<HTMLDivElement>) => <div role={p.onClick ? "button" : undefined} {...p} />;

/** Port of StatusJSX: long statuses collapse to two 16px rows and expand on tap; emoji get their own span. */
function SourceStatus({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const initRows = useRef(0);
  const update = () => {
    const el = ref.current; if (!el) return;
    const lineHeight = 16, narrowedRows = 2;
    const currentRows = Math.floor(el.clientHeight / lineHeight);
    if (currentRows < narrowedRows) return;
    if (initRows.current < currentRows) initRows.current = currentRows;
    const toNarrow = currentRows !== narrowedRows;
    el.classList.toggle("user-profile__status--narrowed", toNarrow);
    el.classList.toggle("user-profile__status--pointer", initRows.current > narrowedRows);
    el.style.height = `${lineHeight * (toNarrow ? narrowedRows : initRows.current)}px`;
  };
  useLayoutEffect(update, []);
  return <>
    <div ref={ref} className="user-profile__status" onClick={update}>
      {splitStatusEmoji(text).map((part, i) => part.emoji ? <span key={i} className="user-profile__status-emoji">{part.text}</span> : part.text)}
    </div>
    <div className="user-profile__stats-border" />
  </>;
}

/** Port of UserProfileDialog + UserProfilePresenter (OK.ru client 1.6.393). */
export function ProfileDialog({ player, self, assets, onClose, onGift, onDecor, onMusic, profile: profileProp = null }: {
  player: SeatPlayer; self: boolean; assets: CilizAssets; onClose: () => void;
  onGift: () => void; onDecor: () => void; onMusic: () => void;
  /** queryUserProfile result; null until the game session adapter provides it. */
  profile?: ServerUserProfile | null;
}) {
  const t = (key: string, ...a: string[]) => translate(assets, key, ...a);
  const [statsState, setStatsState] = useState<"narrowed" | "expanded">("narrowed");
  const [popup, setPopup] = useState<"settings" | "claims" | "report-photo" | "report-user" | "achievements" | "kickout" | null>(null);
  const [loaded, setLoaded] = useState<ServerUserProfile | null>(null);
  const profile = profileProp ?? loaded;
  const sectionRef = useRef<HTMLElement>(null);
  const [infoSize, setInfoSize] = useState(0);
  const [report, setReport] = useState("");
  const feature = useSourceFeatureSession();
  const blockedUsers = useBlockedUsers();
  const blocked = Boolean(player.id && blockedUsers.has(player.id));
  const [blocking, setBlocking] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const tooltipTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(tooltipTimer.current), []);
  // Source onTooltip: the hint stays visible for 3 seconds.
  const showTooltip = (text: string) => {
    if (!text) return;
    window.clearTimeout(tooltipTimer.current);
    setTooltip(text);
    tooltipTimer.current = window.setTimeout(() => setTooltip(null), 3000);
  };
  const stats = profile ? formatStats(profile) : null;
  const userId = self ? feature.viewerId ?? undefined : player.id;
  const harem = formatHarem(self, userId ?? "", profile);
  const socialHref = okProfileUrl(userId);
  // Source useResizeSensor: the photo is a square of min(popup width, popup height).
  useLayoutEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const measure = () => {
      const portrait = window.innerHeight >= window.innerWidth;
      const maxH = Math.round(window.innerHeight * 0.94) - 140;
      setInfoSize(Math.max(0, Math.floor(portrait ? Math.min(el.clientWidth, maxH) : Math.min(window.innerHeight * 0.8, 400))));
    };
    measure();
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure); ro?.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro?.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  // queryUserProfile: server-counted stats, refreshed while the dialog is open.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !userId || profileProp) return;
    let alive = true;
    const load = async () => {
      const { data, error } = await sb.rpc("user_profile_stats", { p_user: userId });
      if (!alive || error || !data) return;
      const raw = data as unknown as ServerUserProfile & { owner?: { id: string; name: string; male: boolean; photo_url: string | null } | null };
      const o = raw.owner;
      const owner = o ? { id: o.id, name: o.name, male: o.male, photoUrl: o.photo_url || player.photoUrl, color: o.male ? "3b7dd8" : "e0458c", viewer: o.id === feature.viewerId } : undefined;
      setLoaded({ ...raw, ...(owner ? { owner } : { owner: undefined }) } as ServerUserProfile);
    };
    void load();
    loadRef.current = load;
    // Live: any change to this player's profile (purchase, kisses) refreshes at once.
    const ch = sb.channel(`profile-${userId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` }, () => void load())
      .subscribe();
    const timer = window.setInterval(() => void load(), 5000);
    return () => { alive = false; window.clearInterval(timer); void sb.removeChannel(ch); };
  }, [userId, profileProp]);

  const loadRef = useRef<() => Promise<void>>(async () => {});
  const [buying, setBuying] = useState(false);
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
  const cupName = leagueCupImage(profile, assets.leagues);
  const cup = cupName && assets.images?.[cupName] ? dialogImage(assets, cupName, 46, 48).src : "";
  const onCup = () => { onClose(); window.dispatchEvent(new CustomEvent(OPEN_LEAGUE_EVENT, { detail: { userId, level: profile?.league ?? 0 } })); };
  const big = Boolean(stats && profile?.total_kisses && profile?.dj_score && profile?.gestures);

  const onSendMessage = () => {
    if (self) { showSourceToast(t("warning:self_chat:desc")); return; }
    if (!player.id) { noServer(); return; }
    window.dispatchEvent(new CustomEvent("game-reply-to", { detail: { id: player.id, name: player.name, photoUrl: player.photoUrl, male: player.male } }));
    onClose();
  };
  const onHarem = () => {
    if (self && harem.noOwner) { showSourceToast(t("dlg:profile:harem:tooltip")); return; }
    if (harem.owner?.viewer) { showSourceToast(t("dlg:profile:harem:purchased", player.name)); return; }
    const sb = getSupabase();
    if (!sb || !userId || buying) { if (!userId) noServer(); return; }
    setBuying(true);
    void sb.rpc("harem_purchase", { p_target: userId }).then(({ error }) => {
      setBuying(false);
      if (error) {
        if (error.message.includes("not_enough_gold")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
        else showSourceToast("Satın alınamadı.");
        return;
      }
      showSourceToast(t("dlg:profile:harem:purchased", player.name));
      void loadRef.current();
    });
  };
  const onBlock = () => {
    if (!player.id || self || blocking) return;
    setBlocking(true);
    void setUserBlocked(player.id, !blocked)
      .then(() => showSourceToast(t(blocked ? "dlg:unblock:title" : "dlg:block:title")))
      .catch(() => showSourceToast("İşlem yapılamadı."))
      .finally(() => setBlocking(false));
  };

  return createPortal(<div className="profile-layer portrait">
    <div className="popup-shade" onClick={onClose} />
    <section ref={sectionRef} role="dialog" aria-modal="true" aria-label={player.name} className="popup popup--center popup--show user-profile__x_popup">
      <Div className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></Div>
      <div className="user-profile">
        <div className="user-profile__info" style={infoSize ? { width: `${infoSize}px`, height: `${infoSize}px` } : undefined}>
          <Div className="user-profile__photos" aria-label={self ? t("dlg:profile_info:title") : undefined} onClick={self ? () => setPopup("settings") : undefined}>
            <div className="user-profile__swiper">
              <div className="user-profile__photo" role="img" aria-label={player.name} style={{ backgroundImage: `url('${player.photoUrl}')` }} />
            </div>
          </Div>
          <div className="user-profile__shadow" />
          <div className="user-profile__title">
            <div className="user-profile__name">{player.name}{player.age ? `, ${player.age}` : ""}</div>
            {player.city && <div className="user-profile__city">{player.city}</div>}
          </div>
          {player.zodiac !== undefined && <Div className={`user-profile__zodiac user-profile__zodiac--${player.zodiac}`} onClick={() => showTooltip(t(`hint:zodiac:${player.zodiac}`))} />}
          <div className="user-profile__tooltip" style={{ display: tooltip ? "block" : "none" }}>{tooltip}</div>
          {self && <Div className="user-profile__decor" aria-label="Süsleme" onClick={onDecor} />}
          {!self && <Div className="user-profile__claim" aria-label="Şikayet" onClick={() => setPopup("claims")} />}
        </div>
        <div className="user-profile__details">
          <div className="user-profile__scrollable">
            {profile?.status && infoSize > 0 && <SourceStatus text={profile.status} />}
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
              {cup && <img src={cup} width={46} height={48} alt={t("dlg:league:title")} role="button" className="user-profile__league" onClick={onCup} />}
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
                  {!!harem.priceRank && <div className="user-profile__stats-item-subtitle">{harem.priceRank} {t("dlg:profile:rank")}</div>}
                </div>
                <Div className={`button button--confirm user-profile__x_button${harem.btnIsDisabled ? " button--disabled" : ""}`} onClick={onHarem}>{t(harem.btnKey)}</Div>
              </div>
            </div>
          </div>
          <div className="user-profile__actions user-profile__actions--justify">
            <Button variant="ghost" className={`user-profile__action user-profile__action--kickout-${feature.kickout?.targets[player.id ?? '']?.kickAt ? 'save' : self ? 'self' : 'kick'}`} aria-label={t('kickout:header')} title={t('kickout:header')} onClick={() => setPopup('kickout')} />
            {socialHref
              ? <a className="user-profile__action user-profile__action--ok" href={socialHref} target="_blank" rel="noreferrer" aria-label="DAT" />
              : <div className="user-profile__action user-profile__action--ok user-profile__action--disabled" aria-label="DAT" />}
            {self
              ? <Div className="user-profile__action user-profile__action--music" aria-label="Müzik" onClick={onMusic} />
              : <Div className="user-profile__action user-profile__action--gift" aria-label="Hediye" onClick={onGift} />}
            <Div className="user-profile__action user-profile__action--achievements" aria-label="Başarılar" onClick={() => { if (userId) setPopup("achievements"); else noServer(); }} />
            <Div className="user-profile__action user-profile__action--message" aria-label="Mesaj" onClick={onSendMessage} />
          </div>
        </div>
      </div>
    </section>

    {popup === "claims" && createPortal(<div className="source-feature-layer">
      <div className="popup-shade" onClick={() => setPopup(null)} />
      <section role="dialog" aria-modal="true" className="popup popup--center popup--show message-actions__x_popup">
        {[
          { key: blocked ? "dlg:unblock:title" : "dlg:block:title", icon: "ignore", action: () => { setPopup(null); onBlock(); } },
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

    {popup === "achievements" && userId && <SourceAchievementsDialog male={player.male} user={self ? undefined : { id: userId, name: player.name, male: player.male }} onClose={() => setPopup(null)} />}

    {popup === "settings" && <SourceProfileSettings assets={assets} name={player.name} photo={player.photoUrl} onClose={() => setPopup(null)} />}
    {popup === 'kickout' && <SourceKickoutDialog player={player} self={self} assets={assets} onClose={() => setPopup(null)} onConfirmed={onClose} />}
  </div>, document.body);
}
