import { translate, usePreferences } from "@/lib/app-preferences";
// Full-screen live voice/video room: header (cover, ID, settings, exit), tables with seats and
// speaking animations in the middle, chat + gift/send controls at the bottom.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Music2,
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
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import {
  SEAT_COUNT,
  VoiceRoomClient,
  type RoomChat,
  type RoomGift,
  type RoomMember,
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
const GIFTS = [{ key: "video", name: "Peqas", artwork: VIDEO_GIFT_ARTWORK, sound: true }];
const giftEmoji = (_k?: string) => "🎁";

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
  const [giftQueue, setGiftQueue] = useState<RoomGift[]>([]);
  const [giftBusy, setGiftBusy] = useState(false);
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
      onChat: (m) => setChat((prev) => [...prev.slice(-80), m]),
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

  function launchGift(g: RoomGift) {
    if (g.gift === "video") {
      setGiftQueue(prev => [...prev, g]);
      return;
    }
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
            onClick={() => void sit(i)}
            aria-label={`${i + 1}. yerə otur`}
          >
            <span className="vr-numchip">{i + 1}</span>
            <span className="vr-plus">
              <Plus size={26} strokeWidth={2} />
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
      <style>{VR_STYLES}</style>
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
        <span className="vr-head-pill"><Users size={16} />{members.length}</span>
        <button type="button" className="vr-head-pill vr-head-more" onClick={() => setMenuOpen(true)} aria-label="Menyu"><MoreHorizontal size={18} /></button>
        <button type="button" className="vr-head-pill" onClick={onLeave} aria-label={translate("Otaqdan çıx")}><LogOut size={18} /></button>
      </header>
      <div className="vr-roomname">{roomTitle(room.name)}</div>
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
          <span className="vr-pill">
            <UserRound size={16} />
            {listeners.length}
          </span>
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
                <b>{m.to === me.id ? translate("sənə") : m.toName}</b> {translate("hədiyyə göndərdi")}</p>
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

      {giftOpen && (
        <div
          className="vr-sheet-wrap"
          onClick={(e) => {
            if (e.target === e.currentTarget) setGiftOpen(false);
          }}
        >
          <div className="vr-sheet vr-gift-sheet">
            <div className="vr-sheet-head">
              <h3><Gift size={18} /> {translate("Hədiyyələr")}</h3>
              <button
                type="button"
                className="vr-icon"
                onClick={() => setGiftOpen(false)}
                aria-label={translate("Bağla")}
              >
                <X size={18} />
              </button>
            </div>
            <div className="vr-to">
              <button
                type="button"
                className={giftTo === null ? "on" : ""}
                onClick={() => setGiftTo(null)}
              >
                <span className="vr-all">🎉</span>{translate("Hamıya")}</button>
              {members
                .filter((m) => m.id !== me.id)
                .map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={giftTo === m.id ? "on" : ""}
                    onClick={() => setGiftTo(m.id)}
                  >
                    <img src={m.photo || defaultPhoto} alt="" />
                    {m.name}
                  </button>
                ))}
            </div>
            <div className="vr-gift-tabs"><span>{translate("SƏSLİ")}</span></div>
            <div className="vr-gifts">
              {GIFTS.map(g => <div key={g.key} className="vr-gift-item">
                <div className="vr-gift-art"><img src={g.artwork} alt={g.name} /><span className="vr-gift-sound" title={translate("Səsli hədiyyə")}><Music2 size={14} /></span></div>
                <strong>{g.name}</strong>
                <Button variant="ghost" className="vr-gift-send" disabled={giftBusy || status !== "live"} onClick={async () => {
                  const c = client.current;
                  if (!c || giftBusy) return;
                  setGiftBusy(true);
                  try {
                    const sent = await c.sendGift(members.find(m => m.id === giftTo) ?? null, g.key);
                    if (sent) setGiftOpen(false);
                    else flash(translate("Hədiyyə göndərilmədi. Bağlantını yoxla."));
                  } finally { setGiftBusy(false); }
                }}>{giftBusy ? translate("Göndərilir…") : translate("Göndər")}</Button>
              </div>)}
            </div>
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
    setBusy(false);
    if (error) setErr(/banned_word/.test(error.message) ? warning : error.message);
    else onSaved(data as VoiceRoomRow);
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
`;
