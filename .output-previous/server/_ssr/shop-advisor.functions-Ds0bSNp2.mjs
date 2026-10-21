import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-advisor.functions-Ds0bSNp2.js
var PRICES = [
	1,
	2,
	5,
	10,
	20,
	30
];
var AMOUNTS = [
	66,
	145,
	396,
	858,
	1800,
	2800
];
var Input = objectType({
	budget: numberType().min(0).max(1e4),
	wish: stringType().trim().min(1).max(400)
});
var recommendShopPack_createServerFn_handler = createServerRpc({
	id: "b11fe824a6d80c4351f22a26de808f17730262fd8cc7769822f049bb3a05b751",
	name: "recommendShopPack",
	filename: "src/lib/shop-advisor.functions.ts"
}, (opts) => recommendShopPack.__executeServer(opts));
var recommendShopPack = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(recommendShopPack_createServerFn_handler, async ({ data }) => {
	const key = process.env["LOVABLE_API_KEY"];
	if (!key) throw new Error("AI açarı konfiqurasiya edilməyib.");
	const catalog = PRICES.map((p, i) => `tier ${i}: ${p} AZN = ${AMOUNTS[i]}`).join("; ");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
		method: "POST",
		headers: {
			"Lovable-API-Key": key,
			"X-Lovable-AIG-SDK": "fetch",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model: "openai/gpt-6-astra",
			stream: true,
			store: false,
			reasoning: { effort: "low" },
			instructions: `Sən oyun mağazasının köməkçisisən. İki məhsul var: "dat" (DAT coin, oyun valyutası) və "heart" (Ürək, hədiyyə/sevgi üçün). Paketlər (hər ikisi üçün eyni): ${catalog}. Müştərinin büdcəsini aşmayan, istəyinə ən uyğun paketi seç (büdcəyə sığan ən böyük paketə üstünlük ver). Büdcə 1 AZN-dən azdırsa tier 0 seç və bunu izah et. reason sahəsini Azərbaycan dilində, 1-2 qısa cümlə ilə yaz.`,
			input: `Büdcə: ${data.budget} AZN. İstək: ${data.wish}`,
			text: { format: {
				type: "json_schema",
				name: "advice",
				strict: true,
				schema: {
					type: "object",
					additionalProperties: false,
					required: [
						"tab",
						"tier",
						"reason"
					],
					properties: {
						tab: {
							type: "string",
							enum: ["dat", "heart"]
						},
						tier: {
							type: "integer",
							minimum: 0,
							maximum: 5
						},
						reason: { type: "string" }
					}
				}
			} }
		})
	});
	if (!res.ok || !res.body) {
		const body = await res.text().catch(() => "");
		console.error(`AI gateway [${res.status}]: ${body}`);
		if (res.status === 429) throw new Error("Çox sorğu var, bir az sonra yenidən cəhd edin.");
		if (res.status === 402) throw new Error("AI kreditləri bitib.");
		throw new Error(`AI xətası (${res.status}).`);
	}
	const reader = res.body.getReader();
	const dec = new TextDecoder();
	let buf = "", text = "";
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		buf += dec.decode(value, { stream: true });
		let i;
		while ((i = buf.indexOf("\n")) >= 0) {
			const line = buf.slice(0, i).trim();
			buf = buf.slice(i + 1);
			if (!line.startsWith("data:")) continue;
			const payload = line.slice(5).trim();
			if (payload === "[DONE]") continue;
			try {
				const ev = JSON.parse(payload);
				if (ev.type === "response.output_text.delta") text += ev.delta;
				if (ev.type === "error" || ev.type === "response.failed") throw new Error("AI cavab verə bilmədi.");
			} catch (e) {
				if (e instanceof Error && e.message.startsWith("AI")) throw e;
			}
		}
	}
	const parsed = JSON.parse(text);
	let tier = Math.max(0, Math.min(5, Math.round(parsed.tier)));
	while (tier > 0 && (PRICES[tier] ?? 0) > data.budget) tier--;
	return {
		tab: parsed.tab === "heart" ? "heart" : "dat",
		tier,
		reason: parsed.reason
	};
});
//#endregion
export { recommendShopPack_createServerFn_handler };
