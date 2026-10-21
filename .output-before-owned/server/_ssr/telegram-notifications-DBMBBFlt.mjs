import { a as objectType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/telegram-notifications-DBMBBFlt.js
var telegramNoticeSchema = objectType({
	text: stringType().trim().max(4096),
	bold: booleanType(),
	silent: booleanType(),
	kind: enumType([
		"text",
		"photo",
		"video"
	]),
	media: stringType().max(2e3).default(""),
	after: stringType().uuid().nullable()
}).superRefine((v, ctx) => {
	if (v.kind === "text" && !v.text) ctx.addIssue({
		code: "custom",
		message: "Mətn daxil edin."
	});
	if (v.kind !== "text") {
		if (v.text.length > 1024) ctx.addIssue({
			code: "custom",
			message: "Şəkil/video mətni 1024 simvoldan çox ola bilməz."
		});
		if (!v.media) ctx.addIssue({
			code: "custom",
			message: "Şəkil və ya video seçin."
		});
		if (v.media.startsWith("http") && !v.media.startsWith("https://")) ctx.addIssue({
			code: "custom",
			message: "HTTPS keçidi tələb olunur."
		});
	}
});
function telegramHtml(text, bold) {
	const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return bold && escaped ? `<b>${escaped}</b>` : escaped;
}
function telegramPayload(input, chatId) {
	const text = telegramHtml(input.text, input.bold);
	const common = {
		chat_id: chatId,
		parse_mode: "HTML",
		disable_notification: input.silent
	};
	return input.kind === "text" ? {
		method: "sendMessage",
		body: {
			...common,
			text
		}
	} : {
		method: input.kind === "photo" ? "sendPhoto" : "sendVideo",
		body: {
			...common,
			[input.kind]: input.media,
			caption: text
		}
	};
}
//#endregion
export { telegramPayload as n, telegramNoticeSchema as t };
