import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-translate.functions-DbNMrIxo.js
var Input = objectType({
	text: stringType().trim().min(1).max(500),
	lang: stringType().regex(/^[a-z]{2}$/)
});
/** Server side of session.translateText({type:'translate', text, lang}) → {ttext}. */
var translateChatText_createServerFn_handler = createServerRpc({
	id: "e3720b803d76323a1aa360ad833c944df811f5d110048d30c412991dc775fa2c",
	name: "translateChatText",
	filename: "src/lib/chat-translate.functions.ts"
}, (opts) => translateChatText.__executeServer(opts));
var translateChatText = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(translateChatText_createServerFn_handler, async ({ data }) => {
	const key = process.env["LOVABLE_API_KEY"];
	if (!key) throw new Error("Tərcümə xidməti konfiqurasiya edilməyib.");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
		method: "POST",
		headers: {
			"Lovable-API-Key": key,
			"X-Lovable-AIG-SDK": "fetch",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model: "google/gemini-3-flash-preview",
			store: false,
			instructions: `Translate the user's chat message into the language with ISO code "${data.lang}". Keep emojis, names and tone. Reply with the translation only, no quotes or comments. If it is already in that language, return it unchanged.`,
			input: data.text
		})
	});
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		console.error(`AI gateway [${res.status}]: ${body}`);
		throw new Error(`Çeviri alınamadı (${res.status}).`);
	}
	const json = await res.json();
	const ttext = (json.output_text ?? json.output?.flatMap((o) => o.content ?? []).filter((c) => c.type === "output_text").map((c) => c.text ?? "").join("") ?? "").trim();
	if (!ttext) throw new Error("Tərcümə alınmadı.");
	return { ttext };
});
//#endregion
export { translateChatText_createServerFn_handler };
