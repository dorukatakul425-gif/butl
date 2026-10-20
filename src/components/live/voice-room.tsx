import { translate, usePreferences } from "@/lib/app-preferences";
// Full-screen live voice/video room: header (cover, ID, settings, exit), tables with seats and
// speaking animations in the middle, chat + gift/send controls at the bottom.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Gift,
  Plus,
  LogOut,
  Mic,
  MicOff,
  Send,
  Settings,
  Camera,
  Users,
  AlertTriangle,
  LogIn,
  X,
  Trash2,
  Check,
  Bell,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Smile,
  UserRound,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  ArrowDownToLine,
  UserX,
  UserPlus,
  KeyRound,
} from "lucide-react";
import { giftByKey, type LiveGift } from "@/lib/live-gifts";
import { GiftSheet, GiftBanners, GiftScene, GIFT_FX_STYLES, type Banner } from "./live-gift-fx";
import { getSupabase } from "@/lib/supabase";
import {
  SEAT_COUNT,
  VoiceRoomClient,
  type RoomChat,
  type RoomGift,
  type RoomMember,
  type RoomMod,
} from "@/lib/voice-rtc";
import { coverOf, roomTitle, withKind, roomPhoto, compressRoomPhoto, ROOM_COLS, type VoiceRoomRow } from "./live-rooms";
import { checkProfanity, PROFANITY_WARNING } from "@/lib/profanity";
import { TELEGRAM_NO_PHOTO } from "@/lib/player-photo";
import { Button } from "@/components/ui/button";
import giftArtwork from "@/assets/gifts/pegasus.jpg.asset.json";
import giftClip from "@/assets/gifts/pegasus.mp4.asset.json";
import giftFallback from "@/assets/gifts/pegasus.webm.asset.json";
import roomBg from "@/assets/room-bg-night.jpg";

const EMOJIS = ["😀", "😂", "😍", "🥰", "😎", "🤩", "😘", "🙏", "👏", "🔥", "❤️", "🌹", "🎉", "💯", "😢", "😡"];

const ASSET_ORIGIN = "https://id-preview--88e024e4-bf42-4edc-bea3-5e35357c10f2.lovable.app";
const VIDEO_GIFT_URL = new URL(giftClip.url, ASSET_ORIGIN).href;
const VIDEO_GIFT_FALLBACK = new URL(giftFallback.url, ASSET_ORIGIN).href;
const VIDEO_GIFT_ARTWORK = new URL(giftArtwork.url, ASSET_ORIGIN).href;
const giftEmoji = (k?: string) => giftByKey(k)?.icon ?? "🎁";
const KICK_MINUTES = [5, 30, 60, 1440];
type SeatSheet = { seat: number | null; member: RoomMember | null };

function GiftPlayback({ gift, muted, onDone }: { gift: RoomGift; muted: boolean; onDone: () => void }) {
  usePreferences();
  const ref = useRef<HTMLVideoElement>(null);
  const [soundBlocked, setSoundBlocked] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let disposed = false;
    const start = async () => {
      if (disposed) return;
      video.currentTime = Math.max(0, (Date.now() - (gift.at ?? Date.now())) / 1000);
      try { await video.play(); }
      catch {
        if (disposed) return;
        video.muted = true;
        setSoundBlocked(true);
        void video.play().catch(() => undefined);
      }
    };
    const timer = window.setTimeout(() => void start(), Math.max(0, (gift.at ?? Date.now()) - Date.now()));
    return () => { disposed = true; window.clearTimeout(timer); video.pause(); };
  }, [gift.id, gift.at]);
  return <div className="vr-vgift">
    <video ref={ref} preload="auto" playsInline muted={muted || soundBlocked} onEnded={onDone} onError={(event) => { if (event.target === event.currentTarget) onDone(); }}>
      <source src={VIDEO_GIFT_URL} type='video/mp4; codecs="avc1.640028, mp4a.40.2"' />
      <source src={VIDEO_GIFT_FALLBACK} type="video/webm" />
    </video>
    <div className="vr-vgift-tag"><img src={VIDEO_GIFT_ARTWORK} alt="" /><b>{gift.name ?? translate("Oyunçu")}</b> {translate("hədiyyə göndərdi")}</div>
    {soundBlocked && !muted && <Button variant="ghost" className="vr-sound-recover" aria-label={translate("Hədiyyənin səsini aç")} onClick={() => {
      const video = ref.current;
      if (!video) return;
      video.muted = false;
      void video.play().then(() => setSoundBlocked(false)).catch(() => setSoundBlocked(true));
    }}><Volume2 size={20} /></Button>}
    <Button variant="ghost" className="vr-icon vr-vgift-x" aria-label={translate("Hədiyyəni bağla")} onClick={onDone}><X size={18} /></Button>
  </div>;
}

type Me = { id: string; name: string; photo: string | null };
type Flying = RoomGift & { x: number; y: number };

function RemoteAudio({ stream, muted }: { stream: MediaStream; muted: boolean }) {
  usePreferences();
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream;
      void ref.current.play().catch(() => undefined);
    }
  }, [stream]);
  return <audio ref={ref} autoPlay muted={muted} />;
}

export function VoiceRoom({
  room: initial,
  me,
  ownerName = "",
  defaultPhoto,
  onLeave,
  onPresence,
}: {
  room: VoiceRoomRow;
  me: Me;
  ownerName?: string;
  defaultPhoto: string;
  onLeave: () => void;
  onPresence: (inRoom: boolean) => void;
}) {
  usePreferences();
  const [room, setRoom] = useState(initial);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [streams, setStreams] = useState<Record<string, MediaStream>>({});
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [chat, setChat] = useState<RoomChat[]>([
    {
      id: "sys",
      from: "",
      name: "",
      photo: null,
      text: translate("Otağa xoş gəldin! Hörmətli ünsiyyət qaydalarına əməl et."),
      at: Date.now(),
      kind: "system",
    },
  ]);
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");
  const [text, setText] = useState("");
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftTo, setGiftTo] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [chatHidden, setChatHidden] = useState(false);
  const [flying, setFlying] = useState<Flying[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [scenes, setScenes] = useState<RoomGift[]>([]);
  const [seatSheet, setSeatSheet] = useState<SeatSheet | null>(null);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [invite, setInvite] = useState<{ seat: number | null; name: string } | null>(null);
  const [entering, setEntering] = useState<{ id: string; name: string; photo: string | null } | null>(null);
  const [giftQueue, setGiftQueue] = useState<RoomGift[]>([]);
  const [seatBusy, setSeatBusy] = useState(false);
  const videoGift = giftQueue[0];
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const client = useRef<VoiceRoomClient | null>(null);
  const seenRef = useRef<Set<string> | null>(null);
  const seatRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const chatRef = useRef<HTMLDivElement>(null);
  const isOwner = room.owner_id === me.id;
  const meMember = members.find((m) => m.id === me.id);

  const flash = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(""), 2400);
  };

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setStatus("error");
      return;
    }
    const c = new VoiceRoomClient(sb, room.id, me, {
      onMembers: (list) => {
        const prev = seenRef.current;
        if (prev) {
          const joined = list.filter((m) => !prev.has(m.id) && m.id !== me.id);
          const last = joined[joined.length - 1];
          if (last) {
            setEntering({ id: `${last.id}-${Date.now()}`, name: last.name, photo: last.photo });
            window.setTimeout(() => setEntering((e) => (e && e.name === last.name ? null : e)), 2600);
          }
          if (joined.length)
            setChat((c) => [...c.slice(-80), ...joined.map((m) => ({ id: `join-${m.id}-${Date.now()}`, from: m.id, name: m.name, photo: m.photo, text: "", at: Date.now(), kind: "system" as const, to: "join" }))]);
        }
        seenRef.current = new Set(list.map((m) => m.id));
        setMembers(list);
      },
      onStream: (id, s) =>
        setStreams((prev) => {
          const n = { ...prev };
          if (s) n[id] = s;
          else delete n[id];
          return n;
        }),
      onSpeaking: (id, level) =>
        setLevels((prev) => (prev[id] === level ? prev : { ...prev, [id]: level })),
      onChat: (m) =>
        setChat((prev) => {
          if (m.kind === "gift" && m.comboId) {
            const i = prev.findIndex((x) => x.comboId === m.comboId);
            if (i >= 0) { const n = prev.slice(); n[i] = { ...prev[i]!, count: Math.max(prev[i]!.count ?? 1, m.count ?? 1) }; return n; }
          }
          return [...prev.slice(-80), m];
        }),
      onMod: (m) => void handleMod(m),
      onGift: (g) => launchGift(g),
      onRoom: (type) => {
        if (type === "closed") {
          flash(translate("Otaq sahibi otağı bağladı"));
          window.setTimeout(() => onLeave(), 1200);
        } else
          void sb
            .from("voice_rooms")
            .select(ROOM_COLS)
            .eq("id", room.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) setRoom(data as VoiceRoomRow);
            });
      },
      onStatus: (s) => { setStatus(s); onPresence(s === "live"); },
    });
    c.ownerId = room.owner_id;
    c.locked = new Set(room.locked_seats ?? []);
    client.current = c;
    void c.start();
    return () => {
      onPresence(false);
      client.current = null;
      void c.leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.length]);

  useEffect(() => {
    if (client.current) client.current.locked = new Set(room.locked_seats ?? []);
  }, [room.locked_seats]);

  async function handleMod(m: RoomMod) {
    const sb = getSupabase();
    if (m.type === "kick") {
      if (!sb) return;
      const { data } = await sb.from("voice_room_kicks").select("until").eq("room_id", room.id).eq("user_id", me.id).maybeSingle();
      if (!data || new Date((data as { until: string }).until).getTime() < Date.now()) return;
      flash(translate("Otaq sahibi səni otaqdan çıxardı"));
      window.setTimeout(() => onLeave(), 1300);
    } else if (m.type === "unseat") flash(translate("Otaq sahibi səni izləyici etdi"));
    else if (m.type === "invite") setInvite({ seat: m.seat, name: m.name });
    else if (m.type === "invite_reply") flash(`${m.name}: ${m.accept ? translate("dəvəti qəbul etdi") : translate("dəvəti rədd etdi")}`);
  }

  function launchGift(g: RoomGift) {
    const def = giftByKey(g.gift);
    if (!def) return;
    if (def.tier === "video") {
      setGiftQueue(prev => [...prev, g]);
      return;
    }
    const key = g.comboId ?? g.id;
    setBanners((prev) => [...prev.filter((b) => b.key !== key), { ...g, key, until: Date.now() + 3200 }].slice(-3));
    window.setTimeout(() => setBanners((prev) => prev.filter((b) => b.key !== key || b.until > Date.now())), 3300);
    if (def.tier === "medium" || def.tier === "big") setScenes((prev) => (def.tier === "medium" && prev.length > 2 ? prev : [...prev, g]));
    window.requestAnimationFrame(() => {
      const ms = membersRef.current.find((m) => m.id === g.to);
      const el = ms?.seat != null ? seatRefs.current[ms.seat] : null;
      const r = el?.getBoundingClientRect();
      const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
      const y = r ? r.top + r.height / 2 : window.innerHeight / 2.4;
      setFlying((prev) => [...prev, { ...g, x, y }]);
      window.setTimeout(() => setFlying((prev) => prev.filter((f) => f.id !== g.id)), 2300);
    });
  }
  const doneScene = useCallback(() => setScenes((q) => q.slice(1)), []);
  const membersRef = useRef<RoomMember[]>([]);
  membersRef.current = members;

  const bySeat = useMemo(() => {
    const m = new Map<number, RoomMember>();
    members.forEach((x) => {
      if (x.seat !== null && !m.has(x.seat)) m.set(x.seat, x);
    });
    return m;
  }, [members]);
  const listeners = members.filter((m) => m.seat === null);
  const cover = coverOf(room.cover);

  const send = () => {
    const t = text.trim();
    if (!t || !client.current) return;
    client.current.sendChat(t.slice(0, 300));
    setText("");
  };
  const toggleLock = async (seat: number) => {
    const sb = getSupabase();
    if (!sb || !isOwner) return;
    const cur = new Set(room.locked_seats ?? []);
    if (cur.has(seat)) cur.delete(seat); else cur.add(seat);
    const next = [...cur].sort((a, b) => a - b);
    const { data, error } = await sb.from("voice_rooms").update({ locked_seats: next }).eq("id", room.id).select(ROOM_COLS).single();
    if (error) { flash(error.message); return; }
    setRoom(data as VoiceRoomRow);
    client.current?.notifyRoom("updated");
  };
  const kick = async (m: RoomMember, minutes: number) => {
    const sb = getSupabase();
    if (!sb || !isOwner) return;
    const { data, error } = await sb.rpc("kick_voice_member", { p_room: room.id, p_user: m.id, p_minutes: minutes });
    if (error) { flash(error.message); return; }
    client.current?.sendMod({ type: "kick", from: me.id, target: m.id, until: new Date(String(data)).getTime() });
    flash(`${m.name} ${translate("otaqdan çıxarıldı")}`);
  };
  const unseat = (m: RoomMember) => {
    client.current?.sendMod({ type: "unseat", from: me.id, target: m.id });
    flash(`${m.name} ${translate("izləyiciyə endirildi")}`);
  };
  const inviteTo = (m: RoomMember, seat: number | null) => {
    client.current?.sendMod({ type: "invite", from: me.id, target: m.id, seat, name: me.name });
    flash(`${m.name} ${translate("yerə dəvət edildi")}`);
  };
  const answerInvite = async (accept: boolean) => {
    const inv = invite;
    setInvite(null);
    const c = client.current;
    if (!c || !inv) return;
    c.sendMod({ type: "invite_reply", from: me.id, target: room.owner_id, accept, name: me.name });
    if (!accept) return;
    const taken = new Set(membersRef.current.filter((x) => x.seat !== null && x.id !== me.id).map((x) => x.seat));
    let seat = inv.seat !== null && !taken.has(inv.seat) ? inv.seat : null;
    if (seat === null) for (let i = 0; i < SEAT_COUNT; i++) if (!taken.has(i) && !c.locked.has(i)) { seat = i; break; }
    if (seat === null) { flash(translate("Boş yer yoxdur")); return; }
    c.locked.delete(seat);
    await sit(seat);
  };
  const onSeatTap = (i: number) => {
    const m = bySeat.get(i) ?? null;
    const locked = (room.locked_seats ?? []).includes(i);
    if (!m && !isOwner) {
      if (locked) flash(translate("Bu yer kilidlidir"));
      else void sit(i);
      return;
    }
    if (m && m.id === me.id) { setSeatSheet({ seat: i, member: m }); return; }
    setSeatSheet({ seat: i, member: m });
  };
  const toggleMic = () => {
    const c = client.current;
    if (!c || c.me.seat === null) { flash(translate("Əvvəlcə masaya otur")); return; }
    if (!c.toggleMic()) flash(translate("Mikrofona icazə verilməyib"));
  };
  const sit = async (seat: number) => {
    if (seatBusy) return;
    const c = client.current;
    if (!c) return;
    setSeatBusy(true);
    try { if (!await c.setSeat(seat)) flash(translate("Yer tutulub və ya mikrofon icazəsi verilməyib")); }
    finally { setSeatBusy(false); }
  };
  const copyId = () => {
    void navigator.clipboard?.writeText(String(room.code)).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  const renderSeat = (i: number) => {
    const m = bySeat.get(i);
    const lvl = m ? (levels[m.id] ?? 0) : 0;
    const speaking = Boolean(m && m.mic && lvl > 0);
    return (
      <div
        key={i}
        ref={(el) => {
          seatRefs.current[i] = el;
        }}
        className={`vr-seat${m ? " taken" : ""}${speaking ? " speaking" : ""}${m?.id === me.id ? " me" : ""}`}
        onClick={m ? () => onSeatTap(i) : undefined}
        style={{ ["--lvl" as string]: String(lvl) }}
      >
        {m ? (
          <>
            <span className="vr-ring r1" />
            <span className="vr-ring r2" />
            <span className="vr-ring r3" />
            <div className="vr-ava">
              <img src={m.photo || defaultPhoto} alt={m.name} />
            </div>
            {!m.mic && (
              <span className="vr-muted">
                <MicOff size={11} />
              </span>
            )}
            <span className="vr-numchip">{i + 1}</span>
            {m.id === room.owner_id && <span className="vr-crown">👑</span>}
            <span className="vr-name">{m.id === me.id ? translate("Sən") : m.name}</span>
            <span className="vr-eq" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </>
        ) : (
          <button
            type="button"
            className="vr-empty"
            disabled={seatBusy || status !== "live"}
            onClick={() => onSeatTap(i)}
            aria-label={`${i + 1}`}
            data-locked={(room.locked_seats ?? []).includes(i) || undefined}
          >
            <span className="vr-numchip">{i + 1}</span>
            <span className="vr-plus">
              {(room.locked_seats ?? []).includes(i) ? <Lock size={18} strokeWidth={2.4} /> : <Plus size={22} strokeWidth={2} />}
            </span>
          </button>
        )}
      </div>
    );
  };

  const owner = members.find((m) => m.id === room.owner_id);
  return (
    <div
      className={`vr vr-kind-voice vr-cover-${cover.key}`}
      role="dialog"
      aria-modal="true"
      aria-label={roomTitle(room.name)}
      style={{ backgroundImage: `url(${room.photo || roomBg})` }}
    >
      <style>{VR_STYLES}{GIFT_FX_STYLES}</style>
      <div className="vr-sky" aria-hidden="true" />
      {Object.entries(streams)
        .filter(([id]) => id !== me.id)
        .map(([id, s]) => (
          <RemoteAudio key={id} stream={s} muted={speakerOff} />
        ))}
      <header className="vr-head">
        <button type="button" className="vr-head-ava" onClick={copyId} aria-label="ID">
          <img src={room.photo || owner?.photo || TELEGRAM_NO_PHOTO} alt="" />
        </button>
        <div className="vr-head-text">
          <strong>@{ownerName || owner?.name || roomTitle(room.name)}</strong>
          <button type="button" className="vr-head-id" onClick={copyId}>
            {translate("OTAQ ID")}: <b>{room.code}</b>{copied ? <Check size={12} /> : null}
          </button>
        </div>
        <div className="vr-head-right">
          <button type="button" className="vr-head-pill" onClick={() => setAudienceOpen(true)} aria-label={translate("İzləyicilər")}><Users size={14} />{members.length}</button>
          <button type="button" className="vr-head-pill" onClick={() => setMenuOpen(true)} aria-label="Menyu"><MoreHorizontal size={16} /></button>
          <button type="button" className="vr-head-pill" onClick={onLeave} aria-label={translate("Otaqdan çıx")}><LogOut size={15} /></button>
        </div>
      </header>
      <div className="vr-roomname">{room.has_password && <Lock size={11} />}{roomTitle(room.name)}</div>
      {status !== "live" && (
        <div className="vr-subrow">
          <span className={`vr-status ${status}`}>
            {status === "connecting" ? translate("Qoşulur…") : translate("Bağlantı xətası")}
          </span>
        </div>
      )}

      <main className="vr-stage">
        <div className="vr-seats">
          {Array.from({ length: SEAT_COUNT }, (_, i) => renderSeat(i))}
        </div>
        <div className="vr-tools">
          <div className="vr-pill">
            <button type="button" onClick={() => setChatHidden((v) => !v)} aria-label={translate("Söhbəti gizlət")}>
              {chatHidden ? <Maximize2 size={17} /> : <Minimize2 size={17} />}
            </button>
            <span className="vr-all">ALL</span>
          </div>
          {meMember?.seat !== null && meMember && (
            <button type="button" className="vr-pill vr-stand" onClick={() => client.current?.setSeat(null)}>
              {translate("Yerdən qalx")}</button>
          )}
          <button type="button" className="vr-pill" onClick={() => setAudienceOpen(true)} aria-label={translate("İzləyicilər")}>
            <UserRound size={15} />
            {listeners.length}
          </button>
        </div>
      </main>

      <div className={`vr-chat${chatHidden ? " hidden" : ""}`} ref={chatRef}>
        {chat.map((m) =>
          m.kind === "system" && m.to === "join" ? (
            <div key={m.id} className="vr-msg join">
              <span className="vr-msg-ico"><LogIn size={16} /></span>
              <p><b>@{m.name}</b> {translate("otağa daxil oldu.")}</p>
            </div>
          ) : m.kind === "system" ? (
            <div key={m.id} className="vr-msg sys">
              <span className="vr-msg-ico">
                <Bell size={15} />
              </span>
              <p>{m.text}</p>
            </div>
          ) : m.kind === "gift" ? (
            <div key={m.id} className="vr-msg gift">
              <span className="vr-msg-ico">{giftEmoji(m.gift)}</span>
              <p>
                <b>{m.from === me.id ? translate("Sən") : m.name}</b> →{" "}
                <b>{m.to === me.id ? translate("sənə") : m.toName || translate("hamıya")}</b> {giftByKey(m.gift)?.icon}{(m.count ?? 1) > 1 && <em className="vr-x"> x{m.count}</em>}</p>
            </div>
          ) : (
            <div key={m.id} className="vr-msg">
              <img className="vr-msg-ico" src={m.photo || defaultPhoto} alt="" />
              <p>
                <b>{m.from === me.id ? translate("Sən") : m.name}</b>
                {m.text}
              </p>
            </div>
          ),
        )}
      </div>

      {emojiOpen && (
        <div className="vr-emojis">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setText((t) => (t + e).slice(0, 300));
                setEmojiOpen(false);
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
      <footer className="vr-bar">
        <button
          type="button"
          className={`vr-tool${speakerOff ? " off" : ""}`}
          onClick={() => setSpeakerOff((v) => !v)}
          aria-label={translate("Səs")}
        >
          {speakerOff ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <button
          type="button"
          className={`vr-tool${meMember?.mic ? " on" : ""}`}
          onClick={toggleMic}
          aria-label="Mikrofon"
        >
          {meMember?.mic ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <div className="vr-input">
          <button type="button" className="vr-emo" onClick={() => setEmojiOpen((v) => !v)} aria-label="Emoji">
            <Smile size={20} />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder={translate("Bir şey söylə…")}
            maxLength={300}
            aria-label="Mesaj"
          />
          {text.trim() && (
            <button type="button" className="vr-send" onClick={send} aria-label={translate("Göndər")}>
              <Send size={16} />
            </button>
          )}
        </div>
        <button type="button" className="vr-tool vr-gift" onClick={() => setGiftOpen(true)} aria-label={translate("Hədiyyə göndər")}>
          <Gift size={25} />
        </button>
      </footer>

      {flying.map((f) => (
        <span
          key={f.id}
          className="vr-fly"
          style={{ ["--tx" as string]: `${f.x}px`, ["--ty" as string]: `${f.y}px` }}
        >
          {giftEmoji(f.gift)}
          <i className="vr-burst" />
        </span>
      ))}
      {videoGift && <GiftPlayback key={videoGift.id} gift={videoGift} muted={speakerOff} onDone={() => setGiftQueue(q => q.slice(1))} />}
      {toast && (
        <div className="vr-toast" role="status">
          {toast}
        </div>
      )}

      <GiftBanners banners={banners} defaultPhoto={defaultPhoto} meId={me.id} />
      {scenes[0] && <GiftScene key={scenes[0].id} gift={scenes[0]} onDone={doneScene} />}
      {entering && (
        <div key={entering.id} className="vr-enter"><img src={entering.photo || defaultPhoto} alt="" /><b>@{entering.name}</b> {translate("otağa daxil oldu.")}</div>
      )}
      {giftOpen && (
        <GiftSheet
          members={members}
          meId={me.id}
          defaultPhoto={defaultPhoto}
          initialTo={giftTo}
          disabled={status !== "live"}
          onClose={() => setGiftOpen(false)}
          onSend={async (to: RoomMember | null, g: LiveGift, combo) => {
            const c = client.current;
            if (!c) return false;
            const ok = await c.sendGift(to, g.key, combo);
            if (!ok) flash(translate("Hədiyyə göndərilmədi. Bağlantını yoxla."));
            return ok;
          }}
        />
      )}
      {seatSheet && (
        <div className="vr-sheet-wrap" onClick={(e) => { if (e.target === e.currentTarget) setSeatSheet(null); }}>
          <div className="vr-sheet vr-menu vr-seat-menu">
            {seatSheet.member ? (
              <div className="vr-who"><img src={seatSheet.member.photo || defaultPhoto} alt="" /><b>{seatSheet.member.id === me.id ? translate("Sən") : seatSheet.member.name}</b>{seatSheet.seat !== null && <span>#{seatSheet.seat + 1}</span>}</div>
            ) : (
              <div className="vr-who"><b>#{(seatSheet.seat ?? 0) + 1}</b></div>
            )}
            {!seatSheet.member && seatSheet.seat !== null && (
              <button type="button" onClick={() => { const s = seatSheet.seat!; setSeatSheet(null); void sit(s); }}><Mic size={17} /> {translate("Bu yerə otur")}</button>
            )}
            {isOwner && !seatSheet.member && seatSheet.seat !== null && (
              <button type="button" onClick={() => { const s = seatSheet.seat!; setSeatSheet(null); void toggleLock(s); }}>
                {(room.locked_seats ?? []).includes(seatSheet.seat) ? <><Unlock size={17} /> {translate("Kilidi aç")}</> : <><Lock size={17} /> {translate("Yeri kilidlə")}</>}
              </button>
            )}
            {isOwner && !seatSheet.member && seatSheet.seat !== null && listeners.filter((l) => l.id !== me.id).length > 0 && (
              <div className="vr-invite-list">
                <small>{translate("Yerə dəvət et")}</small>
                {listeners.filter((l) => l.id !== me.id).map((l) => (
                  <button key={l.id} type="button" onClick={() => { inviteTo(l, seatSheet.seat); setSeatSheet(null); }}><img src={l.photo || defaultPhoto} alt="" />{l.name}<UserPlus size={15} /></button>
                ))}
              </div>
            )}
            {seatSheet.member && seatSheet.member.id !== me.id && (
              <button type="button" onClick={() => { setGiftTo(seatSheet.member!.id); setSeatSheet(null); setGiftOpen(true); }}><Gift size={17} /> {translate("Hədiyyə göndər")}</button>
            )}
            {seatSheet.member && seatSheet.member.id === me.id && (
              <button type="button" onClick={() => { setSeatSheet(null); void client.current?.setSeat(null); }}><ArrowDownToLine size={17} /> {translate("Yerdən qalx")}</button>
            )}
            {isOwner && seatSheet.member && seatSheet.member.id !== me.id && (
              <>
                {seatSheet.member.seat !== null ? (
                  <button type="button" onClick={() => { unseat(seatSheet.member!); setSeatSheet(null); }}><ArrowDownToLine size={17} /> {translate("İzləyiciyə endir")}</button>
                ) : (
                  <button type="button" onClick={() => { inviteTo(seatSheet.member!, null); setSeatSheet(null); }}><UserPlus size={17} /> {translate("Yerə dəvət et")}</button>
                )}
                <div className="vr-kick">
                  <small><UserX size={14} /> {translate("Müvəqqəti çıxar")}</small>
                  <div>{KICK_MINUTES.map((mn) => (
                    <button key={mn} type="button" className="danger" onClick={() => { void kick(seatSheet.member!, mn); setSeatSheet(null); }}>{mn >= 60 ? `${mn / 60} ${translate("saat")}` : `${mn} ${translate("dəq")}`}</button>
                  ))}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {audienceOpen && (
        <div className="vr-sheet-wrap" onClick={(e) => { if (e.target === e.currentTarget) setAudienceOpen(false); }}>
          <div className="vr-sheet vr-audience">
            <div className="vr-sheet-head"><h3><Users size={16} /> {translate("İzləyicilər")} · {members.length}</h3>
              <button type="button" className="vr-icon" onClick={() => setAudienceOpen(false)} aria-label={translate("Bağla")}><X size={16} /></button></div>
            <div className="vr-aud-list">
              {[...members].sort((a, b) => (a.seat ?? 99) - (b.seat ?? 99)).map((m) => (
                <button key={m.id} type="button" onClick={() => { setAudienceOpen(false); setSeatSheet({ seat: m.seat, member: m }); }}>
                  <img src={m.photo || defaultPhoto} alt="" />
                  <span>{m.id === me.id ? translate("Sən") : m.name}{m.id === room.owner_id && " 👑"}</span>
                  <i>{m.seat !== null ? `#${m.seat + 1}` : translate("izləyici")}</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {invite && (
        <div className="vr-sheet-wrap vr-center">
          <div className="vr-invite">
            <UserPlus size={26} />
            <p><b>@{invite.name}</b> {translate("səni")} {invite.seat !== null ? `#${invite.seat + 1} ` : ""}{translate("yerə dəvət edir")}</p>
            <div><button type="button" onClick={() => void answerInvite(false)}>{translate("Rədd et")}</button><button type="button" className="ok" onClick={() => void answerInvite(true)}>{translate("Qəbul et")}</button></div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className="vr-sheet-wrap"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMenuOpen(false);
          }}
        >
          <div className="vr-sheet vr-menu">
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSettingsOpen(true);
                }}
              >
                <Settings size={18} /> {translate("Otaq ayarları")}</button>
            )}
            <button
              type="button"
              onClick={() => {
                copyId();
                setMenuOpen(false);
              }}
            >
              <Copy size={18} /> ID-ni kopyala
            </button>
            <button type="button" className="danger" onClick={onLeave}>
              <LogOut size={18} /> {translate("Otaqdan çıx")}</button>
          </div>
        </div>
      )}
      {settingsOpen && (
        <RoomSettings
          room={room}
          onClose={() => setSettingsOpen(false)}
          onSaved={(r) => {
            setRoom(r);
            client.current?.notifyRoom("updated");
            setSettingsOpen(false);
            flash(translate("Otaq yeniləndi"));
          }}
          onDeleted={() => {
            client.current?.notifyRoom("closed");
            onLeave();
          }}
        />
      )}
    </div>
  );
}

function RoomSettings({
  room,
  onClose,
  onSaved,
  onDeleted,
}: {
  room: VoiceRoomRow;
  onClose: () => void;
  onSaved: (r: VoiceRoomRow) => void;
  onDeleted: () => void;
}) {
  const { language } = usePreferences();
  const [name, setName] = useState(roomTitle(room.name));
  const [photo, setPhoto] = useState<string | null>(room.photo ?? null);
  const [pass, setPass] = useState("");
  const [passOn, setPassOn] = useState(Boolean(room.has_password));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const warning = PROFANITY_WARNING[language] ?? PROFANITY_WARNING.az;
  const bad = !checkProfanity(name).clean;
  const save = async () => {
    const sb = getSupabase();
    if (!sb || !name.trim()) return;
    if (bad) { setErr(warning); return; }
    setBusy(true);
    setErr("");
    const { data, error } = await sb
      .from("voice_rooms")
      .update({ name: withKind(name), photo })
      .eq("id", room.id)
      .select(ROOM_COLS)
      .single();
    if (error) { setBusy(false); setErr(/banned_word/.test(error.message) ? warning : error.message); return; }
    let saved = data as VoiceRoomRow;
    if (!passOn && room.has_password) {
      const r = await sb.rpc("set_voice_room_password", { p_room: room.id, p_pass: "" });
      if (r.error) { setBusy(false); setErr(r.error.message); return; }
      saved = { ...saved, has_password: false };
    } else if (passOn && pass.trim()) {
      const r = await sb.rpc("set_voice_room_password", { p_room: room.id, p_pass: pass.trim() });
      if (r.error) { setBusy(false); setErr(r.error.message); return; }
      saved = { ...saved, has_password: true };
    } else if (passOn && !room.has_password) { setBusy(false); setErr(translate("Şifrə yaz")); return; }
    setBusy(false);
    onSaved(saved);
  };
  const remove = async () => {
    const sb = getSupabase();
    if (!sb || !window.confirm(translate("Otaq silinsin?"))) return;
    setBusy(true);
    const { error } = await sb.from("voice_rooms").delete().eq("id", room.id);
    setBusy(false);
    if (error) setErr(error.message);
    else onDeleted();
  };
  return (
    <div className="vr-sheet-wrap" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="vr-sheet">
        <div className="vr-sheet-head">
          <h3>{translate("Otaq ayarları")}</h3>
          <button type="button" className="vr-icon" onClick={onClose} aria-label={translate("Bağla")}><X size={18} /></button>
        </div>
        <button type="button" className="lv-photo" onClick={() => fileRef.current?.click()}>
          <img src={roomPhoto({ photo })} alt="" />
          <span className="lv-photo-cta"><Camera size={16} />{translate("Otaq şəkli")}</span>
        </button>
        {photo && <button type="button" className="lv-link" onClick={() => setPhoto(null)}>✕</button>}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) try { setPhoto(await compressRoomPhoto(f)); } catch { /* ignore */ } }} />
        <label className="vr-field">
          {translate("Otaq adı")}<input className={bad ? "lv-bad" : ""} value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} maxLength={40} />
        </label>
        <label className="vr-switch">
          <KeyRound size={16} /> <span>{translate("Otaq şifrəsi")}</span>
          <input type="checkbox" checked={passOn} onChange={(e) => { setPassOn(e.target.checked); setErr(""); }} />
        </label>
        {passOn && (
          <label className="vr-field">
            <input type="password" value={pass} maxLength={32} placeholder={room.has_password ? translate("Yeni şifrə (boş = dəyişmə)") : translate("Şifrə yaz")} onChange={(e) => { setPass(e.target.value); setErr(""); }} />
          </label>
        )}
        {(bad || err) && <p className="lv-warn" role="alert"><AlertTriangle size={15} />{bad ? warning : err}</p>}
        <button type="button" className="vr-primary" disabled={busy || bad} onClick={save}>{translate("Yadda saxla")}</button>
        <button type="button" className="vr-danger" disabled={busy} onClick={remove}>
          <Trash2 size={15} />
          {translate("Otağı bağla və sil")}</button>
      </div>
    </div>
  );
}

export const VR_STYLES = `
.vr{--vr-bg:oklch(.2 .04 225);--vr-bg2:oklch(.28 .05 215);--vr-surface:oklch(1 0 0 / .1);--vr-glass:oklch(.32 .05 215 / .55);--vr-line:oklch(1 0 0 / .14);--vr-ink:oklch(.98 .005 220);--vr-dim:oklch(.8 .02 220 / .8);--vr-accent:oklch(.82 .14 80);--vr-accent2:oklch(.7 .2 355);--vr-live:oklch(.78 .17 160);--vr-teal:oklch(.8 .12 185);
position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;color:var(--vr-ink);font-family:'Manrope',system-ui,sans-serif;overflow:hidden;
background:radial-gradient(120% 70% at 50% 0%,var(--vr-bg2),var(--vr-bg) 60%);background-size:cover;background-position:center bottom;padding:max(10px,env(safe-area-inset-top)) 0 max(8px,env(safe-area-inset-bottom));animation:vr-in .3s ease-out;}
.vr>*{position:relative;z-index:1;}
.vr .vr-sky{position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(oklch(.12 .03 230 / .25),oklch(.12 .03 230 / .05) 40%,oklch(.1 .03 230 / .55));}
.vr *{box-sizing:border-box;}
.vr button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;}
.vr-top{display:flex;align-items:center;gap:6px;padding:4px 12px 6px 4px;}
.vr-back{all:unset;display:grid;place-items:center;width:38px;height:44px;flex-shrink:0;}
.vr-plate{display:flex;align-items:center;gap:8px;min-width:0;padding:4px 6px 4px 4px;border-radius:16px;background:oklch(.15 .03 230 / .55);backdrop-filter:blur(10px);border:1px solid var(--vr-line);}
.vr-room-ava{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:var(--cover);box-shadow:inset 0 0 0 1px oklch(1 0 0 / .2),0 4px 14px oklch(0 0 0 / .35);flex-shrink:0;}
.vr-title{min-width:0;display:flex;flex-direction:column;gap:1px;}
.vr-title strong{font-size:15px;font-weight:800;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;}
.vr-id{all:unset;display:inline-flex;gap:4px;align-items:center;font-size:11px;color:var(--vr-dim);cursor:pointer;}
.vr-kind-badge{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;background:radial-gradient(circle at 35% 30%,oklch(.88 .14 80),oklch(.62 .16 50));color:oklch(.25 .06 50);box-shadow:0 0 0 2px oklch(.85 .12 80 / .35),0 4px 10px oklch(0 0 0 / .4);}
.vr-top-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
.vr-host{width:38px;height:38px;border-radius:50%;padding:2px;background:conic-gradient(from 200deg,oklch(.85 .14 80),oklch(.6 .17 40),oklch(.85 .14 80));box-shadow:0 4px 12px oklch(0 0 0 / .4);}
.vr-host img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;}
.vr-dots{all:unset;position:relative;display:grid;place-items:center;width:34px;height:34px;}
.vr-dots::after{content:"";position:absolute;top:2px;right:2px;width:7px;height:7px;border-radius:50%;background:oklch(.65 .23 15);}
.vr-subrow{display:flex;justify-content:space-between;align-items:center;padding:2px 14px 4px;}
.vr-status{font-size:12px;font-weight:800;display:inline-flex;align-items:center;gap:6px;padding:5px 12px 5px 8px;border-radius:20px;background:linear-gradient(90deg,oklch(.55 .15 155),oklch(.45 .12 165));box-shadow:inset 0 1px 0 oklch(1 0 0 / .25),0 4px 10px oklch(0 0 0 / .3);}
.vr-status i{width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 35%,oklch(.95 .08 160),var(--vr-live));animation:vr-pulse 1.6s infinite;}
.vr-status.connecting{background:var(--vr-glass);}.vr-status.error{background:oklch(.5 .18 25 / .7);}
.vr-gift-chip{all:unset;cursor:pointer;font-size:13px;font-weight:700;padding:7px 14px;border-radius:20px;background:oklch(.15 .03 230 / .55);backdrop-filter:blur(10px);border:1px solid var(--vr-line);}
.vr-stage{display:flex;flex-direction:column;align-items:stretch;gap:14px;padding:14px 0 8px;}
.vr-seats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:30px 0;width:100%;max-width:460px;margin:0 auto;padding:0 10px;justify-items:center;}
.vr-seat{position:relative;width:min(19vw,72px);aspect-ratio:1;display:grid;place-items:center;}
.vr-kind-video .vr-seats{gap:28px 8px;padding:0 12px;}
.vr-kind-video .vr-seat{width:100%;aspect-ratio:3/4;}
.vr-ava{position:relative;z-index:2;width:100%;height:100%;border-radius:50%;overflow:hidden;border:2px solid oklch(1 0 0 / .85);background:oklch(.2 .03 230 / .6);box-shadow:0 6px 18px oklch(0 0 0 / .4);transition:transform .15s,border-color .2s;}
.vr-kind-video .vr-ava,.vr-kind-video .vr-ring,.vr-kind-video .vr-empty{border-radius:18px;}
.vr-ava img,.vr-ava video{width:100%;height:100%;object-fit:cover;display:block;}
.vr-seat.me .vr-ava video{transform:scaleX(-1);}
.vr-seat.cam .vr-ava{border-color:var(--vr-accent);}
.vr-seat.me .vr-ava{border-color:oklch(.85 .13 80);}
.vr-seat.speaking .vr-ava{border-color:var(--vr-teal);transform:scale(calc(1 + var(--lvl) * .1));box-shadow:0 0 22px oklch(.8 .12 185 / .7);}
.vr-ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--vr-teal);opacity:0;z-index:1;pointer-events:none;}
.vr-seat.speaking .vr-ring{animation:vr-ripple 1.5s ease-out infinite;}
.vr-seat.speaking .r2{animation-delay:.5s;border-color:var(--vr-accent);}
.vr-seat.speaking .r3{animation-delay:1s;}
.vr-muted{position:absolute;z-index:3;right:-2px;bottom:2px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:oklch(.6 .2 25);border:2px solid oklch(.2 .03 230);}
.vr-crown{position:absolute;z-index:3;top:-13px;font-size:16px;filter:drop-shadow(0 2px 3px oklch(0 0 0 / .5));}
.vr-name{position:absolute;z-index:3;top:calc(100% + 5px);font-size:12px;font-weight:800;max-width:84px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 3px oklch(0 0 0 / .7);}
.vr-eq{position:absolute;z-index:3;bottom:-2px;left:-2px;display:flex;gap:2px;align-items:flex-end;height:10px;opacity:0;transition:opacity .2s;}
.vr-eq i{width:3px;height:3px;border-radius:2px;background:var(--vr-teal);}
.vr-seat.speaking .vr-eq{opacity:1;}
.vr-seat.speaking .vr-eq i{animation:vr-eq .5s ease-in-out infinite alternate;}
.vr-seat.speaking .vr-eq i:nth-child(2){animation-delay:.15s}.vr-seat.speaking .vr-eq i:nth-child(3){animation-delay:.3s}.vr-seat.speaking .vr-eq i:nth-child(4){animation-delay:.08s}
.vr-empty{all:unset;width:100%;height:100%;border-radius:50%;display:grid;place-items:center;color:oklch(1 0 0 / .75);background:radial-gradient(circle at 50% 30%,oklch(1 0 0 / .2),oklch(1 0 0 / .1));backdrop-filter:blur(6px);box-shadow:inset 0 1px 0 oklch(1 0 0 / .2),0 6px 16px oklch(0 0 0 / .25);cursor:pointer;transition:transform .2s,background .2s;}
.vr-empty .vr-plus{display:grid;place-items:center;}
.vr-empty .vr-num{position:absolute;top:calc(100% + 6px);font-size:13px;font-weight:600;color:var(--vr-dim);}
.vr-empty:active{transform:scale(.92);background:oklch(1 0 0 / .22);}
.vr-tools{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 14px 0;}
.vr-pill{all:unset;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 14px;border-radius:20px;font-size:14px;font-weight:700;background:oklch(.15 .03 230 / .55);backdrop-filter:blur(10px);border:1px solid var(--vr-line);}
.vr-pill button{all:unset;cursor:pointer;display:grid;place-items:center;}
.vr-all{font-size:10px;font-weight:900;padding:2px 4px;border-radius:5px;background:var(--vr-ink);color:oklch(.2 .03 230);}
.vr-stand{cursor:pointer;font-size:12px;}
.vr-chat{flex:1;min-height:0;overflow-y:auto;padding:6px 14px;display:flex;flex-direction:column;gap:9px;scrollbar-width:none;-webkit-mask-image:linear-gradient(transparent,#000 8%);mask-image:linear-gradient(transparent,#000 8%);}
.vr-chat.hidden{visibility:hidden;}
.vr-chat::-webkit-scrollbar{display:none}
.vr-msg{display:flex;gap:10px;align-items:flex-start;animation:vr-msg .25s ease-out;max-width:88%;}
.vr-msg-ico{width:32px;height:32px;border-radius:50%;flex-shrink:0;object-fit:cover;display:grid;place-items:center;font-size:16px;background:oklch(1 0 0 / .18);}
.vr-msg p{margin:0;font-size:14.5px;line-height:1.4;padding:9px 13px;border-radius:14px;background:oklch(.32 .06 210 / .6);backdrop-filter:blur(8px);border:1px solid oklch(1 0 0 / .06);overflow-wrap:anywhere;}
.vr-msg b{display:block;font-size:12px;color:var(--vr-teal);}
.vr-msg.gift p{background:linear-gradient(90deg,oklch(.6 .2 350 / .55),oklch(.7 .14 70 / .4));}
.vr-msg.gift b{display:inline;color:var(--vr-ink);}
.vr-emojis{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin:0 12px 6px;padding:8px;border-radius:18px;background:oklch(.18 .03 230 / .85);backdrop-filter:blur(12px);border:1px solid var(--vr-line);animation:vr-up .2s ease-out;}
.vr-emojis button{all:unset;cursor:pointer;font-size:24px;text-align:center;padding:4px 0;border-radius:10px;}
.vr-emojis button:active{background:var(--vr-surface);}
.vr-bar{display:flex;align-items:center;gap:4px;padding:8px 8px 2px;}
.vr-tool{all:unset;flex-shrink:0;width:42px;height:44px;display:grid;place-items:center;cursor:pointer;filter:drop-shadow(0 2px 4px oklch(0 0 0 / .5));transition:transform .15s,color .2s;}
.vr-tool:active{transform:scale(.88);}
.vr-tool.on{color:var(--vr-live);}
.vr-tool.off{color:oklch(.7 .18 25);}
.vr-gift{color:oklch(.78 .16 355);animation:vr-wiggle 3s ease-in-out infinite;}
.vr-input{flex:1;min-width:0;display:flex;align-items:center;gap:6px;height:42px;border-radius:21px;background:oklch(.15 .03 230 / .55);backdrop-filter:blur(10px);border:1px solid var(--vr-line);padding:0 4px 0 8px;}
.vr-emo{all:unset;cursor:pointer;display:grid;place-items:center;color:var(--vr-dim);}
.vr-input input{all:unset;flex:1;min-width:0;font-size:15px;}
.vr-input input::placeholder{color:var(--vr-dim);}
.vr-send{all:unset;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--vr-teal);color:oklch(.22 .05 200);cursor:pointer;flex-shrink:0;}
.vr-icon{all:unset;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:var(--vr-surface);border:1px solid var(--vr-line);cursor:pointer;}
.vr-menu button{all:unset;cursor:pointer;display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border-radius:14px;background:var(--vr-surface);font-size:14px;font-weight:700;}
.vr-menu button.danger{color:oklch(.75 .17 25);}
.vr-kinds{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.vr-kinds button{all:unset;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:6px;height:42px;border-radius:12px;background:var(--vr-surface);border:1.5px solid var(--vr-line);font-size:13px;font-weight:700;}
.vr-kinds button.on{border-color:var(--vr-accent);background:oklch(.82 .14 80 / .15);}
.vr-fly{position:fixed;z-index:80;left:0;top:0;font-size:46px;pointer-events:none;animation:vr-fly 2.2s cubic-bezier(.2,.8,.3,1) forwards;}
.vr-burst{position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px;border-radius:50%;box-shadow:0 0 0 0 var(--vr-accent);opacity:0;animation:vr-burst 2.2s ease-out forwards;}
.vr-toast{position:fixed;z-index:85;left:50%;top:80px;transform:translateX(-50%);padding:8px 14px;border-radius:20px;font-size:12px;background:oklch(0 0 0 / .7);}
.vr-vgift{position:fixed;inset:0;z-index:95;display:grid;place-items:center;background:transparent;pointer-events:none;}
.vr-vgift video{width:min(100%,560px);height:78dvh;object-fit:cover;opacity:.9;mask-image:linear-gradient(transparent,oklch(0 0 0) 16%,oklch(0 0 0) 80%,transparent);}
.vr-vgift-tag{position:absolute;top:max(14px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2;font-size:13px;padding:8px 16px;border-radius:20px;background:oklch(.15 .03 230 / .7);border:1px solid var(--vr-line);max-width:calc(100% - 100px);display:flex;align-items:center;gap:8px;overflow-wrap:anywhere;}
.vr-vgift-tag img{width:32px;height:32px;object-fit:cover;border-radius:6px;}
.vr-vgift-tag b{color:var(--vr-accent);}
.vr-vgift-x{pointer-events:auto;position:absolute;top:max(14px,env(safe-area-inset-top));right:14px;z-index:2;}
.vr-sheet-wrap{position:fixed;inset:0;z-index:90;background:oklch(0 0 0 / .5);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);}
.vr-sheet{width:min(100%,520px);background:oklch(.22 .04 225);border-radius:22px 22px 0 0;padding:16px 16px max(18px,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:12px;animation:vr-up .25s ease-out;border-top:1px solid var(--vr-line);}
.vr-sheet-head{display:flex;justify-content:space-between;align-items:center;}.vr-sheet-head h3{margin:0;font-size:16px;}
.vr-to{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}
.vr-to button{all:unset;cursor:pointer;flex-shrink:0;display:flex;align-items:center;gap:6px;font-size:12px;padding:5px 10px 5px 5px;border-radius:20px;background:var(--vr-surface);border:1px solid var(--vr-line);}
.vr-to button.on{border-color:var(--vr-accent);background:oklch(.78 .16 70 / .18);}
.vr-to img,.vr-all{width:24px;height:24px;border-radius:50%;object-fit:cover;display:grid;place-items:center;font-size:14px;}
.vr-gift-sheet{--vr-catalog:oklch(.2 .008 280);background:var(--vr-catalog);max-height:70dvh;overflow:auto;border-radius:8px 8px 0 0;}
.vr-gift-sheet h3{display:flex;align-items:center;gap:8px;}
.vr-gift-tabs{border-bottom:1px solid var(--vr-line);padding:10px 0;font-size:13px;font-weight:800;}
.vr-gift-tabs span{border-bottom:2px solid var(--vr-ink);padding-bottom:10px;}
.vr-gifts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;min-height:160px;}
.vr-gift-item{min-width:0;text-align:center;border:1px solid var(--vr-line);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:6px;padding-top:6px;}
.vr-gift-art{position:relative;width:100%;aspect-ratio:1;}
.vr-gift-art img{width:100%;height:100%;object-fit:cover;display:block;}
.vr-gift-sound{position:absolute;top:2px;left:2px;border-radius:4px;padding:3px;display:grid;place-items:center;background:var(--vr-glass);}
.vr-gift-item strong{font-size:12px;font-weight:600;}
.vr .vr-gift-send{border-radius:0;min-height:36px;width:100%;background:var(--vr-teal);color:var(--vr-bg);font-size:12px;padding:4px 2px;white-space:normal;}
.vr-sound-recover{position:absolute;bottom:15dvh;right:18px;pointer-events:auto;background:var(--vr-glass);border:1px solid var(--vr-line);}
.vr button:disabled{opacity:.5;cursor:wait;}

.vr-field{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--vr-dim);}
.vr-field input{all:unset;height:42px;padding:0 12px;border-radius:12px;background:var(--vr-surface);border:1px solid var(--vr-line);color:var(--vr-ink);font-size:14px;}
.vr-covers{display:flex;gap:8px;flex-wrap:wrap;}
.vr-cover-pick{all:unset;cursor:pointer;width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:22px;background:var(--cover);border:2px solid transparent;}
.vr-cover-pick.on{border-color:var(--vr-ink);}
.vr-primary{all:unset;cursor:pointer;text-align:center;height:46px;line-height:46px;border-radius:14px;font-weight:800;background:linear-gradient(140deg,var(--vr-accent),var(--vr-accent2));color:oklch(.2 .04 30);}
.vr-danger{all:unset;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:6px;height:40px;border-radius:14px;font-size:13px;color:oklch(.75 .17 25);border:1px solid oklch(.65 .2 25 / .5);}
.vr-err{margin:0;font-size:12px;color:oklch(.75 .17 25);}
.vr-cover-emerald{--cover:linear-gradient(140deg,oklch(.62 .15 165),oklch(.42 .1 190));}
.vr-cover-sunset{--cover:linear-gradient(140deg,oklch(.78 .16 60),oklch(.6 .21 20));}
.vr-cover-night{--cover:linear-gradient(140deg,oklch(.45 .12 270),oklch(.25 .08 285));}
.vr-cover-rose{--cover:linear-gradient(140deg,oklch(.72 .17 0),oklch(.52 .2 340));}
.vr-cover-gold{--cover:linear-gradient(140deg,oklch(.86 .15 90),oklch(.65 .14 65));}
.vr-cover-ocean{--cover:linear-gradient(140deg,oklch(.72 .13 220),oklch(.48 .14 250));}
@keyframes vr-in{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:none}}
@keyframes vr-up{from{transform:translateY(100%)}to{transform:none}}
@keyframes vr-msg{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes vr-ripple{0%{transform:scale(1);opacity:.85}100%{transform:scale(1.75);opacity:0}}
@keyframes vr-eq{from{height:3px}to{height:10px}}
@keyframes vr-breath{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes vr-pulse{0%{box-shadow:0 0 0 0 oklch(.75 .18 155 / .7)}100%{box-shadow:0 0 0 7px oklch(.75 .18 155 / 0)}}
@keyframes vr-wiggle{0%,90%,100%{transform:rotate(0)}93%{transform:rotate(-12deg)}96%{transform:rotate(12deg)}}
@keyframes vr-fly{0%{transform:translate(50vw,100dvh) translate(-50%,-50%) scale(.4);opacity:0}15%{opacity:1}55%{transform:translate(var(--tx),var(--ty)) translate(-50%,-50%) scale(1.5)}75%{transform:translate(var(--tx),var(--ty)) translate(-50%,-50%) scale(1.2) rotate(-8deg)}100%{transform:translate(var(--tx),calc(var(--ty) - 40px)) translate(-50%,-50%) scale(.6);opacity:0}}
@keyframes vr-burst{0%,50%{opacity:0;box-shadow:0 0 0 0 oklch(.78 .16 70 / .9)}55%{opacity:1}100%{opacity:0;box-shadow:0 0 0 60px oklch(.78 .16 70 / 0)}}
@media(prefers-reduced-motion:reduce){.vr *,.vr{animation:none!important;transition:none!important}}

.vr-head{display:flex;align-items:center;gap:10px;margin:0 10px;padding:10px 10px 10px 12px;border-radius:20px;background:oklch(.17 .015 260 / .82);backdrop-filter:blur(14px);border:1px solid oklch(1 0 0 / .08);box-shadow:0 10px 30px oklch(0 0 0 / .35);}
.vr-head-ava{all:unset;flex-shrink:0;width:46px;height:46px;border-radius:14px;overflow:hidden;box-shadow:0 0 0 2px oklch(.8 .14 75 / .7);}
.vr-head-ava img{width:100%;height:100%;object-fit:cover;display:block;}
.vr-head-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}
.vr-head-text strong{font-size:16px;font-weight:850;color:oklch(.82 .14 75);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.vr-head-id{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;letter-spacing:.12em;color:oklch(.72 .01 260);}
.vr-head-id b{font-family:ui-monospace,monospace;font-size:14px;letter-spacing:.06em;color:oklch(.8 .18 155);}
.vr-head-pill{all:unset;cursor:pointer;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:42px;height:42px;padding:0 10px;border-radius:14px;font-size:14px;font-weight:850;background:oklch(.12 .01 260 / .8);border:1px solid oklch(1 0 0 / .07);}
.vr-head-pill:active{transform:scale(.93);}
.vr-roomname{align-self:center;margin:8px 0 2px;padding:4px 14px;border-radius:12px;font-size:12.5px;font-weight:800;background:oklch(0 0 0 / .35);backdrop-filter:blur(8px);max-width:80%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.vr.vr-kind-voice{background-size:cover;background-position:center;}
.vr.vr-kind-voice .vr-sky{background:linear-gradient(oklch(.1 .01 260 / .55),oklch(.1 .01 260 / .35) 40%,oklch(.08 .01 260 / .8));}
.vr .vr-seats{grid-template-columns:repeat(5,minmax(0,1fr));gap:34px 4px;max-width:440px;padding:14px 10px 0;}
.vr .vr-seat{width:min(16.5vw,66px);}
.vr-numchip{position:absolute;z-index:4;top:-9px;left:50%;transform:translateX(-50%);min-width:22px;height:18px;padding:0 6px;border-radius:9px;display:grid;place-items:center;font-size:10.5px;font-weight:900;font-family:ui-monospace,monospace;background:oklch(.16 .01 260 / .95);border:1px solid oklch(1 0 0 / .14);color:oklch(.95 0 0);box-shadow:0 3px 8px oklch(0 0 0 / .4);}
.vr .vr-empty{background:radial-gradient(circle at 50% 28%,oklch(.42 .09 165 / .75),oklch(.2 .05 175 / .85));border:1.5px solid oklch(.75 .15 160 / .35);color:oklch(.82 .17 155);box-shadow:inset 0 2px 0 oklch(1 0 0 / .12),0 8px 18px oklch(0 0 0 / .4),0 0 0 4px oklch(.7 .15 160 / .08);}
.vr .vr-empty:not(:disabled):hover{box-shadow:inset 0 2px 0 oklch(1 0 0 / .12),0 8px 18px oklch(0 0 0 / .4),0 0 18px oklch(.75 .17 155 / .45);}
.vr .vr-empty:disabled{opacity:.6;}
.vr-msg.join{align-items:center;border-radius:16px;background:oklch(.15 .01 260 / .8);border:1px solid oklch(1 0 0 / .08);animation:vr-msg .3s ease-out both;}
.vr-msg.join .vr-msg-ico{color:oklch(.8 .18 155);background:transparent;display:grid;place-items:center;}
.vr-msg.join b{color:oklch(.8 .18 155);margin-right:4px;}

/* compact, no-scroll mobile layout */
.vr{height:100dvh;padding:max(6px,env(safe-area-inset-top)) 0 max(6px,env(safe-area-inset-bottom));}
.vr-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px;margin:0 8px;padding:7px 7px 7px 8px;border-radius:16px;}
.vr-head-ava{width:38px;height:38px;border-radius:12px;}
.vr-head-text{overflow:hidden;}
.vr-head-text strong{font-size:14px;}
.vr-head-id{font-size:10px;letter-spacing:.06em;white-space:nowrap;overflow:hidden;max-width:100%;}
.vr-head-id b{font-size:12px;}
.vr-head-right{display:flex;align-items:center;gap:5px;flex-shrink:0;}
.vr-head-pill{min-width:32px;height:32px;padding:0 8px;border-radius:11px;font-size:12.5px;gap:4px;}
.vr-roomname{display:inline-flex;align-items:center;gap:4px;margin:6px 0 0;font-size:11.5px;padding:3px 12px;}
.vr-stage{gap:6px;padding:6px 0 2px;flex-shrink:0;}
.vr .vr-seats{gap:26px 4px;padding:12px 10px 0;max-width:400px;}
.vr .vr-seat{width:min(14.5vw,56px);}
.vr-name{font-size:10.5px;max-width:64px;top:calc(100% + 3px);}
.vr-crown{font-size:13px;top:-12px;right:-4px;}
.vr-numchip{top:-8px;min-width:18px;height:15px;font-size:9px;padding:0 4px;}
.vr .vr-seat.taken{cursor:pointer;}
.vr .vr-empty[data-locked]{background:oklch(.2 .01 260 / .85);color:oklch(.8 .14 75);border-color:oklch(.8 .14 75 / .35);}
.vr-tools{padding:14px 12px 0;}
.vr-pill{height:30px;padding:0 11px;font-size:12px;gap:6px;cursor:pointer;}
.vr-chat{gap:6px;padding:4px 12px;}
.vr-msg-ico{width:26px;height:26px;font-size:14px;}
.vr-msg p{font-size:13px;padding:6px 10px;border-radius:12px;}
.vr-msg b{font-size:11px;}
.vr-x{font-style:italic;font-weight:900;color:oklch(.9 .15 90);}
.vr-bar{padding:6px 6px 0;gap:2px;}
.vr-tool{width:38px;height:40px;}
.vr-tool svg{width:22px;height:22px;}
.vr-input{height:38px;}
.vr-input input{font-size:14px;}
.vr-enter{position:fixed;z-index:72;left:0;top:30%;display:flex;align-items:center;gap:6px;padding:4px 14px 4px 4px;border-radius:0 18px 18px 0;font-size:12px;background:linear-gradient(90deg,oklch(.55 .17 155 / .95),oklch(.45 .14 165 / .6));box-shadow:0 6px 16px oklch(0 0 0 / .3);animation:vr-enter 2.6s cubic-bezier(.2,.9,.3,1) forwards;pointer-events:none;}
.vr-enter img{width:26px;height:26px;border-radius:50%;object-fit:cover;}
@keyframes vr-enter{0%{transform:translateX(-100%)}15%,80%{transform:none;opacity:1}100%{transform:translateX(-100%);opacity:0}}
.vr-seat-menu{gap:8px;}
.vr-who{display:flex;align-items:center;gap:10px;padding:2px 4px 6px;font-size:15px;}
.vr-who img{width:44px;height:44px;border-radius:50%;object-fit:cover;}
.vr-who span{margin-left:auto;font-size:12px;opacity:.7;}
.vr-menu button{height:44px;font-size:13.5px;}
.vr-kick small,.vr-invite-list small{display:flex;align-items:center;gap:6px;font-size:11.5px;opacity:.75;margin:2px 4px 6px;}
.vr-kick div{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
.vr-kick div button{justify-content:center;padding:0;height:38px;font-size:12.5px;}
.vr-invite-list{display:flex;flex-direction:column;gap:6px;max-height:30dvh;overflow:auto;}
.vr-invite-list button img,.vr-aud-list img{width:28px;height:28px;border-radius:50%;object-fit:cover;}
.vr-invite-list button svg{margin-left:auto;}
.vr-audience{max-height:65dvh;}
.vr-aud-list{display:flex;flex-direction:column;gap:4px;overflow:auto;}
.vr-aud-list button{all:unset;cursor:pointer;display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:12px;background:var(--vr-surface);font-size:13.5px;font-weight:700;}
.vr-aud-list span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.vr-aud-list i{font-style:normal;font-size:11px;opacity:.7;}
.vr-center{align-items:center;}
.vr-invite{width:min(86%,320px);display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;padding:18px;border-radius:20px;background:oklch(.22 .03 230);border:1px solid var(--vr-line);animation:gx-pop .3s ease-out;color:oklch(.8 .17 155);}
.vr-invite p{margin:0;font-size:14px;color:var(--vr-ink);}
.vr-invite div{display:flex;gap:8px;width:100%;}
.vr-invite div button{all:unset;cursor:pointer;flex:1;height:40px;line-height:40px;border-radius:12px;background:var(--vr-surface);font-weight:800;font-size:13px;color:var(--vr-ink);}
.vr-invite div button.ok{background:oklch(.65 .17 155);color:oklch(.15 .03 160);}
.vr-switch{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;padding:8px 10px;border-radius:12px;background:var(--vr-surface);}
.vr-switch span{flex:1;}
.vr-switch input{width:20px;height:20px;accent-color:oklch(.7 .17 155);}
@media (max-height:640px){.vr .vr-seat{width:min(13vw,48px)}.vr .vr-seats{gap:22px 4px;padding-top:10px}.vr-tools{padding-top:10px}}
`;