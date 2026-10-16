import { translate, usePreferences } from "@/lib/app-preferences";
// "Canlı" lobby: active voice/video rooms with live member counts (Realtime presence),
// room creation and join-by-ID. Opening a room mounts the full-screen VoiceRoom.
import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { ArrowLeft, Plus, Search, Users, Mic, Video, LoaderCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { VoiceRoom, VR_STYLES } from "./voice-room";

export type VoiceRoomRow = {
  id: string;
  code: number;
  name: string;
  cover: string;
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
// Room kind is carried by an invisible trailing marker in the name, so no schema change is needed
// (works on Lovable Cloud and the VPS database as-is).
export type RoomKind = "voice" | "video";
const VIDEO_MARK = "\u2060";
export const roomKind = (name: string): RoomKind => (name.endsWith(VIDEO_MARK) ? "video" : "voice");
export const roomTitle = (name: string) => name.replaceAll(VIDEO_MARK, "");
export const withKind = (title: string, kind: RoomKind) =>
  kind === "video" ? `${roomTitle(title).slice(0, 39)}${VIDEO_MARK}` : roomTitle(title).slice(0, 40);

type Me = { id: string; name: string; photo: string | null };
type LobbyEntry = { room: string; name: string; photo: string | null };
const COLS = "id,code,name,cover,owner_id,created_at";

export function LiveRooms({
  me,
  defaultPhoto,
  onClose,
}: {
  me: Me;
  defaultPhoto: string;
  onClose: () => void;
}) {
  usePreferences();
  const [rooms, setRooms] = useState<VoiceRoomRow[] | null>(null);
  const [inside, setInside] = useState<Record<string, LobbyEntry[]>>({});
  const [active, setActive] = useState<VoiceRoomRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState(`${me.name} otağı`.slice(0, 40));
  const [cover, setCover] = useState<string>("emerald");
  const [kind, setKind] = useState<RoomKind>("voice");
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const lobby = useRef<RealtimeChannel | null>(null);
  const activeRef = useRef<VoiceRoomRow | null>(null);
  activeRef.current = active;

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data, error } = await sb
      .from("voice_rooms")
      .select(COLS)
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) setErr(error.message);
    else setRooms(data as VoiceRoomRow[]);
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
    const t = window.setInterval(() => void load(), 20000);
    return () => {
      window.clearInterval(t);
      lobby.current = null;
      void sb.removeChannel(ch);
    };
  }, [load, me.id, me.name, me.photo]);

  const onPresence = useCallback(
    (inRoom: boolean) => {
      const ch = lobby.current;
      if (!ch) return;
      if (inRoom && activeRef.current)
        void ch.track({ room: activeRef.current.id, name: me.name, photo: me.photo });
      else void ch.untrack();
    },
    [me.name, me.photo],
  );

  const announce = () =>
    void lobby.current?.send({ type: "broadcast", event: "rooms", payload: {} });

  const create = async () => {
    const sb = getSupabase();
    if (!sb || !name.trim()) return;
    setBusy(true);
    setErr("");
    const mine = rooms?.find((r) => r.owner_id === me.id);
    const res = mine
      ? await sb
          .from("voice_rooms")
          .update({ name: withKind(name.trim(), kind), cover })
          .eq("id", mine.id)
          .select(COLS)
          .single()
      : await sb
          .from("voice_rooms")
          .insert({ owner_id: me.id, name: withKind(name.trim(), kind), cover })
          .select(COLS)
          .single();
    setBusy(false);
    if (res.error) {
      setErr(res.error.message);
      return;
    }
    setCreating(false);
    announce();
    await load();
    setActive(res.data as VoiceRoomRow);
  };

  const joinById = async () => {
    const code = Number(query.replace(/\D/g, ""));
    if (!code) return;
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.from("voice_rooms").select(COLS).eq("code", code).maybeSingle();
    if (data) setActive(data as VoiceRoomRow);
    else setErr(translate("Bu ID ilə otaq tapılmadı"));
  };

  const list = (rooms ?? [])
    .filter(
      (r) =>
        !query ||
        roomTitle(r.name).toLowerCase().includes(query.toLowerCase()) ||
        String(r.code).includes(query.replace(/\D/g, "") || "~"),
    )
    .sort((a, b) => (inside[b.id]?.length ?? 0) - (inside[a.id]?.length ?? 0));
  const mine = rooms?.find((r) => r.owner_id === me.id);

  if (active)
    return (
      <VoiceRoom
        room={active}
        me={me}
        defaultPhoto={defaultPhoto}
        onPresence={onPresence}
        onLeave={() => {
          setActive(null);
          announce();
          void load();
        }}
      />
    );

  return (
    <div className="lr vr" role="dialog" aria-modal="true" aria-label={translate("Canlı otaqlar")}>
      <style>
        {VR_STYLES}
        {LR_STYLES}
      </style>
      <header className="lr-top">
        <button type="button" className="vr-icon" onClick={onClose} aria-label={translate("Geri")}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2>{translate("Canlı otaqlar")}</h2>
          <p>
            <i />
            {Object.values(inside).reduce((n, a) => n + a.length, 0)} {translate("nəfər danışır")}</p>
        </div>
        <button type="button" className="lr-new" onClick={() => {
            if (mine) {
              setKind(roomKind(mine.name));
              setName(roomTitle(mine.name));
              setCover(mine.cover);
            }
            setCreating(true);
          }}>
          <Plus size={16} />
          {mine ? translate("Otağım") : "Yarat"}
        </button>
      </header>
      <div className="lr-search">
        <Search size={15} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setErr("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void joinById();
          }}
          placeholder={translate("Otaq adı və ya ID")}
          inputMode="search"
        />
        {/^\d{4,}$/.test(query.trim()) && (
          <button type="button" onClick={() => void joinById()}>
            {translate("Qoşul")}</button>
        )}
      </div>
      {err && <p className="vr-err lr-pad">{err}</p>}
      <div className="lr-list">
        {rooms === null ? (
          <div className="lr-empty">
            <LoaderCircle className="mh-spin" size={22} />
          </div>
        ) : list.length === 0 ? (
          <div className="lr-empty">
            <span>🎙️</span>
            <p>
              {translate("Hələ aktiv otaq yoxdur.")}<br />
              {translate("İlk otağı sən yarat!")}</p>
          </div>
        ) : (
          list.map((r, i) => {
            const people = inside[r.id] ?? [];
            const c = coverOf(r.cover);
            return (
              <button
                key={r.id}
                type="button"
                className={`lr-card vr-cover-${c.key}`}
                style={{ animationDelay: `${i * 35}ms` }}
                onClick={() => setActive(r)}
              >
                <span className="lr-cover">
                  {c.emoji}
                  {people.length > 0 && <span className="lr-live">CANLI</span>}
                </span>
                <span className="lr-info">
                  <strong>{roomTitle(r.name)}</strong>
                  <small>
                    {roomKind(r.name) === "video" ? translate("🎥 Görüntülü") : translate("🎙️ Səsli")} · ID: {r.code}
                    {r.owner_id === me.id ? " · sənin otağın" : ""}
                  </small>
                  <span className="lr-faces">
                    {people.slice(0, 4).map((p, k) => (
                      <img key={k} src={p.photo || defaultPhoto} alt={p.name} />
                    ))}
                    {people.length === 0 && <em>{translate("Boşdur — ilk sən qoşul")}</em>}
                  </span>
                </span>
                <span className="lr-count">
                  <Users size={13} />
                  {people.length}
                  <span className="lr-wave">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>

      {creating && (
        <div
          className="vr-sheet-wrap"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreating(false);
          }}
        >
          <div className="vr-sheet">
            <div className="vr-sheet-head">
              <h3>{mine ? translate("Otağını aç") : "Yeni otaq yarat"}</h3>
            </div>
            <div className={`lr-preview vr-cover-${cover}`}>
              <span>{coverOf(cover).emoji}</span>
              <div>
                <strong>{roomTitle(name) || translate("Otaq adı")}</strong>
                <small>
                  {kind === "video" ? <Video size={11} /> : <Mic size={11} />}{" "}
                  {kind === "video" ? translate("Görüntülü otaq") : translate("Səsli otaq")}
                </small>
              </div>
            </div>
            <span className="vr-field">{translate("Otaq növü")}</span>
            <div className="lr-kinds">
              <button type="button" className={kind === "voice" ? "on" : ""} onClick={() => setKind("voice")}>
                <Mic size={18} />
                <b>{translate("Səsli otaq")}</b>
                <small>{translate("Yuvarlaq yerlər, səs")}</small>
              </button>
              <button type="button" className={kind === "video" ? "on" : ""} onClick={() => setKind("video")}>
                <Video size={18} />
                <b>{translate("Görüntülü otaq")}</b>
                <small>{translate("Böyük kamera pəncərələri")}</small>
              </button>
            </div>
            <label className="vr-field">
              {translate("Otaq adı")}<input value={roomTitle(name)} onChange={(e) => setName(e.target.value)} maxLength={39} />
            </label>
            <span className="vr-field">{translate("Otaq şəkli")}</span>
            <div className="vr-covers">
              {ROOM_COVERS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`vr-cover-pick vr-cover-${c.key}${cover === c.key ? " on" : ""}`}
                  onClick={() => setCover(c.key)}
                  aria-label={c.key}
                >
                  {c.emoji}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="vr-primary"
              disabled={busy || !name.trim()}
              onClick={() => void create()}
            >
              {busy ? translate("Yaradılır…") : mine ? translate("Otağa gir") : translate("Yarat və gir")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const LR_STYLES = `
.lr{overflow:hidden;}
.lr-top{display:flex;align-items:center;gap:12px;padding:6px 16px 12px;}
.lr-top>div{flex:1}.lr-top h2{margin:0;font-size:20px;font-weight:800;}
.lr-top p{margin:2px 0 0;font-size:11px;color:var(--vr-dim);display:flex;align-items:center;gap:6px;}
.lr-top p i{width:6px;height:6px;border-radius:50%;background:var(--vr-live);animation:vr-pulse 1.6s infinite;}
.lr-new{all:unset;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:13px;font-weight:800;padding:9px 14px;border-radius:20px;background:linear-gradient(140deg,var(--vr-accent),var(--vr-accent2));color:oklch(.2 .04 30);}
.lr-search{margin:0 16px 10px;display:flex;align-items:center;gap:8px;height:42px;padding:0 6px 0 14px;border-radius:14px;background:var(--vr-surface);border:1px solid var(--vr-line);color:var(--vr-dim);}
.lr-search input{all:unset;flex:1;font-size:14px;color:var(--vr-ink);}
.lr-search button{all:unset;cursor:pointer;font-size:12px;font-weight:800;padding:6px 12px;border-radius:10px;background:var(--vr-accent);color:oklch(.25 .05 60);}
.lr-pad{padding:0 16px;}
.lr-list{flex:1;overflow-y:auto;padding:0 16px 20px;display:flex;flex-direction:column;gap:10px;}
.lr-card{all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px;border-radius:18px;background:var(--vr-surface);border:1px solid var(--vr-line);animation:vr-msg .3s ease-out both;transition:transform .15s;}
.lr-card:active{transform:scale(.98);}
.lr-cover{position:relative;flex-shrink:0;width:62px;height:62px;border-radius:16px;display:grid;place-items:center;font-size:28px;background:var(--cover);}
.lr-live{position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);font-size:8px;font-weight:900;letter-spacing:.06em;padding:2px 6px;border-radius:6px;background:oklch(.6 .22 25);color:oklch(1 0 0);}
.lr-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}
.lr-info strong{font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lr-info small{font-size:11px;color:var(--vr-dim);}
.lr-faces{display:flex;align-items:center;padding-left:6px;min-height:22px;}
.lr-faces img{width:22px;height:22px;border-radius:50%;object-fit:cover;margin-left:-6px;border:2px solid oklch(.22 .04 290);}
.lr-faces em{font-size:10.5px;color:var(--vr-dim);font-style:normal;margin-left:-6px;}
.lr-count{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:13px;font-weight:800;}
.lr-count svg{display:inline}
.lr-wave{display:flex;gap:2px;align-items:flex-end;height:10px;}
.lr-wave i{width:3px;border-radius:2px;background:var(--vr-accent);animation:vr-eq .6s ease-in-out infinite alternate;}
.lr-wave i:nth-child(2){animation-delay:.2s}.lr-wave i:nth-child(3){animation-delay:.4s}
.lr-empty{flex:1;display:grid;place-items:center;text-align:center;padding:60px 0;color:var(--vr-dim);font-size:13px;}
.lr-empty span{font-size:44px;}
.lr-preview{display:flex;align-items:center;gap:12px;padding:12px;border-radius:16px;background:var(--vr-surface);}
.lr-preview>span{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;font-size:26px;background:var(--cover);}
.lr-kinds{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.lr-kinds button{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:3px;padding:12px;border-radius:16px;background:var(--vr-surface);border:1.5px solid var(--vr-line);transition:border-color .2s,background .2s;}
.lr-kinds button.on{border-color:var(--vr-accent);background:oklch(.78 .16 70 / .14);}
.lr-kinds b{font-size:13px}.lr-kinds small{font-size:10.5px;color:var(--vr-dim);}
.lr-preview strong{display:block;font-size:15px}.lr-preview small{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--vr-dim);}
`;
