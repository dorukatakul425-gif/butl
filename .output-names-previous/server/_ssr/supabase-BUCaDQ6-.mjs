import { n as __exportAll$1 } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-BUCaDQ6-.js
var supabase_BUCaDQ6__exports = /* @__PURE__ */ __exportAll$1({
	i: () => usernameEmail,
	n: () => normalizeUsername,
	r: () => supabase_exports,
	t: () => getSupabase
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var supabase_exports = /* @__PURE__ */ __exportAll({
	getSupabase: () => getSupabase,
	normalizeUsername: () => normalizeUsername,
	usernameEmail: () => usernameEmail
});
var client;
function getSupabase() {
	if (typeof window === "undefined") return null;
	if (client !== void 0) return client;
	const url = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_PROJECT_ID": "selfhosted",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_URL": "https://deltagame.az"
	}["VITE_SUPABASE_URL"];
	const key = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_PROJECT_ID": "selfhosted",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_URL": "https://deltagame.az"
	}["VITE_SUPABASE_ANON_KEY"] ?? {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_PROJECT_ID": "selfhosted",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkyMDg1MDUwLCJleHAiOjIxMDc0NDUwNTB9.Ur5wssHhEl9j_hU4B7iX9zDk_iisJHSy7JBOGwtHmUs",
		"VITE_SUPABASE_URL": "https://deltagame.az"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"];
	client = url && key ? createClient(url, key, { auth: {
		persistSession: true,
		autoRefreshToken: true
	} }) : null;
	return client;
}
function normalizeUsername(name) {
	return name.trim().toLowerCase().replace(/[^a-z0-9_.]/g, "");
}
function usernameEmail(name) {
	return `${normalizeUsername(name)}@butl.local`;
}
//#endregion
export { usernameEmail as i, normalizeUsername as n, supabase_BUCaDQ6__exports as r, getSupabase as t };
