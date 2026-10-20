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
describe("live voice room requirements", () => {
  it("joins as a listener without requesting microphone or camera", async () => {
    const x = harness(); await connect(x); x.callbacks.get("presence:sync")?.();
    expect(gum).not.toHaveBeenCalled(); expect(x.client.me).toMatchObject({ seat: null, mic: false, cam: false });
    expect(x.channel.track).toHaveBeenCalledWith(expect.objectContaining({ seat: null })); await x.client.leave();
  });
  it("requests audio only when explicitly sitting, then stops capture on standing", async () => {
    const x = harness(); await connect(x); expect(await x.client.setSeat(2)).toBe(true);
    expect(gum).toHaveBeenCalledTimes(1); expect(gum).toHaveBeenCalledWith({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
    const local = x.client.local; expect(x.client.me).toMatchObject({ seat: 2, mic: true, cam: false });
    await x.client.setSeat(null); expect(local?.getTracks()[0]?.stop).toHaveBeenCalled(); expect(x.client.local).toBeNull(); expect(x.client.me.mic).toBe(false); await x.client.leave();
  });
  it("keeps denied microphone users as listeners", async () => {
    const x = harness(); await connect(x); gum.mockRejectedValueOnce(new Error("denied"));
    expect(await x.client.setSeat(0)).toBe(false); expect(x.client.me.seat).toBeNull(); await x.client.leave();
  });
  it("does not request camera while listening; seated camera action requests video only", async () => {
    const x = harness(); await connect(x); expect(await x.client.toggleCam()).toBe(false); expect(gum).not.toHaveBeenCalled();
    await x.client.setSeat(0); gum.mockResolvedValueOnce(stream([track("video")])); expect(await x.client.toggleCam()).toBe(true);
    expect(gum).toHaveBeenLastCalledWith({ video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: "user" }, audio: false }); await x.client.leave();
  });
  it("does not seat occupied or out-of-range seats", async () => {
    const x = harness("z"); await connect(x); x.setState({ other: [{ id: "a", seat: 3, joinedAt: 0 }] }); x.callbacks.get("presence:sync")?.();
    expect(await x.client.setSeat(3)).toBe(false); expect(await x.client.setSeat(10)).toBe(false); expect(gum).not.toHaveBeenCalled(); await x.client.leave();
  });
  it("sends a single acknowledged gift to sender and all room listeners with same ID/start time", async () => {
    const a = harness(), b = harness("b"); await connect(a); await connect(b);
    expect(await a.client.sendGift(null, "video")).toBe(true);
    const sent = a.channel.send.mock.calls.map(c => (c as unknown[])[0] as any).find(p => p?.event === "gift");
    expect(sent.payload.to).toBeNull(); expect(sent.payload.at).toBeGreaterThan(Date.now());
    b.callbacks.get("broadcast:gift")?.({ payload: sent.payload }); b.callbacks.get("broadcast:gift")?.({ payload: sent.payload });
    expect(a.h.onGift).toHaveBeenCalledTimes(1); expect(b.h.onGift).toHaveBeenCalledTimes(1); expect(b.h.onGift).toHaveBeenCalledWith(a.h.onGift.mock.calls[0]![0]); await a.client.leave(); await b.client.leave();
  });
  it("does not show failed or fake gifts as successfully sent", async () => {
    const x = harness(); await connect(x); expect(await x.client.sendGift(null, "not-a-gift")).toBe(false);
    x.channel.send.mockResolvedValueOnce("timed out"); expect(await x.client.sendGift(null, "video")).toBe(false); expect(x.h.onGift).not.toHaveBeenCalled(); await x.client.leave();
  });
  it("removes a departing user immediately before presence catches up", async () => {
    const x = harness("z"); await connect(x); x.setState({ a: [{ id: "a", seat: null, joinedAt: 0 }] }); x.callbacks.get("presence:sync")?.();
    x.callbacks.get("broadcast:departure")?.({ payload: { id: "a" } });
    expect(x.h.onMembers.mock.calls.at(-1)?.[0].map((m: any) => m.id)).toEqual(["z"]); await x.client.leave(); expect(x.channel.untrack).toHaveBeenCalledTimes(1);
  });
  it("allows a departed user to rejoin with a newer presence session", async () => {
    const x = harness("z"); await connect(x);
    x.setState({ a: [{ id: "a", seat: null, joinedAt: 100 }] }); x.callbacks.get("presence:sync")?.();
    x.callbacks.get("broadcast:departure")?.({ payload: { id: "a", joinedAt: 100 } });
    expect(x.h.onMembers.mock.calls.at(-1)?.[0].map((m: any) => m.id)).toEqual(["z"]);
    x.setState({ a: [{ id: "a", seat: null, joinedAt: 200 }] }); x.callbacks.get("presence:sync")?.();
    expect(x.h.onMembers.mock.calls.at(-1)?.[0].map((m: any) => m.id)).toContain("a"); await x.client.leave();
  });
  it("stops permission result arriving after leave without seating or publishing capture", async () => {
    const x = harness(); await connect(x); let resolve: (s: any) => void = () => undefined;
    gum.mockImplementationOnce(() => new Promise(r => { resolve = r; })); const sitting = x.client.setSeat(0);
    await x.client.leave(); const late = stream(); resolve(late); expect(await sitting).toBe(false); expect(late.getTracks()[0]!.stop).toHaveBeenCalled(); expect(x.client.me.seat).toBeNull();
  });
});
