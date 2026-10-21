//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/game-language-BY9iR37b.js
/** Game text stays Azerbaijani independently of optional lobby language preferences. */
function azerbaijaniGameDictionary(source) {
	return Object.fromEntries(Object.entries(source).map(([key, value]) => [key, value.replace(/\bFREE\b/g, "PULSUZ").replace(/free airdrop/g, "pulsuz token paylanması").replace(/Subscriptions in Google Play/g, "Google Play abunəlikləri").replace(/Privacy policy/g, "Məxfilik siyasəti").replace(/Terms and conditions/g, "İstifadə şərtləri").replace(/“Spin”/g, "“Fırlat”").replace(/\band\b/g, "və").replace(/kristal(?:lar)?/gi, "DAT")]));
}
var errors = {
	"not signed in": "Hesabına daxil olmalısan.",
	"not_authenticated": "Hesabına daxil olmalısan.",
	"not authenticated": "Hesabına daxil olmalısan.",
	"not seated": "Əvvəlcə masaya qoşul.",
	"not_at_table": "Əvvəlcə masaya qoşul.",
	"not_enough_gold": "Kifayət qədər ürək yoxdur.",
	"insufficient gold": "Kifayət qədər ürək yoxdur.",
	"insufficient_dat": "Kifayət qədər DAT yoxdur.",
	"table_full": "Masada boş yer yoxdur.",
	"Zaten bu masadasın": "Artıq bu masadasan.",
	"Masa bulunamadı": "Masa tapılmadı.",
	"kickout_room_blocked": "Hazırda bu masaya qoşula bilməzsən.",
	"vip_required": "Bu əməliyyat üçün VIP tələb olunur.",
	"vip required": "Bu əməliyyat üçün VIP tələb olunur.",
	"price_changed": "Qiymət dəyişib. Yenidən yoxla.",
	"target_not_at_table": "Oyunçu artıq bu masada deyil.",
	"receiver_not_at_table": "Alıcı artıq bu masada deyil.",
	"unknown_user": "Oyunçu tapılmadı.",
	"unknown_player": "Oyunçu tapılmadı.",
	"forbidden": "Bu əməliyyata icazən yoxdur.",
	"not owned": "Bu əşya sənə məxsus deyil.",
	"level_locked": "Tələb olunan səviyyəyə hələ çatmamısan.",
	"unknown gift": "Hədiyyə tapılmadı.",
	"not for sale": "Bu əşya satışda deyil."
};
function gameError(message) {
	const text = typeof message === "string" ? message : message instanceof Error ? message.message : "";
	if (errors[text]) return errors[text];
	for (const [key, value] of Object.entries(errors)) if (text.toLowerCase().includes(key.toLowerCase())) return value;
	if (/[əƏ]/.test(text) && !/\b(Error|Exception|fetch|JWT|SQL|PGRST)\b/i.test(text)) return text;
	return "Əməliyyat baş tutmadı. Yenidən cəhd et.";
}
//#endregion
export { gameError as n, azerbaijaniGameDictionary as t };
