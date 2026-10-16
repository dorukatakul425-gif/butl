// Full-screen live voice/video room: header (cover, ID, settings, exit), tables with seats and
// speaking animations in the middle, chat + gift/send controls at the bottom.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Gift,
  LogOut,
  Mic,
  MicOff,
  Send,
  Settings,
  Users,
  Video,
  VideoOff,
  X,
  Trash2,
  Check,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import {
  SEAT_COUNT,
  VoiceRoomClient,
  type RoomChat,
  type RoomGift,
  type RoomMember,
} from "@/lib/voice-rtc";
import { ROOM_COVERS, coverOf, type VoiceRoomRow } from "./live-rooms";
import roomBg from "@/assets/room-bg-calm.jpg";

const GIFTS = [
  { key: "rose", emoji: "🌹", name: "Qızılgül" },
  { key: "heart", emoji: "💖", name: "Ürək" },
  { key: "kiss", emoji: "💋", name: "Öpüş" },
  { key: "bear", emoji: "🧸", name: "Ayıcıq" },
  { key: "ring", emoji: "💍", name: "Üzük" },
  { key: "crown", emoji: "👑", name: "Tac" },
  { key: "rocket", emoji: "🚀", name: "Raket" },
  { key: "fire", emoji: "🔥", name: "Alov" },
];
const giftEmoji = (k?: string) => GIFTS.find((g) => g.key === k)?.emoji ?? "🎁";

type Me = { id: string; name: string; photo: string | null };
type Flying = RoomGift & { x: number; y: number };

function VideoTile({ stream, muted }: { stream: MediaStream; muted: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) ref.current.srcObject = stream;
  }, [stream]);
  return <video ref={ref} autoPlay playsInline muted={muted} />;
}
function RemoteAudio({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream;
      void ref.current.play().catch(() => undefined);
    }
  }, [stream]);
  return <audio ref={ref} autoPlay />;
}

export function VoiceRoom({
  room: initial,
  me,
  defaultPhoto,
  onLeave,
  onPresence,
}: {
  room: VoiceRoomRow;
  me: Me;
  defaultPhoto: string;
  onLeave: () => void;
  onPresence: (inRoom: boolean) => void;
}) {
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
      text: "Otağa xoş gəldin! Hörmətli ünsiyyət qaydalarına əməl et.",
      at: Date.now(),
      kind: "system",
    },
  ]);
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");
  const [text, setText] = useState("");
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftTo, setGiftTo] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [flying, setFlying] = useState<Flying[]>([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const client = useRef<VoiceRoomClient | null>(null);
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
      onMembers: setMembers,
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
          flash("Otaq sahibi otağı bağladı");
          window.setTimeout(() => onLeave(), 1200);
        } else
          void sb
            .from("voice_rooms")
            .select("id,code,name,cover,owner_id,created_at")
            .eq("id", room.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) setRoom(data as VoiceRoomRow);
            });
      },
      onStatus: setStatus,
    });
    client.current = c;
    void c.start();
    onPresence(true);
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
    if (!client.current?.toggleMic()) flash("Mikrofona icazə verilməyib");
    else setMembers((ms) => ms.map((m) => (m.id === me.id ? client.current!.me : m)));
  };
  const toggleCam = () => {
    if (!client.current?.toggleCam()) flash("Kameraya icazə verilməyib");
    else setMembers((ms) => ms.map((m) => (m.id === me.id ? client.current!.me : m)));
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
    const stream = m ? streams[m.id] : undefined;
    const camOn = Boolean(m && m.cam && stream);
    return (
      <div
        key={i}
        ref={(el) => {
          seatRefs.current[i] = el;
        }}
        className={`vr-seat${m ? " taken" : ""}${speaking ? " speaking" : ""}${m?.id === me.id ? " me" : ""}${camOn ? " cam" : ""}`}
        style={{ ["--lvl" as string]: String(lvl) }}
      >
        {m ? (
          <>
            <span className="vr-ring r1" />
            <span className="vr-ring r2" />
            <span className="vr-ring r3" />
            <div className="vr-ava">
              {camOn && stream ? (
                <VideoTile stream={stream} muted />
              ) : (
                <img src={m.photo || defaultPhoto} alt={m.name} />
              )}
            </div>
            {!m.mic && (
              <span className="vr-muted">
                <MicOff size={11} />
              </span>
            )}
            {m.id === room.owner_id && <span className="vr-crown">👑</span>}
            <span className="vr-name">{m.id === me.id ? "Sən" : m.name}</span>
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
            onClick={() => client.current?.setSeat(i)}
            aria-label={`${i + 1}. yerə otur`}
          >
            <span className="vr-plus">+</span>
            <span className="vr-num">{i + 1}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={`vr vr-cover-${cover.key}`}
      role="dialog"
      aria-modal="true"
      aria-label={room.name}
      style={{
        backgroundImage: `linear-gradient(oklch(.12 .03 250 / .55), oklch(.12 .03 250 / .75)), url(${roomBg})`,
      }}
    >
      <style>{VR_STYLES}</style>
      {Object.entries(streams)
        .filter(([id]) => id !== me.id)
        .map(([id, s]) => (
          <RemoteAudio key={id} stream={s} />
        ))}
      <header className="vr-top">
        <div className="vr-room-ava">
          <span>{cover.emoji}</span>
        </div>
        <div className="vr-title">
          <strong>{room.name}</strong>
          <button type="button" className="vr-id" onClick={copyId}>
            ID: {room.code} {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        </div>
        <span className="vr-count">
          <Users size={13} />
          {members.length}
        </span>
        {isOwner && (
          <button
            type="button"
            className="vr-icon"
            onClick={() => setSettingsOpen(true)}
            aria-label="Otaq ayarları"
          >
            <Settings size={18} />
          </button>
        )}
        <button
          type="button"
          className="vr-icon vr-exit"
          onClick={onLeave}
          aria-label="Otaqdan çıx"
        >
          <LogOut size={18} />
        </button>
      </header>
      <div className={`vr-status ${status}`}>
        {status === "live" ? (
          <>
            <i />
            Canlı
          </>
        ) : status === "connecting" ? (
          "Qoşulur…"
        ) : (
          "Bağlantı xətası — yenidən cəhd et"
        )}
      </div>

      <main className="vr-stage">
        <div className="vr-seats">
          {Array.from({ length: SEAT_COUNT }, (_, i) => renderSeat(i))}
        </div>
        {listeners.length > 0 && (
          <div className="vr-listeners">
            <span>Dinləyicilər</span>
            {listeners.map((m) => (
              <img key={m.id} src={m.photo || defaultPhoto} alt={m.name} title={m.name} />
            ))}
          </div>
        )}
        {meMember?.seat !== null && meMember && (
          <button type="button" className="vr-stand" onClick={() => client.current?.setSeat(null)}>
            Yerdən qalx
          </button>
        )}
      </main>

      <div className="vr-chat" ref={chatRef}>
        {chat.map((m) =>
          m.kind === "system" ? (
            <p key={m.id} className="vr-msg sys">
              {m.text}
            </p>
          ) : m.kind === "gift" ? (
            <p key={m.id} className="vr-msg gift">
              <b>{m.from === me.id ? "Sən" : m.name}</b> →{" "}
              <b>{m.to === me.id ? "sənə" : m.toName}</b> {giftEmoji(m.gift)} göndərdi
            </p>
          ) : (
            <p key={m.id} className="vr-msg">
              <img src={m.photo || defaultPhoto} alt="" />
              <span>
                <b>{m.from === me.id ? "Sən" : m.name}</b>
                {m.text}
              </span>
            </p>
          ),
        )}
      </div>

      <footer className="vr-bar">
        <button
          type="button"
          className={`vr-round${meMember?.mic ? " on" : ""}`}
          onClick={toggleMic}
          aria-label="Mikrofon"
        >
          {meMember?.mic ? <Mic size={19} /> : <MicOff size={19} />}
        </button>
        <button
          type="button"
          className={`vr-round${meMember?.cam ? " on" : ""}`}
          onClick={toggleCam}
          aria-label="Kamera"
        >
          {meMember?.cam ? <Video size={19} /> : <VideoOff size={19} />}
        </button>
        <div className="vr-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Mesaj yaz…"
            maxLength={300}
            aria-label="Mesaj"
          />
          <button
            type="button"
            className="vr-send"
            onClick={send}
            aria-label="Göndər"
            disabled={!text.trim()}
          >
            <Send size={17} />
          </button>
        </div>
        <button
          type="button"
          className="vr-round vr-gift"
          onClick={() => setGiftOpen(true)}
          aria-label="Hədiyyə göndər"
        >
          <Gift size={19} />
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
          <div className="vr-sheet">
            <div className="vr-sheet-head">
              <h3>Hədiyyə göndər</h3>
              <button
                type="button"
                className="vr-icon"
                onClick={() => setGiftOpen(false)}
                aria-label="Bağla"
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
                <span className="vr-all">🎉</span>Hamıya
              </button>
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
            <div className="vr-gifts">
              {GIFTS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => {
                    client.current?.sendGift(members.find((m) => m.id === giftTo) ?? null, g.key);
                    setGiftOpen(false);
                  }}
                >
                  <span>{g.emoji}</span>
                  {g.name}
                </button>
              ))}
            </div>
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
            flash("Otaq yeniləndi");
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
  const [name, setName] = useState(room.name);
  const [cover, setCover] = useState(room.cover);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const save = async () => {
    const sb = getSupabase();
    if (!sb || !name.trim()) return;
    setBusy(true);
    setErr("");
    const { data, error } = await sb
      .from("voice_rooms")
      .update({ name: name.trim().slice(0, 40), cover })
      .eq("id", room.id)
      .select("id,code,name,cover,owner_id,created_at")
      .single();
    setBusy(false);
    if (error) setErr(error.message);
    else onSaved(data as VoiceRoomRow);
  };
  const remove = async () => {
    const sb = getSupabase();
    if (!sb || !window.confirm("Otaq silinsin?")) return;
    setBusy(true);
    const { error } = await sb.from("voice_rooms").delete().eq("id", room.id);
    setBusy(false);
    if (error) setErr(error.message);
    else onDeleted();
  };
  return (
    <div
      className="vr-sheet-wrap"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="vr-sheet">
        <div className="vr-sheet-head">
          <h3>Otaq ayarları</h3>
          <button type="button" className="vr-icon" onClick={onClose} aria-label="Bağla">
            <X size={18} />
          </button>
        </div>
        <label className="vr-field">
          Otaq adı
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </label>
        <span className="vr-field">Otaq şəkli</span>
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
        {err && <p className="vr-err">{err}</p>}
        <button type="button" className="vr-primary" disabled={busy} onClick={save}>
          Yadda saxla
        </button>
        <button type="button" className="vr-danger" disabled={busy} onClick={remove}>
          <Trash2 size={15} />
          Otağı bağla və sil
        </button>
      </div>
    </div>
  );
}

export const VR_STYLES = `
.vr{--vr-bg:oklch(.17 .03 280);--vr-bg2:oklch(.24 .06 300);--vr-surface:oklch(1 0 0 / .08);--vr-line:oklch(1 0 0 / .12);--vr-ink:oklch(.97 .01 300);--vr-dim:oklch(.78 .03 300);--vr-accent:oklch(.78 .16 70);--vr-accent2:oklch(.68 .22 350);--vr-live:oklch(.75 .18 155);--vr-wood:oklch(.45 .08 50);--vr-wood2:oklch(.32 .06 45);
position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;color:var(--vr-ink);font-family:'Manrope',system-ui,sans-serif;overflow:hidden;
background:radial-gradient(120% 70% at 50% 0%,var(--vr-bg2),var(--vr-bg) 60%);background-size:cover;background-position:center;padding:max(10px,env(safe-area-inset-top)) 0 max(8px,env(safe-area-inset-bottom));animation:vr-in .3s ease-out;}
.vr *{box-sizing:border-box;}
.vr button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;}
.vr-top{display:flex;align-items:center;gap:10px;padding:4px 14px 8px;}
.vr-room-ava{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:22px;background:var(--cover);box-shadow:0 6px 18px oklch(0 0 0 / .35);flex-shrink:0;}
.vr-title{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.vr-title strong{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.vr-id{all:unset;display:inline-flex;gap:4px;align-items:center;font-size:11px;color:var(--vr-dim);cursor:pointer;}
.vr-count{display:inline-flex;gap:4px;align-items:center;font-size:12px;font-weight:700;padding:5px 9px;border-radius:20px;background:var(--vr-surface);border:1px solid var(--vr-line);}
.vr-icon{all:unset;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:var(--vr-surface);border:1px solid var(--vr-line);cursor:pointer;}
.vr-exit{background:oklch(.6 .2 25 / .25);}
.vr-status{align-self:center;font-size:10px;color:var(--vr-dim);display:flex;align-items:center;gap:6px;padding:3px 10px;border-radius:20px;background:var(--vr-surface);}
.vr-status i{width:6px;height:6px;border-radius:50%;background:var(--vr-live);box-shadow:0 0 0 0 var(--vr-live);animation:vr-pulse 1.6s infinite;}
.vr-status.error{color:var(--vr-accent2);}
.vr-stage{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:6px 0;position:relative;}
.vr-seats{display:grid;grid-template-columns:repeat(4,1fr);gap:26px 14px;width:100%;max-width:420px;padding:0 16px;}
.vr-seat{position:relative;width:100%;aspect-ratio:1;display:grid;place-items:center;}
.vr-ava{position:relative;z-index:2;width:100%;height:100%;border-radius:50%;overflow:hidden;border:2px solid var(--vr-line);background:oklch(.2 .03 250 / .6);transition:transform .15s,border-color .2s,border-radius .25s;}
.vr-ava img,.vr-ava video{width:100%;height:100%;object-fit:cover;display:block;}
.vr-ava video{transform:scaleX(-1);}
.vr-seat.cam{grid-column:span 2;}
.vr-seat.cam .vr-ava{border-radius:18px;border-color:oklch(.78 .16 70 / .6);box-shadow:0 10px 28px oklch(0 0 0 / .45);}
.vr-seat.cam .vr-ring{border-radius:18px;}
.vr-seat.me .vr-ava{border-color:oklch(.78 .16 70 / .7);}
.vr-seat.speaking .vr-ava{border-color:var(--vr-accent);transform:scale(calc(1 + var(--lvl) * .12));box-shadow:0 0 18px oklch(.78 .16 70 / .7);}
.vr-ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--vr-accent);opacity:0;z-index:1;pointer-events:none;}
.vr-seat.speaking .vr-ring{animation:vr-ripple 1.5s ease-out infinite;}
.vr-seat.speaking .r2{animation-delay:.5s;border-color:var(--vr-accent2);}
.vr-seat.speaking .r3{animation-delay:1s;}
.vr-muted{position:absolute;z-index:3;right:-2px;bottom:4px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:oklch(.6 .2 25);border:2px solid var(--vr-bg);}
.vr-crown{position:absolute;z-index:3;top:-12px;font-size:15px;filter:drop-shadow(0 2px 3px oklch(0 0 0 / .5));}
.vr-name{position:absolute;z-index:3;top:calc(100% + 1px);font-size:10px;font-weight:700;max-width:74px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:1px 6px;border-radius:8px;background:oklch(0 0 0 / .45);}
.vr-eq{position:absolute;z-index:3;top:calc(100% + 16px);display:flex;gap:2px;align-items:flex-end;height:10px;opacity:0;transition:opacity .2s;}
.vr-eq i{width:3px;height:3px;border-radius:2px;background:var(--vr-accent);}
.vr-seat.speaking .vr-eq{opacity:1;}
.vr-seat.speaking .vr-eq i{animation:vr-eq .5s ease-in-out infinite alternate;}
.vr-seat.speaking .vr-eq i:nth-child(2){animation-delay:.15s}.vr-seat.speaking .vr-eq i:nth-child(3){animation-delay:.3s}.vr-seat.speaking .vr-eq i:nth-child(4){animation-delay:.08s}
.vr-empty{all:unset;width:100%;height:100%;border-radius:50%;display:grid;place-items:center;color:var(--vr-dim);border:1.5px dashed var(--vr-line);background:oklch(1 0 0 / .05);cursor:pointer;transition:transform .2s,background .2s;}
.vr-empty .vr-plus{font-size:26px;font-weight:300;line-height:1;}
.vr-empty .vr-num{position:absolute;top:calc(100% + 4px);font-size:11px;font-weight:600;color:var(--vr-dim);}
.vr-empty:active{transform:scale(.92);background:var(--vr-surface);}
.vr-listeners{display:flex;align-items:center;gap:4px;font-size:10px;color:var(--vr-dim);padding:4px 10px;border-radius:20px;background:var(--vr-surface);}
.vr-listeners span{margin-right:4px}.vr-listeners img{width:22px;height:22px;border-radius:50%;object-fit:cover;margin-left:-6px;border:2px solid var(--vr-bg);}
.vr-stand{all:unset;cursor:pointer;font-size:10px;color:var(--vr-dim);padding:3px 10px;border-radius:12px;border:1px solid var(--vr-line);}
.vr-chat{height:min(25dvh,180px);overflow-y:auto;padding:4px 14px;display:flex;flex-direction:column;gap:5px;scrollbar-width:none;-webkit-mask-image:linear-gradient(transparent,#000 22%);mask-image:linear-gradient(transparent,#000 22%);}
.vr-chat::-webkit-scrollbar{display:none}
.vr-msg{margin:0;display:flex;gap:7px;align-items:flex-start;font-size:12.5px;line-height:1.4;animation:vr-msg .25s ease-out;}
.vr-msg img{width:22px;height:22px;border-radius:50%;object-fit:cover;flex-shrink:0;}
.vr-msg span{background:oklch(0 0 0 / .32);padding:5px 10px;border-radius:12px 12px 12px 4px;overflow-wrap:anywhere;}
.vr-msg b{display:block;font-size:10.5px;color:var(--vr-accent);}
.vr-msg.sys{align-self:center;font-size:10.5px;color:var(--vr-dim);text-align:center;}
.vr-msg.gift{align-self:flex-start;display:block;padding:5px 10px;border-radius:12px;background:linear-gradient(90deg,oklch(.68 .22 350 / .35),oklch(.78 .16 70 / .25));}
.vr-msg.gift b{display:inline;color:var(--vr-ink);}
.vr-bar{display:flex;align-items:center;gap:7px;padding:8px 12px 2px;}
.vr-round{all:unset;flex-shrink:0;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--vr-surface);border:1px solid var(--vr-line);cursor:pointer;transition:transform .15s,background .2s;}
.vr-round:active{transform:scale(.9);}
.vr-round.on{background:var(--vr-live);color:oklch(.2 .04 155);border-color:transparent;}
.vr-gift{background:linear-gradient(140deg,var(--vr-accent2),var(--vr-accent));border-color:transparent;animation:vr-wiggle 3s ease-in-out infinite;}
.vr-input{flex:1;min-width:0;display:flex;align-items:center;height:42px;border-radius:21px;background:var(--vr-surface);border:1px solid var(--vr-line);padding:0 4px 0 14px;}
.vr-input input{all:unset;flex:1;min-width:0;font-size:14px;}
.vr-input input::placeholder{color:var(--vr-dim);}
.vr-send{all:unset;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--vr-accent);color:oklch(.25 .05 60);cursor:pointer;}
.vr-send:disabled{opacity:.4;}
.vr-fly{position:fixed;z-index:80;left:0;top:0;font-size:46px;pointer-events:none;animation:vr-fly 2.2s cubic-bezier(.2,.8,.3,1) forwards;}
.vr-burst{position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px;border-radius:50%;box-shadow:0 0 0 0 var(--vr-accent);opacity:0;animation:vr-burst 2.2s ease-out forwards;}
.vr-toast{position:fixed;z-index:85;left:50%;top:80px;transform:translateX(-50%);padding:8px 14px;border-radius:20px;font-size:12px;background:oklch(0 0 0 / .7);}
.vr-sheet-wrap{position:fixed;inset:0;z-index:90;background:oklch(0 0 0 / .5);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);}
.vr-sheet{width:min(100%,520px);background:oklch(.21 .04 290);border-radius:22px 22px 0 0;padding:16px 16px max(18px,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:12px;animation:vr-up .25s ease-out;border-top:1px solid var(--vr-line);}
.vr-sheet-head{display:flex;justify-content:space-between;align-items:center;}.vr-sheet-head h3{margin:0;font-size:16px;}
.vr-to{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}
.vr-to button{all:unset;cursor:pointer;flex-shrink:0;display:flex;align-items:center;gap:6px;font-size:12px;padding:5px 10px 5px 5px;border-radius:20px;background:var(--vr-surface);border:1px solid var(--vr-line);}
.vr-to button.on{border-color:var(--vr-accent);background:oklch(.78 .16 70 / .18);}
.vr-to img,.vr-all{width:24px;height:24px;border-radius:50%;object-fit:cover;display:grid;place-items:center;font-size:14px;}
.vr-gifts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.vr-gifts button{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border-radius:14px;background:var(--vr-surface);font-size:11px;transition:transform .15s;}
.vr-gifts button:active{transform:scale(.92);}.vr-gifts span{font-size:30px;}
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
`;
