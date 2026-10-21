import { l as createServerFn } from "./createServerFn-Ae892gC8.mjs";
import { t as createServerRpc } from "./createServerRpc-DMGTJSOa.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { n as buildStarsPayload, t as TG_STARS_PACKAGES } from "./stars-bank-DyTcXrMA.mjs";
import { n as validateInitData } from "./telegram-auth-B2rYG9a6.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/stars-payment.functions-NGUsegrk.js
var createStarsInvoice_createServerFn_handler = createServerRpc({
	id: "830bdcd890f1a4a529acf0dee21eb54d41570e4ae75a258531dc9fb58197c233",
	name: "createStarsInvoice",
	filename: "src/lib/stars-payment.functions.ts"
}, (opts) => createStarsInvoice.__executeServer(opts));
var createStarsInvoice = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	initData: stringType().min(10).max(4096),
	stars: numberType().int().positive()
}).parse(input)).handler(createStarsInvoice_createServerFn_handler, async ({ data }) => {
	const pk = TG_STARS_PACKAGES.find((p) => p.stars === data.stars);
	if (!pk) throw new Error("Paket tapılmadı.");
	const { getTelegramBotToken } = await import("./telegram-config.server-BA-mWf8y.mjs");
	const botToken = await getTelegramBotToken();
	const { createHmac } = await import("node:crypto");
	const hmac = (key, msg) => createHmac("sha256", key).update(msg).digest();
	const parsed = validateInitData(data.initData, botToken, hmac, Math.floor(Date.now() / 1e3));
	if (!parsed) throw new Error("Telegram sessiyası təsdiqlənmədi.");
	const totalGold = pk.gold + pk.bonus;
	const title = `❤️ ${totalGold}`;
	const json = await (await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			title,
			description: `Deltagame.az — ${totalGold} ürək paketi`,
			payload: buildStarsPayload(totalGold, pk.stars, parsed.user.id),
			currency: "XTR",
			prices: [{
				label: title,
				amount: pk.stars
			}]
		})
	})).json();
	if (!json.ok || !json.result) throw new Error(json.description || "Ödəniş sorğusu yaradılmadı.");
	return {
		link: json.result,
		totalGold
	};
});
//#endregion
export { createStarsInvoice_createServerFn_handler };
