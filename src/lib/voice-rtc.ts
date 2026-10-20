// Live room transport: Realtime websocket channel (presence = members/seats/mic/cam,
// broadcast = chat, gifts, speaking levels, WebRTC signalling) + a WebRTC mesh for audio/video.
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { isLiveGift } from "@/lib/live-gifts";

export const SEAT_COUNT = 10;

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
  count?: number | undefined;
  comboId?: string | undefined;
};
export type RoomGift = { id: string; from: string; to: string | null; gift: string; name?: string; photo?: string | null; toName?: string | undefined; at?: number; count?: number | undefined; comboId?: string | undefined };
/** Owner moderation messages. kick is double-checked against the server kick list by the target. */
export type RoomMod =
  | { type: "kick"; from: string; target: string; until: number }
  | { type: "unseat"; from: string; target: string }
  | { type: "invite"; from: string; target: string; seat: number | null; name: string }
  | { type: "invite_reply"; from: string; target: string; accept: boolean; name: string };

type Handlers = {
  onMembers: (m: RoomMember[]) => void;
  onStream: (id: string, s: MediaStream | null) => void;
  onSpeaking: (id: string, level: number) => void;
  onChat: (m: RoomChat) => void;
  onGift: (g: RoomGift) => void;
  onRoom: (type: "updated" | "closed") => void;
  onStatus: (s: "connecting" | "live" | "error") => void;
  onMod?: (m: RoomMod) => void;
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
  private remoteStreams = new Map<string, MediaStream>();
  private pendingIce = new Map<string, RTCIceCandidateInit[]>();
  private members: RoomMember[] = [];
  private ctx: AudioContext | null = null;
  private meter = 0;
  private lastSpeak = 0;
  private wasSpeaking = false;
  private mediaBusy = false;
  private ready = false;
  private seenGifts = new Set<string>();
  private departed = new Map<string, number>();
  private closed = false;
  /** Seats the owner has locked; nobody can sit there. */
  locked = new Set<number>();
  ownerId = "";

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
    if (this.closed) return;
    const ch = this.sb.channel(`vroom:${this.roomId}`, {
      config: { presence: { key: this.me.id }, broadcast: { self: false, ack: true } },
    });
    this.ch = ch;
    ch.on("presence", { event: "sync" }, () => this.sync());
    ch.on("broadcast", { event: "signal" }, ({ payload }) => void this.onSignal(payload as Signal));
    ch.on("broadcast", { event: "chat" }, ({ payload }) => this.h.onChat(payload as RoomChat));
    ch.on("broadcast", { event: "gift" }, ({ payload }) => this.receiveGift(payload as RoomGift));
    ch.on("broadcast", { event: "speak" }, ({ payload }) => {
      const p = payload as { id: string; level: number };
      this.h.onSpeaking(p.id, p.level);
    });
    ch.on("broadcast", { event: "room" }, ({ payload }) =>
      this.h.onRoom((payload as { type: "updated" | "closed" }).type),
    );
    ch.on("broadcast", { event: "mod" }, ({ payload }) => {
      const m = payload as RoomMod;
      if (!m || this.closed) return;
      if (m.type === "invite_reply") { if (m.target === this.me.id) this.h.onMod?.(m); return; }
      if (m.target !== this.me.id || !this.ownerId || m.from !== this.ownerId) return;
      if (m.type === "unseat" && this.me.seat !== null) void this.setSeat(null);
      this.h.onMod?.(m);
    });
    ch.on("broadcast", { event: "departure" }, ({ payload }) => {
      const p = payload as { id?: string; joinedAt?: number };
      if (p.id && p.id !== this.me.id) {
        const member = this.members.find(m => m.id === p.id);
        this.departed.set(p.id, p.joinedAt ?? member?.joinedAt ?? 0);
        this.sync();
      }
    });
    ch.subscribe(async (status) => {
      if (this.closed) return;
      if (status === "SUBSCRIBED") {
        const result = await ch.track(this.me);
        if (this.closed) { await ch.untrack(); return; }
        this.ready = result === "ok";
        this.h.onStatus(this.ready ? "live" : "error");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") { this.ready = false; this.h.onStatus("error"); }
    });
  }

  hasVideo() {
    return Boolean(this.local?.getVideoTracks().length);
  }
  hasAudio() {
    return Boolean(this.local?.getAudioTracks().length);
  }

  private retrack() {
    if (this.closed) return;
    void this.ch?.track(this.me);
    this.sync();
  }

  toggleMic() {
    const t = this.local?.getAudioTracks()[0];
    if (!t || this.me.seat === null || this.closed) return false;
    t.enabled = !t.enabled;
    this.me = { ...this.me, mic: t.enabled };
    this.retrack();
    return true;
  }
  async toggleCam() {
    if (this.me.seat === null || this.closed || this.mediaBusy) return false;
    const existing = this.local?.getVideoTracks()[0];
    if (existing) {
      existing.enabled = !existing.enabled;
      this.me = { ...this.me, cam: existing.enabled };
      this.retrack();
      return true;
    }
    this.mediaBusy = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: "user" }, audio: false });
      if (this.closed || this.me.seat === null) { stream.getTracks().forEach(t => t.stop()); return false; }
      const track = stream.getVideoTracks()[0];
      if (!track || !this.local) { stream.getTracks().forEach(t => t.stop()); return false; }
      this.local.addTrack(track);
      this.me = { ...this.me, cam: true };
      await this.updateSenders();
      this.h.onStream(this.me.id, this.local);
      this.retrack();
      return true;
    } catch { return false; } finally { this.mediaBusy = false; }
  }
  async setSeat(seat: number | null) {
    if (this.closed || !this.ready) return false;
    if (seat === null) {
      this.me = { ...this.me, seat: null, mic: false, cam: false };
      this.releaseMedia();
      this.retrack();
      return true;
    }
    if (!Number.isInteger(seat) || seat < 0 || seat >= SEAT_COUNT || this.mediaBusy || this.locked.has(seat) || this.members.some(m => m.id !== this.me.id && m.seat === seat)) return false;
    this.mediaBusy = true;
    try {
      if (!this.hasAudio()) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
        if (this.closed || !this.ready || this.members.some(m => m.id !== this.me.id && m.seat === seat)) { stream.getTracks().forEach(t => t.stop()); return false; }
        this.local = stream;
      }
      this.local?.getAudioTracks().forEach(t => { t.enabled = true; });
      this.me = { ...this.me, seat, mic: true };
      await this.updateSenders();
      if (this.closed) return false;
      this.h.onStream(this.me.id, this.local);
      this.startMeter();
      this.retrack();
      return this.me.seat === seat;
    } catch { return false; } finally { this.mediaBusy = false; }
  }

  private async updateSenders() {
    const local = this.local;
    await Promise.all([...this.pcs.values()].flatMap(pc => pc.getTransceivers().map(tr => {
      const track = local?.getTracks().find(t => t.kind === tr.receiver.track.kind) ?? null;
      return tr.sender.replaceTrack(track).catch(() => undefined);
    })));
  }
  private releaseMedia() {
    window.clearInterval(this.meter);
    void this.ctx?.close().catch(() => undefined);
    this.ctx = null;
    this.local?.getTracks().forEach(t => t.stop());
    this.local = null;
    void this.updateSenders();
    this.h.onStream(this.me.id, null);
    this.h.onSpeaking(this.me.id, 0);
    this.send("speak", { id: this.me.id, level: 0 });
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
  async sendGift(to: RoomMember | null, gift: string, combo?: { id: string; count: number }) {
    if (!this.ready || this.closed || !this.ch || !isLiveGift(gift)) return false;
    const g: RoomGift = { id: uid(), from: this.me.id, name: this.me.name, photo: this.me.photo, to: to?.id ?? null, toName: to?.name, gift, at: Date.now() + (gift === "video" ? 700 : 0), count: combo?.count ?? 1, comboId: combo?.id };
    const result = await this.ch.send({ type: "broadcast", event: "gift", payload: g });
    if (result !== "ok" || this.closed) return false;
    this.receiveGift(g);
    const msg: RoomChat = { id: g.id, from: this.me.id, name: this.me.name, photo: this.me.photo, text: "", at: g.at ?? Date.now(), kind: "gift", gift, to: g.to, toName: to?.name ?? "", count: g.count, comboId: g.comboId };
    this.h.onChat(msg);
    this.send("chat", msg);
    return true;
  }
  private receiveGift(g: RoomGift) {
    if (this.closed || !isLiveGift(g.gift) || !g.id || this.seenGifts.has(g.id)) return;
    this.seenGifts.add(g.id);
    if (this.seenGifts.size > 200) { const first = this.seenGifts.values().next().value; if (first) this.seenGifts.delete(first); }
    this.h.onGift(g);
  }
  sendMod(m: RoomMod) {
    this.send("mod", m);
  }
  notifyRoom(type: "updated" | "closed") {
    this.send("room", { type });
  }

  private send(event: string, payload: unknown) {
    void this.ch?.send({ type: "broadcast", event, payload });
  }

  private sync() {
    if (!this.ch || this.closed) return;
    const state = this.ch.presenceState<RoomMember>();
    let list = Object.values(state)
      .map((arr) => arr[arr.length - 1])
      .filter((m) => {
        if (!m) return false;
        const left = this.departed.get(m.id);
        if (left === undefined) return true;
        if (m.joinedAt > left) { this.departed.delete(m.id); return true; }
        return false;
      }) as RoomMember[];
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
      this.me = { ...this.me, seat: null, mic: false, cam: false };
      this.releaseMedia();
      void this.ch.track(this.me);
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
    for (const kind of ["audio", "video"]) {
      const track = this.local?.getTracks().find(t => t.kind === kind);
      pc.addTransceiver(track ?? kind, { direction: "sendrecv", ...(track && this.local ? { streams: [this.local] } : {}) });
    }
    pc.onicecandidate = (e) => {
      if (e.candidate)
        this.send("signal", {
          to: id,
          from: this.me.id,
          type: "ice",
          ice: e.candidate.toJSON(),
        } satisfies Signal);
    };
    pc.ontrack = (e) => {
      const stream = this.remoteStreams.get(id) ?? e.streams[0] ?? new MediaStream();
      if (!stream.getTracks().some(t => t.id === e.track.id)) stream.addTrack(e.track);
      this.remoteStreams.set(id, stream);
      this.h.onStream(id, stream);
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" && this.me.id < id && !this.closed) void this.call(id);
    };
    return pc;
  }

  private async call(id: string) {
    const pc = this.makePc(id);
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
    this.remoteStreams.delete(id);
    this.h.onStream(id, null);
  }

  private startMeter() {
    window.clearInterval(this.meter);
    void this.ctx?.close().catch(() => undefined);
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
    if (this.closed) return;
    this.closed = true;
    this.ready = false;
    window.clearInterval(this.meter);
    void this.ctx?.close().catch(() => undefined);
    for (const id of [...this.pcs.keys()]) this.drop(id);
    this.local?.getTracks().forEach((t) => t.stop());
    if (this.ch) {
      await this.ch.send({ type: "broadcast", event: "departure", payload: { id: this.me.id, joinedAt: this.me.joinedAt } }).catch(() => undefined);
      await this.ch.untrack().catch(() => undefined);
      await this.sb.removeChannel(this.ch);
      this.ch = null;
    }
  }
}
