//#region node_modules/.nitro/vite/services/ssr/assets/telegram-config-Ca6pT6N3.js
async function encryptBotToken(token, key) {
	const material = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
	const aes = await crypto.subtle.importKey("raw", material, "AES-GCM", false, ["encrypt"]);
	const iv = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12));
	const bytes = new Uint8Array(await crypto.subtle.encrypt({
		name: "AES-GCM",
		iv
	}, aes, new TextEncoder().encode(token)));
	const encode = (value) => btoa(String.fromCharCode(...value));
	return {
		ciphertext: encode(bytes),
		iv: encode(iv)
	};
}
async function decryptBotToken(value, key) {
	const decode = (text) => Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
	const material = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
	const aes = await crypto.subtle.importKey("raw", material, "AES-GCM", false, ["decrypt"]);
	const bytes = await crypto.subtle.decrypt({
		name: "AES-GCM",
		iv: decode(value.iv)
	}, aes, decode(value.ciphertext));
	return new TextDecoder().decode(bytes);
}
async function loadBotToken({ url, key, fallback }) {
	if (!url || !key) {
		if (fallback) return fallback;
		throw new Error("Telegram botu konfiqurasiya edilməyib.");
	}
	let response;
	try {
		response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/telegram_bot_settings?id=eq.1&select=ciphertext,iv`, {
			headers: {
				apikey: key,
				...key.startsWith("sb_") ? {} : { Authorization: `Bearer ${key}` }
			},
			signal: AbortSignal.timeout(5e3),
			cache: "no-store"
		});
	} catch {
		throw new Error("Telegram bot ayarları oxunmadı.");
	}
	if (response.status === 404 && fallback) return fallback;
	if (!response.ok) throw new Error("Telegram bot ayarları oxunmadı.");
	const rows = await response.json();
	if (rows[0]) try {
		return await decryptBotToken(rows[0], key);
	} catch {
		throw new Error("Telegram bot ayarları açıla bilmədi.");
	}
	if (fallback) return fallback;
	throw new Error("Telegram botu konfiqurasiya edilməyib.");
}
//#endregion
export { encryptBotToken, loadBotToken };
