import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { n as validateInitData, t as telegramEmail } from "./telegram-auth-B2rYG9a6.mjs";
import { n as telegramPublicPhotoUrl } from "./telegram-profile-sync-BJrwAwav.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/telegram-auth.functions-WMh3UEk4.js
var telegramLogin_createServerFn_handler = createServerRpc({
	id: "044bfe319755fb6b9cded8aab662f28b310c6f3c9eb0b9368e68a4e288768798",
	name: "telegramLogin",
	filename: "src/lib/telegram-auth.functions.ts"
}, (opts) => telegramLogin.__executeServer(opts));
var telegramLogin = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ initData: stringType().min(10).max(4096) }).parse(input)).handler(telegramLogin_createServerFn_handler, async ({ data }) => {
	const { getTelegramBotToken } = await import("./telegram-config.server-BA-mWf8y.mjs");
	const botToken = await getTelegramBotToken();
	const { createHmac } = await import("node:crypto");
	const hmac = (key, msg) => createHmac("sha256", key).update(msg).digest();
	const parsed = validateInitData(data.initData, botToken, hmac, Math.floor(Date.now() / 1e3));
	if (!parsed) throw new Error("Telegram sessiyası təsdiqlənmədi.");
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const admin = supabaseAdmin;
	const tg = parsed.user;
	const email = telegramEmail(tg.id);
	const { fetchTelegramProfile } = await import("./telegram-profile-sync.server-BCCSEaiM.mjs");
	const current = await fetchTelegramProfile(botToken, tg);
	const { data: existing } = await admin.from("profiles").select("id, photo_url, username").eq("telegram_id", tg.id).maybeSingle();
	let userId = existing?.id ?? null;
	if (!userId) {
		const { name } = current;
		const { data: taken } = await admin.from("profiles").select("id").eq("username", current.username).maybeSingle();
		const username = taken ? `tg${tg.id}` : current.username;
		const password = hmac(botToken, `tg-login:${tg.id}`).toString("hex");
		const { data: created, error: createError } = await admin.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: {
				username,
				name
			}
		});
		if (createError || !created?.user?.id) throw new Error("Hesab yaradılmadı.");
		userId = created.user.id;
		await admin.from("profiles").update({
			telegram_id: tg.id,
			tutorial_done: false,
			profile_setup_done: false,
			name,
			username
		}).eq("id", userId);
	}
	if (!userId) throw new Error("Telegram hesabı tapılmadı.");
	const patch = { name: current.name };
	const { data: usernameOwner, error: usernameError } = await admin.from("profiles").select("id").eq("username", current.username).maybeSingle();
	if (usernameError) throw new Error("Telegram profil adı yenilənmədi.");
	if (!usernameOwner || usernameOwner.id === userId) patch.username = current.username;
	if (current.bio !== void 0) patch.bio = current.bio;
	const ownPhoto = Boolean(existing?.photo_url) && !String(existing?.photo_url).includes("/telegram-");
	if (current.photo === null && !ownPhoto) patch.photo_url = null;
	if (!ownPhoto && current.photo && current.photo.byteLength > 0) {
		const path = `${userId}/telegram-${Date.now()}-${crypto.randomUUID()}.jpg`;
		if ((await admin.storage.from("avatars").upload(path, current.photo, { contentType: "image/jpeg" })).error) throw new Error("Telegram profil şəkli yenilənmədi.");
		const signed = await admin.storage.from("avatars").createSignedUrl(path, 31536e3);
		if (!signed.data?.signedUrl) throw new Error("Telegram profil şəkli açılmadı.");
		patch.photo_url = telegramPublicPhotoUrl(signed.data.signedUrl, "https://deltagame.az");
	}
	const { error: syncError } = await admin.from("profiles").update(patch).eq("id", userId);
	if (syncError) throw new Error("Telegram profil məlumatları yenilənmədi.");
	const { data: link, error: linkError } = await admin.auth.admin.generateLink({
		type: "magiclink",
		email
	});
	if (linkError || !link?.properties?.hashed_token) throw new Error("Hesaba giriş mümkün olmadı.");
	return { tokenHash: link.properties.hashed_token };
});
//#endregion
export { telegramLogin_createServerFn_handler };
