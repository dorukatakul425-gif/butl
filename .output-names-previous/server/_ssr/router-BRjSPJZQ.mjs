import { i as __toESM } from "../_runtime.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useAuth, r as signOut } from "./auth-09P8qAxJ.mjs";
import { t as PreferencesProvider } from "./app-preferences-zyvxFMgU.mjs";
import { i as formatBanRemaining, n as checkOwnBan, o as useBan, r as clearBan } from "./ban-CafDu266.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BRjSPJZQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ban_male_default = "/assets/ban-male-CoiQv9fc.svg";
var ban_female_default = "/assets/ban-female-BmJOuW5Q.svg";
/** Wraps the app: checks the player's ban on sign-in, every 20 s and on focus. */
function BanGuard({ children }) {
	const auth = useAuth();
	const ban = useBan();
	const uid = auth.session?.user.id;
	(0, import_react.useEffect)(() => {
		if (!uid) return;
		checkOwnBan();
		const t = setInterval(() => void checkOwnBan(), 2e4);
		const f = () => void checkOwnBan();
		window.addEventListener("focus", f);
		return () => {
			clearInterval(t);
			window.removeEventListener("focus", f);
		};
	}, [uid]);
	if (ban) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BanScreen, { ban });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function useCountdown(until) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		if (!until) return;
		const t = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, [until]);
	if (!until) return null;
	return Math.max(0, new Date(until).getTime() - now);
}
/**
* Ban screen — pixel-faithful copy of the Ciliz original: darkened backdrop
* (65 %), white card, gendered illustration, remaining time in red, green
* outlined "Çıxış" button. Tapping outside does not close it.
*/
function BanScreen({ ban }) {
	const ms = useCountdown(ban.banned_until);
	(0, import_react.useEffect)(() => {
		if (ms === 0) clearBan();
	}, [ms]);
	const left = ms !== null && ms > 0 ? formatBanRemaining(ms) : null;
	const illustration = ban.male === false ? ban_female_default : ban_male_default;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ban-screen fixed inset-0 z-[9999] flex items-center justify-center p-5",
		style: { background: "rgba(0,0,0,.65)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: banStyles }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ban-card w-full max-w-[340px] rounded-2xl bg-white px-6 pb-7 pt-8 text-center shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[22px] font-bold leading-tight text-[#9a9a9a]",
					children: "Hesabınız bloklanıb"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: illustration,
					alt: "",
					width: 110,
					height: 110,
					className: "mx-auto my-6 block",
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[15px] leading-snug text-[#3c3c3c]",
					children: left ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Blokun bitməsinə:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-[#e23b2e]",
							children: [
								left.value,
								" ",
								left.unit
							]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-[#e23b2e]",
						children: "Daimi blok"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[15px] leading-snug text-[#3c3c3c]",
					children: ["Səbəb: ", ban.reason?.trim() || "Oyun qaydalarının pozulması"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ban-exit mx-auto mt-6 block rounded-xl border-2 border-[#97ca31] bg-white px-10 py-2.5 text-[16px] font-medium text-[#97ca31] transition-colors hover:bg-[#97ca31] hover:text-white",
					onClick: () => {
						clearBan();
						signOut();
					},
					children: "Çıxış"
				})
			]
		})]
	});
}
var banStyles = `
.ban-card{animation:banIn .45s cubic-bezier(.2,.9,.3,1.15) both}
.ban-exit:active{transform:scale(.96)}
@keyframes banIn{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}
`;
var styles_default = "/assets/styles-CECsS9ut.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var INSPECTOR_NOTICE = "Mənim s*m bildiyini sənin başın bilmir ;)\n\nboş yerə kod axtarma ogurlamaq uvun";
var displayed = false;
function showInspectorNotice() {
	if (displayed) return;
	try {
		console.info(INSPECTOR_NOTICE);
		displayed = true;
	} catch {}
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
			},
			{ title: "DeltaGame.az" },
			{
				name: "description",
				content: "Şüşəni fırlat, yeni insanlarla tanış ol və canlı oyun masasında əylənin — DeltaGame.az-a indi qoşul!"
			},
			{
				name: "author",
				content: "DeltaGame.az"
			},
			{
				property: "og:title",
				content: "DeltaGame.az"
			},
			{
				property: "og:description",
				content: "Şüşəni fırlat, yeni insanlarla tanış ol və canlı oyun masasında əylənin — DeltaGame.az-a indi qoşul!"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#c98b4f"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "DeltaGame"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "application-name",
				content: "DeltaGame"
			}
		],
		scripts: [{ src: "https://telegram.org/js/telegram-web-app.js" }],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "az",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	(0, import_react.useEffect)(() => {
		showInspectorNotice();
	}, []);
	(0, import_react.useEffect)(() => {
		const editable = (t) => t instanceof HTMLElement && !!t.closest("input, textarea, [contenteditable='true']");
		const block = (e) => {
			if (!editable(e.target)) e.preventDefault();
		};
		const pinch = (e) => {
			if (e.touches.length > 1) e.preventDefault();
		};
		let lastTap = 0;
		const dblTap = (e) => {
			const now = Date.now();
			if (now - lastTap < 300 && !editable(e.target)) e.preventDefault();
			lastTap = now;
		};
		const wheel = (e) => {
			if (e.ctrlKey) e.preventDefault();
		};
		const keys = (e) => {
			if ((e.ctrlKey || e.metaKey) && [
				"+",
				"-",
				"=",
				"0"
			].includes(e.key)) e.preventDefault();
		};
		const opts = { passive: false };
		const ev = [
			["copy", block],
			["cut", block],
			["contextmenu", block],
			["selectstart", block],
			["dragstart", block],
			["gesturestart", block],
			["gesturechange", block],
			["touchmove", pinch],
			["touchend", dblTap],
			["wheel", wheel],
			["keydown", keys]
		];
		ev.forEach(([n, f]) => document.addEventListener(n, f, opts));
		return () => ev.forEach(([n, f]) => document.removeEventListener(n, f));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BanGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
	});
}
var $$splitComponentImporter$4 = () => import("./routes-lTap-ZLk.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "DeltaGame.az" },
		{
			name: "description",
			content: "Şüşəni fırlat, yeni insanlarla tanış ol və canlı oyun masasında əylənin — DeltaGame.az-a indi qoşul!"
		},
		{
			property: "og:title",
			content: "DeltaGame.az"
		},
		{
			property: "og:description",
			content: "Şüşəni fırlat, yeni insanlarla tanış ol və canlı oyun masasında əylənin — DeltaGame.az-a indi qoşul!"
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			property: "og:image",
			content: "https://deltagame.az/og-image.jpg"
		},
		{
			name: "twitter:image",
			content: "https://deltagame.az/og-image.jpg"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./auth-Bi6WpSK_.mjs");
var bottle = "https://deltagame.az/deltagame-icon-512.png";
var Route$3 = createFileRoute("/auth")({
	head: () => ({
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.ico"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "512x512",
				href: "/deltagame-icon-512.png"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			}
		],
		meta: [
			{ title: "Deltagame.az — Şüşə oyunu" },
			{
				name: "description",
				content: "Deltagame.az-da şüşəni fırlat, yeni insanlarla tanış ol və əyləncənin dadını çıxar."
			},
			{
				property: "og:title",
				content: "Deltagame.az — Şüşə oyunu"
			},
			{
				property: "og:description",
				content: "Deltagame.az — hər fırlanış yeni tanışlıq, hər oyun unudulmaz bir an. Şüşəni fırlat və əyləncəyə qoşul!"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:image",
				content: bottle
			},
			{
				property: "og:image:alt",
				content: "Deltagame.az şişə ikonu"
			},
			{
				name: "twitter:image",
				content: bottle
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		]
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./game-Sgv98i7D.mjs");
var Route$2 = createFileRoute("/game")({
	head: () => ({ meta: [
		{ title: "Deltagame — Oyun masası" },
		{
			name: "description",
			content: "Deltagame oyun masasında şüşəni fırlat, söhbət et və yeni insanlarla tanış ol."
		},
		{
			property: "og:title",
			content: "Deltagame — Oyun masası"
		},
		{
			property: "og:description",
			content: "Şüşəni fırlat və Deltagame oyun masasında söhbətə qoşul."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./sako-g5ibJiAx.mjs");
var Route$1 = createFileRoute("/sako")({
	head: () => ({ meta: [
		{ title: "Deltagame.az — İdarə paneli" },
		{
			name: "description",
			content: "Oyunun idarə paneli."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			property: "og:title",
			content: "Deltagame.az — İdarə paneli"
		},
		{
			property: "og:description",
			content: "Oyunun idarə paneli."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./tg-3OOf-mMi.mjs");
var Route = createFileRoute("/tg")({
	head: () => ({ meta: [
		{ title: "Deltagame.az — Telegram Girişi" },
		{
			name: "description",
			content: "Telegram vasitəsilə oyuna avtomatik giriş."
		},
		{
			property: "og:title",
			content: "Deltagame.az — Telegram"
		},
		{
			property: "og:description",
			content: "Telegram vasitəsilə oyuna avtomatik giriş."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	AuthRoute: Route$3.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$5
	}),
	GameRoute: Route$2.update({
		id: "/game",
		path: "/game",
		getParentRoute: () => Route$5
	}),
	SakoRoute: Route$1.update({
		id: "/sako",
		path: "/sako",
		getParentRoute: () => Route$5
	}),
	TgRoute: Route.update({
		id: "/tg",
		path: "/tg",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
