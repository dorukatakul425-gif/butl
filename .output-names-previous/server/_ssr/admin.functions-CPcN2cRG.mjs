import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { n as telegramPayload, t as telegramNoticeSchema } from "./telegram-notifications-DBMBBFlt.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { t as rouletteConfigSchema } from "./roulette-config-D0UHMX9J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CPcN2cRG.js
async function assertAdmin(context) {
	const { data, error } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (error || data !== true) throw new Error("Forbidden");
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	return supabaseAdmin;
}
var checkAdmin_createServerFn_handler = createServerRpc({
	id: "0df6a912ffe4ab8c08b2802754fd812aaa5a08909865dc6907d1c19fbab16a80",
	name: "checkAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => checkAdmin.__executeServer(opts));
var checkAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(checkAdmin_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	return { isAdmin: data === true };
});
var getAdminStats_createServerFn_handler = createServerRpc({
	id: "4fec70c92c2624b017310f557d52373f6e45b4f5283a3272a864213d4d65e68d",
	name: "getAdminStats",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminStats.__executeServer(opts));
var getAdminStats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getAdminStats_createServerFn_handler, async ({ context }) => {
	const admin = await assertAdmin(context);
	const count = async (table) => {
		const { count: c } = await admin.from(table).select("*", {
			count: "exact",
			head: true
		});
		return c ?? 0;
	};
	const since = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString();
	const { count: newToday } = await admin.from("profiles").select("*", {
		count: "exact",
		head: true
	}).gte("created_at", since);
	const [players, seated, rooms, gifts, messages] = await Promise.all([
		count("profiles"),
		count("room_players"),
		count("rooms"),
		count("gift_events"),
		count("chat_messages")
	]);
	return {
		players,
		newToday: newToday ?? 0,
		seated,
		rooms,
		gifts,
		messages
	};
});
var ListInput = objectType({
	search: stringType().trim().max(60).default(""),
	page: numberType().int().min(0).max(1e4).default(0)
});
var listPlayers_createServerFn_handler = createServerRpc({
	id: "5876880f9460044d2cee04222fc041b2984a96c7f1e01f4fcc1acc407b294502",
	name: "listPlayers",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listPlayers.__executeServer(opts));
var listPlayers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ListInput.parse(d)).handler(listPlayers_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const size = 25;
	let q = admin.from("profiles").select("id, player_no, username, name, male, age, city, gold, tokens, dat, kisses, vip_until, created_at", { count: "exact" }).order("created_at", { ascending: false }).range(data.page * size, data.page * size + size - 1);
	const s = data.search.replace(/[%,()]/g, "");
	if (s) q = /^\d+$/.test(s) ? q.or(`player_no.eq.${s},username.ilike.%${s}%`) : q.or(`username.ilike.%${s}%,name.ilike.%${s}%`);
	const { data: rows, count, error } = await q;
	if (error) throw new Error(error.message);
	const ids = (rows ?? []).map((p) => p.id);
	const { data: bans } = ids.length ? await admin.from("user_bans").select("user_id, reason, banned_until").in("user_id", ids) : { data: [] };
	const active = new Map((bans ?? []).filter((b) => !b.banned_until || new Date(b.banned_until).getTime() > Date.now()).map((b) => [b.user_id, b]));
	return {
		players: (rows ?? []).map((p) => ({
			...p,
			banned: active.has(p.id),
			banReason: active.get(p.id)?.reason,
			bannedUntil: active.get(p.id)?.banned_until
		})),
		total: count ?? 0,
		pageSize: size
	};
});
var BalanceInput = objectType({
	userId: stringType().uuid(),
	field: enumType([
		"gold",
		"tokens",
		"dat"
	]),
	delta: numberType().int().min(-1e7).max(1e7)
});
var adjustBalance_createServerFn_handler = createServerRpc({
	id: "b8999623daee78b706e1c720cdcd4a1447ff0a2b08503502eb476a7a550fad3e",
	name: "adjustBalance",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adjustBalance.__executeServer(opts));
var adjustBalance = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BalanceInput.parse(d)).handler(adjustBalance_createServerFn_handler, async ({ data, context }) => {
	const { data: value, error } = await (await assertAdmin(context)).rpc("admin_adjust_balance", {
		_user_id: data.userId,
		_field: data.field,
		_delta: data.delta
	});
	if (error) throw new Error(error.message);
	return { value };
});
var KissesInput = objectType({
	userId: stringType().uuid(),
	value: numberType().int().min(0).max(1e7)
});
/** Admin: set a player's total kiss count to an exact value. */
var setKisses_createServerFn_handler = createServerRpc({
	id: "3233a93a22a0cdf45aced1e0500e8cad2d942a9f336e49efa0fc1e3e7f6f23a0",
	name: "setKisses",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setKisses.__executeServer(opts));
var setKisses = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => KissesInput.parse(d)).handler(setKisses_createServerFn_handler, async ({ data, context }) => {
	const { data: value, error } = await (await assertAdmin(context)).rpc("admin_set_kisses", {
		_user_id: data.userId,
		_value: data.value
	});
	if (error) throw new Error(error.message);
	return { value };
});
var BanInput = objectType({
	userId: stringType().uuid(),
	banned: booleanType(),
	reason: stringType().trim().max(300).default(""),
	hours: numberType().int().min(1).max(876e3).nullable().default(null)
});
var setBan_createServerFn_handler = createServerRpc({
	id: "822155bcd1be13e3a8e1f4ba680c415aa4c8bdd97c6bfc1b742d3cba4868b2a7",
	name: "setBan",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setBan.__executeServer(opts));
var setBan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BanInput.parse(d)).handler(setBan_createServerFn_handler, async ({ data, context }) => {
	if (data.userId === context.userId) throw new Error("Kendini banlayamazsın");
	const admin = await assertAdmin(context);
	if (!data.banned) {
		await admin.from("user_bans").delete().eq("user_id", data.userId);
		const { error } = await admin.auth.admin.updateUserById(data.userId, { ban_duration: "none" });
		if (error) throw new Error(error.message);
		return { banned: false };
	}
	const until = data.hours ? new Date(Date.now() + data.hours * 36e5).toISOString() : null;
	const { error: e1 } = await admin.from("user_bans").upsert({
		user_id: data.userId,
		reason: data.reason,
		banned_by: context.userId,
		banned_at: (/* @__PURE__ */ new Date()).toISOString(),
		banned_until: until
	});
	if (e1) throw new Error(e1.message);
	const { error } = await admin.auth.admin.updateUserById(data.userId, { ban_duration: `${data.hours ?? 876e3}h` });
	if (error) throw new Error(error.message);
	await admin.rpc("admin_revoke_sessions", { _user_id: data.userId });
	await admin.from("room_players").delete().eq("user_id", data.userId);
	return { banned: true };
});
var BroadcastInput = objectType({
	roomId: numberType().int().positive(),
	text: stringType().trim().min(1).max(300)
});
/** Original admin_chat: a green announcement line in the chosen room's chat. */
var sendBroadcast_createServerFn_handler = createServerRpc({
	id: "bde0067a66870a55f410c347c8e29529ddffc5e667d4df1559d1d194db48e7b8",
	name: "sendBroadcast",
	filename: "src/lib/admin.functions.ts"
}, (opts) => sendBroadcast.__executeServer(opts));
var sendBroadcast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BroadcastInput.parse(d)).handler(sendBroadcast_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { error } = await context.supabase.rpc("admin_broadcast", {
		p_room: data.roomId,
		p_text: data.text
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listRoomsAdmin_createServerFn_handler = createServerRpc({
	id: "6c6f2514a47ca8bd16c6df19d6111f6d42041ec7a65b94c7ea5147ed1d5cb1c9",
	name: "listRoomsAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listRoomsAdmin.__executeServer(opts));
var listRoomsAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listRoomsAdmin_createServerFn_handler, async ({ context }) => {
	const admin = await assertAdmin(context);
	const { data: rooms, error } = await admin.from("rooms").select("id, phase, created_at").order("id");
	if (error) throw new Error(error.message);
	const { data: players } = await admin.from("room_players").select("room_id, user_id");
	const counts = /* @__PURE__ */ new Map();
	for (const p of players ?? []) counts.set(p.room_id, (counts.get(p.room_id) ?? 0) + 1);
	return { rooms: (rooms ?? []).map((r) => ({
		id: r.id,
		phase: r.phase,
		players: counts.get(r.id) ?? 0
	})) };
});
var ViewRoomInput = objectType({ roomId: numberType().int().positive() });
var viewRoomAdmin_createServerFn_handler = createServerRpc({
	id: "58aafa9101181d03a080fd1acc7f24420dc2a1078b4c2789f5175f298d5d5080",
	name: "viewRoomAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => viewRoomAdmin.__executeServer(opts));
var viewRoomAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ViewRoomInput.parse(d)).handler(viewRoomAdmin_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const { data: seats, error } = await admin.from("room_players").select("seat, user_id, last_seen").eq("room_id", data.roomId).order("seat");
	if (error) throw new Error(error.message);
	const ids = (seats ?? []).map((s) => s.user_id);
	const { data: people } = ids.length ? await admin.from("profiles").select("id, name, username, photo_url, male").in("id", ids) : { data: [] };
	const byId = new Map((people ?? []).map((p) => [p.id, p]));
	const { data: msgs } = await admin.from("chat_messages").select("id, user_id, text, kind, created_at").eq("room_id", data.roomId).order("id", { ascending: false }).limit(50);
	const msgIds = [...new Set((msgs ?? []).map((m) => m.user_id))];
	const { data: msgPeople } = msgIds.length ? await admin.from("profiles").select("id, name").in("id", msgIds) : { data: [] };
	const nameOf = new Map((msgPeople ?? []).map((p) => [p.id, p.name]));
	return {
		seats: (seats ?? []).map((s) => ({
			seat: s.seat,
			name: byId.get(s.user_id)?.name ?? "?",
			photoUrl: byId.get(s.user_id)?.photo_url ?? ""
		})),
		messages: (msgs ?? []).reverse().map((m) => ({
			id: m.id,
			name: nameOf.get(m.user_id) ?? "?",
			text: m.text,
			kind: m.kind ?? "chat"
		}))
	};
});
var ReportsInput = objectType({ status: enumType([
	"open",
	"reviewed",
	"dismissed"
]).default("open") });
var listReports_createServerFn_handler = createServerRpc({
	id: "c9956b44cec3c1fce949ecfd38437e467b57699a11f341d5b3196cf08648be73",
	name: "listReports",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listReports.__executeServer(opts));
var listReports = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ReportsInput.parse(d)).handler(listReports_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const { data: rows, error } = await admin.from("user_reports").select("id, reporter_id, reported_id, category, details, context, status, admin_note, created_at, photo_url").eq("status", data.status).order("created_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	const ids = [...new Set((rows ?? []).flatMap((r) => [r.reporter_id, r.reported_id]))];
	const { data: people } = ids.length ? await admin.from("profiles").select("id, name, username, player_no").in("id", ids) : { data: [] };
	const byId = new Map((people ?? []).map((p) => [p.id, p]));
	const { count: open } = await admin.from("user_reports").select("*", {
		count: "exact",
		head: true
	}).eq("status", "open");
	return {
		reports: (rows ?? []).map((r) => ({
			id: r.id,
			category: r.category,
			details: r.details,
			context: r.context,
			status: r.status,
			adminNote: r.admin_note ?? "",
			photoUrl: r.photo_url ?? null,
			createdAt: r.created_at,
			reporter: {
				id: r.reporter_id,
				name: byId.get(r.reporter_id)?.name ?? "?",
				username: byId.get(r.reporter_id)?.username ?? ""
			},
			reported: {
				id: r.reported_id,
				name: byId.get(r.reported_id)?.name ?? "?",
				username: byId.get(r.reported_id)?.username ?? "",
				playerNo: byId.get(r.reported_id)?.player_no ?? null
			}
		})),
		open: open ?? 0
	};
});
var ResolveInput = objectType({
	id: stringType().uuid(),
	status: enumType([
		"reviewed",
		"dismissed",
		"open"
	]),
	note: stringType().trim().max(500).default("")
});
var resolveReport_createServerFn_handler = createServerRpc({
	id: "6fac58f2682ac346176b61a1647ce58c52925ac2e4c76d5ec29c62561a8ac845",
	name: "resolveReport",
	filename: "src/lib/admin.functions.ts"
}, (opts) => resolveReport.__executeServer(opts));
var resolveReport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ResolveInput.parse(d)).handler(resolveReport_createServerFn_handler, async ({ data, context }) => {
	const { error } = await (await assertAdmin(context)).from("user_reports").update({
		status: data.status,
		admin_note: data.note || null,
		reviewed_at: data.status === "open" ? null : (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var StatusListInput = objectType({ review: enumType([
	"pending",
	"approved",
	"rejected"
]).default("pending") });
var listStatusReviews_createServerFn_handler = createServerRpc({
	id: "204f47c307b90513baa75d8c2e53c3f9d046a21d274476a509053815a79d4078",
	name: "listStatusReviews",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listStatusReviews.__executeServer(opts));
var listStatusReviews = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => StatusListInput.parse(d)).handler(listStatusReviews_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const { data: rows, error } = await admin.from("statuses").select("id, user_id, kind, body, media_path, bg, created_at, expires_at, review").eq("review", data.review).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("created_at", { ascending: data.review === "pending" }).limit(100);
	if (error) throw new Error(error.message);
	const list = rows ?? [];
	const ids = [...new Set(list.map((r) => r.user_id))];
	const { data: people } = ids.length ? await admin.from("profiles").select("id, name, username, player_no").in("id", ids) : { data: [] };
	const byId = new Map((people ?? []).map((p) => [p.id, p]));
	const paths = list.map((r) => r.media_path).filter(Boolean);
	const urls = /* @__PURE__ */ new Map();
	if (paths.length) {
		const { data: signed } = await admin.storage.from("statuses").createSignedUrls(paths, 3600);
		for (const s of signed ?? []) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
	}
	const { count: pending } = await admin.from("statuses").select("*", {
		count: "exact",
		head: true
	}).eq("review", "pending").gt("expires_at", (/* @__PURE__ */ new Date()).toISOString());
	return {
		statuses: list.map((r) => ({
			id: r.id,
			kind: r.kind,
			body: r.body ?? "",
			bg: r.bg,
			mediaUrl: r.media_path ? urls.get(r.media_path) ?? null : null,
			createdAt: r.created_at,
			review: r.review,
			author: {
				name: byId.get(r.user_id)?.name ?? "?",
				username: byId.get(r.user_id)?.username ?? "",
				playerNo: byId.get(r.user_id)?.player_no ?? null
			}
		})),
		pending: pending ?? 0
	};
});
var StatusReviewInput = objectType({
	id: stringType().uuid(),
	approve: booleanType()
});
var reviewStatus_createServerFn_handler = createServerRpc({
	id: "fadf8509e30882cccd4681aa362793b1b2e426baf063edcf6c354bd393545833",
	name: "reviewStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => reviewStatus.__executeServer(opts));
var reviewStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => StatusReviewInput.parse(d)).handler(reviewStatus_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const patch = data.approve ? {
		review: "approved",
		expires_at: new Date(Date.now() + 864e5).toISOString()
	} : { review: "rejected" };
	const { error } = await admin.from("statuses").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
/** Direct Bot API: uses the same explicitly configured bot token as Telegram login. */
async function callTelegram(token, method, body) {
	const multipart = body instanceof FormData;
	const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
		method: "POST",
		headers: multipart ? void 0 : { "Content-Type": "application/json" },
		body: multipart ? body : JSON.stringify(body),
		signal: AbortSignal.timeout(2e4)
	});
	const raw = await response.text();
	let json;
	try {
		json = JSON.parse(raw);
	} catch {
		throw new Error(`Telegram [${response.status}]: etibarsız cavab`);
	}
	if (!response.ok || json.ok !== true) {
		const reason = (json.description ?? "Göndərilə bilmədi").replaceAll(token, "[redacted]");
		console.error(`Telegram [${response.status}]: ${reason}`);
		throw new Error(`Telegram [${response.status}]: ${reason}${json.parameters?.retry_after ? ` (${json.parameters.retry_after} saniyə gözləyin)` : ""}`);
	}
	return json.result;
}
var sendTelegramNotifications_createServerFn_handler = createServerRpc({
	id: "c029b68a5bf957bd4e8d738b068d6c68bdbc1f0fe40a9345244c6405e6e232de",
	name: "sendTelegramNotifications",
	filename: "src/lib/admin.functions.ts"
}, (opts) => sendTelegramNotifications.__executeServer(opts));
var sendTelegramNotifications = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => telegramNoticeSchema.parse(d)).handler(sendTelegramNotifications_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const { getTelegramBotToken } = await import("./telegram-config.server-BA-mWf8y.mjs");
	const token = await getTelegramBotToken();
	let query = admin.from("profiles").select("id, telegram_id").not("telegram_id", "is", null).order("id").limit(11);
	if (data.after) query = query.gt("id", data.after);
	const { data: rows, error } = await query;
	if (error) throw new Error(error.message);
	const batch = (rows ?? []).slice(0, 10);
	let sent = 0, failed = 0;
	const errors = /* @__PURE__ */ new Set();
	for (const row of batch) {
		try {
			const payload = telegramPayload(data, row.telegram_id);
			await callTelegram(token, payload.method, payload.body);
			sent++;
		} catch (e) {
			failed++;
			errors.add(e instanceof Error ? e.message : "Telegram göndərişi uğursuz oldu.");
		}
		await new Promise((resolve) => setTimeout(resolve, 60));
	}
	return {
		attempted: batch.length,
		sent,
		failed,
		errors: [...errors].slice(0, 5),
		after: batch.at(-1)?.id ?? null,
		done: (rows ?? []).length <= 10
	};
});
var uploadTelegramMedia_createServerFn_handler = createServerRpc({
	id: "330c3911397e0e2fbc9ce66360469e910809ecf6c06cf0f16a14530e7b390e7d",
	name: "uploadTelegramMedia",
	filename: "src/lib/admin.functions.ts"
}, (opts) => uploadTelegramMedia.__executeServer(opts));
var uploadTelegramMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => {
	if (!(d instanceof FormData)) throw new Error("Fayl tələb olunur.");
	return d;
}).handler(uploadTelegramMedia_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const { getTelegramBotToken } = await import("./telegram-config.server-BA-mWf8y.mjs");
	const token = await getTelegramBotToken();
	const file = data.get("file"), kind = data.get("kind");
	if (!(file instanceof File) || !["photo", "video"].includes(String(kind))) throw new Error("Etibarsız fayl.");
	const photo = kind === "photo";
	if (!file.size || file.size > (photo ? 10 : 50) * 1024 * 1024) throw new Error(photo ? "Şəkil 10 MB-dan böyük ola bilməz." : "Video 50 MB-dan böyük ola bilməz.");
	if (!(photo ? ["image/jpeg", "image/png"] : ["video/mp4"]).includes(file.type)) throw new Error("Şəkil JPEG/PNG, video MP4 olmalıdır.");
	const { data: recipient } = await admin.from("profiles").select("telegram_id").eq("id", context.userId).maybeSingle();
	if (!recipient?.telegram_id) throw new Error("Fayl yükləmək üçün admin hesabına Telegram ilə giriş edin.");
	const form = new FormData();
	form.set("chat_id", String(recipient.telegram_id));
	form.set(String(kind), file);
	form.set("disable_notification", "true");
	form.set("caption", "Admin: göndəriş üçün media önbaxışı");
	const result = await callTelegram(token, photo ? "sendPhoto" : "sendVideo", form);
	const fileId = photo ? result?.photo?.at(-1)?.file_id : result?.video?.file_id;
	if (!fileId) throw new Error("Telegram fayl ID-si alınmadı.");
	return { fileId };
});
var replaceTelegramBotToken_createServerFn_handler = createServerRpc({
	id: "e17cf45638992b4b40befd835dc4d6d57d6c53fe6d317529266731653aa3976e",
	name: "replaceTelegramBotToken",
	filename: "src/lib/admin.functions.ts"
}, (opts) => replaceTelegramBotToken.__executeServer(opts));
var replaceTelegramBotToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input || typeof input !== "object" || !("token" in input) || typeof input.token !== "string" || !/^\d{5,16}:[A-Za-z0-9_-]{20,200}$/.test(input.token)) throw new Error("Etibarsız bot tokeni.");
	return { token: input.token };
}).handler(replaceTelegramBotToken_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	try {
		const response = await fetch(`https://api.telegram.org/bot${data.token}/getMe`, {
			method: "POST",
			signal: AbortSignal.timeout(8e3)
		});
		if (!response.ok) throw new Error();
		const body = await response.json();
		if (!body.ok || body.result?.is_bot !== true) throw new Error();
	} catch {
		throw new Error("Bot tokeni doğrulanmadı.");
	}
	const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
	if (!key) throw new Error("Bot ayarları saxlanmadı.");
	const { encryptBotToken } = await import("./telegram-config-Ca6pT6N3.mjs");
	const encrypted = await encryptBotToken(data.token, key);
	const { error } = await admin.from("telegram_bot_settings").upsert({
		id: 1,
		...encrypted,
		updated_by: context.userId,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (error) throw new Error("Bot ayarları saxlanmadı.");
	return { ok: true };
});
var LevelInput = objectType({
	userId: stringType().uuid(),
	level: numberType().int().min(0).max(100)
});
/** Admin: player's gift level and individually granted level frames. */
var getPlayerLevel_createServerFn_handler = createServerRpc({
	id: "2118e4ea8e6ae20ad4e70a6b24348be937f09a41339d4cc79da1dc991ae82a22",
	name: "getPlayerLevel",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getPlayerLevel.__executeServer(opts));
var getPlayerLevel = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ userId: stringType().uuid() }).parse(d)).handler(getPlayerLevel_createServerFn_handler, async ({ data, context }) => {
	const admin = await assertAdmin(context);
	const [{ data: pts, error }, { data: prof }] = await Promise.all([admin.rpc("gift_points_of", { p_user: data.userId }), admin.from("profiles").select("owned_items, frame").eq("id", data.userId).single()]);
	if (error) throw new Error(error.message);
	const points = Number(pts) || 0;
	return {
		points,
		level: Math.min(100, Math.floor(points / 1400)),
		owned: (prof?.owned_items ?? []).filter((i) => i.startsWith("cf_")),
		frame: prof?.frame ?? ""
	};
});
var setGiftLevel_createServerFn_handler = createServerRpc({
	id: "13e7d580e80954ce318cd475af8531560d2d4767779576b1a768aecdc8907fd3",
	name: "setGiftLevel",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setGiftLevel.__executeServer(opts));
var setGiftLevel = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => LevelInput.parse(d)).handler(setGiftLevel_createServerFn_handler, async ({ data, context }) => {
	const { data: level, error } = await (await assertAdmin(context)).rpc("admin_set_gift_level", {
		_user_id: data.userId,
		_level: data.level
	});
	if (error) throw new Error(error.message);
	return { level };
});
var grantFrame_createServerFn_handler = createServerRpc({
	id: "7a45cf54b54c404acd83463ae7ab780d1566333d117a7ab0ace72c81f3dcf8fc",
	name: "grantFrame",
	filename: "src/lib/admin.functions.ts"
}, (opts) => grantFrame.__executeServer(opts));
var grantFrame = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	userId: stringType().uuid(),
	frame: stringType().regex(/^cf_\d+$/),
	give: booleanType()
}).parse(d)).handler(grantFrame_createServerFn_handler, async ({ data, context }) => {
	const { data: owned, error } = await (await assertAdmin(context)).rpc("admin_grant_frame", {
		_user_id: data.userId,
		_frame: data.frame,
		_give: data.give
	});
	if (error) throw new Error(error.message);
	return { owned: (owned ?? []).filter((i) => i.startsWith("cf_")) };
});
var getRouletteAdmin_createServerFn_handler = createServerRpc({
	id: "bb2f9541ef946a4d0e310750f53a8fbb64a2a335d8d581e8d417837797bd930f",
	name: "getRouletteAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getRouletteAdmin.__executeServer(opts));
var getRouletteAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getRouletteAdmin_createServerFn_handler, async ({ context }) => {
	const admin = await assertAdmin(context);
	const [configResult, prizesResult, eventsResult] = await Promise.all([
		admin.from("roulette_config").select("*").eq("id", 1).single(),
		admin.from("roulette_prizes").select("id,image,amount,probability_bp").order("id"),
		admin.from("roulette_events").select("id,user_id,action,prize_id,created_at").order("created_at", { ascending: false }).limit(50)
	]);
	for (const result of [
		configResult,
		prizesResult,
		eventsResult
	]) if (result.error) throw new Error(result.error.message);
	const prizes = prizesResult.data;
	const events = eventsResult.data;
	const ids = [...new Set(events.map((e) => e.user_id))];
	const peopleResult = ids.length ? await admin.from("profiles").select("id,name").in("id", ids) : {
		data: [],
		error: null
	};
	if (peopleResult.error) throw new Error(peopleResult.error.message);
	const people = new Map((peopleResult.data ?? []).map((p) => [p.id, p.name]));
	const c = configResult.data;
	return {
		config: {
			enabled: Boolean(c.enabled),
			spinCost: Number(c.spin_cost),
			dailyChances: Number(c.daily_chances),
			bundleChances: Number(c.bundle_chances),
			bundleDat: Number(c.bundle_dat),
			revision: Number(c.revision),
			prizes: prizes.map((p) => ({
				id: p.id,
				percentage: p.probability_bp / 100
			}))
		},
		prizes,
		events: events.map((e) => {
			const p = prizes.find((p) => p.id === e.prize_id);
			return {
				...e,
				name: people.get(e.user_id) ?? "Oyunçu",
				image: p?.image,
				amount: p?.amount
			};
		})
	};
});
var saveRouletteAdmin_createServerFn_handler = createServerRpc({
	id: "23d3d4d7e23a602b5820020cc3bca43a0e16c8f79ddd74d13bc01d1acca5de60",
	name: "saveRouletteAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveRouletteAdmin.__executeServer(opts));
var saveRouletteAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => rouletteConfigSchema.parse(input)).handler(saveRouletteAdmin_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context);
	const { data: revision, error } = await context.supabase.rpc("admin_roulette_save", { p_config: data });
	if (error) throw new Error(error.message);
	return { revision: Number(revision) };
});
//#endregion
export { adjustBalance_createServerFn_handler, checkAdmin_createServerFn_handler, getAdminStats_createServerFn_handler, getPlayerLevel_createServerFn_handler, getRouletteAdmin_createServerFn_handler, grantFrame_createServerFn_handler, listPlayers_createServerFn_handler, listReports_createServerFn_handler, listRoomsAdmin_createServerFn_handler, listStatusReviews_createServerFn_handler, replaceTelegramBotToken_createServerFn_handler, resolveReport_createServerFn_handler, reviewStatus_createServerFn_handler, saveRouletteAdmin_createServerFn_handler, sendBroadcast_createServerFn_handler, sendTelegramNotifications_createServerFn_handler, setBan_createServerFn_handler, setGiftLevel_createServerFn_handler, setKisses_createServerFn_handler, uploadTelegramMedia_createServerFn_handler, viewRoomAdmin_createServerFn_handler };
