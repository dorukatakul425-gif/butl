import { i as __toESM } from "../_runtime.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as getSupabase } from "./supabase-BUCaDQ6-.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as refreshProfile } from "./auth-BrRZs5FB.mjs";
import { n as gameError } from "./game-language-BY9iR37b.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxspnPmW.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tg-uWXDMbxi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var telegramLogin = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ initData: stringType().min(10).max(4096) }).parse(input)).handler(createSsrRpc("044bfe319755fb6b9cded8aab662f28b310c6f3c9eb0b9368e68a4e288768798"));
function TelegramEntry() {
	const navigate = useNavigate();
	const login = useServerFn(telegramLogin);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let alive = true;
		const run = async () => {
			const webApp = window.Telegram?.WebApp;
			const initData = webApp?.initData ?? "";
			if (!initData) {
				setError("Bu səhifə yalnız Telegram botu vasitəsilə açılır. Oyuna daxil olmaq üçün botdakı düyməyə basın.");
				return;
			}
			webApp?.ready?.();
			webApp?.expand?.();
			const sb = getSupabase();
			if (!sb) {
				setError("Xidmətə qoşulmaq mümkün deyil.");
				return;
			}
			try {
				const { tokenHash } = await login({ data: { initData } });
				const { error: otpError } = await sb.auth.verifyOtp({
					token_hash: tokenHash,
					type: "magiclink"
				});
				if (otpError) throw otpError;
				await refreshProfile();
				if (alive) navigate({ to: "/game" });
			} catch (e) {
				if (alive) setError(gameError(e));
			}
		};
		const timer = window.setTimeout(() => void run(), 300);
		return () => {
			alive = false;
			window.clearTimeout(timer);
		};
	}, [navigate, login]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error || "Telegram hesabınızla oyuna qoşulursunuz…" })
	});
}
//#endregion
export { TelegramEntry as component };
