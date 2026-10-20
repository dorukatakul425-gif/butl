import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VoiceRoomClient } from "@/lib/voice-rtc";

function harness(id = "a") {
  const callbacks = new Map<string, (p?: any) => void>();
  let state: Record<string, any[]> = {};
  const channel = {
    on: vi.fn((type: string, filter: { event: string }, fn: (p?: any) => void) => { callbacks.set(`${type}:${filter.event}`, fn); return channel; }),
    subscribe: vi.fn((fn: (s: string) => void) => { callbacks.set("status", fn); return channel; }),
    track: vi.fn(async () => "ok"), untrack: vi.fn(async () => "ok"),
    send: vi.fn(async () => "ok"), presenceState: () => state,
  };
  const sb = { channel: vi.fn(() => channel), removeChannel: vi.fn(async () => undefined) };
  const h = { onMembers: vi.fn(), onStream: vi.fn(), onSpeaking: vi.fn(), onChat: vi.fn(), onGift: vi.fn(), onRoom: vi.fn(), onStatus: vi.fn() };
  const client = new VoiceRoomClient(sb as any, "room", { id, name: id, photo: null }, h);
  return { client, channel, callbacks, h, sb, setState: (s: typeof state) => { state = s; } };
}
function track(kind = "audio") { return { kind, enabled: true, stop: vi.fn() }; }
function stream(tracks = [track()]) { return { getTracks: () => tracks, getAudioTracks: () => tracks.filter(t => t.kind === "audio"), getVideoTracks: () => tracks.filter(t => t.kind === "video"), addTrack: (t: ReturnType<typeof track>) => tracks.push(t) }; }
let gum: ReturnType<typeof vi.fn>;
beforeEach(() => {
  gum = vi.fn(async () => stream());
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia: gum } });
  vi.stubGlobal("RTCPeerConnection", class {
    localDescription: any;
    transceivers: any[] = [];
    addTransceiver(t: string | { kind: string }) { this.transceivers.push({ receiver: { track: { kind: typeof t === "string" ? t : t.kind } }, sender: { replaceTrack: vi.fn(async () => undefined) } }); }
    getTransceivers() { return this.transceivers; }
    async createOffer() { return { type: "offer", sdp: "test" }; }
    async setLocalDescription(s: any) { this.localDescription = { ...s, toJSON: () => s }; }
    close() {}
  });
});
afterEach(() => vi.unstubAllGlobals());
async function connect(x: ReturnType<typeof harness>) { await x.client.start(); await x.callbacks.get("status")?.("SUBSCRIBED"); }
describe("voice room owner moderation + gifts", () => {
  it("cannot sit on a seat the owner locked", async () => {
    const x = harness(); await connect(x); x.client.locked = new Set([3]);
    expect(await x.client.setSeat(3)).toBe(false); expect(await x.client.setSeat(4)).toBe(true); await x.client.leave();
  });
  it("only the owner can move a seated user to the audience", async () => {
    const x = harness("u"); x.client.ownerId = "owner"; await connect(x); await x.client.setSeat(1);
    x.callbacks.get("broadcast:mod")?.({ payload: { type: "unseat", from: "intruder", target: "u" } });
    expect(x.client.me.seat).toBe(1);
    x.callbacks.get("broadcast:mod")?.({ payload: { type: "unseat", from: "owner", target: "u" } });
    await new Promise(r => setTimeout(r, 0)); expect(x.client.me.seat).toBeNull(); await x.client.leave();
  });
  it("delivers owner seat invitations only to the invited user", async () => {
    const x = harness("u"); x.client.ownerId = "owner"; const onMod = vi.fn(); (x.h as any).onMod = onMod; await connect(x);
    x.callbacks.get("broadcast:mod")?.({ payload: { type: "invite", from: "owner", target: "other", seat: 2, name: "o" } });
    x.callbacks.get("broadcast:mod")?.({ payload: { type: "invite", from: "owner", target: "u", seat: 2, name: "o" } });
    expect(onMod).toHaveBeenCalledTimes(1); await x.client.leave();
  });
  it("sends TikTok-style gifts with combo counts to everyone", async () => {
    const x = harness(); await connect(x);
    expect(await x.client.sendGift(null, "rose", { id: "c1", count: 3 })).toBe(true);
    const sent = x.channel.send.mock.calls.map(c => (c as unknown[])[0] as any).find(p => p?.event === "gift");
    expect(sent.payload).toMatchObject({ gift: "rose", count: 3, comboId: "c1" }); await x.client.leave();
  });
});
