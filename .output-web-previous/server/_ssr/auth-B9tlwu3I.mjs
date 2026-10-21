import { i as __toESM } from "../_runtime.mjs";
import { t as getSupabase } from "./supabase-BUCaDQ6-.mjs";
import { d as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/auth-B9tlwu3I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var state = {
	ready: false,
	configured: true,
	session: null,
	profile: null
};
var listeners = /* @__PURE__ */ new Set();
var set = (next) => {
	state = {
		...state,
		...next
	};
	listeners.forEach((l) => l());
};
var started = false;
var authRevision = 0;
var profileRevision = 0;
async function refreshProfile() {
	const authRead = authRevision, read = ++profileRevision;
	const sb = getSupabase();
	const uid = state.session?.user.id;
	if (!sb || !uid) {
		set({ profile: null });
		return null;
	}
	const { data } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
	if (authRead !== authRevision || read !== profileRevision || state.session?.user.id !== uid) return null;
	set({ profile: data ?? null });
	return data;
}
function start() {
	if (started || typeof window === "undefined") return;
	started = true;
	const sb = getSupabase();
	if (!sb) {
		set({
			ready: true,
			configured: false
		});
		return;
	}
	sb.auth.onAuthStateChange((event, session) => {
		if (event === "TOKEN_REFRESHED") {
			state = {
				...state,
				session
			};
			return;
		}
		const revision = ++authRevision;
		profileRevision++;
		if (!session) {
			set({
				session: null,
				profile: null,
				ready: true
			});
			return;
		}
		sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle().then(({ data }) => {
			if (revision === authRevision) set({
				session,
				profile: data ?? null,
				ready: true
			});
		}, () => {
			if (revision === authRevision) set({
				session,
				profile: null,
				ready: true
			});
		});
	});
}
/** Signs out and updates every page immediately, without waiting for the network. */
async function signOut() {
	const { leaveRoom } = await import("./room-session-DdlYu-9b.mjs");
	const leaving = leaveRoom().catch(() => void 0);
	authRevision++;
	profileRevision++;
	set({
		session: null,
		profile: null,
		ready: true
	});
	await Promise.race([leaving, new Promise((resolve) => setTimeout(resolve, 1500))]);
	await getSupabase()?.auth.signOut();
}
var SERVER = {
	ready: false,
	configured: true,
	session: null,
	profile: null
};
function useAuth() {
	start();
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, () => state, () => SERVER);
}
var getAuth = () => state;
//#endregion
export { useAuth as i, refreshProfile as n, signOut as r, getAuth as t };
