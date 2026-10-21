import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/voice-turn.functions-DsRXyr9c.js
var getVoiceIceServers_createServerFn_handler = createServerRpc({
	id: "d76a24e2bd738cba04d9ae48e3c7478dcb41270e9ca69a576ba3a23ce9f9c825",
	name: "getVoiceIceServers",
	filename: "src/lib/voice-turn.functions.ts"
}, (opts) => getVoiceIceServers.__executeServer(opts));
var getVoiceIceServers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getVoiceIceServers_createServerFn_handler, async ({ context }) => {
	const urls = process.env["TURN_URLS"]?.split(",").map((url) => url.trim()).filter(Boolean);
	const secret = process.env["TURN_SECRET"];
	if (!urls?.length || !secret) return [];
	const { createHmac } = await import("node:crypto");
	const username = `${Math.floor(Date.now() / 1e3) + 3600}:${context.userId}`;
	return [{ urls: ["stun:stun.l.google.com:19302"] }, {
		urls,
		username,
		credential: createHmac("sha1", secret).update(username).digest("base64")
	}];
});
//#endregion
export { getVoiceIceServers_createServerFn_handler };
