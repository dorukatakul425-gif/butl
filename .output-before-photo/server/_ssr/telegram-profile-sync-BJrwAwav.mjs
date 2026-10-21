import { t as cleanDisplayName } from "./display-name-CESIa9sk.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/telegram-profile-sync-BJrwAwav.js
/** Only call with a verified Telegram identity and server-fetched chat information. */
function telegramIdentity(user, chat) {
	const current = chat?.first_name ? chat : user;
	const username = (current.username ?? "").toLowerCase().replace(/[^a-z0-9_.]/g, "") || `tg${user.id}`;
	return {
		name: cleanDisplayName(current.first_name ?? "").slice(0, 40) || "Telegram",
		username
	};
}
/** Internal storage host is unreachable from players' phones. Keep the signed path/query intact. */
function telegramPublicPhotoUrl(signedUrl, publicBase) {
	const signed = new URL(signedUrl);
	const base = new URL(publicBase);
	if (base.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(base.hostname)) throw new Error("Invalid public storage host");
	return `${base.origin}${signed.pathname}${signed.search}`;
}
//#endregion
export { telegramPublicPhotoUrl as n, telegramIdentity as t };
