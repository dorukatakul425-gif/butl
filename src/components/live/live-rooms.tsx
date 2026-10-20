// "Canlı" lobby: voice-only live rooms in a 2-column photo grid. Room list + who is inside update
// instantly for everyone over the Realtime websocket (presence = members, broadcast = room changes).
// Titles are checked against the az/tr/ru/en banned-word list (client + DB trigger).
import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Camera, Crown, Lock, Search, Users, X, Plus, ChevronLeft, AlertTriangle, Mic } from "lucide-react";
import { usePreferences, type Language } from "@/lib/app-preferences";
import { getSupabase } from "@/lib/supabase";
import { checkProfanity, PROFANITY_WARNING } from "@/lib/profanity";
import { TELEGRAM_NO_PHOTO } from "@/lib/player-photo";
import { VoiceRoom, VR_STYLES } from "./voice-room";

export type VoiceRoomRow = {
  id: string;
  code: number;
  name: string;
  cover: string;
  photo?: string | null;
  locked_seats?: number[] | null;
  has_password?: boolean | null;
  owner_id: string;
  created_at: string;
};
export const ROOM_COVERS = [
  { key: "emerald", emoji: "🌿" },
  { key: "sunset", emoji: "🌅" },
  { key: "night", emoji: "🌙" },
  { key: "rose", emoji: "🌹" },
  { key: "gold", emoji: "👑" },
  { key: "ocean", emoji: "🌊" },
] as const;
export const coverOf = (k: string) => ROOM_COVERS.find((c) => c.key === k) ?? ROOM_COVERS[0];
export type RoomKind = "voice";
const OLD_VIDEO_MARK = "\u2060";
export const roomKind = (_name: string): RoomKind => "voice";
export const roomTitle = (name: string) => name.replaceAll(OLD_VIDEO_MARK, "");
export const withKind = (title: string, _kind: RoomKind = "voice") => roomTitle(title).trim().slice(0, 40);
export const roomPhoto = (r: Pick<VoiceRoomRow, "photo">) => r.photo || TELEGRAM_NO_PHOTO;

type Me = { id: string; name: string; photo: string | null };
type LobbyEntry = { room: string; name: string; photo: string | null };
export const ROOM_COLS = "id,code,name,cover,photo,owner_id,created_at,locked_seats,has_password";
const COLS_MID = "id,code,name,cover,photo,owner_id,created_at";
const COLS_OLD = "id,code,name,cover,owner_id,created_at";

const T: Record<string, Record<Language, string>> = {
  title: { az: "Canlı otaqlar", tr: "Canlı odalar", ru: "Живые комнаты", en: "Live rooms" },
  talking: { az: "nəfər danışır", tr: "kişi konuşuyor", ru: "говорят", en: "talking" },
  create: { az: "Yarat", tr: "Oluştur", ru: "Создать", en: "Create" },
  mine: { az: "Otağım", tr: "Odam", ru: "Моя", en: "My room" },
  search: { az: "Otaq adı və ya ID", tr: "Oda adı veya ID", ru: "Название или ID", en: "Room name or ID" },
  join: { az: "Qoşul", tr: "Katıl", ru: "Войти", en: "Join" },
  empty: { az: "Hələ aktiv otaq yoxdur", tr: "Henüz aktif oda yok", ru: "Пока нет комнат", en: "No live rooms yet" },
  first: { az: "İlk səsli otağı sən yarat!", tr: "İlk sesli odayı sen oluştur!", ru: "Создай первую голосовую комнату!", en: "Start the first voice room!" },
  newRoom: { az: "Səsli otaq yarat", tr: "Sesli oda oluştur", ru: "Создать голосовую комнату", en: "Create voice room" },
  edit: { az: "Otağını aç", tr: "Odanı aç", ru: "Открыть комнату", en: "Open your room" },
  name: { az: "Otaq adı", tr: "Oda adı", ru: "Название", en: "Room name" },
  photo: { az: "Otaq şəkli", tr: "Oda fotoğrafı", ru: "Фото комнаты", en: "Room photo" },
  pick: { az: "Şəkil seç", tr: "Fotoğraf seç", ru: "Выбрать фото", en: "Choose photo" },
  remove: { az: "Sil", tr: "Kaldır", ru: "Удалить", en: "Remove" },
  go: { az: "Yarat və gir", tr: "Oluştur ve gir", ru: "Создать и войти", en: "Create & enter" },
  enter: { az: "Otağa gir", tr: "Odaya gir", ru: "Войти", en: "Enter" },
  busy: { az: "Yaradılır…", tr: "Oluşturuluyor…", ru: "Создаём…", en: "Creating…" },
  notFound: { az: "Bu ID ilə otaq tapılmadı", tr: "Bu ID ile oda bulunamadı", ru: "Комната не найдена", en: "Room not found" },
  voiceOnly: { az: "Yalnız səsli söhbət", tr: "Sadece sesli sohbet", ru: "Только голос", en: "Voice only" },
  pwAsk: { az: "Otaq şifrəsi", tr: "Oda şifresi", ru: "Пароль комнаты", en: "Room password" },
  wrongPw: { az: "Şifrə yanlışdır", tr: "Şifre yanlış", ru: "Неверный пароль", en: "Wrong password" },
  kicked: { az: "Otaq sahibi səni otaqdan çıxarıb. Yenidən girmək olar:", tr: "Oda sahibi seni odadan attı. Tekrar girebilirsin:", ru: "Владелец удалил вас. Снова можно через", en: "The owner removed you. You can rejoin in" },
  min: { az: "dəq sonra", tr: "dk sonra", ru: "мин", en: "min" },
  badImg: { az: "Şəkil yüklənmədi", tr: "Fotoğraf yüklenemedi", ru: "Не удалось загрузить фото", en: "Couldn't load photo" },
};

/** Downscale a picked image to a small JPEG data URL (≤ ~120 KB) for the room cover. */
export async function compressRoomPhoto(file: File, max = 540): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * s);
    c.height = Math.round(img.height * s);
    c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.78);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function LiveRooms({ me, defaultPhoto, onClose }: { me: Me; defaultPhoto: string; onClose: () => void }) {
  const { language } = usePreferences();
  const t = (k: keyof typeof T) => T[k]?.[language] ?? T[k]?.az ?? "";
  const [rooms, setRooms] = useState<VoiceRoomRow[] | null>(null);
  const [owners, setOwners] = useState<Record<string, string>>({});
  const [inside, setInside] = useState<Record<string, LobbyEntry[]>>({});
  const [active, setActive] = useState<VoiceRoomRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState(`${me.name}`.slice(0, 40));
  const [photo, setPhoto] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const lobby = useRef<RealtimeChannel | null>(null);
  const activeRef = useRef<VoiceRoomRow | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  activeRef.current = active;
  const bad = !checkProfanity(name).clean;
  const warning = PROFANITY_WARNING[language] ?? PROFANITY_WARNING.az;

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    let res: { data: unknown[] | null; error: { message: string } | null } = await sb.from("voice_rooms").select(ROOM_COLS).order("created_at", { ascending: false }).limit(60);
    if (res.error) res = await sb.from("voice_rooms").select(COLS_MID).order("created_at", { ascending: false }).limit(60);
    if (res.error) res = await sb.from("voice_rooms").select(COLS_OLD).order("created_at", { ascending: false }).limit(60);
    if (res.error) { setErr(res.error.message); return; }
    const list = (res.data ?? []) as VoiceRoomRow[];
    setRooms(list);
    const ids = Array.from(new Set(list.map((r) => r.owner_id)));
    if (ids.length) {
      const { data } = await sb.from("profiles").select("id,name,username").in("id", ids);
      const map: Record<string, string> = {};
      for (const p of (data ?? []) as Array<{ id: string; name: string | null; username: string | null }>)
        map[p.id] = p.username || p.name || "";
      setOwners(map);
    }
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    void load();
    const ch = sb.channel("vroom-lobby", { config: { presence: { key: me.id } } });
    lobby.current = ch;
    ch.on("presence", { event: "sync" }, () => {
      const map: Record<string, LobbyEntry[]> = {};
      for (const arr of Object.values(ch.presenceState<LobbyEntry>())) {
        const e = arr[arr.length - 1];
        if (e?.room) (map[e.room] ??= []).push(e);
      }
      setInside(map);
    });
    ch.on("broadcast", { event: "rooms" }, () => void load());
    ch.subscribe((s) => {
      if (s === "SUBSCRIBED" && activeRef.current)
        void ch.track({ room: activeRef.current.id, name: me.name, photo: me.photo });
    });
    const tm = window.setInterval(() => void load(), 30000);
    return () => {
      window.clearInterval(tm);
      lobby.current = null;
      void sb.removeChannel(ch);
    };
  }, [load, me.id, me.name, me.photo]);

  const onPresence = useCallback(
    (inRoom: boolean) => {
      const ch = lobby.current;
      if (!ch) return;
      if (inRoom && activeRef.current) void ch.track({ room: activeRef.current.id, name: me.name, photo: me.photo });
      else void ch.untrack();
    },
    [me.name, me.photo],
  );
  const announce = () => void lobby.current?.send({ type: "broadcast", event: "rooms", payload: {} });
  const mine = rooms?.find((r) => r.owner_id === me.id);

  const openCreate = () => {
    if (mine) { setName(roomTitle(mine.name)); setPhoto(mine.photo ?? null); }
    setErr("");
    setCreating(true);
  };

  const create = async () => {
    const sb = getSupabase();
    const title = withKind(name);
    if (!sb || !title) return;
    if (!checkProfanity(title).clean) { setErr(warning); return; }
    setBusy(true);
    setErr("");
    const row = { name: title, photo };
    const res = mine
      ? await sb.from("voice_rooms").update(row).eq("id", mine.id).select(ROOM_COLS).single()
      : await sb.from("voice_rooms").insert({ owner_id: me.id, ...row }).select(ROOM_COLS).single();
    setBusy(false);
    if (res.error) { setErr(/banned_word/.test(res.error.message) ? warning : res.error.message); return; }
    setCreating(false);
    announce();
    await load();
    setActive(res.data as VoiceRoomRow);
  };

  const joinById = async () => {
    const code = Number(query.replace(/\D/g, ""));
    const sb = getSupabase();
    if (!code || !sb) return;
    const { data } = await sb.from("voice_rooms").select(ROOM_COLS).eq("code", code).maybeSingle();
    if (data) void enter(data as VoiceRoomRow);
    else setErr(t("notFound"));
  };

  const [pwFor, setPwFor] = useState<VoiceRoomRow | null>(null);
  const [pw, setPw] = useState("");
  const enter = async (r: VoiceRoomRow, pass?: string) => {
    const sb = getSupabase();
    if (!sb) return;
    setErr("");
    const { data, error } = await sb.rpc("voice_room_enter", { p_room: r.id, p_pass: pass ?? null });
    if (error) { if (!r.has_password) setActive(r); else setErr(error.message); return; }
    const res = String(data ?? "ok");
    if (res === "ok") { setPwFor(null); setPw(""); setActive(r); }
    else if (res === "password") { setPwFor(r); if (pass !== undefined) setErr(t("wrongPw")); }
    else if (res.startsWith("kicked:")) {
      const mins = Math.max(1, Math.ceil((Number(res.slice(7)) * 1000 - Date.now()) / 60000));
      setErr(`${t("kicked")} ${mins} ${t("min")}`);
    } else setErr(t("notFound"));
  };

  const pickPhoto = async (f?: File) => {
    if (!f) return;
    try { setPhoto(await compressRoomPhoto(f)); } catch { setErr(t("badImg")); }
  };

  const shown = (rooms ?? [])
    .filter((r) => !query || roomTitle(r.name).toLowerCase().includes(query.toLowerCase()) || String(r.code).includes(query.replace(/\D/g, "") || "~"))
    .sort((a, b) => (inside[b.id]?.length ?? 0) - (inside[a.id]?.length ?? 0));

  if (active)
    return (
      <VoiceRoom
        room={active}
        me={me}
        ownerName={owners[active.owner_id] || (active.owner_id === me.id ? me.name : "")}
        defaultPhoto={defaultPhoto}
        onPresence={onPresence}
        onLeave={() => { setActive(null); announce(); void load(); }}
      />
    );

  const totalInside = Object.values(inside).reduce((n, a) => n + a.length, 0);
  return (
    <div className="lv" role="dialog" aria-modal="true" aria-label={t("title")}>
      <style>{VR_STYLES}{LV_STYLES}</style>
      <header className="lv-top">
        <button type="button" className="lv-ic" onClick={onClose} aria-label="Back"><ChevronLeft size={22} /></button>
        <div className="lv-title">
          <h2>{t("title")}</h2>
          <p><i />{totalInside} {t("talking")} · {(rooms ?? []).length}</p>
        </div>
        <button type="button" className="lv-new" onClick={openCreate}><Plus size={17} />{mine ? t("mine") : t("create")}</button>
      </header>
      <div className="lv-search">
        <Search size={17} />
        <input value={query} onChange={(e) => { setQuery(e.target.value); setErr(""); }} onKeyDown={(e) => { if (e.key === "Enter") void joinById(); }} placeholder={t("search")} inputMode="search" />
        {/^\d{4,}$/.test(query.trim()) && <button type="button" onClick={() => void joinById()}>{t("join")}</button>}
      </div>
      {err && !creating && <p className="lv-err">{err}</p>}
      <div className="lv-grid">
        {rooms === null
          ? Array.from({ length: 6 }, (_, i) => <div key={i} className="lv-card lv-skel" />)
          : shown.length === 0
            ? (
              <div className="lv-empty">
                <span><Mic size={34} /></span>
                <strong>{t("empty")}</strong>
                <p>{t("first")}</p>
                <button type="button" className="lv-new" onClick={openCreate}><Plus size={17} />{t("create")}</button>
              </div>
            )
            : shown.map((r, i) => {
              const n = inside[r.id]?.length ?? 0;
              return (
                <button key={r.id} type="button" className="lv-card" style={{ animationDelay: `${i * 35}ms` }} onClick={() => void enter(r)}>
                  <span className="lv-cover">
                    <img src={roomPhoto(r)} alt="" loading="lazy" />
                    <span className="lv-live">LIVE</span>
                    {r.has_password && <span className="lv-lock"><Lock size={13} /></span>}
                    <span className={`lv-count${n ? " on" : ""}`}><Users size={13} />{n}</span>
                  </span>
                  <span className="lv-info">
                    <strong>{roomTitle(r.name)}</strong>
                    <span className="lv-owner"><Crown size={14} />@{owners[r.owner_id] ?? ""}</span>
                  </span>
                </button>
              );
            })}
      </div>

      {pwFor && (
        <div className="vr-sheet-wrap" onClick={(e) => { if (e.target === e.currentTarget) { setPwFor(null); setErr(""); } }}>
          <div className="vr-sheet lv-sheet">
            <div className="vr-sheet-head">
              <h3><Lock size={16} /> {roomTitle(pwFor.name)}</h3>
              <button type="button" className="vr-icon" onClick={() => { setPwFor(null); setErr(""); }} aria-label="Close"><X size={18} /></button>
            </div>
            <label className="vr-field">
              {t("pwAsk")}
              <input type="password" value={pw} maxLength={32} autoFocus onChange={(e) => { setPw(e.target.value); setErr(""); }} onKeyDown={(e) => { if (e.key === "Enter" && pw) void enter(pwFor, pw); }} />
            </label>
            {err && <p className="lv-warn" role="alert"><AlertTriangle size={15} />{err}</p>}
            <button type="button" className="vr-primary" disabled={!pw} onClick={() => void enter(pwFor, pw)}>{t("enter")}</button>
          </div>
        </div>
      )}
      {creating && (
        <div className="vr-sheet-wrap" onClick={(e) => { if (e.target === e.currentTarget) setCreating(false); }}>
          <div className="vr-sheet lv-sheet">
            <div className="vr-sheet-head">
              <h3>{mine ? t("edit") : t("newRoom")}</h3>
              <button type="button" className="vr-icon" onClick={() => setCreating(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <button type="button" className="lv-photo" onClick={() => fileRef.current?.click()}>
              <img src={photo || TELEGRAM_NO_PHOTO} alt="" />
              <span className="lv-photo-cta"><Camera size={16} />{t("pick")}</span>
              <span className="lv-photo-live">LIVE</span>
            </button>
            {photo && <button type="button" className="lv-link" onClick={() => setPhoto(null)}>{t("remove")}</button>}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { void pickPhoto(e.target.files?.[0]); e.target.value = ""; }} />
            <label className="vr-field">
              {t("name")}
              <input className={bad ? "lv-bad" : ""} value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} maxLength={40} aria-invalid={bad} />
            </label>
            {(bad || err) && <p className="lv-warn" role="alert"><AlertTriangle size={15} />{bad ? warning : err}</p>}
            <p className="lv-hint"><Mic size={13} />{t("voiceOnly")}</p>
            <button type="button" className="vr-primary" disabled={busy || !name.trim() || bad} onClick={() => void create()}>
              {busy ? t("busy") : mine ? t("enter") : t("go")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const LV_STYLES = `
.lv{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:oklch(.13 .01 260);color:oklch(.97 0 0);font-family:'Manrope',system-ui,sans-serif;padding-top:max(10px,env(safe-area-inset-top));}
.lv *{box-sizing:border-box;}
.lv button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;}
.lv-top{display:flex;align-items:center;gap:12px;padding:6px 16px 12px;}
.lv-ic{all:unset;display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:oklch(1 0 0 / .07);border:1px solid oklch(1 0 0 / .1);}
.lv-title{flex:1;min-width:0}.lv-title h2{margin:0;font-size:22px;font-weight:850;letter-spacing:-.3px;}
.lv-title p{margin:2px 0 0;font-size:11.5px;color:oklch(.75 .01 260);display:flex;align-items:center;gap:6px;}
.lv-title p i{width:7px;height:7px;border-radius:50%;background:oklch(.78 .17 155);animation:vr-pulse 1.6s infinite;}
.lv-new{all:unset;display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 16px;border-radius:20px;font-size:13.5px;font-weight:850;background:oklch(.64 .21 18);color:oklch(1 0 0);box-shadow:0 6px 18px oklch(.6 .2 18 / .4);}
.lv-new:active,.lv-ic:active,.lv-card:active{transform:scale(.96);}
.lv-search{margin:0 16px 12px;display:flex;align-items:center;gap:10px;height:46px;padding:0 6px 0 16px;border-radius:23px;background:oklch(1 0 0 / .06);border:1px solid oklch(1 0 0 / .1);color:oklch(.7 .01 260);}
.lv-search input{all:unset;flex:1;font-size:14.5px;color:oklch(.97 0 0);}
.lv-search button{all:unset;height:34px;padding:0 14px;border-radius:17px;font-size:12.5px;font-weight:850;background:oklch(.64 .21 18);color:oklch(1 0 0);}
.lv-err{margin:0 16px 10px;font-size:12.5px;color:oklch(.75 .17 25);}
.lv-grid{flex:1;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:14px;align-content:start;padding:0 14px calc(24px + env(safe-area-inset-bottom));overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}
.lv-card{all:unset;display:flex;flex-direction:column;border-radius:22px;overflow:hidden;background:oklch(.16 .01 260);border:1.5px solid oklch(1 0 0 / .09);box-shadow:0 10px 26px oklch(0 0 0 / .35);animation:lv-in .4s cubic-bezier(.2,.9,.3,1) both;transition:transform .15s;}
.lv-skel{aspect-ratio:.82;animation:lv-sh 1.2s ease-in-out infinite alternate;}
.lv-cover{position:relative;display:block;aspect-ratio:1/1;background:oklch(.22 .01 260);}
.lv-cover img{width:100%;height:100%;object-fit:cover;display:block;}
.lv-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(oklch(0 0 0 / .1),transparent 40%,oklch(.16 .01 260 / .95));}
.lv-live{position:absolute;z-index:1;top:10px;left:10px;padding:4px 11px;border-radius:12px;font-size:11px;font-weight:900;letter-spacing:.08em;background:oklch(.64 .21 18);color:oklch(1 0 0);box-shadow:0 3px 10px oklch(.5 .2 18 / .5);}
.lv-lock{position:absolute;z-index:1;top:38px;left:10px;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:oklch(.12 .01 260 / .85);color:oklch(.85 .14 75);}
.lv-count{position:absolute;z-index:1;top:10px;right:10px;display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:12px;font-size:12px;font-weight:850;font-family:ui-monospace,monospace;background:oklch(.12 .01 260 / .85);border:1px solid oklch(1 0 0 / .08);color:oklch(.95 0 0);}
.lv-count svg{color:oklch(.8 .01 260)}.lv-count.on svg{color:oklch(.78 .17 155)}
.lv-info{display:flex;flex-direction:column;gap:6px;padding:10px 14px 14px;min-width:0;}
.lv-info strong{font-size:16px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lv-owner{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:800;color:oklch(.8 .14 75);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lv-owner svg{flex-shrink:0;fill:currentColor;}
.lv-empty{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:60px 20px;color:oklch(.72 .01 260);}
.lv-empty>span{display:grid;place-items:center;width:80px;height:80px;border-radius:50%;background:oklch(1 0 0 / .06);color:oklch(.95 0 0);margin-bottom:6px;}
.lv-empty strong{color:oklch(.97 0 0);font-size:16px}.lv-empty p{margin:0 0 8px;font-size:13px;}
.lv-sheet{gap:10px;}
.lv-photo{all:unset;position:relative;display:block;width:150px;aspect-ratio:1;margin:0 auto;border-radius:22px;overflow:hidden;border:1.5px solid oklch(1 0 0 / .15);}
.lv-photo img{width:100%;height:100%;object-fit:cover;display:block;}
.lv-photo-cta{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;font-size:12px;font-weight:800;background:oklch(0 0 0 / .55);color:oklch(1 0 0);}
.lv-photo-live{position:absolute;top:8px;left:8px;padding:3px 9px;border-radius:10px;font-size:10px;font-weight:900;letter-spacing:.08em;background:oklch(.64 .21 18);color:oklch(1 0 0);}
.lv-link{all:unset;cursor:pointer;align-self:center;font-size:12px;font-weight:800;color:oklch(.75 .17 25);}
.lv-bad{border-color:oklch(.65 .22 25) !important;box-shadow:0 0 0 3px oklch(.65 .22 25 / .25);}
.lv-warn{display:flex;align-items:flex-start;gap:8px;margin:0;padding:10px 12px;border-radius:14px;font-size:12.5px;font-weight:700;line-height:1.35;background:oklch(.65 .22 25 / .15);color:oklch(.85 .1 25);border:1px solid oklch(.65 .22 25 / .4);animation:lv-shake .35s;}
.lv-warn svg{flex-shrink:0;margin-top:1px}
.lv-hint{display:flex;align-items:center;gap:6px;margin:0;font-size:11.5px;color:oklch(.75 .01 260);}
@keyframes lv-in{from{transform:translateY(14px);opacity:0}}
@keyframes lv-sh{from{opacity:.4}to{opacity:.85}}
@keyframes lv-shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@media(prefers-reduced-motion:reduce){.lv-card{animation:none}}
`;
