import { loadBotToken } from "./telegram-config-Ca6pT6N3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/telegram-config.server-BA-mWf8y.js
function getTelegramBotToken() {
	return loadBotToken({
		url: process.env["SUPABASE_URL"],
		key: process.env["SUPABASE_SERVICE_ROLE_KEY"],
		fallback: process.env["TELEGRAM_BOT_TOKEN"]
	});
}
//#endregion
export { getTelegramBotToken };
