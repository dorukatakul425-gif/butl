import { t as telegramIdentity } from "./telegram-profile-sync-BJrwAwav.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/telegram-profile-sync.server-BCCSEaiM.js
/** undefined means unavailable: never erase saved information after a failed API call. */
async function fetchTelegramProfile(botToken, user) {
	const api = `https://api.telegram.org/bot${botToken}`;
	async function call(method, body) {
		try {
			const response = await fetch(`${api}/${method}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(8e3)
			});
			if (!response.ok) return void 0;
			const value = await response.json();
			return value.ok ? value.result : void 0;
		} catch {
			return;
		}
	}
	const [chat, photos] = await Promise.all([call("getChat", { chat_id: user.id }), call("getUserProfilePhotos", {
		user_id: user.id,
		limit: 1
	})]);
	const privateChat = chat?.id === user.id && chat?.type === "private" ? chat : void 0;
	const identity = telegramIdentity(user, privateChat);
	const bio = privateChat ? typeof privateChat.bio === "string" ? privateChat.bio : "" : void 0;
	let photo;
	if (photos?.total_count === 0) photo = null;
	const fileId = privateChat?.photo?.big_file_id ?? photos?.photos?.[0]?.at(-1)?.file_id;
	if (fileId) {
		const file = await call("getFile", { file_id: fileId });
		if (file?.file_path) try {
			const response = await fetch(`https://api.telegram.org/file/bot${botToken}/${file.file_path}`, { signal: AbortSignal.timeout(8e3) });
			if (response.ok) {
				const bytes = new Uint8Array(await response.arrayBuffer());
				if (bytes.byteLength > 0) photo = bytes;
			}
		} catch {}
	}
	if (photo === void 0 && user.photo_url) try {
		const url = new URL(user.photo_url);
		if (url.protocol === "https:" && url.hostname === "t.me" && url.pathname.startsWith("/i/userpic/")) {
			const response = await fetch(url, {
				signal: AbortSignal.timeout(8e3),
				redirect: "error"
			});
			if (response.ok && response.headers.get("content-type")?.startsWith("image/")) {
				const bytes = new Uint8Array(await response.arrayBuffer());
				if (bytes.byteLength > 0 && bytes.byteLength <= 10485760) photo = bytes;
			}
		}
	} catch {}
	return {
		...identity,
		bio,
		photo
	};
}
//#endregion
export { fetchTelegramProfile };
