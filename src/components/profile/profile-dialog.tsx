import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import { activityText } from "@/lib/top-level-activity";
import { useViewerProgress } from "@/lib/viewer-progress";
import { useRoom } from "@/lib/room-session";
import { profileIsAtTable } from "@/lib/telegram-profile";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { loadProfileBio } from "@/lib/profile-social";
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
import { profileRibbon, formatHarem, formatStats, splitStatusEmoji, type ServerUserProfile } from "@/lib/user-profile";
import { reportPlayer } from "@/lib/game-reports";

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
  useLayoutEffect(() => {
    initRows.current = 0;
    const el = ref.current;
    if (el) {
      el.style.height = "";
      el.classList.remove("user-profile__status--narrowed", "user-profile__status--pointer");
    }
    update();
  }, [text]);
  return <>
    <div ref={ref} className="user-profile__status" onClick={update}>
      {splitStatusEmoji(text).map((part, i) => part.emoji ? <span key={i} className="user-profile__status-emoji">{part.text}</span> : part.text)}
    </div>
    <div className="user-profile__stats-border" />
  </>;
}

/** Port of UserProfileDialog + UserProfilePresenter (Telegram client 1.6.393). */
export function ProfileDialog({ player, self, assets, onClose, onGift, onDecor, onMusic, profile: profileProp = null }: {
  player: SeatPlayer; self: boolean; assets: CilizAssets; onClose: () => void;
  onGift: () => void; onDecor: () => void; onMusic: () => void;
  /** queryUserProfile result; null until the game session adapter provides it. */
  profile?: ServerUserProfile | null;
}) {
  const t = (key: string, ...a: string[]) => translate(assets, key, ...a);
  const viewerVip = useViewerProgress().vip;
  const [vipNow, setVipNow] = useState(() => Date.now());
  useEffect(() => {
    if (self || !player.vipUntil || player.vipUntil <= Date.now()) return;
    const id = window.setTimeout(() => setVipNow(Date.now()), Math.min(player.vipUntil - Date.now() + 50, 2 ** 31 - 1));
    return () => window.clearTimeout(id);
  }, [self, player.vipUntil, vipNow]);
  const vipLabel = self ? viewerVip : Boolean(player.vipUntil && player.vipUntil > vipNow);
  const [leagueTop, setLeagueTop] = useState(false);
  const ribbon = profileRibbon(leagueTop, vipLabel);
  const [statsState, setStatsState] = useState<"narrowed" | "expanded">("narrowed");
  const [popup, setPopup] = useState<"settings" | "claims" | "report-photo" | "report-user" | "block" | "achievements" | "kickout" | null>(null);
  const [loaded, setLoaded] = useState<ServerUserProfile | null>(null);
  const profile = profileProp ?? loaded;
  const sectionRef = useRef<HTMLElement>(null);
  const [infoSize, setInfoSize] = useState(0);
  const [portrait, setPortrait] = useState(true);
  const [report, setReport] = useState("");
  const feature = useSourceFeatureSession();
  const room = useRoom();
  const atTable = profileIsAtTable(player.id, room.players);
  const stone = player.stone && assets.stones[player.stone] ? dialogImage(assets, assets.stones[player.stone]!.image, 15, 15) : null;
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
  useEffect(() => {
    const sb = getSupabase();
    setLeagueTop(false);
    if (!sb || !userId) return;
    let alive = true, revision = 0;
    const load = async () => {
      const r = ++revision;
      const { data, error } = await sb.rpc("profile_league_top", { p_user: userId });
      if (alive && r === revision && !error) setLeagueTop(data === true);
    };
    void load();
    const ch = sb.channel(`profile-top-${userId}-${Math.random()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "league_members" }, () => void load())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "league_rounds" }, () => void load()).subscribe();
    const timer = window.setInterval(() => void load(), 5000);
    return () => { alive = false; window.clearInterval(timer); void sb.removeChannel(ch); };
  }, [userId]);
  const [ranking, setRanking] = useState<{ userId: string; level: number; level_rank: number; activity_minutes: number; activity_rank: number } | null>(null);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !userId) return;
    let alive = true, revision = 0;
    const load = async () => {
      const current = ++revision;
      const { data, error } = await sb.rpc("player_level_activity", { p_user: userId });
      if (alive && current === revision && !error && data) setRanking({ ...data, userId });
    };
    void load();
    const timer = window.setInterval(() => void load(), 5000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [userId]);
  const ranks = ranking?.userId === userId ? ranking : null;
  const [heartSenders, setHeartSenders] = useState<{ userId: string; rows: { id: string; name: string; photo_url: string | null }[] } | null>(null);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !userId) return;
    let alive = true, revision = 0;
    const load = async () => {
      const current = ++revision;
      const { data, error } = await sb.rpc("player_heart_senders", { p_user: userId });
      if (alive && current === revision && !error) setHeartSenders({ userId, rows: data ?? [] });
    };
    void load();
    const timer = window.setInterval(() => void load(), 10000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [userId]);
  const [savedBio, setSavedBio] = useState<{ userId: string; value: string | null } | null>(null);
  const bio = savedBio && savedBio.userId === userId ? savedBio.value : profile?.status;
  // Bio belongs to the home profile, not the statistics adapter. Read even when stats are supplied.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !userId) return;
    let alive = true;
    let revision = 0;
    const load = async () => {
      const current = ++revision;
      const value = await loadProfileBio(userId);
      if (alive && current === revision && value !== undefined) setSavedBio({ userId, value });
    };
    void load();
    const ch = sb.channel(`profile-bio-${userId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` }, () => void load())
      .subscribe();
    const timer = window.setInterval(() => void load(), 5000);
    return () => { alive = false; window.clearInterval(timer); void sb.removeChannel(ch); };
  }, [userId]);
  const harem = formatHarem(self, userId ?? "", profile);
  // Source useResizeSensor: the photo is a square of min(popup width, popup height).
  useLayoutEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const measure = () => {
      const isPortrait = window.innerHeight >= window.innerWidth;
      setPortrait(isPortrait);
      // Original useResizeSensor: photo square is min(popup width, popup height).
      setInfoSize(Math.max(0, Math.floor(Math.min(el.clientWidth, el.clientHeight || window.innerHeight * 0.94))));
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
  const big = Boolean(stats && profile?.total_kisses && profile?.dj_score && profile?.gestures);

  const onSendMessage = () => {
    if (self) { showSourceToast(t("warning:self_chat:desc")); return; }
    if (!atTable) { showSourceToast(t("warning:offline_chat:desc")); return; }
    if (!player.id) { noServer(); return; }
    window.dispatchEvent(new CustomEvent("game-reply-to", { detail: { id: player.id, name: player.name, photoUrl: player.photoUrl, male: player.male, private: true } }));
    onClose();
  };
  const onSendGift = () => {
    if (!atTable) { showSourceToast(t("warning:offline_gift:desc")); return; }
    onGift();
  };
  const onKickout = () => {
    if (!atTable) { showSourceToast(t("dlg:profile:toast1")); return; }
    setPopup("kickout");
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
  const sendReport = async (kind: "photo" | "user", text: string) => {
    if (!player.id || self) return;
    const result = await reportPlayer(player.id, kind, text);
    showSourceToast(result === "error" ? "Şikayet gönderilemedi." : t("dlg:report_photo:toast"));
  };
  const onBlock = () => {
    if (!player.id || self || blocking) return;
    setBlocking(true);
    void setUserBlocked(player.id, !blocked)
      .then(() => showSourceToast(t(blocked ? "hint:icon:unblock" : "hint:icon:block")))
      .catch(() => showSourceToast("İşlem yapılamadı."))
      .finally(() => setBlocking(false));
  };

  return createPortal(<div className={`profile-layer ${portrait ? 'portrait' : 'landscape'}`}>
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
            {stone ? <div className="user-profile__decored-name">
              <img className="user-profile__stone" src={stone.src} width={stone.width} height={stone.height} alt="" />
              <div className="user-profile__name">{player.name}{player.age ? `, ${player.age}` : ""}</div>
              <img className="user-profile__stone" src={stone.src} width={stone.width} height={stone.height} alt="" />
            </div> : <div className="user-profile__name">{player.name}{player.age ? `, ${player.age}` : ""}</div>}
            {player.city && <div className="user-profile__city">{player.city}</div>}
          </div>
          {player.zodiac !== undefined && <Div className={`user-profile__zodiac user-profile__zodiac--${player.zodiac}`} onClick={() => showTooltip(t(`hint:zodiac:${player.zodiac}`))} />}
          <div className="user-profile__tooltip" style={{ display: tooltip ? "block" : "none" }}>{tooltip}</div>
          {self && <Div className="user-profile__decor" aria-label="Süsleme" onClick={onDecor} />}
          {!self && <Div className="user-profile__claim" aria-label="Şikayet" onClick={() => setPopup("claims")} />}
        </div>
        <div className="user-profile__details">
          <div className="user-profile__scrollable">
            {bio && infoSize > 0 && <SourceStatus text={bio} />}
            <div className={`user-profile__stats${big ? " user-profile__stats--big" : ""}`}>
              <div className="user-profile__counters">
                {statItem("kiss", stats?.totalKisses, stats?.totalKissesRank)}
                {statItem("dj", stats?.djScore, stats?.djRank)}
                <div className={`user-profile__hidden-stats-items user-profile__hidden-stats-items--${statsState}`}>
                  {statItem("price", stats?.price, stats?.priceRank)}
                  {statItem("harem-price", stats?.haremPrice, stats?.haremPriceRank)}
                  {statItem("glv", ranks ? String(ranks.level) : undefined, ranks?.level_rank ? ranks.level_rank.toLocaleString("tr-TR") : undefined)}
                  {statItem("activity", ranks ? activityText(ranks.activity_minutes, true) : undefined, ranks?.activity_rank && ranks.activity_rank < 5000 ? ranks.activity_rank.toLocaleString("tr-TR") : undefined)}
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
            {heartSenders && heartSenders.userId === userId && <section aria-label="Hədiyyə göndərənlər" style={{ padding: "8px 12px" }}>
              <div style={{ fontSize: 12, marginBottom: 6 }}>Ürək / hədiyyə göndərənlər</div>
              <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                {heartSenders.rows.length === 0 && <span style={{ fontSize: 12 }}>Hələ hədiyyə göndərən yoxdur</span>}
                {heartSenders.rows.map(sender => <button key={sender.id} type="button" title={sender.name} aria-label={`${sender.name} — profili aç`}
                  style={{ flex: "0 0 32px", padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
                  onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("source:open-profile", { detail: sender.id })); }}>
                  <img src={sender.photo_url || DEFAULT_PHOTO} alt={sender.name} width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover" }} />
                </button>)}
              </div>
            </section>}
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
            <Button variant="ghost" className={`user-profile__action user-profile__action--kickout-${feature.kickout?.targets[player.id ?? '']?.kickAt ? 'save' : self ? 'self' : 'kick'}${atTable ? '' : ' user-profile__action--greyscaled'}`} aria-label={t('kickout:header')} title={t('kickout:header')} onClick={onKickout} />
            {/* Telegram build (TGSocial) has no getProfileUrl, so no social profile button is rendered. */}
            {self
              ? <Div className="user-profile__action user-profile__action--music" aria-label="Müzik" onClick={onMusic} />
              : <Button variant="ghost" className={`user-profile__action user-profile__action--gift${atTable ? '' : ' user-profile__action--greyscaled'}`} aria-label="Hediye" onClick={onSendGift} />}
            <Div className="user-profile__action user-profile__action--achievements" aria-label="Başarılar" onClick={() => { if (userId) setPopup("achievements"); else noServer(); }} />
            <Button variant="ghost" className={`user-profile__action user-profile__action--message${atTable && !self ? '' : ' user-profile__action--greyscaled'}`} aria-label="Mesaj" onClick={onSendMessage} />
          </div>
        </div>
      </div>
      {/* UserProfileDialog: label = user.detail.top ? 'top' : user.isVip ? 'vip' : '' (top-left ribbon). */}
      {ribbon && <div aria-label={ribbon.toUpperCase()} className={`user-profile__label user-profile__label--${ribbon}`} />}
    </section>

    {popup === "claims" && createPortal(<div className="source-feature-layer">
      <div className="popup-shade" onClick={() => setPopup(null)} />
      <section role="dialog" aria-modal="true" className="popup popup--center popup--show message-actions__x_popup">
        {[
          { key: blocked ? "dlg:unblock:title" : "dlg:block:title", icon: "ignore", action: () => setPopup("block") },
          { key: "hint:report_photo", icon: "adult", action: () => setPopup("report-photo") },
          { key: "dlg:report_user:title", icon: "report", action: () => setPopup("report-user") },
        ].map(i => <div key={i.key} role="button" className="settings__item settings__item--selectable" onClick={i.action}><div className={`settings__icon settings__icon--${i.icon}`} />{t(i.key)}</div>)}
      </section>
    </div>, document.body)}

    {popup === "block" && <SourceInfoDialog hasClose title={t(blocked ? "dlg:unblock:title" : "dlg:block:title")} context={t(blocked ? "dlg:unblock:desc" : "dlg:block:desc", player.name)} onClose={() => setPopup(null)}
      confirm={{ title: t(blocked ? "dlg:unblock:ok" : "dlg:block:block"), onClick: () => { setPopup(null); onBlock(); } }}
      cancel={{ title: t(blocked ? "dlg:unblock:cancel" : "dlg:block:cancel"), onClick: () => setPopup(null) }} />}

    {popup === "report-photo" && <SourceInfoDialog hasClose title={t("dlg:report_photo:title")} context={t("dlg:report_photo:desc")} onClose={() => setPopup(null)}
      confirm={{ title: t("dlg:report_photo:ok"), onClick: () => { setPopup(null); void sendReport("photo", ""); } }}
      cancel={{ title: t("dlg:report_photo:cancel"), onClick: () => setPopup(null) }} />}

    {popup === "report-user" && <SourceDialogLayer title={t("dlg:report_user:title")} onClose={() => setPopup(null)} onShade={() => setPopup(null)}>
      <div className="popup__content"><div className="report">
        <textarea rows={5} maxLength={1000} placeholder={t("dlg:report_user:hint")} onInput={e => setReport((e.target as HTMLTextAreaElement).value.trim())} />
      </div></div>
      <SourceButtons cancel={{ title: t("dlg:report_user:cancel"), onClick: () => setPopup(null) }}
        confirm={{ title: t("dlg:report_user:send"), onClick: () => {
          if (!report) return;
          setPopup(null); void sendReport("user", report); setReport("");
        } }} />
    </SourceDialogLayer>}

    {popup === "achievements" && userId && <SourceAchievementsDialog male={player.male} user={self ? undefined : { id: userId, name: player.name, male: player.male }} onClose={() => setPopup(null)} />}

    {popup === "settings" && <SourceProfileSettings assets={assets} name={player.name} photo={player.photoUrl} onClose={() => setPopup(null)} />}
    {popup === 'kickout' && <SourceKickoutDialog player={player} self={self} assets={assets} onClose={() => setPopup(null)} onConfirmed={onClose} />}
  </div>, document.body);
}
