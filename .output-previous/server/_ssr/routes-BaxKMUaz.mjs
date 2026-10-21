import { i as __toESM } from "../_runtime.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { t as getSupabase } from "./supabase-BUCaDQ6-.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { i as useAuth, n as refreshProfile, r as signOut } from "./auth-BrRZs5FB.mjs";
import { a as useAppTranslation, i as translate, o as usePreferences } from "./app-preferences-zyvxFMgU.mjs";
import { $ as Check, A as MessageCircle, B as Heart, C as Plus, D as Minimize2, F as LockOpen, G as Crown, J as Clock, K as CornerUpLeft, L as LoaderCircle, M as LogOut, N as LogIn, O as Mic, P as Lock, R as KeyRound, V as Gift, W as Ellipsis, X as ChevronRight, Z as ChevronLeft, _ as Smile, a as Users, at as AtSign, b as Send, c as UserPlus, ct as ArrowDown, d as Type, et as CheckCheck, f as TriangleAlert, g as Sparkles, i as Video, it as BellOff, j as Maximize2, k as MicOff, l as UserCheck, lt as ArrowDownToLine, n as VolumeX, o as UserX, p as Trash2, q as Copy, r as Volume2, rt as Bell, s as UserRound, st as ArrowLeft, t as X, tt as Camera, x as Search, y as Settings, z as Image$1 } from "../_libs/lucide-react.mjs";
import { t as AppControls } from "./app-controls-D3gGUfTe.mjs";
import { n as gameError } from "./game-language-BY9iR37b.mjs";
import { d as saveBio, h as DEFAULT_PHOTO, i as playChatAlert, p as unlockSfx, r as loadPublicProfile, s as preloadChatAlert, t as getProfileStats, u as recordProfileView } from "./player-photo-BFw6nAbg.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxspnPmW.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BaxKMUaz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_MESSAGE_LENGTH = 1e3;
function normalizeMessage(text) {
	const t = text.replace(/\r\n/g, "\n").trim();
	if (!t || t.length > 1e3) return null;
	return t;
}
function otherParty(f, me) {
	return f.requester_id === me ? f.addressee_id : f.requester_id;
}
function friendStateFor(me, other, list) {
	const f = list.find((x) => x.requester_id === me && x.addressee_id === other || x.addressee_id === me && x.requester_id === other);
	if (!f) return "none";
	if (f.status === "accepted") return "friends";
	return f.requester_id === me ? "sent" : "received";
}
function conversationKey(a, b) {
	return a < b ? `${a}:${b}` : `${b}:${a}`;
}
function upsertMessage(list, m) {
	const next = list.filter((x) => x.id !== m.id);
	next.push(m);
	return next.sort((a, b) => a.created_at.localeCompare(b.created_at));
}
/** Deletion and read receipts are monotonic, including across reconnect snapshots. */
function mergeConversation(list, rows) {
	return rows.reduce((next, row) => {
		const existing = next.find((message) => message.id === row.id);
		return upsertMessage(next, existing ? {
			...row,
			read_at: existing.read_at ?? row.read_at,
			...existing.deleted_at ? {
				deleted_at: existing.deleted_at,
				body: "",
				media_path: null
			} : {}
		} : row);
	}, [...list]);
}
function summarizeInbox(me, rows) {
	const last = {};
	const unread = {};
	for (const m of rows) {
		const peer = m.sender_id === me ? m.recipient_id : m.sender_id;
		const prev = last[peer];
		if (!prev || prev.created_at < m.created_at) last[peer] = m;
		if (m.recipient_id === me && !m.read_at && !m.deleted_at) unread[peer] = (unread[peer] ?? 0) + 1;
	}
	return {
		last,
		unread
	};
}
var INITIAL = {
	me: null,
	friendships: [],
	profiles: {},
	unread: {},
	last: {},
	notices: [],
	activeChat: null
};
var state = INITIAL;
var listeners = /* @__PURE__ */ new Set();
function set(patch) {
	state = {
		...state,
		...patch
	};
	listeners.forEach((l) => l());
}
function subscribe(l) {
	listeners.add(l);
	return () => {
		listeners.delete(l);
	};
}
function useSocial() {
	return (0, import_react.useSyncExternalStore)(subscribe, () => state, () => INITIAL);
}
var messageListeners = /* @__PURE__ */ new Set();
var recoveryListeners = /* @__PURE__ */ new Set();
function onSocialRecovery(fn) {
	recoveryListeners.add(fn);
	return () => {
		recoveryListeners.delete(fn);
	};
}
function onDirectMessage(fn) {
	messageListeners.add(fn);
	return () => {
		messageListeners.delete(fn);
	};
}
var openListeners = /* @__PURE__ */ new Set();
function onSocialOpen(fn) {
	openListeners.add(fn);
	return () => {
		openListeners.delete(fn);
	};
}
function openSocialNotice(n) {
	openListeners.forEach((l) => l(n));
}
var ac = null;
function audio() {
	if (typeof window === "undefined") return null;
	if (!ac) {
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return null;
		ac = new Ctor();
	}
	if (ac.state === "suspended") ac.resume();
	return ac;
}
/** Call from a user gesture so mobile browsers allow later notification sounds. */
function unlockSocialAudio() {
	audio();
	unlockSfx();
	preloadChatAlert();
}
var SOUND_KEY = "deltagame.social.sound";
function socialSoundEnabled() {
	try {
		return localStorage.getItem(SOUND_KEY) !== "off";
	} catch {
		return true;
	}
}
function setSocialSound(on) {
	try {
		localStorage.setItem(SOUND_KEY, on ? "on" : "off");
	} catch {}
}
function playSocialSound(kind) {
	if (!socialSoundEnabled()) return;
	const ctx = audio();
	if (!ctx) return;
	const notes = kind === "message" ? [[880, 0], [1318.5, .11]] : [
		[659.25, 0],
		[880, .12],
		[1174.7, .24]
	];
	for (const [freq, at] of notes) {
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = "sine";
		o.frequency.value = freq;
		const s = ctx.currentTime + at;
		g.gain.setValueAtTime(1e-4, s);
		g.gain.exponentialRampToValueAtTime(.28, s + .015);
		g.gain.exponentialRampToValueAtTime(1e-4, s + .38);
		o.connect(g).connect(ctx.destination);
		o.start(s);
		o.stop(s + .42);
	}
}
var worker = null;
function registerWorker() {
	if (!("serviceWorker" in navigator)) return;
	navigator.serviceWorker.register("/social-sw.js").then((r) => {
		worker = r;
	}, () => {
		worker = null;
	});
}
function requestNotifyPermission() {
	if (typeof window === "undefined" || !("Notification" in window)) return;
	if (Notification.permission === "default") Notification.requestPermission();
}
async function systemNotify(n) {
	if (!("Notification" in window) || Notification.permission !== "granted") return;
	const options = {
		body: n.body,
		icon: n.photo || "/icon-192.png",
		badge: "/icon-192.png",
		tag: n.id,
		data: {
			kind: n.kind,
			from: n.from
		}
	};
	try {
		if (worker) {
			await worker.showNotification(n.title, options);
			return;
		}
		const note = new Notification(n.title, options);
		note.onclick = () => {
			window.focus();
			openSocialNotice(n);
			note.close();
		};
	} catch {}
}
function notify(n) {
	if (n.kind !== "message") playSocialSound(n.kind);
	if (document.visibilityState === "visible") {
		set({ notices: [n, ...state.notices.filter((x) => x.id !== n.id)].slice(0, 3) });
		window.setTimeout(() => dismissNotice(n.id), 5500);
	} else systemNotify(n);
}
function dismissNotice(id) {
	if (state.notices.some((n) => n.id === id)) set({ notices: state.notices.filter((n) => n.id !== id) });
}
async function ensureProfiles(ids) {
	const gen = generation;
	const sb = getSupabase();
	const missing = [...new Set(ids)].filter((id) => !state.profiles[id]);
	if (!sb || !missing.length) return;
	const { data } = await sb.from("profiles").select("id,name,username,photo_url").in("id", missing);
	if (!data || gen !== generation) return;
	const profiles = { ...state.profiles };
	for (const p of data) profiles[p.id] = p;
	set({ profiles });
}
async function refreshFriendships() {
	const gen = generation;
	const sb = getSupabase();
	const me = state.me;
	if (!sb || !me) return;
	const { data } = await sb.from("friendships").select("id,requester_id,addressee_id,status,created_at").order("created_at", { ascending: false });
	if (!data || state.me !== me || gen !== generation) return;
	const friendships = data;
	set({ friendships });
	await ensureProfiles(friendships.map((f) => otherParty(f, me)));
}
async function refreshInbox() {
	const gen = generation;
	const sb = getSupabase();
	const me = state.me;
	if (!sb || !me) return;
	const { data } = await sb.from("direct_messages").select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at").order("created_at", { ascending: false }).limit(400);
	if (!data || state.me !== me || gen !== generation) return;
	const { last, unread } = summarizeInbox(me, data);
	if (state.activeChat) unread[state.activeChat] = 0;
	set({
		last,
		unread
	});
	await ensureProfiles(Object.keys(last));
}
async function profileOf(id) {
	await ensureProfiles([id]);
	return state.profiles[id];
}
async function handleIncoming(m) {
	const gen = generation;
	playChatAlert(`direct:${m.id}`, m.sender_id, m.recipient_id, state.me ?? "");
	const peer = m.sender_id;
	set({ last: {
		...state.last,
		[peer]: m
	} });
	messageListeners.forEach((l) => l(m, "insert"));
	if (state.activeChat === peer && document.visibilityState === "visible") return;
	set({ unread: {
		...state.unread,
		[peer]: (state.unread[peer] ?? 0) + 1
	} });
	const p = await profileOf(peer);
	if (gen !== generation) return;
	notify({
		id: `m-${m.id}`,
		kind: "message",
		from: peer,
		title: p?.name ?? "Yeni mesaj",
		body: messagePreview(m).length > 120 ? messagePreview(m).slice(0, 117) + "…" : messagePreview(m),
		photo: p?.photo_url ?? null
	});
}
async function sendFriendRequest(to) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		error: "Bağlantı yoxdur"
	};
	const { error } = await sb.rpc("send_friend_request", { _to: to });
	await refreshFriendships();
	return error ? {
		ok: false,
		error: "İstək göndərilmədi"
	} : { ok: true };
}
async function respondFriendRequest(id, accept) {
	const sb = getSupabase();
	if (!sb) return false;
	const { error } = await sb.rpc("respond_friend_request", {
		_id: id,
		_accept: accept
	});
	await refreshFriendships();
	return !error;
}
async function removeFriendship(id) {
	const sb = getSupabase();
	if (!sb) return false;
	const { error } = await sb.from("friendships").delete().eq("id", id);
	await refreshFriendships();
	return !error;
}
async function loadConversation(me, peer) {
	const sb = getSupabase();
	if (!sb) return [];
	const { data } = await sb.from("direct_messages").select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at").or(`and(sender_id.eq.${me},recipient_id.eq.${peer}),and(sender_id.eq.${peer},recipient_id.eq.${me})`).order("created_at", { ascending: false }).limit(80);
	return (data ?? []).reverse();
}
async function sendDirectMessage(me, to, body) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		error: "Bağlantı yoxdur"
	};
	const { data, error } = await sb.from("direct_messages").insert({
		sender_id: me,
		recipient_id: to,
		body
	}).select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at").single();
	if (error || !data) return {
		ok: false,
		error: "Mesaj göndərilmədi"
	};
	const message = data;
	set({ last: {
		...state.last,
		[to]: message
	} });
	return {
		ok: true,
		message
	};
}
async function markConversationRead(peer) {
	const sb = getSupabase();
	if (!sb) return;
	if (state.unread[peer]) set({ unread: {
		...state.unread,
		[peer]: 0
	} });
	await sb.rpc("mark_messages_read", { _from: peer });
}
function setActiveChat(peer) {
	set({ activeChat: peer });
	if (peer) ensureProfiles([peer]);
}
/** Broadcast-only typing indicator for one conversation. */
function joinTyping(me, peer, onTyping) {
	const sb = getSupabase();
	if (!sb) return {
		ping: () => {},
		leave: () => {}
	};
	let timer = 0;
	let lastPing = 0;
	const ch = sb.channel(`typing:${conversationKey(me, peer)}`, { config: { broadcast: { self: false } } }).on("broadcast", { event: "typing" }, ({ payload }) => {
		if (payload?.from !== peer) return;
		onTyping(true);
		window.clearTimeout(timer);
		timer = window.setTimeout(() => onTyping(false), 3500);
	}).subscribe();
	return {
		ping: () => {
			const now = Date.now();
			if (now - lastPing < 1500) return;
			lastPing = now;
			ch.send({
				type: "broadcast",
				event: "typing",
				payload: { from: me }
			});
		},
		leave: () => {
			window.clearTimeout(timer);
			sb.removeChannel(ch);
		}
	};
}
var generation = 0;
function startSocial(me) {
	const sb = getSupabase();
	if (!sb) return () => {};
	const gen = ++generation;
	set({
		...INITIAL,
		me
	});
	refreshFriendships();
	refreshInbox();
	registerWorker();
	const live = () => gen === generation;
	const channel = sb.channel(`social:${me}`).on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "friendships",
		filter: `addressee_id=eq.${me}`
	}, (payload) => {
		if (!live()) return;
		if (payload.eventType === "INSERT") {
			const f = payload.new;
			profileOf(f.requester_id).then((p) => {
				if (live()) notify({
					id: `r-${f.id}`,
					kind: "request",
					from: f.requester_id,
					title: "Yeni dostluq istəyi",
					body: `${p?.name ?? "Bir oyunçu"} sənə dostluq istəyi göndərdi`,
					photo: p?.photo_url ?? null
				});
			});
		}
		refreshFriendships();
	}).on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "friendships",
		filter: `requester_id=eq.${me}`
	}, (payload) => {
		if (!live()) return;
		const f = payload.new;
		if (payload.eventType === "UPDATE" && f.status === "accepted" && f.addressee_id) {
			const from = f.addressee_id;
			profileOf(from).then((p) => {
				if (live()) notify({
					id: `a-${f.id}`,
					kind: "accepted",
					from,
					title: "İstək qəbul edildi",
					body: `${p?.name ?? "Oyunçu"} dostluq istəyini qəbul etdi — indi yaza bilərsən`,
					photo: p?.photo_url ?? null
				});
			});
		}
		refreshFriendships();
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "direct_messages",
		filter: `recipient_id=eq.${me}`
	}, (payload) => {
		if (live()) handleIncoming(payload.new);
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "direct_messages",
		filter: `sender_id=eq.${me}`
	}, (payload) => {
		if (!live()) return;
		const m = payload.new;
		const previous = state.last[m.recipient_id];
		if (!previous || previous.created_at <= m.created_at) set({ last: {
			...state.last,
			[m.recipient_id]: m
		} });
		messageListeners.forEach((l) => l(m, "insert"));
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "profile_notifications",
		filter: `user_id=eq.${me}`
	}, (payload) => {
		if (!live()) return;
		const n = payload.new;
		if (n.payload?.type === "harem_purchase") return;
		(n.actor_id ? profileOf(n.actor_id) : Promise.resolve(void 0)).then((p) => {
			if (live()) notify({
				id: `h-${n.id}`,
				kind: "harem",
				from: n.actor_id ?? me,
				title: "Heyranlıq",
				body: n.body,
				photo: p?.photo_url ?? null
			});
		});
	}).on("postgres_changes", {
		event: "UPDATE",
		schema: "public",
		table: "direct_messages",
		filter: `sender_id=eq.${me}`
	}, (payload) => {
		if (!live()) return;
		const m = payload.new;
		messageListeners.forEach((l) => l(m, "update"));
		if (state.last[m.recipient_id]?.id === m.id) set({ last: {
			...state.last,
			[m.recipient_id]: m
		} });
	}).on("postgres_changes", {
		event: "UPDATE",
		schema: "public",
		table: "direct_messages",
		filter: `recipient_id=eq.${me}`
	}, (payload) => {
		if (!live()) return;
		const m = payload.new;
		messageListeners.forEach((l) => l(m, "update"));
		if (state.last[m.sender_id]?.id === m.id) set({ last: {
			...state.last,
			[m.sender_id]: m
		} });
	}).subscribe((status) => {
		if (status === "SUBSCRIBED" && live()) {
			refreshFriendships();
			refreshInbox();
			recoveryListeners.forEach((fn) => fn());
		}
	});
	const unlock = () => {
		audio();
	};
	window.addEventListener("pointerdown", unlock, { once: true });
	const onVisible = () => {
		if (live() && document.visibilityState === "visible") {
			refreshInbox();
			recoveryListeners.forEach((fn) => fn());
		}
	};
	document.addEventListener("visibilitychange", onVisible);
	const onWorkerMessage = (e) => {
		const d = e.data;
		if (d?.type === "social-open" && d.kind && d.from) openSocialNotice({
			kind: d.kind,
			from: d.from
		});
	};
	navigator.serviceWorker?.addEventListener("message", onWorkerMessage);
	return () => {
		if (live()) {
			generation++;
			state = INITIAL;
			mediaUrlCache.clear();
			listeners.forEach((l) => l());
		}
		sb.removeChannel(channel);
		window.removeEventListener("pointerdown", unlock);
		document.removeEventListener("visibilitychange", onVisible);
		navigator.serviceWorker?.removeEventListener("message", onWorkerMessage);
	};
}
function useSocialSession(me) {
	(0, import_react.useEffect)(() => me ? startSocial(me) : void 0, [me]);
}
/** Short text for lists/notifications; media messages show a label. */
function messagePreview(m) {
	if (m.deleted_at) return "🚫 Mesaj silindi";
	if (m.kind === "image") return "📷 " + (m.body || "Şəkil");
	if (m.kind === "audio") return "🎤 Səsli mesaj";
	return m.body;
}
var mediaUrlCache = /* @__PURE__ */ new Map();
/** Signed URL for a private dm-media object, cached until shortly before expiry. */
async function mediaUrl(path) {
	const hit = mediaUrlCache.get(path);
	if (hit && hit.exp > Date.now()) return hit.url;
	const sb = getSupabase();
	if (!sb) return null;
	const { data } = await sb.storage.from("dm-media").createSignedUrl(path, 3600);
	if (!data?.signedUrl) return null;
	mediaUrlCache.set(path, {
		url: data.signedUrl,
		exp: Date.now() + 33e5
	});
	return data.signedUrl;
}
/** Uploads an image/voice file to private storage, then inserts the message (delivered over realtime). */
async function sendMediaMessage(me, to, file, kind, opts = {}) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		error: "Bağlantı yoxdur"
	};
	if (file.size > 10485760) return {
		ok: false,
		error: "Fayl 10 MB-dan kiçik olmalıdır"
	};
	const type = (file.type || (kind === "audio" ? "audio/webm" : "image/jpeg")).split(";")[0] ?? "application/octet-stream";
	const ext = type.split("/")[1]?.replace("mpeg", "mp3") || "bin";
	const path = `${me}/${to}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
	if ((await sb.storage.from("dm-media").upload(path, file, {
		contentType: type,
		upsert: false
	})).error) return {
		ok: false,
		error: "Fayl yüklənmədi"
	};
	const { data, error } = await sb.from("direct_messages").insert({
		sender_id: me,
		recipient_id: to,
		body: (opts.caption ?? "").slice(0, MAX_MESSAGE_LENGTH),
		kind,
		media_path: path,
		duration_ms: opts.durationMs ?? null
	}).select("id,sender_id,recipient_id,body,kind,media_path,duration_ms,deleted_at,created_at,read_at").single();
	if (error || !data) return {
		ok: false,
		error: "Mesaj göndərilmədi"
	};
	const message = data;
	set({ last: {
		...state.last,
		[to]: message
	} });
	return {
		ok: true,
		message
	};
}
/** Sender-only unsend: wipes content server-side and both sides receive the UPDATE in realtime. */
async function unsendMessage(m) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		error: "Bağlantı yoxdur"
	};
	const { data, error } = await sb.rpc("unsend_message", { _id: m.id });
	if (error || !data) return {
		ok: false,
		error: "Mesaj silinmədi"
	};
	if (m.media_path) sb.storage.from("dm-media").remove([m.media_path]);
	const row = data;
	if (state.last[row.recipient_id]?.id === row.id) set({ last: {
		...state.last,
		[row.recipient_id]: row
	} });
	return {
		ok: true,
		message: row
	};
}
/** Files a report for the admin panel. */
async function reportUser(me, target, category, details, context = "chat") {
	const sb = getSupabase();
	if (!sb) return false;
	const { error } = await sb.from("user_reports").insert({
		reporter_id: me,
		reported_id: target,
		category,
		details: details.trim().slice(0, 1e3),
		context
	});
	return !error;
}
function FriendButton({ me, userId, onMessage }) {
	usePreferences();
	const social = useSocial();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const st = friendStateFor(me, userId, social.friendships);
	const pending = social.friendships.find((f) => f.requester_id === userId && f.addressee_id === me && f.status === "pending");
	const label = failed ? translate("Yenidən") : st === "friends" ? translate("Mesaj") : st === "sent" ? translate("Göndərildi") : st === "received" ? translate("Qəbul et") : translate("izlə");
	const click = async () => {
		unlockSocialAudio();
		if (st === "friends") {
			onMessage();
			return;
		}
		if (st === "sent" || busy) return;
		requestNotifyPermission();
		setBusy(true);
		setFailed(false);
		const ok = st === "received" && pending ? await respondFriendRequest(pending.id, true) : (await sendFriendRequest(userId)).ok;
		setBusy(false);
		if (!ok) setFailed(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: FB_STYLES }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "mh-follow fb-" + st + (busy ? " fb-busy" : ""),
		disabled: st === "sent",
		"aria-busy": busy,
		onClick: () => void click(),
		children: busy ? "…" : label
	})] });
}
var FB_STYLES = `
.mh-follow{transition:transform .15s ease,background .25s,color .25s;}
.mh-follow:active{transform:scale(.92);}
.mh-follow.fb-sent{background:var(--surface);color:var(--muted-foreground);border:1px solid var(--border);cursor:default;}
.mh-follow.fb-received{background:var(--heart);color:var(--primary-foreground);animation:fb-pulse 1.6s infinite;}
.mh-follow.fb-friends{background:var(--accent);color:var(--primary);}
.mh-follow.fb-busy{opacity:.7;}
@keyframes fb-pulse{50%{transform:scale(1.06);}}
@media(prefers-reduced-motion:reduce){.mh-follow{animation:none!important;}}
`;
var base = ({ size = 22, ...rest }) => ({
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.9,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": true,
	...rest
});
var IconHome = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.5 10.5 12 3.5l8.5 7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.5 9v10a1.5 1.5 0 0 0 1.5 1.5h3.5v-6h3v6H17a1.5 1.5 0 0 0 1.5-1.5V9" })]
});
var IconLive = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "2.4"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" })]
});
var IconChat = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		d: "M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01",
		strokeWidth: 2.6
	})]
});
var IconUser = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "8",
		r: "4"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 20.5c1.4-3.6 4.4-5.5 8-5.5s6.6 1.9 8 5.5" })]
});
var IconBack = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	...base(p),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 5l-7 7 7 7" })
});
var IconCamera = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2.5h6L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "13",
		r: "3.5"
	})]
});
var IconEye = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	})]
});
var IconPen = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13.5 6.5l4 4" })]
});
var IconCheck = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	...base(p),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12.5l4.5 4.5L19 7.5" })
});
var IconClose = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	...base(p),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 6l12 12M18 6 6 18" })
});
var IconGear = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" })]
});
var IconLogout = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 16.5 5.5 12 10 7.5M5.5 12H15" })]
});
var IconGrid = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "4",
			y: "4",
			width: "6.5",
			height: "6.5",
			rx: "1.5"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "13.5",
			y: "4",
			width: "6.5",
			height: "6.5",
			rx: "1.5"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "4",
			y: "13.5",
			width: "6.5",
			height: "6.5",
			rx: "1.5"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "13.5",
			y: "13.5",
			width: "6.5",
			height: "6.5",
			rx: "1.5"
		})
	]
});
var IconInfo = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "9"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		d: "M12 11v5.5M12 7.8h.01",
		strokeWidth: 2.4
	})]
});
var IconImage = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "3.5",
			y: "4.5",
			width: "17",
			height: "15",
			rx: "2.5"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "9",
			cy: "10",
			r: "1.8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m20.5 16-4.8-4.8L6 19.5" })
	]
});
var IconMic = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "9",
		y: "3",
		width: "6",
		height: "11",
		rx: "3"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" })]
});
var IconPlay = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	...base(p),
	fill: "currentColor",
	stroke: "none",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" })
});
var IconPause = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	fill: "currentColor",
	stroke: "none",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "6.5",
		y: "5",
		width: "4",
		height: "14",
		rx: "1.2"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "13.5",
		y: "5",
		width: "4",
		height: "14",
		rx: "1.2"
	})]
});
var IconTrash = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	...base(p),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5" })
});
var IconSend = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	...base(p),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5Z" })
});
var IconUsers = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "9",
		cy: "8",
		r: "3.5"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 19.5c1-3 3.5-4.5 6.5-4.5s5.5 1.5 6.5 4.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 15.3c1.7.6 2.9 2 3.5 4.2" })]
});
var IconFlag = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...base(p),
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 21V4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 4.5c4-2 7 2 11 0l2.5-1v9.5l-2.5 1c-4 2-7-2-11 0" })]
});
function useStats(id) {
	const [stats, setStats] = (0, import_react.useState)(null);
	const social = useSocial();
	(0, import_react.useEffect)(() => {
		if (!id) return;
		let on = true;
		getProfileStats(id).then((s) => {
			if (on) setStats(s);
		});
		return () => {
			on = false;
		};
	}, [id, social.friendships.length]);
	return stats;
}
function Stats({ stats }) {
	const t = useAppTranslation();
	const { language } = usePreferences();
	const n = (v) => v == null ? "—" : new Intl.NumberFormat(language, { notation: v >= 1e4 ? "compact" : "standard" }).format(v);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pf-stats",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: n(stats?.followers) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("İzləyici") })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: n(stats?.following) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("İzlənilən") })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
				className: "pf-views",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconEye, { size: 16 }), n(stats?.views)]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("Baxış") })] })
		]
	});
}
function Details({ p }) {
	const t = useAppTranslation();
	const { language } = usePreferences();
	const d = p.created_at ? new Date(p.created_at) : null;
	const rows = [
		[t("İstifadəçi adı"), `@${p.username}`],
		[t("Oyunçu nömrəsi"), `#${p.player_no ?? "—"}`],
		[t("Yaş"), p.age ?? t("Göstərilməyib")],
		[t("Şəhər"), p.city || t("Göstərilməyib")],
		[t("Qeydiyyat tarixi"), d && !Number.isNaN(d.valueOf()) ? new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(d) : t("Göstərilməyib")]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "pf-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconInfo, { size: 17 }), t("Şəxsi məlumatlar")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children: rows.map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: l }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v })] }, l)) })]
	});
}
function MobileProfile({ profile: p, defaultPhoto, onBack, onPhoto, uploading, notice, onSignOut, extra }) {
	const t = useAppTranslation();
	const [tab, setTab] = (0, import_react.useState)("overview");
	const photo = (0, import_react.useRef)(null);
	const stats = useStats(p.id);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [bio, setBio] = (0, import_react.useState)(p.bio ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!editing) setBio(p.bio ?? "");
	}, [p.bio, editing]);
	const save = async () => {
		if (!p.id) return;
		setSaving(true);
		setErr("");
		const ok = await saveBio(p.id, bio);
		setSaving(false);
		if (!ok) {
			setErr(t("Status yadda saxlanılmadı"));
			return;
		}
		await refreshProfile();
		setEditing(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "pf-page",
		"aria-label": t("Profil"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: PF_STYLES }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pf-bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pf-ic",
						onClick: onBack,
						"aria-label": t("Geri"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBack, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["@", p.username] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pf-ic" + (tab === "settings" ? " on" : ""),
						onClick: () => setTab(tab === "settings" ? "overview" : "settings"),
						"aria-label": t("Ayarlar"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconGear, { size: 20 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pf-cover",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pf-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pf-avatar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.photo_url || defaultPhoto,
							alt: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: uploading,
							"aria-label": t("Şəkli dəyiş"),
							onClick: () => photo.current?.click(),
							children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pf-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCamera, { size: 16 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: p.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "pf-handle",
						children: [
							"@",
							p.username,
							" · #",
							p.player_no
						]
					}),
					editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pf-bio-edit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: bio,
							maxLength: 160,
							rows: 3,
							autoFocus: true,
							onChange: (e) => setBio(e.target.value),
							placeholder: t("Status və ya bio yaz…")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								bio.length,
								"/",
								160
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pf-chip ghost",
								onClick: () => {
									setEditing(false);
									setErr("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconClose, { size: 15 }), t("Ləğv et")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pf-chip",
								disabled: saving,
								onClick: () => void save(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCheck, { size: 15 }), saving ? "…" : t("Yadda saxla")]
							})
						] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pf-bio" + (p.bio ? "" : " empty"),
						onClick: () => setEditing(true),
						children: [p.bio || t("Status əlavə et"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPen, { size: 14 })]
					}),
					err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pf-err",
						role: "alert",
						children: err
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				hidden: true,
				ref: photo,
				onChange: (e) => {
					const f = e.target.files?.[0];
					e.target.value = "";
					if (f) onPhoto(f);
				}
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pf-err",
				role: "status",
				children: notice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, { stats }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pf-seg",
				role: "tablist",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": tab === "overview",
					onClick: () => setTab("overview"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconGrid, { size: 17 }), t("Ümumi")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": tab === "settings",
					onClick: () => setTab("settings"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconGear, { size: 17 }), t("Ayarlar")]
				})]
			}),
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [extra, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Details, { p })] }),
			tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "pf-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconGear, { size: 17 }), t("Ayarlar")] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pf-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							t("Görünüş"),
							" / ",
							t("Dil")
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppControls, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pf-signout",
						onClick: onSignOut,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLogout, { size: 18 }), t("Çıxış et")]
					})
				]
			})
		]
	});
}
/** Another player's profile: counts a view, shows bio/stats and follow/message actions. */
function UserProfileView({ me, userId, defaultPhoto, onBack, onMessage }) {
	const t = useAppTranslation();
	const [p, setP] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const stats = useStats(userId);
	(0, import_react.useEffect)(() => {
		let on = true;
		setP(null);
		setMissing(false);
		loadPublicProfile(userId).then((r) => {
			if (!on) return;
			if (r) setP(r);
			else setMissing(true);
		});
		if (userId !== me) recordProfileView(userId);
		return () => {
			on = false;
		};
	}, [userId, me]);
	(0, import_react.useEffect)(() => {
		const o = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = o;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "pf-page pf-other",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": t("Profil"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: PF_STYLES }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pf-bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pf-ic",
						onClick: onBack,
						"aria-label": t("Geri"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBack, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: p ? "@" + p.username : "" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pf-ic-space" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pf-cover",
				"aria-hidden": "true"
			}),
			missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pf-empty",
				children: t("Profil tapılmadı")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pf-hero",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pf-avatar",
							children: p ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.photo_url || defaultPhoto,
								alt: p.name
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pf-skel" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: p?.name ?? "…" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pf-handle",
							children: p ? `@${p.username} · #${p.player_no ?? ""}` : ""
						}),
						p?.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pf-bio static",
							children: p.bio
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, { stats }),
				userId !== me && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pf-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendButton, {
						me,
						userId,
						onMessage: () => onMessage(userId)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pf-chip ghost big",
						onClick: () => onMessage(userId),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconUsers, { size: 17 }), t("Mesaj")]
					})]
				}),
				p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Details, { p })
			] })
		]
	});
}
var PF_STYLES = `
.pf-page{position:fixed;inset:0;z-index:35;overflow-y:auto;overscroll-behavior:contain;background:var(--background);color:var(--foreground);padding:0 0 calc(120px + env(safe-area-inset-bottom));animation:pf-in .3s cubic-bezier(.2,.9,.3,1) both;-webkit-overflow-scrolling:touch;}
.pf-page.pf-other{z-index:70;padding-bottom:max(30px,env(safe-area-inset-bottom));}
.pf-page>*{max-width:520px;margin-left:auto;margin-right:auto;}
.pf-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:10px;padding:max(10px,env(safe-area-inset-top)) 14px 10px;background:color-mix(in oklch,var(--background) 80%,transparent);backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5);}
.pf-bar h1{flex:1;margin:0;text-align:center;font-size:16px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pf-ic,.pf-ic-space{all:unset;cursor:pointer;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--surface);border:1px solid var(--border);color:var(--foreground);flex-shrink:0;transition:transform .15s;}
.pf-ic-space{visibility:hidden;}.pf-ic:active{transform:scale(.9);}.pf-ic.on{color:var(--primary);}
.pf-cover{height:110px;margin-top:-60px!important;border-radius:0 0 28px 28px;background:linear-gradient(135deg,color-mix(in oklch,var(--primary) 70%,var(--background)),color-mix(in oklch,var(--heart) 55%,var(--background)));}
.pf-hero{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 22px;margin-top:-52px!important;}
.pf-avatar{position:relative;width:104px;height:104px;}
.pf-avatar img,.pf-skel{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;border:4px solid var(--background);box-shadow:0 10px 30px oklch(.2 .05 260 / .25);background:var(--surface);}
.pf-avatar button{all:unset;cursor:pointer;position:absolute;right:0;bottom:2px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);border:3px solid var(--background);}
.pf-hero h2{margin:12px 0 2px;font-size:23px;font-weight:850;letter-spacing:-.3px;overflow-wrap:anywhere;}
.pf-handle{margin:0;font-size:13px;color:var(--muted-foreground);}
.pf-bio{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;margin-top:12px;max-width:100%;padding:8px 14px;border-radius:16px;background:var(--surface);border:1px solid var(--border);font-size:14px;line-height:1.4;white-space:pre-wrap;overflow-wrap:anywhere;}
.pf-bio svg{flex-shrink:0;color:var(--muted-foreground);}
.pf-bio.empty{color:var(--primary);font-weight:700;border-style:dashed;}
.pf-bio.static{cursor:default;}
.pf-bio-edit{width:100%;margin-top:12px;}
.pf-bio-edit textarea{box-sizing:border-box;width:100%;resize:none;padding:12px 14px;border-radius:16px;border:1.5px solid var(--primary);background:var(--surface);color:var(--foreground);font:inherit;font-size:14px;outline:none;}
.pf-bio-edit>div{display:flex;align-items:center;gap:8px;margin-top:8px;}.pf-bio-edit small{flex:1;text-align:left;color:var(--muted-foreground);font-size:11px;}
.pf-chip{all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 14px;border-radius:17px;background:var(--primary);color:var(--primary-foreground);font-size:13px;font-weight:750;}
.pf-chip.ghost{background:var(--surface);color:var(--foreground);border:1px solid var(--border);}
.pf-chip.big{height:40px;border-radius:20px;flex:1;}
.pf-chip:disabled{opacity:.6;}
.pf-err{margin:10px 22px 0;text-align:center;font-size:12px;color:var(--heart);font-weight:650;}
.pf-stats{display:grid;grid-template-columns:repeat(3,1fr);margin:20px 16px 0!important;padding:14px 4px;border-radius:20px;background:var(--surface);border:1px solid var(--border);}
.pf-stats>div{display:flex;flex-direction:column;align-items:center;gap:3px;}
.pf-stats>div+div{border-left:1px solid var(--border);}
.pf-stats strong{display:inline-flex;align-items:center;gap:5px;font-size:20px;font-weight:850;font-variant-numeric:tabular-nums;}
.pf-views svg{color:var(--primary);}
.pf-stats span{font-size:11.5px;color:var(--muted-foreground);font-weight:600;}
.pf-actions{display:flex;gap:10px;margin:16px 16px 0!important;}
.pf-actions .mh-follow{flex:1;height:40px;border-radius:20px;font-size:14px;font-weight:800;border:0;cursor:pointer;background:var(--primary);color:var(--primary-foreground);}
.pf-seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin:20px 16px 0!important;padding:4px;border-radius:16px;background:var(--surface);border:1px solid var(--border);}
.pf-seg button{all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;height:38px;border-radius:12px;font-size:13px;font-weight:700;color:var(--muted-foreground);transition:background .2s,color .2s;}
.pf-seg button[aria-selected=true]{background:var(--background);color:var(--foreground);box-shadow:0 2px 8px oklch(.2 .02 260 / .12);}
.pf-card{margin:16px 16px 0!important;padding:16px;border-radius:20px;background:var(--surface);border:1px solid var(--border);}
.pf-card h3{display:flex;align-items:center;gap:8px;margin:0 0 6px;font-size:14px;font-weight:800;}.pf-card h3 svg{color:var(--primary);}
.pf-card dl{margin:0;}.pf-card dl>div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;font-size:13px;}.pf-card dl>div+div{border-top:1px solid var(--border);}
.pf-card dt{color:var(--muted-foreground);}.pf-card dd{margin:0;text-align:right;font-weight:650;overflow-wrap:anywhere;}
.pf-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;font-size:13px;}
.pf-signout{all:unset;cursor:pointer;display:flex;align-items:center;gap:8px;margin-top:8px;padding:12px 0;color:var(--heart);font-weight:750;font-size:14px;}
.pf-page .fr-root,.pf-page>section:not(.pf-card){margin-left:16px;margin-right:16px;}
.pf-empty{text-align:center;color:var(--muted-foreground);padding:60px 20px;}
.pf-spin{width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:pf-rot .7s linear infinite;}
@keyframes pf-in{from{transform:translateY(16px);opacity:0;}}
@keyframes pf-rot{to{transform:rotate(360deg);}}
@media(prefers-reduced-motion:reduce){.pf-page{animation:none;}}
`;
var Input = objectType({
	budget: numberType().min(0).max(1e4),
	wish: stringType().trim().min(1).max(400)
});
var recommendShopPack = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("b11fe824a6d80c4351f22a26de808f17730262fd8cc7769822f049bb3a05b751"));
var STATUS_BGS = {
	emerald: "linear-gradient(160deg, oklch(.6 .15 165), oklch(.36 .09 195))",
	sunset: "linear-gradient(160deg, oklch(.72 .17 50), oklch(.55 .21 15))",
	night: "linear-gradient(160deg, oklch(.35 .08 260), oklch(.18 .04 280))",
	rose: "linear-gradient(160deg, oklch(.72 .16 0), oklch(.5 .2 340))",
	ocean: "linear-gradient(160deg, oklch(.7 .13 220), oklch(.42 .14 250))",
	gold: "linear-gradient(160deg, oklch(.85 .15 90), oklch(.62 .15 60))"
};
var statusBg = (bg) => STATUS_BGS[bg] ?? STATUS_BGS["emerald"];
var BUCKET = "statuses";
var VIDEO_EXT = [
	"mp4",
	"webm",
	"mov",
	"m4v"
];
var IMAGE_EXT = [
	"jpg",
	"jpeg",
	"png",
	"webp",
	"gif",
	"heic",
	"heif"
];
function fileKind(file) {
	if (file.type.startsWith("video/")) return "video";
	if (file.type.startsWith("image/")) return "image";
	const ext = (file.name.split(".").pop() || "").toLowerCase();
	if (VIDEO_EXT.includes(ext)) return "video";
	if (IMAGE_EXT.includes(ext)) return "image";
	return null;
}
function contentType(file, kind) {
	if (file.type) return file.type;
	const ext = (file.name.split(".").pop() || "").toLowerCase();
	if (kind === "video") return ext === "webm" ? "video/webm" : ext === "mov" ? "video/quicktime" : "video/mp4";
	return ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";
}
function client() {
	const sb = getSupabase();
	if (!sb) throw new Error("Bağlantı yoxdur.");
	return sb;
}
async function loadFeed() {
	const sb = client();
	const { data, error } = await sb.rpc("status_feed");
	if (error) throw new Error("Statuslar yüklənmədi.");
	const rows = data ?? [];
	const paths = rows.map((r) => r.media_path).filter((p) => Boolean(p));
	const urls = /* @__PURE__ */ new Map();
	if (paths.length) {
		const { data: signed } = await sb.storage.from(BUCKET).createSignedUrls(paths, 10800);
		for (const s of signed ?? []) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
	}
	return rows.map((r) => ({
		id: r.id,
		userId: r.user_id,
		kind: r.kind,
		body: r.body,
		mediaPath: r.media_path,
		mediaUrl: r.media_path ? urls.get(r.media_path) ?? null : null,
		bg: r.bg,
		createdAt: r.created_at,
		expiresAt: r.expires_at,
		authorName: r.author_name,
		authorPhoto: r.author_photo,
		likeCount: Number(r.like_count) || 0,
		commentCount: Number(r.comment_count) || 0,
		liked: Boolean(r.liked),
		review: r.review === "pending" || r.review === "rejected" ? r.review : "approved"
	})).filter((s) => s.kind === "text" || s.mediaUrl);
}
async function createStatus(userId, input) {
	const sb = client();
	const body = input.body.trim().slice(0, 700);
	let mediaPath = null;
	if (input.kind !== "text") {
		const file = input.file;
		if (!file) throw new Error("Fayl seçin.");
		const kind = fileKind(file);
		if (kind !== input.kind) throw new Error(input.kind === "video" ? "Video faylı seçin." : "Şəkil faylı seçin.");
		if (file.size > (kind === "video" ? 52428800 : 10485760)) throw new Error(kind === "video" ? "Video 50 MB-dan kiçik olmalıdır." : "Şəkil 10 MB-dan kiçik olmalıdır.");
		const ext = (file.name.split(".").pop() || (kind === "video" ? "mp4" : "jpg")).toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
		mediaPath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
		const { error } = await sb.storage.from(BUCKET).upload(mediaPath, file, {
			contentType: contentType(file, kind),
			upsert: false
		});
		if (error) throw new Error("Fayl yüklənmədi. Yenidən cəhd edin.");
	} else if (!body) throw new Error("Status mətni yazın.");
	const { error } = await sb.from("statuses").insert({
		user_id: userId,
		kind: input.kind,
		body: body || null,
		media_path: mediaPath,
		bg: input.bg
	});
	if (error) {
		if (mediaPath) await sb.storage.from(BUCKET).remove([mediaPath]);
		throw new Error("Status paylaşılmadı.");
	}
}
async function deleteStatus(status) {
	const sb = client();
	const { error } = await sb.from("statuses").delete().eq("id", status.id);
	if (error) throw new Error("Status silinmədi.");
	if (status.mediaPath) await sb.storage.from(BUCKET).remove([status.mediaPath]);
}
/** Removes the signed-in user's own expired statuses and their files. */
async function cleanupOwnExpired(userId) {
	const sb = getSupabase();
	if (!sb) return;
	const { data } = await sb.from("statuses").select("id, media_path").eq("user_id", userId).lt("expires_at", (/* @__PURE__ */ new Date()).toISOString());
	const rows = data ?? [];
	if (!rows.length) return;
	const paths = rows.map((r) => r.media_path).filter((p) => Boolean(p));
	if (paths.length) await sb.storage.from(BUCKET).remove(paths);
	await sb.from("statuses").delete().in("id", rows.map((r) => r.id));
}
async function setLike(statusId, userId, like) {
	const sb = client();
	const { error } = like ? await sb.from("status_likes").upsert({
		status_id: statusId,
		user_id: userId
	}, {
		onConflict: "status_id,user_id",
		ignoreDuplicates: true
	}) : await sb.from("status_likes").delete().eq("status_id", statusId).eq("user_id", userId);
	if (error) throw new Error("Bəyənmə alınmadı.");
}
async function loadComments(statusId) {
	const { data, error } = await client().from("status_comments").select("id, user_id, body, created_at, profiles(name, photo_url)").eq("status_id", statusId).order("created_at", { ascending: true }).limit(200);
	if (error) throw new Error("Şərhlər yüklənmədi.");
	return (data ?? []).map((r) => {
		const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
		return {
			id: r.id,
			userId: r.user_id,
			body: r.body,
			createdAt: r.created_at,
			name: p?.name ?? "Oyunçu",
			photo: p?.photo_url ?? null
		};
	});
}
async function addComment(statusId, userId, body) {
	const text = body.trim().slice(0, 300);
	if (!text) throw new Error("Şərh yazın.");
	const { error } = await client().from("status_comments").insert({
		status_id: statusId,
		user_id: userId,
		body: text
	});
	if (error) throw new Error("Şərh göndərilmədi.");
}
async function deleteComment(id) {
	const { error } = await client().from("status_comments").delete().eq("id", id);
	if (error) throw new Error("Şərh silinmədi.");
}
function timeAgo(iso, now = Date.now()) {
	const m = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 6e4));
	if (m < 1) return "indi";
	if (m < 60) return `${m} dəq əvvəl`;
	return `${Math.floor(m / 60)} saat əvvəl`;
}
function timeLeft(iso, now = Date.now()) {
	const m = Math.max(0, Math.floor((new Date(iso).getTime() - now) / 6e4));
	return m >= 60 ? `${Math.floor(m / 60)} saat qalıb` : `${m} dəq qalıb`;
}
var SEEN_KEY = "butl.seenStatuses";
function readSeen() {
	try {
		return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function markSeen(id) {
	try {
		const s = readSeen();
		s.add(id);
		localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(s).slice(-500)));
	} catch {}
}
function StatusStrip({ me, defaultPhoto }) {
	usePreferences();
	const [feed, setFeed] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [seen, setSeen] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [composer, setComposer] = (0, import_react.useState)(false);
	const [viewerAt, setViewerAt] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			setFeed(await loadFeed());
			setError("");
		} catch (e) {
			setError(gameError(e));
			setFeed((f) => f ?? []);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		setSeen(readSeen());
		cleanupOwnExpired(me.id).catch(() => void 0).finally(() => void refresh());
		const t = window.setInterval(() => void refresh(), 6e4);
		return () => window.clearInterval(t);
	}, [me.id, refresh]);
	const ordered = (0, import_react.useMemo)(() => {
		const list = feed ?? [];
		const groups = /* @__PURE__ */ new Map();
		for (const s of list) {
			const g = groups.get(s.userId) ?? [];
			g.push(s);
			groups.set(s.userId, g);
		}
		for (const g of groups.values()) g.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
		const own = groups.get(me.id) ?? [];
		groups.delete(me.id);
		const others = Array.from(groups.values()).sort((a, b) => (b[b.length - 1]?.createdAt ?? "").localeCompare(a[a.length - 1]?.createdAt ?? ""));
		return {
			own,
			others,
			flat: [...own, ...others.flat()]
		};
	}, [feed, me.id]);
	const groups = (0, import_react.useMemo)(() => [ordered.own, ...ordered.others].filter((g) => g.length > 0), [ordered]);
	const openAt = (id) => {
		if (!id) return;
		for (let g = 0; g < groups.length; g++) {
			const i = groups[g].findIndex((s) => s.id === id);
			if (i >= 0) {
				setViewerAt({
					g,
					i
				});
				return;
			}
		}
	};
	const firstUnseen = (g) => (g.find((s) => !seen.has(s.id)) ?? g[0])?.id;
	const onSeen = (0, import_react.useCallback)((id) => {
		markSeen(id);
		setSeen((prev) => prev.has(id) ? prev : new Set(prev).add(id));
	}, []);
	const patch = (0, import_react.useCallback)((id, p) => setFeed((f) => f?.map((s) => s.id === id ? {
		...s,
		...p
	} : s) ?? f), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Statuslar",
		className: "st-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: STATUS_STYLES }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mh-status-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Statuslar" }), feed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "st-count",
					children: ordered.flat.length ? `${ordered.flat.length} aktiv` : "24 saat"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mh-status-list",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mh-story",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "st-add",
							onClick: () => setComposer(true),
							"aria-label": translate("Status əlavə et"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "st-add-ring",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: me.photo_url || defaultPhoto,
									alt: ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "st-add-plus",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 14,
										strokeWidth: 3
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mh-story-label st-add-label",
							children: translate("Status əlavə et")
						})]
					}),
					ordered.own.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBubble, {
						group: ordered.own,
						label: "Statusum",
						seen,
						onOpen: () => openAt(ordered.own[0]?.id),
						defaultPhoto
					}),
					ordered.others.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBubble, {
						group: g,
						label: g[0].authorName,
						seen,
						onOpen: () => openAt(firstUnseen(g)),
						defaultPhoto
					}, g[0].userId)),
					feed === null && [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mh-story",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "st-skeleton" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mh-story-label",
							children: "\xA0"
						})]
					}, i)),
					feed && !ordered.flat.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "st-empty",
						children: translate("Hələ status yoxdur — ilk sən paylaş ✨")
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mh-notice",
				children: error
			}),
			composer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusComposer, {
				me,
				onClose: () => setComposer(false),
				onDone: async () => {
					setComposer(false);
					await refresh();
				}
			}),
			viewerAt !== null && groups.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusViewer, {
				groups,
				startGroup: Math.min(viewerAt.g, groups.length - 1),
				startIndex: viewerAt.i,
				me,
				defaultPhoto,
				onClose: () => {
					setViewerAt(null);
					refresh();
				},
				onSeen,
				onPatch: patch,
				onDeleted: (id) => {
					setFeed((f) => f?.filter((s) => s.id !== id) ?? f);
				}
			})
		]
	});
}
function StoryBubble({ group, label, seen, onOpen, defaultPhoto }) {
	usePreferences();
	const n = group.length;
	const unseen = group.some((s) => !seen.has(s.id));
	const last = group[n - 1];
	const gap = n > 1 ? 4 : 0;
	const seg = (360 - gap * n) / n;
	const stops = group.map((s, i) => {
		const a = i * (seg + gap);
		return `${seen.has(s.id) ? "var(--st-seen)" : "var(--st-ring)"} ${a}deg ${a + seg}deg, transparent ${a + seg}deg ${a + seg + gap}deg`;
	}).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mh-story",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "st-bubble" + (unseen ? " unseen" : ""),
			style: { background: `conic-gradient(${stops})` },
			onClick: onOpen,
			"aria-label": `${label} statusunu aç`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "st-bubble-inner",
				children: [last.kind === "image" && last.mediaUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: last.mediaUrl,
					alt: "",
					loading: "lazy"
				}) : last.kind === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "st-bubble-text",
					style: { background: statusBg(last.bg) },
					children: (last.body ?? "").slice(0, 18)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: last.authorPhoto || defaultPhoto,
					alt: "",
					loading: "lazy"
				}), last.kind === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "st-bubble-play",
					"aria-hidden": "true",
					children: "▶"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mh-story-label",
			children: label
		})]
	});
}
function StatusComposer({ me, onClose, onDone }) {
	usePreferences();
	const [kind, setKind] = (0, import_react.useState)("text");
	const [text, setText] = (0, import_react.useState)("");
	const [bg, setBg] = (0, import_react.useState)("emerald");
	const [file, setFile] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const pick = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => () => {
		if (preview) URL.revokeObjectURL(preview);
	}, [preview]);
	useBodyLock();
	useEscape(onClose);
	const choose = (k) => {
		setKind(k);
		setMsg("");
		if (k !== "text") {
			setFile(null);
			setPreview(null);
			window.setTimeout(() => pick.current?.click(), 30);
		}
	};
	const onFile = (f) => {
		if (!f) return;
		const k = fileKind(f);
		if (!k || kind !== "text" && k !== kind) {
			setMsg(kind === "video" ? translate("Video faylı seçin.") : translate("Şəkil faylı seçin."));
			return;
		}
		if (f.size > (k === "video" ? 52428800 : 10485760)) {
			setMsg(k === "video" ? translate("Video 50 MB-dan kiçik olmalıdır.") : translate("Şəkil 10 MB-dan kiçik olmalıdır."));
			return;
		}
		setMsg("");
		setKind(k);
		setFile(f);
		setPreview(URL.createObjectURL(f));
	};
	const share = async () => {
		setBusy(true);
		setMsg("");
		try {
			await createStatus(me.id, {
				kind,
				body: text,
				bg,
				file
			});
			await onDone();
		} catch (e) {
			setMsg(gameError(e));
		} finally {
			setBusy(false);
		}
	};
	const canShare = !busy && (kind === "text" ? text.trim().length > 0 : Boolean(file));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "st-full st-composer",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Yeni status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "st-stage",
				style: kind === "text" ? { background: statusBg(bg) } : void 0,
				children: [
					kind === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						autoFocus: true,
						className: "st-text-input",
						placeholder: "Status yaz…",
						maxLength: 700,
						value: text,
						onChange: (e) => setText(e.target.value)
					}),
					kind !== "text" && preview && (kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						className: "st-media",
						src: preview,
						autoPlay: true,
						muted: true,
						loop: true,
						playsInline: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "st-media",
						src: preview,
						alt: translate("Önizləmə")
					})),
					kind !== "text" && !preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "st-pick",
						onClick: () => pick.current?.click(),
						children: [kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { size: 38 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { size: 38 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: kind === "video" ? translate("Video seç (max 50 MB)") : translate("Şəkil seç (max 10 MB)") })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "st-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "st-icon",
						onClick: onClose,
						"aria-label": translate("Bağla"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Yeni status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "st-top-sp" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "st-composer-bottom",
				children: [
					kind === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "st-colors",
						children: Object.keys(STATUS_BGS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": k,
							className: "st-color" + (bg === k ? " on" : ""),
							style: { background: statusBg(k) },
							onClick: () => setBg(k)
						}, k))
					}),
					kind !== "text" && file && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "st-caption",
						placeholder: translate("Açıqlama əlavə et…"),
						maxLength: 700,
						value: text,
						onChange: (e) => setText(e.target.value)
					}),
					msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "st-msg",
						role: "status",
						children: msg
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "st-composer-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "st-tabs",
							role: "tablist",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "tab",
									"aria-selected": kind === "text",
									className: kind === "text" ? "on" : "",
									onClick: () => choose("text"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { size: 16 }), translate("Yazı")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "tab",
									"aria-selected": kind === "image",
									className: kind === "image" ? "on" : "",
									onClick: () => choose("image"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { size: 16 }), translate("Şəkil")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "tab",
									"aria-selected": kind === "video",
									className: kind === "video" ? "on" : "",
									onClick: () => choose("video"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { size: 16 }), translate("Video")]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "st-send",
							disabled: !canShare,
							onClick: () => void share(),
							"aria-label": translate("Paylaş"),
							children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "st-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: pick,
				type: "file",
				hidden: true,
				accept: kind === "video" ? "video/mp4,video/webm,video/quicktime,video/*" : "image/*",
				onChange: (e) => {
					const f = e.target.files?.[0];
					e.target.value = "";
					onFile(f);
				}
			})
		]
	});
}
function StatusViewer({ groups, startGroup, startIndex, me, defaultPhoto, onClose, onSeen, onPatch, onDeleted }) {
	usePreferences();
	const scroller = (0, import_react.useRef)(null);
	const tracks = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const [active, setActive] = (0, import_react.useState)(startGroup);
	const [sub, setSub] = (0, import_react.useState)(() => ({ [groups[startGroup]?.[0]?.userId ?? ""]: startIndex }));
	const [muted, setMuted] = (0, import_react.useState)(true);
	const [commentsFor, setCommentsFor] = (0, import_react.useState)(null);
	const videos = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	useBodyLock();
	useEscape(() => {
		if (commentsFor) setCommentsFor(null);
		else onClose();
	});
	const keyOf = (g) => g?.[0]?.userId ?? "";
	const idxOf = (g) => Math.min(sub[keyOf(g)] ?? 0, Math.max(0, (g?.length ?? 1) - 1));
	(0, import_react.useLayoutEffect)(() => {
		const el = scroller.current;
		if (el) el.scrollTop = startGroup * el.clientHeight;
		const t = tracks.current.get(keyOf(groups[startGroup]));
		if (t) t.scrollLeft = startIndex * t.clientWidth;
	}, [startGroup, startIndex]);
	const onScroll = () => {
		const el = scroller.current;
		if (!el) return;
		const i = Math.round(el.scrollTop / Math.max(1, el.clientHeight));
		if (i !== active) setActive(Math.max(0, Math.min(groups.length - 1, i)));
	};
	const onTrackScroll = (key, el, n) => {
		const i = Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
		setSub((prev) => prev[key] === i ? prev : {
			...prev,
			[key]: i
		});
	};
	const curGroup = groups[active];
	const curIdx = idxOf(curGroup);
	const cur = curGroup?.[curIdx];
	(0, import_react.useEffect)(() => {
		if (cur) onSeen(cur.id);
	}, [cur, onSeen]);
	(0, import_react.useEffect)(() => {
		videos.current.forEach((v, id) => {
			if (id === cur?.id) {
				v.muted = muted;
				v.play().catch(() => {
					v.muted = true;
					setMuted(true);
					v.play().catch(() => void 0);
				});
			} else {
				v.pause();
				try {
					v.currentTime = 0;
				} catch {}
			}
		});
	}, [cur?.id, muted]);
	const goGroup = (g) => {
		const el = scroller.current;
		if (el && g >= 0 && g < groups.length) el.scrollTo({
			top: g * el.clientHeight,
			behavior: "smooth"
		});
	};
	const step = (dir) => {
		if (!curGroup) return;
		const next = curIdx + dir;
		if (next < 0) {
			goGroup(active - 1);
			return;
		}
		if (next >= curGroup.length) {
			if (active < groups.length - 1) goGroup(active + 1);
			else onClose();
			return;
		}
		const t = tracks.current.get(keyOf(curGroup));
		if (t) t.scrollTo({
			left: next * t.clientWidth,
			behavior: "smooth"
		});
		setSub((prev) => ({
			...prev,
			[keyOf(curGroup)]: next
		}));
	};
	const toggleLike = async (s, force) => {
		const like = force ?? !s.liked;
		if (like === s.liked) return;
		onPatch(s.id, {
			liked: like,
			likeCount: Math.max(0, s.likeCount + (like ? 1 : -1))
		});
		try {
			await setLike(s.id, me.id, like);
		} catch {
			onPatch(s.id, {
				liked: s.liked,
				likeCount: s.likeCount
			});
		}
	};
	const total = groups.reduce((n, g) => n + g.length, 0);
	const remove = async (s) => {
		if (!window.confirm("Bu status silinsin?")) return;
		try {
			await deleteStatus(s);
			onDeleted(s.id);
			if (total <= 1) onClose();
		} catch {
			window.alert(translate("Status silinmədi."));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "st-full st-viewer",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Statuslar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "st-scroller",
				onScroll,
				children: groups.map((g, gi) => {
					const key = keyOf(g);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "st-group",
						"aria-label": g[0]?.authorName,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "st-hscroll",
							ref: (el) => {
								if (el) tracks.current.set(key, el);
								else tracks.current.delete(key);
							},
							onScroll: (e) => onTrackScroll(key, e.currentTarget, g.length),
							children: g.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusSlide, {
								s,
								near: Math.abs(gi - active) <= 1 && Math.abs(i - idxOf(g)) <= 1,
								mine: s.userId === me.id,
								defaultPhoto,
								videoRef: (el) => {
									if (el) videos.current.set(s.id, el);
									else videos.current.delete(s.id);
								},
								muted,
								onToggleMute: () => setMuted((m) => !m),
								onPrev: () => step(-1),
								onNext: () => step(1),
								onLike: (force) => void toggleLike(s, force),
								onComments: () => setCommentsFor(s),
								onDelete: () => void remove(s)
							}, s.id))
						})
					}, key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "st-top st-top-viewer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "st-icon",
						onClick: onClose,
						"aria-label": translate("Bağla"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "st-dots",
						"aria-hidden": "true",
						children: curGroup && curGroup.length <= 30 && curGroup.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: i === curIdx ? "on" : i < curIdx ? "past" : "" }, s.id))
					}),
					curGroup && curGroup.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "st-counter",
						children: [
							curIdx + 1,
							"/",
							curGroup.length
						]
					}),
					cur?.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "st-icon",
						onClick: () => setMuted((m) => !m),
						"aria-label": muted ? translate("Səsi aç") : translate("Səsi bağla"),
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "st-top-sp" })
				]
			}),
			curGroup && curGroup.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [curIdx > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "st-nav prev",
				onClick: () => step(-1),
				"aria-label": translate("Əvvəlki status"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
			}), curIdx < curGroup.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "st-nav next",
				onClick: () => step(1),
				"aria-label": translate("Növbəti status"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
			})] }),
			commentsFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentsSheet, {
				status: commentsFor,
				me,
				defaultPhoto,
				onClose: () => setCommentsFor(null),
				onCount: (n) => onPatch(commentsFor.id, { commentCount: n })
			})
		]
	});
}
function StatusSlide({ s, near, mine, defaultPhoto, videoRef, muted, onToggleMute, onPrev, onNext, onLike, onComments, onDelete }) {
	usePreferences();
	const [bursts, setBursts] = (0, import_react.useState)([]);
	const [pop, setPop] = (0, import_react.useState)(0);
	const lastTap = (0, import_react.useRef)(0);
	const single = (0, import_react.useRef)(void 0);
	const onTap = (e) => {
		const now = Date.now();
		if (now - lastTap.current < 280) {
			window.clearTimeout(single.current);
			const r = e.currentTarget.getBoundingClientRect();
			const id = now;
			setBursts((b) => [...b, {
				id,
				x: e.clientX - r.left,
				y: e.clientY - r.top
			}]);
			window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
			setPop((p) => p + 1);
			onLike(true);
			lastTap.current = 0;
		} else {
			lastTap.current = now;
			const r = e.currentTarget.getBoundingClientRect();
			const x = (e.clientX - r.left) / Math.max(1, r.width);
			const action = x < .3 ? onPrev : x > .7 ? onNext : s.kind === "video" ? onToggleMute : null;
			if (action) single.current = window.setTimeout(action, 290);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "st-slide",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "st-slide-stage",
				style: s.kind === "text" ? { background: statusBg(s.bg) } : void 0,
				onClick: onTap,
				children: [
					s.kind === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "st-slide-text",
						children: s.body
					}),
					s.kind === "image" && s.mediaUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "st-blur",
						src: s.mediaUrl,
						alt: "",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "st-media",
						src: s.mediaUrl,
						alt: s.body || s.authorName,
						loading: near ? "eager" : "lazy"
					})] }),
					s.kind === "video" && s.mediaUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: "st-media",
						src: near ? s.mediaUrl : void 0,
						preload: near ? "auto" : "none",
						loop: true,
						playsInline: true,
						muted
					}),
					bursts.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "st-burst",
						style: {
							left: b.x,
							top: b.y
						},
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { fill: "currentColor" })
					}, b.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "st-shade",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "st-rail",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "st-rail-avatar",
						src: s.authorPhoto || defaultPhoto,
						alt: s.authorName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "st-rail-btn" + (s.liked ? " liked" : ""),
						onClick: () => onLike(),
						"aria-pressed": s.liked,
						"aria-label": translate("Bəyən"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { fill: s.liked ? "currentColor" : "none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.likeCount })]
					}, pop),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "st-rail-btn",
						onClick: onComments,
						"aria-label": translate("Şərhlər"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.commentCount })]
					}),
					mine && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "st-rail-btn",
						onClick: onDelete,
						"aria-label": "Sil",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sil" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "st-info",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: mine ? translate("Sən") : s.authorName }),
					mine && s.review !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", {
						className: "st-review-badge",
						children: [" · ", s.review === "pending" ? translate("Admin təsdiqi gözləyir") : translate("Admin tərəfindən rədd edildi")]
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
						"· ",
						timeAgo(s.createdAt),
						" · ",
						timeLeft(s.expiresAt)
					] }),
					s.kind !== "text" && s.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: s.body })
				]
			})
		]
	});
}
function CommentsSheet({ status, me, defaultPhoto, onClose, onCount }) {
	usePreferences();
	const [list, setList] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const end = (0, import_react.useRef)(null);
	const countRef = (0, import_react.useRef)(onCount);
	countRef.current = onCount;
	const load = (0, import_react.useCallback)(async () => {
		try {
			const c = await loadComments(status.id);
			setList(c);
			countRef.current(c.length);
		} catch (e) {
			setMsg(gameError(e));
			setList((l) => l ?? []);
		}
	}, [status.id]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		end.current?.scrollIntoView({ block: "end" });
	}, [list?.length]);
	const send = async () => {
		if (!text.trim() || busy) return;
		setBusy(true);
		setMsg("");
		try {
			await addComment(status.id, me.id, text);
			setText("");
			await load();
		} catch (e) {
			setMsg(gameError(e));
		} finally {
			setBusy(false);
		}
	};
	const canDelete = (c) => c.userId === me.id || status.userId === me.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "st-sheet-wrap",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "st-sheet",
			role: "dialog",
			"aria-label": translate("Şərhlər"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "st-grip",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "st-sheet-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: list ? `${list.length} şərh` : translate("Şərhlər") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "st-icon dark",
						onClick: onClose,
						"aria-label": translate("Bağla"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "st-comments",
					children: [
						list === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "st-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									className: "st-spin",
									size: 16
								}),
								" ",
								translate("Yüklənir…")
							]
						}),
						list?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "st-muted",
							children: translate("İlk şərhi sən yaz 💬")
						}),
						list?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "st-comment",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.photo || defaultPhoto,
									alt: ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: c.userId === me.id ? translate("Sən") : c.name }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: timeAgo(c.createdAt) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: c.body })
								] }),
								canDelete(c) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "st-comment-del",
									"aria-label": translate("Şərhi sil"),
									onClick: () => void deleteComment(c.id).then(load).catch(() => setMsg(translate("Şərh silinmədi."))),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
								})
							]
						}, c.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: end })
					]
				}),
				msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "st-msg dark",
					role: "status",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "st-comment-form",
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: text,
						onChange: (e) => setText(e.target.value),
						maxLength: 300,
						placeholder: translate("Şərh yaz…"),
						"aria-label": translate("Şərh yaz")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || !text.trim(),
						"aria-label": translate("Göndər"),
						children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							className: "st-spin",
							size: 18
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 18 })
					})]
				})
			]
		})
	});
}
function useBodyLock() {
	(0, import_react.useEffect)(() => {
		const o = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = o;
		};
	}, []);
}
function useEscape(fn) {
	const ref = (0, import_react.useRef)(fn);
	ref.current = fn;
	(0, import_react.useEffect)(() => {
		const h = (e) => {
			if (e.key === "Escape") ref.current();
		};
		window.addEventListener("keydown", h);
		return () => window.removeEventListener("keydown", h);
	}, []);
}
var STATUS_STYLES = `
.st-section{margin-top:24px;--st-ring:var(--primary);--st-seen:color-mix(in oklch,var(--muted-foreground) 45%,transparent)}
.st-count{font-size:10px;color:var(--muted-foreground)}
.st-empty{align-self:center;font-size:11px;color:var(--muted-foreground);margin:0 0 20px}
.st-skeleton{display:block;width:60px;height:60px;border-radius:50%;background:linear-gradient(90deg,var(--muted),var(--accent),var(--muted));background-size:200% 100%;animation:st-shimmer 1.2s linear infinite}
@keyframes st-shimmer{to{background-position:-200% 0}}
.st-add{position:relative;width:60px;height:60px;border:0;padding:4px;border-radius:50%;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .18s cubic-bezier(.3,1.6,.5,1)}
.st-add:active{transform:scale(.88)}
.st-add-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,var(--primary),oklch(.8 .15 83),oklch(.62 .21 18),var(--primary));animation:st-spin 3.2s linear infinite;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2.5px))}
.st-add img{position:relative;width:100%;height:100%;object-fit:cover;border-radius:50%;border:2px solid var(--background)}
.st-add-plus{position:absolute;right:-2px;bottom:-2px;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);border:2.5px solid var(--background);box-shadow:0 4px 10px oklch(.4 .1 165/.35);animation:st-pulse 1.8s ease-in-out infinite}
.st-add:hover .st-add-plus{transform:rotate(90deg)}
.st-add-label{color:var(--primary)!important;font-weight:700}
@keyframes st-pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 oklch(.57 .14 165/.5)}50%{transform:scale(1.12);box-shadow:0 0 0 7px oklch(.57 .14 165/0)}}
@keyframes st-spin{to{transform:rotate(360deg)}}
.st-bubble{width:60px;height:60px;border-radius:50%;border:0;padding:2.5px;cursor:pointer;transition:transform .18s cubic-bezier(.3,1.6,.5,1);-webkit-tap-highlight-color:transparent}
.st-bubble:active{transform:scale(.9)}
.st-bubble.unseen{animation:st-in .45s cubic-bezier(.3,1.5,.5,1) both}
@keyframes st-in{from{transform:scale(.6);opacity:0}}
.st-bubble-inner{position:relative;display:block;width:100%;height:100%;border-radius:50%;overflow:hidden;border:2.5px solid var(--background);background:var(--muted)}
.st-bubble-inner img{width:100%;height:100%;object-fit:cover}
.st-bubble-text{display:grid;place-items:center;width:100%;height:100%;font-size:8px;line-height:1.15;font-weight:800;color:oklch(1 0 0);padding:6px;text-align:center;overflow:hidden;word-break:break-word}
.st-bubble-play{position:absolute;inset:0;display:grid;place-items:center;color:oklch(1 0 0);font-size:13px;text-shadow:0 1px 4px oklch(0 0 0/.6)}
.st-full{position:fixed;inset:0;z-index:80;background:oklch(.08 0 0);color:oklch(1 0 0);font-family:'Manrope',system-ui,sans-serif;animation:st-up .28s cubic-bezier(.2,.9,.3,1) both}
@keyframes st-up{from{transform:translateY(6%);opacity:0}}
.st-top{position:absolute;left:0;right:0;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:max(12px,env(safe-area-inset-top)) 12px 12px;background:linear-gradient(oklch(0 0 0/.55),transparent)}
.st-top strong{font-size:15px}.st-top-sp{width:40px}
.st-icon{width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:oklch(1 0 0/.14);color:oklch(1 0 0);backdrop-filter:blur(8px);cursor:pointer}
.st-icon.dark{background:oklch(0 0 0/.06);color:inherit}
.st-dots{flex:1;display:flex;gap:3px;justify-content:center}
.st-dots span{flex:1;max-width:28px;height:3px;border-radius:3px;background:oklch(1 0 0/.3);transition:background .2s}
.st-dots span.past{background:oklch(1 0 0/.65)}.st-dots span.on{background:oklch(1 0 0)}
.st-group{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden}
.st-hscroll{display:flex;height:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none}
.st-hscroll::-webkit-scrollbar{display:none}
.st-hscroll>.st-slide{flex:0 0 100%;width:100%;scroll-snap-align:start;scroll-snap-stop:always}
.st-counter{font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:oklch(0 0 0/.35);font-variant-numeric:tabular-nums}
.st-nav{position:absolute;top:50%;z-index:4;width:38px;height:38px;margin-top:-19px;border-radius:50%;border:0;display:grid;place-items:center;background:oklch(0 0 0/.35);color:oklch(1 0 0);cursor:pointer;backdrop-filter:blur(4px)}
.st-nav.prev{left:max(8px,calc(50% - 280px))}.st-nav.next{right:max(8px,calc(50% - 280px))}
@media(hover:none){.st-nav{display:none}}
.st-scroller{height:100%;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none}
.st-scroller::-webkit-scrollbar{display:none}
.st-slide{position:relative;height:100dvh;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden}
.st-slide-stage,.st-stage{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;background:oklch(.1 0 0)}
.st-media{position:relative;width:100%;height:100%;object-fit:contain}
.st-blur{position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(28px) brightness(.55)}
.st-slide-text{margin:0;padding:0 34px;max-width:560px;text-align:center;font-size:clamp(22px,6.4vw,34px);font-weight:800;line-height:1.3;white-space:pre-wrap;word-break:break-word;text-shadow:0 2px 12px oklch(0 0 0/.18)}
.st-shade{position:absolute;inset:auto 0 0 0;height:40%;background:linear-gradient(transparent,oklch(0 0 0/.65));pointer-events:none}
.st-rail{position:absolute;right:10px;bottom:calc(110px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:18px;z-index:2}
.st-rail-avatar{width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid oklch(1 0 0)}
.st-rail-btn{display:flex;flex-direction:column;align-items:center;gap:3px;border:0;background:none;color:oklch(1 0 0);font-size:12px;font-weight:700;cursor:pointer;filter:drop-shadow(0 2px 6px oklch(0 0 0/.45));-webkit-tap-highlight-color:transparent}
.st-rail-btn svg{width:33px;height:33px;transition:transform .15s}
.st-rail-btn:active svg{transform:scale(.8)}
.st-rail-btn.liked{color:oklch(.65 .23 18)}
.st-rail-btn.liked svg{animation:st-like .45s cubic-bezier(.3,1.8,.5,1)}
@keyframes st-like{0%{transform:scale(.6)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
.st-info{position:absolute;left:14px;right:78px;bottom:calc(26px + env(safe-area-inset-bottom));z-index:2;text-shadow:0 1px 6px oklch(0 0 0/.5)}
.st-info strong{font-size:15px}.st-info small{font-size:11px;opacity:.85}
.st-info p{margin:6px 0 0;font-size:14px;line-height:1.4;max-height:5.6em;overflow:auto;white-space:pre-wrap;word-break:break-word}
.st-burst{position:absolute;z-index:3;width:96px;height:96px;margin:-48px 0 0 -48px;color:oklch(.65 .23 18);pointer-events:none;animation:st-burst .9s ease-out forwards;filter:drop-shadow(0 6px 18px oklch(0 0 0/.35))}
.st-burst svg{width:100%;height:100%}
@keyframes st-burst{0%{transform:scale(.2) rotate(-15deg);opacity:0}25%{transform:scale(1.15) rotate(0);opacity:1}60%{transform:scale(.95)}100%{transform:scale(1.4) translateY(-60px);opacity:0}}
.st-text-input{width:100%;max-width:560px;height:60%;padding:0 30px;border:0;outline:0;resize:none;background:transparent;color:oklch(1 0 0);text-align:center;font:800 clamp(22px,6.4vw,32px)/1.3 'Manrope',system-ui,sans-serif;align-self:center}
.st-text-input::placeholder{color:oklch(1 0 0/.6)}
.st-pick{display:grid;justify-items:center;gap:12px;border:2px dashed oklch(1 0 0/.35);border-radius:22px;padding:32px 28px;background:oklch(1 0 0/.06);color:oklch(1 0 0);font:700 14px 'Manrope',system-ui,sans-serif;cursor:pointer}
.st-composer-bottom{position:absolute;left:0;right:0;bottom:0;z-index:5;display:grid;gap:12px;padding:20px 14px max(16px,env(safe-area-inset-bottom));background:linear-gradient(transparent,oklch(0 0 0/.6))}
.st-colors{display:flex;gap:10px;justify-content:center}
.st-color{width:30px;height:30px;border-radius:50%;border:2px solid oklch(1 0 0/.4);cursor:pointer;transition:transform .15s}
.st-color.on{border-color:oklch(1 0 0);transform:scale(1.18)}
.st-caption{width:100%;height:44px;border-radius:22px;border:0;padding:0 16px;background:oklch(1 0 0/.16);color:oklch(1 0 0);font:500 14px 'Manrope',system-ui,sans-serif;outline:0;backdrop-filter:blur(10px)}
.st-caption::placeholder{color:oklch(1 0 0/.65)}
.st-composer-row{display:flex;align-items:center;gap:10px}
.st-tabs{flex:1;display:flex;gap:4px;padding:4px;border-radius:26px;background:oklch(1 0 0/.14);backdrop-filter:blur(10px)}
.st-tabs button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;height:38px;border:0;border-radius:20px;background:transparent;color:oklch(1 0 0/.8);font:700 12px 'Manrope',system-ui,sans-serif;cursor:pointer;transition:background .2s,color .2s}
.st-tabs button.on{background:oklch(1 0 0);color:oklch(.2 .02 165)}
.st-send{width:52px;height:52px;flex-shrink:0;border:0;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);cursor:pointer;box-shadow:0 6px 18px oklch(.4 .12 165/.5);transition:transform .15s,opacity .15s}
.st-send:active{transform:scale(.88)}.st-send:disabled{opacity:.45}
.st-msg{margin:0;text-align:center;font-size:12px;font-weight:600;color:oklch(.85 .12 30)}
.st-msg.dark{color:var(--heart);padding:0 16px 6px}
.st-spin{animation:st-spin .8s linear infinite}
.st-sheet-wrap{position:absolute;inset:0;z-index:10;background:oklch(0 0 0/.35);display:flex;align-items:flex-end;animation:st-fade .2s both}
@keyframes st-fade{from{opacity:0}}
.st-sheet{width:100%;max-width:560px;margin:0 auto;height:68%;display:flex;flex-direction:column;border-radius:20px 20px 0 0;background:var(--surface);color:var(--foreground);animation:st-sheet .3s cubic-bezier(.2,.9,.3,1) both;padding-bottom:env(safe-area-inset-bottom)}
@keyframes st-sheet{from{transform:translateY(100%)}}
.st-grip{display:block;width:38px;height:4px;border-radius:4px;background:var(--border);margin:8px auto 0}
.st-sheet-head{display:flex;align-items:center;justify-content:space-between;padding:6px 10px 6px 18px;border-bottom:1px solid var(--border)}
.st-sheet-head strong{font-size:14px}
.st-comments{flex:1;overflow-y:auto;padding:12px 16px;display:grid;align-content:start;gap:14px}
.st-muted{margin:20px 0;text-align:center;color:var(--muted-foreground);font-size:13px;display:flex;gap:6px;justify-content:center;align-items:center}
.st-comment{display:flex;gap:10px;align-items:flex-start;animation:st-in .3s both}
.st-comment img{width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0}
.st-comment div{flex:1;min-width:0;font-size:13px}
.st-comment small{color:var(--muted-foreground);font-size:11px}
.st-comment p{margin:2px 0 0;line-height:1.4;word-break:break-word;white-space:pre-wrap}
.st-comment-del{border:0;background:none;color:var(--muted-foreground);cursor:pointer;padding:4px}
.st-comment-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--border)}
.st-comment-form input{flex:1;height:42px;border-radius:21px;border:1px solid var(--border);background:var(--muted);padding:0 16px;font:500 14px 'Manrope',system-ui,sans-serif;color:var(--foreground);outline:0}
.st-comment-form button{width:42px;height:42px;border:0;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);cursor:pointer}
.st-comment-form button:disabled{opacity:.45}
@media (min-width:700px){.st-slide-stage,.st-stage{max-width:480px;margin:0 auto}.st-rail{right:calc(50% - 230px)}.st-info{left:calc(50% - 226px);right:calc(50% - 160px)}}
@media (prefers-reduced-motion:reduce){.st-add-ring,.st-add-plus{animation:none}}
`;
function summarize(rows, now = Date.now()) {
	const seen = /* @__PURE__ */ new Set();
	const players = [];
	for (const r of rows) {
		if (seen.has(r.user_id)) continue;
		const t = new Date(r.last_seen).getTime();
		if (!Number.isFinite(t) || now - t > 12e4) continue;
		const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
		if (!p) continue;
		seen.add(r.user_id);
		players.push({
			userId: r.user_id,
			name: p.name,
			photo: p.photo_url,
			male: Boolean(p.male)
		});
	}
	const boys = players.filter((p) => p.male).length;
	return {
		total: players.length,
		boys,
		girls: players.length - boys,
		players
	};
}
function useOnlinePlayers(enabled) {
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		const sb = getSupabase();
		if (!sb) return;
		let alive = true;
		let timer;
		const load = async () => {
			const { data, error } = await sb.from("room_players").select("user_id, last_seen, profiles(name, photo_url, male)").limit(500);
			if (!alive || error) return;
			setSummary(summarize(data ?? []));
		};
		const soon = () => {
			window.clearTimeout(timer);
			timer = window.setTimeout(() => void load(), 400);
		};
		load();
		const channel = sb.channel(`online-players-${Math.random().toString(36).slice(2)}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "room_players"
		}, soon).subscribe((status) => {
			if (alive) setLive(status === "SUBSCRIBED");
		});
		const poll = window.setInterval(() => void load(), 15e3);
		return () => {
			alive = false;
			window.clearTimeout(timer);
			window.clearInterval(poll);
			sb.removeChannel(channel);
		};
	}, [enabled]);
	return {
		summary,
		live
	};
}
function BoyIcon() {
	usePreferences();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		className: "op-ico",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "8",
				r: "4.2",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M7.6 6.4c.8-2.6 3-3.6 4.6-3.6 2.4 0 4.2 1.4 4.4 3.8-1.4-.9-3.4-1.2-5-.6-1.4.5-2.8.6-4 .4z",
				fill: "var(--op-hair)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4.5 21c.4-4.2 3.6-6.8 7.5-6.8s7.1 2.6 7.5 6.8z",
				fill: "currentColor"
			})
		]
	});
}
function GirlIcon() {
	usePreferences();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		className: "op-ico",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6.6 13.4C5.6 6.6 8 2.8 12 2.8s6.4 3.8 5.4 10.6c-1.4-.6-2.4-2.4-2.6-4.4-1.6.8-4 1-6 .2-.2 2-1 3.6-2.2 4.2z",
				fill: "var(--op-hair)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "8.6",
				r: "4",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4.5 21c.6-4.4 3.6-6.6 7.5-6.6s6.9 2.2 7.5 6.6z",
				fill: "currentColor"
			})
		]
	});
}
function OnlinePlayers({ open, defaultPhoto }) {
	usePreferences();
	const { summary, live } = useOnlinePlayers(open);
	const faces = summary?.players.slice(0, 5) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "op-box",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: OP_STYLES }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "op-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "op-dot" + (live ? " live" : ""),
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: summary ? summary.total : "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: summary?.total === 0 ? translate("hələ heç kim oynamır") : translate("nəfər indi oynayır") })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "op-genders",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "op-g boy",
					title: translate("Oğlan"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoyIcon, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: summary ? summary.boys : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: translate("oğlan") })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "op-g girl",
					title: translate("Qız"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GirlIcon, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: summary ? summary.girls : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: translate("qız") })
					]
				})]
			}),
			faces.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "op-faces",
				children: [faces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "op-face " + (p.male ? "boy" : "girl"),
					title: p.name,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.photo || defaultPhoto,
						alt: p.name,
						loading: "lazy"
					})
				}, p.userId)), summary && summary.total > faces.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "op-more",
					children: ["+", summary.total - faces.length]
				})]
			})
		]
	});
}
var OP_STYLES = `
.op-box{width:100%;margin-top:-6px;padding:12px 12px 10px;border-radius:14px;background:var(--play-bg);border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:9px;
  --op-boy:oklch(.6 .14 245);--op-girl:oklch(.65 .19 0);--op-hair:oklch(.32 .05 40);}
.op-head{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted-foreground);}
.op-head strong{font-size:18px;color:var(--foreground);font-variant-numeric:tabular-nums;}
.op-dot{width:8px;height:8px;border-radius:50%;background:var(--muted-foreground);}
.op-dot.live{background:var(--primary);box-shadow:0 0 0 0 color-mix(in oklch,var(--primary) 60%,transparent);animation:op-pulse 1.6s infinite;}
.op-genders{display:flex;gap:10px;}
.op-g{display:flex;align-items:center;gap:5px;padding:5px 11px 5px 6px;border-radius:30px;background:var(--surface);border:1px solid var(--border);font-size:11px;color:var(--muted-foreground);}
.op-g b{font-size:14px;color:var(--foreground);font-variant-numeric:tabular-nums;}
.op-ico{width:22px;height:22px;border-radius:50%;padding:2px;}
.op-g.boy .op-ico{color:var(--op-boy);background:color-mix(in oklch,var(--op-boy) 15%,transparent);}
.op-g.girl .op-ico{color:var(--op-girl);background:color-mix(in oklch,var(--op-girl) 15%,transparent);}
.op-faces{display:flex;align-items:center;}
.op-face{width:28px;height:28px;border-radius:50%;margin-left:-7px;border:2px solid var(--op-boy);background:var(--surface);overflow:hidden;animation:op-in .35s ease-out both;}
.op-face:first-child{margin-left:0;}.op-face.girl{border-color:var(--op-girl);}
.op-face img{width:100%;height:100%;object-fit:cover;display:block;}
.op-more{margin-left:5px;font-size:11px;font-weight:700;color:var(--muted-foreground);}
@keyframes op-pulse{70%{box-shadow:0 0 0 7px transparent;}100%{box-shadow:0 0 0 0 transparent;}}
@keyframes op-in{from{transform:scale(.4);opacity:0;}}
@media(prefers-reduced-motion:reduce){.op-dot.live,.op-face{animation:none;}}
`;
var nav_games_default = "/assets/nav-games-mvrdqGbv.webp";
function BottomNav({ active = "home", onSelect }) {
	usePreferences();
	const social = useSocial();
	const unread = Object.values(social.unread ?? {}).reduce((a, b) => a + (b || 0), 0);
	const [tapped, setTapped] = (0, import_react.useState)(null);
	const tap = (t) => {
		setTapped(t);
		window.setTimeout(() => setTapped(null), 380);
		onSelect(t);
	};
	const item = (t, label, Icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		type: "button",
		className: "bn-item" + (active === t ? " on" : "") + (tapped === t ? " tap" : ""),
		onClick: () => tap(t),
		"aria-current": active === t ? "page" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "bn-ico",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				size: 23,
				strokeWidth: active === t ? 2.3 : 1.8
			}), t === "messages" && unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
				className: "bn-badge",
				children: unread > 99 ? "99+" : unread
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "bn-label",
			children: label
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "bn",
		"aria-label": translate("Əsas menyu"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: BN_STYLES }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bn-bar",
			children: [
				item("home", translate("Əsas"), IconHome),
				item("live", translate("Canlı"), IconLive),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					type: "button",
					className: "bn-games" + (tapped === "games" ? " tap" : ""),
					onClick: () => tap("games"),
					"aria-label": translate("Oyunlar"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bn-games-ring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: nav_games_default,
							alt: "",
							width: 64,
							height: 64
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bn-label",
						children: translate("Oyunlar")
					})]
				}),
				item("messages", translate("Mesajlar"), IconChat),
				item("profile", translate("Profil"), IconUser)
			]
		})]
	});
}
var BN_STYLES = `
.bn{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;pointer-events:none;}
.bn-bar{pointer-events:auto;position:relative;width:100%;max-width:640px;height:calc(64px + env(safe-area-inset-bottom));box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr 88px 1fr 1fr;align-items:start;padding:8px 8px env(safe-area-inset-bottom);
  background:color-mix(in oklch,var(--surface) 82%,transparent);backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);border-top:1px solid var(--border);box-shadow:0 -8px 30px oklch(.25 .04 260 / .10);}
@media(min-width:641px){.bn{padding-bottom:10px;}.bn-bar{border:1px solid var(--border);border-radius:26px;height:68px;padding-bottom:0;}}
.bn-item,.bn-games{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--muted-foreground);-webkit-tap-highlight-color:transparent;user-select:none;}
.bn-item:focus-visible,.bn-games:focus-visible{outline:2px solid var(--primary);outline-offset:3px;border-radius:12px;}
.bn-ico{position:relative;display:grid;place-items:center;width:52px;height:32px;border-radius:16px;transition:background .25s,color .25s,transform .25s;}
.bn-label{font-size:10.5px;font-weight:650;letter-spacing:.1px;}
.bn-item.on{color:var(--primary);}
.bn-item.on .bn-label{font-weight:800;}
.bn-item.on .bn-ico{background:color-mix(in oklch,var(--primary) 14%,transparent);}
.bn-item.tap .bn-ico{animation:bn-bounce .38s ease;}
.bn-badge{position:absolute;top:-2px;right:6px;min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:9px;background:var(--heart);color:var(--primary-foreground);font-size:10px;font-weight:800;display:grid;place-items:center;border:2px solid var(--surface);}
.bn-games{position:relative;color:var(--foreground);}
.bn-games-ring{display:block;width:62px;height:62px;margin-top:-30px;border-radius:50%;padding:3px;background:linear-gradient(145deg,var(--gold),var(--heart));box-shadow:0 8px 22px oklch(.55 .2 20 / .35),0 0 0 5px var(--background);animation:bn-float 3.2s ease-in-out infinite;}
.bn-games-ring img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;background:var(--surface);}
.bn-games .bn-label{margin-top:2px;}
.bn-games::before{content:'';position:absolute;top:-30px;left:50%;width:62px;height:62px;margin-left:-31px;border-radius:50%;background:var(--heart);opacity:.35;animation:bn-ping 2.4s ease-out infinite;}
.bn-games.tap .bn-games-ring{animation:bn-spin .45s ease;}
@keyframes bn-bounce{40%{transform:translateY(-3px) scale(1.1);}}
@keyframes bn-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
@keyframes bn-ping{0%{transform:scale(1);opacity:.35;}80%,100%{transform:scale(1.35);opacity:0;}}
@keyframes bn-spin{50%{transform:scale(.88) rotate(-12deg);}100%{transform:scale(1) rotate(0);}}
@media(prefers-reduced-motion:reduce){.bn *,.bn ::before{animation:none!important;}}
`;
var CYR = {
	а: "a",
	б: "b",
	в: "v",
	г: "g",
	д: "d",
	е: "e",
	ё: "e",
	ж: "j",
	з: "z",
	и: "i",
	й: "y",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "h",
	ц: "s",
	ч: "c",
	ш: "s",
	щ: "s",
	ъ: "",
	ы: "i",
	ь: "",
	э: "e",
	ю: "yu",
	я: "ya",
	і: "i",
	ї: "i",
	є: "e",
	ғ: "g",
	ү: "u",
	ә: "e",
	ө: "o",
	қ: "k",
	җ: "j"
};
var LAT = {
	ə: "e",
	ı: "i",
	i̇: "i",
	ö: "o",
	ü: "u",
	ş: "s",
	ç: "c",
	ğ: "g",
	q: "g",
	x: "h",
	w: "v",
	â: "a",
	î: "i",
	û: "u",
	"0": "o",
	"1": "i",
	"3": "e",
	"4": "a",
	"5": "s",
	"7": "t",
	"8": "b",
	"@": "a",
	$: "s",
	"!": "i",
	"|": "i"
};
/** Lowercase, transliterate, de-leet, drop accents. Non-letters become spaces. */
function normalizeForFilter(input) {
	let s;
	let out = "";
	for (const ch of input.toLowerCase()) {
		const m = LAT[ch] ?? CYR[ch];
		if (m !== void 0) {
			out += m;
			continue;
		}
		const base = ch.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
		out += LAT[base] ?? CYR[base] ?? base;
	}
	s = out.replace(/sh/g, "s").replace(/ch/g, "c").replace(/zh/g, "j").replace(/kh/g, "h").replace(/ph/g, "f").replace(/q/g, "g").replace(/x/g, "h").replace(/y/g, "i").replace(/j/g, "c").replace(/k/g, "g").replace(/w/g, "v").replace(/[^a-z]+/g, " ").replace(/(.)\1+/g, "$1");
	return s.trim();
}
var norm = (w) => normalizeForFilter(w).replace(/ /g, "");
var ANYWHERE_RAW = [
	"peysər",
	"peyser",
	"peysar",
	"peyserlik",
	"gijdillax",
	"gicdillax",
	"gicdilax",
	"gıcdıllaq",
	"gicbeser",
	"gicbesər",
	"qəhbə",
	"qehbe",
	"qahba",
	"qəhbəxana",
	"üəhvə",
	"uehve",
	"qancıq",
	"qanciq",
	"amcıq",
	"amciq",
	"amcığ",
	"aminakoy",
	"sikdir",
	"siktir",
	"sikim",
	"sikerem",
	"sikərəm",
	"sikəcəm",
	"sikmək",
	"sikiş",
	"sikis",
	"sikik",
	"sikdiyim",
	"sikdim",
	"sikilmiş",
	"götveren",
	"götverən",
	"götoğlu",
	"götləmə",
	"dalbayob",
	"dolbayob",
	"dalbayok",
	"yarrak",
	"yarağ",
	"yaraq",
	"dasşaq",
	"daşşaq",
	"daşaq",
	"taşşak",
	"tasak",
	"oğraş",
	"ograş",
	"anavi",
	"ananı",
	"ananisik",
	"bacını",
	"bacivi",
	"bacıvı",
	"qoduğ",
	"qoduq",
	"itoğlu",
	"pezevenk",
	"peyserlər",
	"qehbelik",
	"fahişə",
	"fahise",
	"əxlaqsız",
	"dıllağ",
	"dıllaq",
	"xarabaya",
	"poxuyu",
	"poxyedi",
	"poxuna",
	"orospu",
	"orosbu",
	"kahpe",
	"piçkurusu",
	"yavşak",
	"yavsak",
	"dalyarak",
	"amcık",
	"sokarım",
	"sokayım",
	"götveren",
	"kaltak",
	"sürtük",
	"surtuk",
	"şerefsiz",
	"serefsiz",
	"gavat",
	"ibne",
	"puşt",
	"pezevenk",
	"taşak",
	"yarak",
	"sikerim",
	"siktiğim",
	"ananı",
	"anasını",
	"bacını",
	"gerizekalı",
	"mk",
	"хуй",
	"хуе",
	"хуя",
	"хуё",
	"нахуй",
	"похуй",
	"пизд",
	"ебат",
	"ебан",
	"ебал",
	"ёбан",
	"ебло",
	"уеб",
	"заеб",
	"бляд",
	"блят",
	"мудак",
	"мудил",
	"пидор",
	"пидар",
	"гандон",
	"залуп",
	"шлюх",
	"говн",
	"дрочи",
	"huy",
	"hui",
	"nahui",
	"pizd",
	"ebat",
	"eban",
	"blyad",
	"blyat",
	"mudak",
	"pidor",
	"pidar",
	"gandon",
	"zalup",
	"shlyuh",
	"govno",
	"dermo",
	"fuck",
	"fuk",
	"fck",
	"shit",
	"bitch",
	"biatch",
	"dick",
	"cock",
	"pussy",
	"asshole",
	"cunt",
	"whore",
	"slut",
	"bastard",
	"motherf",
	"milf",
	"hentai",
	"onlyfans",
	"erotik",
	"erotic",
	"fetish",
	"boobs",
	"tits",
	"penis",
	"vagina",
	"blowjob",
	"handjob",
	"horny",
	"masturb",
	"dildo",
	"orgasm",
	"orgy",
	"nude",
	"naked",
	"xxx",
	"porn",
	"porno",
	"pornhub",
	"seks",
	"сеск",
	"секс",
	"порн"
];
var TOKEN_RAW = [
	"sik",
	"sikə",
	"sike",
	"siki",
	"sikt",
	"amk",
	"aq",
	"oç",
	"göt",
	"gote",
	"götü",
	"pox",
	"poxu",
	"bok",
	"boku",
	"qəhi",
	"qehi",
	"qahi",
	"gic",
	"gij",
	"dıllax",
	"dillax",
	"ibine",
	"eşşək",
	"essek",
	"ass",
	"fag",
	"cum",
	"anal",
	"hoe",
	"херня",
	"сука",
	"суки",
	"suka",
	"жопа",
	"zhopa",
	"манда",
	"трах",
	"шалава",
	"шалавы",
	"педик",
	"nigga",
	"niga",
	"niger",
	"sex",
	"sexy",
	"sexi",
	"ебу",
	"еби",
	"ёб",
	"бля",
	"blya",
	"yob"
];
var ANY = Array.from(new Set(ANYWHERE_RAW.map(norm).filter((w) => w.length >= 3)));
var TOK = Array.from(new Set(TOKEN_RAW.map(norm).filter((w) => w.length >= 2)));
var SAFE = [
	"musigi",
	"sussex",
	"essex",
	"sexton",
	"hancoc",
	"scunthorpe",
	"cocpit",
	"dicens",
	"bassin",
	"class",
	"pass",
	"grass",
	"glass",
	"mass",
	"bass",
	"embassi",
	"assist",
	"amal",
	"amir",
	"aman",
	"amin",
	"malic",
	"lebanon"
].map(norm);
function checkProfanity(input) {
	const n = normalizeForFilter(input);
	if (!n) return { clean: true };
	const tokens = n.split(" ");
	const joined = tokens.join("");
	const singles = tokens.filter((t) => t.length === 1).length;
	for (const word of tokens) {
		if (SAFE.some((s) => word === s || word.startsWith(s))) continue;
		for (const stem of ANY) if (word.includes(stem)) return {
			clean: false,
			match: stem
		};
		for (const stem of TOK) if (word === stem) return {
			clean: false,
			match: stem
		};
	}
	if (singles >= 2 || tokens.length > 1) {
		if (!SAFE.some((s) => joined.includes(s))) {
			for (const stem of ANY) if (stem.length >= 4 && joined.includes(stem)) return {
				clean: false,
				match: stem
			};
		}
		if (singles >= 2) {
			const glued = tokens.reduce((acc, t) => {
				const last = acc[acc.length - 1];
				if (t.length === 1 && last !== void 0 && last.length < 6) acc[acc.length - 1] = last + t;
				else acc.push(t);
				return acc;
			}, []);
			for (const word of glued) for (const stem of [...ANY, ...TOK]) if (word === stem || ANY.includes(stem) && word.includes(stem)) return {
				clean: false,
				match: stem
			};
		}
	}
	return { clean: true };
}
ANY.filter((s) => s.length >= 4);
var PROFANITY_WARNING = {
	az: "Bu adda qadağan olunmuş söz var. Zəhmət olmasa başqa ad yaz.",
	tr: "Bu isimde yasaklı bir kelime var. Lütfen başka bir isim yaz.",
	ru: "В названии есть запрещённое слово. Пожалуйста, выберите другое.",
	en: "This name contains a banned word. Please choose another one."
};
var getVoiceIceServers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d76a24e2bd738cba04d9ae48e3c7478dcb41270e9ca69a576ba3a23ce9f9c825"));
function RemoteAudio({ id, stream, muted, onBlocked }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const audio = ref.current;
		if (!audio) return;
		let active = true;
		audio.srcObject = stream;
		audio.muted = muted;
		const play = () => {
			if (!active || muted) return;
			audio.play().then(() => {
				if (active) onBlocked(id, false);
			}).catch(() => {
				if (active) onBlocked(id, true);
			});
		};
		const visible = () => {
			if (document.visibilityState === "visible") play();
		};
		play();
		window.addEventListener("pointerdown", play, true);
		window.addEventListener("touchstart", play, true);
		window.addEventListener("voice-audio-resume", play);
		document.addEventListener("visibilitychange", visible);
		stream.addEventListener("addtrack", play);
		return () => {
			active = false;
			window.removeEventListener("pointerdown", play, true);
			window.removeEventListener("touchstart", play, true);
			window.removeEventListener("voice-audio-resume", play);
			document.removeEventListener("visibilitychange", visible);
			stream.removeEventListener("addtrack", play);
			audio.pause();
			audio.srcObject = null;
		};
	}, [
		id,
		stream,
		muted,
		onBlocked
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
		ref,
		autoPlay: true,
		muted
	});
}
var n = (az, tr, ru, en) => ({
	az,
	tr,
	ru,
	en
});
var LIVE_GIFTS = [
	{
		key: "rose",
		icon: "🌹",
		tier: "small",
		name: n("Qızılgül", "Gül", "Роза", "Rose")
	},
	{
		key: "heart",
		icon: "💖",
		tier: "small",
		name: n("Ürək", "Kalp", "Сердце", "Heart")
	},
	{
		key: "fingerheart",
		icon: "🫰",
		tier: "small",
		name: n("Barmaq ürək", "Parmak kalp", "Сердечко", "Finger Heart")
	},
	{
		key: "donut",
		icon: "🍩",
		tier: "small",
		name: n("Donut", "Donut", "Пончик", "Doughnut")
	},
	{
		key: "icecream",
		icon: "🍦",
		tier: "small",
		name: n("Dondurma", "Dondurma", "Мороженое", "Ice Cream")
	},
	{
		key: "perfume",
		icon: "🧴",
		tier: "medium",
		name: n("Ətir", "Parfüm", "Духи", "Perfume")
	},
	{
		key: "sunglasses",
		icon: "🕶️",
		tier: "medium",
		name: n("Eynək", "Gözlük", "Очки", "Sunglasses")
	},
	{
		key: "teddy",
		icon: "🧸",
		tier: "medium",
		name: n("Ayıcıq", "Ayıcık", "Мишка", "Teddy Bear")
	},
	{
		key: "fireworks",
		icon: "🎆",
		tier: "medium",
		name: n("Fişəng", "Havai fişek", "Салют", "Fireworks")
	},
	{
		key: "car",
		icon: "🏎️",
		tier: "big",
		name: n("İdman maşını", "Spor araba", "Спорткар", "Sports Car")
	},
	{
		key: "rocket",
		icon: "🚀",
		tier: "big",
		name: n("Raket", "Roket", "Ракета", "Rocket")
	},
	{
		key: "lion",
		icon: "🦁",
		tier: "big",
		name: n("Şir", "Aslan", "Лев", "Lion")
	},
	{
		key: "castle",
		icon: "🏰",
		tier: "big",
		name: n("Qala", "Şato", "Замок", "Castle")
	},
	{
		key: "universe",
		icon: "🌌",
		tier: "big",
		name: n("Kainat", "Evren", "Вселенная", "Universe")
	},
	{
		key: "video",
		icon: "🦄",
		tier: "video",
		name: n("Peqas", "Pegasus", "Пегас", "Pegasus")
	}
];
var giftByKey = (k) => LIVE_GIFTS.find((g) => g.key === k);
var isLiveGift = (k) => Boolean(giftByKey(k));
/** Combo window: same sender + gift + receiver within this many ms counts up "x2, x3…". */
var COMBO_MS = 3e3;
function iceServers() {
	const list = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];
	const turn = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_PROJECT_ID": "selfhosted",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_URL": "https://deltagame.az"
	}["VITE_TURN_URL"];
	if (turn) list.push({
		urls: turn.split(",").map((url) => url.trim()).filter(Boolean),
		username: {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/",
			"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
			"VITE_SUPABASE_PROJECT_ID": "selfhosted",
			"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
			"VITE_SUPABASE_URL": "https://deltagame.az"
		}["VITE_TURN_USERNAME"] ?? "",
		credential: {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/",
			"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
			"VITE_SUPABASE_PROJECT_ID": "selfhosted",
			"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
			"VITE_SUPABASE_URL": "https://deltagame.az"
		}["VITE_TURN_CREDENTIAL"] ?? ""
	});
	return list;
}
var uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
var VoiceRoomClient = class {
	sb;
	roomId;
	h;
	me;
	local = null;
	ch = null;
	pcs = /* @__PURE__ */ new Map();
	iceConfig = iceServers();
	retries = /* @__PURE__ */ new Map();
	signalJobs = /* @__PURE__ */ new Map();
	negotiations = /* @__PURE__ */ new Map();
	remoteStreams = /* @__PURE__ */ new Map();
	pendingIce = /* @__PURE__ */ new Map();
	members = [];
	ctx = null;
	meter = 0;
	lastSpeak = 0;
	wasSpeaking = false;
	mediaBusy = false;
	ready = false;
	seenGifts = /* @__PURE__ */ new Set();
	departed = /* @__PURE__ */ new Map();
	closed = false;
	/** Seats the owner has locked; nobody can sit there. */
	locked = /* @__PURE__ */ new Set();
	ownerId = "";
	constructor(sb, roomId, me, h) {
		this.sb = sb;
		this.roomId = roomId;
		this.h = h;
		this.me = {
			...me,
			seat: null,
			mic: false,
			cam: false,
			joinedAt: Date.now()
		};
	}
	async start(servers) {
		if (servers?.length) this.iceConfig = servers;
		this.h.onStatus("connecting");
		if (this.closed) return;
		const ch = this.sb.channel(`vroom:${this.roomId}`, { config: {
			presence: { key: this.me.id },
			broadcast: {
				self: false,
				ack: true
			}
		} });
		this.ch = ch;
		ch.on("presence", { event: "sync" }, () => this.sync());
		ch.on("broadcast", { event: "signal" }, ({ payload }) => {
			const s = payload;
			if (!s || s.to !== this.me.id || !s.from || s.from === this.me.id) return;
			const job = (this.signalJobs.get(s.from) ?? Promise.resolve()).then(() => this.onSignal(s)).catch(() => void 0);
			this.signalJobs.set(s.from, job);
			job.finally(() => {
				if (this.signalJobs.get(s.from) === job) this.signalJobs.delete(s.from);
			});
		});
		ch.on("broadcast", { event: "chat" }, ({ payload }) => this.h.onChat(payload));
		ch.on("broadcast", { event: "gift" }, ({ payload }) => this.receiveGift(payload));
		ch.on("broadcast", { event: "speak" }, ({ payload }) => {
			const p = payload;
			this.h.onSpeaking(p.id, p.level);
		});
		ch.on("broadcast", { event: "room" }, ({ payload }) => this.h.onRoom(payload.type));
		ch.on("broadcast", { event: "mod" }, ({ payload }) => {
			const m = payload;
			if (!m || this.closed) return;
			if (m.type === "invite_reply") {
				if (m.target === this.me.id) this.h.onMod?.(m);
				return;
			}
			if (m.target !== this.me.id || !this.ownerId || m.from !== this.ownerId) return;
			if (m.type === "unseat" && this.me.seat !== null) this.setSeat(null);
			this.h.onMod?.(m);
		});
		ch.on("broadcast", { event: "departure" }, ({ payload }) => {
			const p = payload;
			if (p.id && p.id !== this.me.id) {
				const member = this.members.find((m) => m.id === p.id);
				this.departed.set(p.id, p.joinedAt ?? member?.joinedAt ?? 0);
				this.sync();
			}
		});
		ch.subscribe(async (status) => {
			if (this.closed) return;
			if (status === "SUBSCRIBED") {
				const result = await ch.track(this.me);
				if (this.closed) {
					await ch.untrack();
					return;
				}
				this.ready = result === "ok";
				this.h.onStatus(this.ready ? "live" : "error");
				if (this.ready) {
					for (const [id, pc] of this.pcs) if (pc.connectionState !== "connected") this.drop(id);
					this.sync();
				}
			} else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
				this.ready = false;
				this.h.onStatus("error");
			}
		});
	}
	hasVideo() {
		return Boolean(this.local?.getVideoTracks().length);
	}
	hasAudio() {
		return Boolean(this.local?.getAudioTracks().length);
	}
	retrack() {
		if (this.closed) return;
		this.ch?.track(this.me);
		this.sync();
	}
	toggleMic() {
		const t = this.local?.getAudioTracks()[0];
		if (!t || this.me.seat === null || this.closed) return false;
		t.enabled = !t.enabled;
		this.me = {
			...this.me,
			mic: t.enabled
		};
		this.retrack();
		return true;
	}
	async toggleCam() {
		if (this.me.seat === null || this.closed || this.mediaBusy) return false;
		const existing = this.local?.getVideoTracks()[0];
		if (existing) {
			existing.enabled = !existing.enabled;
			this.me = {
				...this.me,
				cam: existing.enabled
			};
			this.retrack();
			return true;
		}
		this.mediaBusy = true;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 720 },
					height: { ideal: 720 },
					facingMode: "user"
				},
				audio: false
			});
			if (this.closed || this.me.seat === null) {
				stream.getTracks().forEach((t) => t.stop());
				return false;
			}
			const track = stream.getVideoTracks()[0];
			if (!track || !this.local) {
				stream.getTracks().forEach((t) => t.stop());
				return false;
			}
			this.local.addTrack(track);
			this.me = {
				...this.me,
				cam: true
			};
			await this.updateSenders();
			this.h.onStream(this.me.id, this.local);
			this.retrack();
			return true;
		} catch {
			return false;
		} finally {
			this.mediaBusy = false;
		}
	}
	async setSeat(seat) {
		if (this.closed || !this.ready) return false;
		if (seat === null) {
			this.me = {
				...this.me,
				seat: null,
				mic: false,
				cam: false
			};
			this.releaseMedia();
			this.retrack();
			return true;
		}
		if (!Number.isInteger(seat) || seat < 0 || seat >= 10 || this.mediaBusy || this.locked.has(seat) || this.members.some((m) => m.id !== this.me.id && m.seat === seat)) return false;
		this.mediaBusy = true;
		try {
			if (!this.hasAudio()) {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true
					},
					video: false
				});
				if (this.closed || !this.ready || this.members.some((m) => m.id !== this.me.id && m.seat === seat)) {
					stream.getTracks().forEach((t) => t.stop());
					return false;
				}
				this.local = stream;
			}
			this.local?.getAudioTracks().forEach((t) => {
				t.enabled = true;
			});
			this.me = {
				...this.me,
				seat,
				mic: true
			};
			await this.updateSenders();
			if (this.closed) return false;
			this.h.onStream(this.me.id, this.local);
			this.startMeter();
			this.retrack();
			return this.me.seat === seat;
		} catch {
			return false;
		} finally {
			this.mediaBusy = false;
		}
	}
	async updateSenders() {
		const local = this.local;
		await Promise.all([...this.pcs.values()].flatMap((pc) => pc.getTransceivers().map((tr) => {
			const track = local?.getTracks().find((t) => t.kind === tr.receiver.track.kind) ?? null;
			return tr.sender.replaceTrack(track).catch(() => {
				const entry = [...this.pcs].find(([, current]) => current === pc);
				if (entry) {
					this.drop(entry[0]);
					this.sync();
				}
			});
		})));
	}
	releaseMedia() {
		window.clearInterval(this.meter);
		this.ctx?.close().catch(() => void 0);
		this.ctx = null;
		this.local?.getTracks().forEach((t) => t.stop());
		this.local = null;
		this.updateSenders();
		this.h.onStream(this.me.id, null);
		this.h.onSpeaking(this.me.id, 0);
		this.send("speak", {
			id: this.me.id,
			level: 0
		});
	}
	sendChat(text) {
		const msg = {
			id: uid(),
			from: this.me.id,
			name: this.me.name,
			photo: this.me.photo,
			text,
			at: Date.now(),
			kind: "chat"
		};
		this.h.onChat(msg);
		this.send("chat", msg);
	}
	async sendGift(to, gift, combo) {
		if (!this.ready || this.closed || !this.ch || !isLiveGift(gift)) return false;
		const g = {
			id: uid(),
			from: this.me.id,
			name: this.me.name,
			photo: this.me.photo,
			to: to?.id ?? null,
			toName: to?.name,
			gift,
			at: Date.now() + (gift === "video" ? 700 : 0),
			count: combo?.count ?? 1,
			comboId: combo?.id
		};
		if (await this.ch.send({
			type: "broadcast",
			event: "gift",
			payload: g
		}) !== "ok" || this.closed) return false;
		this.receiveGift(g);
		const msg = {
			id: g.id,
			from: this.me.id,
			name: this.me.name,
			photo: this.me.photo,
			text: "",
			at: g.at ?? Date.now(),
			kind: "gift",
			gift,
			to: g.to,
			toName: to?.name ?? "",
			count: g.count,
			comboId: g.comboId
		};
		this.h.onChat(msg);
		this.send("chat", msg);
		return true;
	}
	receiveGift(g) {
		if (this.closed || !isLiveGift(g.gift) || !g.id || this.seenGifts.has(g.id)) return;
		this.seenGifts.add(g.id);
		if (this.seenGifts.size > 200) {
			const first = this.seenGifts.values().next().value;
			if (first) this.seenGifts.delete(first);
		}
		this.h.onGift(g);
	}
	sendMod(m) {
		this.send("mod", m);
	}
	notifyRoom(type) {
		this.send("room", { type });
	}
	send(event, payload) {
		this.ch?.send({
			type: "broadcast",
			event,
			payload
		});
	}
	sync() {
		if (!this.ch || this.closed) return;
		const state = this.ch.presenceState();
		let list = Object.values(state).map((arr) => arr[arr.length - 1]).filter((m) => {
			if (!m) return false;
			const left = this.departed.get(m.id);
			if (left === void 0) return true;
			if (m.joinedAt > left) {
				this.departed.delete(m.id);
				return true;
			}
			return false;
		});
		if (!list.some((m) => m.id === this.me.id)) list.push(this.me);
		list = list.map((m) => m.id === this.me.id ? this.me : m);
		const mine = this.me.seat;
		if (mine !== null && list.some((m) => m.id !== this.me.id && m.seat === mine && (m.joinedAt < this.me.joinedAt || m.joinedAt === this.me.joinedAt && m.id < this.me.id))) {
			this.me = {
				...this.me,
				seat: null,
				mic: false,
				cam: false
			};
			this.releaseMedia();
			this.ch.track(this.me);
		}
		list = list.map((m) => m.id === this.me.id ? this.me : m).sort((a, b) => a.joinedAt - b.joinedAt);
		this.members = list;
		const ids = new Set(list.map((m) => m.id));
		for (const m of list) if (m.id !== this.me.id && !this.pcs.has(m.id) && this.me.id < m.id) this.call(m.id);
		for (const id of [...this.pcs.keys()]) if (!ids.has(id)) this.drop(id);
		this.h.onMembers(list);
	}
	makePc(id, negotiation) {
		this.drop(id);
		const pc = new RTCPeerConnection({ iceServers: this.iceConfig });
		this.negotiations.set(id, negotiation);
		this.pcs.set(id, pc);
		for (const kind of ["audio", "video"]) {
			const track = this.local?.getTracks().find((t) => t.kind === kind);
			pc.addTransceiver(track ?? kind, {
				direction: "sendrecv",
				...track && this.local ? { streams: [this.local] } : {}
			});
		}
		pc.onicecandidate = (e) => {
			if (e.candidate) this.send("signal", {
				to: id,
				from: this.me.id,
				type: "ice",
				negotiation,
				ice: e.candidate.toJSON()
			});
		};
		pc.ontrack = (e) => {
			const stream = this.remoteStreams.get(id) ?? e.streams[0] ?? new MediaStream();
			if (!stream.getTracks().some((t) => t.id === e.track.id)) stream.addTrack(e.track);
			this.remoteStreams.set(id, stream);
			this.h.onStream(id, stream);
		};
		pc.onconnectionstatechange = () => {
			if (pc.connectionState === "connected") {
				const timer = this.retries.get(id);
				if (timer) window.clearTimeout(timer);
				this.retries.delete(id);
			} else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") this.scheduleRetry(id, pc, 2e3);
		};
		return pc;
	}
	scheduleRetry(id, pc, delay = 1e4) {
		if (this.closed || this.retries.has(id) || this.me.id > id) return;
		const timer = window.setTimeout(() => {
			this.retries.delete(id);
			if (this.closed || this.pcs.get(id) !== pc || pc.connectionState === "connected") return;
			this.drop(id);
			if (this.ready && this.members.some((m) => m.id === id)) this.call(id);
		}, delay);
		this.retries.set(id, timer);
	}
	async call(id) {
		if (this.closed || !this.ready || this.pcs.has(id)) return;
		const negotiation = uid();
		const pc = this.makePc(id, negotiation);
		this.scheduleRetry(id, pc);
		try {
			const offer = await pc.createOffer();
			if (this.closed || this.pcs.get(id) !== pc) return;
			await pc.setLocalDescription(offer);
			if (this.closed || this.pcs.get(id) !== pc || !pc.localDescription) return;
			if (await this.ch?.send({
				type: "broadcast",
				event: "signal",
				payload: {
					to: id,
					from: this.me.id,
					type: "offer",
					negotiation,
					sdp: pc.localDescription.toJSON()
				}
			}) !== "ok") {
				const timer = this.retries.get(id);
				if (timer) window.clearTimeout(timer);
				this.retries.delete(id);
				this.scheduleRetry(id, pc, 1500);
			}
		} catch {
			this.scheduleRetry(id, pc, 1500);
		}
	}
	async flushIce(id, pc) {
		const key = `${id}:${this.negotiations.get(id) ?? "legacy"}`;
		const q = this.pendingIce.get(key) ?? [];
		this.pendingIce.delete(key);
		for (const c of q) await pc.addIceCandidate(c).catch(() => void 0);
	}
	async onSignal(s) {
		if (s.to !== this.me.id || this.closed) return;
		try {
			if (s.type === "offer" && s.sdp) {
				if (s.from > this.me.id) return;
				const negotiation = s.negotiation ?? "legacy";
				const queued = this.pendingIce.get(`${s.from}:${negotiation}`);
				const pc = this.makePc(s.from, negotiation);
				if (queued) this.pendingIce.set(`${s.from}:${negotiation}`, queued);
				await pc.setRemoteDescription(s.sdp);
				if (this.closed || this.pcs.get(s.from) !== pc) return;
				await this.flushIce(s.from, pc);
				const answer = await pc.createAnswer();
				if (this.closed || this.pcs.get(s.from) !== pc) return;
				await pc.setLocalDescription(answer);
				if (this.closed || this.pcs.get(s.from) !== pc || !pc.localDescription) return;
				this.send("signal", {
					to: s.from,
					from: this.me.id,
					type: "answer",
					negotiation,
					sdp: pc.localDescription.toJSON()
				});
			} else if (s.type === "answer" && s.sdp) {
				const pc = this.pcs.get(s.from);
				if (!pc || pc.signalingState !== "have-local-offer" || s.negotiation && s.negotiation !== this.negotiations.get(s.from)) return;
				await pc.setRemoteDescription(s.sdp);
				await this.flushIce(s.from, pc);
			} else if (s.type === "ice" && s.ice) {
				const pc = this.pcs.get(s.from);
				if (pc && s.negotiation && s.negotiation !== this.negotiations.get(s.from)) return;
				if (pc?.remoteDescription) await pc.addIceCandidate(s.ice).catch(() => void 0);
				else {
					const key = `${s.from}:${s.negotiation ?? "legacy"}`;
					this.pendingIce.set(key, [...this.pendingIce.get(key) ?? [], s.ice].slice(-64));
				}
			}
		} catch (e) {
			console.warn("voice signal", e);
		}
	}
	drop(id) {
		const timer = this.retries.get(id);
		if (timer) window.clearTimeout(timer);
		this.retries.delete(id);
		this.negotiations.delete(id);
		for (const key of this.pendingIce.keys()) if (key.startsWith(`${id}:`)) this.pendingIce.delete(key);
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
	startMeter() {
		window.clearInterval(this.meter);
		this.ctx?.close().catch(() => void 0);
		const t = this.local?.getAudioTracks()[0];
		if (!t) return;
		try {
			const Ctx = window.AudioContext ?? window.webkitAudioContext;
			this.ctx = new Ctx();
			const an = this.ctx.createAnalyser();
			an.fftSize = 512;
			this.ctx.createMediaStreamSource(new MediaStream([t])).connect(an);
			const buf = new Float32Array(an.fftSize);
			this.meter = window.setInterval(() => {
				if (this.ctx?.state === "suspended") this.ctx.resume();
				an.getFloatTimeDomainData(buf);
				let sum = 0;
				for (const v of buf) sum += v * v;
				const level = this.me.mic ? Math.min(1, Math.sqrt(sum / buf.length) * 6) : 0;
				const speaking = level > .12;
				this.h.onSpeaking(this.me.id, speaking ? level : 0);
				const now = Date.now();
				if (speaking !== this.wasSpeaking || speaking && now - this.lastSpeak > 350) {
					this.wasSpeaking = speaking;
					this.lastSpeak = now;
					this.send("speak", {
						id: this.me.id,
						level: speaking ? Math.round(level * 100) / 100 : 0
					});
				}
			}, 120);
		} catch {}
	}
	async leave() {
		if (this.closed) return;
		this.closed = true;
		this.ready = false;
		window.clearInterval(this.meter);
		this.ctx?.close().catch(() => void 0);
		for (const id of [...this.pcs.keys()]) this.drop(id);
		this.local?.getTracks().forEach((t) => t.stop());
		if (this.ch) {
			await this.ch.send({
				type: "broadcast",
				event: "departure",
				payload: {
					id: this.me.id,
					joinedAt: this.me.joinedAt
				}
			}).catch(() => void 0);
			await this.ch.untrack().catch(() => void 0);
			await this.sb.removeChannel(this.ch);
			this.ch = null;
		}
	}
};
var T$1 = {
	gifts: {
		az: "Hədiyyələr",
		tr: "Hediyeler",
		ru: "Подарки",
		en: "Gifts"
	},
	all: {
		az: "Hamıya",
		tr: "Herkese",
		ru: "Всем",
		en: "Everyone"
	},
	send: {
		az: "Göndər",
		tr: "Gönder",
		ru: "Отправить",
		en: "Send"
	},
	sent: {
		az: "göndərdi",
		tr: "gönderdi",
		ru: "отправил(а)",
		en: "sent"
	},
	free: {
		az: "Pulsuz",
		tr: "Ücretsiz",
		ru: "Бесплатно",
		en: "Free"
	}
};
var useGiftT = () => {
	const { language } = usePreferences();
	return {
		language,
		t: (k) => T$1[k]?.[language] ?? T$1[k]?.az ?? ""
	};
};
function GiftSheet({ members, meId, defaultPhoto, initialTo, disabled, onSend, onClose }) {
	const { t, language } = useGiftT();
	const [to, setTo] = (0, import_react.useState)(initialTo);
	const [sel, setSel] = (0, import_react.useState)("rose");
	const [combo, setCombo] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const timer = (0, import_react.useRef)(0);
	const others = members.filter((m) => m.id !== meId);
	(0, import_react.useEffect)(() => () => window.clearTimeout(timer.current), []);
	const fire = async () => {
		const g = giftByKey(sel);
		if (!g || busy || disabled) return;
		const next = combo && combo.key === g.key && combo.to === to ? {
			...combo,
			count: combo.count + 1
		} : {
			id: uid(),
			key: g.key,
			to,
			count: 1
		};
		setBusy(true);
		const ok = await onSend(members.find((m) => m.id === to) ?? null, g, {
			id: next.id,
			count: next.count
		});
		setBusy(false);
		if (!ok) return;
		if (g.tier === "big" || g.tier === "video") {
			onClose();
			return;
		}
		setCombo(next);
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setCombo(null), COMBO_MS);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "gx-wrap",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "gx-sheet",
			role: "dialog",
			"aria-label": t("gifts"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gx-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { size: 16 }),
						" ",
						t("gifts")
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "gx-x",
						onClick: onClose,
						"aria-label": "Bağla",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 17 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gx-to",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: to === null ? "on" : "",
						onClick: () => setTo(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gx-all",
							children: "🎉"
						}), t("all")]
					}), others.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: to === m.id ? "on" : "",
						onClick: () => setTo(m.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: m.photo || defaultPhoto,
								alt: ""
							}),
							m.name,
							m.seat !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: m.seat + 1 })
						]
					}, m.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "gx-grid",
					children: LIVE_GIFTS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `gx-item${sel === g.key ? " on" : ""} t-${g.tier}`,
						onClick: () => {
							setSel(g.key);
							if (sel === g.key) fire();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gx-ico",
								children: g.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gx-name",
								children: g.name[language]
							}),
							sel === g.key ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gx-send",
								children: t("send")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gx-price",
								children: t("free")
							})
						]
					}, g.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gx-foot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						giftByKey(sel)?.icon,
						" ",
						giftByKey(sel)?.name[language]
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `gx-fire${combo ? " combo" : ""}`,
						disabled: busy || disabled,
						onClick: () => void fire(),
						children: combo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["x", combo.count + 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 40 40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "20",
								cy: "20",
								r: "18"
							}, combo.count)
						})] }) : t("send")
					})]
				})
			]
		})
	});
}
/** Left-side TikTok combo banners (max 2 visible). */
function GiftBanners({ banners, defaultPhoto, meId }) {
	const { t, language } = useGiftT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "gx-banners",
		"aria-live": "polite",
		children: banners.slice(-2).map((b) => {
			const g = giftByKey(b.gift);
			if (!g) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gx-banner",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: b.photo || defaultPhoto,
						alt: ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: b.from === meId ? translate("Sən") : b.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
						t("sent"),
						" ",
						g.name[language],
						b.toName ? ` → ${b.toName}` : ""
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gx-bico",
						children: g.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "gx-count",
						children: ["x", b.count ?? 1]
					}, b.count)
				]
			}, b.key);
		})
	});
}
/** Centre pop (medium) or full-screen scene (big). */
function GiftScene({ gift, onDone }) {
	const { t, language } = useGiftT();
	const g = giftByKey(gift.gift);
	(0, import_react.useEffect)(() => {
		const tm = window.setTimeout(onDone, g?.tier === "big" ? 3600 : 2200);
		return () => window.clearTimeout(tm);
	}, [
		gift.id,
		g?.tier,
		onDone
	]);
	if (!g) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `gx-scene s-${g.tier} k-${g.key}`,
		"aria-hidden": "true",
		children: [
			g.tier === "big" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gx-bg" }),
			g.tier === "big" && Array.from({ length: 14 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: "gx-spark",
				style: { ["--i"]: i }
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "gx-hero",
				children: g.icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gx-cap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: gift.name }),
					" ",
					t("sent"),
					" ",
					g.name[language],
					gift.toName ? ` → ${gift.toName}` : ""
				]
			})
		]
	});
}
var GIFT_FX_STYLES = `
.gx-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:oklch(0 0 0 / .35);}
.gx-sheet{width:min(100%,520px);max-height:62dvh;display:flex;flex-direction:column;background:oklch(.16 .01 280 / .97);border-radius:18px 18px 0 0;padding:10px 10px max(10px,env(safe-area-inset-bottom));animation:vr-up .22s ease-out;color:oklch(.97 0 0);}
.gx-head{display:flex;justify-content:space-between;align-items:center;padding:0 4px 6px;}
.gx-head strong{display:flex;align-items:center;gap:6px;font-size:14px;}
.gx-x{all:unset;cursor:pointer;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:oklch(1 0 0 / .08);}
.gx-to{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 8px;}
.gx-to button{all:unset;cursor:pointer;flex-shrink:0;display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;padding:3px 9px 3px 3px;border-radius:16px;background:oklch(1 0 0 / .07);border:1px solid oklch(1 0 0 / .08);}
.gx-to button.on{border-color:oklch(.68 .22 15);background:oklch(.68 .22 15 / .2);}
.gx-to img,.gx-all{width:22px;height:22px;border-radius:50%;object-fit:cover;display:grid;place-items:center;font-size:12px;}
.gx-to i{font-style:normal;font-size:9.5px;padding:0 4px;border-radius:6px;background:oklch(1 0 0 / .15);}
.gx-grid{flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;scrollbar-width:none;}
.gx-item{all:unset;cursor:pointer;position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px 0;border-radius:12px;border:1.5px solid transparent;overflow:hidden;transition:transform .15s;}
.gx-item.on{border-color:oklch(.68 .22 15);background:oklch(1 0 0 / .06);}
.gx-item:active{transform:scale(.93);}
.gx-ico{font-size:34px;line-height:1.15;filter:drop-shadow(0 3px 6px oklch(0 0 0 / .4));}
.gx-item.on .gx-ico{animation:gx-bob .9s ease-in-out infinite;}
.gx-name{font-size:11px;font-weight:700;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gx-price{font-size:10px;color:oklch(.85 .14 85);padding-bottom:6px;}
.gx-send{width:100%;text-align:center;font-size:11px;font-weight:850;padding:5px 0;background:oklch(.64 .23 15);margin-top:2px;}
.t-big .gx-name::after,.t-video .gx-name::after{content:" ✦";color:oklch(.85 .14 85);}
.gx-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 4px 0;font-size:12.5px;font-weight:700;}
.gx-fire{all:unset;cursor:pointer;position:relative;min-width:84px;height:36px;border-radius:18px;text-align:center;line-height:36px;font-weight:850;font-size:13px;background:linear-gradient(90deg,oklch(.66 .24 10),oklch(.62 .24 350));box-shadow:0 6px 16px oklch(.6 .23 10 / .45);}
.gx-fire.combo{min-width:0;width:54px;height:54px;line-height:54px;border-radius:50%;font-size:15px;animation:gx-pulse .6s ease-in-out infinite alternate;}
.gx-fire svg{position:absolute;inset:-4px;width:62px;height:62px;transform:rotate(-90deg);}
.gx-fire circle{fill:none;stroke:oklch(.97 0 0);stroke-width:3;stroke-dasharray:113;stroke-dashoffset:0;animation:gx-ring ${COMBO_MS}ms linear forwards;}
.gx-fire:disabled{opacity:.6;}
.gx-banners{position:fixed;z-index:70;left:8px;top:38%;display:flex;flex-direction:column;gap:6px;pointer-events:none;}
.gx-banner{position:relative;display:flex;align-items:center;gap:6px;height:38px;padding:0 44px 0 3px;border-radius:19px;background:linear-gradient(90deg,oklch(.25 .05 300 / .9),oklch(.25 .05 300 / .2));animation:gx-slide .35s cubic-bezier(.2,.9,.3,1.2);}
.gx-banner img{width:32px;height:32px;border-radius:50%;object-fit:cover;}
.gx-banner div{display:flex;flex-direction:column;line-height:1.1;max-width:120px;}
.gx-banner b{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gx-banner small{font-size:10.5px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gx-bico{position:absolute;right:2px;font-size:30px;animation:gx-pop .4s cubic-bezier(.2,1.6,.4,1);}
.gx-count{position:absolute;left:calc(100% + 4px);font-size:22px;font-weight:900;font-style:italic;color:oklch(.92 .15 90);text-shadow:0 2px 0 oklch(.5 .15 50),0 0 10px oklch(.8 .15 80 / .6);animation:gx-pop .3s cubic-bezier(.2,1.8,.4,1);}
.gx-scene{position:fixed;inset:0;z-index:88;pointer-events:none;display:grid;place-items:center;overflow:hidden;}
.gx-hero{font-size:110px;filter:drop-shadow(0 10px 30px oklch(0 0 0 / .5));animation:gx-zoom 2.2s cubic-bezier(.2,1.4,.4,1) forwards;}
.gx-cap{position:absolute;top:24%;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:16px;font-size:13px;background:oklch(0 0 0 / .5);white-space:nowrap;animation:gx-fade 2.2s ease forwards;}
.gx-cap b{color:oklch(.85 .14 85);}
.s-big .gx-hero{font-size:150px;animation-duration:3.6s;}
.s-big .gx-cap{animation-duration:3.6s;}
.gx-bg{position:absolute;inset:0;animation:gx-fade 3.6s ease forwards;background:radial-gradient(circle at 50% 50%,oklch(.7 .2 330 / .45),oklch(.2 .08 290 / .5) 60%,transparent);}
.k-universe .gx-bg{background:conic-gradient(from 0deg,oklch(.35 .15 280 / .7),oklch(.45 .2 320 / .7),oklch(.3 .12 240 / .7),oklch(.35 .15 280 / .7));animation:gx-fade 3.6s ease forwards,gx-spin 6s linear infinite;}
.k-castle .gx-bg{background:linear-gradient(transparent 30%,oklch(.6 .15 60 / .5));}
.gx-spark{position:absolute;left:50%;top:50%;width:8px;height:8px;border-radius:50%;background:oklch(.92 .15 90);box-shadow:0 0 12px oklch(.92 .15 90);animation:gx-spark 1.6s ease-out calc(var(--i) * .12s) infinite;transform:rotate(calc(var(--i) * 25.7deg)) translateY(0);}
.k-car .gx-hero{animation:gx-drive 3.6s cubic-bezier(.3,.7,.4,1) forwards;}
.k-rocket .gx-hero{animation:gx-launch 3.6s cubic-bezier(.5,0,.6,1) forwards;}
.k-lion .gx-hero{animation:gx-roar 3.6s ease forwards;}
.k-castle .gx-hero{animation:gx-rise 3.6s cubic-bezier(.2,1,.4,1) forwards;}
.k-fireworks .gx-hero{animation:gx-burst 2.2s ease-out forwards;}
@keyframes gx-bob{50%{transform:translateY(-4px) scale(1.06)}}
@keyframes gx-pulse{to{transform:scale(1.08)}}
@keyframes gx-ring{to{stroke-dashoffset:113}}
@keyframes gx-slide{from{transform:translateX(-110%);opacity:0}}
@keyframes gx-pop{0%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes gx-zoom{0%{transform:scale(.2);opacity:0}20%{transform:scale(1.15);opacity:1}35%{transform:scale(1)}80%{transform:scale(1);opacity:1}100%{transform:scale(.6) translateY(-80px);opacity:0}}
@keyframes gx-fade{0%{opacity:0}12%{opacity:1}82%{opacity:1}100%{opacity:0}}
@keyframes gx-spin{to{transform:rotate(360deg) scale(1.6)}}
@keyframes gx-spark{0%{opacity:1;transform:rotate(calc(var(--i) * 25.7deg)) translateY(0) scale(1)}100%{opacity:0;transform:rotate(calc(var(--i) * 25.7deg)) translateY(-42vmin) scale(.3)}}
@keyframes gx-drive{0%{transform:translateX(-120vw) scaleX(-1)}35%{transform:translateX(0) scaleX(-1)}45%{transform:translateX(0) scaleX(-1) rotate(-4deg)}70%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(120vw) scaleX(-1)}}
@keyframes gx-launch{0%{transform:translateY(60vh) rotate(-45deg)}30%{transform:translateY(0) rotate(-45deg)}60%{transform:translateY(-4vh) rotate(-45deg)}100%{transform:translateY(-120vh) rotate(-45deg)}}
@keyframes gx-roar{0%{transform:scale(.3);opacity:0}20%{transform:scale(1.25);opacity:1}30%,50%{transform:scale(1)}40%{transform:scale(1.12) rotate(-3deg)}85%{opacity:1}100%{transform:scale(1.5);opacity:0}}
@keyframes gx-rise{0%{transform:translateY(70vh)}35%{transform:translateY(0)}85%{opacity:1}100%{transform:translateY(0) scale(1.1);opacity:0}}
@keyframes gx-burst{0%{transform:scale(.2);opacity:0}30%{transform:scale(1.4);opacity:1}100%{transform:scale(2.4);opacity:0}}
@media(prefers-reduced-motion:reduce){.gx-scene *,.gx-banner,.gx-banner *{animation-duration:.01s!important}}
`;
var pegasus_jpg_asset_default = {
	version: 1,
	asset_id: "d68882b2-e032-41f2-8560-7ce9fd526261",
	project_id: "88e024e4-bf42-4edc-bea3-5e35357c10f2",
	url: "/__l5e/assets-v1/d68882b2-e032-41f2-8560-7ce9fd526261/pegasus.jpg",
	r2_key: "a/v1/88e024e4-bf42-4edc-bea3-5e35357c10f2/d68882b2-e032-41f2-8560-7ce9fd526261/pegasus.jpg",
	original_filename: "pegasus.jpg",
	size: 13999,
	content_type: "image/jpeg",
	created_at: "2026-10-16T20:55:52Z"
};
var pegasus_mp4_asset_default = {
	version: 1,
	asset_id: "a91e51b9-ade7-4a84-8767-53741cf3ee39",
	project_id: "88e024e4-bf42-4edc-bea3-5e35357c10f2",
	url: "/__l5e/assets-v1/a91e51b9-ade7-4a84-8767-53741cf3ee39/pegasus.mp4",
	r2_key: "a/v1/88e024e4-bf42-4edc-bea3-5e35357c10f2/a91e51b9-ade7-4a84-8767-53741cf3ee39/pegasus.mp4",
	original_filename: "pegasus.mp4",
	size: 8603500,
	content_type: "video/mp4",
	created_at: "2026-10-16T20:56:20Z"
};
var pegasus_webm_asset_default = {
	version: 1,
	asset_id: "a8d933dc-7404-4922-9d0a-baa486316005",
	project_id: "88e024e4-bf42-4edc-bea3-5e35357c10f2",
	url: "/__l5e/assets-v1/a8d933dc-7404-4922-9d0a-baa486316005/pegasus.webm",
	r2_key: "a/v1/88e024e4-bf42-4edc-bea3-5e35357c10f2/a8d933dc-7404-4922-9d0a-baa486316005/pegasus.webm",
	original_filename: "pegasus.webm",
	size: 4906010,
	content_type: "video/webm",
	created_at: "2026-10-16T21:00:43Z"
};
var EMOJIS = [
	"😀",
	"😂",
	"😍",
	"🥰",
	"😎",
	"🤩",
	"😘",
	"🙏",
	"👏",
	"🔥",
	"❤️",
	"🌹",
	"🎉",
	"💯",
	"😢",
	"😡"
];
var ASSET_ORIGIN = "https://id-preview--88e024e4-bf42-4edc-bea3-5e35357c10f2.lovable.app";
var VIDEO_GIFT_URL = new URL(pegasus_mp4_asset_default.url, ASSET_ORIGIN).href;
var VIDEO_GIFT_FALLBACK = new URL(pegasus_webm_asset_default.url, ASSET_ORIGIN).href;
var VIDEO_GIFT_ARTWORK = new URL(pegasus_jpg_asset_default.url, ASSET_ORIGIN).href;
var giftEmoji = (k) => giftByKey(k)?.icon ?? "🎁";
var KICK_MINUTES = [
	5,
	30,
	60,
	1440
];
function GiftPlayback({ gift, muted, onDone }) {
	usePreferences();
	const ref = (0, import_react.useRef)(null);
	const [soundBlocked, setSoundBlocked] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const video = ref.current;
		if (!video) return;
		let disposed = false;
		const start = async () => {
			if (disposed) return;
			video.currentTime = Math.max(0, (Date.now() - (gift.at ?? Date.now())) / 1e3);
			try {
				await video.play();
			} catch {
				if (disposed) return;
				video.muted = true;
				setSoundBlocked(true);
				video.play().catch(() => void 0);
			}
		};
		const timer = window.setTimeout(() => void start(), Math.max(0, (gift.at ?? Date.now()) - Date.now()));
		return () => {
			disposed = true;
			window.clearTimeout(timer);
			video.pause();
		};
	}, [gift.id, gift.at]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vr-vgift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
				ref,
				preload: "auto",
				playsInline: true,
				muted: muted || soundBlocked,
				onEnded: onDone,
				onError: (event) => {
					if (event.target === event.currentTarget) onDone();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
					src: VIDEO_GIFT_URL,
					type: "video/mp4; codecs=\"avc1.640028, mp4a.40.2\""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
					src: VIDEO_GIFT_FALLBACK,
					type: "video/webm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vr-vgift-tag",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: VIDEO_GIFT_ARTWORK,
						alt: ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: gift.name ?? translate("Oyunçu") }),
					" ",
					translate("hədiyyə göndərdi")
				]
			}),
			soundBlocked && !muted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "vr-sound-recover",
				"aria-label": translate("Hədiyyənin səsini aç"),
				onClick: () => {
					const video = ref.current;
					if (!video) return;
					video.muted = false;
					video.play().then(() => setSoundBlocked(false)).catch(() => setSoundBlocked(true));
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { size: 20 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "vr-icon vr-vgift-x",
				"aria-label": translate("Hədiyyəni bağla"),
				onClick: onDone,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
			})
		]
	});
}
function VoiceRoom({ room: initial, me, ownerName = "", defaultPhoto, onLeave, onPresence }) {
	usePreferences();
	const [room, setRoom] = (0, import_react.useState)(initial);
	const [members, setMembers] = (0, import_react.useState)([]);
	const [streams, setStreams] = (0, import_react.useState)({});
	const [levels, setLevels] = (0, import_react.useState)({});
	const [chat, setChat] = (0, import_react.useState)([{
		id: "sys",
		from: "",
		name: "",
		photo: null,
		text: translate("Otağa xoş gəldin! Hörmətli ünsiyyət qaydalarına əməl et."),
		at: Date.now(),
		kind: "system"
	}]);
	const [status, setStatus] = (0, import_react.useState)("connecting");
	const [text, setText] = (0, import_react.useState)("");
	const [giftOpen, setGiftOpen] = (0, import_react.useState)(false);
	const [giftTo, setGiftTo] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [emojiOpen, setEmojiOpen] = (0, import_react.useState)(false);
	const [speakerOff, setSpeakerOff] = (0, import_react.useState)(false);
	const [blockedAudio, setBlockedAudio] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const fetchIce = useServerFn(getVoiceIceServers);
	const onAudioBlocked = (0, import_react.useCallback)((id, blocked) => setBlockedAudio((prev) => {
		const next = new Set(prev);
		if (blocked) next.add(id);
		else next.delete(id);
		return next;
	}), []);
	const [chatHidden, setChatHidden] = (0, import_react.useState)(false);
	const [flying, setFlying] = (0, import_react.useState)([]);
	const [banners, setBanners] = (0, import_react.useState)([]);
	const [scenes, setScenes] = (0, import_react.useState)([]);
	const [seatSheet, setSeatSheet] = (0, import_react.useState)(null);
	const [audienceOpen, setAudienceOpen] = (0, import_react.useState)(false);
	const [invite, setInvite] = (0, import_react.useState)(null);
	const [entering, setEntering] = (0, import_react.useState)(null);
	const [giftQueue, setGiftQueue] = (0, import_react.useState)([]);
	const [seatBusy, setSeatBusy] = (0, import_react.useState)(false);
	const videoGift = giftQueue[0];
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)("");
	const client = (0, import_react.useRef)(null);
	const seenRef = (0, import_react.useRef)(null);
	const seatRefs = (0, import_react.useRef)({});
	const chatRef = (0, import_react.useRef)(null);
	const isOwner = room.owner_id === me.id;
	const meMember = members.find((m) => m.id === me.id);
	const flash = (t) => {
		setToast(t);
		window.setTimeout(() => setToast(""), 2400);
	};
	(0, import_react.useEffect)(() => {
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
						setEntering({
							id: `${last.id}-${Date.now()}`,
							name: last.name,
							photo: last.photo
						});
						window.setTimeout(() => setEntering((e) => e && e.name === last.name ? null : e), 2600);
					}
					if (joined.length) setChat((c) => [...c.slice(-80), ...joined.map((m) => ({
						id: `join-${m.id}-${Date.now()}`,
						from: m.id,
						name: m.name,
						photo: m.photo,
						text: "",
						at: Date.now(),
						kind: "system",
						to: "join"
					}))]);
				}
				seenRef.current = new Set(list.map((m) => m.id));
				setMembers(list);
			},
			onStream: (id, s) => setStreams((prev) => {
				const n = { ...prev };
				if (s) n[id] = s;
				else delete n[id];
				return n;
			}),
			onSpeaking: (id, level) => setLevels((prev) => prev[id] === level ? prev : {
				...prev,
				[id]: level
			}),
			onChat: (m) => setChat((prev) => {
				if (m.kind === "gift" && m.comboId) {
					const i = prev.findIndex((x) => x.comboId === m.comboId);
					if (i >= 0) {
						const n = prev.slice();
						n[i] = {
							...prev[i],
							count: Math.max(prev[i].count ?? 1, m.count ?? 1)
						};
						return n;
					}
				}
				return [...prev.slice(-80), m];
			}),
			onMod: (m) => void handleMod(m),
			onGift: (g) => launchGift(g),
			onRoom: (type) => {
				if (type === "closed") {
					flash(translate("Otaq sahibi otağı bağladı"));
					window.setTimeout(() => onLeave(), 1200);
				} else sb.from("voice_rooms").select(ROOM_COLS).eq("id", room.id).maybeSingle().then(({ data }) => {
					if (data) setRoom(data);
				});
			},
			onStatus: (s) => {
				setStatus(s);
				onPresence(s === "live");
			}
		});
		c.ownerId = room.owner_id;
		c.locked = new Set(room.locked_seats ?? []);
		client.current = c;
		fetchIce().then((servers) => c.start(servers)).catch(() => c.start());
		return () => {
			onPresence(false);
			client.current = null;
			c.leave();
		};
	}, [room.id]);
	(0, import_react.useEffect)(() => {
		chatRef.current?.scrollTo({
			top: chatRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [chat.length]);
	(0, import_react.useEffect)(() => {
		if (client.current) client.current.locked = new Set(room.locked_seats ?? []);
	}, [room.locked_seats]);
	async function handleMod(m) {
		const sb = getSupabase();
		if (m.type === "kick") {
			if (!sb) return;
			const { data } = await sb.from("voice_room_kicks").select("until").eq("room_id", room.id).eq("user_id", me.id).maybeSingle();
			if (!data || new Date(data.until).getTime() < Date.now()) return;
			flash(translate("Otaq sahibi səni otaqdan çıxardı"));
			window.setTimeout(() => onLeave(), 1300);
		} else if (m.type === "unseat") flash(translate("Otaq sahibi səni izləyici etdi"));
		else if (m.type === "invite") setInvite({
			seat: m.seat,
			name: m.name
		});
		else if (m.type === "invite_reply") flash(`${m.name}: ${m.accept ? translate("dəvəti qəbul etdi") : translate("dəvəti rədd etdi")}`);
	}
	function launchGift(g) {
		const def = giftByKey(g.gift);
		if (!def) return;
		if (def.tier === "video") {
			setGiftQueue((prev) => [...prev, g]);
			return;
		}
		const key = g.comboId ?? g.id;
		setBanners((prev) => [...prev.filter((b) => b.key !== key), {
			...g,
			key,
			until: Date.now() + 3200
		}].slice(-3));
		window.setTimeout(() => setBanners((prev) => prev.filter((b) => b.key !== key || b.until > Date.now())), 3300);
		if (def.tier === "medium" || def.tier === "big") setScenes((prev) => def.tier === "medium" && prev.length > 2 ? prev : [...prev, g]);
		window.requestAnimationFrame(() => {
			const ms = membersRef.current.find((m) => m.id === g.to);
			const r = (ms?.seat != null ? seatRefs.current[ms.seat] : null)?.getBoundingClientRect();
			const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
			const y = r ? r.top + r.height / 2 : window.innerHeight / 2.4;
			setFlying((prev) => [...prev, {
				...g,
				x,
				y
			}]);
			window.setTimeout(() => setFlying((prev) => prev.filter((f) => f.id !== g.id)), 2300);
		});
	}
	const doneScene = (0, import_react.useCallback)(() => setScenes((q) => q.slice(1)), []);
	const membersRef = (0, import_react.useRef)([]);
	membersRef.current = members;
	const bySeat = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
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
	const toggleLock = async (seat) => {
		const sb = getSupabase();
		if (!sb || !isOwner) return;
		const cur = new Set(room.locked_seats ?? []);
		if (cur.has(seat)) cur.delete(seat);
		else cur.add(seat);
		const next = [...cur].sort((a, b) => a - b);
		const { data, error } = await sb.from("voice_rooms").update({ locked_seats: next }).eq("id", room.id).select(ROOM_COLS).single();
		if (error) {
			flash(error.message);
			return;
		}
		setRoom(data);
		client.current?.notifyRoom("updated");
	};
	const kick = async (m, minutes) => {
		const sb = getSupabase();
		if (!sb || !isOwner) return;
		const { data, error } = await sb.rpc("kick_voice_member", {
			p_room: room.id,
			p_user: m.id,
			p_minutes: minutes
		});
		if (error) {
			flash(error.message);
			return;
		}
		client.current?.sendMod({
			type: "kick",
			from: me.id,
			target: m.id,
			until: new Date(String(data)).getTime()
		});
		flash(`${m.name} ${translate("otaqdan çıxarıldı")}`);
	};
	const unseat = (m) => {
		client.current?.sendMod({
			type: "unseat",
			from: me.id,
			target: m.id
		});
		flash(`${m.name} ${translate("izləyiciyə endirildi")}`);
	};
	const inviteTo = (m, seat) => {
		client.current?.sendMod({
			type: "invite",
			from: me.id,
			target: m.id,
			seat,
			name: me.name
		});
		flash(`${m.name} ${translate("yerə dəvət edildi")}`);
	};
	const answerInvite = async (accept) => {
		const inv = invite;
		setInvite(null);
		const c = client.current;
		if (!c || !inv) return;
		c.sendMod({
			type: "invite_reply",
			from: me.id,
			target: room.owner_id,
			accept,
			name: me.name
		});
		if (!accept) return;
		const taken = new Set(membersRef.current.filter((x) => x.seat !== null && x.id !== me.id).map((x) => x.seat));
		let seat = inv.seat !== null && !taken.has(inv.seat) ? inv.seat : null;
		if (seat === null) {
			for (let i = 0; i < 10; i++) if (!taken.has(i) && !c.locked.has(i)) {
				seat = i;
				break;
			}
		}
		if (seat === null) {
			flash(translate("Boş yer yoxdur"));
			return;
		}
		c.locked.delete(seat);
		await sit(seat);
	};
	const onSeatTap = (i) => {
		const m = bySeat.get(i) ?? null;
		const locked = (room.locked_seats ?? []).includes(i);
		if (!m && !isOwner) {
			if (locked) flash(translate("Bu yer kilidlidir"));
			else sit(i);
			return;
		}
		if (m && m.id === me.id) {
			setSeatSheet({
				seat: i,
				member: m
			});
			return;
		}
		setSeatSheet({
			seat: i,
			member: m
		});
	};
	const toggleMic = () => {
		const c = client.current;
		if (!c || c.me.seat === null) {
			flash(translate("Əvvəlcə masaya otur"));
			return;
		}
		if (!c.toggleMic()) flash(translate("Mikrofona icazə verilməyib"));
	};
	const sit = async (seat) => {
		if (seatBusy) return;
		const c = client.current;
		if (!c) return;
		setSeatBusy(true);
		try {
			if (!await c.setSeat(seat)) flash(translate("Yer tutulub və ya mikrofon icazəsi verilməyib"));
		} finally {
			setSeatBusy(false);
		}
	};
	const copyId = () => {
		navigator.clipboard?.writeText(String(room.code)).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		});
	};
	const renderSeat = (i) => {
		const m = bySeat.get(i);
		const lvl = m ? levels[m.id] ?? 0 : 0;
		const speaking = Boolean(m && m.mic && lvl > 0);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: (el) => {
				seatRefs.current[i] = el;
			},
			className: `vr-seat${m ? " taken" : ""}${speaking ? " speaking" : ""}${m?.id === me.id ? " me" : ""}`,
			onClick: m ? () => onSeatTap(i) : void 0,
			style: { ["--lvl"]: String(lvl) },
			children: m ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "vr-ring r1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "vr-ring r2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "vr-ring r3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vr-ava",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: m.photo || defaultPhoto,
						alt: m.name
					})
				}),
				!m.mic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "vr-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { size: 11 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "vr-numchip",
					children: i + 1
				}),
				m.id === room.owner_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "vr-crown",
					children: "👑"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "vr-name",
					children: m.id === me.id ? translate("Sən") : m.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "vr-eq",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
					]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "vr-empty",
				disabled: seatBusy || status !== "live",
				onClick: () => onSeatTap(i),
				"aria-label": `${i + 1}`,
				"data-locked": (room.locked_seats ?? []).includes(i) || void 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "vr-numchip",
					children: i + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "vr-plus",
					children: (room.locked_seats ?? []).includes(i) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
						size: 18,
						strokeWidth: 2.4
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 22,
						strokeWidth: 2
					})
				})]
			})
		}, i);
	};
	const owner = members.find((m) => m.id === room.owner_id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `vr vr-kind-voice vr-cover-${cover.key}`,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": roomTitle(room.name),
		style: { backgroundImage: `url(${room.photo || "/assets/room-bg-night-BN6AF0vt.jpg"})` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("style", { children: [VR_STYLES, GIFT_FX_STYLES] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-sky",
				"aria-hidden": "true"
			}),
			Object.entries(streams).filter(([id]) => id !== me.id).map(([id, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemoteAudio, {
				id,
				stream: s,
				muted: speakerOff,
				onBlocked: onAudioBlocked
			}, id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "vr-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vr-head-ava",
						onClick: copyId,
						"aria-label": "ID",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: room.photo || owner?.photo || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Im01My4yLDI3MS43di0yOC42aDUuNmwxMS43LDE5LjF2LTE5LjFoNS40djI4LjZoLTUuOWwtMTEuNS0xOC42djE4LjZoLTUuM1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtOCIgZD0ibTc4LjgsMjU3LjZjMC0yLjkuNC01LjQsMS4zLTcuMy42LTEuNSwxLjUtMi44LDIuNy0zLjksMS4xLTEuMiwyLjQtMiwzLjctMi42LDEuOC0uOCwzLjgtMS4xLDYuMi0xLjEsNC4yLDAsNy42LDEuMywxMC4xLDMuOSwyLjUsMi42LDMuOCw2LjIsMy44LDEwLjlzLTEuMyw4LjItMy44LDEwLjhjLTIuNSwyLjYtNS45LDMuOS0xMC4xLDMuOXMtNy42LTEuMy0xMC4xLTMuOWMtMi42LTIuNi0zLjgtNi4yLTMuOC0xMC43Wm01LjktLjJjMCwzLjIuNyw1LjcsMi4yLDcuNCwxLjUsMS43LDMuNCwyLjUsNS43LDIuNXM0LjItLjgsNS43LTIuNSwyLjItNC4xLDIuMi03LjUtLjctNS43LTIuMi03LjNjLTEuNC0xLjYtMy4zLTIuNC01LjctMi40cy00LjMuOC01LjgsMi40Yy0xLjQsMS42LTIuMSw0LjEtMi4xLDcuNFoiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0ibTExOC4xLDI3MS43di0yOC42aDkuM2MzLjUsMCw1LjguMSw2LjkuNCwxLjYuNCwzLDEuNCw0LjEsMi44LDEuMSwxLjQsMS43LDMuMywxLjcsNS42LDAsMS44LS4zLDMuMi0xLDQuNC0uNiwxLjItMS40LDIuMS0yLjQsMi44LTEsLjctMiwxLjEtMywxLjQtMS40LjMtMy40LjQtNiwuNGgtMy44djEwLjhoLTUuOFptNS44LTIzLjd2OC4xaDMuMmMyLjMsMCwzLjgtLjEsNC42LS40LjgtLjMsMS40LS44LDEuOC0xLjQuNC0uNi43LTEuNC43LTIuMiwwLTEtLjMtMS45LS45LTIuNi0uNi0uNy0xLjQtMS4xLTIuMy0xLjMtLjctLjEtMi4xLS4yLTQuMi0uMmgtMi45WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xMCIgZD0ibTE0Mi43LDI3MS43di0yOC42aDUuOHYxMS4yaDExLjN2LTExLjJoNS44djI4LjZoLTUuOHYtMTIuNWgtMTEuM3YxMi41aC01LjhaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Im0xNjguNCwyNTcuNmMwLTIuOS40LTUuNCwxLjMtNy4zLjYtMS41LDEuNS0yLjgsMi43LTMuOSwxLjEtMS4yLDIuNC0yLDMuNy0yLjYsMS44LS44LDMuOC0xLjEsNi4yLTEuMSw0LjIsMCw3LjYsMS4zLDEwLjEsMy45LDIuNSwyLjYsMy44LDYuMiwzLjgsMTAuOXMtMS4zLDguMi0zLjgsMTAuOGMtMi41LDIuNi01LjksMy45LTEwLjEsMy45cy03LjYtMS4zLTEwLjEtMy45Yy0yLjYtMi42LTMuOC02LjItMy44LTEwLjdabTUuOS0uMmMwLDMuMi43LDUuNywyLjIsNy40LDEuNSwxLjcsMy40LDIuNSw1LjcsMi41czQuMi0uOCw1LjctMi41LDIuMi00LjEsMi4yLTcuNS0uNy01LjctMi4yLTcuM2MtMS40LTEuNi0zLjMtMi40LTUuNy0yLjRzLTQuMy44LTUuOCwyLjRjLTEuMywxLjYtMi4xLDQuMS0yLjEsNy40WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy03IiBkPSJtMjA1LjEsMjcxLjd2LTIzLjdoLTguNXYtNC44aDIyLjd2NC44aC04LjV2MjMuN2gtNS43WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xMSIgZD0ibTIxOS4xLDI1Ny42YzAtMi45LjQtNS40LDEuMy03LjMuNi0xLjUsMS41LTIuOCwyLjctMy45LDEuMS0xLjIsMi40LTIsMy43LTIuNiwxLjgtLjgsMy44LTEuMSw2LjItMS4xLDQuMiwwLDcuNiwxLjMsMTAuMSwzLjksMi41LDIuNiwzLjgsNi4yLDMuOCwxMC45cy0xLjMsOC4yLTMuOCwxMC44Yy0yLjUsMi42LTUuOSwzLjktMTAuMSwzLjlzLTcuNi0xLjMtMTAuMS0zLjljLTIuNS0yLjYtMy44LTYuMi0zLjgtMTAuN1ptNi0uMmMwLDMuMi43LDUuNywyLjIsNy40LDEuNSwxLjcsMy40LDIuNSw1LjcsMi41czQuMi0uOCw1LjctMi41LDIuMi00LjEsMi4yLTcuNS0uNy01LjctMi4yLTcuM2MtMS40LTEuNi0zLjMtMi40LTUuNy0yLjRzLTQuMy44LTUuOCwyLjRjLTEuNCwxLjYtMi4xLDQuMS0yLjEsNy40WiIvPgogIDwvZz4KPHJlY3QgeD0iMCIgeT0iMjU4IiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOGY5ODljIi8+PHRleHQgeD0iMTUwIiB5PSIyODYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZmZmZiI+Tk8gUEhPVE88L3RleHQ+PC9zdmc+Cg==",
							alt: ""
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vr-head-text",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["@", ownerName || owner?.name || roomTitle(room.name)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "vr-head-id",
							onClick: copyId,
							children: [
								translate("OTAQ ID"),
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: room.code }),
								copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 12 }) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vr-head-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "vr-head-pill",
								onClick: () => setAudienceOpen(true),
								"aria-label": translate("İzləyicilər"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 14 }), members.length]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vr-head-pill",
								onClick: () => setMenuOpen(true),
								"aria-label": "Menyu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vr-head-pill",
								onClick: onLeave,
								"aria-label": translate("Otaqdan çıx"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 15 })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vr-roomname",
				children: [room.has_password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 11 }), roomTitle(room.name)]
			}),
			status !== "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-subrow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `vr-status ${status}`,
					children: status === "connecting" ? translate("Qoşulur…") : translate("Bağlantı xətası")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "vr-stage",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vr-seats",
					children: Array.from({ length: 10 }, (_, i) => renderSeat(i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-tools",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vr-pill",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setChatHidden((v) => !v),
								"aria-label": translate("Söhbəti gizlət"),
								children: chatHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { size: 17 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { size: 17 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "vr-all",
								children: "ALL"
							})]
						}),
						meMember?.seat !== null && meMember && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vr-pill vr-stand",
							onClick: () => client.current?.setSeat(null),
							children: translate("Yerdən qalx")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "vr-pill",
							onClick: () => setAudienceOpen(true),
							"aria-label": translate("İzləyicilər"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 15 }), listeners.length]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `vr-chat${chatHidden ? " hidden" : ""}`,
				ref: chatRef,
				children: chat.map((m) => m.kind === "system" && m.to === "join" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-msg join",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "vr-msg-ico",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { size: 16 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["@", m.name] }),
						" ",
						translate("otağa daxil oldu.")
					] })]
				}, m.id) : m.kind === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-msg sys",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "vr-msg-ico",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 15 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.text })]
				}, m.id) : m.kind === "gift" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-msg gift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "vr-msg-ico",
						children: giftEmoji(m.gift)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.from === me.id ? translate("Sən") : m.name }),
						" →",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.to === me.id ? translate("sənə") : m.toName || translate("hamıya") }),
						" ",
						giftByKey(m.gift)?.icon,
						(m.count ?? 1) > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", {
							className: "vr-x",
							children: [" x", m.count]
						})
					] })]
				}, m.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-msg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "vr-msg-ico",
						src: m.photo || defaultPhoto,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.from === me.id ? translate("Sən") : m.name }), m.text] })]
				}, m.id))
			}),
			emojiOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-emojis",
				children: EMOJIS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setText((t) => (t + e).slice(0, 300));
						setEmojiOpen(false);
					},
					children: e
				}, e))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "vr-bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `vr-tool${speakerOff ? " off" : ""}`,
						onClick: () => setSpeakerOff((v) => !v),
						"aria-label": translate("Səs"),
						children: speakerOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { size: 24 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `vr-tool${meMember?.mic ? " on" : ""}`,
						onClick: toggleMic,
						"aria-label": "Mikrofon",
						children: meMember?.mic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { size: 24 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vr-input",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vr-emo",
								onClick: () => setEmojiOpen((v) => !v),
								"aria-label": "Emoji",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: text,
								onChange: (e) => setText(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") send();
								},
								placeholder: translate("Bir şey söylə…"),
								maxLength: 300,
								"aria-label": "Mesaj"
							}),
							text.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vr-send",
								onClick: send,
								"aria-label": translate("Göndər"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 16 })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vr-tool vr-gift",
						onClick: () => setGiftOpen(true),
						"aria-label": translate("Hədiyyə göndər"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { size: 25 })
					})
				]
			}),
			flying.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "vr-fly",
				style: {
					["--tx"]: `${f.x}px`,
					["--ty"]: `${f.y}px`
				},
				children: [giftEmoji(f.gift), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "vr-burst" })]
			}, f.id)),
			!speakerOff && [...blockedAudio].some((id) => streams[id]) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "vr-sound-recover",
				"aria-label": translate("Səsi aç"),
				onClick: () => window.dispatchEvent(new Event("voice-audio-resume")),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { size: 20 })
			}),
			videoGift && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftPlayback, {
				gift: videoGift,
				muted: speakerOff,
				onDone: () => setGiftQueue((q) => q.slice(1))
			}, videoGift.id),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-toast",
				role: "status",
				children: toast
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftBanners, {
				banners,
				defaultPhoto,
				meId: me.id
			}),
			scenes[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftScene, {
				gift: scenes[0],
				onDone: doneScene
			}, scenes[0].id),
			entering && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vr-enter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: entering.photo || defaultPhoto,
						alt: ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["@", entering.name] }),
					" ",
					translate("otağa daxil oldu.")
				]
			}, entering.id),
			giftOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftSheet, {
				members,
				meId: me.id,
				defaultPhoto,
				initialTo: giftTo,
				disabled: status !== "live",
				onClose: () => setGiftOpen(false),
				onSend: async (to, g, combo) => {
					const c = client.current;
					if (!c) return false;
					const ok = await c.sendGift(to, g.key, combo);
					if (!ok) flash(translate("Hədiyyə göndərilmədi. Bağlantını yoxla."));
					return ok;
				}
			}),
			seatSheet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-sheet-wrap",
				onClick: (e) => {
					if (e.target === e.currentTarget) setSeatSheet(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-sheet vr-menu vr-seat-menu",
					children: [
						seatSheet.member ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vr-who",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: seatSheet.member.photo || defaultPhoto,
									alt: ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: seatSheet.member.id === me.id ? translate("Sən") : seatSheet.member.name }),
								seatSheet.seat !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["#", seatSheet.seat + 1] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "vr-who",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["#", (seatSheet.seat ?? 0) + 1] })
						}),
						!seatSheet.member && seatSheet.seat !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								const s = seatSheet.seat;
								setSeatSheet(null);
								sit(s);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 17 }),
								" ",
								translate("Bu yerə otur")
							]
						}),
						isOwner && !seatSheet.member && seatSheet.seat !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const s = seatSheet.seat;
								setSeatSheet(null);
								toggleLock(s);
							},
							children: (room.locked_seats ?? []).includes(seatSheet.seat) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { size: 17 }),
								" ",
								translate("Kilidi aç")
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 17 }),
								" ",
								translate("Yeri kilidlə")
							] })
						}),
						isOwner && !seatSheet.member && seatSheet.seat !== null && listeners.filter((l) => l.id !== me.id).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vr-invite-list",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: translate("Yerə dəvət et") }), listeners.filter((l) => l.id !== me.id).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									inviteTo(l, seatSheet.seat);
									setSeatSheet(null);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: l.photo || defaultPhoto,
										alt: ""
									}),
									l.name,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { size: 15 })
								]
							}, l.id))]
						}),
						seatSheet.member && seatSheet.member.id !== me.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setGiftTo(seatSheet.member.id);
								setSeatSheet(null);
								setGiftOpen(true);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { size: 17 }),
								" ",
								translate("Hədiyyə göndər")
							]
						}),
						seatSheet.member && seatSheet.member.id === me.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setSeatSheet(null);
								client.current?.setSeat(null);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, { size: 17 }),
								" ",
								translate("Yerdən qalx")
							]
						}),
						isOwner && seatSheet.member && seatSheet.member.id !== me.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [seatSheet.member.seat !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								unseat(seatSheet.member);
								setSeatSheet(null);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, { size: 17 }),
								" ",
								translate("İzləyiciyə endir")
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								inviteTo(seatSheet.member, null);
								setSeatSheet(null);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { size: 17 }),
								" ",
								translate("Yerə dəvət et")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vr-kick",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { size: 14 }),
								" ",
								translate("Müvəqqəti çıxar")
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: KICK_MINUTES.map((mn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "danger",
								onClick: () => {
									kick(seatSheet.member, mn);
									setSeatSheet(null);
								},
								children: mn >= 60 ? `${mn / 60} ${translate("saat")}` : `${mn} ${translate("dəq")}`
							}, mn)) })]
						})] })
					]
				})
			}),
			audienceOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-sheet-wrap",
				onClick: (e) => {
					if (e.target === e.currentTarget) setAudienceOpen(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-sheet vr-audience",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vr-sheet-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 16 }),
							" ",
							translate("İzləyicilər"),
							" · ",
							members.length
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vr-icon",
							onClick: () => setAudienceOpen(false),
							"aria-label": translate("Bağla"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "vr-aud-list",
						children: [...members].sort((a, b) => (a.seat ?? 99) - (b.seat ?? 99)).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setAudienceOpen(false);
								setSeatSheet({
									seat: m.seat,
									member: m
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: m.photo || defaultPhoto,
									alt: ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [m.id === me.id ? translate("Sən") : m.name, m.id === room.owner_id && " 👑"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: m.seat !== null ? `#${m.seat + 1}` : translate("izləyici") })
							]
						}, m.id))
					})]
				})
			}),
			invite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-sheet-wrap vr-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-invite",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { size: 26 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["@", invite.name] }),
							" ",
							translate("səni"),
							" ",
							invite.seat !== null ? `#${invite.seat + 1} ` : "",
							translate("yerə dəvət edir")
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void answerInvite(false),
							children: translate("Rədd et")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ok",
							onClick: () => void answerInvite(true),
							children: translate("Qəbul et")
						})] })
					]
				})
			}),
			menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-sheet-wrap",
				onClick: (e) => {
					if (e.target === e.currentTarget) setMenuOpen(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-sheet vr-menu",
					children: [
						isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setMenuOpen(false);
								setSettingsOpen(true);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { size: 18 }),
								" ",
								translate("Otaq ayarları")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								copyId();
								setMenuOpen(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 18 }), " ID-ni kopyala"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "danger",
							onClick: onLeave,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 18 }),
								" ",
								translate("Otaqdan çıx")
							]
						})
					]
				})
			}),
			settingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomSettings, {
				room,
				onClose: () => setSettingsOpen(false),
				onSaved: (r) => {
					setRoom(r);
					client.current?.notifyRoom("updated");
					setSettingsOpen(false);
					flash(translate("Otaq yeniləndi"));
				},
				onDeleted: () => {
					client.current?.notifyRoom("closed");
					onLeave();
				}
			})
		]
	});
}
function RoomSettings({ room, onClose, onSaved, onDeleted }) {
	const { language } = usePreferences();
	const [name, setName] = (0, import_react.useState)(roomTitle(room.name));
	const [photo, setPhoto] = (0, import_react.useState)(room.photo ?? null);
	const [pass, setPass] = (0, import_react.useState)("");
	const [passOn, setPassOn] = (0, import_react.useState)(Boolean(room.has_password));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const warning = PROFANITY_WARNING[language] ?? PROFANITY_WARNING.az;
	const bad = !checkProfanity(name).clean;
	const save = async () => {
		const sb = getSupabase();
		if (!sb || !name.trim()) return;
		if (bad) {
			setErr(warning);
			return;
		}
		setBusy(true);
		setErr("");
		const { data, error } = await sb.from("voice_rooms").update({
			name: withKind(name),
			photo
		}).eq("id", room.id).select(ROOM_COLS).single();
		if (error) {
			setBusy(false);
			setErr(/banned_word/.test(error.message) ? warning : error.message);
			return;
		}
		let saved = data;
		if (!passOn && room.has_password) {
			const r = await sb.rpc("set_voice_room_password", {
				p_room: room.id,
				p_pass: ""
			});
			if (r.error) {
				setBusy(false);
				setErr(r.error.message);
				return;
			}
			saved = {
				...saved,
				has_password: false
			};
		} else if (passOn && pass.trim()) {
			const r = await sb.rpc("set_voice_room_password", {
				p_room: room.id,
				p_pass: pass.trim()
			});
			if (r.error) {
				setBusy(false);
				setErr(r.error.message);
				return;
			}
			saved = {
				...saved,
				has_password: true
			};
		} else if (passOn && !room.has_password) {
			setBusy(false);
			setErr(translate("Şifrə yaz"));
			return;
		}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vr-sheet-wrap",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "vr-sheet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-sheet-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: translate("Otaq ayarları") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vr-icon",
						onClick: onClose,
						"aria-label": translate("Bağla"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "lv-photo",
					onClick: () => fileRef.current?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: roomPhoto({ photo }),
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "lv-photo-cta",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { size: 16 }), translate("Otaq şəkli")]
					})]
				}),
				photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "lv-link",
					onClick: () => setPhoto(null),
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: "image/*",
					hidden: true,
					onChange: async (e) => {
						const f = e.target.files?.[0];
						e.target.value = "";
						if (f) try {
							setPhoto(await compressRoomPhoto(f));
						} catch {}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "vr-field",
					children: [translate("Otaq adı"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: bad ? "lv-bad" : "",
						value: name,
						onChange: (e) => {
							setName(e.target.value);
							setErr("");
						},
						maxLength: 40
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "vr-switch",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { size: 16 }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: translate("Otaq şifrəsi") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: passOn,
							onChange: (e) => {
								setPassOn(e.target.checked);
								setErr("");
							}
						})
					]
				}),
				passOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "vr-field",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: pass,
						maxLength: 32,
						placeholder: room.has_password ? translate("Yeni şifrə (boş = dəyişmə)") : translate("Şifrə yaz"),
						onChange: (e) => {
							setPass(e.target.value);
							setErr("");
						}
					})
				}),
				(bad || err) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "lv-warn",
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 15 }), bad ? warning : err]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "vr-primary",
					disabled: busy || bad,
					onClick: save,
					children: translate("Yadda saxla")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "vr-danger",
					disabled: busy,
					onClick: remove,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 15 }), translate("Otağı bağla və sil")]
				})
			]
		})
	});
}
var VR_STYLES = `
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
var ROOM_COVERS = [
	{
		key: "emerald",
		emoji: "🌿"
	},
	{
		key: "sunset",
		emoji: "🌅"
	},
	{
		key: "night",
		emoji: "🌙"
	},
	{
		key: "rose",
		emoji: "🌹"
	},
	{
		key: "gold",
		emoji: "👑"
	},
	{
		key: "ocean",
		emoji: "🌊"
	}
];
var coverOf = (k) => ROOM_COVERS.find((c) => c.key === k) ?? ROOM_COVERS[0];
var OLD_VIDEO_MARK = "⁠";
var roomTitle = (name) => name.replaceAll(OLD_VIDEO_MARK, "");
var withKind = (title, _kind = "voice") => roomTitle(title).trim().slice(0, 40);
var roomPhoto = (r) => r.photo || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Im01My4yLDI3MS43di0yOC42aDUuNmwxMS43LDE5LjF2LTE5LjFoNS40djI4LjZoLTUuOWwtMTEuNS0xOC42djE4LjZoLTUuM1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtOCIgZD0ibTc4LjgsMjU3LjZjMC0yLjkuNC01LjQsMS4zLTcuMy42LTEuNSwxLjUtMi44LDIuNy0zLjksMS4xLTEuMiwyLjQtMiwzLjctMi42LDEuOC0uOCwzLjgtMS4xLDYuMi0xLjEsNC4yLDAsNy42LDEuMywxMC4xLDMuOSwyLjUsMi42LDMuOCw2LjIsMy44LDEwLjlzLTEuMyw4LjItMy44LDEwLjhjLTIuNSwyLjYtNS45LDMuOS0xMC4xLDMuOXMtNy42LTEuMy0xMC4xLTMuOWMtMi42LTIuNi0zLjgtNi4yLTMuOC0xMC43Wm01LjktLjJjMCwzLjIuNyw1LjcsMi4yLDcuNCwxLjUsMS43LDMuNCwyLjUsNS43LDIuNXM0LjItLjgsNS43LTIuNSwyLjItNC4xLDIuMi03LjUtLjctNS43LTIuMi03LjNjLTEuNC0xLjYtMy4zLTIuNC01LjctMi40cy00LjMuOC01LjgsMi40Yy0xLjQsMS42LTIuMSw0LjEtMi4xLDcuNFoiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0ibTExOC4xLDI3MS43di0yOC42aDkuM2MzLjUsMCw1LjguMSw2LjkuNCwxLjYuNCwzLDEuNCw0LjEsMi44LDEuMSwxLjQsMS43LDMuMywxLjcsNS42LDAsMS44LS4zLDMuMi0xLDQuNC0uNiwxLjItMS40LDIuMS0yLjQsMi44LTEsLjctMiwxLjEtMywxLjQtMS40LjMtMy40LjQtNiwuNGgtMy44djEwLjhoLTUuOFptNS44LTIzLjd2OC4xaDMuMmMyLjMsMCwzLjgtLjEsNC42LS40LjgtLjMsMS40LS44LDEuOC0xLjQuNC0uNi43LTEuNC43LTIuMiwwLTEtLjMtMS45LS45LTIuNi0uNi0uNy0xLjQtMS4xLTIuMy0xLjMtLjctLjEtMi4xLS4yLTQuMi0uMmgtMi45WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xMCIgZD0ibTE0Mi43LDI3MS43di0yOC42aDUuOHYxMS4yaDExLjN2LTExLjJoNS44djI4LjZoLTUuOHYtMTIuNWgtMTEuM3YxMi41aC01LjhaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Im0xNjguNCwyNTcuNmMwLTIuOS40LTUuNCwxLjMtNy4zLjYtMS41LDEuNS0yLjgsMi43LTMuOSwxLjEtMS4yLDIuNC0yLDMuNy0yLjYsMS44LS44LDMuOC0xLjEsNi4yLTEuMSw0LjIsMCw3LjYsMS4zLDEwLjEsMy45LDIuNSwyLjYsMy44LDYuMiwzLjgsMTAuOXMtMS4zLDguMi0zLjgsMTAuOGMtMi41LDIuNi01LjksMy45LTEwLjEsMy45cy03LjYtMS4zLTEwLjEtMy45Yy0yLjYtMi42LTMuOC02LjItMy44LTEwLjdabTUuOS0uMmMwLDMuMi43LDUuNywyLjIsNy40LDEuNSwxLjcsMy40LDIuNSw1LjcsMi41czQuMi0uOCw1LjctMi41LDIuMi00LjEsMi4yLTcuNS0uNy01LjctMi4yLTcuM2MtMS40LTEuNi0zLjMtMi40LTUuNy0yLjRzLTQuMy44LTUuOCwyLjRjLTEuMywxLjYtMi4xLDQuMS0yLjEsNy40WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy03IiBkPSJtMjA1LjEsMjcxLjd2LTIzLjdoLTguNXYtNC44aDIyLjd2NC44aC04LjV2MjMuN2gtNS43WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xMSIgZD0ibTIxOS4xLDI1Ny42YzAtMi45LjQtNS40LDEuMy03LjMuNi0xLjUsMS41LTIuOCwyLjctMy45LDEuMS0xLjIsMi40LTIsMy43LTIuNiwxLjgtLjgsMy44LTEuMSw2LjItMS4xLDQuMiwwLDcuNiwxLjMsMTAuMSwzLjksMi41LDIuNiwzLjgsNi4yLDMuOCwxMC45cy0xLjMsOC4yLTMuOCwxMC44Yy0yLjUsMi42LTUuOSwzLjktMTAuMSwzLjlzLTcuNi0xLjMtMTAuMS0zLjljLTIuNS0yLjYtMy44LTYuMi0zLjgtMTAuN1ptNi0uMmMwLDMuMi43LDUuNywyLjIsNy40LDEuNSwxLjcsMy40LDIuNSw1LjcsMi41czQuMi0uOCw1LjctMi41LDIuMi00LjEsMi4yLTcuNS0uNy01LjctMi4yLTcuM2MtMS40LTEuNi0zLjMtMi40LTUuNy0yLjRzLTQuMy44LTUuOCwyLjRjLTEuNCwxLjYtMi4xLDQuMS0yLjEsNy40WiIvPgogIDwvZz4KPHJlY3QgeD0iMCIgeT0iMjU4IiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOGY5ODljIi8+PHRleHQgeD0iMTUwIiB5PSIyODYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZmZmZiI+Tk8gUEhPVE88L3RleHQ+PC9zdmc+Cg==";
var ROOM_COLS = "id,code,name,cover,photo,owner_id,created_at,locked_seats,has_password";
var COLS_MID = "id,code,name,cover,photo,owner_id,created_at";
var COLS_OLD = "id,code,name,cover,owner_id,created_at";
var T = {
	title: {
		az: "Canlı otaqlar",
		tr: "Canlı odalar",
		ru: "Живые комнаты",
		en: "Live rooms"
	},
	talking: {
		az: "nəfər danışır",
		tr: "kişi konuşuyor",
		ru: "говорят",
		en: "talking"
	},
	create: {
		az: "Yarat",
		tr: "Oluştur",
		ru: "Создать",
		en: "Create"
	},
	mine: {
		az: "Otağım",
		tr: "Odam",
		ru: "Моя",
		en: "My room"
	},
	search: {
		az: "Otaq adı və ya ID",
		tr: "Oda adı veya ID",
		ru: "Название или ID",
		en: "Room name or ID"
	},
	join: {
		az: "Qoşul",
		tr: "Katıl",
		ru: "Войти",
		en: "Join"
	},
	empty: {
		az: "Hələ aktiv otaq yoxdur",
		tr: "Henüz aktif oda yok",
		ru: "Пока нет комнат",
		en: "No live rooms yet"
	},
	first: {
		az: "İlk səsli otağı sən yarat!",
		tr: "İlk sesli odayı sen oluştur!",
		ru: "Создай первую голосовую комнату!",
		en: "Start the first voice room!"
	},
	newRoom: {
		az: "Səsli otaq yarat",
		tr: "Sesli oda oluştur",
		ru: "Создать голосовую комнату",
		en: "Create voice room"
	},
	edit: {
		az: "Otağını aç",
		tr: "Odanı aç",
		ru: "Открыть комнату",
		en: "Open your room"
	},
	name: {
		az: "Otaq adı",
		tr: "Oda adı",
		ru: "Название",
		en: "Room name"
	},
	photo: {
		az: "Otaq şəkli",
		tr: "Oda fotoğrafı",
		ru: "Фото комнаты",
		en: "Room photo"
	},
	pick: {
		az: "Şəkil seç",
		tr: "Fotoğraf seç",
		ru: "Выбрать фото",
		en: "Choose photo"
	},
	remove: {
		az: "Sil",
		tr: "Kaldır",
		ru: "Удалить",
		en: "Remove"
	},
	go: {
		az: "Yarat və gir",
		tr: "Oluştur ve gir",
		ru: "Создать и войти",
		en: "Create & enter"
	},
	enter: {
		az: "Otağa gir",
		tr: "Odaya gir",
		ru: "Войти",
		en: "Enter"
	},
	busy: {
		az: "Yaradılır…",
		tr: "Oluşturuluyor…",
		ru: "Создаём…",
		en: "Creating…"
	},
	notFound: {
		az: "Bu ID ilə otaq tapılmadı",
		tr: "Bu ID ile oda bulunamadı",
		ru: "Комната не найдена",
		en: "Room not found"
	},
	voiceOnly: {
		az: "Yalnız səsli söhbət",
		tr: "Sadece sesli sohbet",
		ru: "Только голос",
		en: "Voice only"
	},
	pwAsk: {
		az: "Otaq şifrəsi",
		tr: "Oda şifresi",
		ru: "Пароль комнаты",
		en: "Room password"
	},
	wrongPw: {
		az: "Şifrə yanlışdır",
		tr: "Şifre yanlış",
		ru: "Неверный пароль",
		en: "Wrong password"
	},
	kicked: {
		az: "Otaq sahibi səni otaqdan çıxarıb. Yenidən girmək olar:",
		tr: "Oda sahibi seni odadan attı. Tekrar girebilirsin:",
		ru: "Владелец удалил вас. Снова можно через",
		en: "The owner removed you. You can rejoin in"
	},
	min: {
		az: "dəq sonra",
		tr: "dk sonra",
		ru: "мин",
		en: "min"
	},
	badImg: {
		az: "Şəkil yüklənmədi",
		tr: "Fotoğraf yüklenemedi",
		ru: "Не удалось загрузить фото",
		en: "Couldn't load photo"
	}
};
/** Downscale a picked image to a small JPEG data URL (≤ ~120 KB) for the room cover. */
async function compressRoomPhoto(file, max = 540) {
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise((res, rej) => {
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
		return c.toDataURL("image/jpeg", .78);
	} finally {
		URL.revokeObjectURL(url);
	}
}
function LiveRooms({ me, defaultPhoto, onClose }) {
	const { language } = usePreferences();
	const t = (k) => T[k]?.[language] ?? T[k]?.az ?? "";
	const [rooms, setRooms] = (0, import_react.useState)(null);
	const [owners, setOwners] = (0, import_react.useState)({});
	const [inside, setInside] = (0, import_react.useState)({});
	const [active, setActive] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(`${me.name}`.slice(0, 40));
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const lobby = (0, import_react.useRef)(null);
	const activeRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	activeRef.current = active;
	const bad = !checkProfanity(name).clean;
	const warning = PROFANITY_WARNING[language] ?? PROFANITY_WARNING.az;
	const load = (0, import_react.useCallback)(async () => {
		const sb = getSupabase();
		if (!sb) return;
		let res = await sb.from("voice_rooms").select(ROOM_COLS).order("created_at", { ascending: false }).limit(60);
		if (res.error) res = await sb.from("voice_rooms").select(COLS_MID).order("created_at", { ascending: false }).limit(60);
		if (res.error) res = await sb.from("voice_rooms").select(COLS_OLD).order("created_at", { ascending: false }).limit(60);
		if (res.error) {
			setErr(res.error.message);
			return;
		}
		const list = res.data ?? [];
		setRooms(list);
		const ids = Array.from(new Set(list.map((r) => r.owner_id)));
		if (ids.length) {
			const { data } = await sb.from("profiles").select("id,name,username").in("id", ids);
			const map = {};
			for (const p of data ?? []) map[p.id] = p.username || p.name || "";
			setOwners(map);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb) return;
		load();
		const ch = sb.channel("vroom-lobby", { config: { presence: { key: me.id } } });
		lobby.current = ch;
		ch.on("presence", { event: "sync" }, () => {
			const map = {};
			for (const arr of Object.values(ch.presenceState())) {
				const e = arr[arr.length - 1];
				if (e?.room) (map[e.room] ??= []).push(e);
			}
			setInside(map);
		});
		ch.on("broadcast", { event: "rooms" }, () => void load());
		ch.subscribe((s) => {
			if (s === "SUBSCRIBED" && activeRef.current) ch.track({
				room: activeRef.current.id,
				name: me.name,
				photo: me.photo
			});
		});
		const tm = window.setInterval(() => void load(), 3e4);
		return () => {
			window.clearInterval(tm);
			lobby.current = null;
			sb.removeChannel(ch);
		};
	}, [
		load,
		me.id,
		me.name,
		me.photo
	]);
	const onPresence = (0, import_react.useCallback)((inRoom) => {
		const ch = lobby.current;
		if (!ch) return;
		if (inRoom && activeRef.current) ch.track({
			room: activeRef.current.id,
			name: me.name,
			photo: me.photo
		});
		else ch.untrack();
	}, [me.name, me.photo]);
	const announce = () => void lobby.current?.send({
		type: "broadcast",
		event: "rooms",
		payload: {}
	});
	const mine = rooms?.find((r) => r.owner_id === me.id);
	const openCreate = () => {
		if (mine) {
			setName(roomTitle(mine.name));
			setPhoto(mine.photo ?? null);
		}
		setErr("");
		setCreating(true);
	};
	const create = async () => {
		const sb = getSupabase();
		const title = withKind(name);
		if (!sb || !title) return;
		if (!checkProfanity(title).clean) {
			setErr(warning);
			return;
		}
		setBusy(true);
		setErr("");
		const row = {
			name: title,
			photo
		};
		const res = mine ? await sb.from("voice_rooms").update(row).eq("id", mine.id).select(ROOM_COLS).single() : await sb.from("voice_rooms").insert({
			owner_id: me.id,
			...row
		}).select(ROOM_COLS).single();
		setBusy(false);
		if (res.error) {
			setErr(/banned_word/.test(res.error.message) ? warning : res.error.message);
			return;
		}
		setCreating(false);
		announce();
		await load();
		setActive(res.data);
	};
	const joinById = async () => {
		const code = Number(query.replace(/\D/g, ""));
		const sb = getSupabase();
		if (!code || !sb) return;
		const { data } = await sb.from("voice_rooms").select(ROOM_COLS).eq("code", code).maybeSingle();
		if (data) enter(data);
		else setErr(t("notFound"));
	};
	const [pwFor, setPwFor] = (0, import_react.useState)(null);
	const [pw, setPw] = (0, import_react.useState)("");
	const enter = async (r, pass) => {
		const sb = getSupabase();
		if (!sb) return;
		setErr("");
		const { data, error } = await sb.rpc("voice_room_enter", {
			p_room: r.id,
			p_pass: pass ?? null
		});
		if (error) {
			if (!r.has_password) setActive(r);
			else setErr(error.message);
			return;
		}
		const res = String(data ?? "ok");
		if (res === "ok") {
			setPwFor(null);
			setPw("");
			setActive(r);
		} else if (res === "password") {
			setPwFor(r);
			if (pass !== void 0) setErr(t("wrongPw"));
		} else if (res.startsWith("kicked:")) {
			const mins = Math.max(1, Math.ceil((Number(res.slice(7)) * 1e3 - Date.now()) / 6e4));
			setErr(`${t("kicked")} ${mins} ${t("min")}`);
		} else setErr(t("notFound"));
	};
	const pickPhoto = async (f) => {
		if (!f) return;
		try {
			setPhoto(await compressRoomPhoto(f));
		} catch {
			setErr(t("badImg"));
		}
	};
	const shown = (rooms ?? []).filter((r) => !query || roomTitle(r.name).toLowerCase().includes(query.toLowerCase()) || String(r.code).includes(query.replace(/\D/g, "") || "~")).sort((a, b) => (inside[b.id]?.length ?? 0) - (inside[a.id]?.length ?? 0));
	if (active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceRoom, {
		room: active,
		me,
		ownerName: owners[active.owner_id] || (active.owner_id === me.id ? me.name : ""),
		defaultPhoto,
		onPresence,
		onLeave: () => {
			setActive(null);
			announce();
			load();
		}
	});
	const totalInside = Object.values(inside).reduce((n, a) => n + a.length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lv",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": t("title"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("style", { children: [VR_STYLES, LV_STYLES] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "lv-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "lv-ic",
						onClick: onClose,
						"aria-label": "Back",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 22 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lv-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t("title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							totalInside,
							" ",
							t("talking"),
							" · ",
							(rooms ?? []).length
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "lv-new",
						onClick: openCreate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 17 }), mine ? t("mine") : t("create")]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lv-search",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 17 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setErr("");
						},
						onKeyDown: (e) => {
							if (e.key === "Enter") joinById();
						},
						placeholder: t("search"),
						inputMode: "search"
					}),
					/^\d{4,}$/.test(query.trim()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void joinById(),
						children: t("join")
					})
				]
			}),
			err && !creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lv-err",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lv-grid",
				children: rooms === null ? Array.from({ length: 6 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lv-card lv-skel" }, i)) : shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lv-empty",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 34 }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("empty") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("first") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lv-new",
							onClick: openCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 17 }), t("create")]
						})
					]
				}) : shown.map((r, i) => {
					const n = inside[r.id]?.length ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "lv-card",
						style: { animationDelay: `${i * 35}ms` },
						onClick: () => void enter(r),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "lv-cover",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: roomPhoto(r),
									alt: "",
									loading: "lazy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lv-live",
									children: "LIVE"
								}),
								r.has_password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lv-lock",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 13 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `lv-count${n ? " on" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 13 }), n]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "lv-info",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: roomTitle(r.name) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lv-owner",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { size: 14 }),
									"@",
									owners[r.owner_id] ?? ""
								]
							})]
						})]
					}, r.id);
				})
			}),
			pwFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-sheet-wrap",
				onClick: (e) => {
					if (e.target === e.currentTarget) {
						setPwFor(null);
						setErr("");
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-sheet lv-sheet",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vr-sheet-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 16 }),
								" ",
								roomTitle(pwFor.name)
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vr-icon",
								onClick: () => {
									setPwFor(null);
									setErr("");
								},
								"aria-label": "Bağla",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "vr-field",
							children: [t("pwAsk"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: pw,
								maxLength: 32,
								autoFocus: true,
								onChange: (e) => {
									setPw(e.target.value);
									setErr("");
								},
								onKeyDown: (e) => {
									if (e.key === "Enter" && pw) enter(pwFor, pw);
								}
							})]
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "lv-warn",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 15 }), err]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vr-primary",
							disabled: !pw,
							onClick: () => void enter(pwFor, pw),
							children: t("enter")
						})
					]
				})
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vr-sheet-wrap",
				onClick: (e) => {
					if (e.target === e.currentTarget) setCreating(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vr-sheet lv-sheet",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vr-sheet-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: mine ? t("edit") : t("newRoom") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vr-icon",
								onClick: () => setCreating(false),
								"aria-label": "Bağla",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lv-photo",
							onClick: () => fileRef.current?.click(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: photo || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Im01My4yLDI3MS43di0yOC42aDUuNmwxMS43LDE5LjF2LTE5LjFoNS40djI4LjZoLTUuOWwtMTEuNS0xOC42djE4LjZoLTUuM1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtOCIgZD0ibTc4LjgsMjU3LjZjMC0yLjkuNC01LjQsMS4zLTcuMy42LTEuNSwxLjUtMi44LDIuNy0zLjksMS4xLTEuMiwyLjQtMiwzLjctMi42LDEuOC0uOCwzLjgtMS4xLDYuMi0xLjEsNC4yLDAsNy42LDEuMywxMC4xLDMuOSwyLjUsMi42LDMuOCw2LjIsMy44LDEwLjlzLTEuMyw4LjItMy44LDEwLjhjLTIuNSwyLjYtNS45LDMuOS0xMC4xLDMuOXMtNy42LTEuMy0xMC4xLTMuOWMtMi42LTIuNi0zLjgtNi4yLTMuOC0xMC43Wm01LjktLjJjMCwzLjIuNyw1LjcsMi4yLDcuNCwxLjUsMS43LDMuNCwyLjUsNS43LDIuNXM0LjItLjgsNS43LTIuNSwyLjItNC4xLDIuMi03LjUtLjctNS43LTIuMi03LjNjLTEuNC0xLjYtMy4zLTIuNC01LjctMi40cy00LjMuOC01LjgsMi40Yy0xLjQsMS42LTIuMSw0LjEtMi4xLDcuNFoiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0ibTExOC4xLDI3MS43di0yOC42aDkuM2MzLjUsMCw1LjguMSw2LjkuNCwxLjYuNCwzLDEuNCw0LjEsMi44LDEuMSwxLjQsMS43LDMuMywxLjcsNS42LDAsMS44LS4zLDMuMi0xLDQuNC0uNiwxLjItMS40LDIuMS0yLjQsMi44LTEsLjctMiwxLjEtMywxLjQtMS40LjMtMy40LjQtNiwuNGgtMy44djEwLjhoLTUuOFptNS44LTIzLjd2OC4xaDMuMmMyLjMsMCwzLjgtLjEsNC42LS40LjgtLjMsMS40LS44LDEuOC0xLjQuNC0uNi43LTEuNC43LTIuMiwwLTEtLjMtMS45LS45LTIuNi0uNi0uNy0xLjQtMS4xLTIuMy0xLjMtLjctLjEtMi4xLS4yLTQuMi0uMmgtMi45WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xMCIgZD0ibTE0Mi43LDI3MS43di0yOC42aDUuOHYxMS4yaDExLjN2LTExLjJoNS44djI4LjZoLTUuOHYtMTIuNWgtMTEuM3YxMi41aC01LjhaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Im0xNjguNCwyNTcuNmMwLTIuOS40LTUuNCwxLjMtNy4zLjYtMS41LDEuNS0yLjgsMi43LTMuOSwxLjEtMS4yLDIuNC0yLDMuNy0yLjYsMS44LS44LDMuOC0xLjEsNi4yLTEuMSw0LjIsMCw3LjYsMS4zLDEwLjEsMy45LDIuNSwyLjYsMy44LDYuMiwzLjgsMTAuOXMtMS4zLDguMi0zLjgsMTAuOGMtMi41LDIuNi01LjksMy45LTEwLjEsMy45cy03LjYtMS4zLTEwLjEtMy45Yy0yLjYtMi42LTMuOC02LjItMy44LTEwLjdabTUuOS0uMmMwLDMuMi43LDUuNywyLjIsNy40LDEuNSwxLjcsMy40LDIuNSw1LjcsMi41czQuMi0uOCw1LjctMi41LDIuMi00LjEsMi4yLTcuNS0uNy01LjctMi4yLTcuM2MtMS40LTEuNi0zLjMtMi40LTUuNy0yLjRzLTQuMy44LTUuOCwyLjRjLTEuMywxLjYtMi4xLDQuMS0yLjEsNy40WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy03IiBkPSJtMjA1LjEsMjcxLjd2LTIzLjdoLTguNXYtNC44aDIyLjd2NC44aC04LjV2MjMuN2gtNS43WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xMSIgZD0ibTIxOS4xLDI1Ny42YzAtMi45LjQtNS40LDEuMy03LjMuNi0xLjUsMS41LTIuOCwyLjctMy45LDEuMS0xLjIsMi40LTIsMy43LTIuNiwxLjgtLjgsMy44LTEuMSw2LjItMS4xLDQuMiwwLDcuNiwxLjMsMTAuMSwzLjksMi41LDIuNiwzLjgsNi4yLDMuOCwxMC45cy0xLjMsOC4yLTMuOCwxMC44Yy0yLjUsMi42LTUuOSwzLjktMTAuMSwzLjlzLTcuNi0xLjMtMTAuMS0zLjljLTIuNS0yLjYtMy44LTYuMi0zLjgtMTAuN1ptNi0uMmMwLDMuMi43LDUuNywyLjIsNy40LDEuNSwxLjcsMy40LDIuNSw1LjcsMi41czQuMi0uOCw1LjctMi41LDIuMi00LjEsMi4yLTcuNS0uNy01LjctMi4yLTcuM2MtMS40LTEuNi0zLjMtMi40LTUuNy0yLjRzLTQuMy44LTUuOCwyLjRjLTEuNCwxLjYtMi4xLDQuMS0yLjEsNy40WiIvPgogIDwvZz4KPHJlY3QgeD0iMCIgeT0iMjU4IiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQyIiBmaWxsPSIjOGY5ODljIi8+PHRleHQgeD0iMTUwIiB5PSIyODYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZmZmZiI+Tk8gUEhPVE88L3RleHQ+PC9zdmc+Cg==",
									alt: ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "lv-photo-cta",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { size: 16 }), t("pick")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lv-photo-live",
									children: "LIVE"
								})
							]
						}),
						photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "lv-link",
							onClick: () => setPhoto(null),
							children: t("remove")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							hidden: true,
							onChange: (e) => {
								pickPhoto(e.target.files?.[0]);
								e.target.value = "";
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "vr-field",
							children: [t("name"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: bad ? "lv-bad" : "",
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									setErr("");
								},
								maxLength: 40,
								"aria-invalid": bad
							})]
						}),
						(bad || err) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "lv-warn",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 15 }), bad ? warning : err]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "lv-hint",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 13 }), t("voiceOnly")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vr-primary",
							disabled: busy || !name.trim() || bad,
							onClick: () => void create(),
							children: busy ? t("busy") : mine ? t("enter") : t("go")
						})
					]
				})
			})
		]
	});
}
var LV_STYLES = `
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
function FriendRequests({ me, defaultPhoto, onOpenChat }) {
	usePreferences();
	const social = useSocial();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const incoming = social.friendships.filter((f) => f.status === "pending" && f.addressee_id === me);
	const sent = social.friendships.filter((f) => f.status === "pending" && f.requester_id === me);
	const friends = social.friendships.filter((f) => f.status === "accepted");
	const act = async (id, run) => {
		setBusy(id);
		await run();
		setBusy(null);
	};
	const who = (id) => social.profiles[id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mp-section fr-box",
		"aria-label": translate("Dostluq istəkləri"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: FR_STYLES }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { size: 16 }),
				translate("Dostluq istəkləri"),
				incoming.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "fr-count",
					children: incoming.length
				})
			] }),
			incoming.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "fr-empty",
				children: translate("Yeni istək yoxdur.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "fr-list",
				children: incoming.map((f) => {
					const p = who(f.requester_id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "fr-item fr-new",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p?.photo_url || defaultPhoto,
								alt: ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fr-who",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p?.name ?? "…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["@", p?.username ?? ""] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "fr-btn fr-yes",
								disabled: busy === f.id,
								onClick: () => void act(f.id, () => respondFriendRequest(f.id, true)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }), translate("Qəbul et")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "fr-btn fr-no",
								"aria-label": translate("Rədd et"),
								disabled: busy === f.id,
								onClick: () => void act(f.id, () => respondFriendRequest(f.id, false)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 15 })
							})
						]
					}, f.id);
				})
			}),
			sent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 14 }), translate("Göndərilən istəklər")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "fr-list",
				children: sent.map((f) => {
					const p = who(f.addressee_id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "fr-item",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p?.photo_url || defaultPhoto,
								alt: ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fr-who",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p?.name ?? "…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: translate("Cavab gözlənilir") })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "fr-btn fr-no",
								disabled: busy === f.id,
								onClick: () => void act(f.id, () => removeFriendship(f.id)),
								children: translate("Ləğv et")
							})
						]
					}, f.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 14 }),
				translate("Dostlar"),
				" · ",
				friends.length
			] }),
			friends.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "fr-empty",
				children: translate("Əsas səhifədə “izlə” düyməsi ilə dost əlavə et.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fr-friends",
				children: friends.map((f) => {
					const id = otherParty(f, me);
					const p = who(id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "fr-friend",
						onClick: () => onOpenChat(id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fr-friend-photo",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p?.photo_url || defaultPhoto,
									alt: ""
								}), (social.unread[id] ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: social.unread[id] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p?.name ?? "…" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 12 })
						]
					}, f.id);
				})
			})
		]
	});
}
var FR_STYLES = `
.fr-box h3{display:flex;align-items:center;gap:7px;}
.fr-count{margin-left:auto;min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:var(--heart);color:var(--primary-foreground);font-size:11px;font-weight:800;display:grid;place-items:center;}
.fr-box h4{display:flex;align-items:center;gap:6px;margin:14px 0 6px;font-size:12px;font-weight:700;color:var(--muted-foreground);}
.fr-empty{margin:4px 0;font-size:12px;color:var(--muted-foreground);}
.fr-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}
.fr-item{display:flex;align-items:center;gap:10px;padding:8px;border-radius:14px;background:var(--background);border:1px solid var(--border);}
.fr-item.fr-new{animation:fr-in .35s ease-out both;border-color:color-mix(in oklch,var(--heart) 45%,var(--border));}
.fr-item img{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;}
.fr-who{flex:1;min-width:0;display:flex;flex-direction:column;}
.fr-who strong{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.fr-who small{font-size:11px;color:var(--muted-foreground);}
.fr-btn{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:4px;height:32px;padding:0 12px;border-radius:16px;font-size:12px;font-weight:700;transition:transform .15s;}
.fr-btn:active{transform:scale(.92);}.fr-btn:disabled{opacity:.5;cursor:default;}
.fr-yes{background:var(--primary);color:var(--primary-foreground);}
.fr-no{background:var(--surface);color:var(--muted-foreground);border:1px solid var(--border);padding:0 10px;}
.fr-friends{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
.fr-friend{all:unset;cursor:pointer;flex:0 0 64px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;color:var(--foreground);text-align:center;}
.fr-friend>span:nth-child(2){max-width:64px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.fr-friend svg{color:var(--primary);}
.fr-friend-photo{position:relative;}
.fr-friend-photo img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);}
.fr-friend-photo i{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;border-radius:9px;background:var(--heart);color:var(--primary-foreground);font-size:10px;font-style:normal;font-weight:800;display:grid;place-items:center;border:2px solid var(--surface);}
@keyframes fr-in{from{transform:translateY(6px);opacity:0;}}
`;
var fmt = (ms) => {
	const s = Math.max(0, Math.round(ms / 1e3));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
function pickMime() {
	if (typeof MediaRecorder === "undefined") return "";
	for (const t of [
		"audio/webm;codecs=opus",
		"audio/webm",
		"audio/mp4",
		"audio/ogg;codecs=opus"
	]) if (MediaRecorder.isTypeSupported(t)) return t;
	return "";
}
function MediaComposer({ me, peer, onSent, onError, children }) {
	const fileRef = (0, import_react.useRef)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [caption, setCaption] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [rec, setRec] = (0, import_react.useState)(null);
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [level, setLevel] = (0, import_react.useState)([]);
	const recRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => () => {
		if (preview) URL.revokeObjectURL(preview.url);
	}, [preview]);
	(0, import_react.useEffect)(() => () => stopTracks(), []);
	(0, import_react.useEffect)(() => {
		if (!rec) return;
		const t = window.setInterval(() => setElapsed(Date.now() - rec.start), 200);
		return () => window.clearInterval(t);
	}, [rec]);
	function stopTracks() {
		const r = recRef.current;
		if (!r) return;
		r.stream.getTracks().forEach((t) => t.stop());
		if (r.raf) cancelAnimationFrame(r.raf);
		r.ctx?.close();
	}
	const sendImage = async () => {
		if (!preview || busy) return;
		setBusy(true);
		onError("");
		const res = await sendMediaMessage(me, peer, preview.file, "image", { caption: caption.trim() });
		setBusy(false);
		if (!res.ok) {
			onError(translate(res.error));
			return;
		}
		onSent(res.message);
		setPreview(null);
		setCaption("");
	};
	const startRec = async () => {
		onError("");
		if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
			onError(translate("Bu cihaz səs yazmağı dəstəkləmir"));
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: {
				echoCancellation: true,
				noiseSuppression: true
			} });
			const mime = pickMime();
			const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : void 0);
			const r = {
				mr,
				stream,
				chunks: [],
				cancel: false
			};
			recRef.current = r;
			try {
				const ctx = new AudioContext();
				const an = ctx.createAnalyser();
				an.fftSize = 64;
				ctx.createMediaStreamSource(stream).connect(an);
				const buf = new Uint8Array(an.frequencyBinCount);
				r.ctx = ctx;
				const tick = () => {
					an.getByteFrequencyData(buf);
					const v = buf.reduce((a, b) => a + b, 0) / buf.length / 255;
					setLevel((l) => [...l.slice(-27), v]);
					r.raf = requestAnimationFrame(tick);
				};
				tick();
			} catch {}
			const start = Date.now();
			mr.ondataavailable = (e) => {
				if (e.data.size) r.chunks.push(e.data);
			};
			mr.onstop = async () => {
				stopTracks();
				setRec(null);
				setLevel([]);
				const duration = Date.now() - start;
				if (r.cancel || duration < 600) return;
				const blob = new Blob(r.chunks, { type: (mr.mimeType || mime || "audio/webm").split(";")[0] ?? "audio/webm" });
				setBusy(true);
				const res = await sendMediaMessage(me, peer, blob, "audio", { durationMs: duration });
				setBusy(false);
				if (!res.ok) onError(translate(res.error));
				else onSent(res.message);
			};
			mr.start(250);
			setElapsed(0);
			setRec({ start });
		} catch {
			onError(translate("Mikrofona icazə verilmədi"));
		}
	};
	const stopRec = (cancel) => {
		const r = recRef.current;
		if (!r || r.mr.state === "inactive") return;
		r.cancel = cancel;
		r.mr.stop();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: CM_STYLES }),
		preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cm-preview",
			role: "dialog",
			"aria-label": translate("Şəkil göndər"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "cm-x",
					onClick: () => setPreview(null),
					"aria-label": translate("Bağla"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconClose, { size: 20 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: preview.url,
					alt: ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cm-preview-bar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: caption,
						onChange: (e) => setCaption(e.target.value),
						maxLength: 300,
						placeholder: translate("Açıqlama əlavə et…")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "sm-send",
						disabled: busy,
						onClick: () => void sendImage(),
						"aria-label": translate("Göndər"),
						children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cm-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSend, { size: 18 })
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sm-composer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*",
				hidden: true,
				onChange: (e) => {
					const f = e.target.files?.[0];
					e.target.value = "";
					if (!f) return;
					if (!f.type.startsWith("image/")) {
						onError(translate("Yalnız şəkil faylı seçin."));
						return;
					}
					setPreview({
						file: f,
						url: URL.createObjectURL(f)
					});
				}
			}), rec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cm-rec",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cm-tool danger",
						onClick: () => stopRec(true),
						"aria-label": translate("Ləğv et"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cm-dot" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cm-time",
						children: fmt(elapsed)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cm-wave",
						children: Array.from({ length: 28 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { height: `${12 + (level[i] ?? 0) * 80}%` } }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "sm-send",
						onClick: () => stopRec(false),
						"aria-label": translate("Göndər"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSend, { size: 18 })
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "cm-tool",
					disabled: busy,
					onClick: () => fileRef.current?.click(),
					"aria-label": translate("Şəkil göndər"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconImage, { size: 22 })
				}),
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "cm-tool mic",
					disabled: busy,
					onClick: () => void startRec(),
					"aria-label": translate("Səsli mesaj yaz"),
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cm-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconMic, { size: 22 })
				})
			] })]
		})
	] });
}
function useSigned(path) {
	const [url, setUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let on = true;
		mediaUrl(path).then((u) => {
			if (on) setUrl(u);
		});
		return () => {
			on = false;
		};
	}, [path]);
	return url;
}
function MediaImage({ path }) {
	const url = useSigned(path);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "cm-img",
		onClick: () => url && setOpen(true),
		"aria-label": translate("Şəkli aç"),
		children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: "",
			loading: "lazy"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cm-img-ph" })
	}), open && url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cm-lightbox",
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: ""
		})
	})] });
}
function VoiceBubble({ path, durationMs, mine }) {
	const url = useSigned(path);
	const audio = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [pos, setPos] = (0, import_react.useState)(0);
	const total = durationMs ?? 0;
	const bars = (0, import_react.useRef)(Array.from({ length: 26 }, (_, i) => .3 + Math.abs(Math.sin(i * 1.7 + path.length)) * .7)).current;
	const pct = total ? Math.min(1, pos / total) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "cm-voice" + (mine ? " mine" : ""),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !url,
				"aria-label": playing ? translate("Dayandır") : translate("Dinlə"),
				onClick: () => {
					const a = audio.current;
					if (!a) return;
					if (a.paused) a.play();
					else a.pause();
				},
				children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPause, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlay, { size: 16 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cm-bars",
				children: bars.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: i / bars.length < pct ? "on" : "",
					style: { height: `${h * 100}%` }
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: fmt(playing || pos ? pos : total) }),
			url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audio,
				src: url,
				preload: "metadata",
				onPlay: () => setPlaying(true),
				onPause: () => setPlaying(false),
				onEnded: () => {
					setPlaying(false);
					setPos(0);
				},
				onTimeUpdate: (e) => setPos(e.currentTarget.currentTime * 1e3)
			})
		]
	});
}
var CM_STYLES = `
.sm-composer{align-items:center!important;}
.sm-composer-form{flex:1;display:flex;align-items:flex-end;gap:8px;min-width:0;}
.cm-tool{all:unset;cursor:pointer;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;color:var(--muted-foreground);flex-shrink:0;transition:background .2s,color .2s,transform .15s;}
.cm-tool:hover{background:var(--surface);color:var(--primary);}.cm-tool:active{transform:scale(.9);}
.cm-tool.mic{background:var(--accent);color:var(--primary);}
.cm-tool.danger{color:var(--heart);}
.cm-tool:disabled{opacity:.5;cursor:default;}
.cm-rec{flex:1;display:flex;align-items:center;gap:10px;min-width:0;}
.cm-dot{width:10px;height:10px;border-radius:50%;background:var(--heart);animation:cm-blink 1s infinite;}
.cm-time{font-variant-numeric:tabular-nums;font-weight:700;font-size:14px;}
.cm-wave{flex:1;display:flex;align-items:center;gap:2px;height:30px;min-width:0;}
.cm-wave i{flex:1;min-width:2px;border-radius:2px;background:var(--primary);transition:height .1s;}
.cm-spin{width:18px;height:18px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:cm-rot .7s linear infinite;}
.cm-img{all:unset;cursor:zoom-in;display:block;margin:-3px -6px 2px -8px;border-radius:14px;overflow:hidden;width:calc(100% + 14px);}
.cm-img img{display:block;width:100%;max-width:240px;max-height:320px;object-fit:cover;}
.cm-img-ph{display:block;width:220px;height:160px;background:color-mix(in oklch,var(--muted-foreground) 25%,transparent);animation:cm-blink 1.2s infinite;}
.cm-lightbox{position:fixed;inset:0;z-index:90;background:oklch(0 0 0 / .9);display:grid;place-items:center;padding:16px;animation:sm-in .2s;}
.cm-lightbox img{max-width:100%;max-height:100%;border-radius:10px;}
.cm-voice{display:flex;align-items:center;gap:8px;min-width:190px;}
.cm-voice button{all:unset;cursor:pointer;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--primary);color:var(--primary-foreground);flex-shrink:0;}
.cm-voice.mine button{background:var(--primary-foreground);color:var(--primary);}
.cm-bars{flex:1;display:flex;align-items:center;gap:2px;height:26px;}
.cm-bars i{flex:1;border-radius:2px;background:currentColor;opacity:.35;}.cm-bars i.on{opacity:1;}
.cm-voice small{font-size:11px;font-variant-numeric:tabular-nums;opacity:.8;}
.cm-preview{position:fixed;inset:0;z-index:80;background:oklch(.12 0 0);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom));}
.cm-preview>img{flex:1;min-height:0;max-width:100%;object-fit:contain;border-radius:12px;}
.cm-x{all:unset;cursor:pointer;position:absolute;top:max(14px,env(safe-area-inset-top));left:14px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:oklch(1 0 0 / .15);color:oklch(1 0 0);}
.cm-preview-bar{display:flex;gap:8px;width:100%;max-width:560px;margin-top:12px;}
.cm-preview-bar input{flex:1;height:44px;padding:0 16px;border-radius:22px;border:0;background:oklch(1 0 0 / .14);color:oklch(1 0 0);font:inherit;outline:none;}
@keyframes cm-blink{50%{opacity:.35;}}
@keyframes cm-rot{to{transform:rotate(360deg);}}
`;
var GLOBAL_SLOW_MODE_MS = 3e3;
var COLS = "id,sender_id,body,reply_to,created_at";
function normalizeGlobal(text) {
	const t = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
	if (!t || t.length > 500) return null;
	return t;
}
/** Milliseconds the player still has to wait before the next message (0 = may send). */
function slowModeWait(lastSentAt, now) {
	if (lastSentAt == null) return 0;
	return Math.max(0, GLOBAL_SLOW_MODE_MS - (now - lastSentAt));
}
function mergeGlobal(list, rows) {
	const map = new Map(list.map((m) => [m.id, m]));
	for (const r of rows) map.set(r.id, r);
	return [...map.values()].sort((a, b) => a.created_at.localeCompare(b.created_at)).slice(-200);
}
function mentionsMe(body, myName) {
	if (!myName) return false;
	return body.toLocaleLowerCase().includes("@" + myName.toLocaleLowerCase());
}
async function loadGlobal() {
	const sb = getSupabase();
	if (!sb) return [];
	const { data } = await sb.from("global_messages").select(COLS).order("created_at", { ascending: false }).limit(100);
	return (data ?? []).reverse();
}
async function sendGlobal(body, replyTo) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		error: "Bağlantı yoxdur"
	};
	const { data, error } = await sb.from("global_messages").insert({
		body,
		reply_to: replyTo
	}).select(COLS).single();
	if (error) return {
		ok: false,
		error: /slow_mode/.test(error.message) ? "Çox tez yazırsan, bir az gözlə" : /banned/.test(error.message) ? "Hesabın bloklanıb" : "Mesaj göndərilmədi"
	};
	return {
		ok: true,
		message: data
	};
}
async function deleteGlobal(id) {
	const sb = getSupabase();
	if (!sb) return false;
	const { error } = await sb.from("global_messages").delete().eq("id", id);
	return !error;
}
function subscribeGlobal(me, on) {
	const sb = getSupabase();
	if (!sb) return {
		leave() {},
		typing() {}
	};
	const ch = sb.channel("global-chat", { config: {
		presence: { key: me },
		broadcast: { self: false }
	} }).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "global_messages"
	}, (p) => on.insert(p.new)).on("postgres_changes", {
		event: "DELETE",
		schema: "public",
		table: "global_messages"
	}, (p) => {
		const id = p.old.id;
		if (id) on.remove(id);
	}).on("presence", { event: "sync" }, () => on.online(Object.keys(ch.presenceState()).length)).on("broadcast", { event: "typing" }, (p) => {
		const id = p["payload"].id;
		if (id) on.typing(id);
	});
	ch.subscribe((s) => {
		if (s === "SUBSCRIBED") ch.track({ at: Date.now() });
	});
	let last = 0;
	return {
		leave() {
			sb.removeChannel(ch);
		},
		typing() {
			const n = Date.now();
			if (n - last > 2500) {
				last = n;
				ch.send({
					type: "broadcast",
					event: "typing",
					payload: { id: me }
				});
			}
		}
	};
}
var QUICK = [
	"👋",
	"😂",
	"❤️",
	"🔥",
	"😍",
	"🎉"
];
function GlobalChat({ me, defaultPhoto, onOpenProfile }) {
	const { language } = usePreferences();
	const social = useSocial();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [online, setOnline] = (0, import_react.useState)(0);
	const [typers, setTypers] = (0, import_react.useState)({});
	const [text, setText] = (0, import_react.useState)("");
	const [reply, setReply] = (0, import_react.useState)(null);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [wait, setWait] = (0, import_react.useState)(0);
	const [atBottom, setAtBottom] = (0, import_react.useState)(true);
	const [fresh, setFresh] = (0, import_react.useState)(0);
	const lastSent = (0, import_react.useRef)(null);
	const listRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const subRef = (0, import_react.useRef)(null);
	const myName = social.profiles[me]?.name;
	(0, import_react.useEffect)(() => {
		let on = true;
		ensureProfiles([me]);
		loadGlobal().then((rows) => {
			if (!on) return;
			setMessages((prev) => mergeGlobal(prev, rows));
			setLoading(false);
			ensureProfiles(rows.map((r) => r.sender_id));
		});
		const sub = subscribeGlobal(me, {
			insert: (m) => {
				ensureProfiles([m.sender_id]);
				setMessages((prev) => mergeGlobal(prev.filter((x) => !(x.pending && x.sender_id === m.sender_id && x.body === m.body)), [m]));
				setTypers((t) => {
					const n = { ...t };
					delete n[m.sender_id];
					return n;
				});
			},
			remove: (id) => setMessages((prev) => prev.filter((x) => x.id !== id)),
			online: setOnline,
			typing: (id) => {
				ensureProfiles([id]);
				setTypers((t) => ({
					...t,
					[id]: Date.now()
				}));
			}
		});
		subRef.current = sub;
		const iv = window.setInterval(() => setTypers((t) => {
			const now = Date.now();
			const n = Object.fromEntries(Object.entries(t).filter(([, at]) => now - at < 4e3));
			return Object.keys(n).length === Object.keys(t).length ? t : n;
		}), 1500);
		return () => {
			on = false;
			sub.leave();
			subRef.current = null;
			window.clearInterval(iv);
		};
	}, [me]);
	(0, import_react.useEffect)(() => {
		const el = listRef.current;
		if (!el) return;
		if (atBottom) {
			el.scrollTo({
				top: el.scrollHeight,
				behavior: messages.length > 40 ? "auto" : "smooth"
			});
			setFresh(0);
		} else setFresh((f) => f + 1);
	}, [messages.length]);
	(0, import_react.useEffect)(() => {
		const el = inputRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 110) + "px";
	}, [text]);
	(0, import_react.useEffect)(() => {
		if (wait <= 0) return;
		const t = window.setTimeout(() => setWait(slowModeWait(lastSent.current, Date.now())), 200);
		return () => window.clearTimeout(t);
	}, [wait]);
	const byId = (0, import_react.useMemo)(() => new Map(messages.map((m) => [m.id, m])), [messages]);
	const name = (id) => social.profiles[id]?.name ?? "…";
	const clock = (iso) => new Intl.DateTimeFormat(language, {
		hour: "2-digit",
		minute: "2-digit"
	}).format(new Date(iso));
	const typingNames = Object.keys(typers).filter((id) => id !== me).map(name);
	const send = async (raw = text) => {
		const body = normalizeGlobal(raw);
		if (!body) return;
		const w = slowModeWait(lastSent.current, Date.now());
		if (w > 0) {
			setWait(w);
			return;
		}
		lastSent.current = Date.now();
		setWait(slowModeWait(lastSent.current, Date.now()));
		const replyTo = reply?.id ?? null;
		if (raw === text) setText("");
		setReply(null);
		setError("");
		setAtBottom(true);
		const temp = {
			id: `tmp-${Date.now()}`,
			sender_id: me,
			body,
			reply_to: replyTo,
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			pending: true
		};
		setMessages((prev) => mergeGlobal(prev, [temp]));
		const res = await sendGlobal(body, replyTo);
		if (res.ok) setMessages((prev) => mergeGlobal(prev.filter((x) => x.id !== temp.id), [res.message]));
		else {
			setMessages((prev) => prev.filter((x) => x.id !== temp.id));
			if (raw === text) setText(body);
			setError(translate(res.error));
		}
	};
	const remove = async (m) => {
		setPicked(null);
		const before = messages;
		setMessages((prev) => prev.filter((x) => x.id !== m.id));
		if (!await deleteGlobal(m.id)) {
			setMessages(before);
			setError(translate("Silinmədi"));
		}
	};
	const mention = (id) => {
		setPicked(null);
		setText((t) => `@${name(id)} ` + t);
		inputRef.current?.focus();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gc",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: GC_STYLES }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gc-bar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "gc-live",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), translate("Canlı")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "gc-online",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 14 }),
						online,
						" ",
						translate("onlayn")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gc-list",
				ref: listRef,
				onScroll: (e) => {
					const el = e.currentTarget;
					const b = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
					setAtBottom(b);
					if (b) setFresh(0);
				},
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "gc-skel",
						children: [
							0,
							1,
							2,
							3
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, i))
					}),
					!loading && messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "gc-empty",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🌍" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: translate("Ümumi çat boşdur") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: translate("İlk salamı sən yaz!") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "gc-quick",
								children: QUICK.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void send(q),
									children: q
								}, q))
							})
						]
					}),
					messages.map((m, i) => {
						const mine = m.sender_id === me;
						const prev = messages[i - 1];
						const grouped = prev && prev.sender_id === m.sender_id && Date.parse(m.created_at) - Date.parse(prev.created_at) < 12e4;
						const p = social.profiles[m.sender_id];
						const parent = m.reply_to ? byId.get(m.reply_to) : null;
						const hot = !mine && mentionsMe(m.body, myName);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "gc-row" + (mine ? " mine" : "") + (grouped ? " grouped" : ""),
							children: [!mine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "gc-ava",
								onClick: () => onOpenProfile?.(m.sender_id),
								"aria-label": translate("Profilə bax"),
								children: !grouped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p?.photo_url || defaultPhoto,
									alt: ""
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "gc-col",
								children: [
									!mine && !grouped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "gc-name",
										onClick: () => mention(m.sender_id),
										children: p?.name ?? "…"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "gc-bubble" + (hot ? " hot" : "") + (m.pending ? " pending" : "") + (picked === m.id ? " picked" : ""),
										onClick: () => setPicked(picked === m.id ? null : m.id),
										children: [
											parent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "gc-quote",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: name(parent.sender_id) }), parent.body]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "gc-body",
												children: m.body
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: clock(m.created_at) })
										]
									}),
									picked === m.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "gc-actions",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setReply(m);
													setPicked(null);
													inputRef.current?.focus();
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerUpLeft, { size: 14 }), translate("Cavab")]
											}),
											!mine && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => mention(m.sender_id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { size: 14 }), translate("Qeyd et")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													navigator.clipboard?.writeText(m.body);
													setPicked(null);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 14 }), translate("Kopyala")]
											}),
											mine && !m.pending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "danger",
												onClick: () => void remove(m),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 }), translate("Sil")]
											})
										]
									})
								]
							})]
						}, m.id);
					})
				]
			}),
			!atBottom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "gc-down",
				onClick: () => {
					const el = listRef.current;
					el?.scrollTo({
						top: el.scrollHeight,
						behavior: "smooth"
					});
				},
				"aria-label": translate("Aşağı"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { size: 18 }), fresh > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fresh })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "gc-typing",
				children: typingNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "gc-dots",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
						]
					}),
					typingNames.slice(0, 2).join(", "),
					typingNames.length > 2 ? ` +${typingNames.length - 2}` : "",
					" ",
					translate("yazır…")
				] })
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "gc-error",
				role: "alert",
				children: error
			}),
			reply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gc-reply",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerUpLeft, { size: 15 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: name(reply.sender_id) }), reply.body] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setReply(null),
						"aria-label": translate("Bağla"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "gc-input",
				onSubmit: (e) => {
					e.preventDefault();
					send();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						ref: inputRef,
						rows: 1,
						value: text,
						maxLength: 500,
						placeholder: translate("Hamıya yaz…"),
						onChange: (e) => {
							setText(e.target.value);
							subRef.current?.typing();
						},
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								send();
							}
						}
					}),
					text.length > 440 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
						className: "gc-count",
						children: 500 - text.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "gc-send",
						disabled: !text.trim() || wait > 0,
						"aria-label": translate("Göndər"),
						children: wait > 0 ? Math.ceil(wait / 1e3) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 18 })
					})
				]
			})
		]
	});
}
var GC_STYLES = `
.gc{flex:1;min-height:0;display:flex;flex-direction:column;position:relative;}
.gc-bar{display:flex;align-items:center;justify-content:space-between;padding:6px 16px 8px;font-size:12px;color:var(--muted-foreground);}
.gc-live{display:inline-flex;align-items:center;gap:6px;font-weight:800;color:var(--heart);text-transform:uppercase;letter-spacing:.6px;font-size:11px;}
.gc-live i{width:7px;height:7px;border-radius:50%;background:var(--heart);animation:gc-pulse 1.4s infinite;}
.gc-online{display:inline-flex;align-items:center;gap:5px;font-weight:700;padding:4px 10px;border-radius:12px;background:var(--surface);border:1px solid var(--border);}
.gc-list{flex:1;min-height:0;overflow-y:auto;padding:4px 12px 8px;display:flex;flex-direction:column;overscroll-behavior:contain;}
.gc-row{display:flex;gap:8px;margin-top:10px;align-items:flex-end;}
.gc-row.grouped{margin-top:3px;}
.gc-row.mine{justify-content:flex-end;}
.gc-ava{all:unset;cursor:pointer;width:34px;height:34px;flex-shrink:0;}
.gc-ava img{width:34px;height:34px;border-radius:50%;object-fit:cover;}
.gc-col{display:flex;flex-direction:column;max-width:78%;min-width:0;}
.gc-row.mine .gc-col{align-items:flex-end;}
.gc-name{all:unset;cursor:pointer;font-size:12px;font-weight:800;color:var(--primary);margin:0 0 3px 10px;}
.gc-bubble{all:unset;cursor:pointer;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;padding:8px 12px 6px;border-radius:18px 18px 18px 6px;background:var(--surface);border:1px solid var(--border);font-size:14.5px;line-height:1.4;max-width:100%;-webkit-user-select:none;user-select:none;transition:transform .15s;}
.gc-row.mine .gc-bubble{background:var(--primary);color:var(--primary-foreground);border-color:transparent;border-radius:18px 18px 6px 18px;}
.gc-bubble.hot{background:color-mix(in oklch,var(--gold) 28%,var(--surface));border-color:var(--gold);}
.gc-bubble.pending{opacity:.6;}
.gc-bubble.picked{transform:scale(1.03);}
.gc-body{white-space:pre-wrap;overflow-wrap:anywhere;}
.gc-bubble time{align-self:flex-end;font-size:10px;opacity:.6;}
.gc-quote{display:flex;flex-direction:column;padding:4px 8px;border-left:3px solid currentColor;border-radius:6px;background:color-mix(in oklch,currentColor 10%,transparent);font-size:12px;opacity:.85;max-height:44px;overflow:hidden;}
.gc-quote b{font-size:11px;}
.gc-actions{display:flex;flex-wrap:wrap;gap:6px;margin:5px 0 4px;animation:gc-pop .18s ease-out both;}
.gc-actions button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 11px;border-radius:15px;background:var(--surface);border:1px solid var(--border);font-size:12px;font-weight:750;color:var(--foreground);}
.gc-actions .danger{color:var(--heart);}
.gc-empty{margin:auto;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;color:var(--muted-foreground);padding:30px;}
.gc-empty>span{font-size:46px;}.gc-empty strong{color:var(--foreground);font-size:16px;}.gc-empty p{margin:0;font-size:13px;}
.gc-quick{display:flex;gap:8px;margin-top:10px;}
.gc-quick button{all:unset;cursor:pointer;font-size:22px;width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:var(--surface);border:1px solid var(--border);transition:transform .15s;}
.gc-quick button:active{transform:scale(.9);}
.gc-skel{display:flex;flex-direction:column;gap:12px;padding-top:10px;}
.gc-skel span{height:38px;border-radius:18px;background:var(--muted);width:60%;animation:gc-shine 1.2s ease-in-out infinite;}
.gc-skel span:nth-child(even){align-self:flex-end;width:45%;}
.gc-down{all:unset;cursor:pointer;position:absolute;right:16px;bottom:120px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow);color:var(--foreground);}
.gc-down b{position:absolute;top:-6px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:var(--primary);color:var(--primary-foreground);font-size:10px;display:grid;place-items:center;padding:0 4px;}
.gc-typing{min-height:18px;padding:0 18px;font-size:11.5px;color:var(--primary);font-weight:650;display:flex;align-items:center;gap:6px;}
.gc-dots{display:inline-flex;gap:3px;}.gc-dots i{width:5px;height:5px;border-radius:50%;background:currentColor;animation:gc-dot 1s infinite;}.gc-dots i:nth-child(2){animation-delay:.15s;}.gc-dots i:nth-child(3){animation-delay:.3s;}
.gc-error{margin:0 14px 4px;font-size:12px;color:var(--heart);font-weight:650;}
.gc-reply{display:flex;align-items:center;gap:8px;margin:0 12px 6px;padding:7px 10px;border-radius:12px;background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--primary);font-size:12px;color:var(--primary);}
.gc-reply span{flex:1;min-width:0;display:flex;flex-direction:column;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gc-reply b{color:var(--primary);}
.gc-reply button{all:unset;cursor:pointer;color:var(--muted-foreground);}
.gc-input{display:flex;align-items:flex-end;gap:8px;padding:8px 12px max(10px,env(safe-area-inset-bottom));border-top:1px solid var(--border);background:color-mix(in oklch,var(--surface) 90%,transparent);position:relative;}
.gc-input textarea{flex:1;resize:none;border:1px solid var(--border);background:var(--background);border-radius:21px;padding:10px 14px;font:inherit;font-size:14.5px;color:var(--foreground);outline:none;max-height:110px;}
.gc-input textarea:focus{border-color:var(--primary);}
.gc-count{position:absolute;right:66px;top:-2px;font-size:10px;color:var(--muted-foreground);}
.gc-send{all:unset;cursor:pointer;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);font-weight:800;font-size:14px;flex-shrink:0;transition:transform .15s,opacity .2s;}
.gc-send:disabled{opacity:.45;cursor:default;}.gc-send:not(:disabled):active{transform:scale(.9);}
@keyframes gc-pulse{50%{opacity:.3;}}
@keyframes gc-dot{50%{transform:translateY(-3px);}}
@keyframes gc-pop{from{opacity:0;transform:translateY(-4px);}}
@keyframes gc-shine{50%{opacity:.5;}}
@media(prefers-reduced-motion:reduce){.gc *{animation:none!important;}}
`;
var CATS = [
	{
		key: "harassment",
		label: "Təhqir və ya təqib",
		hint: "Söyüş, hədə, narahat etmə"
	},
	{
		key: "inappropriate",
		label: "Uyğunsuz məzmun",
		hint: "Çılpaq, zorakı və ya iyrənc şəkil/mesaj"
	},
	{
		key: "spam",
		label: "Spam",
		hint: "Reklam, təkrarlanan mesajlar"
	},
	{
		key: "scam",
		label: "Fırıldaq",
		hint: "Pul, kod və ya şəxsi məlumat istəyir"
	},
	{
		key: "fake",
		label: "Saxta profil",
		hint: "Başqasının adından, saxta şəkil"
	},
	{
		key: "other",
		label: "Digər",
		hint: "Başqa səbəb"
	}
];
function ReportSheet({ me, target, targetName, context = "chat", onClose }) {
	const [cat, setCat] = (0, import_react.useState)(null);
	const [details, setDetails] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const submit = async () => {
		if (!cat || busy) return;
		if (cat === "other" && details.trim().length < 5) {
			setErr(translate("Zəhmət olmasa səbəbi qısaca yaz"));
			return;
		}
		setBusy(true);
		setErr("");
		const ok = await reportUser(me, target, cat, details, context);
		setBusy(false);
		if (ok) setDone(true);
		else setErr(translate("Şikayət göndərilmədi, yenidən cəhd et"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rs-wrap",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: RS_STYLES }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rs-sheet",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": translate("Şikayət et"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rs-grip",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rs-x",
					onClick: onClose,
					"aria-label": translate("Bağla"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconClose, { size: 18 })
				}),
				done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rs-done",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rs-ico ok",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCheck, { size: 28 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: translate("Şikayətin göndərildi") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: translate("Moderatorlar şikayətini yoxlayacaq. Təşəkkür edirik!") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rs-btn",
							onClick: onClose,
							children: translate("Bağla")
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rs-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rs-ico",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconFlag, { size: 22 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: translate("Şikayət et") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: targetName })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rs-lead",
						children: translate("Səbəbi seç — şikayət birbaşa adminə göndəriləcək.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rs-cats",
						role: "radiogroup",
						children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "radio",
							"aria-checked": cat === c.key,
							className: cat === c.key ? "on" : "",
							onClick: () => {
								setCat(c.key);
								setErr("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rs-radio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: translate(c.label) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: translate(c.hint) })] })]
						}, c.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "rs-field",
						children: [
							translate("Ətraflı izah (istəyə bağlı)"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								maxLength: 1e3,
								value: details,
								onChange: (e) => setDetails(e.target.value),
								placeholder: translate("Nə baş verdi?")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [details.length, "/1000"] })
						]
					}),
					err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rs-err",
						role: "alert",
						children: err
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rs-btn danger",
						disabled: !cat || busy,
						onClick: () => void submit(),
						children: busy ? "…" : translate("Şikayəti göndər")
					})
				] })
			]
		})]
	});
}
var RS_STYLES = `
.rs-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:oklch(0 0 0 / .5);animation:rs-fade .2s;}
.rs-sheet{position:relative;width:100%;max-width:520px;max-height:92dvh;overflow-y:auto;box-sizing:border-box;padding:10px 18px max(18px,env(safe-area-inset-bottom));border-radius:26px 26px 0 0;background:var(--background);color:var(--foreground);animation:rs-up .3s cubic-bezier(.2,.9,.3,1);}
.rs-grip{display:block;width:40px;height:5px;border-radius:3px;margin:0 auto 12px;background:var(--border);}
.rs-x{all:unset;cursor:pointer;position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--surface);}
.rs-head{display:flex;align-items:center;gap:12px;}
.rs-head div{display:flex;flex-direction:column;}.rs-head strong{font-size:18px;font-weight:850;}.rs-head small{font-size:12px;color:var(--muted-foreground);}
.rs-ico{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:color-mix(in oklch,var(--heart) 15%,transparent);color:var(--heart);flex-shrink:0;}
.rs-ico.ok{background:color-mix(in oklch,var(--primary) 15%,transparent);color:var(--primary);width:60px;height:60px;}
.rs-lead{margin:12px 0 10px;font-size:13px;color:var(--muted-foreground);}
.rs-cats{display:flex;flex-direction:column;gap:8px;}
.rs-cats button{all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;background:var(--surface);border:1.5px solid var(--border);transition:border-color .2s,background .2s;}
.rs-cats button.on{border-color:var(--heart);background:color-mix(in oklch,var(--heart) 8%,var(--surface));}
.rs-cats b{display:block;font-size:14px;}.rs-cats small{display:block;font-size:11.5px;color:var(--muted-foreground);margin-top:1px;}
.rs-radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;box-sizing:border-box;transition:border .2s;}
.rs-cats button.on .rs-radio{border:6px solid var(--heart);}
.rs-field{display:flex;flex-direction:column;gap:6px;margin-top:14px;font-size:12.5px;font-weight:700;}
.rs-field textarea{box-sizing:border-box;width:100%;resize:none;padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:var(--surface);color:var(--foreground);font:inherit;font-size:14px;font-weight:400;outline:none;}
.rs-field textarea:focus{border-color:var(--heart);}
.rs-field small{align-self:flex-end;font-weight:500;color:var(--muted-foreground);font-size:11px;}
.rs-err{margin:8px 0 0;font-size:12.5px;color:var(--heart);font-weight:650;}
.rs-btn{all:unset;box-sizing:border-box;cursor:pointer;width:100%;height:50px;margin-top:14px;display:grid;place-items:center;border-radius:16px;background:var(--surface);font-weight:850;font-size:15px;}
.rs-btn.danger{background:var(--heart);color:var(--primary-foreground);}
.rs-btn:disabled{opacity:.45;cursor:default;}
.rs-done{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:18px 0 4px;}
.rs-done strong{font-size:18px;}.rs-done p{margin:0;font-size:13px;color:var(--muted-foreground);}
@keyframes rs-fade{from{opacity:0;}}
@keyframes rs-up{from{transform:translateY(100%);}}
`;
function MessagesView({ me, defaultPhoto, initialPeer, onClose, onOpenProfile }) {
	const { language } = usePreferences();
	const social = useSocial();
	const [peer, setPeer] = (0, import_react.useState)(initialPeer);
	const [query, setQuery] = (0, import_react.useState)("");
	const [section, setSection] = (0, import_react.useState)("private");
	const [sound, setSound] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setSound(socialSoundEnabled());
		requestNotifyPermission();
		unlockSocialAudio();
	}, []);
	(0, import_react.useEffect)(() => {
		setPeer(initialPeer);
	}, [initialPeer]);
	(0, import_react.useEffect)(() => {
		const o = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = o;
		};
	}, []);
	const friends = (0, import_react.useMemo)(() => social.friendships.filter((f) => f.status === "accepted").map((f) => otherParty(f, me)).sort((a, b) => (social.last[b]?.created_at ?? "").localeCompare(social.last[a]?.created_at ?? "")), [
		social.friendships,
		social.last,
		me
	]);
	const incoming = social.friendships.filter((f) => f.status === "pending" && f.addressee_id === me).length;
	const q = query.trim().toLowerCase();
	const shown = friends.filter((id) => {
		const p = social.profiles[id];
		return !q || (p?.name ?? "").toLowerCase().includes(q) || (p?.username ?? "").includes(q);
	});
	const time = (iso) => {
		const d = new Date(iso);
		const today = /* @__PURE__ */ new Date();
		return d.toDateString() === today.toDateString() ? new Intl.DateTimeFormat(language, {
			hour: "2-digit",
			minute: "2-digit"
		}).format(d) : new Intl.DateTimeFormat(language, {
			day: "numeric",
			month: "short"
		}).format(d);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sm-root",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": translate("Mesajlar"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: SM_STYLES }), peer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatThread, {
			me,
			peer,
			defaultPhoto,
			onOpenProfile,
			onBack: () => initialPeer && peer === initialPeer ? onClose() : setPeer(null)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sm-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "sm-icon",
						"aria-label": translate("Geri"),
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: translate("Mesajlar") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "sm-icon",
						"aria-label": sound ? translate("Səsi bağla") : translate("Səsi aç"),
						onClick: () => {
							setSocialSound(!sound);
							setSound(!sound);
						},
						children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 19 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { size: 19 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm-tabs",
				role: "tablist",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": section === "private",
						className: section === "private" ? "on" : "",
						onClick: () => setSection("private"),
						children: [translate("Şəxsi"), Object.values(social.unread).reduce((a, b) => a + (b || 0), 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: Object.values(social.unread).reduce((a, b) => a + (b || 0), 0) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": section === "global",
						className: section === "global" ? "on" : "",
						onClick: () => setSection("global"),
						children: ["🌍 ", translate("Ümumi çat")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sm-tab-pill",
						style: { transform: section === "private" ? "translateX(0)" : "translateX(100%)" },
						"aria-hidden": "true"
					})
				]
			}),
			section === "global" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalChat, {
				me,
				defaultPhoto,
				onOpenProfile
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "sm-search",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: translate("Dost axtar")
					})]
				}),
				incoming > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "sm-hint",
					children: [
						incoming,
						" ",
						translate("yeni dostluq istəyi — Profil bölməsində qəbul et")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "sm-list",
					children: shown.map((id) => {
						const p = social.profiles[id];
						const last = social.last[id];
						const unread = social.unread[id] ?? 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "sm-row" + (unread ? " unread" : ""),
							onClick: () => setPeer(id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p?.photo_url || defaultPhoto,
									alt: ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sm-row-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p?.name ?? "…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: last ? (last.sender_id === me ? translate("Sən: ") : "") + messagePreview(last) : translate("Söhbətə başla 👋") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sm-row-meta",
									children: [last && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: time(last.created_at) }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: unread > 99 ? "99+" : unread })]
								})
							]
						}) }, id);
					})
				}),
				friends.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm-empty",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: translate("Hələ dostun yoxdur") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: translate("Əsas səhifədə “izlə” düyməsinə toxun, istək qəbul olunanda burada yazışa bilərsən.") })
					]
				})
			] })
		] })]
	});
}
function ChatThread({ me, peer, defaultPhoto, onBack, onOpenProfile }) {
	const { language } = usePreferences();
	const p = useSocial().profiles[peer];
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [text, setText] = (0, import_react.useState)("");
	const [typing, setTyping] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const listRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const typingRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let on = true;
		setActiveChat(peer);
		setLoading(true);
		setMessages([]);
		let readVersion = 0;
		const recover = () => {
			const version = ++readVersion;
			loadConversation(me, peer).then((rows) => {
				if (on && version === readVersion) {
					setMessages((prev) => mergeConversation(prev, rows));
					setLoading(false);
					markConversationRead(peer);
				}
			});
		};
		recover();
		const offRecovery = onSocialRecovery(recover);
		markConversationRead(peer);
		const off = onDirectMessage((m, type) => {
			const mine = m.sender_id === me && m.recipient_id === peer;
			const theirs = m.sender_id === peer && m.recipient_id === me;
			if (!mine && !theirs) return;
			setMessages((prev) => upsertMessage(prev, m));
			if (type === "insert" && theirs) {
				setTyping(false);
				if (document.visibilityState === "visible") markConversationRead(peer);
			}
		});
		const onVisible = () => {
			if (document.visibilityState === "visible") markConversationRead(peer);
		};
		document.addEventListener("visibilitychange", onVisible);
		const t = joinTyping(me, peer, setTyping);
		typingRef.current = t;
		return () => {
			on = false;
			off();
			offRecovery();
			t.leave();
			typingRef.current = null;
			setActiveChat(null);
			document.removeEventListener("visibilitychange", onVisible);
		};
	}, [me, peer]);
	(0, import_react.useEffect)(() => {
		const el = listRef.current;
		if (el) el.scrollTo({
			top: el.scrollHeight,
			behavior: messages.length > 30 ? "auto" : "smooth"
		});
	}, [messages.length, typing]);
	(0, import_react.useEffect)(() => {
		const el = inputRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 120) + "px";
	}, [text]);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const [reporting, setReporting] = (0, import_react.useState)(false);
	const holdRef = (0, import_react.useRef)(null);
	const unsend = async (m) => {
		setConfirmDel(null);
		setPicked(null);
		setError("");
		const before = messages;
		setMessages((prev) => prev.map((x) => x.id === m.id ? {
			...x,
			deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
			body: "",
			media_path: null
		} : x));
		const res = await unsendMessage(m);
		if (res.ok) setMessages((prev) => upsertMessage(prev, res.message));
		else {
			setMessages(before);
			setError(translate(res.error));
		}
	};
	const send = async () => {
		const body = normalizeMessage(text);
		if (!body) return;
		setText("");
		setError("");
		const temp = {
			id: `tmp-${Date.now()}`,
			sender_id: me,
			recipient_id: peer,
			body,
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			read_at: null,
			pending: true
		};
		setMessages((prev) => upsertMessage(prev, temp));
		const res = await sendDirectMessage(me, peer, body);
		if (res.ok) setMessages((prev) => upsertMessage(prev.filter((x) => x.id !== temp.id), res.message));
		else {
			setMessages((prev) => prev.filter((x) => x.id !== temp.id));
			setText(body);
			setError(translate(res.error));
		}
		inputRef.current?.focus();
	};
	const clock = (iso) => new Intl.DateTimeFormat(language, {
		hour: "2-digit",
		minute: "2-digit"
	}).format(new Date(iso));
	const dayLabel = (iso) => {
		const d = new Date(iso);
		const now = /* @__PURE__ */ new Date();
		const y = new Date(now);
		y.setDate(now.getDate() - 1);
		if (d.toDateString() === now.toDateString()) return translate("Bu gün");
		if (d.toDateString() === y.toDateString()) return translate("Dünən");
		return new Intl.DateTimeFormat(language, {
			day: "numeric",
			month: "long"
		}).format(d);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sm-chat",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sm-head sm-chat-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "sm-icon",
						"aria-label": translate("Geri"),
						onClick: onBack,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "sm-peer-btn",
						onClick: () => onOpenProfile?.(peer),
						"aria-label": translate("Profilə bax"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p?.photo_url || defaultPhoto,
							alt: ""
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "sm-peer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p?.name ?? "…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
								className: typing ? "typing" : "",
								children: typing ? translate("yazır…") : "@" + (p?.username ?? "")
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "sm-icon sm-report",
						"aria-label": translate("Şikayət et"),
						onClick: () => setReporting(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconFlag, { size: 19 })
					})
				]
			}),
			reporting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportSheet, {
				me,
				target: peer,
				targetName: p?.name ?? "",
				onClose: () => setReporting(false)
			}),
			confirmDel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm-sheet-wrap",
				onClick: (e) => {
					if (e.target === e.currentTarget) setConfirmDel(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm-sheet",
					role: "alertdialog",
					"aria-label": translate("Mesajı geri al"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sm-sheet-ico",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 24 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: translate("Mesaj hamı üçün silinsin?") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: translate("Mesaj həm səndə, həm də qarşı tərəfdə silinəcək.") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "sm-sheet-btn danger",
							onClick: () => void unsend(confirmDel),
							children: translate("Hamı üçün sil")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "sm-sheet-btn",
							onClick: () => setConfirmDel(null),
							children: translate("Ləğv et")
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm-thread",
				ref: listRef,
				"aria-live": "polite",
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm-loading",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
						]
					}),
					!loading && messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm-empty sm-empty-chat",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p?.photo_url || defaultPhoto,
								alt: ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p?.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: translate("İlk mesajı sən yaz 👋") })
						]
					}),
					messages.map((m, i) => {
						const mine = m.sender_id === me;
						const prev = messages[i - 1];
						const next = messages[i + 1];
						const newDay = !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
						const tail = !next || next.sender_id !== m.sender_id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm-msg-wrap",
							children: [
								newDay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm-day",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dayLabel(m.created_at) })
								}),
								m.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm-msg sm-deleted " + (mine ? "mine" : "theirs") + (tail ? " tail" : ""),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "sm-body",
										children: ["🚫 ", mine ? translate("Bu mesajı geri aldın") : translate("Bu mesaj silindi")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm-meta",
										children: clock(m.created_at)
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm-msg " + (mine ? "mine" : "theirs") + (tail ? " tail" : "") + (m.pending ? " pending" : "") + (picked === m.id ? " picked" : ""),
									onContextMenu: (e) => {
										if (mine && !m.pending) {
											e.preventDefault();
											setPicked(m.id);
										}
									},
									onPointerDown: () => {
										if (!mine || m.pending) return;
										holdRef.current = window.setTimeout(() => {
											setPicked(m.id);
											navigator.vibrate?.(15);
										}, 450);
									},
									onPointerUp: () => {
										if (holdRef.current) window.clearTimeout(holdRef.current);
									},
									onPointerLeave: () => {
										if (holdRef.current) window.clearTimeout(holdRef.current);
									},
									children: [
										m.kind === "image" && m.media_path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaImage, { path: m.media_path }) : m.kind === "audio" && m.media_path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceBubble, {
											path: m.media_path,
											durationMs: m.duration_ms ?? null,
											mine
										}) : null,
										m.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sm-body",
											children: m.body
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "sm-meta",
											children: [clock(m.created_at), mine && (m.read_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
												size: 14,
												className: "read"
											}) : m.pending ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }))]
										})
									]
								}),
								picked === m.id && !m.deleted_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm-actions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "danger",
										onClick: () => setConfirmDel(m),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 15 }), translate("Geri al")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPicked(null),
										children: translate("Bağla")
									})]
								})
							]
						}, m.id);
					}),
					typing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm-msg theirs tail sm-typing",
						"aria-label": translate("yazır…"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
						]
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sm-error",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaComposer, {
				me,
				peer,
				onSent: (m) => setMessages((prev) => upsertMessage(prev, m)),
				onError: setError,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "sm-composer-form",
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						ref: inputRef,
						rows: 1,
						value: text,
						maxLength: MAX_MESSAGE_LENGTH,
						placeholder: translate("Mesaj yaz…"),
						"aria-label": translate("Mesaj yaz…"),
						onChange: (e) => {
							setText(e.target.value);
							if (e.target.value) typingRef.current?.ping();
						},
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
								e.preventDefault();
								send();
							}
						}
					}), text.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "sm-send",
						"aria-label": translate("Göndər"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 18 })
					})]
				})
			})
		]
	});
}
var SM_STYLES = `
.sm-tabs{position:relative;display:grid;grid-template-columns:1fr 1fr;margin:0 14px 10px;padding:4px;border-radius:22px;background:var(--muted);box-sizing:border-box;width:auto;}
.sm-tabs button{all:unset;cursor:pointer;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:6px;height:36px;font-size:13.5px;font-weight:750;color:var(--muted-foreground);transition:color .2s;}
.sm-tabs button.on{color:var(--foreground);}
.sm-tabs button b{min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:9px;background:var(--heart);color:var(--primary-foreground);font-size:10px;display:grid;place-items:center;}
.sm-tab-pill{position:absolute;top:4px;left:4px;width:calc(50% - 4px);height:36px;border-radius:18px;background:var(--surface);box-shadow:0 2px 8px oklch(.2 .03 165 / .1);transition:transform .25s cubic-bezier(.2,.9,.3,1);}
.sm-root{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:var(--background);color:var(--foreground);animation:sm-in .28s cubic-bezier(.2,.9,.3,1) both;}
.sm-root>*{width:100%;max-width:640px;margin-left:auto;margin-right:auto;}
.sm-head{display:flex;align-items:center;gap:10px;padding:max(12px,env(safe-area-inset-top)) 14px 10px;}
.sm-head h1{flex:1;margin:0;font-size:24px;font-weight:800;letter-spacing:-.4px;}
.sm-icon{all:unset;cursor:pointer;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--surface);border:1px solid var(--border);color:var(--foreground);flex-shrink:0;}
.sm-icon:focus-visible,.sm-row:focus-visible,.sm-send:focus-visible{outline:2px solid var(--primary);outline-offset:2px;}
.sm-search{display:flex;align-items:center;gap:8px;margin:0 14px 8px;padding:0 14px;height:42px;border-radius:21px;background:var(--surface);border:1px solid var(--border);color:var(--muted-foreground);box-sizing:border-box;width:auto;}
.sm-search input{all:unset;flex:1;font-size:14px;color:var(--foreground);}
.sm-hint{margin:0 14px 6px;padding:9px 12px;border-radius:12px;background:color-mix(in oklch,var(--heart) 14%,var(--surface));font-size:12px;font-weight:600;}
.sm-list{list-style:none;margin:0;padding:0 6px 20px;overflow-y:auto;flex:1;}
.sm-row{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:16px;transition:background .2s;}
.sm-row:hover,.sm-row:active{background:var(--surface);}
.sm-row img{width:54px;height:54px;border-radius:50%;object-fit:cover;flex-shrink:0;}
.sm-row-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.sm-row-text strong{font-size:15px;}
.sm-row-text span{font-size:13px;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sm-row.unread .sm-row-text span{color:var(--foreground);font-weight:650;}
.sm-row-meta{display:flex;flex-direction:column;align-items:flex-end;gap:5px;font-size:11px;color:var(--muted-foreground);}
.sm-row-meta b{min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:10px;background:var(--primary);color:var(--primary-foreground);font-size:11px;display:grid;place-items:center;}
.sm-empty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:40px 30px;color:var(--muted-foreground);}
.sm-empty>span{font-size:44px;}.sm-empty strong{color:var(--foreground);font-size:16px;}.sm-empty p{margin:0;font-size:13px;max-width:280px;}
.sm-chat{flex:1;min-height:0;display:flex;flex-direction:column;}
.sm-chat-head{border-bottom:1px solid var(--border);background:color-mix(in oklch,var(--surface) 85%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}
.sm-peer-btn{all:unset;cursor:pointer;display:flex;align-items:center;gap:10px;min-width:0;flex:1;}
.sm-chat-head img{width:40px;height:40px;border-radius:50%;object-fit:cover;}
.sm-peer{display:flex;flex-direction:column;min-width:0;}
.sm-peer strong{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sm-peer small{font-size:12px;color:var(--muted-foreground);}.sm-peer small.typing{color:var(--primary);font-weight:650;}
.sm-thread{flex:1;min-height:0;overflow-y:auto;padding:12px 12px 8px;display:flex;flex-direction:column;gap:2px;overscroll-behavior:contain;}
.sm-msg-wrap{display:flex;flex-direction:column;}
.sm-msg{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;}
.sm-msg.picked{transform:scale(1.03);box-shadow:0 8px 24px oklch(.2 .05 260 / .25);transition:transform .2s;}
.sm-deleted{font-style:italic;opacity:.7;background:transparent!important;color:var(--muted-foreground)!important;border:1px dashed var(--border)!important;}
.sm-actions{align-self:flex-end;display:flex;gap:6px;margin:2px 0 8px;animation:sm-pop .18s ease-out both;}
.sm-actions button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:5px;height:32px;padding:0 12px;border-radius:16px;background:var(--surface);border:1px solid var(--border);font-size:12.5px;font-weight:750;}
.sm-actions .danger{color:var(--heart);}
.sm-report{margin-left:auto;color:var(--heart)!important;}
.sm-sheet-wrap{position:fixed;inset:0;z-index:85;display:flex;align-items:flex-end;justify-content:center;background:oklch(0 0 0 / .45);animation:sm-fade .2s;}
.sm-sheet{width:100%;max-width:520px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:22px 18px max(18px,env(safe-area-inset-bottom));border-radius:26px 26px 0 0;background:var(--background);animation:sm-up .28s cubic-bezier(.2,.9,.3,1);}
.sm-sheet-ico{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:color-mix(in oklch,var(--heart) 15%,transparent);color:var(--heart);}
.sm-sheet strong{font-size:17px;}.sm-sheet p{margin:0 0 8px;font-size:13px;color:var(--muted-foreground);}
.sm-sheet-btn{all:unset;box-sizing:border-box;cursor:pointer;width:100%;height:48px;display:grid;place-items:center;border-radius:14px;background:var(--surface);font-weight:800;font-size:15px;}
.sm-sheet-btn.danger{background:var(--heart);color:var(--primary-foreground);}
@keyframes sm-fade{from{opacity:0;}}
@keyframes sm-up{from{transform:translateY(100%);}}
.sm-day{display:flex;justify-content:center;margin:12px 0 8px;}
.sm-day span{font-size:11px;font-weight:700;color:var(--muted-foreground);padding:4px 10px;border-radius:10px;background:var(--surface);border:1px solid var(--border);}
.sm-msg{position:relative;max-width:78%;padding:7px 10px 6px 12px;border-radius:18px;font-size:14.5px;line-height:1.35;display:flex;flex-wrap:wrap;align-items:flex-end;gap:2px 8px;animation:sm-pop .22s ease-out both;word-break:break-word;}
.sm-msg.mine{align-self:flex-end;background:var(--primary);color:var(--primary-foreground);}
.sm-msg.theirs{align-self:flex-start;background:var(--surface);border:1px solid var(--border);}
.sm-msg.mine.tail{border-bottom-right-radius:5px;margin-bottom:6px;}
.sm-msg.theirs.tail{border-bottom-left-radius:5px;margin-bottom:6px;}
.sm-msg.pending{opacity:.65;}
.sm-body{white-space:pre-wrap;}
.sm-meta{margin-left:auto;display:inline-flex;align-items:center;gap:3px;font-size:10.5px;opacity:.75;}
.sm-meta .read{opacity:1;}
.sm-typing{display:flex;gap:4px;padding:12px 14px;}
.sm-typing span,.sm-loading span{width:7px;height:7px;border-radius:50%;background:var(--muted-foreground);animation:sm-dot 1.2s infinite;}
.sm-typing span:nth-child(2),.sm-loading span:nth-child(2){animation-delay:.15s;}.sm-typing span:nth-child(3),.sm-loading span:nth-child(3){animation-delay:.3s;}
.sm-loading{display:flex;gap:5px;justify-content:center;padding:30px;}
.sm-empty-chat img{width:84px;height:84px;border-radius:50%;object-fit:cover;margin-bottom:4px;}
.sm-error{margin:0 14px 4px;font-size:12px;color:var(--heart);font-weight:600;}
.sm-composer{display:flex;align-items:flex-end;gap:8px;padding:8px 12px max(10px,env(safe-area-inset-bottom));border-top:1px solid var(--border);background:var(--background);}
.sm-composer textarea{flex:1;resize:none;min-height:42px;max-height:120px;box-sizing:border-box;padding:10px 16px;border-radius:21px;border:1px solid var(--border);background:var(--surface);color:var(--foreground);font:inherit;font-size:15px;line-height:1.35;outline:none;}
.sm-composer textarea:focus{border-color:var(--primary);}
.sm-send{all:unset;cursor:pointer;display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:var(--primary);color:var(--primary-foreground);flex-shrink:0;transition:transform .15s,opacity .2s;}
.sm-send:active{transform:scale(.9);}.sm-send:disabled{opacity:.4;cursor:default;}
@keyframes sm-in{from{transform:translateX(24px);opacity:0;}}
@keyframes sm-pop{from{transform:translateY(6px) scale(.97);opacity:0;}}
@keyframes sm-dot{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}
@media(prefers-reduced-motion:reduce){.sm-root,.sm-msg,.sm-typing span,.sm-loading span{animation:none!important;}}
`;
function SocialBanner({ defaultPhoto }) {
	usePreferences();
	const { notices } = useSocial();
	if (!notices.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sb-stack",
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: SB_STYLES }), notices.map((n) => {
			const Icon = n.kind === "message" ? MessageCircle : n.kind === "request" ? UserPlus : n.kind === "harem" ? Heart : UserCheck;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sb-card",
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "sb-main",
					onClick: () => {
						dismissNotice(n.id);
						openSocialNotice(n);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "sb-photo",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: n.photo || defaultPhoto,
							alt: ""
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sb-kind sb-" + n.kind,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								size: 11,
								strokeWidth: 2.6
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "sb-text",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sb-app",
								children: ["DeltaGame · ", translate("indi")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: n.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sb-body",
								children: n.body
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "sb-close",
					"aria-label": translate("Bağla"),
					onClick: () => dismissNotice(n.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 15 })
				})]
			}, n.id);
		})]
	});
}
var SB_STYLES = `
.sb-stack{position:fixed;top:max(10px,env(safe-area-inset-top));left:0;right:0;z-index:80;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;padding:0 10px;}
.sb-card{pointer-events:auto;position:relative;width:min(100%,440px);display:flex;align-items:center;border-radius:20px;background:color-mix(in oklch,var(--surface) 90%,transparent);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);border:1px solid var(--border);box-shadow:0 14px 40px oklch(.2 .04 260 / .22);animation:sb-in .42s cubic-bezier(.2,1.2,.3,1) both;}
.sb-main{all:unset;cursor:pointer;flex:1;min-width:0;display:flex;align-items:center;gap:11px;padding:11px 8px 11px 12px;}
.sb-photo{position:relative;flex:0 0 42px;height:42px;}
.sb-photo img{width:42px;height:42px;border-radius:50%;object-fit:cover;background:var(--background);}
.sb-kind{position:absolute;right:-3px;bottom:-3px;width:19px;height:19px;border-radius:50%;display:grid;place-items:center;color:var(--primary-foreground);background:var(--primary);border:2px solid var(--surface);}
.sb-kind.sb-request{background:var(--heart);}
.sb-text{display:flex;flex-direction:column;min-width:0;gap:1px;}
.sb-app{font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:var(--muted-foreground);}
.sb-text strong{font-size:14px;color:var(--foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb-body{font-size:13px;color:var(--muted-foreground);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.sb-close{all:unset;cursor:pointer;display:grid;place-items:center;width:30px;height:30px;margin-right:8px;border-radius:50%;color:var(--muted-foreground);}
.sb-close:hover{background:var(--accent);}
@keyframes sb-in{from{transform:translateY(-120%) scale(.96);opacity:0;}}
@media(prefers-reduced-motion:reduce){.sb-card{animation:none;}}
`;
function Home() {
	usePreferences();
	const auth = useAuth();
	const navigate = useNavigate();
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (auth.ready && (!auth.session || !auth.profile)) navigate({ to: "/auth" });
	}, [
		auth.ready,
		auth.session,
		auth.profile,
		navigate
	]);
	const p = auth.profile;
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background text-foreground",
		children: translate("Yüklənir…")
	});
	const upload = async (file) => {
		const sb = getSupabase();
		if (!sb) return;
		setUploading(true);
		setNotice("");
		try {
			if (!file.type.startsWith("image/")) throw new Error(translate("Yalnız şəkil faylı seçin."));
			if (file.size > 5242880) throw new Error(translate("Şəkil 5 MB-dan kiçik olmalıdır."));
			const path = `${p.id}/${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
			const { error } = await sb.storage.from("avatars").upload(path, file, {
				upsert: true,
				contentType: file.type
			});
			if (error) throw new Error(translate("Şəkil yüklənmədi."));
			const { data: signed } = await sb.storage.from("avatars").createSignedUrl(path, 31536e3);
			if (!signed?.signedUrl) throw new Error(translate("Şəkil yüklənmədi."));
			const { error: saved } = await sb.from("profiles").update({ photo_url: signed.signedUrl }).eq("id", p.id);
			if (saved) throw new Error(translate("Şəkil yadda saxlanılmadı."));
			await refreshProfile();
		} catch (error) {
			setNotice(error instanceof Error ? error.message : translate("Şəkil yüklənmədi."));
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: HOME_STYLES + HOME_STYLES_EXTRA + MOBILE_TOP_STYLES }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileHomeView, {
		profile: p,
		defaultPhoto: DEFAULT_PHOTO,
		uploading,
		notice,
		onPhoto: (file) => void upload(file),
		onJoin: () => void navigate({ to: "/game" }),
		onSignOut: () => void signOut()
	})] });
}
var BOTTLE_IMAGE = "data:image/webp;base64,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";
var banner = "data:image/webp;base64,UklGRixkAABXRUJQVlA4ICBkAABQAwKdASqYA4cBPpVGn0ulo6KvJPFqYeASiU3S17d3PsVO8RYhT0oZ+GGLmxxHu38awSiQf8LtbY59v/qf8j+6P+E+AjkHvC9Wffv2N/fvn9/qeJHy//T8zrnz/tf4n81/mN/zv/X/pvdl/Sf8t/5P87+//0D/0X+6f9D/Re6H/y/ul73f8J/5vUh/W/9b+3nu5f6/9p/eb/b/9h/6P87/0vkE/rv+u///Yt/571Jv6V/1f//69f70/EZ/Yv+v+7///97L//9n10V/kvmU+Y/djmPPdf5DMVfzHW4fm+s3tb+gGoj7Z/33Ct7r5k3u1mN/jefP77/s/YD4dv8Z6hX9G9JLwmfs2/bJkLJmD/2CsoJjNxfobXUKp0JDx4C74wUwVgtX4smh0RADMbkBV0ept7CEpGYtfPV0/z1IlleqiS9Bqv3n1EAU+G1phZRGkRsRdIwaFan+DdZ/6Iwb0pqIYIouP9e2xi5nZdVcygylsb1t2QJL1c4C4qEztj8A/dYXG+BCvFNNzqkmd0GsXZ0Lw7+gXW8V+uTSroOlZoO6/qxqIdqaOR0hDVl2fqNYZgHZqJ2YZWu/NOxXkIl/io54Z0nlpnuxOP4/L6TdWtgZfG+hs8WiZHCdBE2ZcJaeW9jY8ANdWt6UO19DUAnlO3CnNS1Uqkflr15VXJe8HVC0YB8I05Yxf2v0WXfXz0EMbgJMOus6gbkqDAmYCl2tAAfelczBei1iq+aG2TShwrvh08t51EZATvPjcTpeUS+hK5d2XpLP34cO3gmn2dPlY6dOLiYG3XmD+l/4AhfZy1cgy+JrRWJJXpkbOMUfY6o5JnlG6zZGjx3t3sfmxaLWtFVqmrfpYIJkcl8zYUawaHtgVOf8Es7kSgsHHc/eqEFEhNIuyWHcKdXd2qYIUIx5ZV20oSE36PipPABiF2tBfe2pppm1OeIm2EuRZcCTjPoPH8fLQTwmRikQMrtaSXZ/L6S4WJW8fxQbiq0WqDYbbjK1AGMxQLGN1TGhgDCC0TF70XgsFJpdZYXS/3RInFSgTbpDow2Y/kjn3olRO1++6Gh7zqaMDDYgWNyNERc8FDPownKiZeyxnRKB04qbsN+JYc53I5VC33Gafm5DZnqKJAsPWCNvYRZfpOx8/AIXY/0VzxVXzMPtw/8/DVntYWB6hdSn8fPNKpOq0/1H2CJe+LHwT8fAs95VlOqEvjnYG18/zR/U2H3a3Dy4wdFnE1JVsL+IfJxb8E+Pt0iORal0rQNaXrknbh6GMeTzx+H5xzIe6yO5s1RWpAbMQtVZ/WRTMqNJlZ5mBYhYPGPj2WuosLLGwo5jNpgZRq6n1vMrlj+yX6v4Rwe2Yo1+4lOoo6AC7EGvz828edgtuFqcMMt+AR0TZH9zDabKSKsiC7iA/EFkMqSaVZG9L8CyLNskGSeihAX7xVuWUlru74IlayhgxI5j0i3TBP+/wdo7Ps1c2XrQLtLhrCysAylNBDP/+aW9soZCvrBK3XWukJ5ii69IOkpW7KijICYiLjjJLuZW+WrcwDj3SGbw64pNuud25XUUifh0HtwEIjiZxihb3fNLHw/hkINQ05fRI8UW52jemr/EAE9OhESm1VzGvb1M5WfLPvP8oUjOj4aRhiU3mzm8/FBqo/XLDo226AH9wATQGtG52gzw+fzNT6qqZQVur2anYm7A3rXTWZ8K4dIi4NCXaW6aLF+Ezu5jR83Ypv8ErLbSW4/4LuSuk/saVMjJhJdf5VwjJhJdS2xlJiKMmT/luv4D8ZxF1r/5BFY4aKe45RLedyEyfvcB+Zxw0ZPTGPsaUU+XzL8H+M7lJve8QQdzCirMDtRt2fa0EMYf6SGULTWK9SA1cVY6SQLIBKmvsbBC2wJZHQSJJDE82Is5YBmiyYmFHpVnBy8iu6lijMKKt/q0/K0UqfCT6Or/65JtnHNe2I9ggHaXdAMlPD4na5qBssb3uUeOVdx09muOnRnm+c3dKNUg33CHgb1byWM+4rHnwuF/btNzgNJXGgKUJoq3RoGl1a97I2rVHpqW29WxhByEhApl2pvpu84aBMpniJQm+lkl2BOUektSKv0XdnzE8si1rlPa+D4qJS56l4kFGXt4YM2G1y3bmd5ygmvtdNaO+0AU6+VHgWLta8yzjc7e7pbI8WbavA0bGOqE2iGrwOeZmBhviPMgtAd9bLpQmuJFeooXJZe5f4ZI+46QG3pO3vJplD3Zsi9IOK5OKaKfc8tW/f+L/OvwnqjMvQgfBLiXgMabKem4PAvv1gTvX4Xs8pw0xP2a2MecLtLA5zTRjxg/tNrLjlIyneZvy4If4VE1wL4kkjKggUwEuq0O1UWkTr+rzGCRVTwvB9i1WF1RRSURtgSp4LcpxX/J8WLTBcfMx9JRNTQRNdbdA0dyuiz7lGBR4oTyoPtlFJRec50HQexMfzxPsN5sH/xruAd3g6MU8Ze91Ok65w2Rn4aFWCSkvHt+t22ka0hUM6O9mO+TLYPhXy9Xsq8iacMqcLfHfZR6sZ6e8kuBcvQEgkM/P+g734knHgLi3WNpwEEBZ+Cnkzot2t5injMi7M9V1AE+xLZcRG8elY5Th4GJGunwfhtsmlvFJyfGsmnU57IGhv1pbJ1tMTQr05A21u43yj3N87UL3EUlNC8aUFAkAz5QaGPpHWEWPhFj+LVbiw2CIU+80EY8s1bL8OD4V5T7yfoy171ztDhZTnqPkyc/jDZgXaqWIpCUU0tZmmPWCUoAFjCkRmcq+tBlrHcMHw+a2snSVDawKZ/Z/QuMNOkUycUvIrqSI4it3PDrLbfHiscz0X1JZxglazzK+QUEaboqvC5N25m07huqFhxxSmPC5igk6tWBPf2QukOU3eGpMd3sF6IUQufqiCfoN1zUOPU0DD/Cs7R9L4zL36Oo2Cx4SjBtE1HtM4pupLCcoMnF/9MXxRwgfTKBcgwdNSarzEVR0GiTHHbdyDf6Y7wPSK4FmNc5bpgFsOwdvdUS7UBIK6Qi9w6qtv+aBcHKEK8OkVHBKR8U7qulwdbODAiA5gQc/yLm4XmjaHzOyolCQhOVoPl7wpKKVzsVyyIKeLcdvADfxLJ93eOQomWClXLbQBZX2hUY6+HthNnIJagpLV9v1uwPrxGkwwboPSrG0BA60ODZlM/f1CxEwzfCqD4AByndU5v/hovOXBfhzoT6qrUuDsANAj5cidIBI+KRmj1mbs1tjtaiN/5Po5i+R7CtUcuXFOTL3TfxI/MdRXF/HHcQURMjreON/204va9tc/rtH8TRD8H2J3DwHPZZzWxb/5MEVePwWUgX3HO230c/4bvi9M9oDYtHkE95quCJKk8LB+8oA8R8nWeppqMNf8HFo5EnZU4n1YWSue7Q3Ae9/gqkFEaiuQ20l49CSUxBcrxKB789eB6tw3YTPk6g8UEUpkpEFAAxd5oWC51AGdE9Ake9IDv+mydiCOy0U3kb5rDUK5+7ZDvWxj5BD/VQVW9mIEqJWV9Q95tmoYzaPqn52VBy6Z2UV8mZW1CIt7xphxTrUwgg9ASuyKlKMuqLP7lQn89IomHd+4aNpjG2SYUY870I0TNVoaZOZxBzOcK64MMX+B5+nLkFfMMkbmU7V5X82SBqWH95W7vJvYq2DsuZmoxq6QV3okw8q+Zb6tPAaIRwUYP7Mw8Tm0QBnGkPUaHsxMUbA6TCxYeT6NUUqnEWZ03bRrc4bb6PxfJPNp9OcLZ/1e/Bqze/hWQqf9xWs5nyJdr7dXyWIJom2dUfzWIgNJJhDl/Nz7dZu8q3r6IxySVc0TG+k9+mgzBgpD49AW60AlgMSrAeD2s7e0+BSivzWNpBsgbx+HsQMq7lYGgmCOPjec8ZiJuRNhjWqGRu2seOXzrr9aqlF01cL8HwH2M9oA5FFoZXikl4+ZspMyfQNBk0s2mnY2uJZ7sEXDfqLNzhgMChl/+2b3fBv7ztJKU4MB2LJ92QMo5FeHlVYl5hPGEHSqmmPyXkS7reKWm328F0xrRIpNqF8I/aag3H83MDxBaNwJE06WzSaXzLGu3XhTOyrALFHzlHaP3q9qGFEwj8sdUZ4ml1vvd5qKkTXLEAJeNUA1O+2xab/4RGasQBjrDZKsKgMY4w7rhIy5Zvun2YISylLzwMIDsftbzINI9kcP5jL03fST3UfMf5JjSTuZT7PvmVL3ewKl5Y/LSG3PVwrhq7IsgqGaiHdotdrvbk5OYr9SVUQrov69M4b90U/lDpbH2F0ff6q/iG18+sJi16UGyK2ZXeN44RfL23E6YE7DA2v5oWKiOj5nF70QyLuaTugQoGjprJ1/4QCQfKSsNNMmXhamkgGYeJCw1EhJSg9iR1cYYih3rTIp8/3NI/0cZzhlYo4nm0Wtne2jiH/eC1FnWPzAn7f+5kzaAPrpem+jH7Sabz4lYaaPZmXdizhM2XSYkkprsNin6R12KFKSxxqM744cNRAxGupETmOYLKYWK+4hHaTc5zt8ZL0HogR/Ntmni5IllEGA9PuVXQKX4b1unPZB45t6IrLShePSB11EAvDZoUZOyvaIaPLWLScv7C57M5iGBEd+b0iwnoNPKoHbD7ENfRpslhH2joR9xm4ybtw/5V1AZGajUfgYnQ8oBvEmv7eeMibvBirf/O6LFML0LSzQJ1zJjp+SixKyUKXUqq29ZM+e4ol0ZogoQCgR16vXxWxsn6n7lspHXKL9bo4hU6/W9L8oykrJk7w92+7UfRzlKsWebPcIZ0RPKcd42B2mtiIEy16AlrIGyqOGUQ6w4q6apktc+RuSPeKeMwb0OuZ+r+N341cgZr96Nj7jRGtrGUKFvHE4uGwBtNetJ4i2TPYba9dn8N1k65MtZZ4uBTTp7tq//zkUbhLkbGmgdPzDNJOyq4Ub0CujNuaZ0kPks28ltFQ0XmigfJzsk3mAs75200H70jO7YFQPCTEoYQ1ZDgvhN1fJuwN//PfaPRBQlJDIq6XLsIf9S++xDqhI/KWA44deQ1uYdH+PoTzMNwclQPyqRLsWboalnm6PYyVve5dhWG2mE3LwvqCpYH4QoLSARdrDFSES35oJ6IDsYdj/+PISShVg3SJQh/9cG/ytEBd5EvKxxsBXyHWzj6mZLL6+5982/TY2/DJNdWz2/Jva/MppDbIVD/GzEFdK8hr9ixJjL+p94C5n2s2QD8oM0PpwaD1xlhDQFI2fU54oGZn+6SpS4jaggoX9F9L/1DUWK5YQ3VzpoBVjMTb2rIZgxSdhMuXKuZ7onoGmfA5pJQPZWUhjQHtdh7IEqbBmplCFHA2BGyTFrKlCl4AzVqzb3kQ6C4J6s5ZYgwZEOGAdEIExkSK4Lj+VXqvTLFWeTDWFJ7Ap+f1wcSfrUY88RF9AbIJ7ESzYlR/MNFzPHPkFwQfqYK/+H3//1ILa5TOFu/VrBC2daQPJRw6MHjSg1bYESMp3alJECXAQKc0bbUnIZxfz3xH4GUb8RwYLsKUQbwIum2bIzj/jok9/xO/O/QqbIIEqreLt2SNBO7UbhfjgAA/uAi/8UfNnIW0nTGQUNW4/A44svzX6ITW4e3FuvpECV3W1ontfV7Y0VjADA/3M2ucXfJ4eoUlC0b72STZ3n8zIOCbtYTHydh49VypWiAWrg/V0VWbDnVLZk6AbqN7cA9zjWnkP7lU92fJBuymP4haVKYafPJC8RbWqM7RzdNZLh+Tbczv412/NfeuMAoyWbG9sEextcl5xokAqV0N/U5ofDIl6J38JnEglL4+quQHcfYOBgKjqXeQGpeTiDWtDg+zP/QY3pu1sSiPdfSFqZwg5kO5eXz9DUwLQuATT1ywR+JakvBKkzBlc9YUUmFKMV7i9XOJ8qnFB44rrxwLc8CUUH3G0tsr/+HaO5G0i51Cl5ikYALFkHbgzg3kOc1/Rq3wuEtC46lqy3ABdlphsAjhikAQMDRLkIRF0cAy40TFBEkAr117JIABGqft9p3y1XHMwRPBrthw+m1obK5fQ3AF8YtuU2EJurGfFKQXTyTYWEu9IH0bHA5t0CVdTK6eOHdIBUEybakYVzqy3ZT6rwf8g5tLhvaEbqdIAA0R2Hr88pgQN0068gAaeyZfpfNU28b6JvbeHegkl/PCatC+Jecj62kmfdPYem1lb2lOF2y2w0q7CNK+OO+OvVupVL9/MKuS3GqOahEb+elCEy3Hv/zur/prW6eEDJWduD03t3QRSYjR+90L8/IHQDDUTaQL1+s/AgiVErc5HRvlS4kUE95Pnz7qDPt2PCVdRmoV7WbYAppNe5XJi/+XDPL7Vq43BYIl6bKsxRY+AqyDVyedtv8vjEAA5YMGYWJ7Gv8WwVRov5yphkanpnFE2/S0MptV8YA8Ojx0kE2erMiIAhx+JHr+DaxzwKy0dnXxHZ/zN6FuuxiU7bf4zWzvqTqgn3PL9C/D+0Hei+LY6feHhh5WpxL03QAJMcpSTbu/iuN/UuNZNNxar4NxyCdsUgrVeawgBAfZxgUpL9aRBB7cCm6v23klE1oy2sgVJu1jcjhBuCOPW0RLgTzNKqUmFpmbeDToYno5v4A3mAjx2jDafM1Iihu4wmyRu6/QFzeJVfoWi/SnV33b2vRrion/nB5A3ykLWM07awKInrDLYND3y9+sumynS7Ve3KnvbzdyfkXcfc0GzQjKJprKSCiWTaiM6rS48zsxnAWOk3G9gefKiTyjfrkUgnHmzu0OQOadTMFl5Emxwufx1mIvHLnWmDlJ2291CmNbgu6+B7V/DdRfTHljFhmP91NivGN3QT1hWEummAmbMwQ4/2X3qii9Op/vMlH1EDBBkxYsTQjdJCC4N8YwYVsZXzRQsiob++6puRfDKhTqNRXGR10MDdG8UeFw/bX54fGN0Qg4fA1qD7lwfQJ/62Oj+UKnYUOCrafwmK/wPolF503I0acV6yA8+GsyzU7xSfUySCZUMDjqkI2gcPWX1kz7Fh2QDdQqIp4q6pi4j5y60HMkfo58Dx1a1/aYM55H5+CmzvxaOF8OBwOSIfcwuQgFcgSCwSxgFLMbrURvo7Qb0WhRa7jO/rmchlg/HKY+ndBFC3AuOZTksohPnkOcKnJq0GOlLr2PPDY5/Q4BV8nQv3RlsPDCM3fcnRRmewRIbTEBvwbscyiey3BOMEeBqSudwcMctZ1RJlaIceKP7jHTiVrWomxncxU35+2rmd1aJ8s6MkZeBFLBN+eQt2vrTgnt+3MNG1GVgg1Xa1pBpgXSsmcrkAW6kcqBT5bGnYRvkbAZ1RrrTqwGEW5zdntYI6K3PoIlgy/bP0gw1y4NUlKf4Riw0eSRh4DEtTtyBgNtwKKtNGz4TNMWjy/0rHY7MAssxP54jdBpchEoKiDForyJ9Yn/B2HOy/L2HHpDlG/Ny7Wl2oyN1d3YgLb8nLwZjP3b0zopoWDcrE2sfJDUoHwADz2l4p0lTzNYHB11Zj8+5Q4n8FAprN1QPIDopBdF4cLxmlWfAlgdhdYCPUPsfTmY+xtLuurEakffzCu4K6J1N1cWi6HM3yFjAc29NBIw7C1smry/FdhXykBxAR5LivwGzpbGcpFMSA/kCDpsQFaByLCWhSTN4/Po4JWvhF3Mp79+nGyj/oQvMujz/mrMGga7Xd3Jel7DDq3uyxIDEyJ0ojopI3mMS5mDLuRrqbG41p2uTUNl6kJSt7vMWAHQnwCB1aoo/4Pz7iouQpLmurvlelcgbej6bCyGNA/rNmlltHrEaGKf7YWUlyw0iB6eEjF/IVm7pyuOyecyisPm80+PaDDryRLTwzZzKq0LhCCmohZ22L9rvwViXiutTQej2W7iPFlsxOUDGO8FB4VDvt0YD/mzgL45BejNhk9sxT5CbXouWtmwI4iKKHGcd2h/mNKltoMbN5Ogx8K2USDt3zHfeCm7IfV/8+tJdFBBc/EYTmsEuBoXsLzZ2gWMeDiR8ZYkydV6C2MPOHXjR+N/qcFeot1Z8CPJWDV9387NdFhwv6pa7lredf9QyuutFKG4oqXUaWGzdsb74L6vVa31QMUHcFgsQjWeupddRyhtE2oxJUa4ICS5IUkNCWtFOh8g9NwpfcWraF5qHpXDqBywuwUoqEmMXSH/9+pBG/QElC7PMyYTF0nJm8y6v7Ccona/CPJnDPruGaf8sA7HkpUeTs+T3EBPjIJ+OULR+dBRIn70e6xrR//D3blhqzz1NOjBcLIJgnFJ/SwRiPU0TYBXHo+ZZ61/ayF+AkEOW9IevpagBPZYbkIKb2/VD3bcmNdhPL1O9MyM9msafk1j1oauIqkD1D5zkoMYPLdWr8ScbjrCqHmtthl2BO/gXdp3o8lDdciuByW7JR+2xsto2hCKu55HozVfIf2lAewzBcKfCioVh6SMXVD9Jw4lakRSzBKKDww+CZ6H6KfXX4ZmIa6zS3bC6o7wLsjKkSJbKSsAgzfq+pVzCl3+2oL3CTuQKKvTXWpjecqv8yWNFoO115tLKyrb3P+sT10YwQFtIExfJfmbHh3GlGqywbAU2AORubB/8Hse+wY5uQFYAAzqtlotIbx2mrRSVIzh4xHj0GCh7ARFVvtN+KNN9manl3Fb9W5lltGUm1qKyYRG5fw308xil34A2khoEvLlLk+9xhr5FErLI9Wmz1GpJqqSNxIC13ea5RJeQFMDoK96TP9U6BDxGIaIe/SyOotlpDqqCB+XsxGaIfJ2mxh+6oXCcYr7xPYTokF1YWHRBJhIm/HJlY6A7sgnOom5tVA/1ThmevaLBxhh5e8soTZgSLr6BYyin69vnMvLXzwKSxH5vjKUOG1c/j8r9FcUhXM/iJ31dgH3Lpjtt88mk5B+4AJsGVr4iHx7pxySi9MZnDx9c8qgtSnr6oD9XxG4nCg+m5idAQEP6UPK2ORJuzLREM9MD2wFmWEF6ngm9vg+VpfgBZo0dgKWwhUw5+YFDnQkSQTIs3d7r2czg0yRXEMRhfxmlw1E+UI7/7hUozQWVk2OlJxqzSbtbzfzFgVZH4JgCDMZLBrqzaz6zoEACEL5p93gPs3enVd10tATwsFDWdQdkJ00wZJYXxhaoHlOcmHQiFhsCRLihagbB9Qnfu8Y2AhDNchkqgswZa1amm0U2a8R8wr02/rI6CFJ8zQ+qvT/xFuOtOeb+lh8vpwOiaNJ5kha98kwrF4mKFFrozCKZXWaX/57PeC8D9/JCW3XBWgVFOxrRr7lJNo7L7EkcIgCFNlljXuHNisxJH3SMF6rT1OEJRmyrbDBI9k6W8fMAf4FWQfOwjwBBIJB7RUpRAU5jh2D7GhLlEG3P2reairSUCE/CsmT3CDjlO8H9DFE2KGH2aO+OSRrWZGx4fszrunFbzrtimuGTmdwX+6VJ17CcEPX18JzHAINUfHzpDRYbDCkjE/dwsNlF/WqdfwcS1hN4z32oJWStdmU2GweoE3MNg/iQ+/LwNIv3pgbxqIlb9qcasdLQg3ViaBCdSZe85gTfI8b7c1CQogaQtbKKguGFgc0afiJqdcLD0bCNMiZ1N2JKJZgPhUdubIqkb1gKUL9v1muhSkVJ0fU83IGVzcEjeisPpFAnPPlAbk9kYkLta/PoV6djV/gI2mQVwtmnu3abXopE6VXWsHUuEvWvfj7giEWq4LrrAo0YQvK3EVNUcZ3ZlvXexQS3Cn3pL/w8PElUjk1nXnc5t3By8NGcQehD2mG5NOs5htdwE0KfEY9GVRLNIB1JID81WIBuNaexnBEsDhlBBktQbfDQKWwpv0zzkPDR+wYDRtaB2LVupeNDdg91LBITzmbOF9ipkV2XiUwhvWQccySF6OD58j8EdsMCh1vhmC9oMWn8ed8QlUp2VuKAh8kmPSqKczbXaA06utI1mQlfaYKtuULU48KHOZ1PMEAGyVOXR68H+vPsfPM65X7HH/+zYsbAt2BLl0h/mGSYJE9waUNsUXKnwuA4Pnis29iWYnBWF3ZrwlJMpWvIAe8N3O48MJySEc6TLyERgQKYKTvQnf8xvWxStd4LSyFFioWVEB7C3eBjKiBH34yNIiskL/fk0wLyBTSCRxPs61uGTxC7R7ia6ZYRV8YMqUv9c3dg4UpYWnkbtFuIABUKbazM+DmQaJKYgQxYme2lmQEiSvWCHWZXxV3SlS6wx161s3o0yyf2g2sPSiCnTue8oGuvw2dlf29WYMZM0DvFNb8ev5xC2PEDteWZZqwM/P0QO7YZxn6Yw4A5caS9KlZ2TVnmSuipWyw/sF9+yoiofLWQuMIm/JTwf9jRMdY9FjtcOgSYQr37yTFY+Tvdz+dExnURXnEV5Lobx4ACNXaJqitCMujAFV9dWE3NhISH7C/mcTApwxm0uW28zDeU89Ya1o8GBiPS4fDhb2FuniEHlvCkSglqSWxH9VTf4RtBgDtMTpIxi1EYbqURsmsGUfvY6vxUrjrS9nCaVRp6Zxd80th+LZgf7K2+d4OZhMOCc0wPWosNuCj25ZhVNLUzNwGGHkANtQQ8map85aKKSe+YNboC2Nv6VADrRH7dKf0YdZMZx25n84bEirjBxNlUoTkbh++uJS+R7Rzxyb3TtmU4ceJTQViWxJfNK/apL9kYi5rLfocubzbRRnJd6JPhu/wFoc2MLQzZOQu8gb6gcsf8TbAOSnrEhWD3o+ZL8DqRQ9+KgGmlhIN3tY09D5OI77ueFQt0FvogTAuVPBySnX0EqgFhsyqbc7EBTnXF07Z2ygKT1h9HvHj4oUD5r37n7Fnp1Hn/bSaoBiQ5c/zH3v9bdcJYobXHRJUbKwDZe6YWvz9gYbZdmfPNXKAH3Q2c3p9aknWu7q3gKXpGdzEI5y4NSg0Q31uVlHXsBcNAmQ8LDVtY3haumkRGLJ9y5l0LKY69r9qCzozPY9APQrFoQJoKvLh9jH1Piqf2mL8/VabdiE3MB0M6yDLVzDnbhWwGlHQvnN4dj476FtM41EvQkkPE0RP/jQ1XTcrC0AyroItCcaVLWUfUlMvrdFFGkv1jIKZgvnIwOF4GWlnx3hqTicc4e2Wp+Sd06FgC207jULmhgIUCNPf8H+FQY8vvSzbpt47SQPl+vD+4ZOcpGM5tSK+pC+C/ityh5QvsVSwjs4dLJL4Kl3mNwM1aSXFCYA1gcrC5z97IKS54O5kbC/RfMhsfu7ScAuVwGdMJs4OtE62e0ZdwPmHABWp1rXD1/0e2e6YNOv6KeSc7nDsTIt4Gut7gscBAf3lvvDzxWYAT5Hx1Dv/xZy2ykTgkE/kD41CvK8tLiPN0m9GJqLDZfi5sRvtVSjaQujWNUbmv45k6xNnEpISwvpAExpP8iyRKQrNNnwj/tsbPEAWNE/ZXz5kQXqmf6BTxH2ElPLj5xxtfhfJT7GWVGNzlS5JTqU2gx8zwPWmF+PoyBrytky0INYHAyOWKNAYh3Qoj3XQ0VU5Jh/cIEcXEN3EV1faf5lzwDg5MkYsrDMABhnhnspsUapO/1N3eniKZLxfV/oc6xe2s9AtTlypljP8XKfQKCjPY9ziQsEiEvR1O4oHxILyqlhnQgb18vdVpdKR4I3iG6qjFHLkMjSww8grOXd9JxPNsYVKPsi5dgrN0Q+Oa/ETJnrZKGwdJcATYyc9xCBOETuYmeaa+GdVD3rgtOcEqvxqfS0bcySsZzZwpkQYi6D86fmykdQwg/fBHxpRcMe0DU1bIPMBhOHFTuWbBqu+2hKHtqOrsyCZAVyU7tt5n+TZBlzQniS8h9olDcVzoZIcM3GJABtTs9CTdYZBZtfPIoDqGO7rZqtHJsmzca65RZnhMd6i9OAh0+IG2tsD7FpvV7mrB52vmWkMvmqJmAi0u4qv9q3NGZTpn7LhUhczD3mP75PIEtFvZjtbKki2VHgRRVmiIRSwu6duaVGfFrTcORimTKVqGDvHyBv+LdNJ8LSnfh2X4nSl7QckMzFpLeGHVnS01+R+4+HHFi89rMekAUQVz6p256qHdwYQgvAzwC0Q6zb1xFfv9iuHEdkwcXI2/2GZEwYv0Mp0U6izEQxz8NDAgqdpiKUwf5h/1wLfmDi4fWAWryO8F/oCKuxahQMQw0QSznTtpjsKZxRdCgMezPZaKS8t9m8Zh4/pxUl6yrTB/Mln86H9E9Yk1C4p5A8fWhKDQXpoJ8GfRKLht42x+bfbXz9NTKb9GhU+r0Vce7ifwQ09t6G07vC6SzPcW+wgD5U/LkTKyKv6Ijve93WXR/klovI5mcZmy4DHV7K6ZWSkke8DA7JWnOOJdjaj6zkPlQdOh7nq5wqDjGMgzngjUIDc9ZAMaUgRUizXSG/fZ02XhkyLOlj5SYFTHEfAqU/d5etTl81gc7h095s5Gv5DprqCVjCy0kVNKJgKfVbMX58DcvfC6VuaAu07UwIk58PWu9sTz0vnq5WsNf4AhmbN1dc3fjaMiUU91l6sYfHcZ0JS71ZjcQhERDSY2gAR3OFueU0ERG6SE3az5cy2ipTY3zbqq1pYKzn8sIEqCmEX8jJjCT9JQyDeUNqCq9/Wpzl6vgwg0Vr6ACP7BSAm4bdXpa0ASU2Nq9i9j6aqI6psR1QwuQl5WPkW18LGxowl6WxYiAil1css/T+4oXGSsnB8MuGwW2K1b9/71XgWv+LaRTbNh8Zv8Hb7OoFcr/MpRRU9KsRgwYB7ln0SVTUA8hIKdICItW8VvXtZXpFpey2zIMZlPAFMgArMxEfLsJqPSCoM4VEH5VBqCBiMD9Wl8iqwJDMHpN28WNDOIrFecb6/9gVtZjrpa5ktbIUTRMSla7p+skzXrquX6XJLCjxp4wcCTX4xW6IYuk9S7QSpt1Ik6vGf3/8Dp+LzMBVaK/oqd4rNDglp2IVl3xQ9QW5zoBq+MobXoY/auikhKmhumHs5p1i/eIfwx2goRgaHt0QqknPpz9KrymgnPm9fMcoBm85DDwmzbIQ0ug37sUp8S0EouYC6cDi3YmKaPAzJgXULZKiBgxRrjLB3IBdpRj6CHVqfixh1H2wkTc73qxnLEdMszlkEItyfb4fgSxCQvJ52P3VDplAgDlo/zcGEHMvzhcKYluHcK5AnERbTSyAD0p0JUJgZrpveKBMDL10JcJrp6sJVu5nQ/JbuhqyLmb9X45cU9HUaTjQNaOUIbohFYBDstGbkIllHEy2aI7+0fZmABTLCJYJadR0/a449VfmALSdMcMmXzZMPEdOIlvzaBORyZn6wecIEbcS09TKoH87THYc9FZtyZAc18pQ8dFcriVEzRTZovWgtOE9PxQam1dj8VSctaG/KQyIyrp0o14cHSXdtZzJDuxU6ocb5nAG0z8RELQs395JiCLFoE38OK/H3bL+6bLL1RKeX8AFri0Wjbh5wlhqHnUaJy7ks/nSuMawoSnWFXDzU0e9DW73BWQkfLKwiySbQZA1oMF7MMNCfbAL8LxB/t2ZrJzuCvIMWBJRzW5Pq73gyhDlgkJd17meIazgPp+7Z8Mpkh/JVI4M5BlBl+xUfdfqe6yERVwBh6YOlW+mrt1G/Ak4GrWp2CHv8UI/ePooMCJc1TETzw9IDB29bQl6mjXvYho6e/x8GV3wlrWvoinh3Bttvii5ZyaMlrev231pncIyBDC6paz3pTsAlVGOBV/H4rZhyQ0G4Qbl1HhtqVWeZ6TDlqbymHcfk+BpyZ7vpNF85LzZA6P4zk/Xy7yCkSxJbqPiT547oKQEqRLFRiXZwQocIcvk6Ifd9JiiXE0kkqlaBGobb72hFAObjy5SP2sKrHr9Ia4gFuRNncRo/+DYaFD+4z3gF/JNr0zZ+Oz+YhXH3bGHiKQ1QL7yfayT0T5/gyZEwmk3AeHx4q6onVqV3oYSh/hDRO+H0YW0n+vJ808qktQY+WIvelWvGItrfIW/FjTAL5sKdHIpqRF27A8iKZQFYx9HFxL62BQe9Ay2dpX62jIgQyE1b1QSH4gUTDdvXgV9jkps1gnAvJz6yLLinJTVdY3w6YkB8cHoUuwseWnuk8Sc/TnWXHW5AYeQQIpu3MuoTc1Dzg8+xo511seyHoBLkCfb1CZJHQ7q2zGGbJaX/6XEsKq5VeTDRBqXj0gnbiAS4C5YUZKYJv7n86/jdt9EXSB0hYACYLbvpvaCmXFLJlivcWCbvfGzoILycMOQ1AAeJpptLb+lSkndjEazc3MVwNGsrpTmvY3CwzSdP5kx5s7p0RxjC1c2d2i/R4GdTG3kHwlxIxF7Guj49s3Psx9eH3CYvXIcCbykguFBjjK9OAicAjFg5IFs9FPDdPLeFsR1jFIyzWvX5kpDMS4zG2cTZp5S/z6/Ww8OYhkW+GgD65n0VTi3kDRmh0t1XudHAby7kJ/FV3rwQ0LWWIEy+LfE7Xg335z7/ZAAGFjbsWfXnr4XZl7hRyx80UvlN6IlJFktlQMc3GWu2t719v4V7RMXmcM2iJw6h5adBAN6hK8/eFWbX4HvRSADden86DR+/G5aox5QiDHwu5i45hvnF7LpwX332Ys0oXUpbB9JXvh4pdK6dArINoZnEQRDGpj4qFg5p7DomkLQg5DvkpSjANSgoR2XtXnzANzPHHVeMXAvYk9ybeRsI25BhrnUwvDG/6E+maJq43sT7917QF4TWBn7Jh2f1jHQuAduoC6jJuZiYGwbr4/Bz4lZjtlv1iPPdJuYUgwLfVzNbyxi7Gg8svrE7w/4K9GJ64a9Hp51qjKlrrZ7oX5Y3Wr5tiVSulNigtmGfN/bzfDTYw6C+MpWQ/QxM2ivoGjEYZPCmNuoBxvcfqe4rfcCxANcxsn1HVr7a/ynXqMggApCuugF+xEHqIk7mTO24v/yHbYo3D97SOhztDBKwPTyED61SzGBn5fxO+C6i6jx/QUw4iHgjQpGdmTPqS85kRgedzf0M+W/ytYxxpJBJRdGmluc09VQLJGGNrTi4m9uZo6+k8Ezb77hkY5zExTE+wlB8MGHC3nrCELtfmMgp6VcgOF6wStm/E/StxRxhz7oDQbCUCTG+NsxmaikwLmGaM7qQtZpVJWmzsG0rbUo0r6SC5U1lyf2Bw5oiXQDxPklMPeexi1s0EmjyzbtjCh3z3LKC4E/lbzTsDHaCOYruAjyZb9+96+gdj/uTPBDKb8FXTw6tnMe8T7CdpjB8xEk3Mq2xLH9dAk/YXkxIrueWH2F+HJh1TuKvrr96YMXyGX6XMmHe6+Y1CN0vsZ9QhqPEXFW/btbYGsNdhbJFsCq1P28KREweWOCM6BnrYh/aGdDRrgoIXk8fUU0dgCfRIHyjn0VDjtmFcCrH6CnjE/simMeAMGxHZqWUQHQghEBWsiU6CSGjn+hYtk5FWafcVD/WSyMBfh3tmKZSS564BacKCx81Sa7DrS64BXfl7xGwpccaU0FL9RlBolPNnjPxrret5HkTDyNumVafwoB7AvkXr7gNRMu/LxmgkUkbkh9U7pJqsffWThjoORZ5etVA/dOoWs/tMkCYRIx5G7yhnk2WFXDrGd2hIHvXk5CDoy2AB3Dk9u2vqAvCXyvPb1GyZDga4qnQzOM9Gm9PHRif2+eGgmIcmnXSEsrHfP9iG2ZJP7nmHCKe5r7IfgmqurPs+/1hQDn2cGveLTh7mUnEk8rACldOP6r7wIshqRRgaFjxdjf+FhQ5qSQkrn8YN/LCCcrFq6MHdXp7YO3EPk0xgweocU9TF4jeTaWRlCURbeEcUvENhfCoEd7XznT3ajDSC19uu33KKNDeSu65QWSskr3p/LECW8IPe+UlL9CGxBWm868hlhaau03CWFuzT+L3CtYBG4V+SuejL8LTo3yMgLCJt0+p5pABDzta+Thbcdnnw102pOpLYr50ZpUqE5l/6TNb1uHAEUK5X1zU1r5eq+n48ALHd37XAC3XGC7FkZYuRbYpkWjKo5qbDuM1ywltjG0X4JnxdZmbGn4a/E+ULWqYWK8MzCBNyHE2z/csvHWbRwucGFVQ7mcvnrnGNzzwII3NJ43Qlwff90Lzpo509xmg4Svyx8iLlYBa9hhPErANzsb7C7znnSMJYCB5ssonTmy/KzUg4NbzpGWjdv9IM1duXJQ+DeQRiIwD6QlaBS69kTmqCMLHvabmqEYqEqvrAR42TQmYkfNGXFxKVYEppfJahuUxapFoQptvtNm1lzTW1nSNGK4TjE7w+/LOyuKBjfVJBt29P0OyGWgmUIQUnMI5ba6QsxEukqqO07y8lvpnPckJWiZ1jvgyDApvpuvIBnLjzkVumU/Gu7edMhCHbdSemEvPYpxtWArkueuNk6oHEUy1Q0YRYSS/wYtJfRl5wKE2/PAYgC1AcC7e4t8y/ZnxAii/FJbcrrGItFDfhr2DIYVXTNjQDm4lWKmnCwj0n/vp6APwbNOVvYbbn+EPyJlA45wsHyScY+Ueh8ROdTNfeYnFMhIb4gRaKPCfYSar+SFWfMBH6wsrm8aJwY7pYNONZ+MOMykQeDJxVNxjpeeb9iOXwXjWDh+6gX2DYO2LfRisBw1z7UmLZZLyowgA45A6pba2ymYhYNUlvA25PNmsKhvW+kya7gIgFCsW6UXekczybeyQzXDV0tuu2VDkdjlyMusBiwnt7X7XXuKKoqbmEueIpbCfbeAqE7b6tucI4A6Tz2kyLEMGqKVBaZxODeXJdjpPGyyWrRQBzXZIBTLgdE0I9g/SMwT4IqwerPwN2V8jXKcd+3d2nXl8oto+94bE0L6OxqNu9NFiqoeznaDyE7v0x7+ciKS84sz9oN1xzW/rRusDdTbbv4LdHIjm172xrj8wGHoyYtmCh896z8pLdpRd09+WPGMLnzlWjlXsYvRLgZ+yss4mgHnvK5yHw4LG30XiJqB/eVpF5pyfv3gFEP7BZwI9NTRJ3jA5gIlX64a6iSlhFHE7r0/jZAK6nl7SIigGq08Mktw/eZmEbQdzGn80bi7kPOqA7grLCfDbTs3HYnn6HB1Y4fLM2phMdqcxGDTKYIX9hR/3q5t4gTSjFo/mrSbpFCx04EwURSITKq+ykxrCYpx1v+fgKmm30dIumzj1ShzqoYkyGjBjz5g8CEc2KHx4333SJ45LeVR/VCYPUhqVZp302R3cIkTrbmM+4aXJIKpP0AXQxHZaa7dJiek7VuYjCdPB/wksH6azH9nhEbB5Rg+28oBOhnYSVUwrbyrhp3/B19t/wX+OcJznr+Dle9WILgfP7OebcoA8TY1bj5D8jX+l96nCB0B4rpS3u26aPx3Aggf9S+uf5332RDlvQdZQKoEPJTKRxsejeWhW15W+va9WbAK6M1YuNRUsfMAAizMcAk5sHklscB3idZALjTg18XSnyaUj4eE8OCKLrVAOfSOlo/Tg/EgP05S2zl4O2i5EHxGKK88PaBxE9evYIw06n4WDMImnYpr9ZfXn07+lmw+2KxSQ1EhSW7spusgY7rY7/BGZwKIwpSRL22awULY/nRA2zRH65WHq35w9c64yx6IE1EZuDsGVEtnW3AdfIyaqJJ/BcLXnqVmuhuUs50JIl56GE2/MW5u7lWEsKSedAe0ZN4iC9L/PngR8NOcP2zNgBx7Q5C75XYxwzFSomzj761xFc/Ii45z2sO6+jTc6Z9bbMUebJK5tMhs8G2uX4akj26sf4813/UxTWSW/hb8VARCwQ5imJczcxS0NLFhpDG4dw3R7Yox7EMRMi4YuwQ7rGc8l44lyyIWDX7HTZh6NDtsGzdqv+6ffawWrRRLJdR6+tWh+Qt52ALopGRZOvaPJsE8Y7qHZqHwLlENJCoWjwxxoPezftCiVWcEPCILsb9pVEDc0slA7VMJMDoSk0sZANxS3abx/qaFd+fte5CeOV5rZBwvWZ1AJw57BAAfdPqEgzXaFKuLx9regGJL+pMqGXefXo5LC5yVXqGNTClE8dsFLCjZuGhujxK9VbUn4fKbjHFIbSEd9un1Dsn8MFarndBwiCCTtk9hL8HS3QlCA8EEWn5Aojd4K2GVd/rHfpqM+buO3rsymr12PrUxXrar/PxY/i721fKi/RWseNj3pIlox6fQYyEjQwM1Fz7ARlB6o+/Np3BqEXTDlNr/AxHELNsLhH/YGhWVId7R/gmtEU+WSV2Tm3jzWteRbMvQ/7sVxapagC2/47pgyZNu588GpAGVxgCv8r/f1VhBIpBojzGM7nusH/Yy0YMKLzDmdggwMypNxd9TmKNirbFlImgmxwEb+DX9vv22RtvgWXcjdXQ6HLdnL5jMM25GRYaq8QeJdQNeiqwcmCkV/OQJMULzESqu3TkQ3mhc3m+OvWdZ5BoFBaS1F/pjKhQpjas41kVOXo/cVXXlXrNgZ12XdXMcibKGYgfpOOurjV7dEh7bWVZCGJugCVe3vMjRSzcMBcwd1JGBJP3Fi15s8gPfrLT+BPint8XSZYE+v7n16YA9MSFAPj9e+uMErC+XTkOvxPEzhgkf1gyQujqJmvaDvCTPjapD4R9jXhwwcu/NvrrJeKmCDNPDX+fIkU46ZQwsGNQrfbne89bDWk9gk7iDUM2l6xGWv9v7E4yqMLz+eDacXoQTjTVv7yfoN50vIDjk/X5e8GHb9ErF66+JS5HMCSJOgfztCXBZLmk6AnEr4b/gXxqztYCLQa1knkfotiOJw/ok28WcZTOiFGN/JxQPruYhCyMZpldKQdM28vWM5Y0C+G4cuIC00gkUMmGHkUXq52mK6LYRjGpiBgIEM9tD0arA5dxfsIHZV394Vd0vR9Dvlsd6tb0dwf9NHFMqQBUldPT9JF2etvaTvvc3cB52NCSAfhzNY9ucjs+jKaD7RNOMVgk8kBdr6lhzS0pwabXLHj2EJwG3wUEK4v/NgUugrQAyDHOMqpSwgORmUA1iA02bPNp+RiZ/g06qtukzOk8x8zbeyhJaAVcp8tEMpSUZMvD9kctKIWgNF2tw6a4O/jRMzy33OgZ8GYjXguSgbD9ejw7An/SnBz+B8nXd/kJf0nnj6dbDRSLEeIzIGZvlbyqY8n14GPsKbnLH+WsU1Px1HJc5SAE/+mTucizDT5e/hEJRfC4034k2X5MXJ6/OfMk/wwBOABbZ4lLmQCug37qcue8WjRpq1hmeJ5Fwu7hmNtWDThhm90anJXh+tVG34V8ANbpSoRNF5jhkt0+sF/g8r9NAOYpoFksHjWgpTtMr7ZZQvbMQar2mcBF1hyYpSJP4MF3gUUvqk7ZvD61JmF3XwA8V80ZhQftkl1WYk+ZpHUK3Sa9M53Shs+zVTP5SnkK9On4syXC5/X+cX8sA3A1EQ/YjZyFaeVFWSaGgzpnSckUofxNbxz0PASvePA2owkbAlrDs5G4FT5oZfsv1p6yjE4UqWfWhnKXx4pcf+UjTlp2ldd+urg0IUFksoghzjJS2sCF0nV7zLamyJu3tmTslP6SPD9VHFFMnEpTlXBsFNIxeaQiCLRGrJpsV8LWovgI9YvEGxIWjbdap4bij7M3MmaL6yjEl7A9fbNd/XPVGbSVGycdKMjkbTU9kDLtQmjs4Yrml+RTBhsDcVLGM84HcowbnoY+h/f1KwyonRw01pf9T63+GKOO5GUSrJ0wdCfzVsHEYNZ5zj09q6+LXcmClhyGay0+3HjfCItDLuokC7u+/rC5ZfEfE1obkQZOkJV/flfsqiHMdYSlNGidBahMVf35/oO4nYycBQ15PLk0s4lFzRzFjlaRaTeC9/pdwrmDjopuqoW7SZcGYch9UWVoPZ3fUtEOOlXrtRTQeGCJDcOzlLDomxImCRAE5nI2IhPydHQcx6W0CBHWANa+Dh6Rhsz6z3NfI6093OEHdky1fE4fSdCELOC5cijt0t8VjbALcoXR7tHcrqYZuS2BD4Bo+JgHCUNSUBAKnesFUWyQPV2rbfJn4/ndU5x01+uOytvGgrJBOXrvce2KcTii8xViIE9ulTZQUSltFnNABP/waYcthiQj1bj1tsmWOcX9z9CKZw5CMsvwOe5Vi/XdUgmKFWp6WHfZ5oeIYBPEr3KQixadok1ZFgU/WdiNvuS6SNXdCtblE6l/rKJJZmHJSLsU2R2bSve5eoHgoRSB+URPMk6ZkipoROi3Ts2mJVuzSLk5Yf1HRrSPR1lIwl53Ne4kC/hV11IR9o+8iZPZN3rSPqelxHsvg9nnSHXTFTXy8QHoTQXxNU8mG/JH4Rkfg8yJP/UqJT2wpQo6P8Ry/8l7uKXGKRCPr7ZQaf0NuGjZCRPdG/NnIp/VvDsEbTZVAWPmtO4KtCjUrs6yHCI5g2/oHSrvCysmHNDSt4r0X6e4GZ4GK9fTjuZYZRFqPu63NibjBFGz2vU2IaO/AAj/AuOHdG+XjWWA66xN2i4IyQS/kk11/FjT2MjQ8K+T0KxbDnmg++d04sCNywt6v76ZMr00uHxd6pwE2ZosNDpoKB78QHHDrxPdXOl6yFTNM29H4GUi1Gx/93ZvbrUE9Sog+s9X/AHjDm82Hxvi9HbUthhQpxC+uhy9Tv+vRUWWeQfY6+5b+QOru+A/uLfbcW0gGYuOVxRFHEN2i5oiBfTO827Y6MKr0NqulY8TDRcSaQJ4JdcwY7rhpfo3OiYaLJpnFQgwJbZVMVSjRc3l9zyvIWNuEubnHli3YqIDS274fFpt5YbPwEOkDQRaFwj/5NaMNmdrsTCReAHHk4RBOtdoJB8tg97FfwCj/X5aYexhiPEl6VPlopceFmcQW47yi9JFEthCPonyJ7v7vWxB2yeF9i+3rAhVhx7ECRFuJVjqjM9GaX6Ud2+uJajjqaXVC3Tlg1KRnEJmb0OXReGf8PBi3juY5UvDDIeEIWw1hyQKuTTBHlFpZMk80q1DLp4gZkc+OfaDwY6SjrA0IZ6K2sx7/qZ49iCThubX3kUgrouRqwgUW5EjtpJ4p+QLNOMQHplZWP93npYz+ixly/sbUHr/jBslqIIpxC3G0x/ALFPJWsV0j7wRC4c26pNiXCmY2o0Exy/TFFyB2XOzygiJlS/ILxFtFktkmUQ3ZAwBB+XUW5oa/zamoZRrni5WvmdFP+uZiJsUVdeEkbpjdGr9GvOC5hACeOt4+SicXt0iex4Cbgpg63vgaiPtp1u5vCB2ZPbpNq8cfUvpwnWIfp2s37A4fwX/ODs4K12dTRfaqFrVrnIpeFIxnwVyAx1GSM70zKkl8zye1bJrqNejcPYXR2tDIQFxiLXceAVPSIl9mUMJCY3blvEIdGbaflOyyuITgoVjXtd8J1wb+9sL+UpL7GN5HKDpFcN5tEJSoHmumc9Rkykb2RAeu42dgYwUuliQsN476JRtu6XJBIhHdx6m/GRVgQ5BbM81VQhLjzsRLGWiEs+VvgsNUVjfl426S7QzU+sAHkoyLk6iIqb0xJfhFZhn8FATmlGGcBAiIzG1lLaB9l8DpszetH9kya4Yn48p+rv1ba2t6uiwn+pMWAdbd/6daIqrHotBIO22D5S9j8KYtVxTJeXmXpxyrID0eufpo4N7yWj14mFMIh71O9Y6nycU8C7TDHX9kNUgDG3Yy3iY6eDVeInajFJABj7T8Z+lDvV6mrNgUClZroYcTWed/8URjHtR0DVf/uNXdddGXFsJw5Zcb6aQdg7p0cZetkgBQAX5ojYgcJ+qKlrq+3i2cgFBadPy2XJMgVQnM76BoMq89LnJhwPGv/WPZTdxPN9A0/jEjt1rWlApon3Rc9fy2ox9PdMTiaxHavSIXq1s1zpq56YATwihOa/QqZzB/7oN7A3wkWyFK+LGhg4OYDQba1MvzWVvl/KDEda1r/qR82F6QL52X2dFQYIKmraOpwb73tSpM/r/6Lhqh9dKRE5gXTzk3mEww5MFUG9J/Bcb8tqk6EK7Vj1psgCodzIjqs2a8k/B1CkhyknTSojizpIxtEWsdq9GzDv14F10uaAD6g810PCK8gwtbRaSvi9AGn6PKEgCyLMtVIqsrMnBHzhIBDF1zUlOoq7KxH3R+wvVQnBONg0qKdK3BSZoVvCBYrMYDQRf/D8ETOQEgE3hE0dqj1Qv9V27BW8Js90eeTtzFSSYXKAZridBnOZ/M8wTwewVBfPlVmxeCqq/sM21mBnb5d768FYc47fZeuM8fd6isD5sC0H6l4JNQPYhnRCIuy+B9jltWjEelyuHxsyfXgrohMROxk36jAotRwo+2pL5Zzlrd/OyOpMQXvLvt/rv9Rwl6+FlXo2znWfFrjjseCXZnobMebxH+EBfrttRdd0O5hDyteNGcOgsyvJVlO7sc7eJO/+xaQFGEA+FLyP5KuP9ir3MIzzelSbZHMUx72xKjWBUjM+ohWscZ0CS4IX0EPh+Bvi0LkVqWorcRo5X36r2t0h6yypMjEgPaQuF4gKAlg9KJZUmQNU0UrWWSdNxmmW8os5AiX98LbrBKS49gfKrlek3OtBcnnXKSnVpdeodP0eNkxuyC9J2omq+EVxzCKz87sS+biMYScK8grHM4ZUKwApxp/WDlwiNJ8aQTer0twGFmuso5KVC3PzsGGec62oqkShF9hqgSun2/L1MTLFSyG0/pufV+Dj/1eNUvF7NG9UEqr0eblU2/bNG0qZ/ZeLXtcQS2ymitq8BIeLTJ0bJmWejq7RaqR3QEHG5yTwiCpJuY1wAgBB0wnau79OG3xkfJ6X9DzxKVu59vuQIMoRa9vzRn3a01Vc2CkY2/erg2Dmfz0gXBqn7eLkCw9Y2prZHdsCLpdmSJ5l6xJd9ajXMk0E0Ou60u2V7dhRI71mn/05HfJ0iy46UtcvnT7feD6AnkxacSjak6GCXG1NUxwcjbQDpLjkkaTxXPFlJTSiFJjJ/Lg/OgA9tUnoQcH0EUvD3CVwuTYlE06iQidN+YhaioQj6eNxAN314GElL5zjuplFi3CPWWu/3uSs7e7OZWDap1CJs7ZsRfddGlIHjRAJoCsQJ2TaSCIGq7AicVFzh75/wHxNXr3+OI6/qmW7AHU9nFQovRFmPrc7qYwPTZIGawnOkrStZyQvSgezYagSZfbFeJ+7pph9MCKdvEVt/Ie18LwaXZc8J3QoRkMysqWTiZb+WdOZXzb7nh1Zxtt7oqsGv+N2OriO/zWR1UmHzglFDqz9JLDQtfrfjM+FDEhY59ceG+YCQTCz1ZrP0J9IjonmLwM/b34SKkSXdwMKqHTeaXa0miRw5sTOY1JkC8SseQPPrfYuaFaxkYUUEIFuYTwbb4pvUkGJozAueolHQ6usnFYJ4fQpz8ZaBC6bxiJwOFkwi3mQXhYlNM0WxSf2+CpBhl1y6GcLi1r7rH60Ur/IR4xO48nN2/XsIGXI4aS92p9frTK2XgLTipdHPOw/N7UR+6Q4YZPqgzsvIVyaa3RuBH8PUSzqoT46oxtxdhcBZOcP/eVbC9NOUdnw1alTOZTp9rq93CDF2doKbuL+ysyxPznJlaQuczC6nn+Fmn3uMiW49EAlJs6QZMVDCPFni0iDGV3uh5n1pv1Ax4kTmmq03bEZUQHLXOMEx/Ol35GToPKpvWNCXMiaClkkZZJJnvB5XtFs28UdFeCXJZTVmUHeWruPofn17jYrt/JGWM+L7kbg6a+xfr8MlRM/Vi0+svKv0/k0vYdhuSr79Qqxxi8lO6PU6gVe7LjH2PufRI0NOl6RCHq0l9LLWxJIDDsw9Wufwl0RCLdc2cFHrjjlc0kV2fWdSPbY8OsfGAXAEPN5hmKPsIpCT0wkBKsLf2QKNEqoQ1sEF2tDttLybCy2z27qp0zxVj2d6HtwPumAiLA4ITikiGCNByXR2HUVMVNSBXBcYCq9HQx8xXjXcqLPVqrfEBOOyf5a2P9/4rXvtwp1wuwOnXpDTgC7ZPGcNTeVSByisgpucRKIPPLXxkcSnxDuO/bbCdkMTlDvDKG7BFHon0tAdOtQXVMRD35oMY7ijmPee4ZdwrN58p9kBXMAS72ijQOyI00pj2JN64nt6TjNx4AVkZdCyQb4E5l/WQk5GAVqEkYm04UfniD1eQbT3Dvt1TmMaJbih5/c3Qz4+TkmJ/83v4S7Xoi1XXzovqN2khicLNmkT9qgiGF5yOwGaxxXpHwpsR0rHMLUR9fK3hdR/Q8taptUGwJq+X9DkCNOm0tG/uE4mvdj8ZOLv9BW2ADwTLK/WxrVBQamsWnj4w4FVcuGW+MfAyJYELNK0BGqCe3XbkZtVBD4NRSBJgGjmS3IbnCtfmqMNuIxebJyyBLon2EL7HHdTpZ99fUaD4rAohhEc3oBlfzwa5AR6hVIlw/nrswa95JZ9clgkBJjY0Jmx1999jODi347+3AgFSe52cmn1D1QB86c51goic8nY0NV2zjBqTgopRdO7MmilZrUeeJokrhU5jz03fnYxy0w7XmKVzyuYb0Cu1vnh5KMt4gGQ6zYdwV+rA8WmemxBOAsTQDBVO6Q7T8i0jGnh+5iv0KYx+SoTI9KFuhMfa1xbKMCmWhZMWuACLrXR3Y3MTMct8Mnv36K8xcfMI7gp8cLA44oCLMBtFwUhwGJTSTu4xgumnWPQKwOKDE9RClZNz3g4nD39NMUugsfLe4gPS+y7eslOWpvZagWTfA8pn8UthRu+X0kT5oPq8J45HsCKFd3VDsPqRUx/0H49c9Y/7UFFflCyYvmhKYb6OS+vq7BepIHyUyXg5SxR3i6kfZUWbN3YVntTo26kLuM+HN52iejYTP5CA0npV7dqTVcQYvsj28n4l89QoV3HaXDaqe/9/GDEF7k3NMnERCdY2P7wssZqbyKHKo2xopbDkOZm7XHV65+6eFz91K1v2ZAFfUj4wVyhV7dTWWhD7hDCv5CYSiwIFTbn1ZlO2UIU5p7VPDgVHv287A0K9Z5COlzrpTPziNcshO24w31pMLkrrrqgnSt+OwQdZzqLFTx/x9zQzz4jDHjnS2Nk/JI0FH0gd4PtOdHseu17uk3/r8alPDWNu3mlEwUCSyYf2u3Fu/bsRiXeO4rkoP9jJt2r4CJC1onQjMP8/Agr2c06txwCcnTsfxGNq+yM84v1Fp2ZdsFy7iMuodd6GTEDMQXK2HN+I0WnN/eO3UlCoNlExcX550XQXcFpMq5XqBRsfmVYP2riKpRmfFBmqvOegGQT8dKqfwl34v9+PdU5i58QW/4xVu27R4ZfiYsDB6uPpnT5KuDyJsjRM4Y5jfvgQI/kjGJ7+sMm4wJFYCS3Pumu9U/0QwO9Cap1iGSzUi3K2BkWEM0wRGnMhgAhW9Kc3Xo0zmv5VfPpexozPTK4T0xhgmnnWo2WwGgqdwatVY9FNrxUhR2eUD60ulXJlv9JOC5AOdPTQyECU9rsxE/x5awmsxK3dvO4PUTCZlC6iCTKtuqsNI7tATM5q8k8/NXz9wA82ekCH4xYFi+7aY14OyedZH2CWdCRMU7jsl9CGFgyfZGJpxN+6VMKuzfMPHHxri+0Cw4Jf329JkGluXn1WpjZqkRR/CXZCwM2KFiCvi3QFKLdBLNDeMkArX/T6SDln1VqlcRW7u/xMSif8DuEyDhBH4FleUS3PQzazR1iXKZ+lBFOjUS4z+ckb5roGnKun8a57PT5KbGQCzWNt0OWYYNke4kvC1ZCoIkMqeyLJkN4XQ9UrIrpzXYouAM8VC94JcMob08dm3tA5UUWSb8/NkLV87hTWjRx0gCHlRGd+pn8iTEDUJAkjT/lglQSazfBHNlXCFDID3YWgbL8bGIYFD6rNf0rzJAgl7eX8KnZdYpG2ghhZtr/7PIXrO/rmamMXUSjIS3RewyC1Ew8MUUX12GaT+LfKca779aYPFzkNfKWewEUigzXTuWlqr4XNeyGcqyJHT5PJ+9zH9FZsRsEh7n5Xb0PejmlzUUrkVgihJBPCI0oihj2op0nn0Hu21dhckLtLXJqtiM5nRN52kZDuzyxQ0Y/N5NdqUdX1SIRzOWk/taFF+IFFwC5b8Er7MBmmEvDB6iGIrhNIaxVhQ5NlhDGCOpg15Yqpn+I6UKmV7hAAy0RmchMwnowsfOaMfglY6Ec97sBnTBzFIRo4Bdg4NPFJuWcuRMeD3ALxhMp9w0yVAZFExPgle4/7E9oEfvCJ8PZnNSJ+6RrWW4o6/SchDfOe349QnnXaE49O9p5I50ygzT8Uvm36UBiSz1QurN88tRmJwvYl7ORjCwQihPDxqNl0JX7KQP8cNE1/Asf4Bq90xBZoRzfPLoye1tFxlrmfxIBxapg+l6gd7FutwOcjcWue3nyVhbgBJniV/rdLwKgU+0FJpeHJvoseOeOQzIb/Rx63YqNxtK7qU840barNALK7dI3NTsv4f7u/nUSKiE23AQ8LCzlB8LKHatYnya/ESjSv4akDporD13KZbeP27uZ7bvMePcwFa0r+0UwaSBeuAHFxsdHkdaiD/gEgJL3KmjXIUdlp+KGi6kGEKHueGFU0Uiaevqyp3Dz7iXuqxFRSBcev1EXJUNjGZ00snRMDGxEDhA0Ucopaj/OeXp69qB98uI7fDEKcsjVNWxOgmJ6OrKln1uA3aYW/u/VSLZPSa88jGdhxjlRsgO+pAjA5hWFcqOFsPPlI4Be4aAupd0rKG71SMeOcgezws9cbz1QiKkVi4ViFveOz3ccHTNzaebotf0W8hGwBvajdXtyvtiTXPIL4SUlNeMI1Af4uSYQTi3xkg2Bvzc/WbJnxm8TpPnQKYvaWctqbiRnLyezLIuG/8KhhD9eV23w36B8yg0hImaBixCQ5fuT+r1iSD/9ziQaDXesgXCZFE5QYYTwceJb9LOm8VJg9LyvQ97kfjQHlkgpwJn21DFZImWwjSoopDNcKu88tF5SlrBHQ9W5l043N/8bJYEkcgBAdrCDrElGldMnxhunZwtsR2rYmEGFiD25NY+Xa66SU8EEa4F3fRDGrnPBIHRHQIPf1c9epVkF1mLiHONt6ydUSPxh8uGUYX22pt29vy4JsaqFHWwkHCrpDYrF2lOpd7aZkw6fPF2zH31wKv5d071cA9htdHhc44h0RdWiSU7VVq3xZSje+r5AavH/7sm7mMuYfA4QJQJdbB/KscQq5WYVQ1Brv7K+mioCKrZLngR7LRFHZQfVJVMehuB403gVOzI5zpOPH5gKEZ7AM9+QrvnGvrnPHSmfX+4fpYib3RCaA/AE84Y99PKQB6fTXIfOUXIz4E/6Vz86BsYbeE9KNLBGK+X0B3Sznv2HAAfxcOaaIbU9NTUxFYVCnopFwrsLB/Xo/cjuh3Z3z57mtvuDk2+FB5PmeAMPkIujXb3VpL3bu6v/D3oglLjiJNPYHp5X0I6pfuKW+Z1qNCqPNA5vnWHW/GIetG1xwirB5yW1t6dcwi9So43b3uv0nWKYYWXvjEqQs6B0nkG8vjalnNWt9b5iAlIj/NlnAXCOsKcOOQASb3rhVd887AJasRGCX5Cx7gQs96TKOj93ux7bBII14tzsxinQiUQjJVE0doTRm29XmADcDzEgZYB6qC/VRpLuuoWlu3PXo2JlotYOJrab+DCNnStwnLwOJ+iAfuBLLDlAbotXa44doqz2xOIX8uOJ/9/dshLBGqbOlRG3kuJcG5rEePFBAVpV+X5OFGY1cy4Z9PpynRtouxdd9KdxHSElhc1tAiuuRo888svhHdqaWLaJHZM0inPNkmwBzXhTKC2p0/KRWghPtof7tj9B2Vljf6Q6nJQlt8UpowpPm5TWISsuUq3sl1rhnJKSxDqIGE+smCHosc7WmeVljPUqTzjysiX0qOR2Kz6SLG+vxmf95Gp4mXxrfA4OGEdgVzKujRQ5/JJSWPXwfkdp3+jjaugd3nY2AYYVVRXhGWGdFmOnLrX1puFNGTEFDtkQTzWgy+akHcWfS/sfDLSAOU4ZC7rm034WP7epTPphwioICSXxJtNWYpk+pRBDw/lFE8Dd7DlsKw7oAWAiHOOJ/vq12tcM0m53tY3aylYWi1adEea/KMNY/lAIvQKu5gBGXndTnx/DWiqJ9kO7q+K+IQVGPwfWixgeihP++0KgTIWlwC+O6oa/l7EEaEZniwGMr87rI5U2mknLcL/a9UYMnZGr3pl+8CuG7hjc9QxSEUxSGgbgbzOZJYLWO3FFdO45Rm8uh9lx/wPpgZzwPGYArTPr/uwTEXLJkCMvsfCziAmtXiO76s4BR7kzdVQLCvPuHCBXiaBjHu/e40+gRilcxDO7ye9yh3ak36NCZ58jKWVuWqjwoJaw8isrtJJ7Aoep/ZKphThEh84QQPh1CnBfJqp3Rvxy4M6g3TdNFkEcpjF1hsFBBXnL8xbrIVoQRFaQjyviWV8xHp1HXEfw+7WuTsG5Qyl2UfXHZgegolOM6gvPDbZuvb3PkcVL1D+tofGnl7MOuDa/LccNUcCw6yJg9UkHo3IQC9OPJmAEFfoAQ0ly2XqRlNXd+pU4Mx4DMAgfLNOUzVgN8+rylj/hBAyQPeCTcTMCqBu8NXUizKIwpmy9bqqlt4PRJlQVlF9vDSUPVg078DZXaEtlM0tsl4lN+vnjwdCQ1agoiQsZzGui3eakq2zK7WPlin4Yk5eWqsLWBIx0Qz5S9QIvjt/DbxA/20NjD++BaOGe6qBboAKcO8DuNokA/y7IvW+QtIZ19mz3AURE3O2qq4wDerj3j4Auf9vyJuYITJ4+h0GdPxaBi9dFA4ivIPM2wMVO+dG7TO9nnGxt/66sDmL8/AqQMvI7nZjR7dvCu6QoIU/Oalf03WNE0T1uQSU+wWzEprfTnrjiRg80Qu+PEZT/jzGX0gYxynnX7Zq+cuGlEy01v/GGI+djUKetoNXMNjQGz+I6FQv9qZfU6TngtBCNvvKPXx6JncffoBrdpjbRqLFYaWKUbEnKZGTiby4mJEduQWIlF69Vbfg8XYHqaT2OfyLlT4vkVdN64IR83RGy0/7JSQqeBh/XAL+ZcBy5qEj3Zv4sDL7XZRrpaQCjRm9zggpLtmADCoZP/krpr/5ezv4w5L8UstfvX286qnmG9GLyxbEp0tloL+qLgGiZj358hn20mNZwjkMwLQ5ocadetIVf/krbabXCa8CIcICgka9s/3e1Don/ah4GMSVeq+n6vrjew64Nim35scdCVCTs08AOlZlaOFvPnNqSArjY33hPSdHWgianJOlVEj9hLcER/xDJY2zkanfUCo6y8WeFzqQIFPiVh7tWQ4jNrzEAYn4cxR8kH+bdAeanOu9nOv4C3iYDptdQLyLzBwmyZ8PxXw7CbPdi4GvExV0NvmmW7/drbk49KfsrINqJySlBDd+qsqSZ0vqhaoEJqi2nSPIsHfOZc52z51gKBd1m748jeBNejd171ivBttpsbLpg4FsuUpBaG8M/lDuvQoJ9PXK//6i5WR/bQq5EzWOOauoBW07W+JHtB56bTWez4mFKQfDlj1f+CGhqVCCBDhktEe99wjWJejNidGqd0iLp1s1soSGYxLkpsSCpCn/UDbXHKrr2vZtjrQzL1Kzkybsnh4dj0dh/bneYEuB1NaiU+7y5RdfeiDjHtAx83qBbMnnwY219mzbfys/uwKJ42ppKwxv9Er8ucPIufP/DI02GHSzVKkR/r28zsLY0zbu6nEyW2Ky0odrbN8TtsQ8NsIh3clLZFBaOv4+/QnasUyRHk2l3wV8Jplx5Z9EEHhitakCD+e3SLB4zIpmK3qvJfD5BTavTa+9xHlv92hAcHXj49WsI42h42dOECBpbgr9JutKW+D2z2BPhteqQp5daCoCwCPQ02YIc8dpRIfofvAP6D2UqT0KwVvFh171nMduB6r4zETCXOqQ7NOgDtcRRl8aH9ZdxOmsBsr23RcciM6JeEf5N6Sm3uzJb+yJgvZtPxQUYAG4DwTv0U4NsOWBskVmCo9OO/xAdPeRssB4Sxbq5c610uwf39Niz4Yu+NfKeJM3VSY2fQf7LTTp1VlKPtruovW3hX9q1V/A+VAo4XUrbuJeOsyS+XvMy00u/VwbfVmw7BC1O6I5v9AARxOUsUuU2yTItFYMUr9BfvtzrMJc5fCPTIskFZuoJKrGb5hG2TJxT19wXgPWEt8qwQnZLOMxs3hWrXUR1ccegbVZMgZemoX9+0UZFxo/kVigtTWxGOgHQmb6/YLh1bd0SIDIoAZw+KhbqIy83NooW6TJLTgqZb2/twXaqXsQ24viwwcQNmeuW96Td/pY66Aj4mVV+n+JWVrudE7ucVFvuBLSxmoXgCOSFxYInz/vin31FUQAzyCmcyhOoLJNYCDtWLXs0PLE7sl+DmIHy9KT4IJjCoeXUqse0OiEMBJT6ZPPt2cmC+qj3zg/JY05EBr474yKPavwDxAKo31lUvWv12uiHP3QA7vR4laJSPDceKUvBfeNrAjEHZpJPHb33kkihmv2MP3ixqLtp7ulcWqUTgBhx0GuRyM1ja07Tbc1zsfm5q5oC/F26UsA1YHVo3438a97Dc/OcQgpRkvaBABBAn+DAM6USWfQClnb2Nu9rhE0f9MYYmET7yVw734mXVHqRQBSjRYYGSyw4UkNs/zaiF/NT6/sAYLX6reibxqIkgKNi5G92UD+0tKjjr5njZhvgI5CwH9QUfsGh5xM+p49TzZo7FBpNB+rUf8JEoXLWwRZTG3zwxy7QZXy0st6oDpWrZpeKBCR7LyoBqZRdhVWO62o7g+deoZTy3mW2uBjiOBDMiAFiA0Wlz2TTgXxuyW+loxXB0nMDCzW6ehZ3ysj2nxPKNTqGYG3Kr28eHfF8pu53ebQK+u5Xa5l30QHl59bAG+g3t4Q/9hTvcGDoDYFh7MsR8J1YaDYZs+wny8XgNUzOZ5OV354KfEWSAap1LSrAcDy/sICXO02lEtf2UXWDwA0AenaZs6vLUsKEZzBXdkCyX5zXC+4TmuH0QTN56rlTh14GZqRpxAb0pVO7JAZBoYTThc7D+S4CB7tvZiVWprVyQb842h7oZ9Gw8ZRFayEVbMJs1SeU+CQNKbsQOg5MC6z4Qv1m5im8Ldl3UQWHrB2QwZnBIUr6VBKNmlE/l7INtBNyWdqQTv6BXGtFLN+SszA1l7AD3MnSj/FzlGs3CCWUJmZAYMKLBoMsPswLG2o4qWcQZzuoubCJbKK0KvhrJCflUpwagHhXv7JCR7WYvyx3uBzWqsPAvxzBQljeElHr43vTEkkua2Y5bAfWRWB7GTtFcaEF2axhAbUnw/uIBlWmL8fQIAONn56UzjsNJO+ySEhY11qaZGcAFuEfS69e8IGVLfxRHuOvewJbGw48JB8CW7PRih8gUkKiO9nkTvRhA+x2pa5GGQ3RjwOyY0MZizc2a9zmU2fJGXw6sWY+GiJQfclkSzg+u7iRinzudkdEVee1+WFVVwa8Pd6CEQa5by3gih0YAy13cbql4jUWzB0Hbdmwhw3vBGvrZHdVb4UZo0oNZK7cNAUvVfJu/StovVux67qYV0r3hyjKOXSvsQU9i7DlEWlzdMzrj580umIg5eDhJg/WMaIqx+Rs+VHoJoGM+Jle/RU2iBXUrPJ/GA1VPStDk/4Xuvw7BWlpE9KwbCsmqfMK6vjzj5wRfZPb5FkvmVHlhSW6fFkrB/6KacWoqcpqjWKjOgSyDc89sC2dAr99YDQS3rM0HI2iJOoq3bnC4MRGuVMRPn+kJwJxHKBbL7lrp9pPPsxd0AAL6VIVJEqlzwopbH8AlOPoEbL0+Ul4I3dtR3YuaMGy9LXDpj+9rG4MdYUqKjqacssPnpmw8G5zfAeJX+QDPO+Trh5qefrX0Zhm/79lDpY3n5c5B+W9BIHeZrcq1qfJbItAtK5VV6lDXm3P5BL3I6d/BQ6VeT0o+jT/B3+8xabqTB74Z2FmxyCEaJySpXDVVwHGDUQ5edsZe4MjZPOblMnWW15cGHVZKe65+AbhWC28t3iCfcNP7ESUfj6CbZDLzo6RltqqSbnU7AWkVIVQLcVRDF3Ttz88IAJRqRHHmAJWzC4nQ3fJcGdPrpxvIldm8NZogUYAX/0mXp2wIht1wTpmQu6D/9cmRjDntXpHHW5sUdNSlIlXQ9EJAIkY6XvngOshhuVQ0siUGiRu8KWhXO1ccWU5g98rm8loJv2WEYO1RC6C3RwEgp8TF2mbv+fpJ79nUlJk973yFVVBK9tROuNrpMGkse72PbzvTyuGwZBrsLcgFSS/xAoHmwcvgMKa5aEETz6EPGTHygZ6LaRjxxi5ZPBRcqhVz4T6SWyyR7QLmGx3PlClYOhN4pAYdXPZvU86GCoimJ5NuXnxhHh9ddgZrvqsCJiN5hBWUWESULJqNcR6gPCyqaE1PGjUCZfBjRaRqwhIxTEIhLLRnkz4UaZQ7qfyf+Oq+LspTI8OXaU3j7hzJZ58yGU/nJ7uLS1ScBjnSp2LBtS3PXPa6xLs70jXRyYYxI3pNs5OXgdFAIQOv4xdigKnO8SO7Dxh3r9FeqNipQUdEnx09QG1F+X/cBYZi0E5k4OUIoCeOc790CbWIEcU2rEg6xi4Z5xq1zS65sMYV1NjCDejFBMcnCBj1T9d+3EZYMuMWIbjmPMnw/AxX5WX8AXIrdcpQMdEot+FGaZz7s8T+mj/ROEDkWgFTik4az5vacPHmv6FTegDFt4aIofwEJ5xkMpoq+3+UNJ8EyuIw4pM+Xy3pSEilVj2poDTIYAPCk0EnHaIO2NMIrvC5Gqbw9TeMgL+7iIa5GtyJi7iGUTht/7nRbmxkgPfJEhLRNDGxnqhrfpqfhS9hYP1KDBsR71BEtbm+dXIjJvqlnSLPQKLUQSicj/W6c9hJ8+ieU5k6euTNdl2FTxYOEnUTrJRyCOjIlFW7brJrYojXfzBilakEFgoBSByvDgEygjB1OCmPIWNKHcJpExmotLVNOAIq/MCiMJpb6EH+oIDkH441JSxvE5mGaDCHwAfWfU8k1wn+lSvyN/nAIXRTRzzqhnx20Xz4D4KZAa18/2nfNEkA94aCrjINK6/nPofSShIW31exU1ZuYXXvprKDx8jrobqLXckuuzgY0JxxNoA1jR/KmGze7dWXyVxNs7CejgLH9wXbtUderWGfqx/vFYo2gb8+kIGLwQ5TkB6099IBFpUachxz+9g5bUjxkyEri/wKo77CBbnFFNtIVmRtI0zGGw2g2a5dUi7FY/PNF9u0kyF08h110ZGgbEOl/thZ7ToyyRQkVXWxAnt7xTffomh54j7IQNOoO/veFenvHeyEmeLtwbEUgST9F4Tv3UPR9508OpzrKNfrmTMRnCykyd5d9LisXUA9Y83P38MF6FeNIp5h0vuvsG1eQjP0Ky+aSU2Jw3wU7NN5Dei3fCYKyoIwEaMGMrxhfhBLMHa3XtRkgsU3uxAlNvC/zm+AL4uKezDir4R1JMKYBECp3K7T2NbgMtqPJetPb647DT7gH7N+AGL/TTE48419tMkY+5VnwBJJstty/yxIqb5AAW6pQjSNmM7CYt6BEpTIS3UrzNKJ0qs6lkc9jvozCep9N9bNPNmB99QVOW2T0xjI2Egmb+BMgT1WY97XvAUw+qgT6y2eVc7/qVNNEdvDhKzqJNRW7+FiESDmVucfdycGg/kmX3U/jk6j72pbD6ucemSYHOWgOBl0sNrOs+TA42cKr2BKWMnXAKuyutGvGMVbuiwrgZ0VflpkBE74dKi/+fk7xNDN75TwFB6qJiltbEg1n7x1bf7sTiCWIqrXxFcuoIgsgV0dB+bUtZXKQgYVdO7K0zo30FG2/ghaQIvg8nHO5EtXvFkB1IiZOgQcIv+xk4NHTc+a2OXKtlLNxbzu80u5ZHvxqY/vDM5GZjRgR2E1NhzdOad0rkE5ixt1Krx5Hk92mdOOcIHxf7LdMNuMZzcWB+lox2suqyhp/XnHAhXF/izPCxzRNvMSGCi1w34JNzN6k1L1FEeoNqiNmu3F4TOkX8MY4HMtjxwxmwOssRdNYaWJCmxZ2CNG4p8R9Q2JSWUO/hvJUgF5d3kpgjmRCcLM6fMWPqRZJ8pwoHEaNQWXpxdTySYaOB2To8W+c1RHYjpA8cPk1TFeyECcfBSUdzdt6rU5BfDQAydYbl7BeDC+39RLYkIaJxdrGeCIsim2tI7a+ZfzOZn00ts2lmLjEt5bKH4+Vny0XxU9W7jjtVTHNn1e0ncT3WZANQn9QI/HzM0K43MQ2Km1j4UrDqEYn7KmLNJCUwM3MjKCfIMhqwMqoRV5RXgS39KHJPJvND5LpXGcEWk2mqNX9Qrb1KhtFr0L19YZlZEN8tkyHQnp92YIW9lUjnFv2zGlr1ryRcJ8oo8h9zR9t7d5kTqVWtfzRzOySPIAU8S6khGDlV36cE+ssbXS/TQDZDi/9RLXwjHlLrzZw2IsVThLpnfB5HgrhdaWHp7kULRclVvBN59YsoJWfQkCEZvG8WGjJEhBDCN+KHRF9QJFm+91kj1qdfOL3BoAAAA=";
function RobotSvg({ pulling = false }) {
	usePreferences();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: pulling ? "mh-robot mh-robot-pull" : "mh-robot",
		viewBox: "0 0 120 140",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "mhRb",
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0",
					stopColor: "var(--surface)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "1",
					stopColor: "var(--muted)"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				className: "mh-rb-shadow",
				cx: "60",
				cy: "134",
				rx: "26",
				ry: "4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "mh-rb-arm mh-rb-arm-l",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "14",
					y: "70",
					width: "12",
					height: "34",
					rx: "6"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "20",
					cy: "106",
					r: "8"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "mh-rb-arm mh-rb-arm-r",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "94",
					y: "70",
					width: "12",
					height: "34",
					rx: "6"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "100",
					cy: "106",
					r: "8"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "mh-rb-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "30",
						y: "66",
						width: "60",
						height: "52",
						rx: "16",
						fill: "url(#mhRb)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "44",
						y: "80",
						width: "32",
						height: "20",
						rx: "6",
						className: "mh-rb-screen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M52 90 l5 5 l10 -10",
						className: "mh-rb-tick"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "40",
						y: "116",
						width: "12",
						height: "14",
						rx: "5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "68",
						y: "116",
						width: "12",
						height: "14",
						rx: "5"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "mh-rb-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "60",
						y1: "14",
						x2: "60",
						y2: "24",
						className: "mh-rb-ant"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "60",
						cy: "11",
						r: "5",
						className: "mh-rb-bulb"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "28",
						y: "22",
						width: "64",
						height: "44",
						rx: "18",
						fill: "url(#mhRb)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "36",
						y: "31",
						width: "48",
						height: "26",
						rx: "12",
						className: "mh-rb-face"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						className: "mh-rb-eyes",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "50",
							cy: "44",
							r: "5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "70",
							cy: "44",
							r: "5"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M53 52 q7 5 14 0",
						className: "mh-rb-smile"
					})
				]
			})
		]
	});
}
var PROMO_IMAGE = "data:image/webp;base64,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";
var HOME_STYLES = ".mobile-home .mh-shell { padding-bottom: calc(110px + env(safe-area-inset-bottom)) !important; }\n.mobile-home {\n --background: oklch(.988 .003 165); --foreground: oklch(.24 .025 166); --primary: oklch(.57 .14 165); --primary-foreground: oklch(1 0 0); --muted: oklch(.95 .014 165); --muted-foreground: oklch(.55 .025 166); --border: oklch(.91 .017 165); --accent: oklch(.93 .035 165); --accent-foreground: var(--foreground); --gold: oklch(.8 .15 83); --gold-ink: oklch(.42 .09 65); --heart: oklch(.62 .21 18); --surface: oklch(1 0 0); --play-bg: oklch(.955 .031 161); --shadow: 0 8px 25px oklch(.25 .05 165 / .07); --overlay: oklch(.16 .02 165 / .65); --join-shadow: 0 12px 30px oklch(.35 .07 165 / .14);\n color: var(--foreground); background: var(--background); font-family: 'Manrope', system-ui, sans-serif; min-height: 100dvh; letter-spacing: 0;\n}\n.mobile-home * { box-sizing: border-box; }\n.mh-shell { position:relative; max-width: 520px; margin: auto; padding: max(26px, env(safe-area-inset-top)) 26px max(24px, env(safe-area-inset-bottom)); }\n.mh-top { display:flex; align-items:center; justify-content:space-between; gap:16px; }\n.mobile-home .mh-avatar { width:54px; height:54px; border-radius:50%; padding:3px; background:var(--surface); border:1px solid var(--border); box-shadow:var(--shadow); position:relative; flex-shrink:0; }\n.mh-avatar img { width:100%; height:100%; object-fit:cover; border-radius:50%; }\n.mh-online { width:12px; height:12px; border-radius:50%; background:var(--primary); border:3px solid var(--background); position:absolute; right:0; bottom:2px; }\n.mh-wallet { display:flex; gap:9px; align-items:center; border:1px solid var(--border); border-radius:30px; background:var(--surface); padding:6px 6px 6px 12px; height:43px; box-shadow:var(--shadow); }\n.mh-coin { display:inline-grid; place-items:center; width:23px; height:23px; border-radius:50%; background:var(--gold); border:2px solid color-mix(in oklch,var(--gold-ink) 25%,var(--gold)); color:var(--gold-ink); font-weight:800; font-size:13px; }\n.mh-wallet strong { font-size:14px; }.mh-wallet small { font-size:10px; color:var(--muted-foreground); margin-left:3px; }\n.mobile-home .mh-wallet-add { width:29px; height:29px; border-radius:50%; padding:0; background:var(--accent); color:var(--primary); }\n.mh-banner { margin:20px -8px 0; display:grid; place-items:center; }\n.mh-banner img { display:block; width:100%; max-width:460px; height:auto; border-radius:16px; box-shadow:var(--shadow); animation:mh-art-float 6s ease-in-out infinite; }\n.mobile-home section[aria-label=\"Statuslar\"] { margin-top:24px; }\n.mh-status-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:17px; }.mh-status-heading h2 { margin:0; font-size:14px; font-weight:750; }.mh-demo { font-size:10px; color:var(--muted-foreground); display:flex; align-items:center; gap:5px; }.mh-demo::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--primary);}\n.mh-status-list { display:flex; gap:17px; overflow-x:auto; padding:2px 0 9px; scrollbar-width:none; }.mh-status-list::-webkit-scrollbar{display:none;}.mh-story{flex:0 0 60px;text-align:center;}.mh-story-label{display:block; margin-top:7px;font-size:10px;white-space:normal;overflow-wrap:anywhere;line-height:1.4;min-height:28px;max-width:64px; color:var(--muted-foreground);}\n.mobile-home .mh-story-button{height:60px;width:60px;border-radius:50%;padding:3px;background:var(--surface);border:2px solid var(--primary);}.mh-story-button img{width:100%;height:100%;object-fit:cover;border-radius:50%;}.mobile-home .mh-story-new{border:1px dashed color-mix(in oklch,var(--primary) 45%,var(--border));background:var(--accent);color:var(--primary);}.mobile-home .mh-story-new svg{width:23px;height:23px;}\n.mobile-home .mh-join { background:var(--surface); width:116px;height:116px;padding:7px;border-radius:30px;border:1px solid var(--border);box-shadow:var(--join-shadow);z-index:1;transition:transform .2s,box-shadow .2s;}.mh-join img{width:100%;height:100%;border-radius:23px;object-fit:cover;}.mobile-home .mh-join:hover{transform:translateY(-4px);}.mobile-home .mh-join:active{transform:scale(.96);}\n.mh-footer { display:flex; align-items:center; justify-content:space-between; margin-top:20px; color:var(--muted-foreground); font-size:10px; }.mh-footer-brand{font-weight:750; font-size:12px;color:var(--foreground);}.mobile-home .mh-signout { width:32px;height:32px;padding:0;color:var(--muted-foreground); border-radius:50%; }.mh-notice{font-size:12px;color:var(--primary);margin:12px 0;}\n.mh-overlay{position:fixed;inset:0;background:var(--overlay);display:grid;place-items:center;z-index:50;padding:22px;backdrop-filter:blur(6px);}.mh-dialog{position:relative;background:var(--surface);border-radius:8px;padding:26px;width:min(100%,350px);box-shadow:var(--shadow);}.mh-dialog h2{font-size:19px;margin:0 32px 12px 0;}.mh-dialog p{font-size:13px;color:var(--muted-foreground);line-height:1.6;}.mobile-home .mh-close{position:absolute;top:14px;right:12px;width:32px;height:32px;padding:0;border-radius:50%;}.mh-story-view{display:block;max-height:65dvh;width:100%;object-fit:contain;border-radius:5px;}.mh-story-view-text{display:grid;place-items:center;min-height:250px;background:var(--accent);color:var(--primary);font-size:24px;font-weight:700;text-align:center;}.mh-dialog .mh-primary{background:var(--primary);color:var(--primary-foreground);}\n@media(min-width:640px){.mobile-home{padding:40px 0;background:var(--muted);}.mh-shell{background:var(--background);min-height:810px;border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow);overflow:hidden;padding-top:30px;}}\n@media(max-width:360px){.mh-shell{padding-left:20px;padding-right:20px;}.mh-status-list{gap:12px;}}\n@media(prefers-reduced-motion:reduce){.mobile-home *{transition:none!important;animation:none!important;}}\n\n.mobile-home .mh-bot { position:relative; margin:16px 0 0 auto; width:120px; height:auto; padding:0; display:flex; flex-direction:column; align-items:center; gap:5px; background:transparent; white-space:normal; }\n.mh-bot-bubble { position:relative; display:block; background:var(--surface); color:var(--foreground); border:1px solid var(--border); border-radius:8px; padding:8px 9px; font-size:10px; line-height:1.45; box-shadow:var(--shadow); text-align:center; }\n.mh-bot-bubble strong { color:var(--primary); }\n.mh-bot-bubble::after { content:''; position:absolute; width:8px; height:8px; background:var(--surface); border-right:1px solid var(--border); border-bottom:1px solid var(--border); bottom:-5px; left:calc(50% - 4px); transform:rotate(45deg); }\n.mh-bot img { display:block; width:66px; height:84px; object-fit:contain; animation:mh-bot-float 3s ease-in-out infinite; transform-origin:50% 80%; }\n.mh-artwork { margin:36px -8px 0; display:grid; place-items:center; }\n.mh-artwork img { display:block; width:100%; max-width:440px; height:auto; aspect-ratio:1 / 1.08; object-fit:contain; animation:mh-art-float 6s ease-in-out infinite; }\n.mh-game-content { display:flex; flex-direction:column; align-items:center; gap:24px; padding:20px 0 6px; }\n.mh-dialog:has(.mh-game-content) { text-align:center; }\n.mh-dialog:has(.mh-game-content) h2 { margin:6px 24px 0; font-size:24px; font-weight:800; }\n.mobile-home .mh-game-action { width:100%; height:46px; background:var(--primary); color:var(--primary-foreground); font-weight:700; border-radius:8px; }\n.mh-dialog { animation:mh-dialog-in .2s ease-out; }\n@keyframes mh-bot-float { 0%,100% { transform:translateY(0) rotate(-3deg); } 50% { transform:translateY(-7px) rotate(3deg); } }\n@keyframes mh-art-float { 0%,100% { transform:translateY(0) rotate(-1deg); } 50% { transform:translateY(-7px) rotate(1deg); } }\n@keyframes mh-dialog-in { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }\n@media(prefers-reduced-motion:reduce) { .mobile-home * { animation:none!important; transition:none!important; } }\n.mh-robot { display:block; width:72px; height:84px; overflow:visible; animation:mh-bot-float 3s ease-in-out infinite; transform-origin:50% 85%; }\n.mh-robot rect, .mh-robot circle { stroke:var(--primary); stroke-width:3; }\n.mh-rb-arm rect, .mh-rb-arm circle, .mh-rb-body > rect:nth-last-child(-n+2) { fill:var(--primary); }\n.mh-rb-face { fill:var(--foreground); stroke:none !important; }\n.mh-rb-eyes circle { fill:var(--primary-foreground); stroke:none; transform-box:fill-box; transform-origin:center; animation:mh-rb-blink 4s infinite; }\n.mh-rb-smile, .mh-rb-tick { fill:none; stroke:var(--primary-foreground); stroke-width:3; stroke-linecap:round; stroke-linejoin:round; }\n.mh-rb-tick { stroke:var(--primary); }\n.mh-rb-screen { fill:var(--surface); }\n.mh-rb-ant { stroke:var(--primary); stroke-width:3; }\n.mh-rb-bulb { fill:var(--primary) !important; animation:mh-rb-glow 1.4s ease-in-out infinite; }\n.mh-rb-shadow { fill:var(--foreground); opacity:.12; stroke:none !important; }\n.mh-rb-head { transform-box:fill-box; transform-origin:50% 100%; animation:mh-rb-nod 3s ease-in-out infinite; }\n.mh-rb-arm { transform-box:fill-box; transform-origin:50% 8%; }\n.mh-rb-arm-l { animation:mh-rb-wave-l 1.6s ease-in-out infinite; }\n.mh-rb-arm-r { animation:mh-rb-wave-r 1.1s ease-in-out infinite; }\n.mobile-home .mh-dialog.mh-dialog-card { overflow:visible; margin-top:64px; animation:mh-card-pull .95s cubic-bezier(.22,1.2,.36,1) both; }\n.mh-card-bot { position:absolute; left:6px; top:-60px; width:70px; pointer-events:none; animation:mh-card-bot-in .95s cubic-bezier(.22,1.2,.36,1) both; }\n.mh-card-bot .mh-robot { width:70px; height:82px; animation:none; }\n.mh-robot-pull .mh-rb-arm-r { animation:mh-rb-tug 1.2s ease-in-out infinite; }\n.mh-robot-pull .mh-rb-arm-l { animation:mh-rb-tug-l 1.2s ease-in-out infinite; }\n@keyframes mh-card-pull { 0% { opacity:0; transform:translateX(115%) rotate(4deg); } 60% { opacity:1; transform:translateX(-4%) rotate(-1deg); } 100% { transform:translateX(0) rotate(0); } }\n@keyframes mh-card-bot-in { 0% { transform:translateX(-30px); } 70% { transform:translateX(-36px) rotate(-6deg); } 100% { transform:translateX(0) rotate(0); } }\n@keyframes mh-rb-wave-r { 0%,100% { transform:rotate(-10deg); } 50% { transform:rotate(-150deg); } }\n@keyframes mh-rb-wave-l { 0%,100% { transform:rotate(8deg); } 50% { transform:rotate(22deg); } }\n@keyframes mh-rb-tug { 0%,100% { transform:rotate(-14deg) translateY(0); } 50% { transform:rotate(-4deg) translateY(3px); } }\n@keyframes mh-rb-tug-l { 0%,100% { transform:rotate(14deg) translateY(0); } 50% { transform:rotate(4deg) translateY(3px); } }\n@keyframes mh-rb-nod { 0%,100% { transform:rotate(-4deg); } 50% { transform:rotate(4deg); } }\n@keyframes mh-rb-blink { 0%,92%,100% { transform:scaleY(1); } 95% { transform:scaleY(.1); } }\n@keyframes mh-rb-glow { 0%,100% { opacity:1; } 50% { opacity:.35; } }\n@media (prefers-reduced-motion: reduce) { .mh-robot, .mh-robot * , .mh-dialog-card, .mh-card-bot { animation:none !important; } }\n\n.mh-bot-row { display:flex; align-items:flex-end; gap:8px; margin-top:16px; }\n.mh-promo { flex:1; min-width:0; width:100%; height:auto; border-radius:12px; box-shadow:var(--shadow); display:block; }\n.mh-bot-row .mobile-home .mh-bot, .mobile-home .mh-bot-row .mh-bot { margin:0; flex:none; width:108px; }\n\n.mh-shop-overlay{place-items:end center;padding:0;}\n.mh-ai{flex:none;margin:0 0 6px;}.mh-ai-toggle{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:9px;border-radius:14px;border:1px dashed var(--primary);background:transparent;color:var(--primary);font-weight:700;font-size:13px;cursor:pointer;}.mh-ai-body{display:flex;flex-direction:column;gap:8px;margin-top:8px;padding:10px;border-radius:16px;background:var(--muted);}.mh-ai-row{display:grid;grid-template-columns:96px 1fr;gap:8px;}.mh-ai-row input{min-width:0;padding:9px 10px;border-radius:11px;border:1px solid var(--border);background:var(--background);color:var(--foreground);font-size:14px;}.mh-ai-go{display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border:0;border-radius:11px;background:var(--primary);color:var(--primary-foreground);font-weight:700;font-size:13px;cursor:pointer;}.mh-ai-go:disabled{opacity:.7}.mh-ai-msg{margin:0;font-size:12.5px;line-height:1.35;color:var(--destructive);}.mh-ai-msg.ok{color:var(--foreground);}.mh-spin{animation:mh-ai-spin 1s linear infinite}@keyframes mh-ai-spin{to{transform:rotate(360deg)}}.mh-shop{position:relative;display:flex;flex-direction:column;width:min(100%,520px);max-height:92dvh;overflow:hidden;background:var(--background);border-radius:28px 28px 0 0;padding:8px 12px max(14px,env(safe-area-inset-bottom));box-shadow:0 -12px 40px oklch(.2 .05 165 / .25);animation:mh-shop-up .38s cubic-bezier(.2,.9,.25,1);outline:none;}\n@keyframes mh-shop-up{from{transform:translateY(100%)}to{transform:none}}\n.mh-shop-grip{display:block;flex:none;width:42px;height:5px;border-radius:5px;background:var(--border);margin:0 auto 10px;}\n.mh-shop-head{display:flex;flex:none;justify-content:space-between;align-items:flex-start;gap:12px;}\n.mh-shop-head h2{margin:0;font-size:22px;font-weight:800;}\n.mh-shop-head p{margin:2px 0 0;font-size:13px;color:var(--muted-foreground);}\n.mh-shop-head strong{color:var(--gold-ink);}\n.mobile-home .mh-shop-close{width:36px;height:36px;border-radius:50%;padding:0;background:var(--muted);}\n.mh-shop-tabs{position:relative;display:grid;flex:none;grid-template-columns:1fr 1fr;background:var(--muted);border-radius:16px;padding:4px;margin:12px 0;}\n.mh-shop-tabs button{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:7px;height:42px;border:0;background:none;font:inherit;font-weight:700;font-size:14px;color:var(--muted-foreground);cursor:pointer;transition:color .2s;}\n.mh-shop-tabs button.on{color:var(--foreground);}\n.mh-shop-pill{position:absolute;top:4px;left:4px;width:calc(50% - 4px);height:42px;border-radius:12px;background:var(--surface);box-shadow:var(--shadow);transition:transform .3s cubic-bezier(.3,.9,.3,1);}\n.mh-shop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:8px 6px;margin:0 -6px;overflow:auto;min-height:0;}\n.mh-shop-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 6px 8px;border-radius:18px;border:2px solid var(--border);background:var(--surface);font:inherit;color:var(--foreground);cursor:pointer;box-shadow:var(--shadow);transition:transform .15s,border-color .2s,box-shadow .2s;animation:mh-shop-in .35s both;}\n@keyframes mh-shop-in{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}\n.mh-shop-item:active{transform:scale(.96);}\n.mh-shop-item.sel{border-color:var(--primary);box-shadow:0 0 0 4px color-mix(in oklch,var(--primary) 18%,transparent),var(--shadow);}\n.mh-shop-item img{width:100%;max-width:80px;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 6px 8px oklch(.3 .06 60 / .25));}.mh-shop-art{display:block;width:100%;max-width:80px;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 6px 8px oklch(.3 .06 60 / .25));}\n.mh-shop-amt{font-weight:800;font-size:15px;}\n.mh-shop-amt small{font-size:10px;color:var(--muted-foreground);font-weight:700;}\n.mh-shop-price{margin-top:4px;font-size:12px;font-weight:800;color:var(--primary);background:var(--accent);border-radius:20px;padding:3px 10px;}\n.mh-shop-badge{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:var(--heart);color:var(--primary-foreground);font-size:9px;font-weight:800;letter-spacing:.04em;padding:3px 8px;border-radius:20px;white-space:nowrap;}\n.mobile-home .mh-shop-buy{width:100%;flex:none;height:50px;margin-top:14px;border-radius:16px;font-size:16px;font-weight:800;background:var(--primary);color:var(--primary-foreground);box-shadow:var(--join-shadow);}\n.mh-shop-note{flex:none;text-align:center;font-size:11px;color:var(--muted-foreground);margin:8px 0 0;}\n";
var SHOP_DAT_ICONS = [
	"data:image/webp;base64,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",
	"data:image/webp;base64,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",
	"data:image/webp;base64,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",
	"data:image/webp;base64,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",
	"data:image/webp;base64,UklGRnRVAABXRUJQVlA4WAoAAAAQAAAA7wAA7wAAQUxQSBwNAAAB8IZt2yFJ2rbtx3lEY2zbts0e27Zt6+LYtm2zNbZtu3vc3ZXncR77j8zKyoyIjrh9R8QE4P/9/1/+JRMAA2Zdat2dTr58i8kAZEFqTFAAM2x29Xu/JzZ/ffOm/QGo1BRRYKo9h/3JZk9mTvKtQxYMKF8JmmVZpkHGagosdO5PJJMlZ0u3RNpr+48DKRVVtKmZjLUUA09pkGbO9pORvF8DAJEgIsVTAP3nWH37PXbZes0FxwegYeykWPJFMjo76Ba5bOivgpYhUymOaCbAGld81MOW/uWdO08FqIyFFJuMYnR2OPo/AWDcqaabaoIAAKpSjAAA6z5NksnMLJHkTxcuAOhYRzEo0thx47C597ls6Ocjfxv51dv3HrnaRAC0CAEDtzxvKJlicrb0ZEb2nDUpdCwTZKbvmNhNG822v756nX6A5i5gmbdJurGPHsmP1oPKWEVxByO7bNGSu6dkMZF8a9cAlXyFMPtIxmjsoEfyBAQZi6gsT2OXnW27JfLZNQDJj6r2x9XsYadT4oVQGStIyFQUd3Wv78nIc/sh5CQEAJh3dPKO0SMvgUr5SYaWSzfc80Za4uDJEXKhwNo3X7LhECZ2s8FjoaWngCx56MWPPP8jnUVs8KWJJORAsNDtbHZ21SNXhpZbACY9/DUWusF70CJINyT8fQyTxeTscuI744iUmUL2/5KkmSUvCiO3gUICoKFjioPpxlwatwoDMg1Bykkx1xAyJhbb/A0VBWaZDFDpkOCVFJkTH4zWGkpIsc7PjM7CJ66gmPSyUd9dvgQQOhJ0gm+YcuL8c+0t9l964SUmBoKUjWLrBo0lGHkaFn6fJNMlk0D7FhSYM9Jz0uZ31y4OaLkErG6eWIbGh9f9kdE9Ot9dAKEPGoAJ1niQiTm2SDppl08DLZMQpvqKxpKMZGJz5I8LILQhKsBi533O/DvdyG82gEp5KK5hZHk6W0e+oL0FBbDi3UamlLuWkTwaQcpCsVQyLw9n74lLQptUgKl3HUYyJhY1JZ6LIKVxPSPLOHHVJlFg2at/JmnOAnvkJVApXlDJdMqR9DJy/jwJBAKsPJikGYve4FnIitdyYxrL2HiHKAKys0g3ZwlG7o2sYEFmvv7FW3e+08tqbfQXjHMfk7Ec3eLK0GIpHmeJuz+6HLLxHmWDpZn41ZRBiqTYig0z85Ki0w/EOWywRI23QwsUZLKvPbHMjX7ByORlwsgtoAXCpTSWu7N0k381SZCiBOxEY9l78pJh5JnQggjG/YKp9ErY0+g5EYoy8GOvYDReCy0GMvydsYK5/zU9QjFEpviRqXrRuD+yYiDDZo1K5sMgxVBggRH06uX8Y1qEIiimvuAvOit44urQAijW+4IV3biHZPkL2IWMXs0SV8UAyVvAog03VvYtAqA5U1zOyMru6dU9BkDzFfCYW3Vrfn0QQq4U5zNWuRTJ3RDyFLCYJa9wpLkvA80RFNfTKh0bvBxZnoLM9HvyShf9ZmieoDiasdrxRGS5Eu3/Cq3CefprdoRcQbG4mVc342lQ5DzDmbTKlvybSYPkTXS8Dz1VNeMuUOReMYhVzThcFAVU3EarZG49C6EQQeYc45Us8m9QFFJxB62CJb4zQKUgsgJT9XJLy0JR0BCG0iqX8WRkKKpiiWResYxv9lcpDBRns1Gt3NIyUBRXdOBQxlSljGciQ5EFE95KerSqZPxgPJVCQYAtX2FlNtqyUBRcBLLUUTeNolegxFFbQFF8BYDPmSoQn1oMijIU7dfvTbeq4z5iY0BRkopDWXkSPwYUpZnhVlrV8bf7iZSGYu0vk1ecyH9DUZaKlUfTWW0T31SVIkmvTUGm+prGius+chNkxQiaZSroPWi/friXxsrr5HbI8icZWoesXzZg/IEBzYczsgJ7skHQ3AGYc5Mjzr/32bff/+C9D7769K0XH7vx2MOiexVi8p/mRciXyIRHvtJgdTe+OX6QXGU4g6TFaJZ6txjNqxIjr4HmSnGj9TirfOT20Hxdx8hK7+m3OaG5uqHq0ThcNISgmmUapGsZrq58NB6CdiWTbl1f/dwbjz8+5LE7r77o2M0XnwrdVtxJq3p9HPHUUVOKdOdWxurn1hxjNJJ8XEJ3bqdVv7a9YR8qpCs3MNYKJr4mXQl4mFY70BXgLaZ64Wn0dtCuvFY3aHywK4IXa8i90p3naLXjAYQOiWaZ9nuPqWYkfjQhpAOSBTRPOZJeM+hcA9q3AGDy1fY97943WD/Nt+iAYLL9HviRNdW4Vd+CLPMFyRSjpVqyG7K+ZLiSo81ZUyMvgPbtshRZW403dUAuZa25VfqG0+tM4rMANAttSJh0KK2+uP++7UQBQOhNcRWN9farV6/faTr0HjA01Rtn829nDBDp5X7WGzIlM3IxaAuVu2sPSfe4EEKLgHtrEf+aoZVguu/odahnnlaKFemswYkvTiTSYmmvRc5R06DVcqxJ30/cy/J1acRELQJm/INeg+i2HhQAAh6h1SHjvQhNihvq0oMtRCZ6lakePdYi4C4a69GTEECQfeKpFjk/Hx8CQf+PWJdGTtVi4Ke16fuJW2Sf1aYfJ4VAscIY91qU+PX4EGT4FyNr0jvS4oT69Harv9WuM+vTu00B99DqkfE5EQB4lakuDYMAgmdo9cj524wIEAypS4w8GhkCHq1NyV8PgoCHahOZ5gb66YX1ybgRBLioPsV0CDDlBT3Oepxig6djvGfprM/vLYMFktUktw9PXnEcYL5RrEeJzy0MIMM8dYmMvzx34EyQ2etT8y+HYpXotcktkifexcQabenpYTWLV95bt865ilar/KRLLNapxAMPJlN9co6Yb+CZf7I+R54MYJarmerT7iL9cTxjXTJuC0H/j5nqUuQ5CJgnsjYnvoQMGzLVJuMzyLAHY40ajAx71apbkWHf2ON1qWHnIcPhJFM0rz9uxu0RMPu1L49gzXVPFiPJU7OA5inWPOWF0V5jWvc8tCaaRdF8pKfa4o0fXht8yd7zANoEIPTDZl+715TEl2aeBM1B0VoCTiOdNdX504QIIcsCepWAi2jO2mrcQjK0HfA3Npz1NfJStBcwjydnjU18M6BtxbLurLPO0TMjtCOY8jd6naFxc2TtAPo2U62JfnIfFLcx1pqGPwhtK8Ox9cbIA/ugWNetMyl6DXDjD5sioO2AGZJbXzxZTKyDRt4xCxR9DDiWpMVoLWOMic1fXrXiyUxVzC16CzeO2BVQ9Fmw5WvO9uMXj/5j7QmAnRmrWLPF5Il8ZHZoQAcDdJFdz7jpgSefe3b4A1eeut8Gc40HAAN09wqWePOy+1z/DZvjEUCGzir6HjIVxRpMlcs4DMCkO1/+5ujPVkcI6LSELNMgIhI0yzQIAATM2kOvWkzcWvsDyGafCIq8S3jBrXIZ3+0vIcsABOQ+w9GMlYvGbZABEgT5DzLNTylVLx+CgKIqdmejcjlHTIZQFCiuZ6Nqkb5QgSQMHMxYvRYsEAImGsaGVyrndxNCioOA8e9jShXBzZJ516LfBkWRA8K/SfNySKlgrVO3EjdBViiIYO1XyZjKgLRCxW+HH7/RJYnRu5L42TiQYkEU/ff5ijTzDqSUJ+dbn9Gtb26eD/OHJwGAld4kzbsQ+S9kKLwCUxz2LskULXlvnsxIz5Fxu6lvJpN5O8mMeY08Fv0yVUx88u+keac8jZkNoXgQBQZufucPbE4WY4yWSPLrNy1XWwErPUEyRWuO0Ul+e8aLTDlw/3MWCQAUmOuaHtJSZxq8BwGlKApgskF/f+yzMex1zIfXbTnx9rRcSX9g0A3fsc2vb956cuzFmIPIf0PRLAosfNkvZIqpb5Ej55KSAEQDAAycbZWt9j7siIN2WWP2fgBOYMxR2gSqACZb/Zjr7h88/PFrj1xlQgC6AVP3It8aGKQFEAIww3GfkKRFc2/lyRJHLIuAEhXNAtrWAXJwVzxa8t7cnEtCAVW0raqYJ9K7FTlyAQS0GRQYb53LPmRLT2bJSfKBeaEoWwmatdQgyHB0HOPesZYptkwkz8kEzaKZhiBBMxVAMM7nTN3xyO+XhqL9oAAGLL7PtS9808OWjU+uGgQElHuGC0nSPVk0S8nbSnzyX4O/6GGvvzywGjotGOLWDTdy8GxQ9FlU0TzhbEuvvfGm664wxziABJS8YLaznv7B2aabmcVoyb3hOwPjzrnuASecfuoJ+w6aGgidyvBPNjrnRv5xlEDRUQmZCtpUxdhx8gWXWnb9fU+6asjrX/7F9pfLMrQbFJ0OMuO3bHhH3IxsXDUPJKCLErRlEIwVQyboXcafbaVNd9lpz8POvful737v+XJKiATNWqqgiwHLfUfG5O15MiP586ULA4pqKUFVs0wFbU884xzTIr8Bs9wQSbqZpZSSWWLzqMF7TwNoQFUVCapZlmUakPcALHjq66PYbvrhpWt3ngWABlRjCSHkCSEAOu/mx5199a133nPbJcdss+w0ABAywf/7/78ZAlZQOCAySAAAsLcAnQEq8ADwAD5ZJI5FI6Ihmp2FUDgFhLYAaxbY7w8PPvH5lewxWH7X/aP8d/nf75+2/ys5WurPKB56/6f+Q/JP5pf6z/pexP9Mf9P3A/1d/4X+N/yH7P/Rz/pft57n/8L/yfUJ/Tf8t/6P9f7vH/J/bX3Qf3H/Vft1/pvkC/rX+j/+vtc/93//+5B+8nsC/tj///Xf/cz/r/J5/af+V+5fwG/0f/N/+32AP/Z7V38A/93qAdhF/Mvxi/U/x8/w39j/ZzzN/Hfl/77/e/3F/u3xtfV/+P3vfRf5D/zehX8o++X77+3+hH/J8H/zP9y/5v+I9gj8s/ov+u/sfqh/L9qTs3+I/a72CPbb7B/1v8f47P+r6GfZD/ye4D/Sv7F/3/8H7T/8nwU/xX+69gL+nf3//1f7L8xvpp/vP/r/sfPX9U//T/XfAT/Ov7r/3f8Z7c3/09zv7s//n3Yv2D/7rkVgPEki0ViMrKUXi0rPns9wy0nHTlvwwEdebr7kt+COdxfomFhV9epDXQK0Y426t/YG3QXkUuSOaCv7ktvE1GS4gA6zxz7JgD3vGeET/JmtmjqeZ3sOGyUR6a8WfLqKbAudl/+0H8Xl//BCU+H/3b+Jx1wbg6gg83JaKcSTGRBBRnwVpEAFVUqR/b5Sr/B22QQl7vqJKStjkXQFJvGytjxrZYmvz9IicDgOC84z2V/+VA7+WrVJcVn4sHv/1E+tRogIpCHuqBdsqF765jj3/G8sL/fdE+Dp7jyHmg9JSvjYiSDinyO0sq+YT4at1GefRGHNGmC3/7LXhESZbZb6u38p5ZYmVaOl3/cyyiCUsFTpaaV40xwB8I67EZG/kYMhsgruhbbM+q3Kuy3dbBg4igg8vDnbICwfNeGXMu1rR5hDqAPjiXME1I5d8SeWjdmlD/5u2/TT8EBlxg06nAFMFCUYLnKeZfjT++Iw9lDDXIbQGlGK9cArWmBzbV/Fmn1SuvcFTNQqeCh9wSHf6hO6QPM/oH8Z2sGWEhx6dTS9UdvoEXAqbfJNqQXE6gW04T2vol27wB/YkJIj5+Xk9zNuTz4pcy5wX+svIstM4tAuO98b3bYA9SQHDGTxn+SZzFn+Aq0NxdbzEOH5YW3IGVgRYmOnNeSTZBLGOkIAzbYXq0QAsDxL0jEMTfw3dfRq1wXlhJhzvzN/GhyWkc3NB9tfBDi/zeFchihg/HSJ+CIqXCWLrpXbtBk7aWlsr4xv9iRt+LKpmL6XSvIV4ZqYYbytdysMlJSz+pKXvWuF7rIIy/WL8DXb8RzxGAkd2S5+UYP4vWa7UzA5jR1tRNIOoC56XGJdPBipMbqZgK6nFlDgzJLMnEV0qavNjapiiTgORmh2RJrv6Q9/DYa9SbKfwnjoPjOw2vlKI7rMdpYUfof3hZMsVp1RrehtWf8DMI+iKCYMCE0S6yyGbkHAtgiuT6qcVYS2St4jk90Gccp5RE90UMTo087ffFI7W7jg4cyBODF0jKzJ6Uv5SdF48yr7BHWENEDF3cPqrCOGzhbepcXGDbzsneYBY8QNh5mhqQhjjBjqVTFBo2Z4fsGjyDG0r9Qa3fZyKlVvAtLfS08dl5C1/9P0WFOI+7lX/JwHTFLeaZZH7DgUG7qnnc0Y1nh7hWq46RqyIuoYsRqq2ORoEkCABhRzAjF+/LHFPllZ92LZpfgJh6kYdL+XkUJMG2IytwH/CyAzeSN/+8qfKpAlhsF8EiQ06E4Xi1DGBWvVI5jMr+kp4aiaTTFNyaduRkZqkDhyUmj3glIzTh31KImEynasN2675R9DKVj71kcMLeCDrHGUydpCsDbRP2hYuYzFbA2Ve7GQoYnhy8CNd4Xhb3sps4jjHpXfio8h9dQ66mmZ+LFVKiPlLgjPzfNdYFirpQ7tA7sUYB7en8rnP6UKuCTExv1DqyeOK4/4IeJsaNBNd/YFrW2s8MVPQFk/3vB4tA2ClOFlalxEG4AA/v7QHAAAZX10n//uoP//dJ///7mLhytrDNR10FFv/2UtMwpFEzOPEmMfRNRqmTaYYry93jt27Hv9SygxUVLCwztAY3OaTd4rXQ1G6T4TF05QR4FCFI68YQdbE9QCfZ9tOj2te8V075xYJd3xpO9tBu8ci75GTvXOcaRldISBdzZofSSo2haOfOFAiDs8UAn7JexE6gNSpHW8eV48Vqup1sx0OyUTSiGniYBWrEAZRX0vz0PVdtb63xEU9/O4TdgzuKiOygPDuzoK3kBC1k0xkeqiT93T1OuU3ORxgwfL68HhNKolz1Saj8ShItbMCXb6gv4TcwD/5/+603EITRYoskPIyg1Q9XpNX2A32Wn6085k0ZfZTsIeT9POsPBk4EksqBC7gZn86cw89+1UxZG2rSTEvDOuD7FyVsG5cbrHTbKTmq//1ZqOWEXuBVz1+ionPwzeDAUITRDulsS2OZYRrMSsXsNm8J+fTO+29D8sQ+NwzqNv3LP9XBVH+3qOdANl6gUVh8pgLAasfCxoXcsJYeKC/enoYy4y8d/ia9ojYG52/lKWbaDxFwWWPmIR/F69FwjBkzlm/6gqRaC91mmZOSmhVgTK0Yaiw8yJmwI9Ll2F2/Div9EgYEtAwP+7IesSHzyTFpfZGZFbuAAAPtkohWeIDyzt0FSWaAARKVIVTvGfPZc+gOl5StYn1gEdQfNiVW/weEamNCWZHJAD0T4kMOhBPFyoDlG7JYHtxtxu5OTQEucqsvJ5uH5V23b5wPjgFU+wzDoBkSVcRZHwWVpSfJ0TxjepdaovMx0g2/5wyQSaxrZqQw9VSu74Z4Mp9YA5klJNErFl9IRp+SgYLVjxmOVDPpYAJa6bGdgwvP/Iv2StMZGIQ7+KZ0aFyLcqG47arp7J6b1CPTrCFlDzFB9BQnMu9SUUAIHoq+ZrWQkJCGhDuMFkAvinMRQyGwpbs+M6FM6EHy3kZzzpG7sEanhgcanqome2oOkJrpyo81hGTbBA8kR3y8YxuIwnm9LtpYh+FW4Kobnt2/ynUg4dQVp8f4TuZkKRzeO8GkgHnJRyEh8Cwhz/KZI08zUWzFPAy+PFv5D7ptMI8CfRSs8gbzB6varO3xuoRvjOoF8nA4cLKzIR8tB8l6En60tiH1evtL515JneM20SgOBHmOcUVk8mYBKmxbmUVhoI8uMf2H6gCAXyDp77uO2xImTA07dh2rf9YUmSZPGTee8kWwM6VL6HtEBAZj8NXHecYQvRLaXmphhkdkjHMO75aKK3nF88THaat/Vxp3JiGVoX2J8Pp8J2B0OlykG3lpuFCSsetlFnxzfjjM/YinZ43vgsZTe7M18qx5Um1aFpMZMQtLpifoo2GHv33sJwSyprfK5ub8wCo17YCHLYdfdS7WR00Ymw/6qft/llhPUDJ6o+8zMY0gHDR/dGWYvT1aydHi/2JgD7eInJy0Mfa7mH+9C86U0UtbcbCipo6SHc4gd+hVEBqwY1+Gxj4YNAujEvYxG7pxWivIayuNxyuk1fVbI1w/mX+n3q4YaC9H5tNSr9i+z5au4q3xqkIE5snN4IXD6TpJQcMEwVfGiZSCw4eiDQI7bnoSvmnK5jCVW4C0P0h7rP0i4IzXxKdP50i4+pB83GXJEIRytJnWsvMSg2l93GcdgjHBHsEdZbfaCOeUowXHy9TVYqqneICnpkMqTlcSqWv1b6fDtivXn5J0bTV4/BLatZqW8A+KVHYtnTG7JKjwMFtn5NlDL30Vm9tGc646Ogc88GjcyWGL2PvE9VH+JyGspJ85ZiQbfj6Cwe+bKLg5A/VvNrqQQxmoP5mMTychmjZ1LkloofDLiL6mrJsGupmLkx2OJMUvYy5Gwue9c+lx9uTVWiIjUr4cDPiVLsYGbcVs9oHhnVvjLcttfiTJP5RPqCG6AqqNWpt6MM4VF7gKM9StGy5SbLk4pdLAwtal8TWLemYEJN3IO6QuoRCMu4jMROU9lrz3PJzhJ4GeOsdThsBYlP1hXm9K9LQ79r56o3jz3HWkARozA0DCXQ/xt/KkRJqwYNa0JkgLhAyTX9IgTdHdBrZiOfmDa/b/E36u49MHkzOZoHu26myjlzQME+0QomOmwLbAAagOKwzpHjuRqFSU6FaX7o0TlJpbKwWgfrFCXST0FTErQeeEzpSvh01ymo1z34i/BVZc7lQOABMC6qut0xBKdS/Oq2zEMtGWWR6ACW7bg/c5S7X7Y0prNSJFMJQbtD/iFvj4vgpIYW0KJj5OS0CtRcsaGCCr++ByoPTGsCOP5RP0WC5xWgQYzHuiDuguRvfrW5pZ/GqdiiR1ezsUA3OfZn9CDWKjsAOiIOyqKTQrdaushNtTAIxV7bEEmmUL1eQY3fvh7+VEUIU7Lwf/WU02WqPsrnyJiqlYeK8xz2dCiiYAK2ATsjmJL3GjM1VvoHNHlPrvEiIPPsLNaNoKfDMyOwHLVzncSvZbBbpT6A0KWllUP29s+O3QamT5W/y3o6isWlAyFmmxkWFYfrb6qFQe7XIFD/VzCcvWnQqE5lHP5nduPcdXvxSbQRCP35rY+3tRne20wDiIbOehm6rNGHiOzLcQ20MCbWG8jxD8BX9s/97psoict83bltzS0Qll/zArVDMbEf25jZ5Rm9pRbYfxipgYCv9ORluF5V60XT6pMlNmvkbiKf/csXZ4lLFSLKEzdRchO6THPDc80jomm7zBjLNFsK7Af6jHNjpuOcwsqYBlrWuHcqqBGUOAcT7SNsP70O01yrQgNAqRifW32IFUy8AFgUfY5zReGcKofubiH6y31kF0jEwcSRCyLN0aSDPga7puoAyvRjvpt+xgOXU4GqVlgVsbzRFR7/yADpmLUO35EzckukkMXB2c+mU45BhDeQsfnc9z/JCqVpmVoMcFGZeGkTKkfcU3TC6y/nRjh5fkNZ57uAWNLTynEwOmQ8KRgNMFmTT558zecP+dyiYZYpcCoQDqG0ozL1siYDSR0ALtvGraFbuYI6m/2SA58ZJKgGmTN9Ff1O65hIaiFq36JaWXZ6tFZHqNKeMkzfiB3+bJbE79aCvxWXPy7suN7z5Gs+GF4fOQUBztqIjgnnpah9F8I1m6Goaa0r394xvMLOHNUCBwbpWvtsANuT+whrK8X5ReMjquy0beYlJ/qnWjihtqeW2Mbs8lOvgEGPuczISifj6Vnyd9c0caZE1xj+QXD9eAJ2XKWSZI4pbBP0o2cXnZCNgfLW7AGxx0FYToZgccROUFEQu2iHlEQeY4E8pZ6Gip7Bi07Far4da1f2QJ2mL8HABGqB8zJcrld+OHYxonwg8RrNM6xYl1ZkqfPs62GETK+V6VQ3X1CgSn29hkK7DzrfVPUnWGLxh2YkHDd8ldaF8wGhki/rwoXDdPxT+NpPqCCQf26vL26/cZ5bWwHLFH/Ef1cNx3umBvQODNriC738jpOZCseoXSMWzt561CnSFBGCYcx+2qAOkB7oNgPkiii17VZt+dpQI9zBiIGUGgbovb5f410J/NxOSOgPND9CYq95lwbrkTpuAV6HL4Qe87SHWpjBJV5SW9qc6jCzFmlGc2MJ8u9Znr1OyKoKBK9yWZib6eB41cCtjOFulPu6firS2GONwMfw4J91q2/d9mzF+T76sJyXkDJYDILA/XP7HsXy/6NXwHnmKTC8bR+07MM7/49genOxlSQuj1C8s20+TTv70UgheXZLIvqxiV27k9maE9D7g1gmwhWkcF9zix1DfHrlppIS8q5v7dt1UFpQ1slb/GuOsQIYdvR0Z6MPB6jNcKHe2jcbPMgwtyKFDvZxtrI1MlC54knz5+07r2mLzea7nMnC+IzAlATbBZcKN3gnM+eYX6fZ3i6F6AfgoFb9Mudu/lu6fmNO9zVx9CX20971TrSPtPHxAagerMaaRaDuH5+7zH5Ezh6zu9V/RsjdIwSoV8SAf5LmgoZQBf+hvqJVr2wDFu3xFdDXgm0H7+AImCs7+2ngvZyTUopG8js6QswpgR+Q3prMiWKK6EhVKyxWW+ZdZajbhcu0Nj3WINYAoRF2jFPeqkIVap82si5itA/IAX6QgKqpaPAtS4yjvAsUxUQohBvEJwdRY3V5o0IVOOAirk0V3ojT7N400boZ0sOL07QM+DyzYjvKBJYWgZlY6yv86XksbERHOi/sj+SNHmH/3gjL5ZmBTUCa20a8Xug1+62YkREAghIQ51TqGiwU+rv8DBXHUm/JITKSeA2DyMP6ARygSGGcHrszN6ajTN6pYtdhjMUoePnvdCx5CZLwLbrQSu/aohNFVNAGWWl5snDRtleE54XTgfImpsG+KydvLFw8FD7L+Lal5HhvpC8DtWpoA+XYlH9bV61a7Alt6c3HTQ9bd4JuqGVuTyQtt4gtKRJH7TQTV4aLe3PvyQji4qwuUh7Fpi2G7vfqLAl80Fed0sY4Vel9LXVF7ccJ9Kb9oJ6RNrgCb+YNnKp+7MlDnwi1M/Ec9rbOnElU1v8LHSuqn2yJRYcTVsfY0wCS6WgdaFU8X59DFZiTUeKaaDWvyGUydZtTD+KDXFtaYD4+mtrXeJzhuMUTU5IGSEw4xMU3YiTQDiFiUFTHkMkN488daO49H4mXZjLDs2IwKE8mogGMwoQNLa7A8yNJ09lZv0NVBxZaah5TuBcs1yL8Cza7iDBoj/YvTVGJhfQ01syVBsLee5XF9686EMZgAVcuMPx+ilu7MhWSrZ+cFkxruVDaMFv7Bfd1FTMMu44+q5DYIwcSh07vbCZKWpXgaCc8tiUjDzgdZk8SkhYy/kiCfiLyxScDHjiP9tbgwUOHsZjxL981dWzS0LMYmBSTZzgXgj3t1YbI06quRjthHcxqhbywpgpFBtLcINp+RWonI2x/CKfOdxLJlZMNVgbXAtTYoN+vJI7ntzfs0o+PJ6ppEvCHs3kx69UGl89R8XEa3u7UnmNznlOlshJ56YuVCiGviTZpLLF+nbZ+heSoYDIHKsqnFKpN30VUcTzY6JckiS0WF/frctl76VfB7wcwiDLvmyKRDcMCZwl5QceyLUalgnz0TbJIDsNSThBQJ1/zR90iDIZ9skJy/1nqgI9xzcVbduGwoXDGmIf7zz6+ovsq7+6CuHOzGtXGknVFcIaCxTxWCJF54A0SHzuF2vt0eh6hukWbMCkMotrNqTHnsLphtbcxmfHeIy21jOoDrffNHCT+RPqQkYVv8JfQyJpRX0f8Zn6Xj0gXWC2cUZhYA3LONEL2Yok3X2ZeB+jEYpxGDDkPBoqjK57eC6jwpiYI7rG3oPI77Cwk155+GMue+a5krhitlXpHvejZ9NUQuzwZ+xu11vQdGr6i6q52RRhqMO1U35NYK092W9/AWaLT4/8a+DkD6MkZmfJd0hze9lBtQOWLgy7acjk0/5CGLTGrtbOaq86R5xrniDaU8Js0IUn3unyPi/zXVj2rOR1NGvDhBJnQ0yeJkXTByjWNPjYPQ66DcRsVZBfoU6PijEsMBMSh/Bvvj3JfEBKmGVo7FzG/zS5mPpzDuFE54EjjVnyLIk6qQf6W9v68whgakyibt9xtpn7wBG57KtZIHuV1h8PzebQx/qBK+P1+6vt0AQetUzM0CnJG03sOg3TdmglnBHo2wAyHE1g6nyz5lFcUWXj/BgOPDmuzk8saIuVO6pxi1Z/IyFyQbvvuQ0EQKaNT+DFdVB9k3W/33hPlgHlptVZdQb3696o+3sWPQFMoxHatYJo9jSDfwkQdroXuudEJ1vqXAqY2BboTAK03eMyj/DvgOH9D7rGIYBwPXhFkUS6xKBP2nbrxq/W4ebF1CsTfCuD3IXcH5eFm3h9akSpKp6cOU8QRLE7t2qOPiVSUDDguZ2YW+EFZ09zich9N7uftUr//uoP//dJ///7mLhytrDNR10FFv/2UtMu0CCWxeywLKmmhNsN6vujLBZCbhg6p6iJfiGmIcLKSKb0RmclYczPUFQ9eBH8pB/vgkl5zx8stQY8HxHi4WXSKhuwwtFip60QGirMx9dmgMg3yCU9pxPa3am5x2IF73DQ/tp1M33jK9d2WqH5trG5sLIh5WOd9K6TEOPxNlO7zwgEQ1dh++XO/czYdvC7Pk2si1Ut16iZm+O5O/Ddde/iIpQ3WzwMk0Mzfyhog81vokA6gdXx3CFwEx7S61QR2ATjtgRVchHHCP7FqzQAc2XhOp0NoUHD3+K2joi2lm4empEsTDhucTZPsQBvOir8H4eqyqC2jVBS4Nz3rY3Y/zbRqH9bl2CtFoKvjPGs3XBuf90MUoMlY4VGqvTnGL0HiZfc3uqHQECGVAADbY++VNb1BOnRmXYJdNEBmr3PKA5qopivxLKBDJzw+s7F70i40GsprLz4VCbVNdXNy49XmbIxdwAoER7a+s8InBVewBJycjOBlMW7kfaKvAqrOBotTfAsetCbi9s+0AGJlOhOgdRjbP9pxgS+g4nP/U4OP4jbwbTh70KPHGvII+/z1fd3T6XqryhFRePFX/TCcvrd3/FqTIjioyQIhTjV5a2zTuByPtJbXZLCQ+oR4zN3cTNvP5G3dS99bb0hMj/WOvIljisljcxdZxU76eu5eFeXXwrNgltibyw7ZfVTxffNZdRti1ouGK9O1NsKtwgsKVXad9xPq5EtApQJot0e4rU8f7Nle0iFYPGholmjuWIeSh6pt6MxseUC7YybQegUfWOQiWBLRU4aDRqgSbXPAcpMCTuHHUkTunpw0bdqWtzrrSUFq/tnoVeZSj4M2qomx36qDxa3QEfWXyyuw7Y4lplNIiWUmCK4+D8wkqcY7cL2p3OaFptje5yc5zlgSE7owongAphUuzXTYihuNKUNK0RkVyrXgEGOtN6ZSUxQKrO2bXamzlR/XsVWoHobzqvNPgTbMiaaX4ibxgtHNw71xI/onmUt7dsHzoAo9RLpyuT4Zx9RHTzBr5ldTRgmo+QH+tRhbCtYF3aH3gVktl6tc3TvakhK6znpdWg0qIokf7MS4A9yHpQI2vhzIljDPZ0TZbP/yZv4HzA3lU2Mp2FuF2yKZnRl4c+8wTK1PHnHUwKJs+ZuQUze8+5oqOp/BDkv1VXfLWdqy3S1YPFyhvFC8CUglHDCtyaRdF6ustnWT7SnqqBZk8BvxkGQdY4/neJuj969YVS5XIWYerq5MHutg+4l2me/7oV6medc7wfV6YRtUOOe3zC9gWLzyjoHFsMXRDtFWh9cm6IRxVpEifAghxUALJ68EF//UoVhBimBXhJhoKUZ+AQtFxnSb6z9ssWOn0a7gHY4pvJYpkEjq2mTj+m2wrkmTXHfslaSqzWBlZK/lzYRUEBCc+Cwd84SrRC+weLn8vzaYd/fdF8pxF1eeQsJzegScPZGqH8Cp651Qzo2k0tnmQShsheLATjaJpYT5x3cbgzAc4h03CC7eTEM2P31q8UFQSP8Rm8kBqbrpLlx3g9pFs4uBIlTb5e1570y5t7Miw84CGK6JZp47pJY6Ll1EQFHKn81y0GPoqUP+0Kjr4H/qg4Ahqb75n3jxF5DJ4+ZIHrEdPl50AHS1r4h2f5A9ToXdi3IF5/r5zlOVdjPMOfw7n8EIuIjzHgTTt89ad2jOCtDyCx2XWrNutkr7TQiD4rKdWmRnRqL0lXqnpme/1FDPxznTMxvRJAMrozm9BQueiravqC6oaXx7FXJSSYug6rh1zVCOE5KMI9RvPjAKeS4wrUR2GS/tN5pvoS80cJiDhzKgMHN9+xuiY7FHCBpgcAsF7pk89G2tbCPeDc00xR9Xg2vUfY+RS6cx3kLHJBsBlnw+7GRFQs0JU+jQoJoCSycOzwUEj9HDB/4I6z96cW4B1/evVH3fdNVq067BUwGz3Iq1olY68u3AbcS7RKUMBT1jIYWhj8hm/VBz03YRSnzaG0pLK5YfbILMUqhNC4TV0sr8HYqoz7lTKskDuRCzk0AkYNug+gDOslw4IXvAm/D3AJvsikaYWQ1av/agj5yiIODXf4VWDztdNKMlMpA8mTDs19kNxt2npbjADgsBw7jDKst8zjmmsT8HWk83e19OD7SROSs0vQs7e+bv4aY47IFKPJizomNzfjiSCLNEGnbzpfXUmSxzV80FkS96LZNEEWOVpgty/d7RrJnfxOieorGWrzcr5g8gtOpmg9BCCfdIt34L8ckXIb3vNAzzLc+ASOATnk1TEyz0XuY1ibWi3vvQtGpfgRvsTAqyzhBILE4bzsI0jZ5Ge8Vh6T6Z1+2EFiFe9kbZUBxSFTqfvnu0ASBY653qCxPV4hOHDcx1fgedXB73YojH24YNWfF8aOUhiJdSoNMvM2ce6cAREtwa+bKidbSZSr3V9n9DkvO3SpSwBi/K6kRz4kq4SDXWgnXYFfzEvPRJyB8is59pugOTrjZJEkwDHelbsb2Pquh3UiAwmmmnXef4poXMV7TQAz0gzOjNGeWA5ckVPAjU+5+SwpC038dY/+XQ1qMhDK3iuTQxy1/EUKpbQ562yoYcEARBmOzGx2X3jZDcZqKG2aKeczhHO7iCnHfH3hUszfCy5+h/FIe5trGY9zJUt/gF7yEQ9uDtOYCQd3atP2dm30xlGIBB6u7mtGMEbdk31mzAG+7ncmFrkwpENTLNSLOLAdvGJqjxglwecL/05U7XM78W0c3zg8h9aHYzG3qN+pZzgNpTVmFBL7jgAOAZwFqZK75Se7BC0HzW6pDKop2ybRFuch+AMfePgLBQwWzD/qAyx2BqlvE94H58kVZXRLMU0VQHXX4F3B8L5bwSc/EOED/jnwJTGUXRUvCGOdiQ0bJsaFW759eUodUU3s8Prc2YSuEvDb3kQIJrJQiiZkGdz6i1ZgJbLLrzHxf4cG6jWhaStiCRpNaG31+y6CSaohatqJqCOTsD0VePetwy2zNUja9NjpQnC2rc6FPoStiInZFZUVW168xCPipzm2j9T3aSul9ARNjqnZhidIE2EaqcSoh1OJU9l9X+AP/bpoCR0nKIZMAq954HRTpgsdF+NMwQCv3d3pbAUY4Bq+dNVj1GnnNWuuqEwoj6Cd9kWbOpm66W3lSluqfHYGft9ZsEVakIlKRcRJckHwMNKuPwg+wVSwSMkbrBi38LS1IkxSgw3LSQ4aNL7laAzScnrFncqfLn/GF5OJEqfPwrHvE70JzTeQR9HmcxIfhT4yHfUBnnzjHqaPqbE8u7E7oXQlAlvGI+o/SF5cTYLcUGawjCvZbl2ZDh3L3FnRDggO5PorjKcO/k3wBPnQ8OtR776sDXldaOzqNps/6RVBL5vzrSqZFQb/A/NvGcPEgzdkrw7Gs54vK5ssHWO9itrfUzHNW8mB0Iiz5iKDOkv+qHxVXwwBPDJ1BxZBDDaRsx0+ZoMD7GpOUpS3n2abwzBduSJpSsbt3mt7F6aCVye4MH0mIQuv0vR9bqPY26EblDFJ6gT2lHM2UHB13PUYt5sw5JQz9bQ8lz3RaYiJp+GiP1J8/Ved7tIsRe5I3WM/BvJgDZs96kCrkPuG0h8nPgTWqu0fSyS17ktwSKJTsHI7bFPyiaFy3u7WYHEcsr2UQLPUfjXPr+S+rPS3I6Zd5u+1wilJfIzUOPi28n7egHd4N9CjTmBB7xkem+3C40a9OXf7c/Up9Mcy7ZBWg0MXPQ4NKSkG2kCGE5tAF/yaDo0E9UQQYlrUOZQ4kOffoc+/lY3rBEZ8mibTvAHyGgucY2H1+rURSb6uUZdhzdukAoL4iPJt2ckoF2LkADVC3EBCUwi4XNoXeYzrZIfhOXVQG7TT/eemkoY2OPGh6B5BKBKql+LI5fzYZkA07mR8OlYtWmD3WbfedPrDCYXbhIMeaDMiSq21xV5OItUWI4/Lv8OjcYrVAD6vGb4Uok2j1Zg+3vpZ61FzXEfiailKQHtzMnEYxGXS7H2eX5wcGpP4eg05nj7M12yF5qeWhMc8vwFYmyVIN4j0MWxB3beewr72uF2t4zaXSS8CwQ49PCAk9IIUCRlnIvalYdSMzhNa705XhZPwCGTE79o3BzJ2sy+Eb06qu7CBtiQg/us9mktBM5kqbnFrcPO0UnVVUBxCwc1D+1vBrJc0XDLw546lgLXKLOOycpXFO/Gf1doO+eMZ/gOqGuZU7qro7ON9Zc8Ef788947FcBDtzGg+2F6HcMpGaXVacJFcKjqb+cIM70S7sp+2JttM5C4VlRfEJSzvUYU34qYRKbPFr2Bnj9OfLI/D7syP8Gq0H1dGeOrtJJ5MPFlxVAiHs6B7Z5p7snNOUE+NIXtGsQmkPY8UdxKBO7zp7VMUh1JmlBg0CJMB/BZDpMans8J+SyDKxhdRvpOAB35EtoQHzWntR+W5rS472DHJd0dgYtjYJa+Iklh6lp11bBl5ti+jBS4VvspxNKus5Pe5Y31uwKjUDE1YAURko4NTcc4VA6msx6XcK50Vro5Ay7umadL3zPEvE3MrqeOeh3dlk5S/4tXNHVOGbraFioUmIBZZa8cj0f18lEx/frjKpBmLOXnVDSFF+v5hHhaVUkcK7EGZkyvzKwUbXZTNugokITmHpNmZTV4SMGN7O/kdpNpoCqSi3wyTXdpdIlylzq3sg1vTbczY0edk9z1tZuompk0kdQKPcGuAxxhA4GodmcySAXYwz+y9Pb+TCaQ0Tifq6YFf2hecEBHPe956Hv0CvMCfnWtJQqldk5AlCTAJE88f04+zUyNKeK/pW/9Z5dCxJMjxwYTcGehdDu9lOge9sU5QP+PpQ4aa280I81IlboJhz675xdhu39kBpdqf+luSPQ9t2mUZNs1v0jl6MAfEI59phI+3gjTC6TZuhRCjmL767R3p6s0rHeTdN/+ERpvyar6wJGP5cSXekZeLWCacV8zYJWsaZboJWp3QySPgf8TJGB6uOsq+gnMTdgu2/ynCoEFxBSpTjk+Tn37TGjA7UjzglTmnN8Pfm78fFrwz6xDxQVpP7iOAEg9sBuSbOHcFPpUSSD9EuQ0GHxorKjIfIGfUL/C+5M4i7CS5F6sZcD1ck9qmnuEXZY4D6xC3czoiQMg76RXgZHZjr0ZyoxDydtNf51jR6uSECGXAv1o0VfPBakbAceIx+znL6qkL3k9TYqs0EWHHwC0jj/u58T/W/pAtNblOvRWPt4Y8DlGI5e7/tHCHscinp7ovM75EzUx2BB4QP9hOkTBMO/XTVOerdjWSD98OURaipnRpWebpM6G1OCeh7Th1sbE1rOCOxAG7LVI4Fiv56E9koIL75DrJgYR9FuW3/fNI1gR7D4/pBUQ62ByAPjxoyuUWsezZ72aEPzEkxDaTMM/IDbK+tU4Qzzv1eVxFMfrC8mEK47zNS7HDgYcLh3/iquAz37d3z5Ty97tjMc4Z6cTyM9NyLFB7laW316nv+c5FAp6Yj839vAp6LahwjfYWkFkt++xUQ9bEPytWW7KZ4cOLz+XNpWOgLZNKVXJgLes8qWR5yzZ4F9NzZVPRCp4Eg0GW9AE/dQsJd3pFtcJ/cf4gLbUfAOmKU9WgFf2Ve405ecIJlARKoFm06i8oZZxRzahXNMAeHm7OkGVLYJrPDXUnxBitoGXBdkxOyo6WvQkPe0ZRKWS2QHwHc8tQ1z7HQe4EgH+dcbewDERn6T2j6bF6NCygGFKbR6i9zBIgx+69hHYTMdAl7k+vorfnoVXRxaae8rHgcLijrVAULW+2BwfVlWitfke4srB4Xa95tJagjd99k7/aj1caKWWpi5UNO061Aynk0zXZ6fzB2Vxla/otFFtwABNuPgJ3iuPUAdRcM0mzSrwHj24jN6LXRVJbqMkGB0hhrlNYqVsQDS2ZbUMp3jvvGN6rz24JNNCgaFCz7jqWVhkgMQ0DH+6rb/dQRIVxtTJv/bbGGhu/MHfzhqyh7SxUKAf4mauL1LDWgUGr36XqgyoVyRo9l8xviwAQDVoZqDwOY+UBiQCX7jLSh6uprfT9pBtXSfyz2spmfJ1ZUL7oEvDoVwceorMwQBVnXEM89k8q6/CsmpSNDia9KHbvA8srS1ztpNGulpMBQGS/wjd+u/9DncfkvR9UoAgLCBKG3mbSmESsUtXNneq/7oCY5DyL89tea7atNc/RhTMP4YvAeR3L6Zn3ToKAzehnSKw4hpmFRY8LUoWMo5GheRMDpp5gLQh/VxcoqwMvTv3iHspmz7g+8g+tg47fKjL5kSTzYEWupJ93lKPuh7vz+9juvV5Qgwhmwv1n0QxHCszvkcGuQB7Pc/bbHTkVZDguSgpIq1MQwGLSVmsmJ+vtCw+5Vugr1ihhpnr38sk2zq4/9/C3TUS0MXh6WhBlgf+iFkrah2VoVVygrI89pPUs0wYI3jWlfgvlObIBcCMckkNxUQmT7s/8lFSnyEx/lLebB4EaoiMN/YqAtHe+pu2dV0ss8mp+GMdpeNeZez+RS9ZDpIuwB/66AZUA3gwLl2UtxmZlVyTForh8MKEwDjdg1qSt6jU1+EzeSFs+mrnRQQJzcHkaCe28ww7dUlioFsZ080p3HNcsyVvclhFNFIhmdkmxirSi3zSVwuwKqSa6r8c81QhIb+Lop84PC7yJSqk1Rv2ixVNKvZgNJ7aNpYCSYWrpr/tIp766D1Nx9vQcKDjbloxOoTWYbrwYQfEEobFJ6DOHx+Jz3N2fbC299fdPqof1RpML6jYHEA2t4VI5Brv4Yvh6gnphCx4sD4eXYewNLQeNg5dlTJJxyYKi7SWxyXzzBTSlNu3GwVegicS7yyb8nKJe3QLZBRCwq5boubgrxMJ9WGEplnNZPiqVB8pfwFGYmtMLv9U8+TYVdEsGNbvPcektG39YR2zMSCZkAwBg2IU3T8Ddo08b5LaqQxIW7kVBF/+KPAuqmvdE5TIfamwZjOVRIdggknH6qLJo3gUSCjEx1eqofpz1ogWri/JRn/qspw2NQueuwufRV/8uMqhUfAqvBDdO3vjH/HKkcxgbsdRjgVQVDupwzmQInMVkAmq1oVy3+e0crvJYt2d4ro6ITx0Dt62Fp8tuEy15ozZ/SjndoOFpY4L3+EdcNJ5HO/TFbHCiR1XcXhz/QmtXNVQQ4lZuH/nNOUtERxDiDWVwfAZkBzc/QJvoOe7L9foa7bXUX3gS5ohRtUI7RejkKcg5N6SO9CUej1qcbPSSKjLqPHLStUMxXYK4SPV9ZTIGnxQCoDe9Lch7TCgEDsRQMbR8DySL314HfJIimqkbZneLhaJIjSzFfTXA8PDYXUngONbdwmOvAkXPxrtFkJy81uHIj1dKXrVaaROVmnoreZJnP+8ZFPbPBFXN0tmXZMliPcIsNNGZKT4P73Yv7mKDQ5xY+IXFkbAl+rNzQeEUPf4e5+tUlzfLfI9aY6HrfIJ9S311DsOqQuvBQab34nbpSsXeN7yCGphRnVBnT2tbXlvBC4LXuPMvtUPwRz+2VmWVjT+hBDNjy/5+5rOpsdt+sugoOUMgeFDBfMHMoQArjql5L3uu2KF7sSGv/o3PqhRB/dVnugbupETb7LeOcrKnfz8lOFeYi2czSw0c8D5ZVEWOAhqUNK14wp9gD4M6+iTmx57mzuFpAOtqhiEWutOg/RbjPRGcyd7Ce4DpRmIIUdaPcVxVI+xuTkckOMRosHGjBqdFE/48xw3AwksykKJrFMSCxEocdfQd7brxQgbGE3+HQOlgFvHgCsWjIDjL71S1OAdc+/aH220+Ga+rRfgtLPCszakAB1g5ryQlpCoVeN3hTrL2aODWo7N3n17gqoZJRrdRpT10bWnZu+Ma/sjlRjH4no6afwZx34HicEcNCTQn/czkiqByCm27CT0zH4E0ycrz096umPiASAtNosTdmSflum4zTZibJeHi26RsdgMD1Y4HvLCODTepKUDg3FCjCBFAadW7NboVf+RXTP5X6mBTLkQ8YIIOoekIFouErcPt6iHREmIncn5uycf7OudTaXTaV0pGqCruuXx7x6TgIFvaaID9NxwLwDxJuox4W+NVMhvIhkt1xDCqgFEWfFDd5eOCWA1jIZMUfPtyMuiEDYwxlcmudIdJWGUZOGNxn0Ykp4JYitvESfUA3CNvpmX5HkloaEikoEf75H1CLCLvGopffvaLiFKk9FnDWTGT7VzJvbQGHV5Z5NsykfS8oT1DcyphWvmg8tIvNipTs6NK+nsKrpoybB5I2i/O46+H8FpauHyLym9LMh2oP1IQcM3SjtHuR+QnU94RWHEOQNXFwGBBI3ZaydIf5CpdPiynXLQstxOrV1GoNGA95oqiIb5r3ggNxQeTkebsiGvFRP8ozOeNrYR3jRUkn8+3EtVpYMg7k1kRuc+PXZ5PLfhzwXZ/DLvNltBG2iza7qP9EzM3C4UaDdZZQpg8ls49frPhNctWDlUsW/ldyAjvoaX+dT74cJHM/RNz6pAYtlmo6Xz6N50tC0Edu4mZajLf/O5oo4bR0NYJxdAoLNXK6x3wcuDHpcFRtYxI51DT9aggTnFt3cYyP/eZL9ecfmRN4Rd5WNHV7DXFX4iC1ZuRnsgdIiuzmODYJ3e/UHYoqBB8o9oWW7jdRUNFTmFHdp0rJEXhkUm294jgruY2USq1BhF/GLMkIg3S7pNlUZ39tGkWmlbDpjFvJEWuZ8nDqEX0hTXPt3fL8FzHZFFy6HyokBNan3psTLOMmwXLlp4IjiJG1VHhm5y7020XGN5sJU1bPZ2AxY8uMxnyh/Hd0YAziWddXzSuDR5Qs3I1a4lOpBU/deIE1Ysn+y6lWxRw8YQczJkoKtcOb68ltC7fgEKu5Jjl8UF1MzNkgBUrb8KCiwplbMXwPB/dYMQkr6gN0762n6/2T7W9OzaUgthvo6Pz4go7iGEYDpMZvdkn+q2uU32z5siw+eZZARxPPcRInq/Xt7NJcQVjpqu8MwB4qVUezCMqXU4zAxzCyMIMa83f9n9iima6e6+6IK7+Aw3qAzMHXpjr6ohNcrKfvpJz8tkHNvd1m0/x6dkWocgGslbIKbZK+Feta1bNPx4CgVXFyvwszrWmWwGom/0CxaJJT8lMj7nsobsJjvR67V04P4SpeCKqPgXKnoDwhJuDDGbGMRWdAzPJ/5i6kieH6EAmZtrpMjtdUJB5DlRdlUeBHAYVlnWEaoiLZ+cq8qMaQpqPM7641NkSrcw+pC1m9w/yWxFcV9vxsr694I5ZYXSOwj28E2sXChlJSrONyINkkqPeUYAYiXyP0UvuwZtDCb/M/1/eLtHasKpzCaJN5WXZeBz6wurEwfIknU2eYWrCuadtam3HgSCd1fcdRie0p8K/fL+9AYNi/TlQ/czmzNfmKRS4bjlYYoSyWU9lpMVRR7po1yT2m+xBRiJw8SgC4KWQyPpLjcTqGPqbBCL8Jl1pklwRt/I6o7M+uM2mxu8XaubAg76QauE/i2eBt8OjFn56YzLI8YokwB5s8BbNvCDyj23fh3f2K9Bx8yn6HQwpNKELCH8t0r2MEVpSyY3WS2oLSl+nvsncjH6kSrctlEQhz5TnteDaSpuHbQOI8NxIJP8kU/kPDj7eqpO7PMS6Xu1eBOcsI5X3Ej9ySgbwRa6EDhtvNYxRlaAe4vFcSBDJlcJy6rl+7e1Mdx8wEGHaFB1/ZB6Qn4u4OPU1GK6kEq3kGk0aMuYEHOxoKXOYP1OWz4Mi3t3nXTdsVZF1yVv8P8fplaVVyH8L5pjQut2IIm5+gOY+mvizlEk/QT0A2qdCAc1IUaoyWeVxuuRa7l5edpFCVxHoWcTFSl37vNbvKEqUQO0nWy3SxbdYHQqyx/DlwCCEtflGXfwpQwUd3QGzj/N8TmtKUeu5rRWGtRR49EEfP6z3lEtBjhpaEKLQV2KgW1E/3NcU610ZVGJb3wAk7JHd7A30b3KOdQx6A5/7B+w7i9WQMMPYsfH0rxZIroUAJfVe+mJ2mFqqGF8F7QJNnImzaGz0u8G2O4g2L+hA1hXCdt0W+N/iTq6vvvPX5Z4WNNhhio8qVfCy7UaXYZT296je3YCAW5B9ej53YIpQ0bQElUUR+vvFHbh4DCjVWlTHf+knQN7uDGtVWCvjf0lNN2IixV4x8HxiHamlikv6AQC7LyLAH3HgRj41daLELtUGbbJ3ox1tt2t89JoMKHxN2K8TL7mtfDRj078gaj7oBqKJaCsAHE+KDdO+/Za9OdTJ8gouxVG4dL30qrg9cwOoCJZ33PLXQyWvaMd0bbgSdu6RZYBuagjtbo8cr9IcsBh6sPh0Lc5fI3sUjvEeLshaBKaMkqyQv8HaJb8NilvyS4/EEoJDUx5COo0gXkMCxTTBvAa4nJ17R3SMTOXoA+5qKPJZd5h4AKOpJKUa1ssBkBQM/WblfANZLIbrcZWNuZuEU8k2RjfTcIAkGPIj4jWJWj7jJLCWsKVDEoOGADflY1OpIOvMts+ICTZOGqiRRF3APebaAIqYYAhaLw6KBq8VdWO/7HTBTnMwf9Bcn8go0Y3mufZOJnptmpqFze1iUYv5A0EnpQyqJ92Tw/RvBi1oUvWV3A5UrXMrYUQ5qRgXgava/OlcY4sYl4X3eem6pbqaTBzLmeuhPkKJeQ/owWYrSIqSRlmygi9KvgAGqgTUTkxgdedFKCLxQ3b0E+gtQGfZyW8uzRwRGlwv6I+sgXQ4S6DTJGie0XEEgaRHSafx8Ix7w4WNftNUPd5eyiPIsV/jVAYKsPD6sKMjjdHsBchanJCRJgUiN6jfejus/bwNjLWzNxChZHb49/YSJtozXc55U0H9Vm+d9cDYRjzLc8L+0mx2rxnFYTF3OkItUf+oJmvPAAiaSJCZP4/DKPIzVSuBVzWgLYiiVB7fLR+6xyLGvop2oXNDkRJM+HPHd51YVn0QfD2pYShu7qa8QCNHza3wvuGLdt2UtPUvhsGZrGxB9bYeiRY9IxmP6jz2740n36XlJ6GyWLCIQyadpu7KbkRZkWfkfyjjOyQH/EfzqX8HBu8LgjSq3Zg1cpJf+wp9kiC+S13Ib0EHEcR1+KWBJq813IEglZmou1xgZJvx0ZPFbvJwCHf87tlvksRur32+eXH46vULc+vjvL83Yv+rngX8+HedxDfxqE10M8Z9+cNsdDejZU4jk160SzbUBma75ZqIEIekrXOlHC6quQjRSJMt6z1bsJErs+VdroiWt1AfS/LJP5pbyAAWDGIAefkzBs2pkbn6QPjJgAsnctguznb2x+dwQl0Q+fvIIlQjJrYZlUZwkOwZ/WpdNkpIsZ8wr5qsRwFwDxaQ6kSrrtpwuvpcUXkWAb47rDIZ5VKbfoIeIFkgGMZNdnl7M2VdBkb4HmGisN+oW0NHQDHYSL/wqxi6qykzk8DMKe9HV4cN9RbTs4S4WbWG/ROyMt6hGvu/C0FHTSYj5u4yhQnOA6hQCDRe4egI5M4cV4FUcxYdRGKoBPYOsmeJbYsdp/lCXiMA+KPMEVcBdjQYzBAQNVW2cE49lZWg36ojRmtQeH327Xag/u7ie6OqTevGZh5taejfbdIQPrir3LKyh8wTjYK0DWRTNeL6kOSzuSvJ9V4QvPbosZV/B3M73duikc3UwwuSp0ggolKRqcN28oqrW05NEVquE3i/7fEEq8UZpN6M1lEoz6LMgR1cPkLU5EiUl9VUkupXPFhIj0V+uAYc2Bof1460R9SHBpWkZ++WA75gTgxtL6ifIN5I9McliZAaHkQNOVBEO84obOAmAMXZklRpOBnRqEYnrhMvvt9+1o2JUOE6uABnAzy21m9u3cxENw4KGTd5C+zhQjHipKfNKdpBP/NBSnGIabemHOw2gwKRxKwfvxnWJBTjqVExrErbNcOpkOEWSTfkAILbPFgsBXyaNCvj+6fC4Ht67iRruTdvfDks0n6g9KmEjDK3M7nv/e/ZsBUcYEjiQYtfFBix5u9K3I/7ULI9LAoMVhEna8DK1HIkpGO9x0UdwSwuGxyLSFtXxOHNbvXsALbA4DtsDCoZeM13j7Qnh+dDwCMCcP74w9O/gyg1ip5NzX2BLKpT6wyWTmmoLtltItMB4tg5jf+x1gvZNHOzTtboMvBa6ZENIg1ExFPiEHC0ybua5mW1cV4G4e6MSF9OgwLEvVhMWV2DG5pvE0wCJG7kPiPIoKefPVrJVYEICm4IzrMDl3xNm2U0hDpOdi5TkdE60P2xE0bOPlPwMC1sGoWGZZTVOQBQER+kRn0VqdY1NjImfRLMeI8JZZNuwAkcTkp8rT5J7MbKe06bxQWlXCJiEuxUhQd3Qb9xWgdMJe8nweUCkzAvpKFwfrjNnVFrrtod5U7Rf/KCSWXckN7lLI6vO8EYQYtwzdJA5bhWIrYIuX2o8PnzSJZbnHyfPeQ1r75BpB/G+9e/qzPeFUhnYHI/14v6TpxEEkdA292f+N5ullszP4pPPbxpPIXjrBnGTBZQBsClG4ovUPoDANyXWvftQHHecrvGA0+8Hqno1mTT+sEInwaHmTZ4iHKsDwt8L0jyTkLhm/V5qNPMhyEjEFWx2U6IQ7EMfJ0Krd+rM+wbbFUleebwgV2poVrxoFNf7LFRAiTVKwhw4Gp6JALR6ZEb3JesPVzCthcGkKQGnC/N4ww6D97eMAleDM6+K5dpw9KltaWOv2iUjKT84k/SvckxRjJQmiyPS46g4tu7wxMlU7p+WiGLJsrO4w+357710xyDaJjPlt1VrGTdqkib/ySfLpbzdIU/qj9rY+DMUZGA7l8RXVpWfFh+annCFsXbf1YnPK7Xr9D9whVYKSSVJCrfexT7h8GpiiE7WpMQ+MiiaMozv6hBtRokBkrQdG3vZWzDKM22iXDShUVw+MWAEj/AeXQtFdaIDjkavXJbvK7kwr0tCVOdkrUYlGXspjBfEk0qZrzKAVnbek7YR5UnMQM4RlmjchTejh8jP4y57u7U5FQM8GEjdAB2B3IHmAqiFeztb8I5pNWT4Zg+2Y3fOo1V2P5ntAyGV4h6TT/ZpoWKH2sBNMq55TAv4R1Vqc3SoZXwPiqeoTcHydZGP7gH/jS0rQEnREWJge3L5BuK/B+uxJ+L3a8mb4SMdpLMJn4Qhx38Cc6rWsYkTG2Gl+3Eqdeyrf9uYWuR4vD+LNJ471zlz+naoyuxjoYmG7y9m7bbeb77uJ+1SadJLeqm1qcC/87IzAOzwb3bN4bTGLzHloluUFPtTxCozg+dx/Jf+12Y97Spfaxr9+fGuPJoS5RcPmJ0DVw8FQTybXipITL4n8GmiIapfgBjZceHbjW0zVqpSzZzHeOjIJ3EafDlRCjzfOHarmpG3/DQrJmz1iNbUCD4COlXc5AWSUiBGc2WdlUoAnsrAukXqZIldx4l1FWLmPvjc6q3PDpQjCKuN69XvNUTIqBxIUTU+/TGpwh65F2oqteQP8Slhp0m6djbVtkrOpOJnPM3mPR1GuLCoavGZrsfV2WEgiPZqSQpEsCXJGbhnuuAVF2ag2zbQCmIlUvcd5B3uIl/rsqCaLlnEXQIwuPqpNpL0LlHfMQPR3fWJWu+/HZODXgDS/V7j7BnwUGYnQvZCYux1YOInxsSkssyqMvHtxEXE/XPQS/4KaHI92d3X71n+1EXEcM895tqhocUAdzU9+tJalvXvEBLO3fHkQNa7UeZncBT9SM8NAXHxO/RCTWqZcOGNFYs/AXw8FAH6oB5dZz19SckFG7iWxWRd+I7HAMfIoAvcSOdJVRBIKKJBIL8e/wFQN++zfT6VUPOnGNA5CEsT4DEjdinhvY6YtZFfKoPKMkIK53LNhwW39dPYKZl3KIydSbMP9X7iy1/f6Y8zuzV/4L6vMbql5LZVYnEuF3fsp/TZrjcCA2UBY1TDDuSuI4yMUA81ToZ2pjzNU1I5wjupdE9flqb9nXzcKFDyZcEVEkR7USTsJh1NBGNRA/sVKxBrWglbbJ5WDZ8i7f5SJHOq+oty4o99es04H7u1l436M78Ss/ZxMIFk4l2CNSm2ktyK1y/FG4i2tEVHUzmDFzcXXIuQ1xwDTLltwCiQ8AGnYgfPwiQrdDUzSubq+QaGxnP/YF0K7y8pUFkTyxU/BQPmGyn5yKyAMfMIZHDlNGDBcG+wQV4uzQsPwz6KsM9KvO7A6NJ/UgBWAvICKZY35zMaT9HXq53O7O59FDMlHyYZ+XtsA8zKrAvMjzRSXk/cVIvQN6dGQgkyP1vHAaonCKdwvV9GUfKpaKv8/f61Rc1z9fLXvSZj0ynG2AmVKd/kv5Yyi0DJjN8/D/AhivDLEvrEQA6ZAGnEsw1OnyEztqrVpdlTCKhG26E1ntkI3RoinJVh0WpeDGeniW4O/86XxHCj9esu23qJQ1kVMoG06XJmar4fUc63tVWkQ/syGfbmgWTJ/Q3mQJ8eyx8EYrSB1jE1csdwi1Yg1GqAHQfuao17UaSmnH1f5CiRMrsXh5OjVatC9ylhuOJO6U8RuOYRqDR+AVRNTQ5uir58r/F0jsIUz76av89IMXrzR+IWDJgjhXGIoua+E2sO0oNK+5is+VZ+X9aBIpJtnCHMjCDsuxdxEPUV6j3KAc8kt5q6zFVbrKHceedRGsC19F3YHPntMTjh4vhU1kMC9ajTSZMoH0xqCSdLYhBugDXCEchLDZwxlp/TFu7+nXO37z3ogpw5VNSFp/yj/wAJbaLxKUdk5E+74TJwVKHl7bWz9bIGismtSLDNhfpX5rA5FfdXH4BrxBUEaTHZoTndwzUqDLsRtJFO2v4CGIfN+5QOumC56NI04gCHLwW9N9smsZIHoLJ6QvEs8uFTSmxCXdgCPl97cVmQ5vhSrKkqjxycbi4ZhdRSczqhMiqZrMV/DiXL4DWI/SARO8wJaDXqCkfc4bPhFbJ4vp8CtzgBf17yapHY2sqT3Y8axgYfDfn1tFCuM4oe9LSeL+etdDPQzdK0qOEN1FIe3fPmqWlzGS3UCZj3HYO0SxC5FbVvtYzcAsn1zUOxvNnJ4OMAGNqZTkzwvhUfvbVjqfmruPsdVT7MfQuejQ1FSbkG80s5HEaT0+QIPzWjmEr4+vy+3rmJXarG3OBzW1Jr8cE8wm0vGGTSyvd0J6Wrq5Et9X3y7+cjOCtho450/IWA8QPK09zlHePvvT/50PGcYMQBHrMVzrJ9lp3SFjzXmRCleg6BSkKE/ZiOu/kZFfYk7203v3BFfNGl88dZNHauPyaUc79fU8mGf3uaZqCK2bFU/xLja8PTsACb8FP7XB7ma9PNdMYvg21yOnSNgQfkNUHw03QJ7o7s4Qezyd7xeCDDSZwIY0vHTyRv4lUq2CD2WhUqx8pp8B0sln7KdzWi/VIogC0VywCX4hynEzYN4uQw/HbaP4uNNsjFgTL0BKOMnbuXgZ/z4hMyzAi7O1Z4qcVCJlZZ3f/nWGBpa7bJPIUFwwiZrU3KTDRAKU962mRdku7bYvLttJzUOQ5yEs5YzGXPROY9dBJPXd9qVQvNIQVPaFIYfhzQrzDGN73xh4+MvKEz5T/Ku50IyDTA7ftCQ+bGj3MroMaSh1F7GNlIb5ABa0K2RHcpFlD/LAh2JwJWgeGtrGyOTWTDKzFGTMd0cdOejVG/+2guz+oyhetfS82UrlOe7dz97vG3M5e07BwaU2laMV4iXCqQ5tSOY0Q/oDfB2mfJQnERmySKmnTw6rP6jM2rrpde22v54HKLPYiDHYkS0xh18T0gfHeA/P6bfnILNMgANmrKdwH3UbaJRAu+AWyGlBzarVliFTEo0MACt5vqKqHOe30w2Ry26qGn034s58AG3uAu/XtZiz2YU8SILbWu/hDbCM/j19wGPFJswCx2/7Hm5hAf+P36Ds4xafR+k0oME6y9ZSJQKNFRNr6K9MS3GzdkdAsLiXGbjokOqev0+RK5Ray9/Rha+d/NdrfEtIctQL0EWwoV+E9gigJXfkw7FYjwemb4j/GPtK/LhslesGhZC5euL3AmNI+l83sI55SBuGCrcKVkHL6vfAZbq9q0IPXKRHUOWLwhGjhdCWc+qi4Mhl3NrkxPaapibgSInhHkLdAHMjfAJG4K7x8/r6y86oiOnV72zGs4vOxCDV1bATr8DpNGb+bRbXV4Y1ov4utDGJN3HeyA8tNDbbzY1PjbW/CaofE6pF0rELWT+dOo7aMrEXItQBZyEAcmWsVvKOqvTA3Y90yFniT3uIO+YbmHadMYJ13EfnJL2ftYQWc6yPNgmkd1HcizJ6CGTMuiKLNaKXoQMdmZbBH7Nxmb17eFTS1vq073ekWT7YCfO70gp/SiTO0/SHy2NfRRniMZKep+HmGw/wVIMxxGdnRRMgapjmeqB9e0ESP1ifkzN9e4s/3VfAFZWIZDoNXGq/rFc7pRSvGJ4uhFrfjA8aC+T9/rVkavVRC5DB2GWACcnAJBZ7zUnD8eXibWbo6bKcmmgjNVunLKZLpfJ+VMGOhpVWsM3pML4qkp0z8cGT9t5K/st6GFEF7PAM/0FbLy9OqFKzJP+zY3FQTjoRB+lhPgNcmeEYLt6zNa1JSAbjP+hC7e6c4brICf+zM7I+ORDt5SG9+IymvI52g7jXwyKpEdV4XunM3tfn3MYTL/ppf5BY0Oeoe8kapYR5Cf3DQkh58dVb6AK25ebtV2qdyrG44Gak0ksmhSa5tX64HD2Yr0OVdM78obXdqTVkdQg1IKLyO3QUA2MKqd9cyQn1ec6OFmqgpMp6ZMfqWFIhTGpJKAZMVsd8ql7DvfPC5N48XjzisQV+9mzyq0f+0Jv4cO3rSAx5cCli4hxI4PzM04bycBjaUjFaqf46D+81j6DAAAAAAAAAAAAAAAAAAA=",
	"data:image/webp;base64,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"
];
var HEART_D = "M65.5 100C48 94 0 66 0 40 0 12 14 0 33 0 50 0 56 9 65.5 9 75 9 81 0 98 0 117 0 131 12 131 40 131 66 83 94 65.5 100Z";
var HEART_TOP = "#E0723A";
var HEART_BOTTOM = "#C34E27";
function FlatHeart({ size = 15 }) {
	usePreferences();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: Math.round(size * .76),
		viewBox: "0 0 131 100",
		"aria-hidden": "true",
		focusable: "false",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
			id: "mh-heart-tab",
			x1: "0",
			y1: "0",
			x2: "0",
			y2: "1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
				offset: "0",
				stopColor: HEART_TOP
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
				offset: "1",
				stopColor: HEART_BOTTOM
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: HEART_D,
			fill: "url(#mh-heart-tab)"
		})]
	});
}
var HEART_PACKS = [
	[[
		60,
		50,
		30,
		0
	]],
	[
		[
			47,
			54,
			24,
			-10
		],
		[
			73,
			54,
			24,
			10
		],
		[
			60,
			38,
			26,
			0
		]
	],
	[
		[
			36,
			56,
			20,
			-16
		],
		[
			60,
			56,
			20,
			0
		],
		[
			84,
			56,
			20,
			16
		],
		[
			48,
			40,
			22,
			-8
		],
		[
			72,
			40,
			22,
			8
		],
		[
			60,
			26,
			24,
			0
		]
	],
	[
		[
			30,
			58,
			18,
			-20
		],
		[
			50,
			58,
			18,
			-6
		],
		[
			70,
			58,
			18,
			6
		],
		[
			90,
			58,
			18,
			20
		],
		[
			40,
			44,
			20,
			-12
		],
		[
			60,
			44,
			20,
			0
		],
		[
			80,
			44,
			20,
			12
		],
		[
			50,
			30,
			22,
			-6
		],
		[
			70,
			30,
			22,
			6
		]
	],
	[
		[
			26,
			60,
			16,
			-24
		],
		[
			44,
			60,
			16,
			-8
		],
		[
			60,
			60,
			16,
			0
		],
		[
			76,
			60,
			16,
			8
		],
		[
			94,
			60,
			16,
			24
		],
		[
			34,
			46,
			18,
			-14
		],
		[
			52,
			46,
			18,
			-4
		],
		[
			68,
			46,
			18,
			4
		],
		[
			86,
			46,
			18,
			14
		],
		[
			42,
			32,
			20,
			-8
		],
		[
			60,
			32,
			20,
			0
		],
		[
			78,
			32,
			20,
			8
		],
		[
			60,
			18,
			22,
			0
		]
	],
	[
		[
			24,
			62,
			15,
			-28
		],
		[
			40,
			62,
			15,
			-10
		],
		[
			56,
			62,
			15,
			0
		],
		[
			72,
			62,
			15,
			6
		],
		[
			88,
			62,
			15,
			18
		],
		[
			104,
			62,
			15,
			28
		],
		[
			30,
			48,
			17,
			-16
		],
		[
			48,
			48,
			17,
			-6
		],
		[
			64,
			48,
			17,
			2
		],
		[
			82,
			48,
			17,
			12
		],
		[
			98,
			48,
			17,
			22
		],
		[
			38,
			34,
			19,
			-10
		],
		[
			56,
			34,
			19,
			-2
		],
		[
			74,
			34,
			19,
			8
		],
		[
			92,
			34,
			19,
			16
		],
		[
			48,
			20,
			21,
			-6
		],
		[
			68,
			20,
			21,
			6
		],
		[
			60,
			12,
			26,
			0
		]
	]
];
function HeartPackArt({ tier }) {
	usePreferences();
	const hearts = HEART_PACKS[Math.max(0, Math.min(tier, HEART_PACKS.length - 1))] ?? [];
	const spill = tier >= 5 ? [
		[
			22,
			99,
			13,
			-26
		],
		[
			98,
			99,
			13,
			26
		],
		[
			38,
			104,
			11,
			-12
		],
		[
			82,
			104,
			11,
			12
		]
	] : tier >= 3 ? [[
		22,
		99,
		13,
		-26
	], [
		98,
		99,
		13,
		26
	]] : [];
	const gid = `mh-heart-pack-${tier}`;
	const at = (cx, cy, w, r) => `translate(${cx} ${cy}) rotate(${r}) scale(${w / 131}) translate(-65.5 -50)`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "mh-shop-art",
		viewBox: "0 0 120 120",
		"aria-hidden": "true",
		focusable: "false",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: gid,
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0",
					stopColor: HEART_TOP
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "1",
					stopColor: HEART_BOTTOM
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "60",
				cy: "107",
				rx: "41",
				ry: "5",
				fill: "oklch(.32 .06 45 / .13)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M28 26h64a8 8 0 0 1 8 8v14H20V34a8 8 0 0 1 8-8Z",
				fill: "#8C2F1B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M20 40h80v8H20Z",
				fill: "#6E2414"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "46",
				width: "72",
				height: "20",
				rx: "4",
				fill: "#5C1E10"
			}),
			hearts.map(([cx, cy, w, r], n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: HEART_D,
				fill: `url(#${gid})`,
				transform: at(cx, cy, w, r)
			}, n)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M20 62h80v28a12 12 0 0 1-12 12H32a12 12 0 0 1-12-12Z",
				fill: "#B8422A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 70v30M80 70v30",
				stroke: "#9C3620",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "58",
				width: "80",
				height: "9",
				rx: "4",
				fill: "#E8B551"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "55",
				y: "58",
				width: "10",
				height: "21",
				rx: "4",
				fill: "#E8B551"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "72",
				r: "3",
				fill: "#8A5A15"
			}),
			spill.map(([cx, cy, w, r], n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: HEART_D,
				fill: `url(#${gid})`,
				transform: at(cx, cy, w, r)
			}, `s${n}`))
		]
	});
}
var SHOP_PRICES = [
	1,
	2,
	5,
	10,
	20,
	30
];
var SHOP_AMOUNTS = {
	dat: [
		66,
		145,
		396,
		858,
		1800,
		2800
	],
	heart: [
		66,
		145,
		396,
		858,
		1800,
		2800
	]
};
function ShopSheet({ dialogRef, balance, onClose }) {
	usePreferences();
	const [tab, setTab] = (0, import_react.useState)("dat");
	const [selected, setSelected] = (0, import_react.useState)(3);
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	const [budget, setBudget] = (0, import_react.useState)("");
	const [wish, setWish] = (0, import_react.useState)("");
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const [aiMsg, setAiMsg] = (0, import_react.useState)(null);
	const askAi = async () => {
		const b = Number(budget.replace(",", "."));
		if (!Number.isFinite(b) || b <= 0 || !wish.trim()) {
			setAiMsg({
				ok: false,
				text: translate("Büdcəni və nə almaq istədiyini yaz.")
			});
			return;
		}
		setAiBusy(true);
		setAiMsg(null);
		try {
			const r = await recommendShopPack({ data: {
				budget: b,
				wish: wish.trim()
			} });
			setTab(r.tab);
			setSelected(r.tier);
			setAiMsg({
				ok: true,
				text: `${formatBalance(SHOP_AMOUNTS[r.tab][r.tier] ?? 0)} ${r.tab === "dat" ? "DAT" : translate("Ürək")} · ${SHOP_PRICES[r.tier]} AZN — ${r.reason}`
			});
		} catch (e) {
			setAiMsg({
				ok: false,
				text: e instanceof Error ? e.message : translate("Xəta baş verdi.")
			});
		} finally {
			setAiBusy(false);
		}
	};
	const icons = SHOP_DAT_ICONS;
	const unit = tab === "dat" ? "DAT" : translate("Ürək");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mh-overlay mh-shop-overlay",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: dialogRef,
			tabIndex: -1,
			className: "mh-shop",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "mh-shop-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mh-shop-grip",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mh-shop-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "mh-shop-title",
						children: translate("Mağaza")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [translate("Balansın:"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [balance == null ? "—" : formatBalance(balance), " DAT"] })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "mh-shop-close",
						"aria-label": translate("Bağla"),
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mh-shop-tabs",
					role: "tablist",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							role: "tab",
							"aria-selected": tab === "dat",
							className: tab === "dat" ? "on" : "",
							onClick: () => setTab("dat"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mh-coin",
								"aria-hidden": "true",
								children: "D"
							}), "DAT coin"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							role: "tab",
							"aria-selected": tab === "heart",
							className: tab === "heart" ? "on" : "",
							onClick: () => setTab("heart"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlatHeart, { size: 15 }), translate("Ürək")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mh-shop-pill",
							style: { transform: tab === "dat" ? "translateX(0)" : "translateX(100%)" },
							"aria-hidden": "true"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mh-ai",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mh-ai-toggle",
						onClick: () => setAiOpen((o) => !o),
						"aria-expanded": aiOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 15 }), translate("Mənə uyğun paketi tap")]
					}), aiOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mh-ai-body",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mh-ai-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "decimal",
									placeholder: translate("Büdcə (AZN)"),
									value: budget,
									onChange: (e) => setBudget(e.target.value),
									maxLength: 7,
									"aria-label": translate("Büdcə AZN")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									placeholder: translate("Nə üçün? məs: dostuma hədiyyə"),
									value: wish,
									onChange: (e) => setWish(e.target.value),
									maxLength: 400,
									"aria-label": translate("Nə almaq istəyirsən"),
									onKeyDown: (e) => {
										if (e.key === "Enter") askAi();
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "mh-ai-go",
								onClick: askAi,
								disabled: aiBusy,
								children: [aiBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									size: 15,
									className: "mh-spin"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 15 }), aiBusy ? translate("Düşünür…") : translate("Tövsiyə al")]
							}),
							aiMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mh-ai-msg" + (aiMsg.ok ? " ok" : ""),
								role: "status",
								children: aiMsg.text
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mh-shop-grid",
					children: SHOP_PRICES.map((price, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "mh-shop-item" + (selected === i ? " sel" : ""),
						style: { animationDelay: `${i * 40}ms` },
						onClick: () => setSelected(i),
						"aria-pressed": selected === i,
						children: [
							i === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mh-shop-badge",
								children: translate("POPULYAR")
							}),
							tab === "dat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: icons[i],
								width: 240,
								height: 240,
								loading: "lazy",
								alt: `${SHOP_AMOUNTS[tab][i]} ${unit}`
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPackArt, { tier: i }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mh-shop-amt",
								children: [
									formatBalance(SHOP_AMOUNTS[tab][i] ?? 0),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: unit })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mh-shop-price",
								children: [price, " AZN"]
							})
						]
					}, price))
				}, tab),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mh-shop-buy",
					onClick: () => {
						const item = tab === "dat" ? "DAT coin" : translate("Ürək");
						const text = `Salam! ${formatBalance(SHOP_AMOUNTS[tab][selected] ?? 0)} ${item} paketini ${SHOP_PRICES[selected]} AZN-ə almaq istəyirəm. Zəhmət olmasa ödəniş üçün məlumat göndərin.`;
						window.open(`https://wa.me/994552172061?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
						onClose();
					},
					children: [
						translate("Balansı Artır ·"),
						SHOP_PRICES[selected],
						" AZN"
					]
				})
			]
		})
	});
}
var formatBalance = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
function useAdminIds(ids) {
	const [admins, setAdmins] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const key = ids.join(",");
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb || !ids.length) return;
		let on = true;
		Promise.all(ids.map((id) => sb.rpc("has_role", {
			_user_id: id,
			_role: "admin"
		}).then(({ data }) => data ? id : null))).then((r) => {
			if (on) setAdmins(new Set(r.filter((x) => !!x)));
		});
		return () => {
			on = false;
		};
	}, [key]);
	return admins;
}
function AdminBadge() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "mh-admin-badge",
		"aria-label": "Admin",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			width: "9",
			height: "9",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M12 2l2.6 6.3L21 9l-5 4.4L17.5 20 12 16.6 6.5 20 8 13.4 3 9l6.4-.7z"
			})
		}), "ADMIN"]
	});
}
function UsersRow({ me, defaultPhoto, onMessage, onOpen }) {
	usePreferences();
	const [users, setUsers] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb) return;
		let on = true;
		sb.from("profiles").select("id,name,username,photo_url").order("created_at", { ascending: false }).limit(40).then(({ data }) => {
			if (on && data) setUsers(data.filter((u) => u.id !== me));
		});
		return () => {
			on = false;
		};
	}, [me]);
	const admins = useAdminIds(users.map((u) => u.id));
	if (!users.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mh-users",
		"aria-label": translate("İstifadəçilər"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mh-status-heading",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: translate("İstifadəçilər") })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mh-users-list",
			children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mh-user",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mh-user-open",
					onClick: () => onOpen(u.id),
					"aria-label": u.name,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: u.photo_url || defaultPhoto,
						alt: u.name,
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mh-user-name-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mh-user-name",
							children: u.name
						}), admins.has(u.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminBadge, {})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendButton, {
					me,
					userId: u.id,
					onMessage: () => onMessage(u.id)
				})]
			}, u.id))
		})]
	});
}
var HOME_STYLES_EXTRA = ".mh-user-name-row{display:flex;margin-top:6px;align-items:center;justify-content:center;gap:4px;min-width:0;max-width:100%;}\n.mh-id-text .mh-user-name-row{justify-content:flex-start;}\n.mh-user-name-row .mh-user-name{min-width:0;margin-top:0;}\n.mh-admin-badge{position:relative;overflow:hidden;flex-shrink:0;display:inline-flex;align-items:center;gap:2px;padding:2px 5px;border-radius:6px;font-size:8px;font-weight:900;letter-spacing:.6px;line-height:1;color:oklch(0.99 0 0);background:linear-gradient(135deg,oklch(0.62 0.24 25),oklch(0.48 0.22 20));box-shadow:0 2px 8px oklch(0.6 0.24 25 / .45);animation:mhAdminPulse 1.8s ease-in-out infinite;}\n.mh-admin-badge::after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,oklch(1 0 0 / .55) 50%,transparent 70%);transform:translateX(-120%);animation:mhAdminShine 2.4s ease-in-out infinite;}\n.mh-admin-badge svg{animation:mhAdminSpin 3s linear infinite;}\n@keyframes mhAdminPulse{0%,100%{transform:scale(1);box-shadow:0 2px 8px oklch(0.6 0.24 25 / .45);}50%{transform:scale(1.08);box-shadow:0 2px 14px oklch(0.6 0.24 25 / .8);}}\n@keyframes mhAdminShine{0%{transform:translateX(-120%);}60%,100%{transform:translateX(120%);}}\n@keyframes mhAdminSpin{to{transform:rotate(360deg);}}\n@media(prefers-reduced-motion:reduce){.mh-admin-badge,.mh-admin-badge::after,.mh-admin-badge svg{animation:none;}}\n.mh-id{display:flex;align-items:center;gap:12px;min-width:0;}\n.mh-id-text{display:flex;flex-direction:column;min-width:0;}\n.mh-id-text strong{font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px;}\n.mh-id-text span{font-size:11px;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px;}\n.mobile-home .mh-bell{width:43px;height:43px;border-radius:50%;padding:0;background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow);color:var(--foreground);position:relative;flex-shrink:0;}\n.mh-bell i{position:absolute;top:10px;right:11px;width:7px;height:7px;border-radius:50%;background:var(--heart);border:2px solid var(--surface);}\n.mh-tanis{margin:36px 0 0;text-align:center;}\n.mh-tanis h2{margin:0;font-size:34px;font-weight:800;letter-spacing:-.5px;background:linear-gradient(120deg,var(--primary),var(--heart));-webkit-background-clip:text;background-clip:text;color:transparent;}\n.mh-tanis p{margin:6px 0 0;font-size:12px;color:var(--muted-foreground);}\n.mh-users{margin-top:22px;}\n.mh-users-list{display:flex;gap:14px;overflow-x:auto;padding:2px 0 9px;scrollbar-width:none;}\n.mh-users-list::-webkit-scrollbar{display:none;}\n.mh-user{flex:0 0 76px;text-align:center;}\n.mh-user img{width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid var(--border);background:var(--surface);}\n.mh-user-name{display:block;margin-top:6px;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n.mh-user .mh-follow{margin-top:5px;height:24px;padding:0 14px;border-radius:20px;font-size:10px;font-weight:700;background:var(--primary);color:var(--primary-foreground);border:none;cursor:pointer;}\n";
function MobileHomeView({ profile: p, defaultPhoto, uploading, notice, onPhoto, onJoin, onSignOut }) {
	const selfAdmin = useAdminIds([p.id]);
	const preferences = usePreferences();
	const fileRef = (0, import_react.useRef)(null);
	const [activeStory, setActiveStory] = (0, import_react.useState)(null);
	const [walletOpen, setWalletOpen] = (0, import_react.useState)(false);
	const [gameOpen, setGameOpen] = (0, import_react.useState)(false);
	const [liveOpen, setLiveOpen] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [messagesOpen, setMessagesOpen] = (0, import_react.useState)(false);
	const [chatWith, setChatWith] = (0, import_react.useState)(null);
	const [viewUser, setViewUser] = (0, import_react.useState)(null);
	useSocialSession(p.id);
	(0, import_react.useEffect)(() => onSocialOpen((n) => {
		if (n.kind === "message") {
			setChatWith(n.from);
			setProfileOpen(false);
			setMessagesOpen(true);
		} else {
			setMessagesOpen(false);
			setProfileOpen(true);
		}
	}), []);
	const [localNotice, setLocalNotice] = (0, import_react.useState)("");
	const dialogRef = (0, import_react.useRef)(null);
	const modalOpen = Boolean(activeStory || walletOpen || gameOpen);
	(0, import_react.useEffect)(() => {
		if (!modalOpen) return;
		const previous = document.activeElement;
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();
		const close = (e) => {
			if (e.key === "Escape") {
				setActiveStory(null);
				setWalletOpen(false);
				setGameOpen(false);
			}
			if (e.key === "Tab" && dialogRef.current) {
				const items = Array.from(dialogRef.current.querySelectorAll("button, [href], [tabindex=\"0\"]"));
				const first = items[0];
				const last = items[items.length - 1];
				if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
					e.preventDefault();
					last?.focus();
				} else if (!e.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
					e.preventDefault();
					first?.focus();
				}
			}
		};
		document.addEventListener("keydown", close);
		return () => {
			document.body.style.overflow = overflow;
			document.removeEventListener("keydown", close);
			if (previous instanceof HTMLElement) previous.focus();
		};
	}, [modalOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mobile-home",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mh-shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mh-top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mh-id",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "mh-avatar",
							disabled: uploading,
							onClick: () => fileRef.current?.click(),
							"aria-label": translate("Şəkli dəyiş"),
							title: translate("Şəkli dəyiş"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.photo_url || defaultPhoto,
								alt: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mh-online",
								children: uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									size: 12,
									className: "animate-spin"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mh-id-text",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mh-greeting",
									children: [translate("Xoş gəldin"), " 👋"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mh-user-name-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.name }), selfAdmin.has(p.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminBadge, {})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["@", p.username] })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mh-top-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppControls, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mh-wallet",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mh-coin",
									"aria-hidden": "true",
									children: "D"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									"aria-label": translate("DAT balansı"),
									children: [p.dat == null ? "—" : formatBalance(p.dat), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "DAT" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									className: "mh-wallet-add",
									"aria-label": translate("DAT əlavə et"),
									title: translate("DAT əlavə et"),
									onClick: () => setWalletOpen(true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 })
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: "image/*",
					hidden: true,
					onChange: (e) => {
						const f = e.target.files?.[0];
						e.target.value = "";
						if (f) onPhoto(f);
					}
				}),
				(notice || localNotice) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "mh-notice",
					children: notice || localNotice
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mh-banner",
					"aria-label": translate("Sevgilini Tap"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: banner,
						alt: translate("Sevgilini Tap — Şüşə oyunu")
					}), preferences.language !== "az" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: translate("Sevgilini Tap") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusStrip, {
					me: {
						id: p.id,
						name: p.name,
						photo_url: p.photo_url
					},
					defaultPhoto
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mh-bot-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "mh-promo",
						src: PROMO_IMAGE,
						width: 640,
						height: 357,
						alt: translate("Şüşə oyunu — Öp və tanış ol, sevgini tap")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "mh-bot",
						onClick: () => setGameOpen(true),
						"aria-label": translate("Oyuna qoşulmaq üçün klikləyin"),
						title: translate("Oyuna qoşul"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mh-bot-bubble",
							children: [translate("Oyuna qoşulmaq üçün"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: translate("klikləyin") })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotSvg, {})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mh-tanis",
					"aria-label": translate("Tanış ol"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: translate("Tanış ol") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: translate("Yeni insanlarla tanış ol, söhbətə başla.") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRow, {
					me: p.id,
					defaultPhoto,
					onOpen: setViewUser,
					onMessage: (id) => {
						setChatWith(id);
						setMessagesOpen(true);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "mh-footer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mh-footer-brand",
							children: ["şüşə", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [translate("Oyunçu #"), p.player_no] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "mh-signout",
							onClick: onSignOut,
							"aria-label": translate("Çıxış et"),
							title: translate("Çıxış et"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 })
						})
					]
				}),
				(activeStory || gameOpen) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mh-overlay",
					onClick: (e) => {
						if (e.target === e.currentTarget) {
							setActiveStory(null);
							setWalletOpen(false);
							setGameOpen(false);
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: dialogRef,
						tabIndex: -1,
						className: gameOpen ? "mh-dialog mh-dialog-card" : "mh-dialog",
						role: "dialog",
						"aria-modal": "true",
						"aria-labelledby": "mh-dialog-title",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "mh-close",
								"aria-label": translate("Bağla"),
								onClick: () => {
									setActiveStory(null);
									setWalletOpen(false);
									setGameOpen(false);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "mh-dialog-title",
								children: gameOpen ? translate("Oyuna qoşul") : walletOpen ? "DAT cüzdanı" : activeStory?.name
							}),
							gameOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mh-card-bot",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotSvg, { pulling: true })
							}),
							gameOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mh-game-content",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "mh-join",
										onClick: onJoin,
										"aria-label": translate("Oyuna qoşul"),
										title: translate("Oyuna qoşul"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: BOTTLE_IMAGE,
											alt: translate("Şüşə oyunu")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "mh-game-action",
										onClick: onJoin,
										children: translate("Oyuna qoşul")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnlinePlayers, {
										open: gameOpen,
										defaultPhoto
									})
								]
							}) : walletOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [translate("Balansın:"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [p.dat == null ? "—" : formatBalance(p.dat), " DAT"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "DAT artırılması hələ bu səhifəyə qoşulmayıb." })] }) : activeStory?.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mh-story-view-text",
								children: activeStory.text
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "mh-story-view",
								src: activeStory?.image,
								alt: "Status şəkli"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {
					active: profileOpen ? "profile" : messagesOpen ? "messages" : liveOpen ? "live" : "home",
					onSelect: (t) => {
						if (t === "profile") {
							setMessagesOpen(false);
							setProfileOpen(true);
							return;
						}
						if (t === "messages") {
							setProfileOpen(false);
							setChatWith(null);
							setMessagesOpen(true);
							return;
						}
						setMessagesOpen(false);
						if (t === "home") setProfileOpen(false);
						if (t === "games") {
							setGameOpen(true);
							return;
						}
						if (t === "live") {
							setLiveOpen(true);
							return;
						}
						if (t === "home") {
							window.scrollTo({
								top: 0,
								behavior: "smooth"
							});
							return;
						}
						setLocalNotice(t === "messages" ? translate("Mesajlar tezliklə.") : "Profil səhifəsi tezliklə.");
						window.setTimeout(() => setLocalNotice(""), 2500);
					}
				}),
				profileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileProfile, {
					profile: p,
					defaultPhoto,
					onBack: () => setProfileOpen(false),
					uploading,
					notice,
					onPhoto,
					onSignOut,
					onTopUp: () => setWalletOpen(true),
					extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendRequests, {
						me: p.id,
						defaultPhoto,
						onOpenChat: (id) => {
							setChatWith(id);
							setProfileOpen(false);
							setMessagesOpen(true);
						}
					})
				}),
				messagesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesView, {
					me: p.id,
					defaultPhoto,
					initialPeer: chatWith,
					onOpenProfile: setViewUser,
					onClose: () => {
						setMessagesOpen(false);
						setChatWith(null);
					}
				}),
				viewUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProfileView, {
					me: p.id,
					userId: viewUser,
					defaultPhoto,
					onBack: () => setViewUser(null),
					onMessage: (id) => {
						setViewUser(null);
						setChatWith(id);
						setProfileOpen(false);
						setMessagesOpen(true);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialBanner, { defaultPhoto }),
				liveOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveRooms, {
					me: {
						id: p.id,
						name: p.name,
						photo: p.photo_url ?? null
					},
					defaultPhoto,
					onClose: () => setLiveOpen(false)
				}),
				walletOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopSheet, {
					dialogRef,
					balance: p.dat,
					onClose: () => setWalletOpen(false)
				})
			]
		})
	});
}
var MOBILE_TOP_STYLES = ".mh-user-open{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:inherit;min-width:0;max-width:100%;-webkit-tap-highlight-color:transparent;}.mh-user-open:active img{transform:scale(.94);}.mh-user-open:focus-visible{outline:2px solid var(--primary);outline-offset:3px;border-radius:12px;}@media(max-width:639px){.mobile-home .mh-top{position:sticky;top:0;z-index:40;margin:calc(-1 * max(26px, env(safe-area-inset-top))) -26px 14px;padding:calc(12px + env(safe-area-inset-top)) 18px 12px;background:color-mix(in oklch, var(--background) 80%, transparent);-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5);border-bottom:1px solid color-mix(in oklch, var(--border) 55%, transparent);}@media(max-width:360px){.mobile-home .mh-top{margin-left:-20px;margin-right:-20px;padding-left:14px;padding-right:14px;}}}.mobile-home .mh-top{animation:mh-top-in .55s cubic-bezier(.22,1,.36,1) both;}@keyframes mh-top-in{from{opacity:0;transform:translateY(-14px);}to{opacity:1;transform:translateY(0);}}.mobile-home .mh-avatar{width:48px;height:48px;padding:2px;border:none;background:conic-gradient(from 210deg, var(--primary), var(--gold), var(--primary));box-shadow:0 5px 16px oklch(.57 .14 165 / .32);transition:transform .2s ease;}.mobile-home .mh-avatar:active{transform:scale(.93);}.mh-avatar img{border:2px solid var(--background);}.mh-greeting{font-size:10px;font-weight:600;color:var(--muted-foreground);letter-spacing:.02em;}.mh-id-text strong{font-size:15px;max-width:130px;}.mobile-home .mh-wallet{height:41px;border:1px solid color-mix(in oklch, var(--gold) 45%, var(--border));padding:5px 6px 5px 11px;background:linear-gradient(180deg, var(--surface), color-mix(in oklch, var(--accent) 55%, var(--surface)));box-shadow:0 6px 18px oklch(.35 .07 165 / .10);transition:transform .16s ease, box-shadow .16s ease;}.mobile-home .mh-wallet:active{transform:scale(.94);}.mobile-home .mh-coin{box-shadow:inset 0 -2px 3px oklch(.42 .09 65 / .35);}.mobile-home .mh-wallet-add{background:var(--primary);color:var(--primary-foreground);transition:transform .16s ease;}.mobile-home .mh-wallet-add:active{transform:scale(.9) rotate(90deg);}.mobile-home .mh-top-actions{display:flex;align-items:center;gap:10px;}";
//#endregion
export { MobileHomeView, Home as component };
