import { i as __toESM } from "../_runtime.mjs";
import { t as getSupabase } from "./supabase-BUCaDQ6-.mjs";
import { h as require_react, m as require_jsx_runtime, u as require_react_dom } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as refreshProfile } from "./auth-09P8qAxJ.mjs";
import { n as gameError } from "./game-language-BY9iR37b.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/room-session-dbRRUfwK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var TABLE_SEATS = [
	[41.5, -140.5],
	[123.5, -120.5],
	[138.5, -38.5],
	[138.5, 42.5],
	[123.5, 124.5],
	[41.5, 143.5],
	[-40.5, 143.5],
	[-122.5, 124.5],
	[-137.5, 42.5],
	[-137.5, -38.5],
	[-122.5, -120.5],
	[-40.5, -140.5]
];
var RETURN_SECONDS = .5;
var CENTER_PLAYER_SCALE = 69 / 64;
/** TablePresenter.turnWait uses actual player genders, not rotated display-seat parity. */
function waitingHint(players) {
	const present = players.filter((player) => player !== null);
	if (!present.length) return null;
	if (present.every((player) => !player.male)) return "hint:no_men";
	if (present.every((player) => player.male)) return "hint:no_women";
	return null;
}
function decisionArrowsVisible(phase) {
	return phase === "choose" || phase === "result";
}
function decisionTimerVisible(phase, participating, decided) {
	return phase === "choose" && (!participating || !decided);
}
function turnOfferSound(phase, spinner, viewer, ready) {
	return phase === "offer" && spinner === viewer && ready ? "ding" : null;
}
function spinAngle(seat, random = Math.random()) {
	const pt = TABLE_SEATS[seat];
	if (!pt) throw new Error("Unknown seat");
	return Math.atan2(pt[0], -pt[1]) * 180 / Math.PI + 360 * Math.round(5 + 10 * random);
}
function leftRight(a, b) {
	const p = TABLE_SEATS[a], q = TABLE_SEATS[b];
	if (!p || !q) throw new Error("Unknown seat");
	return p[0] < q[0] || p[0] === q[0] && p[1] < q[1] ? [a, b] : [b, a];
}
function bottleItems(assets, social, vip = false) {
	return (assets.bottleStore ?? []).flatMap((entry) => {
		if (entry.social && !entry.social.includes(social)) return [];
		const bottle = assets.bottles?.[entry.id];
		return bottle ? [{
			bottle,
			locked: Boolean(entry.vip_s) && !vip,
			name: assets.translation[`bottle:${bottle.type}`] ?? bottle.type
		}] : [];
	});
}
var selectedBottle = "standart";
var listeners$5 = /* @__PURE__ */ new Set();
function selectBottle(type) {
	selectedBottle = type;
	listeners$5.forEach((l) => l());
}
function useBottle() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners$5.add(cb);
		return () => {
			listeners$5.delete(cb);
		};
	}, () => selectedBottle, () => "standart");
}
/** Prevent slow background checks from queueing behind themselves. */
function singleFlight() {
	let pending = null;
	return (work) => {
		if (pending) return pending;
		pending = Promise.resolve().then(work).finally(() => {
			pending = null;
		});
		return pending;
	};
}
/** A visual-only budget: confirmed gift transactions/chat are never discarded. */
function presentationBudget(limit) {
	const active = /* @__PURE__ */ new Set();
	return {
		acquire() {
			if (active.size >= limit) return null;
			const release = () => {
				active.delete(release);
			};
			active.add(release);
			return release;
		},
		clear() {
			active.clear();
		}
	};
}
function SourceButtons({ cancel, confirm, info, danger }) {
	const btn = (type, a) => a && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		type: "button",
		className: `button button--${type}${a.enabled === false ? " button--disabled" : ""}`,
		disabled: a.enabled === false,
		onClick: a.onClick,
		children: a.title
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "popup__buttons popup__buttons--center",
		children: [
			btn("danger", danger),
			btn("cancel", cancel),
			btn("confirm", confirm),
			btn("info", info)
		]
	});
}
function SourceDialogLayer({ title, onClose, hasClose = true, onShade, children, label }) {
	(0, import_react.useEffect)(() => {
		const key = (e) => {
			if (e.key === "Escape") {
				e.stopImmediatePropagation();
				onClose();
			}
		};
		document.addEventListener("keydown", key, true);
		return () => document.removeEventListener("keydown", key, true);
	}, [onClose]);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "source-feature-layer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup-shade",
			onClick: (e) => {
				e.stopPropagation();
				(onShade ?? onClose)();
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": label ?? title,
			className: "popup popup--center popup--show",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popup__header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__title",
					children: title
				}), hasClose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "popup__close popup__close--dlg",
					"aria-label": "Bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
				})]
			}), children]
		})]
	}), document.body);
}
/** InfoDialog: header, centered context text, then the original button row. */
function SourceInfoDialog({ title, context, hasClose = false, onClose, ...buttons }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceDialogLayer, {
		title,
		onClose,
		hasClose,
		onShade: hasClose ? onClose : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup__content popup__content--wrap popup__content--center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "info__context",
				children: context
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, { ...buttons })]
	});
}
/** GiftLockedDialog: grayscale item image, description, optional progress. */
function SourceGiftLockedDialog({ title, description, kind, image, lock, onClose, cancel, confirm, info }) {
	const mods = kind === "gift" ? "gift-locked__image gift-locked__image--grayscale" : `gift-locked__image gift-locked__image--${kind} gift-locked__image--grayscale`;
	const progress = lock && "needed" in lock;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceDialogLayer, {
		title,
		onClose,
		onShade: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup__content",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gift-locked",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: mods,
						src: image.src,
						width: image.width,
						height: image.height,
						alt: ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "gift-locked__description",
						children: description
					}),
					progress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "gift-locked__progress",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "gift-locked__progress gift-locked__progress--bar",
							style: { width: `${(lock.current ?? 0) / lock.needed * 100}%` }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "gift-locked__amount",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `gift-locked__icon gift-locked__icon--${lock.type}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lock.current ?? "-" }),
							"/",
							lock.needed
						] })]
					})] })
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, {
			cancel,
			confirm,
			info
		})]
	});
}
var TOAST_EVENT = "source:toast";
function showSourceToast(message) {
	window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}
function SourceToastHost() {
	const [toast, setToast] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let hide, remove;
		const on = (e) => {
			const message = e.detail;
			window.clearTimeout(hide);
			window.clearTimeout(remove);
			const id = Date.now();
			setToast({
				id,
				message,
				phase: "show"
			});
			hide = window.setTimeout(() => setToast((t) => t && t.id === id ? {
				...t,
				phase: "hide"
			} : t), 2e3);
			remove = window.setTimeout(() => setToast((t) => t && t.id === id ? null : t), 2300);
		};
		window.addEventListener(TOAST_EVENT, on);
		return () => {
			window.removeEventListener(TOAST_EVENT, on);
			window.clearTimeout(hide);
			window.clearTimeout(remove);
		};
	}, []);
	if (!toast) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "source-toast-layer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "status",
			className: `toast toast--bottom toast--${toast.phase}`,
			children: toast.message.replace("&nbsp;", "\xA0")
		})
	}), document.body);
}
var OPEN_TOPS_EVENT = "source:open-tops";
var OPEN_VIP_EVENT = "source:open-vip";
var OPEN_DECOR_EVENT = "source:open-decor";
var OPEN_BANK_EVENT = "source:open-bank";
/** Everyone at the table sees who used the gesture: the performer's photo plus the gesture image. */
/** Everyone at the table sees the bottle change: sender photo, old bottle, arrows, new bottle. */
function pushBottleLine(sender, oldImage, oldName, newImage, newName, messageId) {
	if (messageId !== void 0 && state$1.lines.some((l) => l.kind === "bottle" && l.messageId === messageId)) return false;
	set$1({ lines: capLines([...state$1.lines, {
		kind: "bottle",
		key: ++seq,
		sender,
		oldImage,
		oldName,
		newImage,
		newName,
		...messageId !== void 0 ? { messageId } : {}
	}]) });
	return true;
}
function pushGestureLine(sender, gestureType, gestureName, image, eventId) {
	if (state$1.lines.some((l) => l.kind === "gesture" && l.eventId === eventId)) return false;
	set$1({ lines: capLines([...state$1.lines, {
		kind: "gesture",
		key: ++seq,
		sender,
		gestureType,
		gestureName,
		image,
		eventId
	}]) });
	return true;
}
function pushSystemLine(style, text, messageId) {
	if (messageId !== void 0 && state$1.lines.some((l) => l.kind === "system" && l.messageId === messageId)) return false;
	set$1({ lines: capLines([...state$1.lines, {
		kind: "system",
		key: ++seq,
		style,
		text,
		...messageId !== void 0 ? { messageId } : {}
	}]) });
	return true;
}
function pushHaremLine(line) {
	set$1({ lines: capLines([...state$1.lines, {
		kind: "harem",
		key: ++seq,
		...line
	}]) });
}
var MUSIC_KEY = "deltagame.music.volume";
var savedMusic = (() => {
	try {
		const v = Number(typeof window !== "undefined" ? window.localStorage.getItem(MUSIC_KEY) ?? 1 : 1);
		return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
	} catch {
		return 1;
	}
})();
var state$1 = {
	song: null,
	lines: [],
	muted: savedMusic === 0,
	volume: savedMusic
};
var listeners$4 = /* @__PURE__ */ new Set();
var batching = 0;
var changed = false;
var set$1 = (next) => {
	state$1 = {
		...state$1,
		...next
	};
	if (batching) changed = true;
	else listeners$4.forEach((l) => l());
};
/** History is one snapshot, not 100 nested external-store notifications. */
function batchChatHistory(work) {
	batching++;
	try {
		work();
	} finally {
		batching--;
		if (!batching && changed) {
			changed = false;
			listeners$4.forEach((l) => l());
		}
	}
}
var seq = 0;
var MAX_CHAT_LINES = 100;
var capLines = (lines) => lines.length > MAX_CHAT_LINES ? lines.slice(lines.length - MAX_CHAT_LINES) : lines;
/** Local chat only; real multiplayer transport is not configured. */
function pushKickoutLine(icon, sender, receiver, eventId) {
	if (state$1.lines.some((l) => l.kind === "kickout" && l.eventId === eventId)) return;
	set$1({ lines: capLines([...state$1.lines, {
		kind: "kickout",
		key: ++seq,
		icon,
		sender,
		receiver,
		eventId
	}]) });
}
function pushTextLine(sender, text, receiver, messageId, isPrivate = false) {
	if (!text.trim()) return false;
	if (messageId !== void 0 && state$1.lines.some((line) => line.kind === "text" && line.messageId === messageId)) return false;
	set$1({ lines: capLines([...state$1.lines, {
		kind: "text",
		key: ++seq,
		sender,
		text,
		...receiver ? { receiver } : {},
		...messageId !== void 0 ? { messageId } : {},
		...isPrivate ? { private: true } : {}
	}]) });
	return true;
}
/** Admin deleted a message: drop it for everyone with no placeholder. */
function removeTextLine(messageId) {
	set$1({ lines: state$1.lines.filter((l) => !("messageId" in l && l.messageId === messageId)) });
}
function pushActionLine(line) {
	if (line.messageId !== void 0 && state$1.lines.some((l) => "messageId" in l && l.messageId === line.messageId)) return;
	set$1({ lines: capLines([...state$1.lines, {
		kind: "action",
		key: ++seq,
		...line
	}]) });
}
/** session.viewerSendMusic + ChatPresenter.music(): start the track for the table and log it in the chat. */
var sharedAudio = null;
function getSharedAudio() {
	if (!sharedAudio && typeof Audio !== "undefined") {
		sharedAudio = new Audio();
		sharedAudio.preload = "auto";
		sharedAudio.muted = state$1.muted;
		sharedAudio.volume = state$1.volume;
		sharedAudio.playsInline = true;
	}
	return sharedAudio;
}
/** Prepare playback in the actual tap, without overriding the viewer's sound settings. */
function resumeMusicAudio() {
	const audio = getSharedAudio();
	if (!audio) return;
	audio.muted = state$1.muted;
	audio.volume = state$1.volume;
	if (audio.src && audio.paused && !audio.ended) audio.play().catch(() => {});
}
/** Table-scoped media and chat must not follow the viewer to another room. */
function resetRoomMusic() {
	sharedAudio?.pause();
	set$1({
		song: null,
		lines: []
	});
}
var serviceRegistry = {};
function registerMusicServices(services) {
	services.forEach((s) => {
		serviceRegistry[s.id] = s;
	});
}
var stubService = (id) => ({
	id,
	musicPrice: id === "yt" ? 9 : 5,
	confirmationTitleId: "",
	mediaSearchCooldown: 200,
	supportsMusicTabs: true,
	search: async () => [],
	getPopular: async () => [],
	getMusicByIds: async () => []
});
/** session.viewerSendMusic: the server charges the price and stores the song on the table; everyone (sender included) plays it from the room feed. */
async function sendMusic(music, service) {
	const audio = getSharedAudio();
	if (audio && service.id !== "yt") {
		audio.src = music.url;
		audio.currentTime = 0;
		resumeMusicAudio();
	}
	const { getSupabase } = await import("./supabase-BUCaDQ6-.mjs").then((n) => n.r).then((n) => n.r);
	const sb = getSupabase();
	if (!sb) {
		audio?.pause();
		return {
			ok: false,
			reason: "offline"
		};
	}
	const { error } = await sb.rpc("play_music", {
		p_service: service.id,
		p_item: music
	});
	if (error) {
		if (state$1.song?.musicItem.url !== music.url) audio?.pause();
		return {
			ok: false,
			reason: error.message
		};
	}
	return { ok: true };
}
/** Apply rooms.music: same song for everyone, resumed at the shared position after a reload. */
function applyRoomMusic(music, serverOffsetMs, sender) {
	if (!music || !sender) return;
	if (state$1.song?.key === music.key) return;
	const startedAt = Date.parse(music.started_at) - serverOffsetMs;
	if (Date.now() - startedAt > music.item.duration * 1e3) return;
	set$1({ song: {
		key: music.key,
		musicItem: music.item,
		isVideo: music.service === "yt",
		service: serviceRegistry[music.service] ?? stubService(music.service),
		sender,
		startedAt
	} });
}
var sameUsers = (a, b) => a.length === b.length && a.every((u) => b.some((v) => v.id === u.id));
var intersects = (a, b) => a.some((u) => b.some((v) => v.id === u.id));
/** Batcher.sendGift + GiftBatch.merge: consecutive same gifts from one sender collapse into one line with a count. */
function pushGiftLine(sender, receiver, gift) {
	let line = {
		kind: "gift",
		key: ++seq,
		sender,
		receivers: [receiver],
		giftType: gift.type,
		image: gift.image,
		...gift.width ? { imageWidth: gift.width } : {},
		...gift.height ? { imageHeight: gift.height } : {},
		name: gift.name,
		count: 1
	};
	const lines = [...state$1.lines];
	for (;;) {
		const prev = lines[lines.length - 1];
		if (!prev || prev.kind !== "gift" || prev.sender.id !== line.sender.id || prev.giftType !== line.giftType) break;
		if (sameUsers(prev.receivers, line.receivers)) line = {
			...prev,
			count: prev.count + line.count
		};
		else if (!intersects(prev.receivers, line.receivers) && prev.count === line.count) line = {
			...prev,
			receivers: [...prev.receivers, ...line.receivers]
		};
		else break;
		lines.pop();
	}
	lines.push(line);
	set$1({ lines: capLines(lines) });
}
var finishMusic = (key) => {
	if (state$1.song?.key === key) {
		sharedAudio?.pause();
		set$1({ song: null });
	}
};
var setMusicMuted = (muted) => {
	set$1({ muted });
	if (sharedAudio) sharedAudio.muted = muted;
};
var setMusicVolume = (value) => {
	const volume = Math.max(0, Math.min(1, value));
	const muted = volume === 0;
	set$1({
		volume,
		muted
	});
	try {
		window.localStorage.setItem(MUSIC_KEY, String(volume));
	} catch {}
	if (sharedAudio) {
		sharedAudio.volume = volume;
		sharedAudio.muted = muted;
	}
};
var serverSnapshot = state$1;
function useMusicSession() {
	return (0, import_react.useSyncExternalStore)((l) => {
		listeners$4.add(l);
		return () => listeners$4.delete(l);
	}, () => state$1, () => serverSnapshot);
}
/** Music notices are independent from current playback and replay from chat_messages. */
function pushMusicHistoryLine(sender, artist, title, messageId, eventKey) {
	if (state$1.lines.some((l) => "messageId" in l && l.messageId === messageId)) return false;
	set$1({ lines: capLines([...state$1.lines, {
		kind: "music",
		key: ++seq,
		sender,
		artist,
		title,
		messageId,
		...eventKey !== void 0 ? { eventKey } : {}
	}]) });
	return true;
}
function stampChatHistory(messageId, createdAt) {
	const lines = state$1.lines.map((l) => "messageId" in l && l.messageId === messageId ? {
		...l,
		createdAt
	} : l);
	const stored = lines.filter((l) => "messageId" in l && l.messageId !== void 0).sort((a, b) => ("messageId" in a ? a.messageId ?? 0 : 0) - ("messageId" in b ? b.messageId ?? 0 : 0));
	let i = 0;
	set$1({ lines: lines.map((l) => "messageId" in l && l.messageId !== void 0 ? stored[i++] ?? l : l) });
}
function expireChatHistory(now = Date.now()) {
	const lines = state$1.lines.filter((l) => !("createdAt" in l && l.createdAt && Date.parse(l.createdAt) <= now - 864e5));
	if (lines.length !== state$1.lines.length) set$1({ lines });
}
var empty = { viewerId: null };
var adapter = null;
var snapshot$1 = empty;
var cleanup;
var listeners$3 = /* @__PURE__ */ new Set();
function attachSourceFeatureSession(next) {
	cleanup?.();
	adapter = next;
	const notify = () => {
		snapshot$1 = adapter?.getSnapshot() ?? empty;
		listeners$3.forEach((fn) => fn());
	};
	cleanup = next?.subscribe(notify);
	notify();
}
function useSourceFeatureSession() {
	return (0, import_react.useSyncExternalStore)((fn) => {
		listeners$3.add(fn);
		return () => {
			listeners$3.delete(fn);
		};
	}, () => snapshot$1, () => empty);
}
async function executeSourceFeature(action, input) {
	if (!adapter || !snapshot$1.viewerId) throw new Error("Oyunçu hesabına giriş edilməyib.");
	return adapter.execute(action, input);
}
async function readProfileEdit() {
	const sb = getSupabase();
	if (!sb) throw new Error("Giriş sessiyası tapılmadı.");
	const { data, error } = await sb.rpc("get_profile_edit_state");
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Profil məlumatları alınmadı.");
	return data;
}
async function saveProfileEdit(input) {
	const sb = getSupabase();
	if (!sb) throw new Error("Giriş sessiyası tapılmadı.");
	const { data, error } = await sb.rpc("save_profile_info", {
		p_birthday: input["birthday"],
		p_male: input["male"] === 1,
		p_expected_price: input["expectedPrice"],
		p_expected_birthday: input["expectedBirthday"],
		p_expected_male: input["expectedMale"] === 1
	});
	if (error) throw new Error(error.message);
	await refreshProfile();
	return data;
}
/** Store an actual prepared JPEG, never a browser-only blob URL in a profile row. */
async function saveProfilePhoto(viewerId, photo) {
	const sb = getSupabase();
	if (!sb) throw new Error("Giriş sessiyası tapılmadı.");
	let url = null;
	if (photo) {
		if (!photo.startsWith("data:image/jpeg;base64,")) throw new Error("Etibarsız şəkil.");
		const bytes = Uint8Array.from(atob(photo.split(",")[1] ?? ""), (c) => c.charCodeAt(0));
		const path = `${viewerId}/${crypto.randomUUID()}.jpg`;
		const upload = await sb.storage.from("avatars").upload(path, bytes, { contentType: "image/jpeg" });
		if (upload.error) throw new Error(upload.error.message);
		const signed = await sb.storage.from("avatars").createSignedUrl(path, 31536e3);
		if (signed.error || !signed.data?.signedUrl) throw new Error("Şəkil yüklənmədi.");
		url = signed.data.signedUrl;
	}
	const { error } = await sb.from("profiles").update({ photo_url: url }).eq("id", viewerId);
	if (error) throw new Error(error.message);
	await refreshProfile();
}
async function prepareProfilePhoto(file) {
	if (!file.type.startsWith("image/")) throw new Error("Yalnız şəkil faylı seçin.");
	const image = await createImageBitmap(file);
	try {
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = 1024;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Şəkli emal etmək mümkün olmadı.");
		const size = Math.min(image.width, image.height);
		ctx.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, 1024, 1024);
		return canvas.toDataURL("image/jpeg", .9);
	} finally {
		image.close();
	}
}
/** users.up = [0, move_up), stay = [move_up, users_max - move_down), down = rest. */
function splitLeague(users, moveUp, moveDown, usersMax) {
	return {
		up: users.slice(0, moveUp),
		stay: users.slice(moveUp, Math.max(moveUp, usersMax - moveDown)),
		down: users.slice(Math.max(moveUp, usersMax - moveDown))
	};
}
/** Header pill: position while running, final place when finished. */
function leagueHeader(info, viewerId, now) {
	if (info.state === "welcome") return { type: "welcome" };
	if (info.state !== "running" && info.state !== "finished") return { type: "unknown" };
	const pos = (info.users ?? []).findIndex((u) => u.id === viewerId) + 1;
	if (info.state === "finished") return {
		type: "finished",
		positionText: String(info.final_pos ?? (pos || "—"))
	};
	const left = Math.max(0, (info.finish_ms ?? now) - now), h = Math.floor(left / 36e5), d = Math.floor(h / 24);
	return {
		type: "running",
		positionText: pos ? String(pos) : "—",
		leftTimeShortText: d > 0 ? `${d}g` : h > 0 ? `${h}s` : `${Math.ceil(left / 6e4)}dk`
	};
}
/** Only server-confirmed league participation exposes a league dialog. */
var canOpenLeague = (state) => state === "welcome" || state === "running" || state === "finished";
var snapshot = { viewerId: null };
var listeners$2 = /* @__PURE__ */ new Set();
var emit = () => listeners$2.forEach((l) => l());
var tableRead = 0;
var preferenceRevision = 0;
var kickoutRead = 0;
var rouletteRead = 0;
async function refreshRoulette(viewerId) {
	const sb = getSupabase();
	if (!sb) return;
	const read = ++rouletteRead;
	const { data, error } = await sb.rpc("roulette_info");
	if (snapshot.viewerId !== viewerId || read !== rouletteRead) return;
	if (error || !data) throw new Error("Çarx məlumatları alınmadı. Yenidən yoxlayın.");
	snapshot = {
		...snapshot,
		roulette: data
	};
	emit();
}
async function refreshKickout(viewerId) {
	const sb = getSupabase();
	if (!sb) return;
	const read = ++kickoutRead;
	const { data, error } = await sb.rpc("kickout_refresh");
	if (read !== kickoutRead || snapshot.viewerId !== viewerId) return;
	if (error || !data?.configured) {
		const { kickout: _kickout, ...rest } = snapshot;
		snapshot = rest;
		emit();
		return;
	}
	snapshot = {
		...snapshot,
		kickout: {
			price: data.price,
			vip: data.vip,
			freeAt: data.freeAt,
			lastFreeAt: data.lastFreeAt,
			targets: data.targets
		}
	};
	emit();
}
async function refreshPreference(viewerId) {
	const sb = getSupabase();
	if (!sb) return;
	const revision = ++preferenceRevision;
	const { data, error } = await sb.auth.getUser();
	if (error || snapshot.viewerId !== viewerId || revision !== preferenceRevision) return;
	snapshot = {
		...snapshot,
		leagueParticipation: data.user?.user_metadata["league_participation"] !== false
	};
	emit();
}
async function refreshTables() {
	const sb = getSupabase();
	if (!sb) return;
	const read = ++tableRead;
	const { data, error } = await sb.rpc("list_tables");
	if (error || read !== tableRead) return;
	const history = (data ?? []).map((r) => ({
		id: String(r.room_id),
		bottle: r.bottle || "standart",
		men: r.men,
		women: r.women,
		...r.is_current ? { current: true } : {},
		...r.blocked_until ? { blockedUntil: Date.parse(r.blocked_until) } : {},
		...r.kicker_id ? { kicker: {
			id: r.kicker_id,
			name: r.kicker_name ?? "",
			...r.kicker_photo ? { photo: r.kicker_photo } : {},
			...r.kicker_male !== null ? { male: r.kicker_male } : {}
		} } : {}
	}));
	snapshot = {
		...snapshot,
		tables: {
			friends: [],
			history,
			canViewById: true
		}
	};
	emit();
}
var leagueRead = 0;
var leagueInfo = null;
var leagueChannel = null;
var leagueRound;
var leagueTimer;
function applyLeague(viewerId) {
	const info = leagueInfo;
	if (!info) return;
	const running = info.state === "running" || info.state === "finished";
	snapshot = {
		...snapshot,
		leagueState: info.state,
		leagueLevel: info.level ?? 0,
		leagueHeader: leagueHeader(info, viewerId, Date.now()),
		league: running ? {
			level: info.level ?? 0,
			endsAt: info.finish_ms ?? Date.now(),
			score: info.users?.find((u) => u.id === viewerId)?.score ?? 0,
			players: (info.users ?? []).map((u) => ({
				id: u.id,
				name: u.name,
				score: u.score,
				...u.photo_url && /^https?:/.test(u.photo_url) ? { photo: u.photo_url } : {}
			})),
			state: info.state,
			...info.round_id !== void 0 ? { roundId: info.round_id } : {},
			usersMax: info.users_max ?? 20,
			moveUp: info.move_up ?? 3,
			moveDown: info.move_down ?? 3,
			maxLeague: info.max_league ?? 0,
			kisses: info.kisses ?? 0,
			kissesLim: info.kisses_lim ?? 500,
			limit: info.limit ?? null,
			gold: info.gold ?? 0,
			gifts: info.gifts ?? [],
			finalPos: info.final_pos ?? null,
			rewardGold: info.reward_gold ?? null,
			rewardGifts: info.reward_gifts ?? null
		} : void 0
	};
	emit();
}
async function refreshLeague(viewerId) {
	const sb = getSupabase();
	if (!sb) return;
	const read = ++leagueRead;
	const { data, error } = await sb.rpc("get_league");
	if (read !== leagueRead || snapshot.viewerId !== viewerId) return;
	if (error || !data) {
		console.error("get_league failed", error);
		if (!leagueInfo) {
			snapshot = {
				...snapshot,
				leagueState: "error"
			};
			emit();
		}
		return;
	}
	leagueInfo = data;
	applyLeague(viewerId);
	if (leagueInfo.round_id !== leagueRound) {
		leagueRound = leagueInfo.round_id;
		leagueChannel?.unsubscribe();
		leagueChannel = null;
		if (leagueRound !== void 0) {
			let t;
			const again = () => {
				clearTimeout(t);
				t = setTimeout(() => void refreshLeague(viewerId), 250);
			};
			leagueChannel = sb.channel(`league-${leagueRound}`).on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "league_members",
				filter: `round_id=eq.${leagueRound}`
			}, again).on("postgres_changes", {
				event: "UPDATE",
				schema: "public",
				table: "league_rounds",
				filter: `id=eq.${leagueRound}`
			}, again).subscribe();
		}
	}
}
function installCloudFeatureSession(viewerId, rejoin) {
	preferenceRevision++;
	snapshot = {
		viewerId,
		leagueState: "loading",
		tables: {
			friends: [],
			history: [],
			canViewById: true
		}
	};
	attachSourceFeatureSession({
		getSnapshot: () => snapshot,
		subscribe: (l) => {
			listeners$2.add(l);
			return () => {
				listeners$2.delete(l);
			};
		},
		execute: async (action, input) => {
			const sb = getSupabase();
			if (!sb) return {
				confirmed: false,
				message: "Server bağlantısı yoxdur."
			};
			if (action === "roulette-refresh") {
				await refreshRoulette(viewerId);
				return { confirmed: true };
			}
			if (action === "roulette-spin" || action === "roulette-buy-chances") {
				if (!snapshot.roulette || snapshot.viewerId !== viewerId || typeof input?.["requestId"] !== "string") return { confirmed: false };
				const { data, error } = await sb.rpc("roulette_action", {
					p_request: input["requestId"],
					p_action: action === "roulette-spin" ? "spin" : "buy",
					p_revision: snapshot.roulette.revision
				});
				if (error) {
					await refreshRoulette(viewerId).catch(() => void 0);
					return {
						confirmed: false,
						message: error.message
					};
				}
				await Promise.allSettled([refreshRoulette(viewerId), refreshProfile()]);
				return data;
			}
			if (action === "profile-refresh" || action === "save-profile" || action === "save-profile-photo") try {
				if (action === "save-profile-photo") await saveProfilePhoto(viewerId, String(input?.["photo"] ?? ""));
				const profile = action === "save-profile" && input ? await saveProfileEdit(input) : await readProfileEdit();
				if (snapshot.viewerId !== viewerId) return { confirmed: false };
				snapshot = {
					...snapshot,
					profile
				};
				emit();
				return { confirmed: true };
			} catch (e) {
				return {
					confirmed: false,
					message: e instanceof Error ? e.message : "Profil yadda saxlanılmadı."
				};
			}
			if (action === "league-settings") {
				if (input?.["enabled"] !== 0 && input?.["enabled"] !== 1) return { confirmed: false };
				const revision = ++preferenceRevision;
				const { data, error } = await sb.auth.updateUser({ data: { league_participation: input["enabled"] === 1 } });
				if (error) return {
					confirmed: false,
					message: "Liqa seçimi yadda saxlanılmadı."
				};
				if (snapshot.viewerId === viewerId && revision === preferenceRevision) {
					snapshot = {
						...snapshot,
						leagueParticipation: data.user?.user_metadata["league_participation"] !== false
					};
					emit();
				}
				await refreshLeague(viewerId);
				return { confirmed: true };
			}
			if (action === "league-refresh") {
				await refreshLeague(viewerId);
				return { confirmed: true };
			}
			if (action === "league-seen") {
				const round = Number(input?.["roundId"]);
				if (!Number.isSafeInteger(round)) return { confirmed: false };
				const { error } = await sb.rpc("league_seen", { p_round: round });
				if (error) return {
					confirmed: false,
					message: error.message
				};
				await refreshLeague(viewerId);
				return { confirmed: true };
			}
			if (action === "user-kick" || action === "user-save") {
				if (typeof input?.["userId"] !== "string" || !Number.isSafeInteger(input?.["expectedPrice"])) return { confirmed: false };
				const { error } = await sb.rpc("kickout_action", {
					p_user: input["userId"],
					p_action: action === "user-kick" ? "kick" : "save",
					p_expected_price: input["expectedPrice"]
				});
				await refreshKickout(viewerId);
				if (error) return {
					confirmed: false,
					message: error.message
				};
				return { confirmed: true };
			}
			if (action !== "change-table") return { confirmed: false };
			const tableId = input?.["tableId"];
			if (tableId !== void 0 && snapshot.tables?.history.find((h) => h.id === String(tableId))?.current) return { confirmed: true };
			const { data, error } = await sb.rpc("change_table", tableId !== void 0 ? { p_room: Number(tableId) } : {});
			if (error) return {
				confirmed: false,
				message: error.message
			};
			const membership = Array.isArray(data) ? data[0] : null;
			if (!membership) return {
				confirmed: false,
				message: "Masaya qoşulmaq olmadı."
			};
			await rejoin({
				room_id: Number(membership.room_id),
				seat: Number(membership.seat)
			});
			await refreshTables();
			return { confirmed: true };
		}
	});
	refreshTables();
	refreshKickout(viewerId);
	refreshPreference(viewerId);
	refreshRoulette(viewerId).catch(() => void 0);
	leagueInfo = null;
	leagueRound = void 0;
	leagueChannel?.unsubscribe();
	leagueChannel = null;
	refreshLeague(viewerId);
	clearInterval(leagueTimer);
	let ticks = 0;
	leagueTimer = setInterval(() => {
		if (snapshot.viewerId !== viewerId) return;
		ticks++;
		if (leagueInfo?.state === "running" && (leagueInfo.finish_ms ?? Infinity) <= Date.now() || ticks % 6 === 0) refreshLeague(viewerId);
		else applyLeague(viewerId);
	}, 1e4);
	clearInterval(kickoutTimer);
	kickoutTimer = setInterval(() => {
		if (snapshot.viewerId === viewerId) refreshKickout(viewerId);
	}, 2e3);
	const sb = getSupabase();
	if (sb && !liveChannel) {
		let t;
		liveChannel = sb.channel("tables-live").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "room_players"
		}, () => {
			clearTimeout(t);
			t = setTimeout(() => void refreshTables(), 300);
		}).on("postgres_changes", {
			event: "DELETE",
			schema: "public",
			table: "room_players"
		}, () => {
			clearTimeout(t);
			t = setTimeout(() => void refreshTables(), 300);
		}).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "rooms"
		}, (p) => {
			const n = p.new;
			if (snapshot.tables?.history.some((h) => h.id === String(n.id) && h.bottle !== n.bottle)) {
				clearTimeout(t);
				t = setTimeout(() => void refreshTables(), 300);
			}
		}).subscribe();
	}
}
var liveChannel = null;
var kickoutTimer;
var TABLE_BGS = [
	["", "Standart"],
	["royal_velvet", "Kral məxməri"],
	["lux_hall", "Lüks zal"],
	["night_city", "Gecə şəhəri"],
	["space", "Kosmos"],
	["seaside", "Dəniz kənarı"],
	["vip_club", "VIP klub"],
	["golden_lounge", "Qızılı istirahət zalı"],
	["crystal_cave", "Kristal mağara"],
	["royal_garden", "Saray bağı"],
	["aurora_lake", "Şimal parıltısı"],
	["underwater", "Sualtı dünya"],
	["desert_night", "Səhra gecəsi"],
	["sakura_garden", "Sakura bağı"]
];
var TABLE_BG_SKINS = {
	royal_velvet: [
		"#b3203f",
		"#4a0514",
		"#e9c46a"
	],
	lux_hall: [
		"#8a5a2a",
		"#2a1408",
		"#f0cf80"
	],
	night_city: [
		"#1f5aa8",
		"#06122a",
		"#8fd8ff"
	],
	space: [
		"#6a3ad0",
		"#10062a",
		"#e0d0ff"
	],
	seaside: [
		"#e0784a",
		"#3a1a30",
		"#ffd8a0"
	],
	vip_club: [
		"#b0208a",
		"#1a0418",
		"#ff8ad8"
	],
	golden_lounge: [
		"#3a2f1f",
		"#0d0a06",
		"#e8c66a"
	],
	crystal_cave: [
		"#2a8ac8",
		"#062040",
		"#c0f0ff"
	],
	royal_garden: [
		"#2a7a3a",
		"#0a2010",
		"#f0d890"
	],
	aurora_lake: [
		"#1f8f7a",
		"#061a2a",
		"#9dffd9"
	],
	underwater: [
		"#1ba8b8",
		"#063a4a",
		"#d8fbff"
	],
	desert_night: [
		"#a8502a",
		"#2a1008",
		"#f0c070"
	],
	sakura_garden: [
		"#d0608a",
		"#4a1030",
		"#ffe0ec"
	]
};
var isTableBg = (id) => TABLE_BGS.some(([k]) => k === id);
var tableBgName = (id) => (TABLE_BGS.find(([k]) => k === (id || "")) ?? ["", id ?? ""])[1];
var tableBgUrl = (id) => `/room-assets/table-bg/${id}.webp?v=4`;
var tableBgThumbUrl = (id) => `/room-assets/table-bg/${id}_thumb.webp?v=4`;
/** Original headerBtnSvg: themed round header button for the chosen background. */
function headerBtnSvg(id, down) {
	const skin = TABLE_BG_SKINS[id];
	if (!skin) return null;
	const [a, b, c] = skin;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62"><defs><radialGradient id="b" cx="0.5" cy="0.3" r="0.8"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.35" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0.55"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><circle cx="31" cy="32.6" r="29" fill="#000" opacity="0.35"/><circle cx="31" cy="${down ? 31.8 : 31}" r="28.3" fill="url(#b)" stroke="url(#r)" stroke-width="2.4"/>${down ? "<circle cx=\"31\" cy=\"31.8\" r=\"27\" fill=\"#000\" opacity=\"0.22\"/>" : "<ellipse cx=\"31\" cy=\"17.5\" rx=\"18.5\" ry=\"9.5\" fill=\"url(#g)\"/>"}</svg>`;
	return `data:image/svg+xml;base64,${btoa(svg)}`;
}
var current = "";
var listeners$1 = /* @__PURE__ */ new Set();
function setCurrentTableBg(id) {
	const next = id && isTableBg(id) ? id : "";
	if (next === current) return;
	current = next;
	if (next && typeof Image !== "undefined") {
		const img = new Image();
		img.src = tableBgUrl(next);
	}
	listeners$1.forEach((l) => l());
}
function useTableBg() {
	return (0, import_react.useSyncExternalStore)((l) => {
		listeners$1.add(l);
		return () => listeners$1.delete(l);
	}, () => current, () => "");
}
/** table_bg_info: price, the viewer's crystals (DAT) and the room's current background. */
async function fetchTableBgInfo() {
	const sb = getSupabase();
	if (!sb) return null;
	const { data, error } = await sb.rpc("table_bg_info");
	if (error || !data) return null;
	const d = data;
	return {
		current: d.current || "",
		price: Number(d.price),
		crystals: Number(d.crystals),
		free: Number(d.free) || 0
	};
}
/** game_table_bg: the server validates, charges crystals and updates the room atomically. */
async function buyTableBg(bg) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		reason: "offline"
	};
	const { data, error } = await sb.rpc("set_table_bg", { p_bg: bg });
	if (error || !data) return {
		ok: false,
		reason: error?.message ?? "failed"
	};
	return data;
}
var awardListeners = /* @__PURE__ */ new Set();
function subscribeHeartAwards(listener) {
	awardListeners.add(listener);
	return () => {
		awardListeners.delete(listener);
	};
}
/** Hearts already credited by the server but still flying toward the header (addViewerGold timeline). */
var pendingGold = 0;
var pendingListeners = /* @__PURE__ */ new Set();
var getPendingGold = () => pendingGold;
function subscribePendingGold(fn) {
	pendingListeners.add(fn);
	return () => {
		pendingListeners.delete(fn);
	};
}
function setPendingGold(delta) {
	pendingGold = Math.max(0, pendingGold + delta);
	pendingListeners.forEach((fn) => fn());
}
/** Emit only awards confirmed by an authenticated server RPC response. */
function emitServerHeartAward(award) {
	awardListeners.forEach((fn) => fn(award));
}
/** spin_bottle returns the lucky bonus hearts (0 = no bonus); guard against junk payloads. */
function luckyBonusAmount(data) {
	const n = Number(data ?? 0);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
/** Invalidate reads begun before a newer read or live event. */
function revisionGuard() {
	let revision = 0;
	return {
		next: () => ++revision,
		current: (value) => value === revision
	};
}
/** Bounded IDs are scoped to one room subscription, not all historical rooms. */
function eventDeduper(limit = 256) {
	const ids = /* @__PURE__ */ new Set();
	return (id) => {
		if (ids.has(id)) return false;
		ids.add(id);
		if (ids.size > limit) {
			const first = ids.values().next().value;
			if (first !== void 0) ids.delete(first);
		}
		return true;
	};
}
function haremTransition(targetId, before, after, price) {
	if ((before ?? null) === (after ?? null)) return null;
	return {
		targetId,
		newOwnerId: after ?? targetId,
		oldOwnerId: before ?? null,
		price
	};
}
var kickoutListeners = /* @__PURE__ */ new Set();
var haremListeners = /* @__PURE__ */ new Set();
/** ChatPresenter.harem: a seated player's admirer changed (realtime profiles update). */
var onRoomHarem = (fn) => {
	haremListeners.add(fn);
	return () => {
		haremListeners.delete(fn);
	};
};
var onRoomKickout = (fn) => {
	kickoutListeners.add(fn);
	return () => {
		kickoutListeners.delete(fn);
	};
};
var toDisplay = (seat, mySeat) => (seat - mySeat + 5 + 24) % 12;
var EMPTY = {
	roomId: null,
	mySeat: 0,
	room: null,
	players: Array(12).fill(null),
	phaseReceivedAt: 0,
	error: null,
	connected: false
};
var state = EMPTY;
var listeners = /* @__PURE__ */ new Set();
var set = (next) => {
	state = {
		...state,
		...next
	};
	listeners.forEach((l) => l());
};
var chatListeners = /* @__PURE__ */ new Set();
var giftListeners = /* @__PURE__ */ new Set();
/** Ciliz pushes every gift over the open socket instantly; DB INSERT feed is batched, so we fan out a
*  broadcast right after the server accepted the gift and dedupe it against the INSERT echo. */
var seenGifts = /* @__PURE__ */ new Set();
var giftKey = (r) => `${r.sender_id}|${r.receiver_id}|${r.seed}|${r.gift_type}`;
function acceptGift(r) {
	const k = giftKey(r);
	if (seenGifts.has(k)) return false;
	seenGifts.add(k);
	if (seenGifts.size > 512) {
		const f = seenGifts.values().next().value;
		if (f !== void 0) seenGifts.delete(f);
	}
	return true;
}
var emitGift = (row) => {
	if (acceptGift(row)) giftListeners.forEach((fn) => fn(row));
};
async function loadRoomChatHistory(roomId, now = Date.now()) {
	const sb = getSupabase();
	if (!sb) return [];
	const since = (/* @__PURE__ */ new Date(now - 864e5)).toISOString();
	const { data } = await sb.from("chat_messages").select("id, room_id, user_id, receiver_id, text, created_at, is_private, kind, payload").eq("room_id", roomId).gte("created_at", since).order("id", { ascending: false }).limit(100);
	const rows = (data ?? []).reverse();
	const ids = [...new Set(rows.flatMap((r) => [r.user_id, r.receiver_id].filter((x) => !!x)))];
	if (!ids.length) return [];
	const { data: profs } = await sb.from("profiles").select("*").in("id", ids);
	const byId = new Map((profs ?? []).map((p) => [p.id, p]));
	return rows.flatMap((row) => {
		const sender = byId.get(row.user_id);
		if (!sender) return [];
		const receiver = row.receiver_id ? byId.get(row.receiver_id) : void 0;
		return [{
			row,
			sender,
			...receiver ? { receiver } : {}
		}];
	});
}
var chatDeleteListeners = /* @__PURE__ */ new Set();
var onRoomChatDelete = (fn) => {
	chatDeleteListeners.add(fn);
	return () => {
		chatDeleteListeners.delete(fn);
	};
};
/** Admin-only (server re-checks the role); the DELETE reaches every client over the live feed. */
async function deleteChatMessage(id) {
	const sb = getSupabase();
	if (!sb) return false;
	const { error } = await sb.rpc("admin_delete_chat", { p_id: id });
	if (error) return false;
	chatDeleteListeners.forEach((fn) => fn(id));
	return true;
}
var adminFlag = null;
var adminListeners = /* @__PURE__ */ new Set();
async function loadAdmin() {
	const sb = getSupabase();
	if (!sb) return;
	const { data: u } = await sb.auth.getUser();
	if (!u.user) return;
	const { data } = await sb.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
	adminFlag = Boolean(data);
	adminListeners.forEach((l) => l());
}
function useIsChatAdmin() {
	return (0, import_react.useSyncExternalStore)((l) => {
		adminListeners.add(l);
		if (adminFlag === null) {
			adminFlag = false;
			loadAdmin();
		}
		return () => adminListeners.delete(l);
	}, () => Boolean(adminFlag), () => false);
}
var onRoomChat = (fn) => {
	chatListeners.add(fn);
	return () => {
		chatListeners.delete(fn);
	};
};
var gestureListeners = /* @__PURE__ */ new Set();
var onRoomGesture = (fn) => {
	gestureListeners.add(fn);
	return () => {
		gestureListeners.delete(fn);
	};
};
var premiumListeners = /* @__PURE__ */ new Set();
var premiumSeen = /* @__PURE__ */ new Set();
var onPremiumGift = (fn) => {
	premiumListeners.add(fn);
	return () => {
		premiumListeners.delete(fn);
	};
};
var emitPremium = (row) => {
	if (!row || typeof row.id !== "number" || premiumSeen.has(row.id)) return;
	premiumSeen.add(row.id);
	if (premiumSeen.size > 500) premiumSeen.delete(premiumSeen.values().next().value);
	premiumListeners.forEach((fn) => fn(row));
};
async function premiumGiftInfo() {
	const sb = getSupabase();
	if (!sb) return null;
	const { data, error } = await sb.rpc("premium_gift_info");
	if (error || !data) return null;
	const d = data;
	return {
		dat: Number(d.dat) || 0,
		gifts: Array.isArray(d.gifts) ? d.gifts : []
	};
}
async function sendPremiumGift(giftType, receiverIds, seed) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		reason: "offline"
	};
	const { data, error } = await sb.rpc("send_premium_gift", {
		p_gift: giftType,
		p_receivers: receiverIds,
		p_seed: seed
	});
	if (error) return {
		ok: false,
		reason: error.message
	};
	const d = data ?? {};
	if (d.ok) return {
		ok: true,
		dat: Number(d.dat) || 0
	};
	return {
		ok: false,
		reason: d.reason ?? "failed",
		...d.dat !== void 0 ? { dat: Number(d.dat) } : {}
	};
}
var onRoomGift = (fn) => {
	giftListeners.add(fn);
	return () => {
		giftListeners.delete(fn);
	};
};
var serverOffsetMs = 0;
var channel = null;
var heartbeatTimer = null;
var seatMap = /* @__PURE__ */ new Map();
var viewerUserId = null;
var generation = 0;
var playerRead = 0;
function mapPlayers(rows, mySeat) {
	const players = Array(12).fill(null);
	seatMap = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (row.seat < 0) continue;
		seatMap.set(row.seat, row.user_id);
		if (row.profiles) players[toDisplay(row.seat, mySeat)] = {
			...row.profiles,
			table_kisses: row.kisses ?? 0
		};
	}
	return players;
}
var refreshCurrentRoom = () => Promise.resolve();
/** Seconds each phase lasts before room_tick advances it (mirrors public.room_tick). */
var PHASE_SECONDS = {
	offer: 9,
	spin: 6,
	choose: 9,
	result: 2,
	return: 1
};
var phaseTimer = null;
/** Advance the round exactly at its deadline instead of on the next keepalive. */
function schedulePhaseDeadline(room) {
	if (phaseTimer) clearTimeout(phaseTimer);
	phaseTimer = null;
	const secs = PHASE_SECONDS[room.phase];
	const startedAt = Date.parse(room.phase_at);
	if (secs === void 0 || !Number.isFinite(startedAt)) return;
	const wait = Math.max(0, startedAt + secs * 1e3 - (Date.now() + serverOffsetMs)) + 80 + Math.random() * 120;
	phaseTimer = setTimeout(() => {
		phaseTimer = null;
		if (state.roomId === room.id) nudgeRoom();
	}, wait);
}
function applyRoom(room) {
	if (room.id !== state.roomId) return;
	const prevBg = state.room && state.room.id === room.id ? state.room.table_bg ?? "" : null;
	schedulePhaseDeadline(room);
	set({
		room,
		...!state.room || state.room.phase !== room.phase || state.room.round !== room.round ? { phaseReceivedAt: Date.now() } : {}
	});
	selectBottle(room.bottle || "standart");
	const nextBg = room.table_bg ?? "";
	setCurrentTableBg(nextBg);
	if (prevBg !== null && prevBg !== nextBg && room.table_bg_by && room.table_bg_by !== state.players[5]?.id) showSourceToast(`🎨 ${state.players.find((x) => x?.id === room.table_bg_by)?.name ?? ""} masa fonunu dəyişdi: ${tableBgName(nextBg)}`);
	const music = room.music;
	if (music) {
		const p = state.players.find((x) => x?.id === music.sender);
		applyRoomMusic(music, serverOffsetMs, {
			id: music.sender,
			name: p?.name ?? "",
			photoUrl: p?.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K",
			musicLevel: 0
		});
	}
}
async function loadPlayers(roomId, mySeat) {
	const sb = getSupabase();
	if (!sb) return;
	const version = generation, read = ++playerRead;
	const { data, error } = await sb.from("room_players").select("seat, user_id, kisses, profiles(*)").eq("room_id", roomId);
	if (error || version !== generation || read !== playerRead || state.roomId !== roomId) return;
	if (viewerUserId && !(data ?? []).some((row) => row.user_id === viewerUserId)) {
		set({
			connected: false,
			error: "Masadan ayrıldın.",
			players: mapPlayers(data ?? [], mySeat)
		});
		return;
	}
	set({ players: mapPlayers(data ?? [], mySeat) });
}
async function teardown() {
	generation++;
	stopTokenUpdates?.();
	stopTokenUpdates = null;
	const sb = getSupabase();
	if (heartbeatTimer) clearInterval(heartbeatTimer);
	heartbeatTimer = null;
	if (phaseTimer) clearTimeout(phaseTimer);
	phaseTimer = null;
	if (channel && sb) await sb.removeChannel(channel);
	channel = null;
}
var queue = Promise.resolve();
var serial = (fn) => {
	const p = queue.then(fn, fn);
	queue = p.catch(() => void 0);
	return p;
};
var joinRoom = () => serial(joinRoomNow);
/** Stop this view's feeds, not the account's server-owned membership. */
var detachRoom = () => serial(async () => {
	await teardown();
	set({ connected: false });
});
/** Consume the membership already committed by change_table, without joining a second time. */
var switchRoom = (membership) => serial(() => joinRoomNow(membership));
async function joinRoomNow(membership) {
	const sb = getSupabase();
	if (!sb) {
		set({
			error: "Server bağlantısı yoxdur.",
			connected: false
		});
		throw new Error("Server bağlantısı yoxdur.");
	}
	set({ connected: false });
	await teardown();
	const { data: sess } = await sb.auth.getSession();
	accessToken = sess.session?.access_token ?? null;
	const tokenGeneration = generation;
	const { data: tokenSubscription } = sb.auth.onAuthStateChange((_event, session) => {
		if (generation === tokenGeneration) accessToken = session?.access_token ?? null;
	});
	stopTokenUpdates = () => tokenSubscription.subscription.unsubscribe();
	const t0 = Date.now();
	const { data: nowData } = await sb.rpc("server_now");
	if (nowData) serverOffsetMs = new Date(nowData).getTime() - (t0 + Date.now()) / 2;
	const { data, error } = membership ? {
		data: [membership],
		error: null
	} : await sb.rpc("join_room");
	const joined = Array.isArray(data) ? data[0] : null;
	if (error || !joined) {
		set({ error: gameError(error?.message ?? "Masaya qoşulmaq olmadı.") });
		throw new Error(gameError(error?.message ?? "Masaya qoşulmaq olmadı."));
	}
	const roomId = Number(joined.room_id);
	const mySeat = Number(joined.seat);
	const mapSeat = mySeat >= 0 ? mySeat : 5;
	const version = generation;
	const current = () => version === generation && state.roomId === roomId;
	const [initialRoom, initialPlayers] = await Promise.all([sb.from("rooms").select("*").eq("id", roomId).single(), sb.from("room_players").select("seat, user_id, kisses, profiles(*)").eq("room_id", roomId)]);
	if (initialRoom.error || initialPlayers.error || !initialRoom.data) {
		const message = gameError(initialRoom.error?.message ?? initialPlayers.error?.message ?? "Masaya qoşulmaq olmadı.");
		set({
			connected: false,
			error: message
		});
		throw new Error(message);
	}
	if (state.roomId !== roomId) resetRoomMusic();
	set({
		roomId,
		mySeat,
		room: initialRoom.data,
		players: mapPlayers(initialPlayers.data, mapSeat),
		connected: false,
		error: null
	});
	applyRoom(initialRoom.data);
	const { data: auth } = await sb.auth.getUser();
	viewerUserId = auth.user?.id ?? null;
	if (auth.user) installCloudFeatureSession(auth.user.id, switchRoom);
	const refreshRoom = async () => {
		const read = roomRevision.next();
		const { data: room } = await sb.from("rooms").select("*").eq("id", roomId).single();
		if (room && current() && roomRevision.current(read)) applyRoom(room);
	};
	const roomRevision = revisionGuard();
	const acceptKickout = eventDeduper();
	channel = sb.channel(`room-${roomId}`).on("postgres_changes", {
		event: "UPDATE",
		schema: "public",
		table: "rooms",
		filter: `id=eq.${roomId}`
	}, (p) => {
		if (current()) {
			roomRevision.next();
			applyRoom(p.new);
		}
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "room_players",
		filter: `room_id=eq.${roomId}`
	}, () => {
		if (current()) {
			loadPlayers(roomId, mapSeat);
			nudgeRoom();
		}
	}).on("postgres_changes", {
		event: "UPDATE",
		schema: "public",
		table: "room_players",
		filter: `room_id=eq.${roomId}`
	}, (p) => {
		const old = p.old;
		const next = p.new;
		if (current() && (old.seat !== next.seat || old.room_id !== next.room_id || p.old.kisses !== p.new.kisses)) loadPlayers(roomId, mapSeat);
	}).on("postgres_changes", {
		event: "DELETE",
		schema: "public",
		table: "room_players"
	}, () => {
		if (current()) {
			loadPlayers(roomId, mapSeat);
			refreshRoom();
		}
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "chat_messages",
		filter: `room_id=eq.${roomId}`
	}, (p) => {
		if (current()) chatListeners.forEach((fn) => fn(p.new));
	}).on("postgres_changes", {
		event: "DELETE",
		schema: "public",
		table: "chat_messages"
	}, (p) => {
		const id = Number(p.old.id);
		if (current() && id) chatDeleteListeners.forEach((fn) => fn(id));
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "kickout_events",
		filter: `room_id=eq.${roomId}`
	}, (p) => {
		const row = p.new;
		if (current() && acceptKickout(row.id)) kickoutListeners.forEach((fn) => fn(row));
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "gift_events",
		filter: `room_id=eq.${roomId}`
	}, (p) => {
		if (current()) emitGift(p.new);
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "premium_gift_events"
	}, (p) => {
		if (current()) emitPremium(p.new);
	}).on("broadcast", { event: "gift" }, (m) => {
		if (!current()) return;
		const rows = m["payload"]?.rows;
		if (Array.isArray(rows)) rows.forEach((r) => {
			if (r && typeof r.sender_id === "string" && typeof r.gift_type === "string") emitGift(r);
		});
	}).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "gesture_events",
		filter: `room_id=eq.${roomId}`
	}, (p) => {
		if (current()) gestureListeners.forEach((fn) => fn(p.new));
	}).on("postgres_changes", {
		event: "UPDATE",
		schema: "public",
		table: "profiles"
	}, (p) => {
		if (!current()) return;
		const prof = p.new;
		const i = state.players.findIndex((x) => x?.id === prof.id);
		if (i >= 0) {
			playerRead++;
			const before = state.players[i];
			const after = prof;
			const event = before ? haremTransition(prof.id, before.harem_owner, after.harem_owner, Number(after.harem_value ?? 0)) : null;
			if (event) haremListeners.forEach((fn) => fn(event));
			const players = [...state.players];
			players[i] = {
				...prof,
				table_kisses: before?.table_kisses ?? 0
			};
			set({ players });
		}
	}).subscribe((status) => {
		if (!current()) return;
		if (status === "SUBSCRIBED") {
			set({
				connected: true,
				error: null
			});
			loadPlayers(roomId, mapSeat);
			refreshRoom();
			nudgeRoom();
		} else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") set({
			connected: false,
			error: "Bağlantı kəsildi, yenidən qoşulunur..."
		});
	});
	let pulse = 0;
	const runPulse = singleFlight();
	heartbeatTimer = setInterval(() => {
		if (!current()) return;
		runPulse(async () => {
			const { error: heartbeatError } = await sb.rpc("heartbeat");
			if (heartbeatError || !current()) return;
			pulse++;
			if (!current()) return;
			await sb.rpc("kickout_refresh");
			if (current()) await sb.rpc("room_tick", { p_room: roomId });
			if (pulse % 2 === 0) {
				loadPlayers(roomId, mapSeat);
				refreshRoom();
			}
			if (pulse % 2 === 1) {
				const { data: s } = await sb.auth.getSession();
				const uid = s.session?.user.id;
				if (!uid || !current()) return;
				const { data: mine, error: missingErr } = await sb.from("room_players").select("room_id, seat").eq("user_id", uid).maybeSingle();
				if (!missingErr && current()) {
					if (!mine) joinRoom().catch(() => void 0);
					else if (Number(mine.room_id) !== roomId || Number(mine.seat) !== mySeat) switchRoom({
						room_id: Number(mine.room_id),
						seat: Number(mine.seat)
					}).catch(() => void 0);
				}
			}
		}).catch(() => void 0);
	}, 5e3);
	refreshCurrentRoom = () => current() ? refreshRoom() : Promise.resolve();
	await Promise.all([loadPlayers(roomId, mapSeat), refreshRoom()]);
	nudgeRoom();
}
var accessToken = null;
var stopTokenUpdates = null;
/** Refresh/tab suspension renews the lease; only explicit leaveRoom frees a seat. */
function leaveRoomNow() {
	const url = {
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
	}["VITE_SUPABASE_URL"];
	const key = {
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
	}["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? {
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
	}["VITE_SUPABASE_ANON_KEY"];
	if (!url || !key || !accessToken) return;
	try {
		fetch(`${url}/rest/v1/rpc/heartbeat`, {
			method: "POST",
			keepalive: true,
			headers: {
				apikey: key,
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			body: "{}"
		});
	} catch {}
}
var leaveRoom = () => serial(async () => {
	const sb = getSupabase();
	await teardown();
	if (sb) {
		const { error } = await sb.rpc("leave_room");
		if (error) {
			set({
				error: gameError(error.message),
				connected: false
			});
			throw error;
		}
	}
	resetRoomMusic();
	accessToken = null;
	set(EMPTY);
});
function nudgeRoom() {
	const sb = getSupabase();
	if (sb && state.roomId !== null) Promise.resolve(sb.rpc("room_tick", { p_room: state.roomId }));
}
function profileBySeat(display) {
	return state.players[display] ?? null;
}
function displaySeatOf(userId) {
	return state.players.findIndex((p) => p?.id === userId);
}
async function spinBottle() {
	const res = await getSupabase()?.rpc("spin_bottle");
	if (res && !res.error) {
		const lucky = luckyBonusAmount(res.data);
		if (lucky > 0) emitServerHeartAward({
			id: `lucky:${Date.now()}:${Math.random()}`,
			viewerId: "",
			amount: lucky,
			lucky: true,
			prepaid: true
		});
		await refreshCurrentRoom();
	}
}
async function decide(kiss) {
	const res = await getSupabase()?.rpc("decide", { p_kiss: kiss });
	if (res && !res.error) await refreshCurrentRoom();
}
async function sendChat(text, receiverId, isPrivate = false) {
	const sb = getSupabase();
	if (!sb) return false;
	const { error } = await sb.rpc("send_chat", {
		p_text: text,
		p_receiver: receiverId ?? null,
		p_private: Boolean(isPrivate && receiverId)
	});
	return !error;
}
async function sendGift(giftType, receiverIds, seed) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		reason: "offline"
	};
	const { data, error } = await sb.rpc("send_gift", {
		p_gift: giftType,
		p_receivers: receiverIds,
		p_seed: seed
	});
	if (error) return {
		ok: false,
		reason: error.message
	};
	const { data: auth } = await sb.auth.getSession();
	const me = auth.session?.user.id;
	if (me && channel) {
		const rows = receiverIds.map((rid) => ({
			id: 0,
			sender_id: me,
			receiver_id: rid,
			gift_type: giftType,
			seed
		}));
		rows.forEach((r) => {
			acceptGift(r);
		});
		channel.send({
			type: "broadcast",
			event: "gift",
			payload: { rows }
		});
	}
	return {
		ok: true,
		gold: Number(data ?? 0)
	};
}
function useRoom() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, () => state, () => EMPTY);
}
var getRoom = () => state;
/** Server clock (sampled at join), so every client counts the same phase deadline. */
var serverNow = () => Date.now() + serverOffsetMs;
async function buyBottle(type) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		reason: "offline"
	};
	const { data, error } = await sb.rpc("buy_bottle", { p_bottle: type });
	if (error) return {
		ok: false,
		reason: error.message
	};
	return {
		ok: true,
		gold: Number(data ?? 0)
	};
}
/** Server charges tokens and broadcasts the gesture to everyone at the table. */
async function sendGesture(gesture) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		reason: "offline"
	};
	const { data, error } = await sb.rpc("send_gesture", { p_gesture: gesture });
	if (error) return {
		ok: false,
		reason: error.message
	};
	return {
		ok: true,
		tokens: Number(data ?? 0)
	};
}
//#endregion
export { bottleItems as $, pushMusicHistoryLine as A, OPEN_BANK_EVENT as B, getSharedAudio as C, pushGiftLine as D, pushGestureLine as E, sendMusic as F, SourceDialogLayer as G, OPEN_TOPS_EVENT as H, setMusicMuted as I, SourceToastHost as J, SourceGiftLockedDialog as K, setMusicVolume as L, pushTextLine as M, registerMusicServices as N, pushHaremLine as O, removeTextLine as P, RETURN_SECONDS as Q, stampChatHistory as R, finishMusic as S, pushBottleLine as T, OPEN_VIP_EVENT as U, OPEN_DECOR_EVENT as V, SourceButtons as W, presentationBudget as X, showSourceToast as Y, CENTER_PLAYER_SCALE as Z, prepareProfilePhoto as _, subscribeHeartAwards as a, turnOfferSound as at, batchChatHistory as b, buyBottle, buyTableBg as c, tableBgName as d, decide, deleteChatMessage, detachRoom, displaySeatOf, decisionArrowsVisible as et, tableBgThumbUrl as f, splitLeague as g, getRoom, canOpenLeague as h, setPendingGold as i, spinAngle as it, pushSystemLine as j, joinRoom, pushKickoutLine as k, fetchTableBgInfo as l, leaveRoom, leaveRoomNow, loadRoomChatHistory, useTableBg as m, emitServerHeartAward as n, leftRight as nt, nudgeRoom, subscribePendingGold as o, onPremiumGift, onRoomChat, onRoomChatDelete, onRoomGesture, onRoomGift, onRoomHarem, onRoomKickout, useBottle as ot, tableBgUrl as p, premiumGiftInfo, profileBySeat, SourceInfoDialog as q, getPendingGold as r, selectBottle as rt, TABLE_BGS as s, sendChat, sendGesture, sendGift, sendPremiumGift, serverNow, spinBottle, waitingHint as st, revisionGuard as t, toDisplay, decisionTimerVisible as tt, headerBtnSvg as u, useIsChatAdmin, useRoom, executeSourceFeature as v, pushActionLine as w, expireChatHistory as x, useSourceFeatureSession as y, useMusicSession as z };
