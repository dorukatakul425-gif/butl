// Live room transport: Realtime websocket channel (presence = members/seats/mic/cam,
// broadcast = chat, gifts, speaking levels, WebRTC signalling) + a WebRTC mesh for audio/video.
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

export const SEAT_COUNT = 8;

export type RoomMember = {
  id: string;
  name: string;
  photo: string | null;
  seat: number | null;
  mic: boolean;
  cam: boolean;
  joinedAt: number;
};
export type RoomChat = {
  id: string;
  from: string;
  name: string;
  photo: string | null;
  text: string;
  at: number;
  kind: "chat" | "gift" | "system";
  gift?: string;
  to?: string | null;
  toName?: string;
};
export type RoomGift = { id: string; from: string; to: string | null; gift: string };

type Handlers = {
  onMembers: (m: RoomMember[]) => void;
  onStream: (id: string, s: MediaStream | null) => void;
  onSpeaking: (id: string, level: number) => void;
  onChat: (m: RoomChat) => void;
  onGift: (g: RoomGift) => void;
  onRoom: (type: "updated" | "closed") => void;
  onStatus: (s: "connecting" | "live" | "error") => void;
};

type Signal = {
  to: string;
  from: string;
  type: "offer" | "answer" | "ice";
  sdp?: RTCSessionDescriptionInit;
  ice?: RTCIceCandidateInit;
};

function iceServers(): RTCIceServer[] {
  const list: RTCIceServer[] = [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ];
  const turn = import.meta.env["VITE_TURN_URL"] as string | undefined;
  if (turn)
    list.push({
      urls: turn.split(","),
      username: (import.meta.env["VITE_TURN_USERNAME"] as string | undefined) ?? "",
      credential: (import.meta.env["VITE_TURN_CREDENTIAL"] as string | undefined) ?? "",
    });
  return list;
}

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export class VoiceRoomClient {
  me: RoomMember;
  local: MediaStream | null = null;
  private ch: RealtimeChannel | null = null;
  private pcs = new Map<string, RTCPeerConnection>();
  private pendingIce = new Map<string, RTCIceCandidateInit[]>();
  private members: RoomMember[] = [];
  private ctx: AudioContext | null = null;
  private meter = 0;
  private lastSpeak = 0;
  private wasSpeaking = false;
  private autoSeated = false;
  private closed = false;

  constructor(
    private sb: SupabaseClient,
    private roomId: string,
    me: { id: string; name: string; photo: string | null },
    private h: Handlers,
  ) {
    this.me = { ...me, seat: null, mic: false, cam: false, joinedAt: Date.now() };
  }

  async start() {
    this.h.onStatus("connecting");
    const audio = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };
    try {
      this.local = await navigator.mediaDevices.getUserMedia({
        audio,
        video: { width: { ideal: 360 }, height: { ideal: 360 }, facingMode: "user" },
      });
    } catch {
      try {
        this.local = await navigator.mediaDevices.getUserMedia({ audio });
      } catch {
        this.local = null;
      }
    }
    if (this.closed) {
      this.local?.getTracks().forEach((t) => t.stop());
      return;
    }
    this.local?.getVideoTracks().forEach((t) => {
      t.enabled = false;
    });
    this.me.mic = Boolean(this.local?.getAudioTracks().length);
    this.h.onStream(this.me.id, this.local);
    this.startMeter();

    const ch = this.sb.channel(`vroom:${this.roomId}`, {
      config: { presence: { key: this.me.id }, broadcast: { self: false } },
    });
    this.ch = ch;
    ch.on("presence", { event: "sync" }, () => this.sync());
    ch.on("broadcast", { event: "signal" }, ({ payload }) => void this.onSignal(payload as Signal));
    ch.on("broadcast", { event: "chat" }, ({ payload }) => this.h.onChat(payload as RoomChat));
    ch.on("broadcast", { event: "gift" }, ({ payload }) => this.h.onGift(payload as RoomGift));
    ch.on("broadcast", { event: "speak" }, ({ payload }) => {
      const p = payload as { id: string; level: number };
      this.h.onSpeaking(p.id, p.level);
    });
    ch.on("broadcast", { event: "room" }, ({ payload }) =>
      this.h.onRoom((payload as { type: "updated" | "closed" }).type),
    );
    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track(this.me);
        this.h.onStatus("live");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") this.h.onStatus("error");
    });
  }

  hasVideo() {
    return Boolean(this.local?.getVideoTracks().length);
  }
  hasAudio() {
    return Boolean(this.local?.getAudioTracks().length);
  }

  private retrack() {
    void this.ch?.track(this.me);
    this.sync();
  }

  toggleMic() {
    const t = this.local?.getAudioTracks()[0];
    if (!t) return false;
    t.enabled = !t.enabled;
    this.me = { ...this.me, mic: t.enabled };
    this.retrack();
    return true;
  }
  toggleCam() {
    const t = this.local?.getVideoTracks()[0];
    if (!t) return false;
    t.enabled = !t.enabled;
    this.me = { ...this.me, cam: t.enabled };
    this.retrack();
    return true;
  }
  setSeat(seat: number | null) {
    if (seat !== null && this.members.some((m) => m.id !== this.me.id && m.seat === seat)) return;
    this.me = { ...this.me, seat };
    this.autoSeated = true;
    this.retrack();
  }

  sendChat(text: string) {
    const msg: RoomChat = {
      id: uid(),
      from: this.me.id,
      name: this.me.name,
      photo: this.me.photo,
      text,
      at: Date.now(),
      kind: "chat",
    };
    this.h.onChat(msg);
    this.send("chat", msg);
  }
  sendGift(to: RoomMember | null, gift: string) {
    const g: RoomGift = { id: uid(), from: this.me.id, to: to?.id ?? null, gift };
    const msg: RoomChat = {
      id: uid(),
      from: this.me.id,
      name: this.me.name,
      photo: this.me.photo,
      text: "",
      at: Date.now(),
      kind: "gift",
      gift,
      to: to?.id ?? null,
      toName: to?.name ?? "hamıya",
    };
    this.h.onGift(g);
    this.h.onChat(msg);
    this.send("gift", g);
    this.send("chat", msg);
  }
  notifyRoom(type: "updated" | "closed") {
    this.send("room", { type });
  }

  private send(event: string, payload: unknown) {
    void this.ch?.send({ type: "broadcast", event, payload });
  }

  private sync() {
    if (!this.ch) return;
    const state = this.ch.presenceState<RoomMember>();
    let list = Object.values(state)
      .map((arr) => arr[arr.length - 1])
      .filter(Boolean) as RoomMember[];
    if (!list.some((m) => m.id === this.me.id)) list.push(this.me);
    list = list.map((m) => (m.id === this.me.id ? this.me : m));
    // Seat conflicts: the earlier joiner keeps the seat.
    const mine = this.me.seat;
    if (
      mine !== null &&
      list.some(
        (m) =>
          m.id !== this.me.id &&
          m.seat === mine &&
          (m.joinedAt < this.me.joinedAt || (m.joinedAt === this.me.joinedAt && m.id < this.me.id)),
      )
    ) {
      this.me = { ...this.me, seat: null };
      this.autoSeated = false;
    }
    if (!this.autoSeated && this.me.seat === null) {
      const taken = new Set(list.filter((m) => m.id !== this.me.id).map((m) => m.seat));
      const free = Array.from({ length: SEAT_COUNT }, (_, i) => i).find((i) => !taken.has(i));
      this.autoSeated = true;
      if (free !== undefined) {
        this.me = { ...this.me, seat: free };
        void this.ch.track(this.me);
      }
    }
    list = list
      .map((m) => (m.id === this.me.id ? this.me : m))
      .sort((a, b) => a.joinedAt - b.joinedAt);
    this.members = list;
    const ids = new Set(list.map((m) => m.id));
    for (const m of list)
      if (m.id !== this.me.id && !this.pcs.has(m.id) && this.me.id < m.id) void this.call(m.id);
    for (const id of [...this.pcs.keys()]) if (!ids.has(id)) this.drop(id);
    this.h.onMembers(list);
  }

  private makePc(id: string) {
    this.drop(id);
    const pc = new RTCPeerConnection({ iceServers: iceServers() });
    this.pcs.set(id, pc);
    this.local?.getTracks().forEach((t) => pc.addTrack(t, this.local!));
    pc.onicecandidate = (e) => {
      if (e.candidate)
        this.send("signal", {
          to: id,
          from: this.me.id,
          type: "ice",
          ice: e.candidate.toJSON(),
        } satisfies Signal);
    };
    pc.ontrack = (e) => this.h.onStream(id, e.streams[0] ?? new MediaStream([e.track]));
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" && this.me.id < id && !this.closed) void this.call(id);
    };
    return pc;
  }

  private async call(id: string) {
    const pc = this.makePc(id);
    if (!this.hasAudio()) pc.addTransceiver("audio", { direction: "recvonly" });
    if (!this.hasVideo()) pc.addTransceiver("video", { direction: "recvonly" });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.send("signal", {
      to: id,
      from: this.me.id,
      type: "offer",
      sdp: pc.localDescription!.toJSON(),
    } satisfies Signal);
  }

  private async flushIce(id: string, pc: RTCPeerConnection) {
    const q = this.pendingIce.get(id) ?? [];
    this.pendingIce.delete(id);
    for (const c of q) await pc.addIceCandidate(c).catch(() => undefined);
  }

  private async onSignal(s: Signal) {
    if (s.to !== this.me.id || this.closed) return;
    try {
      if (s.type === "offer" && s.sdp) {
        const pc = this.makePc(s.from);
        await pc.setRemoteDescription(s.sdp);
        await this.flushIce(s.from, pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.send("signal", {
          to: s.from,
          from: this.me.id,
          type: "answer",
          sdp: pc.localDescription!.toJSON(),
        } satisfies Signal);
      } else if (s.type === "answer" && s.sdp) {
        const pc = this.pcs.get(s.from);
        if (!pc || pc.signalingState !== "have-local-offer") return;
        await pc.setRemoteDescription(s.sdp);
        await this.flushIce(s.from, pc);
      } else if (s.type === "ice" && s.ice) {
        const pc = this.pcs.get(s.from);
        if (pc?.remoteDescription) await pc.addIceCandidate(s.ice).catch(() => undefined);
        else this.pendingIce.set(s.from, [...(this.pendingIce.get(s.from) ?? []), s.ice]);
      }
    } catch (e) {
      console.warn("voice signal", e);
    }
  }

  private drop(id: string) {
    const pc = this.pcs.get(id);
    if (!pc) return;
    pc.onicecandidate = null;
    pc.ontrack = null;
    pc.onconnectionstatechange = null;
    pc.close();
    this.pcs.delete(id);
    this.h.onStream(id, null);
  }

  private startMeter() {
    const t = this.local?.getAudioTracks()[0];
    if (!t) return;
    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      const an = this.ctx.createAnalyser();
      an.fftSize = 512;
      this.ctx.createMediaStreamSource(new MediaStream([t])).connect(an);
      const buf = new Float32Array(an.fftSize);
      this.meter = window.setInterval(() => {
        if (this.ctx?.state === "suspended") void this.ctx.resume();
        an.getFloatTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += v * v;
        const level = this.me.mic ? Math.min(1, Math.sqrt(sum / buf.length) * 6) : 0;
        const speaking = level > 0.12;
        this.h.onSpeaking(this.me.id, speaking ? level : 0);
        const now = Date.now();
        if (speaking !== this.wasSpeaking || (speaking && now - this.lastSpeak > 350)) {
          this.wasSpeaking = speaking;
          this.lastSpeak = now;
          this.send("speak", {
            id: this.me.id,
            level: speaking ? Math.round(level * 100) / 100 : 0,
          });
        }
      }, 120);
    } catch {
      /* metering is optional */
    }
  }

  async leave() {
    this.closed = true;
    window.clearInterval(this.meter);
    void this.ctx?.close().catch(() => undefined);
    for (const id of [...this.pcs.keys()]) this.drop(id);
    this.local?.getTracks().forEach((t) => t.stop());
    if (this.ch) {
      await this.ch.untrack().catch(() => undefined);
      await this.sb.removeChannel(this.ch);
      this.ch = null;
    }
  }
}
