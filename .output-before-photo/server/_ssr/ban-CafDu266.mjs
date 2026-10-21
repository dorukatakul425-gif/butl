import { i as __toESM } from "../_runtime.mjs";
import { t as getSupabase } from "./supabase-BUCaDQ6-.mjs";
import { h as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/ban-CafDu266.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var ban = null;
var listeners = /* @__PURE__ */ new Set();
var set = (b) => {
	ban = b;
	listeners.forEach((l) => l());
};
function useBan() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, () => ban, () => null);
}
var clearBan = () => set(null);
/** Ciliz rule: remaining ban time rounds to minutes under 1 h, hours under 1 day, else days. */
function formatBanRemaining(ms) {
	const minutes = Math.ceil(ms / 6e4);
	if (minutes < 60) return {
		value: minutes,
		unit: "dəqiqə"
	};
	const hours = Math.ceil(ms / 36e5);
	if (hours < 24) return {
		value: hours,
		unit: "saat"
	};
	return {
		value: Math.ceil(ms / 864e5),
		unit: "gün"
	};
}
/** Checks the signed-in player; signs them out when banned. */
async function checkOwnBan() {
	const sb = getSupabase();
	if (!sb) return null;
	const { data } = await sb.rpc("my_ban");
	const row = Array.isArray(data) ? data[0] : data;
	if (row) {
		set(row);
		await sb.auth.signOut().catch(() => void 0);
		return row;
	}
	return null;
}
/** Called after a sign-in error; shows the ban screen if that username is banned. */
async function checkBanForUsername(username) {
	const sb = getSupabase();
	if (!sb) return null;
	const { data } = await sb.rpc("ban_info", { _username: username });
	const row = Array.isArray(data) ? data[0] : data;
	if (row) {
		set({
			...row,
			username
		});
		return row;
	}
	return null;
}
var isBanError = (message) => !!message && /banned|user_banned/i.test(message);
//#endregion
export { isBanError as a, formatBanRemaining as i, checkOwnBan as n, useBan as o, clearBan as r, checkBanForUsername as t };
