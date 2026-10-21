//#region node_modules/.nitro/vite/services/ssr/assets/telegram-auth-B2rYG9a6.js
/** Validates Telegram WebApp initData against the bot token. Returns null when invalid. */
function validateInitData(initData, botToken, hmac, nowSeconds, maxAgeSeconds = 86400) {
	if (!initData || !botToken) return null;
	const params = new URLSearchParams(initData);
	const hash = params.get("hash");
	if (!hash) return null;
	params.delete("hash");
	const dataCheckString = Array.from(params.entries()).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${k}=${v}`).join("\n");
	const expected = hmac(hmac("WebAppData", botToken), dataCheckString).toString("hex");
	if (expected.length !== hash.length) return null;
	let diff = 0;
	for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ hash.charCodeAt(i);
	if (diff !== 0) return null;
	const authDate = Number(params.get("auth_date") ?? "0");
	if (!Number.isFinite(authDate) || authDate <= 0) return null;
	if (nowSeconds - authDate > maxAgeSeconds) return null;
	const userRaw = params.get("user");
	if (!userRaw) return null;
	try {
		const user = JSON.parse(userRaw);
		if (!user || typeof user.id !== "number" || !user.first_name) return null;
		return {
			user,
			authDate
		};
	} catch {
		return null;
	}
}
function telegramEmail(telegramId) {
	return `tg_${telegramId}@butl.local`;
}
//#endregion
export { validateInitData as n, telegramEmail as t };
