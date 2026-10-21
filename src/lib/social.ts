// Friends + direct messages over Cloud realtime (websocket). One subscription per signed-in
// player; notifications play a synthesized sound and use the OS notification when the tab is hidden.
import { useEffect, useSyncExternalStore } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

export type Friendship = { id: string; requester_id: string; addressee_id: string; status: "pending" | "accepted"; created_at: string };
export type DirectMessage = { id: string; sender_id: string; recipient_id: string; body: string; kind?: "text" | "image" | "audio"; media_path?: string | null; duration_ms?: number | null; deleted_at?: string | null; created_at: string; read_at: string | null; pending?: boolean };
export type SocialProfile = { id: string; name: string; username: string; photo_url: string | null };
export type FriendState = "none" | "sent" | "received" | "friends";
export type SocialNotice = { id: string; kind: "message" | "request" | "accepted" | "harem"; from: string; title: string; body: string; photo: string | null };

export const MAX_MESSAGE_LENGTH = 1000;

// ---------- pure helpers ----------
export function normalizeMessage(text: string): string | null {
  const t = text.replace(/\r\n/g, "\n").trim();
  if (!t || t.length > MAX_MESSAGE_LENGTH) return null;
  return t;
}
export function otherParty(f: Friendship, me: string) {
  return f.requester_id === me ? f.addressee_id : f.requester_id;
}
export function friendStateFor(me: string, other: string, list: readonly Friendship[]): FriendState {
  const f = list.find(x => (x.requester_id === me && x.addressee_id === other) || (x.addressee_id === me && x.requester_id === other));
  if (!f) return "none";
  if (f.status === "accepted") return "friends";
  return f.requester_id === me ? "sent" : "received";
}
export function conversationKey(a: string, b: string) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}
export function upsertMessage(list: readonly DirectMessage[], m: DirectMessage): DirectMessage[] {
  const next = list.filter(x => x.id !== m.id);
  next.push(m);
  return next.sort((a, b) => a.created_at.localeCompare(b.created_at));
}
/** Deletion and read receipts are monotonic, including across reconnect snapshots. */
export function mergeConversation(list: readonly DirectMessage[], rows: readonly DirectMessage[]): DirectMessage[] {
  return rows.reduce((next, row) => {
    const existing = next.find(message => message.id === row.id);
    const merged = existing ? { ...row, read_at: existing.read_at ?? row.read_at, ...(existing.deleted_at ? { deleted_at: existing.deleted_at, body: '', media_path: null } : {}) } : row;
    return upsertMessage(next, merged);
  }, [...list]);
}
export function summarizeInbox(me: string, rows: readonly DirectMessage[]) {
  const last: Record<string, DirectMessage> = {};
  const unread: Record<string, number> = {};
  for (const m of rows) {
    const peer = m.sender_id === me ? m.recipient_id : m.sender_id;
    const prev = last[peer];
    if (!prev || prev.created_at < m.created_at) last[peer] = m;
    if (m.recipient_id === me && !m.read_at && !m.deleted_at) unread[peer] = (unread[peer] ?? 0) + 1;
  }
  return { last, unread };
}

// ---------- store ----------
type State = {
  me: string | null;
  friendships: Friendship[];
  profiles: Record<string, SocialProfile>;
  unread: Record<string, number>;
  last: Record<string, DirectMessage>;
  notices: SocialNotice[];
  activeChat: string | null;
};
const INITIAL: State = { me: null, friendships: [], profiles: {}, unread: {}, last: {}, notices: [], activeChat: null };
let state: State = INITIAL;
const listeners = new Set<() => void>();
function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach(l => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}
export function useSocial() {
  return useSyncExternalStore(subscribe, () => state, () => INITIAL);
}

const messageListeners = new Set<(m: DirectMessage, type: "insert" | "update") => void>();
const recoveryListeners = new Set<() => void>();
export function onSocialRecovery(fn: () => void) {
  recoveryListeners.add(fn);
  return () => { recoveryListeners.delete(fn); };
}
export function onDirectMessage(fn: (m: DirectMessage, type: "insert" | "update") => void) {
  messageListeners.add(fn);
  return () => { messageListeners.delete(fn); };
}
const openListeners = new Set<(n: Pick<SocialNotice, "kind" | "from">) => void>();
export function onSocialOpen(fn: (n: Pick<SocialNotice, "kind" | "from">) => void) {
  openListeners.add(fn);
  return () => { openListeners.delete(fn); };
}
export function openSocialNotice(n: Pick<SocialNotice, "kind" | "from">) {
  openListeners.forEach(l => l(n));
}

// ---------- sound ----------
let ac: AudioContext | null = null;
function audio() {
  if (typeof window === "undefined") return null;
  if (!ac) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ac = new Ctor();
  }
  if (ac.state === "suspended") void ac.resume();
  return ac;
}
/** Call from a user gesture so mobile browsers allow later notification sounds. */
export function unlockSocialAudio() { audio(); }
const SOUND_KEY = "deltagame.social.sound";
export function socialSoundEnabled() {
  try { return localStorage.getItem(SOUND_KEY) !== "off"; } catch { return true; }
}
export function setSocialSound(on: boolean) {
  try { localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch { /* ignore */ }
}
export function playSocialSound(kind: SocialNotice["kind"]) {
  if (!socialSoundEnabled()) return;
  const ctx = audio();
  if (!ctx) return;
  const notes: Array<[number, number]> = kind === "message" ? [[880, 0], [1318.5, 0.11]] : [[659.25, 0], [880, 0.12], [1174.7, 0.24]];
  for (const [freq, at] of notes) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    const s = ctx.currentTime + at;
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(0.28, s + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, s + 0.38);
    o.connect(g).connect(ctx.destination);
    o.start(s);
    o.stop(s + 0.42);
  }
}

// ---------- OS notifications ----------
let worker: ServiceWorkerRegistration | null = null;
function registerWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/social-sw.js").then(r => { worker = r; }, () => { worker = null; });
}
export function requestNotifyPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") void Notification.requestPermission();
}
async function systemNotify(n: SocialNotice) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const options: NotificationOptions = { body: n.body, icon: n.photo || "/icon-192.png", badge: "/icon-192.png", tag: n.id, data: { kind: n.kind, from: n.from } };
  try {
    if (worker) { await worker.showNotification(n.title, options); return; }
    const note = new Notification(n.title, options);
    note.onclick = () => { window.focus(); openSocialNotice(n); note.close(); };
  } catch { /* some mobile browsers only allow worker notifications */ }
}
function notify(n: SocialNotice) {
  playSocialSound(n.kind);
  if (document.visibilityState === "visible") {
    set({ notices: [n, ...state.notices.filter(x => x.id !== n.id)].slice(0, 3) });
    window.setTimeout(() => dismissNotice(n.id), 5500);
  } else {
    void systemNotify(n);
  }
}
export function dismissNotice(id: string) {
  if (state.notices.some(n => n.id === id)) set({ notices: state.notices.filter(n => n.id !== id) });
}

// ---------- data ----------
export async function ensureProfiles(ids: string[]) {
  const gen = generation;
  const sb = getSupabase();
  const missing = [...new Set(ids)].filter(id => !state.profiles[id]);
  if (!sb || !missing.length) return;
  const { data } = await sb.from("profiles").select("id,name,username,photo_url").in("id", missing);
  if (!data || gen !== generation) return;
  const profiles = { ...state.profiles };
  for (const p of data as SocialProfile[]) profiles[p.id] = p;
  set({ profiles });
}
export async function refreshFriendships() {
  const gen = generation;
  const sb = getSupabase();
  const me = state.me;
  if (!sb || !me) return;
  const { data } = await sb.from("friendships").select("id,requester_id,addressee_id,status,created_at").order("created_at", { ascending: false });
  if (!data || state.me !== me || gen !== generation) return;
  const friendships = data as Friendship[];
  set({ friendships });
  await ensureProfiles(friendships.map(f => otherParty(f, me)));
}
async function refreshInbox() {
  const gen = generation;
  const sb = getSupabase();
  const me = state.me;
  if (!sb || !me) return;
  const { data } = await sb.from("direct_messages").select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at").order("created_at", { ascending: false }).limit(400);
  if (!data || state.me !== me || gen !== generation) return;
  const { last, unread } = summarizeInbox(me, data as DirectMessage[]);
  if (state.activeChat) unread[state.activeChat] = 0;
  set({ last, unread });
  await ensureProfiles(Object.keys(last));
}
async function profileOf(id: string) {
  await ensureProfiles([id]);
  return state.profiles[id];
}
async function handleIncoming(m: DirectMessage) {
  const gen = generation;
  const peer = m.sender_id;
  set({ last: { ...state.last, [peer]: m } });
  messageListeners.forEach(l => l(m, "insert"));
  const viewing = state.activeChat === peer && document.visibilityState === "visible";
  if (viewing) return;
  set({ unread: { ...state.unread, [peer]: (state.unread[peer] ?? 0) + 1 } });
  const p = await profileOf(peer);
  if (gen !== generation) return;
  notify({ id: `m-${m.id}`, kind: "message", from: peer, title: p?.name ?? "Yeni mesaj", body: messagePreview(m).length > 120 ? messagePreview(m).slice(0, 117) + "…" : messagePreview(m), photo: p?.photo_url ?? null });
}

export async function sendFriendRequest(to: string) {
  const sb = getSupabase();
  if (!sb) return { ok: false as const, error: "Bağlantı yoxdur" };
  const { error } = await sb.rpc("send_friend_request", { _to: to });
  await refreshFriendships();
  return error ? { ok: false as const, error: "İstək göndərilmədi" } : { ok: true as const };
}
export async function respondFriendRequest(id: string, accept: boolean) {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.rpc("respond_friend_request", { _id: id, _accept: accept });
  await refreshFriendships();
  return !error;
}
export async function removeFriendship(id: string) {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("friendships").delete().eq("id", id);
  await refreshFriendships();
  return !error;
}
export async function loadConversation(me: string, peer: string) {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from("direct_messages").select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at")
    .or(`and(sender_id.eq.${me},recipient_id.eq.${peer}),and(sender_id.eq.${peer},recipient_id.eq.${me})`)
    .order("created_at", { ascending: false }).limit(80);
  return ((data ?? []) as DirectMessage[]).reverse();
}
export async function sendDirectMessage(me: string, to: string, body: string) {
  const sb = getSupabase();
  if (!sb) return { ok: false as const, error: "Bağlantı yoxdur" };
  const { data, error } = await sb.from("direct_messages").insert({ sender_id: me, recipient_id: to, body }).select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at").single();
  if (error || !data) return { ok: false as const, error: "Mesaj göndərilmədi" };
  const message = data as DirectMessage;
  set({ last: { ...state.last, [to]: message } });
  return { ok: true as const, message };
}
export async function markConversationRead(peer: string) {
  const sb = getSupabase();
  if (!sb) return;
  if (state.unread[peer]) set({ unread: { ...state.unread, [peer]: 0 } });
  await sb.rpc("mark_messages_read", { _from: peer });
}
export function setActiveChat(peer: string | null) {
  set({ activeChat: peer });
  if (peer) void ensureProfiles([peer]);
}

/** Broadcast-only typing indicator for one conversation. */
export function joinTyping(me: string, peer: string, onTyping: (typing: boolean) => void) {
  const sb = getSupabase();
  if (!sb) return { ping: () => {}, leave: () => {} };
  let timer = 0;
  let lastPing = 0;
  const ch = sb.channel(`typing:${conversationKey(me, peer)}`, { config: { broadcast: { self: false } } })
    .on("broadcast", { event: "typing" }, ({ payload }) => {
      if ((payload as { from?: string })?.from !== peer) return;
      onTyping(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onTyping(false), 3500);
    })
    .subscribe();
  return {
    ping: () => {
      const now = Date.now();
      if (now - lastPing < 1500) return;
      lastPing = now;
      void ch.send({ type: "broadcast", event: "typing", payload: { from: me } });
    },
    leave: () => { window.clearTimeout(timer); void sb.removeChannel(ch); },
  };
}

let generation = 0;
export function startSocial(me: string) {
  const sb = getSupabase();
  if (!sb) return () => {};
  const gen = ++generation;
  set({ ...INITIAL, me });
  void refreshFriendships();
  void refreshInbox();
  registerWorker();
  const live = () => gen === generation;
  const channel: RealtimeChannel = sb.channel(`social:${me}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "friendships", filter: `addressee_id=eq.${me}` }, payload => {
      if (!live()) return;
      if (payload.eventType === "INSERT") {
        const f = payload.new as Friendship;
        void profileOf(f.requester_id).then(p => { if (live()) notify({ id: `r-${f.id}`, kind: "request", from: f.requester_id, title: "Yeni dostluq istəyi", body: `${p?.name ?? "Bir oyunçu"} sənə dostluq istəyi göndərdi`, photo: p?.photo_url ?? null }); });
      }
      void refreshFriendships();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "friendships", filter: `requester_id=eq.${me}` }, payload => {
      if (!live()) return;
      const f = payload.new as Partial<Friendship>;
      if (payload.eventType === "UPDATE" && f.status === "accepted" && f.addressee_id) {
        const from = f.addressee_id;
        void profileOf(from).then(p => { if (live()) notify({ id: `a-${f.id}`, kind: "accepted", from, title: "İstək qəbul edildi", body: `${p?.name ?? "Oyunçu"} dostluq istəyini qəbul etdi — indi yaza bilərsən`, photo: p?.photo_url ?? null }); });
      }
      void refreshFriendships();
    })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "direct_messages", filter: `recipient_id=eq.${me}` }, payload => {
      if (live()) void handleIncoming(payload.new as DirectMessage);
    })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "direct_messages", filter: `sender_id=eq.${me}` }, payload => {
      if (!live()) return;
      const m = payload.new as DirectMessage;
      const previous = state.last[m.recipient_id];
      if (!previous || previous.created_at <= m.created_at) set({ last: { ...state.last, [m.recipient_id]: m } });
      messageListeners.forEach(l => l(m, "insert"));
    })
    // Admiration alerts: someone else admired the same person, or the person rejected you.
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "profile_notifications", filter: `user_id=eq.${me}` }, payload => {
      if (!live()) return;
      const n = payload.new as { id: number; actor_id: string | null; body: string; payload?: { type?: string } };
      // The original table inbox owns durable attraction notices, not the expiring social banner.
      if (n.payload?.type === 'harem_purchase') return;
      void (n.actor_id ? profileOf(n.actor_id) : Promise.resolve(undefined)).then(p => {
        if (live()) notify({ id: `h-${n.id}`, kind: "harem", from: n.actor_id ?? me, title: "Hayranlık", body: n.body, photo: p?.photo_url ?? null });
      });
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "direct_messages", filter: `sender_id=eq.${me}` }, payload => {
      if (!live()) return;
      const m = payload.new as DirectMessage;
      messageListeners.forEach(l => l(m, "update"));
      if (state.last[m.recipient_id]?.id === m.id) set({ last: { ...state.last, [m.recipient_id]: m } });
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "direct_messages", filter: `recipient_id=eq.${me}` }, payload => {
      if (!live()) return;
      const m = payload.new as DirectMessage;
      messageListeners.forEach(l => l(m, "update"));
      if (state.last[m.sender_id]?.id === m.id) set({ last: { ...state.last, [m.sender_id]: m } });
    })
    .subscribe(status => { if (status === "SUBSCRIBED" && live()) { void refreshFriendships(); void refreshInbox(); recoveryListeners.forEach(fn => fn()); } });
  const unlock = () => { audio(); };
  window.addEventListener("pointerdown", unlock, { once: true });
  const onVisible = () => { if (live() && document.visibilityState === "visible") { void refreshInbox(); recoveryListeners.forEach(fn => fn()); } };
  document.addEventListener("visibilitychange", onVisible);
  const onWorkerMessage = (e: MessageEvent) => {
    const d = e.data as { type?: string; kind?: SocialNotice["kind"]; from?: string } | null;
    if (d?.type === "social-open" && d.kind && d.from) openSocialNotice({ kind: d.kind, from: d.from });
  };
  navigator.serviceWorker?.addEventListener("message", onWorkerMessage);
  return () => {
    if (live()) { generation++; state = INITIAL; mediaUrlCache.clear(); listeners.forEach(l => l()); }
    void sb.removeChannel(channel);
    window.removeEventListener("pointerdown", unlock);
    document.removeEventListener("visibilitychange", onVisible);
    navigator.serviceWorker?.removeEventListener("message", onWorkerMessage);
  };
}
export function useSocialSession(me: string | null | undefined) {
  useEffect(() => (me ? startSocial(me) : undefined), [me]);
}

/** Short text for lists/notifications; media messages show a label. */
export function messagePreview(m: Pick<DirectMessage, "body" | "kind" | "deleted_at">) {
  if (m.deleted_at) return "🚫 Mesaj silindi";
  if (m.kind === "image") return "📷 " + (m.body || "Şəkil");
  if (m.kind === "audio") return "🎤 Səsli mesaj";
  return m.body;
}

const mediaUrlCache = new Map<string, { url: string; exp: number }>();
/** Signed URL for a private dm-media object, cached until shortly before expiry. */
export async function mediaUrl(path: string) {
  const hit = mediaUrlCache.get(path);
  if (hit && hit.exp > Date.now()) return hit.url;
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.storage.from("dm-media").createSignedUrl(path, 3600);
  if (!data?.signedUrl) return null;
  mediaUrlCache.set(path, { url: data.signedUrl, exp: Date.now() + 3300_000 });
  return data.signedUrl;
}

/** Uploads an image/voice file to private storage, then inserts the message (delivered over realtime). */
export async function sendMediaMessage(me: string, to: string, file: Blob, kind: "image" | "audio", opts: { caption?: string; durationMs?: number } = {}) {
  const sb = getSupabase();
  if (!sb) return { ok: false as const, error: "Bağlantı yoxdur" };
  if (file.size > 10 * 1024 * 1024) return { ok: false as const, error: "Fayl 10 MB-dan kiçik olmalıdır" };
  const type = (file.type || (kind === "audio" ? "audio/webm" : "image/jpeg")).split(";")[0] ?? "application/octet-stream";
  const ext = type.split("/")[1]?.replace("mpeg", "mp3") || "bin";
  const path = `${me}/${to}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const up = await sb.storage.from("dm-media").upload(path, file, { contentType: type, upsert: false });
  if (up.error) return { ok: false as const, error: "Fayl yüklənmədi" };
  const { data, error } = await sb.from("direct_messages")
    .insert({ sender_id: me, recipient_id: to, body: (opts.caption ?? "").slice(0, MAX_MESSAGE_LENGTH), kind, media_path: path, duration_ms: opts.durationMs ?? null })
    .select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at").single();
  if (error || !data) return { ok: false as const, error: "Mesaj göndərilmədi" };
  const message = data as DirectMessage;
  set({ last: { ...state.last, [to]: message } });
  return { ok: true as const, message };
}

/** Sender-only unsend: wipes content server-side and both sides receive the UPDATE in realtime. */
export async function unsendMessage(m: DirectMessage) {
  const sb = getSupabase();
  if (!sb) return { ok: false as const, error: "Bağlantı yoxdur" };
  const { data, error } = await sb.rpc("unsend_message", { _id: m.id });
  if (error || !data) return { ok: false as const, error: "Mesaj silinmədi" };
  if (m.media_path) void sb.storage.from("dm-media").remove([m.media_path]);
  const row = data as DirectMessage;
  if (state.last[row.recipient_id]?.id === row.id) set({ last: { ...state.last, [row.recipient_id]: row } });
  return { ok: true as const, message: row };
}

export type ReportCategory = "spam" | "harassment" | "inappropriate" | "fake" | "scam" | "other";
/** Files a report for the admin panel. */
export async function reportUser(me: string, target: string, category: ReportCategory, details: string, context: "chat" | "profile" = "chat") {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("user_reports").insert({ reporter_id: me, reported_id: target, category, details: details.trim().slice(0, 1000), context });
  return !error;
}
