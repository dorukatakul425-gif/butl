globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { a as toEventHandler, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"d147-5EEij5ktuz/QvPNOoO8kYMrVL+A\"",
		"mtime": "2026-10-21T07:17:49.905Z",
		"size": 53575,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon.ICO": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"45d3-NIJs1alig4WqwZelDj32a6MLR2g\"",
		"mtime": "2026-10-21T07:17:49.901Z",
		"size": 17875,
		"path": "../public/favicon.ICO"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"45d3-NIJs1alig4WqwZelDj32a6MLR2g\"",
		"mtime": "2026-10-21T07:17:49.901Z",
		"size": 17875,
		"path": "../public/favicon.png"
	},
	"/icon-192.png": {
		"type": "image/png",
		"etag": "\"e44e-k/LlNiAyKAS/ljUvSzX7crbPN1Q\"",
		"mtime": "2026-10-21T07:17:49.901Z",
		"size": 58446,
		"path": "../public/icon-192.png"
	},
	"/icon-512.png": {
		"type": "image/png",
		"etag": "\"384ea-3O+0HzRgfA+EuV9lGeYtotfGq+s\"",
		"mtime": "2026-10-21T07:17:49.917Z",
		"size": 230634,
		"path": "../public/icon-512.png"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"2d5-8KiuXP8wPDUb7bgiUbPOKPGiyN4\"",
		"mtime": "2026-10-21T07:17:49.901Z",
		"size": 725,
		"path": "../public/manifest.webmanifest"
	},
	"/og-image.jpg": {
		"type": "image/jpeg",
		"etag": "\"a871-YfnbvONTKRglvn4qpRIWj38DiCE\"",
		"mtime": "2026-10-21T07:17:49.901Z",
		"size": 43121,
		"path": "../public/og-image.jpg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-10-21T07:17:49.913Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/social-sw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30d-lJVW76Tn2rMSeiuWpX6l8jQ/r/g\"",
		"mtime": "2026-10-21T07:17:49.909Z",
		"size": 781,
		"path": "../public/social-sw.js"
	},
	"/assets/QueryClientProvider-DPrb1eIA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"611e-XLAaHSl6s9/j6GcjGSWB53IDmAU\"",
		"mtime": "2026-10-21T07:17:36.865Z",
		"size": 24862,
		"path": "../public/assets/QueryClientProvider-DPrb1eIA.js"
	},
	"/assets/app-controls-DJdRMEvE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117f-iNiYRF7FMm/zQyyQqUWnwqwfJ2A\"",
		"mtime": "2026-10-21T07:17:36.865Z",
		"size": 4479,
		"path": "../public/assets/app-controls-DJdRMEvE.js"
	},
	"/assets/app-preferences-BPX9y193.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6dc1-0VUlxjorCqqwO2Ta10N5XwD5ejg\"",
		"mtime": "2026-10-21T07:17:36.865Z",
		"size": 28097,
		"path": "../public/assets/app-preferences-BPX9y193.js"
	},
	"/assets/auth-Dyw22y_y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d6e-KpARanqhIJKxidcqEapOH2OP8Wc\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 19822,
		"path": "../public/assets/auth-Dyw22y_y.js"
	},
	"/assets/auth-logo-C3zqRrgr.png": {
		"type": "image/png",
		"etag": "\"12ea9-NoWoSXw6kHJQBGh9rmyQ7BZDSh8\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 77481,
		"path": "../public/assets/auth-logo-C3zqRrgr.png"
	},
	"/assets/auth-middleware-DYOopiMU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-e5xzR/aZ6awJkmm919Llufhv84Y\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 230,
		"path": "../public/assets/auth-middleware-DYOopiMU.js"
	},
	"/assets/auth-rKnT5ET3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd6-2++m/TeozpieKSDuR4LL1OmPGEo\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 3030,
		"path": "../public/assets/auth-rKnT5ET3.js"
	},
	"/assets/ban-female-BmJOuW5Q.svg": {
		"type": "image/svg+xml",
		"etag": "\"5681-gHJ/6TXNuxaCZHZ7dWgsljVhE4w\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 22145,
		"path": "../public/assets/ban-female-BmJOuW5Q.svg"
	},
	"/assets/ban-hYKTBtNK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35a-m9Sqb02GV7PtUMRZToWqdJzv7zc\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 858,
		"path": "../public/assets/ban-hYKTBtNK.js"
	},
	"/assets/ban-male-CoiQv9fc.svg": {
		"type": "image/svg+xml",
		"etag": "\"5cf8-rCBdXHg7hi7f5oMygwrcqkTnTFg\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 23800,
		"path": "../public/assets/ban-male-CoiQv9fc.svg"
	},
	"/assets/button-Ca8fgZo-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7cf0-m611ap/HYeYo3HLAWAGCB6HZJTk\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 31984,
		"path": "../public/assets/button-Ca8fgZo-.js"
	},
	"/assets/check-CCNqrC1g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-za+g0Apj+yzWeYK+kKbueqKdpas\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 124,
		"path": "../public/assets/check-CCNqrC1g.js"
	},
	"/assets/ciliz-assets-C9c9KCzC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2247e-stAUZFhmy8THTSwn2sLu3wdzq/I\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 140414,
		"path": "../public/assets/ciliz-assets-C9c9KCzC.js"
	},
	"/assets/ciliz-default-photo-_x5aGr5C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26aa-XJ9T2OsTDnnikpVq/PvWPK8vAUc\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 9898,
		"path": "../public/assets/ciliz-default-photo-_x5aGr5C.js"
	},
	"/assets/createClientRpc-C75gP369.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"837f-0VoE+dG71EQF2UPOsngQ4h8PrvM\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 33663,
		"path": "../public/assets/createClientRpc-C75gP369.js"
	},
	"/assets/createLucideIcon-cPwvoQem.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a0-p4j4oMg8OI8NWiq6sASxP2tvJ4M\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 1184,
		"path": "../public/assets/createLucideIcon-cPwvoQem.js"
	},
	"/assets/createMiddleware-DQnh37QV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133-Ss+1epwF86Bpxmm6XX4K0Tx3pBg\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 307,
		"path": "../public/assets/createMiddleware-DQnh37QV.js"
	},
	"/assets/createServerFn-4lRHqwv8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1152-qdG5QBQKz2/YvKeBZ9YG/TaAsio\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 4434,
		"path": "../public/assets/createServerFn-4lRHqwv8.js"
	},
	"/assets/dat-coin-DArS5vpr.png": {
		"type": "image/png",
		"etag": "\"6134-s1ETt7CMfFkvaiqNaVkuhQkiV30\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 24884,
		"path": "../public/assets/dat-coin-DArS5vpr.png"
	},
	"/assets/entry-fx-lifetime-JTBQ6ZC3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3e-g9deYMgisMk5AJPvoucfdZXWKUA\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 3134,
		"path": "../public/assets/entry-fx-lifetime-JTBQ6ZC3.js"
	},
	"/assets/game-CPIjvdXr.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3715-N7UwsH5tWqr5zEmszYRXM5ymICQ\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 14101,
		"path": "../public/assets/game-CPIjvdXr.css"
	},
	"/assets/game-language-ueRSInuS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"784-Pdsrg459PBsZapU1vuGSni/9L0c\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 1924,
		"path": "../public/assets/game-language-ueRSInuS.js"
	},
	"/assets/index-CELpCPZ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"43d2c-shY8AoJaRkEzGCREn/60JTLXvwo\"",
		"mtime": "2026-10-21T07:17:36.865Z",
		"size": 277804,
		"path": "../public/assets/index-CELpCPZ2.js"
	},
	"/assets/input-Bn9aSf2E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28a-yWf8/Lbm4f06//LzLVZltLD1Fdk\"",
		"mtime": "2026-10-21T07:17:36.873Z",
		"size": 650,
		"path": "../public/assets/input-Bn9aSf2E.js"
	},
	"/assets/jsx-runtime-0vZSBttN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-DT21o0DVEenQwk6wXcylq/J4hZA\"",
		"mtime": "2026-10-21T07:17:36.873Z",
		"size": 424,
		"path": "../public/assets/jsx-runtime-0vZSBttN.js"
	},
	"/assets/kick-shield-BpEp79bL.svg": {
		"type": "image/svg+xml",
		"etag": "\"1e28-aZNzeAO8VoxiFbG7nqndgNh4358\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 7720,
		"path": "../public/assets/kick-shield-BpEp79bL.svg"
	},
	"/assets/nav-games-mvrdqGbv.webp": {
		"type": "image/webp",
		"etag": "\"11a8-tGKr/U4XmqQmxL+/cKCtpb8rusY\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 4520,
		"path": "../public/assets/nav-games-mvrdqGbv.webp"
	},
	"/assets/original-table-autumn-center-DI5aK6I-.png": {
		"type": "image/png",
		"etag": "\"19d54-EWaD5QxVo1t5Ej0r/nE4mD/rm2g\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 105812,
		"path": "../public/assets/original-table-autumn-center-DI5aK6I-.png"
	},
	"/assets/player-photo-CLYOllCJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95ff-bAzG/kkwrK4X/zq74UyTjK/x4u8\"",
		"mtime": "2026-10-21T07:17:36.877Z",
		"size": 38399,
		"path": "../public/assets/player-photo-CLYOllCJ.js"
	},
	"/assets/react-SIfiwpqq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ff9-FGVdof4/lFGmrdRsB9EIvuwBlYc\"",
		"mtime": "2026-10-21T07:17:36.877Z",
		"size": 8185,
		"path": "../public/assets/react-SIfiwpqq.js"
	},
	"/assets/react-dom-prtvU8oi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dcf-x8OaYBRKAj9tuXpRNDxQloqePP8\"",
		"mtime": "2026-10-21T07:17:36.877Z",
		"size": 3535,
		"path": "../public/assets/react-dom-prtvU8oi.js"
	},
	"/assets/room-bg-night-BN6AF0vt.jpg": {
		"type": "image/jpeg",
		"etag": "\"3b82b-phTWylxE6EcMAA6SK+lY9UilIt4\"",
		"mtime": "2026-10-21T07:17:36.893Z",
		"size": 243755,
		"path": "../public/assets/room-bg-night-BN6AF0vt.jpg"
	},
	"/assets/room-session-Cu9zh_MD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f84-dA8wSIz9MT9uApPvVC+XhYO84k4\"",
		"mtime": "2026-10-21T07:17:36.877Z",
		"size": 40836,
		"path": "../public/assets/room-session-Cu9zh_MD.js"
	},
	"/assets/room-work-budget-B-5zU2ZO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5df-MkzwR0iLcfAqMS/nZUaC51+slC8\"",
		"mtime": "2026-10-21T07:17:36.877Z",
		"size": 1503,
		"path": "../public/assets/room-work-budget-B-5zU2ZO.js"
	},
	"/assets/roulette-config-Dq3MWbUS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df43-ljHig74UzIAHxM9VU7KmsiwphHs\"",
		"mtime": "2026-10-21T07:17:36.877Z",
		"size": 57155,
		"path": "../public/assets/roulette-config-Dq3MWbUS.js"
	},
	"/assets/roulette-league5-06LtDHau.svg": {
		"type": "image/svg+xml",
		"etag": "\"1a6f-sJgbGJBksPtaT7KGiwTQT5EuUE8\"",
		"mtime": "2026-10-21T07:17:36.893Z",
		"size": 6767,
		"path": "../public/assets/roulette-league5-06LtDHau.svg"
	},
	"/assets/roulette-league_kiss2x-B3KY-O_K.svg": {
		"type": "image/svg+xml",
		"etag": "\"2554-qXo3t4IzLccN5zQJQD3+5NRF6Lc\"",
		"mtime": "2026-10-21T07:17:36.893Z",
		"size": 9556,
		"path": "../public/assets/roulette-league_kiss2x-B3KY-O_K.svg"
	},
	"/assets/roulette-refuse_slap-qiOioJTs.svg": {
		"type": "image/svg+xml",
		"etag": "\"730e-++2UePIWX/XvgkeexHMDq3+XkSQ\"",
		"mtime": "2026-10-21T07:17:36.893Z",
		"size": 29454,
		"path": "../public/assets/roulette-refuse_slap-qiOioJTs.svg"
	},
	"/assets/game-t1tlyPNx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9192-DjGEOUI/IVL0HXXt/4UiM5ADmR0\"",
		"mtime": "2026-10-21T07:17:36.869Z",
		"size": 692626,
		"path": "../public/assets/game-t1tlyPNx.js"
	},
	"/assets/pixi-table-DIxfRJnh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11498e-zfUuiBpQVPrfgSeg4enIzNZtEPM\"",
		"mtime": "2026-10-21T07:17:36.873Z",
		"size": 1132942,
		"path": "../public/assets/pixi-table-DIxfRJnh.js"
	},
	"/assets/original-wood-table-CDD2962Q.png": {
		"type": "image/png",
		"etag": "\"1b58e6-FUbHZvp4vyEsI9kCkYEYScIxQrY\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 1792230,
		"path": "../public/assets/original-wood-table-CDD2962Q.png"
	},
	"/assets/sako-D45UA830.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"30056-5MacbH3FnAny6CkjVFF6dw9UiGw\"",
		"mtime": "2026-10-21T07:17:36.897Z",
		"size": 196694,
		"path": "../public/assets/sako-D45UA830.css"
	},
	"/assets/sako-DCJEaIHR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ea0f-JnD64F99bQs4y7wvobo6kf9WvI4\"",
		"mtime": "2026-10-21T07:17:36.881Z",
		"size": 59919,
		"path": "../public/assets/sako-DCJEaIHR.js"
	},
	"/assets/season-pass-BdgqsqSt.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"132-zXdtxXHth80Iydid7j5ysSFwXE8\"",
		"mtime": "2026-10-21T07:17:36.897Z",
		"size": 306,
		"path": "../public/assets/season-pass-BdgqsqSt.css"
	},
	"/assets/season-pass-N3p6b9J9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1396-v7R+jsq9rkuuA54c3EihDO7IOVY\"",
		"mtime": "2026-10-21T07:17:36.881Z",
		"size": 5014,
		"path": "../public/assets/season-pass-N3p6b9J9.js"
	},
	"/assets/season-pass-dialog-CUe0sZ-p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5481-taHubb1N2oSXYp9/WgrwpzPdxtE\"",
		"mtime": "2026-10-21T07:17:36.881Z",
		"size": 21633,
		"path": "../public/assets/season-pass-dialog-CUe0sZ-p.js"
	},
	"/assets/send-BtXNlHAc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-HOUIuz97YPSqwKfoAqlWOShgXFY\"",
		"mtime": "2026-10-21T07:17:36.881Z",
		"size": 290,
		"path": "../public/assets/send-BtXNlHAc.js"
	},
	"/assets/source-dialogs-Cro0YRiX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb9-jSGwTxpFHkekwb3s5skzwj381HQ\"",
		"mtime": "2026-10-21T07:17:36.881Z",
		"size": 3769,
		"path": "../public/assets/source-dialogs-Cro0YRiX.js"
	},
	"/assets/source-ignore-photo-DH9lpopo.svg": {
		"type": "image/svg+xml",
		"etag": "\"50ed-VXsABazQZqdAJyYNMV89sRaXSoQ\"",
		"mtime": "2026-10-21T07:17:36.901Z",
		"size": 20717,
		"path": "../public/assets/source-ignore-photo-DH9lpopo.svg"
	},
	"/assets/supabase-Dbz9wWdx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34f3c-DO50WFXFkhfBLE2FszqGNU7Ji1U\"",
		"mtime": "2026-10-21T07:17:36.881Z",
		"size": 216892,
		"path": "../public/assets/supabase-Dbz9wWdx.js"
	},
	"/assets/table-bg-TaqzNcLQ.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"d39-8Il4tMbZtkAoNv+f7S5WN13AyDk\"",
		"mtime": "2026-10-21T07:17:36.917Z",
		"size": 3385,
		"path": "../public/assets/table-bg-TaqzNcLQ.css"
	},
	"/assets/tg-C6zDZiQ_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56d-EkLq419UYOtGw4U6iSf+4kb1WJA\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 1389,
		"path": "../public/assets/tg-C6zDZiQ_.js"
	},
	"/assets/ui_btn_bg_down-ypCwPjVm.svg": {
		"type": "image/svg+xml",
		"etag": "\"1735-x7Ph2Rnbv5u9UFAa03mjUQfDCmc\"",
		"mtime": "2026-10-21T07:17:36.917Z",
		"size": 5941,
		"path": "../public/assets/ui_btn_bg_down-ypCwPjVm.svg"
	},
	"/assets/ui_btn_bg_up-Dz3OrZ68.svg": {
		"type": "image/svg+xml",
		"etag": "\"1b15-v5GTZ7Iinx0sCWhzVehjbi73BF4\"",
		"mtime": "2026-10-21T07:17:36.917Z",
		"size": 6933,
		"path": "../public/assets/ui_btn_bg_up-Dz3OrZ68.svg"
	},
	"/assets/ui_btn_change_table-CX22mAZv.svg": {
		"type": "image/svg+xml",
		"etag": "\"4c18-Zy4JY+R5hlast+kKl3gwm9xMCYQ\"",
		"mtime": "2026-10-21T07:17:36.917Z",
		"size": 19480,
		"path": "../public/assets/ui_btn_change_table-CX22mAZv.svg"
	},
	"/assets/ui_btn_league-C8EMHxRz.svg": {
		"type": "image/svg+xml",
		"etag": "\"4c6b-1Af0zjTvsGS11/U9YRAOQDhALzE\"",
		"mtime": "2026-10-21T07:17:36.917Z",
		"size": 19563,
		"path": "../public/assets/ui_btn_league-C8EMHxRz.svg"
	},
	"/assets/ui_btn_settings-DN9wpdr4.svg": {
		"type": "image/svg+xml",
		"etag": "\"524c-89AJLEl4SJKquAdKNxDHZkgE4EI\"",
		"mtime": "2026-10-21T07:17:36.917Z",
		"size": 21068,
		"path": "../public/assets/ui_btn_settings-DN9wpdr4.svg"
	},
	"/assets/ui_loading_pattern-BomelKAF.svg": {
		"type": "image/svg+xml",
		"etag": "\"8c28-Cp6/pP3EFJ+W4FDIXs+0E7xj6aQ\"",
		"mtime": "2026-10-21T07:17:36.917Z",
		"size": 35880,
		"path": "../public/assets/ui_loading_pattern-BomelKAF.svg"
	},
	"/assets/useNavigate-C_Xk6FgP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d9-g7RPBS0Y87jM0ZzL6NK8s7/9F/4\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 217,
		"path": "../public/assets/useNavigate-C_Xk6FgP.js"
	},
	"/assets/useRouter-DmdJGr8B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c0-t/Wu8Q/5lVxqhqEfuvpy2fUGKKk\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 192,
		"path": "../public/assets/useRouter-DmdJGr8B.js"
	},
	"/assets/routes-BbsZgFI8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8359f-20KtFLffwAtbCVxkfx4lRJOLcYM\"",
		"mtime": "2026-10-21T07:17:36.877Z",
		"size": 538015,
		"path": "../public/assets/routes-BbsZgFI8.js"
	},
	"/assets/useSelector-CSfRCabc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1407-Q6i57UXkNNxy5z4lT7pNDn3kmOk\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 5127,
		"path": "../public/assets/useSelector-CSfRCabc.js"
	},
	"/assets/season-pass-dialog-TEe9091h.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"e3563-DwLtPhp8+Yud7wIv9J/4BaMMVfM\"",
		"mtime": "2026-10-21T07:17:36.897Z",
		"size": 931171,
		"path": "../public/assets/season-pass-dialog-TEe9091h.css"
	},
	"/assets/useServerFn-Bh7kkU_C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"194-IESQstndTRRnyosOD1ffbu9vQrQ\"",
		"mtime": "2026-10-21T07:17:36.885Z",
		"size": 404,
		"path": "../public/assets/useServerFn-Bh7kkU_C.js"
	},
	"/assets/v_balloon2_1-S3dGSJgI.svg": {
		"type": "image/svg+xml",
		"etag": "\"1630-bgQIX9yP36ROMOR6Vuixx9b2YP4\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 5680,
		"path": "../public/assets/v_balloon2_1-S3dGSJgI.svg"
	},
	"/assets/v_balloon2_2-Cgqsnw8x.svg": {
		"type": "image/svg+xml",
		"etag": "\"15a0-Fa62LmpXImFVwvM7Vlss8gbT8iM\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 5536,
		"path": "../public/assets/v_balloon2_2-Cgqsnw8x.svg"
	},
	"/assets/v_balloon2_3-BF-dvpyX.svg": {
		"type": "image/svg+xml",
		"etag": "\"17ca-FOzZw+/I91MxBQVS+A/vRLvqMUs\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 6090,
		"path": "../public/assets/v_balloon2_3-BF-dvpyX.svg"
	},
	"/assets/v_balloon2_4-DWYEVDhn.svg": {
		"type": "image/svg+xml",
		"etag": "\"145e-ustGceZ6XxRKFI5VTHeaiepoBGU\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 5214,
		"path": "../public/assets/v_balloon2_4-DWYEVDhn.svg"
	},
	"/assets/v_flower1-CLQskNib.svg": {
		"type": "image/svg+xml",
		"etag": "\"23f7-Ltr6IYRDSYQUwTo5y5+iGgT84UA\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 9207,
		"path": "../public/assets/v_flower1-CLQskNib.svg"
	},
	"/assets/v_flower2-Bdqz2elt.svg": {
		"type": "image/svg+xml",
		"etag": "\"3198-HbkpAYN8qGxyIi41q36MrZrDiC8\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 12696,
		"path": "../public/assets/v_flower2-Bdqz2elt.svg"
	},
	"/assets/v_flower3-CigsD_1x.svg": {
		"type": "image/svg+xml",
		"etag": "\"2ee6-IwaSCoRKGJ+PnUDgqZVq7q2eq4M\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 12006,
		"path": "../public/assets/v_flower3-CigsD_1x.svg"
	},
	"/assets/v_flower4-jPT7BE-O.svg": {
		"type": "image/svg+xml",
		"etag": "\"2473-7fKDRadMWYRo7Yz+6eGxbYDRBQo\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 9331,
		"path": "../public/assets/v_flower4-jPT7BE-O.svg"
	},
	"/assets/v_ghost1-B0Q1dQ_X.svg": {
		"type": "image/svg+xml",
		"etag": "\"1ee5-Xhr6FudhHaen4X3YXAf2/0GAjFw\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 7909,
		"path": "../public/assets/v_ghost1-B0Q1dQ_X.svg"
	},
	"/assets/v_ghost2-Cw8ELXoB.svg": {
		"type": "image/svg+xml",
		"etag": "\"2223-5K55UExhYPRjqpvIiT3Vkp2Gjxk\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 8739,
		"path": "../public/assets/v_ghost2-Cw8ELXoB.svg"
	},
	"/assets/v_ghost3-BL5qG0dU.svg": {
		"type": "image/svg+xml",
		"etag": "\"2532-SMxLqUURL0z1u21wPRTh/VrRYT0\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 9522,
		"path": "../public/assets/v_ghost3-BL5qG0dU.svg"
	},
	"/assets/v_ghost4-DAnCisgP.svg": {
		"type": "image/svg+xml",
		"etag": "\"1afe-jry2Y3v+ETrlWnuIY72FWWsi0Y0\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 6910,
		"path": "../public/assets/v_ghost4-DAnCisgP.svg"
	},
	"/assets/v_heart2_1-DQUm2Zpm.svg": {
		"type": "image/svg+xml",
		"etag": "\"10f8-WgiFaTfiCTDCn1nqYXWyCTK8mTE\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 4344,
		"path": "../public/assets/v_heart2_1-DQUm2Zpm.svg"
	},
	"/assets/v_heart2_2-CE11__lq.svg": {
		"type": "image/svg+xml",
		"etag": "\"1148-7PrTukssvtL7YvEpw5ngJ33MyNk\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 4424,
		"path": "../public/assets/v_heart2_2-CE11__lq.svg"
	},
	"/assets/v_heart2_3-Bx_qIqCc.svg": {
		"type": "image/svg+xml",
		"etag": "\"111b-XQPSaCZEjodfSJ7Nlfxe4fy4ihQ\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 4379,
		"path": "../public/assets/v_heart2_3-Bx_qIqCc.svg"
	},
	"/assets/v_pacifier1-BFNfY267.svg": {
		"type": "image/svg+xml",
		"etag": "\"1369-ifvIBur/8rikHslRdZh9jI0fUoQ\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 4969,
		"path": "../public/assets/v_pacifier1-BFNfY267.svg"
	},
	"/assets/v_pacifier2-DiKLlHJe.svg": {
		"type": "image/svg+xml",
		"etag": "\"13f1-L8Y7u+MyosQCJR62TODyuLs85iA\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 5105,
		"path": "../public/assets/v_pacifier2-DiKLlHJe.svg"
	},
	"/assets/v_pacifier3-BGvzxkCw.svg": {
		"type": "image/svg+xml",
		"etag": "\"1402-FKkPafn5/gXGoGMMikHE9PWATqo\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 5122,
		"path": "../public/assets/v_pacifier3-BGvzxkCw.svg"
	},
	"/assets/v_photo1-vm-K23Kx.svg": {
		"type": "image/svg+xml",
		"etag": "\"3240-x/ksdpGGQFEJVmSCbjy/aHWuRz8\"",
		"mtime": "2026-10-21T07:17:36.921Z",
		"size": 12864,
		"path": "../public/assets/v_photo1-vm-K23Kx.svg"
	},
	"/assets/v_photo2-Cxi7dZuH.svg": {
		"type": "image/svg+xml",
		"etag": "\"319b-d+T6Z/N7ZVK1lL7ubOPYHtZlU5g\"",
		"mtime": "2026-10-21T07:17:36.925Z",
		"size": 12699,
		"path": "../public/assets/v_photo2-Cxi7dZuH.svg"
	},
	"/assets/v_photo3-XSWzAqaW.svg": {
		"type": "image/svg+xml",
		"etag": "\"315c-e6pbEpfGn1r+dxI79FmJYpEeir0\"",
		"mtime": "2026-10-21T07:17:36.925Z",
		"size": 12636,
		"path": "../public/assets/v_photo3-XSWzAqaW.svg"
	},
	"/assets/v_roll1-DhI6zFuJ.svg": {
		"type": "image/svg+xml",
		"etag": "\"289c-ONCOF68VEuIAJoPu/Er8qP49FkY\"",
		"mtime": "2026-10-21T07:17:36.925Z",
		"size": 10396,
		"path": "../public/assets/v_roll1-DhI6zFuJ.svg"
	},
	"/assets/v_roll2-CHOAXakR.svg": {
		"type": "image/svg+xml",
		"etag": "\"2bcf-3abKPE8znD240llNWev4Ig/qZEU\"",
		"mtime": "2026-10-21T07:17:36.925Z",
		"size": 11215,
		"path": "../public/assets/v_roll2-CHOAXakR.svg"
	},
	"/assets/v_roll3-pviAcFGg.svg": {
		"type": "image/svg+xml",
		"etag": "\"1130-q7z/neNW1ikJ+bkn58w9Hplmnlc\"",
		"mtime": "2026-10-21T07:17:36.925Z",
		"size": 4400,
		"path": "../public/assets/v_roll3-pviAcFGg.svg"
	},
	"/assets/styles-CECsS9ut.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3d6c79-FpLRBIf05z9Wai9HTb7ZMVAs/M0\"",
		"mtime": "2026-10-21T07:17:36.901Z",
		"size": 4025465,
		"path": "../public/assets/styles-CECsS9ut.css"
	},
	"/custom-frames/1112_1_all.anim.png": {
		"type": "image/png",
		"etag": "\"5d079-fFJMP1luVnutDs0a1eVfxS3SMVs\"",
		"mtime": "2026-10-21T07:17:49.421Z",
		"size": 381049,
		"path": "../public/custom-frames/1112_1_all.anim.png"
	},
	"/custom-frames/1112_1_all.thin.png": {
		"type": "image/png",
		"etag": "\"23c98-cnVCuqbjq9rTfOdMtBJT1RKMvP0\"",
		"mtime": "2026-10-21T07:17:49.453Z",
		"size": 146584,
		"path": "../public/custom-frames/1112_1_all.thin.png"
	},
	"/custom-frames/1121_1_all.thin.png": {
		"type": "image/png",
		"etag": "\"4c6fc-ysOi/KQSlSz5gMFiJlERn0/D3cY\"",
		"mtime": "2026-10-21T07:17:49.469Z",
		"size": 313084,
		"path": "../public/custom-frames/1121_1_all.thin.png"
	},
	"/custom-frames/1133_1_all.anim.png": {
		"type": "image/png",
		"etag": "\"699b1-juHL0c1m/7j09V9/GAAbHIZy5uY\"",
		"mtime": "2026-10-21T07:17:49.481Z",
		"size": 432561,
		"path": "../public/custom-frames/1133_1_all.anim.png"
	},
	"/custom-frames/1133_1_all.thin.png": {
		"type": "image/png",
		"etag": "\"25235-kJ/OF1sVnAi0Z//SrGPvemEMx98\"",
		"mtime": "2026-10-21T07:17:49.489Z",
		"size": 152117,
		"path": "../public/custom-frames/1133_1_all.thin.png"
	},
	"/custom-frames/1135_1_all.thin.png": {
		"type": "image/png",
		"etag": "\"542dc-as6qViz3gqyHy72P0BT8JPQr4hw\"",
		"mtime": "2026-10-21T07:17:49.509Z",
		"size": 344796,
		"path": "../public/custom-frames/1135_1_all.thin.png"
	},
	"/custom-frames/186_1_all.anim.png": {
		"type": "image/png",
		"etag": "\"69a7b-kKgvvZc5olb2pIiuCwLv8ezId00\"",
		"mtime": "2026-10-21T07:17:49.585Z",
		"size": 432763,
		"path": "../public/custom-frames/186_1_all.anim.png"
	},
	"/custom-frames/186_1_all.thin.png": {
		"type": "image/png",
		"etag": "\"37143-20vkz8x/OJ96BIzRrqkTSfn3ABQ\"",
		"mtime": "2026-10-21T07:17:49.605Z",
		"size": 225603,
		"path": "../public/custom-frames/186_1_all.thin.png"
	},
	"/custom-frames/263_1_all.anim.png": {
		"type": "image/png",
		"etag": "\"76879-VZlXy07N12d4stNKXqKuyAScgtc\"",
		"mtime": "2026-10-21T07:17:49.633Z",
		"size": 485497,
		"path": "../public/custom-frames/263_1_all.anim.png"
	},
	"/custom-frames/263_1_all.thin.png": {
		"type": "image/png",
		"etag": "\"4b298-MmBCHI4HQwp12BMZmUFArQB7q9U\"",
		"mtime": "2026-10-21T07:17:49.633Z",
		"size": 307864,
		"path": "../public/custom-frames/263_1_all.thin.png"
	},
	"/custom-frames/42_3_female.thin.png": {
		"type": "image/png",
		"etag": "\"63f6f-5vbAAokAdKpFqWbzNG8ZtdOrxng\"",
		"mtime": "2026-10-21T07:17:49.705Z",
		"size": 409455,
		"path": "../public/custom-frames/42_3_female.thin.png"
	},
	"/custom-frames/59_1_female.anim.png": {
		"type": "image/png",
		"etag": "\"6def2-Xdqw0jn14juiMsPvDLWGnPQol60\"",
		"mtime": "2026-10-21T07:17:49.717Z",
		"size": 450290,
		"path": "../public/custom-frames/59_1_female.anim.png"
	},
	"/custom-frames/59_1_female.thin.png": {
		"type": "image/png",
		"etag": "\"36c58-yU74dmEGk8miMgoznJjmOadps4U\"",
		"mtime": "2026-10-21T07:17:49.745Z",
		"size": 224344,
		"path": "../public/custom-frames/59_1_female.thin.png"
	},
	"/custom-frames/1121_1_all.anim.png": {
		"type": "image/png",
		"etag": "\"a61dc-6DqxAV0F9OrBp18A8PRO1bM2s/Y\"",
		"mtime": "2026-10-21T07:17:49.481Z",
		"size": 680412,
		"path": "../public/custom-frames/1121_1_all.anim.png"
	},
	"/custom-frames/63_1_male.thin.png": {
		"type": "image/png",
		"etag": "\"56410-/ZFwaU0zNPIq2EqF+fdKzMHLLa0\"",
		"mtime": "2026-10-21T07:17:49.757Z",
		"size": 353296,
		"path": "../public/custom-frames/63_1_male.thin.png"
	},
	"/custom-frames/1135_1_all.anim.png": {
		"type": "image/png",
		"etag": "\"b4622-BJoiobg0BcvmGM8p7kJOr2mV6Gg\"",
		"mtime": "2026-10-21T07:17:49.521Z",
		"size": 738850,
		"path": "../public/custom-frames/1135_1_all.anim.png"
	},
	"/custom-frames/131_1_female.sheet.png": {
		"type": "image/png",
		"etag": "\"89a13-uqoXAHSsxwa/xczDFCme5Fep250\"",
		"mtime": "2026-10-21T07:17:49.529Z",
		"size": 563731,
		"path": "../public/custom-frames/131_1_female.sheet.png"
	},
	"/custom-frames/169_1_female.thin.png": {
		"type": "image/png",
		"etag": "\"c9dab-Ko9DUZdKJqGOntH6QSfRvJ4FO6U\"",
		"mtime": "2026-10-21T07:17:49.573Z",
		"size": 826795,
		"path": "../public/custom-frames/169_1_female.thin.png"
	},
	"/custom-frames/402_1_male.thin.png": {
		"type": "image/png",
		"etag": "\"803b0-eGhha8vUlspUFpJxttuhvGc6vV4\"",
		"mtime": "2026-10-21T07:17:49.669Z",
		"size": 525232,
		"path": "../public/custom-frames/402_1_male.thin.png"
	},
	"/custom-frames/42_3_female.anim.png": {
		"type": "image/png",
		"etag": "\"c2295-com+WXvdWosvGFeS8Hmoi3HY+Io\"",
		"mtime": "2026-10-21T07:17:49.697Z",
		"size": 795285,
		"path": "../public/custom-frames/42_3_female.anim.png"
	},
	"/custom-frames/63_1_male.anim.png": {
		"type": "image/png",
		"etag": "\"899c3-CZAIolVdKepPgHaW+v8VEwF/I+s\"",
		"mtime": "2026-10-21T07:17:49.749Z",
		"size": 563651,
		"path": "../public/custom-frames/63_1_male.anim.png"
	},
	"/custom-frames/169_1_female.anim.png": {
		"type": "image/png",
		"etag": "\"1267e9-QIxkt9nNrettpWW876pNY6bWoiY\"",
		"mtime": "2026-10-21T07:17:49.609Z",
		"size": 1206249,
		"path": "../public/custom-frames/169_1_female.anim.png"
	},
	"/custom-frames/402_1_male.anim.png": {
		"type": "image/png",
		"etag": "\"10c08a-KMx5cqcBUeea/sp3pG/QC8OJpBo\"",
		"mtime": "2026-10-21T07:17:49.685Z",
		"size": 1097866,
		"path": "../public/custom-frames/402_1_male.anim.png"
	},
	"/custom-frames/64_1_male.thin.png": {
		"type": "image/png",
		"etag": "\"5df1c-CKpej7VCQSX0wiK5YXbBtjSHWs0\"",
		"mtime": "2026-10-21T07:17:49.777Z",
		"size": 384796,
		"path": "../public/custom-frames/64_1_male.thin.png"
	},
	"/custom-frames/64_1_male.anim.png": {
		"type": "image/png",
		"etag": "\"8e2b7-BtM5Ay9kvrnNiPBOH+Y162k8AOU\"",
		"mtime": "2026-10-21T07:17:49.845Z",
		"size": 582327,
		"path": "../public/custom-frames/64_1_male.anim.png"
	},
	"/custom-frames/781_1_all.thin.png": {
		"type": "image/png",
		"etag": "\"49a74-cRxwcmni70pkhdCibK/x8plrQDQ\"",
		"mtime": "2026-10-21T07:17:49.845Z",
		"size": 301684,
		"path": "../public/custom-frames/781_1_all.thin.png"
	},
	"/custom-frames/92_1_female.anim.png": {
		"type": "image/png",
		"etag": "\"4925b-r8+oQb5ARaf/jFukFpmGrALhZ2s\"",
		"mtime": "2026-10-21T07:17:49.853Z",
		"size": 299611,
		"path": "../public/custom-frames/92_1_female.anim.png"
	},
	"/custom-frames/92_1_female.thin.png": {
		"type": "image/png",
		"etag": "\"362e8-fT60M+R0wiSxfv17XXMNZzpj9qY\"",
		"mtime": "2026-10-21T07:17:49.885Z",
		"size": 221928,
		"path": "../public/custom-frames/92_1_female.thin.png"
	},
	"/custom-frames/95_1_male.thin.png": {
		"type": "image/png",
		"etag": "\"66a40-dSsqUyorbjkGsgxIgxhkaOt7YTw\"",
		"mtime": "2026-10-21T07:17:49.865Z",
		"size": 420416,
		"path": "../public/custom-frames/95_1_male.thin.png"
	},
	"/custom-frames/781_1_all.anim.png": {
		"type": "image/png",
		"etag": "\"9eb22-ZBCRPEOOIBUkEEcbYN5bzE1sTDc\"",
		"mtime": "2026-10-21T07:17:49.825Z",
		"size": 650018,
		"path": "../public/custom-frames/781_1_all.anim.png"
	},
	"/images/original-menu-achievements.svg": {
		"type": "image/svg+xml",
		"etag": "\"6d7-ONR+IEPlKL0GP0VUtHt8Dxkuikg\"",
		"mtime": "2026-10-21T07:17:49.413Z",
		"size": 1751,
		"path": "../public/images/original-menu-achievements.svg"
	},
	"/images/original-menu-boosters.svg": {
		"type": "image/svg+xml",
		"etag": "\"250-DRCrn117LMDFvR1yJ2DldfnAe0A\"",
		"mtime": "2026-10-21T07:17:49.865Z",
		"size": 592,
		"path": "../public/images/original-menu-boosters.svg"
	},
	"/images/original-menu-bottle.svg": {
		"type": "image/svg+xml",
		"etag": "\"27d-bVQqfM86JFzqLSIDRbJwmdq9M9Y\"",
		"mtime": "2026-10-21T07:17:49.869Z",
		"size": 637,
		"path": "../public/images/original-menu-bottle.svg"
	},
	"/images/original-menu-decor.svg": {
		"type": "image/svg+xml",
		"etag": "\"983-Pojidv2tpJfjMElQaa3Q7vTFGS8\"",
		"mtime": "2026-10-21T07:17:49.869Z",
		"size": 2435,
		"path": "../public/images/original-menu-decor.svg"
	},
	"/images/original-menu-tops.svg": {
		"type": "image/svg+xml",
		"etag": "\"2ff-kQZD/Poojxm0LRXo1QKUUFWyoxA\"",
		"mtime": "2026-10-21T07:17:49.873Z",
		"size": 767,
		"path": "../public/images/original-menu-tops.svg"
	},
	"/room-assets/live-gifts/10724.mp4": {
		"type": "video/mp4",
		"etag": "\"75809-/QjYSZCNb6lRXhkCXIp7/tqseKg\"",
		"mtime": "2026-10-21T07:17:49.997Z",
		"size": 481289,
		"path": "../public/room-assets/live-gifts/10724.mp4"
	},
	"/custom-frames/95_1_male.anim.png": {
		"type": "image/png",
		"etag": "\"83871-vrhG0SKpo+rkMqEuVBPPArS7BN8\"",
		"mtime": "2026-10-21T07:17:49.885Z",
		"size": 538737,
		"path": "../public/custom-frames/95_1_male.anim.png"
	},
	"/room-assets/live-gifts/11175.mp4": {
		"type": "video/mp4",
		"etag": "\"6b828-qEWsIxV8w7scx45RsYvys4O+r4w\"",
		"mtime": "2026-10-21T07:17:50.017Z",
		"size": 440360,
		"path": "../public/room-assets/live-gifts/11175.mp4"
	},
	"/room-assets/live-gifts/11385.mp4": {
		"type": "video/mp4",
		"etag": "\"79391-LBzs8HG9TgRHAiCJvxBbm3j20N4\"",
		"mtime": "2026-10-21T07:17:50.017Z",
		"size": 496529,
		"path": "../public/room-assets/live-gifts/11385.mp4"
	},
	"/room-assets/live-gifts/11579.mp4": {
		"type": "video/mp4",
		"etag": "\"4cc27-jszylHlkZN28yw+aOjQhABWvW/k\"",
		"mtime": "2026-10-21T07:17:50.057Z",
		"size": 314407,
		"path": "../public/room-assets/live-gifts/11579.mp4"
	},
	"/room-assets/live-gifts/10495.mp4": {
		"type": "video/mp4",
		"etag": "\"bcfc5-5iFuFSBjMii5u5wVPi865vWWJz4\"",
		"mtime": "2026-10-21T07:17:50.033Z",
		"size": 774085,
		"path": "../public/room-assets/live-gifts/10495.mp4"
	},
	"/room-assets/live-gifts/113874.mp4": {
		"type": "video/mp4",
		"etag": "\"ec6f5-l/ZPx8bI7WaoMLfNPNVzjYKL+H0\"",
		"mtime": "2026-10-21T07:17:50.073Z",
		"size": 968437,
		"path": "../public/room-assets/live-gifts/113874.mp4"
	},
	"/room-assets/live-gifts/12230.mp4": {
		"type": "video/mp4",
		"etag": "\"787ff-/i4ehZaJcEyLgaM3C1COo0x0GJw\"",
		"mtime": "2026-10-21T07:17:50.093Z",
		"size": 493567,
		"path": "../public/room-assets/live-gifts/12230.mp4"
	},
	"/room-assets/live-gifts/114102.mp4": {
		"type": "video/mp4",
		"etag": "\"fe37e-HkMY/EeO+1rE+TnW+r370TYCB5w\"",
		"mtime": "2026-10-21T07:17:50.053Z",
		"size": 1041278,
		"path": "../public/room-assets/live-gifts/114102.mp4"
	},
	"/room-assets/live-gifts/13850.mp4": {
		"type": "video/mp4",
		"etag": "\"698e9-JZuiroYnua6yhnPWomqlAOHCG/Q\"",
		"mtime": "2026-10-21T07:17:50.141Z",
		"size": 432361,
		"path": "../public/room-assets/live-gifts/13850.mp4"
	},
	"/room-assets/live-gifts/119075.mp4": {
		"type": "video/mp4",
		"etag": "\"bb053-ZJa5/q6120JGQoOB/+SYXStq1M4\"",
		"mtime": "2026-10-21T07:17:50.101Z",
		"size": 766035,
		"path": "../public/room-assets/live-gifts/119075.mp4"
	},
	"/room-assets/live-gifts/13972.mp4": {
		"type": "video/mp4",
		"etag": "\"60c68-VxCs/ftkrrUBVt/dFSnTi5f+Gy0\"",
		"mtime": "2026-10-21T07:17:50.089Z",
		"size": 396392,
		"path": "../public/room-assets/live-gifts/13972.mp4"
	},
	"/room-assets/live-gifts/114225.mp4": {
		"type": "video/mp4",
		"etag": "\"10adbd-gWSQd4ZcmxNL0lPtCT793AbQSnw\"",
		"mtime": "2026-10-21T07:17:50.097Z",
		"size": 1093053,
		"path": "../public/room-assets/live-gifts/114225.mp4"
	},
	"/room-assets/live-gifts/19752.mp4": {
		"type": "video/mp4",
		"etag": "\"54beb-ZY+MUVgM6R1kw8h77gT82YHlyS8\"",
		"mtime": "2026-10-21T07:17:50.121Z",
		"size": 347115,
		"path": "../public/room-assets/live-gifts/19752.mp4"
	},
	"/room-assets/live-gifts/16122.mp4": {
		"type": "video/mp4",
		"etag": "\"86dcb-YUmWEABcSNw8QdN5wzUEzfIAQnY\"",
		"mtime": "2026-10-21T07:17:50.129Z",
		"size": 552395,
		"path": "../public/room-assets/live-gifts/16122.mp4"
	},
	"/room-assets/live-gifts/21961.mp4": {
		"type": "video/mp4",
		"etag": "\"76f72-4fxBSR+5ziVoO8NvlEkP+alfc3k\"",
		"mtime": "2026-10-21T07:17:50.197Z",
		"size": 487282,
		"path": "../public/room-assets/live-gifts/21961.mp4"
	},
	"/room-assets/live-gifts/22207.mp4": {
		"type": "video/mp4",
		"etag": "\"66abf-oQkqMQ50WwamkZXzOM1CkQtEkB8\"",
		"mtime": "2026-10-21T07:17:50.213Z",
		"size": 420543,
		"path": "../public/room-assets/live-gifts/22207.mp4"
	},
	"/room-assets/live-gifts/19898.mp4": {
		"type": "video/mp4",
		"etag": "\"d81ed-ZGW2yi4/BdFvYSR2btLdBBIP7XQ\"",
		"mtime": "2026-10-21T07:17:50.177Z",
		"size": 885229,
		"path": "../public/room-assets/live-gifts/19898.mp4"
	},
	"/room-assets/live-gifts/22270.mp4": {
		"type": "video/mp4",
		"etag": "\"64cd4-jaVtgNztxnIXiMwfu8K4oF+qLuU\"",
		"mtime": "2026-10-21T07:17:50.245Z",
		"size": 412884,
		"path": "../public/room-assets/live-gifts/22270.mp4"
	},
	"/room-assets/live-gifts/23478.mp4": {
		"type": "video/mp4",
		"etag": "\"6a8ca-qIyyR8BAdcwXKyfyMywBh70/uSA\"",
		"mtime": "2026-10-21T07:17:50.237Z",
		"size": 436426,
		"path": "../public/room-assets/live-gifts/23478.mp4"
	},
	"/room-assets/live-gifts/21268.mp4": {
		"type": "video/mp4",
		"etag": "\"afd84-usSWf+jva/Sq8UmqtP950N6EqoY\"",
		"mtime": "2026-10-21T07:17:50.185Z",
		"size": 720260,
		"path": "../public/room-assets/live-gifts/21268.mp4"
	},
	"/room-assets/live-gifts/21637.mp4": {
		"type": "video/mp4",
		"etag": "\"9147b-mJUmhe4qVN0O1X08bjWavX/8FYQ\"",
		"mtime": "2026-10-21T07:17:50.177Z",
		"size": 595067,
		"path": "../public/room-assets/live-gifts/21637.mp4"
	},
	"/room-assets/live-gifts/22067.mp4": {
		"type": "video/mp4",
		"etag": "\"bbca5-aTyR/TXNX222NkXPNFH6J6BR0e0\"",
		"mtime": "2026-10-21T07:17:50.245Z",
		"size": 769189,
		"path": "../public/room-assets/live-gifts/22067.mp4"
	},
	"/room-assets/live-gifts/23528.mp4": {
		"type": "video/mp4",
		"etag": "\"5e9f0-c8bZO61hQvS97AVA4TWo9wipCSE\"",
		"mtime": "2026-10-21T07:17:50.325Z",
		"size": 387568,
		"path": "../public/room-assets/live-gifts/23528.mp4"
	},
	"/room-assets/live-gifts/23503.mp4": {
		"type": "video/mp4",
		"etag": "\"c076d-y9EfyI25rKAPq7ei3DtkJWh4dYA\"",
		"mtime": "2026-10-21T07:17:50.277Z",
		"size": 788333,
		"path": "../public/room-assets/live-gifts/23503.mp4"
	},
	"/room-assets/live-gifts/21267.mp4": {
		"type": "video/mp4",
		"etag": "\"141d9b-nM6BTojLMJdAPmn9cSvbgt686UA\"",
		"mtime": "2026-10-21T07:17:50.153Z",
		"size": 1318299,
		"path": "../public/room-assets/live-gifts/21267.mp4"
	},
	"/room-assets/live-gifts/23765.mp4": {
		"type": "video/mp4",
		"etag": "\"70de0-32P6ZGO5fwJpUU608fqCAFRRcv8\"",
		"mtime": "2026-10-21T07:17:50.305Z",
		"size": 462304,
		"path": "../public/room-assets/live-gifts/23765.mp4"
	},
	"/room-assets/live-gifts/23504.mp4": {
		"type": "video/mp4",
		"etag": "\"ca7e8-XhKx9vNNTdDf767Mr6hwfzyVgFA\"",
		"mtime": "2026-10-21T07:17:50.269Z",
		"size": 829416,
		"path": "../public/room-assets/live-gifts/23504.mp4"
	},
	"/room-assets/live-gifts/22084.mp4": {
		"type": "video/mp4",
		"etag": "\"12c89d-/qdEu6aP/AX8ciJGSJcVCiW68pU\"",
		"mtime": "2026-10-21T07:17:50.289Z",
		"size": 1231005,
		"path": "../public/room-assets/live-gifts/22084.mp4"
	},
	"/room-assets/live-gifts/21266.mp4": {
		"type": "video/mp4",
		"etag": "\"18746d-jvz4Q5DVeqN8pEjPMnAfUiP8sIw\"",
		"mtime": "2026-10-21T07:17:50.181Z",
		"size": 1602669,
		"path": "../public/room-assets/live-gifts/21266.mp4"
	},
	"/room-assets/live-gifts/23552.mp4": {
		"type": "video/mp4",
		"etag": "\"a6223-vdWmtxR3pI3a45/bS5V0lvfcmyE\"",
		"mtime": "2026-10-21T07:17:50.253Z",
		"size": 680483,
		"path": "../public/room-assets/live-gifts/23552.mp4"
	},
	"/room-assets/live-gifts/23757.mp4": {
		"type": "video/mp4",
		"etag": "\"8975c-4I1EU/ZrHS0Opahv2kgSJzMYYmc\"",
		"mtime": "2026-10-21T07:17:50.297Z",
		"size": 563036,
		"path": "../public/room-assets/live-gifts/23757.mp4"
	},
	"/room-assets/live-gifts/22064.mp4": {
		"type": "video/mp4",
		"etag": "\"1bc046-gCBIldL83mehWEDtNSZlXmadxJM\"",
		"mtime": "2026-10-21T07:17:50.197Z",
		"size": 1818694,
		"path": "../public/room-assets/live-gifts/22064.mp4"
	},
	"/room-assets/live-gifts/33335.mp4": {
		"type": "video/mp4",
		"etag": "\"48805-cxErZBW8PfVcgHnSGOOztDAzHCQ\"",
		"mtime": "2026-10-21T07:17:50.401Z",
		"size": 296965,
		"path": "../public/room-assets/live-gifts/33335.mp4"
	},
	"/room-assets/live-gifts/33401.mp4": {
		"type": "video/mp4",
		"etag": "\"75462-JKFjWxEy+Mx9GpkakxCJcpzhHqg\"",
		"mtime": "2026-10-21T07:17:50.405Z",
		"size": 480354,
		"path": "../public/room-assets/live-gifts/33401.mp4"
	},
	"/room-assets/live-gifts/33405.mp4": {
		"type": "video/mp4",
		"etag": "\"362af-YfNqSl6MPFUHvVzlXmLkMcry3tw\"",
		"mtime": "2026-10-21T07:17:50.417Z",
		"size": 221871,
		"path": "../public/room-assets/live-gifts/33405.mp4"
	},
	"/room-assets/live-gifts/6401.mp4": {
		"type": "video/mp4",
		"etag": "\"7a35c-Z04rqDxRiGFiCftOp8R5LAzsSvM\"",
		"mtime": "2026-10-21T07:17:50.457Z",
		"size": 500572,
		"path": "../public/room-assets/live-gifts/6401.mp4"
	},
	"/room-assets/live-gifts/23816.mp4": {
		"type": "video/mp4",
		"etag": "\"10ab0b-0HQRXnhAePqwnDvoyW53RXWACJc\"",
		"mtime": "2026-10-21T07:17:50.337Z",
		"size": 1092363,
		"path": "../public/room-assets/live-gifts/23816.mp4"
	},
	"/room-assets/live-gifts/6433.mp4": {
		"type": "video/mp4",
		"etag": "\"3cf2d-Jo1Ad0pg6Z/PlNPPrk3+cpJhTvk\"",
		"mtime": "2026-10-21T07:17:50.445Z",
		"size": 249645,
		"path": "../public/room-assets/live-gifts/6433.mp4"
	},
	"/room-assets/live-gifts/23817.mp4": {
		"type": "video/mp4",
		"etag": "\"12afc7-HQoAB6A531iAjgyAxga8QKuixss\"",
		"mtime": "2026-10-21T07:17:50.357Z",
		"size": 1224647,
		"path": "../public/room-assets/live-gifts/23817.mp4"
	},
	"/room-assets/live-gifts/23815.mp4": {
		"type": "video/mp4",
		"etag": "\"1befdd-fOIM9S1DcDoIk86e8MsrQt9owZ0\"",
		"mtime": "2026-10-21T07:17:50.373Z",
		"size": 1830877,
		"path": "../public/room-assets/live-gifts/23815.mp4"
	},
	"/room-assets/live-gifts/27366.mp4": {
		"type": "video/mp4",
		"etag": "\"1086bf-60xiFS29fFFvxPSTEK37dwH3nsU\"",
		"mtime": "2026-10-21T07:17:50.369Z",
		"size": 1083071,
		"path": "../public/room-assets/live-gifts/27366.mp4"
	},
	"/room-assets/live-gifts/27367.mp4": {
		"type": "video/mp4",
		"etag": "\"13a05c-mj1XyeIdlpKKNqU3jUrKeUdXw+A\"",
		"mtime": "2026-10-21T07:17:50.425Z",
		"size": 1286236,
		"path": "../public/room-assets/live-gifts/27367.mp4"
	},
	"/room-assets/live-gifts/6461.mp4": {
		"type": "video/mp4",
		"etag": "\"f1ffb-irComF8UwVELcfjng5u3zrDNxH8\"",
		"mtime": "2026-10-21T07:17:50.493Z",
		"size": 991227,
		"path": "../public/room-assets/live-gifts/6461.mp4"
	},
	"/room-assets/live-gifts/27368.mp4": {
		"type": "video/mp4",
		"etag": "\"13b5d6-UFMkYhlRZfuSwPoKyB8PYq/re5k\"",
		"mtime": "2026-10-21T07:17:50.429Z",
		"size": 1291734,
		"path": "../public/room-assets/live-gifts/27368.mp4"
	},
	"/room-assets/live-gifts/6795.mp4": {
		"type": "video/mp4",
		"etag": "\"6214d-3zRQ+IlQGtT7DUVwcsTpmCBUfCc\"",
		"mtime": "2026-10-21T07:17:50.525Z",
		"size": 401741,
		"path": "../public/room-assets/live-gifts/6795.mp4"
	},
	"/room-assets/live-gifts/6585.mp4": {
		"type": "video/mp4",
		"etag": "\"c55c3-8j9PlgpgX7i4Neph5jJLstt1pN4\"",
		"mtime": "2026-10-21T07:17:50.453Z",
		"size": 808387,
		"path": "../public/room-assets/live-gifts/6585.mp4"
	},
	"/room-assets/live-gifts/6609.mp4": {
		"type": "video/mp4",
		"etag": "\"a845a-ALERgxPo6c7TXtbRtM5v81wfZn0\"",
		"mtime": "2026-10-21T07:17:50.477Z",
		"size": 689242,
		"path": "../public/room-assets/live-gifts/6609.mp4"
	},
	"/room-assets/live-gifts/7016.mp4": {
		"type": "video/mp4",
		"etag": "\"65ce3-glihWv4Ofzs1+tnj88NMzmPdT2Q\"",
		"mtime": "2026-10-21T07:17:50.505Z",
		"size": 416995,
		"path": "../public/room-assets/live-gifts/7016.mp4"
	},
	"/room-assets/live-gifts/6629.mp4": {
		"type": "video/mp4",
		"etag": "\"95058-95V+uRzJka/v85rBK9LTUfDrSMQ\"",
		"mtime": "2026-10-21T07:17:50.497Z",
		"size": 610392,
		"path": "../public/room-assets/live-gifts/6629.mp4"
	},
	"/room-assets/live-gifts/7118.mp4": {
		"type": "video/mp4",
		"etag": "\"34ca5-/i+ChtQl5qhy6RJf79Ezw6v7Lkk\"",
		"mtime": "2026-10-21T07:17:50.513Z",
		"size": 216229,
		"path": "../public/room-assets/live-gifts/7118.mp4"
	},
	"/room-assets/live-gifts/6669.mp4": {
		"type": "video/mp4",
		"etag": "\"c9806-lZbdn2Y3QWdsR9W8doTpOteUeGs\"",
		"mtime": "2026-10-21T07:17:50.509Z",
		"size": 825350,
		"path": "../public/room-assets/live-gifts/6669.mp4"
	},
	"/room-assets/live-gifts/6718.mp4": {
		"type": "video/mp4",
		"etag": "\"99067-qOUeUQaCpXEdE8sKmQ2xXD9Z/5I\"",
		"mtime": "2026-10-21T07:17:50.497Z",
		"size": 626791,
		"path": "../public/room-assets/live-gifts/6718.mp4"
	},
	"/room-assets/live-gifts/7181.mp4": {
		"type": "video/mp4",
		"etag": "\"5eec2-bljWduAPj6zkRyr+lIbnNP4BqaY\"",
		"mtime": "2026-10-21T07:17:50.525Z",
		"size": 388802,
		"path": "../public/room-assets/live-gifts/7181.mp4"
	},
	"/room-assets/live-gifts/7183.mp4": {
		"type": "video/mp4",
		"etag": "\"5a5a8-dM8tqQZnnEGtewU3nMr37ncjEIM\"",
		"mtime": "2026-10-21T07:17:50.569Z",
		"size": 370088,
		"path": "../public/room-assets/live-gifts/7183.mp4"
	},
	"/room-assets/live-gifts/6797.mp4": {
		"type": "video/mp4",
		"etag": "\"d1073-Y7lIksKMaRKZ7udPUmjqewMM9es\"",
		"mtime": "2026-10-21T07:17:50.573Z",
		"size": 856179,
		"path": "../public/room-assets/live-gifts/6797.mp4"
	},
	"/room-assets/live-gifts/7148.mp4": {
		"type": "video/mp4",
		"etag": "\"94445-Mo3vwLjBrzprZ+PPlr3fXnMoiyA\"",
		"mtime": "2026-10-21T07:17:50.565Z",
		"size": 607301,
		"path": "../public/room-assets/live-gifts/7148.mp4"
	},
	"/room-assets/live-gifts/7185.mp4": {
		"type": "video/mp4",
		"etag": "\"75df5-lQJaplnKF5YsraBPNO+RL6JyWVI\"",
		"mtime": "2026-10-21T07:17:50.561Z",
		"size": 482805,
		"path": "../public/room-assets/live-gifts/7185.mp4"
	},
	"/room-assets/live-gifts/7568.mp4": {
		"type": "video/mp4",
		"etag": "\"588d3-9tvdxdEuax5B2TrbFHBF2l6mjnE\"",
		"mtime": "2026-10-21T07:17:50.581Z",
		"size": 362707,
		"path": "../public/room-assets/live-gifts/7568.mp4"
	},
	"/room-assets/live-gifts/7575.mp4": {
		"type": "video/mp4",
		"etag": "\"6ad14-dmNn0z8ZnWmZDJj9/zEuX4gzpn0\"",
		"mtime": "2026-10-21T07:17:50.589Z",
		"size": 437524,
		"path": "../public/room-assets/live-gifts/7575.mp4"
	},
	"/room-assets/live-gifts/7797.mp4": {
		"type": "video/mp4",
		"etag": "\"6b892-gVJm6sYvaLm7loRK/WsvIxBQTeY\"",
		"mtime": "2026-10-21T07:17:50.605Z",
		"size": 440466,
		"path": "../public/room-assets/live-gifts/7797.mp4"
	},
	"/room-assets/live-gifts/8000.mp4": {
		"type": "video/mp4",
		"etag": "\"3032a-ZMbjxAnLxruOkLWW8LCWd4lC3io\"",
		"mtime": "2026-10-21T07:17:50.609Z",
		"size": 197418,
		"path": "../public/room-assets/live-gifts/8000.mp4"
	},
	"/gifts/special.mp4": {
		"type": "video/mp4",
		"etag": "\"6b4006-TztwVEa4gr0VtRNeFrzissI+QI4\"",
		"mtime": "2026-10-21T07:17:49.773Z",
		"size": 7028742,
		"path": "../public/gifts/special.mp4"
	},
	"/room-assets/live-gifts/8869.mp4": {
		"type": "video/mp4",
		"etag": "\"4e0b7-Cwcz1eWdintRbIuqqoEblxB93GM\"",
		"mtime": "2026-10-21T07:17:50.641Z",
		"size": 319671,
		"path": "../public/room-assets/live-gifts/8869.mp4"
	},
	"/room-assets/live-gifts/7383.mp4": {
		"type": "video/mp4",
		"etag": "\"f2df3-8JWrqZ1U8QQbURLt0bCklRieCNQ\"",
		"mtime": "2026-10-21T07:17:50.617Z",
		"size": 994803,
		"path": "../public/room-assets/live-gifts/7383.mp4"
	},
	"/room-assets/live-gifts/7790.mp4": {
		"type": "video/mp4",
		"etag": "\"a0234-Q3FFbLVDTIpEWLvR92kVzByP0mY\"",
		"mtime": "2026-10-21T07:17:50.597Z",
		"size": 655924,
		"path": "../public/room-assets/live-gifts/7790.mp4"
	},
	"/room-assets/live-gifts/8947.mp4": {
		"type": "video/mp4",
		"etag": "\"3dd38-VrsBWFZZfhqbowqgtzDuppFMwto\"",
		"mtime": "2026-10-21T07:17:50.637Z",
		"size": 253240,
		"path": "../public/room-assets/live-gifts/8947.mp4"
	},
	"/room-assets/live-gifts/9623.mp4": {
		"type": "video/mp4",
		"etag": "\"6fdde-puffesEiWxPrWY2w3PlZIAH+zaI\"",
		"mtime": "2026-10-21T07:17:50.649Z",
		"size": 458206,
		"path": "../public/room-assets/live-gifts/9623.mp4"
	},
	"/room-assets/sfx/mg_p6_bq_ruby.mp3": {
		"type": "audio/mpeg",
		"etag": "\"706b-iiKwNI3jfLnsdmNjGM5C/8FHMAk\"",
		"mtime": "2026-10-21T07:17:49.917Z",
		"size": 28779,
		"path": "../public/room-assets/sfx/mg_p6_bq_ruby.mp3"
	},
	"/room-assets/live-gifts/8654.mp4": {
		"type": "video/mp4",
		"etag": "\"8623d-sL+XYOOYLzthZDeK7FYBT4JuuMI\"",
		"mtime": "2026-10-21T07:17:50.645Z",
		"size": 549437,
		"path": "../public/room-assets/live-gifts/8654.mp4"
	},
	"/room-assets/sfx/mg_p6_bq_sapphire.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6841-dfaZTGLpop4RCnAFfiFCN2nMqjE\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 26689,
		"path": "../public/room-assets/sfx/mg_p6_bq_sapphire.mp3"
	},
	"/room-assets/sfx/mg_p6_crown_queen.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6017-H84/5Ofur3UZMO90aTZO2s+dn+o\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 24599,
		"path": "../public/room-assets/sfx/mg_p6_crown_queen.mp3"
	},
	"/room-assets/sfx/mg_p6_crown_shah.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6841-UkeEIk7YV/unmISxHZKZIGxFwjM\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 26689,
		"path": "../public/room-assets/sfx/mg_p6_crown_shah.mp3"
	},
	"/room-assets/live-gifts/8883.mp4": {
		"type": "video/mp4",
		"etag": "\"bb31e-QAohaVuR952WZjc73TSevN/Sgss\"",
		"mtime": "2026-10-21T07:17:50.637Z",
		"size": 766750,
		"path": "../public/room-assets/live-gifts/8883.mp4"
	},
	"/room-assets/sfx/mg_p6_hat_gent.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6017-vRJqDmCy2mkDdItbpqjFk43OvVQ\"",
		"mtime": "2026-10-21T07:17:50.649Z",
		"size": 24599,
		"path": "../public/room-assets/sfx/mg_p6_hat_gent.mp3"
	},
	"/room-assets/sfx/mg_p6_hat_lady.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6841-J18pQTmGkTyJGMjuePXKnmmRUNE\"",
		"mtime": "2026-10-21T07:17:50.661Z",
		"size": 26689,
		"path": "../public/room-assets/sfx/mg_p6_hat_lady.mp3"
	},
	"/room-assets/sfx/mg_p6_kiss_diamond.mp3": {
		"type": "audio/mpeg",
		"etag": "\"458f-QdM8Uiuee0aBOktzbXShZ5fV3qw\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 17807,
		"path": "../public/room-assets/sfx/mg_p6_kiss_diamond.mp3"
	},
	"/room-assets/sfx/mg_p6_kiss_heart.mp3": {
		"type": "audio/mpeg",
		"etag": "\"58f3-0mrDnSWQgdoTXiID9btwxS79LVw\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 22771,
		"path": "../public/room-assets/sfx/mg_p6_kiss_heart.mp3"
	},
	"/room-assets/live-gifts/9651.mp4": {
		"type": "video/mp4",
		"etag": "\"80164-XSSvdbcGDudeAONopK/oieNIhQU\"",
		"mtime": "2026-10-21T07:17:50.649Z",
		"size": 524644,
		"path": "../public/room-assets/live-gifts/9651.mp4"
	},
	"/room-assets/sfx/mg_p6_ring_box.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6841-UFWkeTs1svcp7UqS8qask5wrhEk\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 26689,
		"path": "../public/room-assets/sfx/mg_p6_ring_box.mp3"
	},
	"/room-assets/sfx/mg_p6_ring_ruby.mp3": {
		"type": "audio/mpeg",
		"etag": "\"50c9-QyVQelxoJl6wvRTQ4G1mdmOsgo8\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 20681,
		"path": "../public/room-assets/sfx/mg_p6_ring_ruby.mp3"
	},
	"/room-assets/sfx/mg_p6_rose_diamond.mp3": {
		"type": "audio/mpeg",
		"etag": "\"706b-Bw+/K1EkOMbwaDHYqHXvwPBdmiU\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 28779,
		"path": "../public/room-assets/sfx/mg_p6_rose_diamond.mp3"
	},
	"/room-assets/sfx/mg_p6_rose_gold.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6841-67UXDbKEDZgl8UaB2vOGkvWxMU4\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 26689,
		"path": "../public/room-assets/sfx/mg_p6_rose_gold.mp3"
	},
	"/room-assets/sfx/mg_phonering.mp3": {
		"type": "audio/mpeg",
		"etag": "\"6f99-YvN4kb9zAlk68fJ8LiGehpzyxZA\"",
		"mtime": "2026-10-21T07:17:50.669Z",
		"size": 28569,
		"path": "../public/room-assets/sfx/mg_phonering.mp3"
	},
	"/room-assets/sfx/roulette_reward.mp3": {
		"type": "audio/mpeg",
		"etag": "\"8338-7RPVMBgEJaYvsXTuULlEZqSM6uI\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 33592,
		"path": "../public/room-assets/sfx/roulette_reward.mp3"
	},
	"/room-assets/sfx/roulette_spin.mp3": {
		"type": "audio/mpeg",
		"etag": "\"881e-jdW6ac4ntXk6k+4jAEqLES42UJs\"",
		"mtime": "2026-10-21T07:17:50.665Z",
		"size": 34846,
		"path": "../public/room-assets/sfx/roulette_spin.mp3"
	},
	"/room-assets/table-bg/aurora_lake.webp": {
		"type": "image/webp",
		"etag": "\"b158-j+ZXIenkKKo4l3WV0nm2T12Vok0\"",
		"mtime": "2026-10-21T07:17:49.917Z",
		"size": 45400,
		"path": "../public/room-assets/table-bg/aurora_lake.webp"
	},
	"/room-assets/table-bg/aurora_lake_thumb.webp": {
		"type": "image/webp",
		"etag": "\"1d34-dmjCUXwb5BoU6go8XkolFM5zI5A\"",
		"mtime": "2026-10-21T07:17:50.669Z",
		"size": 7476,
		"path": "../public/room-assets/table-bg/aurora_lake_thumb.webp"
	},
	"/room-assets/table-bg/crystal_cave.webp": {
		"type": "image/webp",
		"etag": "\"12eba-lwmDum8pI2uQzcUNF4axYZkJwl8\"",
		"mtime": "2026-10-21T07:17:50.685Z",
		"size": 77498,
		"path": "../public/room-assets/table-bg/crystal_cave.webp"
	},
	"/room-assets/table-bg/crystal_cave_thumb.webp": {
		"type": "image/webp",
		"etag": "\"309c-vXY/ljsKKZfFWrr9cWSGUBXBJ0w\"",
		"mtime": "2026-10-21T07:17:50.681Z",
		"size": 12444,
		"path": "../public/room-assets/table-bg/crystal_cave_thumb.webp"
	},
	"/room-assets/table-bg/desert_night.webp": {
		"type": "image/webp",
		"etag": "\"c6d4-0W3uDCbneNfiqMdFOjUSIJ6+2kE\"",
		"mtime": "2026-10-21T07:17:50.681Z",
		"size": 50900,
		"path": "../public/room-assets/table-bg/desert_night.webp"
	},
	"/room-assets/table-bg/desert_night_thumb.webp": {
		"type": "image/webp",
		"etag": "\"1cfa-ZSra0l+LeGhIMzfKtw46JRybzIw\"",
		"mtime": "2026-10-21T07:17:50.681Z",
		"size": 7418,
		"path": "../public/room-assets/table-bg/desert_night_thumb.webp"
	},
	"/room-assets/table-bg/golden_lounge.webp": {
		"type": "image/webp",
		"etag": "\"1b8c6-FncCeMLNI9XoFok7Y0TZ+wUM9HU\"",
		"mtime": "2026-10-21T07:17:50.689Z",
		"size": 112838,
		"path": "../public/room-assets/table-bg/golden_lounge.webp"
	},
	"/room-assets/table-bg/golden_lounge_thumb.webp": {
		"type": "image/webp",
		"etag": "\"4336-ssddz5EPabVq4GPheF39Fhcxr0o\"",
		"mtime": "2026-10-21T07:17:50.685Z",
		"size": 17206,
		"path": "../public/room-assets/table-bg/golden_lounge_thumb.webp"
	},
	"/room-assets/table-bg/lux_hall.webp": {
		"type": "image/webp",
		"etag": "\"16db6-p7qNwDFXJEQpKZ1cjh3H4ipVI58\"",
		"mtime": "2026-10-21T07:17:50.689Z",
		"size": 93622,
		"path": "../public/room-assets/table-bg/lux_hall.webp"
	},
	"/room-assets/table-bg/lux_hall_thumb.webp": {
		"type": "image/webp",
		"etag": "\"3212-0X/Nlq3il7ZKVSTksBp3G1s/RYo\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 12818,
		"path": "../public/room-assets/table-bg/lux_hall_thumb.webp"
	},
	"/room-assets/table-bg/night_city.webp": {
		"type": "image/webp",
		"etag": "\"25018-Hn0ioQLnIOBhFYPlyd3w3OEIGgI\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 151576,
		"path": "../public/room-assets/table-bg/night_city.webp"
	},
	"/room-assets/table-bg/night_city_thumb.webp": {
		"type": "image/webp",
		"etag": "\"3892-ttQiM0m70AYTMCyC4BxHPym9DPw\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 14482,
		"path": "../public/room-assets/table-bg/night_city_thumb.webp"
	},
	"/room-assets/table-bg/royal_garden.webp": {
		"type": "image/webp",
		"etag": "\"dbe0-1lY3UPdk8TaAYbpvEOOTjwdKE/4\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 56288,
		"path": "../public/room-assets/table-bg/royal_garden.webp"
	},
	"/room-assets/table-bg/royal_garden_thumb.webp": {
		"type": "image/webp",
		"etag": "\"2502-T2p0fUqOgDCvfqT5gKygi7JkeO8\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 9474,
		"path": "../public/room-assets/table-bg/royal_garden_thumb.webp"
	},
	"/room-assets/table-bg/royal_velvet.webp": {
		"type": "image/webp",
		"etag": "\"142fc-Ych6aqNbr39AWXtqTmaAIcSWEbM\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 82684,
		"path": "../public/room-assets/table-bg/royal_velvet.webp"
	},
	"/room-assets/table-bg/royal_velvet_thumb.webp": {
		"type": "image/webp",
		"etag": "\"1a24-Bocyy1OVykPJ6cAsl9gYMwqf61w\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 6692,
		"path": "../public/room-assets/table-bg/royal_velvet_thumb.webp"
	},
	"/room-assets/table-bg/sakura_garden.webp": {
		"type": "image/webp",
		"etag": "\"13b16-2lfL5fMqNhmzTM/lcofNrtEeiq4\"",
		"mtime": "2026-10-21T07:17:50.729Z",
		"size": 80662,
		"path": "../public/room-assets/table-bg/sakura_garden.webp"
	},
	"/room-assets/table-bg/sakura_garden_thumb.webp": {
		"type": "image/webp",
		"etag": "\"32fe-mR6/ao8Uug3nS4zrKDix3SZC6qM\"",
		"mtime": "2026-10-21T07:17:50.701Z",
		"size": 13054,
		"path": "../public/room-assets/table-bg/sakura_garden_thumb.webp"
	},
	"/room-assets/table-bg/seaside.webp": {
		"type": "image/webp",
		"etag": "\"16660-nbjijiAmB+8LviV3tHkJdSY7iHo\"",
		"mtime": "2026-10-21T07:17:50.725Z",
		"size": 91744,
		"path": "../public/room-assets/table-bg/seaside.webp"
	},
	"/room-assets/table-bg/seaside_thumb.webp": {
		"type": "image/webp",
		"etag": "\"2d6a-Gxg2lbtATZF0A40ySleZoTOuRE0\"",
		"mtime": "2026-10-21T07:17:50.705Z",
		"size": 11626,
		"path": "../public/room-assets/table-bg/seaside_thumb.webp"
	},
	"/room-assets/table-bg/space.webp": {
		"type": "image/webp",
		"etag": "\"9cae-Oa5CPhurj5EmJMSaPBblu1yb4TM\"",
		"mtime": "2026-10-21T07:17:50.709Z",
		"size": 40110,
		"path": "../public/room-assets/table-bg/space.webp"
	},
	"/room-assets/table-bg/space_thumb.webp": {
		"type": "image/webp",
		"etag": "\"1d0e-JmetTFaG8+jcmOeNKZgvONHsqvo\"",
		"mtime": "2026-10-21T07:17:50.709Z",
		"size": 7438,
		"path": "../public/room-assets/table-bg/space_thumb.webp"
	},
	"/room-assets/table-bg/underwater.webp": {
		"type": "image/webp",
		"etag": "\"cbba-2lz+A/Q7pcpgF7tbjMI6esJfh8E\"",
		"mtime": "2026-10-21T07:17:50.713Z",
		"size": 52154,
		"path": "../public/room-assets/table-bg/underwater.webp"
	},
	"/room-assets/table-bg/underwater_thumb.webp": {
		"type": "image/webp",
		"etag": "\"21ac-gNwdcwbFAn1dtHaM79xBSYDLysE\"",
		"mtime": "2026-10-21T07:17:50.713Z",
		"size": 8620,
		"path": "../public/room-assets/table-bg/underwater_thumb.webp"
	},
	"/room-assets/table-bg/vip_club.webp": {
		"type": "image/webp",
		"etag": "\"aa4a-d7M4t9B8Lj9yJjDLHZUvr8CXkbg\"",
		"mtime": "2026-10-21T07:17:50.713Z",
		"size": 43594,
		"path": "../public/room-assets/table-bg/vip_club.webp"
	},
	"/room-assets/table-bg/vip_club_thumb.webp": {
		"type": "image/webp",
		"etag": "\"1c5c-LE0wUz+wrZ/JzArJl780bmdVtc8\"",
		"mtime": "2026-10-21T07:17:50.713Z",
		"size": 7260,
		"path": "../public/room-assets/table-bg/vip_club_thumb.webp"
	},
	"/room-assets/live-gifts/icons/10022.webp": {
		"type": "image/webp",
		"etag": "\"3066-rd6xUe0PynnU/vctiN5deLHTNow\"",
		"mtime": "2026-10-21T07:17:49.929Z",
		"size": 12390,
		"path": "../public/room-assets/live-gifts/icons/10022.webp"
	},
	"/room-assets/live-gifts/icons/10065.webp": {
		"type": "image/webp",
		"etag": "\"34c2-hfO3T9eAQkDqFsMVbu9zyIHxKPY\"",
		"mtime": "2026-10-21T07:17:51.797Z",
		"size": 13506,
		"path": "../public/room-assets/live-gifts/icons/10065.webp"
	},
	"/room-assets/live-gifts/icons/101857.webp": {
		"type": "image/webp",
		"etag": "\"30aa-ZRqJZMe4ea+GCEPya2FCUGAsQEw\"",
		"mtime": "2026-10-21T07:17:51.797Z",
		"size": 12458,
		"path": "../public/room-assets/live-gifts/icons/101857.webp"
	},
	"/room-assets/live-gifts/icons/101862.webp": {
		"type": "image/webp",
		"etag": "\"2cdc-O8LMMTQMHUY49SJ/gQGBd9eXCOo\"",
		"mtime": "2026-10-21T07:17:51.797Z",
		"size": 11484,
		"path": "../public/room-assets/live-gifts/icons/101862.webp"
	},
	"/room-assets/live-gifts/icons/101868.webp": {
		"type": "image/webp",
		"etag": "\"2d8c-YgNeKGDES/k6+K6sWeo8NcogKgo\"",
		"mtime": "2026-10-21T07:17:51.797Z",
		"size": 11660,
		"path": "../public/room-assets/live-gifts/icons/101868.webp"
	},
	"/room-assets/live-gifts/icons/10517.webp": {
		"type": "image/webp",
		"etag": "\"2e20-fuCIYZWTZeqAldYWxqC2wJTFlwo\"",
		"mtime": "2026-10-21T07:17:51.801Z",
		"size": 11808,
		"path": "../public/room-assets/live-gifts/icons/10517.webp"
	},
	"/room-assets/live-gifts/icons/105610.webp": {
		"type": "image/webp",
		"etag": "\"2a54-vmfycwychoiwjdXNnINKrItWyp4\"",
		"mtime": "2026-10-21T07:17:51.801Z",
		"size": 10836,
		"path": "../public/room-assets/live-gifts/icons/105610.webp"
	},
	"/room-assets/live-gifts/icons/105817.webp": {
		"type": "image/webp",
		"etag": "\"363e-8ujqT/cWjaleOJoolcD/t2Qeol8\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 13886,
		"path": "../public/room-assets/live-gifts/icons/105817.webp"
	},
	"/room-assets/live-gifts/icons/10588.webp": {
		"type": "image/webp",
		"etag": "\"2320-tOhQiYRsgHBxAVtlUEOuAiVEyLk\"",
		"mtime": "2026-10-21T07:17:51.809Z",
		"size": 8992,
		"path": "../public/room-assets/live-gifts/icons/10588.webp"
	},
	"/room-assets/live-gifts/icons/10669.webp": {
		"type": "image/webp",
		"etag": "\"270a-Pg6h4FTvzObMx1T152P1lr8GnVc\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 9994,
		"path": "../public/room-assets/live-gifts/icons/10669.webp"
	},
	"/room-assets/live-gifts/icons/10670.webp": {
		"type": "image/webp",
		"etag": "\"319c-zQNz2jO3DMU9KUjRf2ZEzUuq2gY\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 12700,
		"path": "../public/room-assets/live-gifts/icons/10670.webp"
	},
	"/room-assets/live-gifts/icons/10672.webp": {
		"type": "image/webp",
		"etag": "\"3784-6yq2YREDv1sEuWFWKGotGUVidgg\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 14212,
		"path": "../public/room-assets/live-gifts/icons/10672.webp"
	},
	"/room-assets/live-gifts/icons/115549.webp": {
		"type": "image/webp",
		"etag": "\"1f2e-LYYrMK81xnwX2O6BKMI8fCdcirU\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 7982,
		"path": "../public/room-assets/live-gifts/icons/115549.webp"
	},
	"/room-assets/live-gifts/icons/11585.webp": {
		"type": "image/webp",
		"etag": "\"3628-oF6p9pIB2Z0Cujsrc1o/fLfOMvM\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 13864,
		"path": "../public/room-assets/live-gifts/icons/11585.webp"
	},
	"/room-assets/live-gifts/icons/11586.webp": {
		"type": "image/webp",
		"etag": "\"36dc-9NdewOqzqpzF6LB8A7TEj98MrQ4\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 14044,
		"path": "../public/room-assets/live-gifts/icons/11586.webp"
	},
	"/room-assets/live-gifts/icons/12041.webp": {
		"type": "image/webp",
		"etag": "\"2c26-JQEez6PEXZN376aREtKUrc3ZIwA\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 11302,
		"path": "../public/room-assets/live-gifts/icons/12041.webp"
	},
	"/room-assets/live-gifts/icons/12680.webp": {
		"type": "image/webp",
		"etag": "\"22be-e+S0ypaLcdC5bVm4GnJCOBaENl8\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 8894,
		"path": "../public/room-assets/live-gifts/icons/12680.webp"
	},
	"/room-assets/live-gifts/icons/12853.webp": {
		"type": "image/webp",
		"etag": "\"28e0-gitRrTuhPiJM5UUbEABAg5UJC74\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 10464,
		"path": "../public/room-assets/live-gifts/icons/12853.webp"
	},
	"/room-assets/live-gifts/icons/12922.webp": {
		"type": "image/webp",
		"etag": "\"3254-7jUv4zYN1ilSB6vtogvP5i1CPfM\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 12884,
		"path": "../public/room-assets/live-gifts/icons/12922.webp"
	},
	"/room-assets/live-gifts/icons/13006.webp": {
		"type": "image/webp",
		"etag": "\"375a-I6KFFRlR1yj0tOkGbHvETvS7ntk\"",
		"mtime": "2026-10-21T07:17:51.813Z",
		"size": 14170,
		"path": "../public/room-assets/live-gifts/icons/13006.webp"
	},
	"/room-assets/live-gifts/icons/13008.webp": {
		"type": "image/webp",
		"etag": "\"3008-ntJgJdEh2ulim63RtzbUjAg42I0\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 12296,
		"path": "../public/room-assets/live-gifts/icons/13008.webp"
	},
	"/room-assets/live-gifts/icons/13469.webp": {
		"type": "image/webp",
		"etag": "\"1c6a-8wnKzXFaCJvbNU80OJwEJjiyFNs\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 7274,
		"path": "../public/room-assets/live-gifts/icons/13469.webp"
	},
	"/room-assets/live-gifts/icons/14384.webp": {
		"type": "image/webp",
		"etag": "\"41f4-Fm0sBU3fEOj8JaYsZGGZG0GEuPs\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 16884,
		"path": "../public/room-assets/live-gifts/icons/14384.webp"
	},
	"/room-assets/live-gifts/icons/14562.webp": {
		"type": "image/webp",
		"etag": "\"3bd6-iEKzSCK8QWiCQUemWtsuclWQXr4\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 15318,
		"path": "../public/room-assets/live-gifts/icons/14562.webp"
	},
	"/room-assets/live-gifts/icons/17446.webp": {
		"type": "image/webp",
		"etag": "\"2200-9a5O4fsTjCgbYRjeF4D4b4HmmUQ\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 8704,
		"path": "../public/room-assets/live-gifts/icons/17446.webp"
	},
	"/room-assets/live-gifts/icons/17710.webp": {
		"type": "image/webp",
		"etag": "\"362c-JYyLxjbxx7jnlOusI+LbyKJJfKc\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 13868,
		"path": "../public/room-assets/live-gifts/icons/17710.webp"
	},
	"/room-assets/live-gifts/icons/18337.webp": {
		"type": "image/webp",
		"etag": "\"2fa2-A0YI0NLglEb1oOHyG/79FhdRzKM\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 12194,
		"path": "../public/room-assets/live-gifts/icons/18337.webp"
	},
	"/room-assets/live-gifts/icons/18338.webp": {
		"type": "image/webp",
		"etag": "\"21d0-QEI1U1Y6SL73Xz4W6+k79XweaxA\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 8656,
		"path": "../public/room-assets/live-gifts/icons/18338.webp"
	},
	"/room-assets/live-gifts/icons/18339.webp": {
		"type": "image/webp",
		"etag": "\"3672-0wk3DAumZbflwfDvsEP3TKgKIB8\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 13938,
		"path": "../public/room-assets/live-gifts/icons/18339.webp"
	},
	"/room-assets/live-gifts/icons/18792.webp": {
		"type": "image/webp",
		"etag": "\"278e-nrf0gGYqWAkhxomfzGmFboVu0eg\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 10126,
		"path": "../public/room-assets/live-gifts/icons/18792.webp"
	},
	"/room-assets/live-gifts/icons/19134.webp": {
		"type": "image/webp",
		"etag": "\"28f2-BS6P2HdO6XSN/KtkCUbgAfvCISU\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 10482,
		"path": "../public/room-assets/live-gifts/icons/19134.webp"
	},
	"/room-assets/live-gifts/icons/53761.webp": {
		"type": "image/webp",
		"etag": "\"23c6-u70Se72wxomEI4DZBwrNAU02sA4\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 9158,
		"path": "../public/room-assets/live-gifts/icons/53761.webp"
	},
	"/room-assets/live-gifts/icons/54539.webp": {
		"type": "image/webp",
		"etag": "\"3b32-KsOctlTTU7oAzckFvzEA1uKBq40\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 15154,
		"path": "../public/room-assets/live-gifts/icons/54539.webp"
	},
	"/room-assets/live-gifts/icons/54540.webp": {
		"type": "image/webp",
		"etag": "\"36d8-Cdy4Cc1rED2tq1pjYWlSiN/pXOo\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 14040,
		"path": "../public/room-assets/live-gifts/icons/54540.webp"
	},
	"/room-assets/live-gifts/icons/54541.webp": {
		"type": "image/webp",
		"etag": "\"4586-Uf+wein4L8SgzmLssVreKGMs3Iw\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 17798,
		"path": "../public/room-assets/live-gifts/icons/54541.webp"
	},
	"/room-assets/live-gifts/icons/547119.webp": {
		"type": "image/webp",
		"etag": "\"1ae4-TMEQuS+xBQwDi0d3a57Fa4MrxwM\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 6884,
		"path": "../public/room-assets/live-gifts/icons/547119.webp"
	},
	"/room-assets/live-gifts/icons/547121.webp": {
		"type": "image/webp",
		"etag": "\"2150-gO1XpVKk/iMNW0xqeuX9oSlpN2s\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 8528,
		"path": "../public/room-assets/live-gifts/icons/547121.webp"
	},
	"/room-assets/live-gifts/icons/54727.webp": {
		"type": "image/webp",
		"etag": "\"27b8-Zct+PRk+Ww1msjVNT3hCy0iTWF8\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 10168,
		"path": "../public/room-assets/live-gifts/icons/54727.webp"
	},
	"/room-assets/live-gifts/icons/54728.webp": {
		"type": "image/webp",
		"etag": "\"31fa-LQ05Bn/YcAP6JGtIj9cONhkJOr0\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 12794,
		"path": "../public/room-assets/live-gifts/icons/54728.webp"
	},
	"/room-assets/live-gifts/icons/59710.webp": {
		"type": "image/webp",
		"etag": "\"390e-L4wtex/kUzBf7uozEtM/zPWJ8oU\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 14606,
		"path": "../public/room-assets/live-gifts/icons/59710.webp"
	},
	"/room-assets/live-gifts/icons/59711.webp": {
		"type": "image/webp",
		"etag": "\"2fce-cclBMnbAGzb/qtL+IosYKHxLlBk\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 12238,
		"path": "../public/room-assets/live-gifts/icons/59711.webp"
	},
	"/room-assets/live-gifts/icons/59712.webp": {
		"type": "image/webp",
		"etag": "\"399e-TvpVruL6gXv/P5qGiLxzwLsc0eA\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 14750,
		"path": "../public/room-assets/live-gifts/icons/59712.webp"
	},
	"/room-assets/live-gifts/icons/59884.webp": {
		"type": "image/webp",
		"etag": "\"3360-+i8ofZWSP/6wz7TNitymqQglKhk\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 13152,
		"path": "../public/room-assets/live-gifts/icons/59884.webp"
	},
	"/room-assets/live-gifts/icons/59885.webp": {
		"type": "image/webp",
		"etag": "\"34c4-/ItLSLpIcOqGeJ5WPUjotd3qsW8\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 13508,
		"path": "../public/room-assets/live-gifts/icons/59885.webp"
	},
	"/room-assets/live-gifts/icons/59994.webp": {
		"type": "image/webp",
		"etag": "\"3792-gKwpy5TRLyJslWhgEBjuatIrWu4\"",
		"mtime": "2026-10-21T07:17:51.825Z",
		"size": 14226,
		"path": "../public/room-assets/live-gifts/icons/59994.webp"
	},
	"/room-assets/live-gifts/icons/6369.webp": {
		"type": "image/webp",
		"etag": "\"2b08-Bhq24s1gpzTp7H5mJH/B6u+CLW4\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 11016,
		"path": "../public/room-assets/live-gifts/icons/6369.webp"
	},
	"/room-assets/live-gifts/icons/6646.webp": {
		"type": "image/webp",
		"etag": "\"301e-lhYj6vAgAq6TIPYHlj960wk8PfM\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 12318,
		"path": "../public/room-assets/live-gifts/icons/6646.webp"
	},
	"/room-assets/live-gifts/icons/677594.webp": {
		"type": "image/webp",
		"etag": "\"3628-oBEDDa4H44SI4p4lWHJjK/fKug0\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 13864,
		"path": "../public/room-assets/live-gifts/icons/677594.webp"
	},
	"/room-assets/live-gifts/icons/6820.webp": {
		"type": "image/webp",
		"etag": "\"2e82-9WSnj3XlgUhUnJ0yI/Ga8WTSBf4\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 11906,
		"path": "../public/room-assets/live-gifts/icons/6820.webp"
	},
	"/room-assets/live-gifts/icons/7400.webp": {
		"type": "image/webp",
		"etag": "\"18bc-QtLhdmyoHwH7PnDIBL5L0n0B84o\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 6332,
		"path": "../public/room-assets/live-gifts/icons/7400.webp"
	},
	"/room-assets/live-gifts/icons/7610.webp": {
		"type": "image/webp",
		"etag": "\"299c-NyNJ0xCf3vzPLQlVRibEMxczmdQ\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 10652,
		"path": "../public/room-assets/live-gifts/icons/7610.webp"
	},
	"/room-assets/live-gifts/icons/7823.webp": {
		"type": "image/webp",
		"etag": "\"200c-YVg1FRFKeliG2p9fCVyCYUHCWCU\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 8204,
		"path": "../public/room-assets/live-gifts/icons/7823.webp"
	},
	"/room-assets/live-gifts/icons/8469.webp": {
		"type": "image/webp",
		"etag": "\"3024-hcEGRYrxB/UfumM7SxSNJ47Y+SI\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 12324,
		"path": "../public/room-assets/live-gifts/icons/8469.webp"
	},
	"/room-assets/live-gifts/icons/8582.webp": {
		"type": "image/webp",
		"etag": "\"3044-y7uP6KfFEAJuXW4fgrIEszebEAg\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 12356,
		"path": "../public/room-assets/live-gifts/icons/8582.webp"
	},
	"/room-assets/live-gifts/icons/8603.webp": {
		"type": "image/webp",
		"etag": "\"351c-vuTBJsWoa9TvJJW69Mx8ss/dDxw\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 13596,
		"path": "../public/room-assets/live-gifts/icons/8603.webp"
	},
	"/room-assets/live-gifts/icons/8624.webp": {
		"type": "image/webp",
		"etag": "\"3d7a-6R4h7u3tmSeLtlC4gTu8foVt+B0\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 15738,
		"path": "../public/room-assets/live-gifts/icons/8624.webp"
	},
	"/room-assets/live-gifts/icons/8651.webp": {
		"type": "image/webp",
		"etag": "\"29d4-JD5qmK0FjdrToR7g4lFz5Je+Ap0\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 10708,
		"path": "../public/room-assets/live-gifts/icons/8651.webp"
	},
	"/room-assets/live-gifts/icons/8912.webp": {
		"type": "image/webp",
		"etag": "\"3dea-9wUZ7bQp0A12+11ivPnoYWWA6YA\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 15850,
		"path": "../public/room-assets/live-gifts/icons/8912.webp"
	},
	"/room-assets/live-gifts/icons/8916.webp": {
		"type": "image/webp",
		"etag": "\"22e8-SAfDG6OYV2WaJ1QtaGvyFhivE9g\"",
		"mtime": "2026-10-21T07:17:51.829Z",
		"size": 8936,
		"path": "../public/room-assets/live-gifts/icons/8916.webp"
	},
	"/room-assets/live-gifts/icons/9092.webp": {
		"type": "image/webp",
		"etag": "\"39b6-LGUVXGhBvJkWiNV1iPTTcNBPdAw\"",
		"mtime": "2026-10-21T07:17:51.833Z",
		"size": 14774,
		"path": "../public/room-assets/live-gifts/icons/9092.webp"
	},
	"/room-assets/live-gifts/icons/9427.webp": {
		"type": "image/webp",
		"etag": "\"3828-9I19wlwtD5qHIwLK321YF1nrK5w\"",
		"mtime": "2026-10-21T07:17:51.833Z",
		"size": 14376,
		"path": "../public/room-assets/live-gifts/icons/9427.webp"
	},
	"/room-assets/live-gifts/icons/9466.webp": {
		"type": "image/webp",
		"etag": "\"3064-i07deOg/VDwqFE1EdQCgpyOLLvI\"",
		"mtime": "2026-10-21T07:17:51.833Z",
		"size": 12388,
		"path": "../public/room-assets/live-gifts/icons/9466.webp"
	},
	"/room-assets/live-gifts/icons/946670.webp": {
		"type": "image/webp",
		"etag": "\"2e4c-sWJn0VSEe1jGY7Xzv9YvAlwEcgk\"",
		"mtime": "2026-10-21T07:17:51.845Z",
		"size": 11852,
		"path": "../public/room-assets/live-gifts/icons/946670.webp"
	},
	"/room-assets/live-gifts/icons/9467.webp": {
		"type": "image/webp",
		"etag": "\"2904-5i0K8nST1rO4tzJ0F6Htk96hT6o\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 10500,
		"path": "../public/room-assets/live-gifts/icons/9467.webp"
	},
	"/room-assets/live-gifts/icons/9468.webp": {
		"type": "image/webp",
		"etag": "\"1df8-9tX+8Uli4iOY54trsdyqsFMvyW0\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 7672,
		"path": "../public/room-assets/live-gifts/icons/9468.webp"
	},
	"/room-assets/live-gifts/icons/9532.webp": {
		"type": "image/webp",
		"etag": "\"4bae-tHOkDAcGpMPCs+xyeqH0K05k0hM\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 19374,
		"path": "../public/room-assets/live-gifts/icons/9532.webp"
	},
	"/room-assets/live-gifts/icons/972120.webp": {
		"type": "image/webp",
		"etag": "\"2ac2-12HM1VGF7KEEJmFi1g9aRuuRy4g\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 10946,
		"path": "../public/room-assets/live-gifts/icons/972120.webp"
	},
	"/room-assets/live-gifts/icons/972130.webp": {
		"type": "image/webp",
		"etag": "\"2d34-01QoqvZFB2DgiNYG7la5dETIgko\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 11572,
		"path": "../public/room-assets/live-gifts/icons/972130.webp"
	},
	"/room-assets/live-gifts/icons/972138.webp": {
		"type": "image/webp",
		"etag": "\"2cdc-HFcvhw432AxJjRdMHltnvfBhJs8\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 11484,
		"path": "../public/room-assets/live-gifts/icons/972138.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"5a8-qhHbyBpSAPGIG1t9bymWaq+T4HY\"",
		"mtime": "2026-10-21T07:17:49.905Z",
		"size": 1448,
		"path": "../public/room-assets/premium-gifts/120/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"748-AcxnryI4/ULFmWvaI2NvCI4P3PY\"",
		"mtime": "2026-10-21T07:17:50.761Z",
		"size": 1864,
		"path": "../public/room-assets/premium-gifts/120/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"79e-LTeWt3WBzHrB7ZyftPMEDz4TtV8\"",
		"mtime": "2026-10-21T07:17:50.761Z",
		"size": 1950,
		"path": "../public/room-assets/premium-gifts/120/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"6fc-RszApHloUWLMmxAWmDEl6LqVZEk\"",
		"mtime": "2026-10-21T07:17:50.761Z",
		"size": 1788,
		"path": "../public/room-assets/premium-gifts/120/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"6fa-Ex1M4H6I39Tevs4CXghMF/lpL1Q\"",
		"mtime": "2026-10-21T07:17:50.761Z",
		"size": 1786,
		"path": "../public/room-assets/premium-gifts/120/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"992-d3t2RHD3OmoqQasx47Z4BcqF4UE\"",
		"mtime": "2026-10-21T07:17:50.761Z",
		"size": 2450,
		"path": "../public/room-assets/premium-gifts/120/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"6f0-bEj4ikRhYl8yCY3uX/X3gh8L6Ec\"",
		"mtime": "2026-10-21T07:17:50.765Z",
		"size": 1776,
		"path": "../public/room-assets/premium-gifts/120/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"710-ni0XrZN26gCessUOTMoafZfeLIE\"",
		"mtime": "2026-10-21T07:17:50.765Z",
		"size": 1808,
		"path": "../public/room-assets/premium-gifts/120/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"a02-pMQi9t21sIA2+xs38X0eOMPZVwY\"",
		"mtime": "2026-10-21T07:17:50.765Z",
		"size": 2562,
		"path": "../public/room-assets/premium-gifts/120/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"596-Fa6M83AXbVdG4WhjsCW/ge3Y7Cw\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1430,
		"path": "../public/room-assets/premium-gifts/120/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"596-Fa6M83AXbVdG4WhjsCW/ge3Y7Cw\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1430,
		"path": "../public/room-assets/premium-gifts/120/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"596-Fa6M83AXbVdG4WhjsCW/ge3Y7Cw\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1430,
		"path": "../public/room-assets/premium-gifts/120/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"5b8-6Akw9FVVBIys+UAg1zrgXkxKlCE\"",
		"mtime": "2026-10-21T07:17:50.785Z",
		"size": 1464,
		"path": "../public/room-assets/premium-gifts/120/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"63e-19jrB9uVLG7AfSwZ7JNtpEmvSz4\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1598,
		"path": "../public/room-assets/premium-gifts/120/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"630-7NiXpWr7CZmZAEZeZRzrR5Q3Q6g\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1584,
		"path": "../public/room-assets/premium-gifts/120/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"59a-kAzY2yL5AMil5P8kPcxvBigWZHc\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1434,
		"path": "../public/room-assets/premium-gifts/120/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"814-R1kmp5jxj/iQL714spIGsQAYm9c\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 2068,
		"path": "../public/room-assets/premium-gifts/120/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"666-ZIyH0vNfafZuyXsrMXZOfxRdzJA\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1638,
		"path": "../public/room-assets/premium-gifts/120/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/120/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"732-MaF0gZKJJN1BOWUlD6UC25pkTf8\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1842,
		"path": "../public/room-assets/premium-gifts/120/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"796-JBoZqWF84v2hyb+N7FgowYpTV2U\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1942,
		"path": "../public/room-assets/premium-gifts/120/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"796-JBoZqWF84v2hyb+N7FgowYpTV2U\"",
		"mtime": "2026-10-21T07:17:50.797Z",
		"size": 1942,
		"path": "../public/room-assets/premium-gifts/120/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"796-JBoZqWF84v2hyb+N7FgowYpTV2U\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 1942,
		"path": "../public/room-assets/premium-gifts/120/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"b5e-fJhaTZO42ok36NsPPH4H001ey9Q\"",
		"mtime": "2026-10-21T07:17:50.789Z",
		"size": 2910,
		"path": "../public/room-assets/premium-gifts/120/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"8f6-NozS1bFb7Kuxfx7Hzd9WJsn7Uw8\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 2294,
		"path": "../public/room-assets/premium-gifts/120/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"79c-YG4tnNuU+IpRfEj9uFhx+54GcmA\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1948,
		"path": "../public/room-assets/premium-gifts/120/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"866-IocojsG+uJOW4EcL9N/gmmibg/c\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 2150,
		"path": "../public/room-assets/premium-gifts/120/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"65a-vVcTfAwVlnT2jjfGexm2ub7dlgg\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1626,
		"path": "../public/room-assets/premium-gifts/120/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"59e-v2aT3Kjaymy1czsgbQ7CrcgbAxo\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1438,
		"path": "../public/room-assets/premium-gifts/120/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"95e-4gwS2NrzxFSgwCXhfsCfnkDIqRo\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 2398,
		"path": "../public/room-assets/premium-gifts/120/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"976-Sskb/hD15U7QtkrSovZAXz4yj14\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 2422,
		"path": "../public/room-assets/premium-gifts/120/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"672-OuB4soQsjHPOKQy5aaUc5F9qoEU\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1650,
		"path": "../public/room-assets/premium-gifts/120/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"6a2-g+IwC1se3bxGDaJQW9dZDPuf2Js\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1698,
		"path": "../public/room-assets/premium-gifts/120/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"936-OZrbvLtFsCjsM8I8sLLgNzJQmwk\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 2358,
		"path": "../public/room-assets/premium-gifts/120/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"984-iA90vaKq/7k3TWXUyP86jZq/ntc\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 2436,
		"path": "../public/room-assets/premium-gifts/120/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"82c-DgHauVmZmotq3Jvg6ABQYfjE/f4\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 2092,
		"path": "../public/room-assets/premium-gifts/120/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"658-Tano5WAlk0BR4sEsTW0QZeiRTpM\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1624,
		"path": "../public/room-assets/premium-gifts/120/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"892-qf8b/jTOGmDXTFiRZAMTsT7wnoU\"",
		"mtime": "2026-10-21T07:17:50.797Z",
		"size": 2194,
		"path": "../public/room-assets/premium-gifts/120/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"6ba-5BZIxfM+Xwu+qrj558fRO3gcKFw\"",
		"mtime": "2026-10-21T07:17:50.793Z",
		"size": 1722,
		"path": "../public/room-assets/premium-gifts/120/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"5aa-skIVX1OOHN16eB3CQVSelElhqnY\"",
		"mtime": "2026-10-21T07:17:50.797Z",
		"size": 1450,
		"path": "../public/room-assets/premium-gifts/120/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"460-0LeFk9kWmwAmtW+0jBYP0eujSYk\"",
		"mtime": "2026-10-21T07:17:50.797Z",
		"size": 1120,
		"path": "../public/room-assets/premium-gifts/120/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"5f0-9iDz5ZSZxHO+tIBOPS9Lk0EEsiE\"",
		"mtime": "2026-10-21T07:17:50.797Z",
		"size": 1520,
		"path": "../public/room-assets/premium-gifts/120/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"5fc-7ulXELmr5NXkCRF1Jt23S62HxYw\"",
		"mtime": "2026-10-21T07:17:50.797Z",
		"size": 1532,
		"path": "../public/room-assets/premium-gifts/120/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"598-Ey9nktBZkvxhEXaC6oGs351ZuYs\"",
		"mtime": "2026-10-21T07:17:50.797Z",
		"size": 1432,
		"path": "../public/room-assets/premium-gifts/120/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"4b8-U3F6R0/ZfBw3MHrH4qVzPHgjDh8\"",
		"mtime": "2026-10-21T07:17:50.809Z",
		"size": 1208,
		"path": "../public/room-assets/premium-gifts/120/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"5b6-2iJUIPq21i3jSTXVWa1/eUMl4nc\"",
		"mtime": "2026-10-21T07:17:50.809Z",
		"size": 1462,
		"path": "../public/room-assets/premium-gifts/120/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"714-Vz5CmU4pUixIs6n4YCk39nRAmGY\"",
		"mtime": "2026-10-21T07:17:50.809Z",
		"size": 1812,
		"path": "../public/room-assets/premium-gifts/120/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"714-Vz5CmU4pUixIs6n4YCk39nRAmGY\"",
		"mtime": "2026-10-21T07:17:50.809Z",
		"size": 1812,
		"path": "../public/room-assets/premium-gifts/120/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"58a-vZeJZxj45t1NBaD+MYaWTHeXUw8\"",
		"mtime": "2026-10-21T07:17:50.809Z",
		"size": 1418,
		"path": "../public/room-assets/premium-gifts/120/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"5cc-VQk6AAMLCoESkBD2use8IceSx1o\"",
		"mtime": "2026-10-21T07:17:50.809Z",
		"size": 1484,
		"path": "../public/room-assets/premium-gifts/120/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"5f2-Gt9O9iXenxpBItq1EN6lajObzx8\"",
		"mtime": "2026-10-21T07:17:50.809Z",
		"size": 1522,
		"path": "../public/room-assets/premium-gifts/120/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"54e-AKsRkhI2lHp/mhcZRYwpok4mtwA\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1358,
		"path": "../public/room-assets/premium-gifts/120/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"55a-uOu9y+xzTLD0tObf7Jp5hylEbrQ\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1370,
		"path": "../public/room-assets/premium-gifts/120/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"54a-q00tdhxKpUa3VeAUaJc6tAdcMGU\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1354,
		"path": "../public/room-assets/premium-gifts/120/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"858-KV62apEdZlSucSdHTOcNf8OtJwE\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 2136,
		"path": "../public/room-assets/premium-gifts/120/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"7d6-u82q4Wn+pjAIpDqOJ9gxWh3NBu4\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 2006,
		"path": "../public/room-assets/premium-gifts/120/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"868-Pi37kCw2tITmKnY/fEJAxeYwTSM\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 2152,
		"path": "../public/room-assets/premium-gifts/120/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"6be-en5v2U0L/fkP80o9fg1wym9CONA\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1726,
		"path": "../public/room-assets/premium-gifts/120/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"650-2sd27fjod62UkjxGqZMSjb+xcjg\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1616,
		"path": "../public/room-assets/premium-gifts/120/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"73c-vE8ruJs9O4VcZz3jjt8tha61O7E\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1852,
		"path": "../public/room-assets/premium-gifts/120/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"652-wpA+Dgsd6/2XdSU6Bvi9G+ydzaM\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1618,
		"path": "../public/room-assets/premium-gifts/120/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"658-qIw2yVx01ljlHT32d6sj7fK3PVI\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1624,
		"path": "../public/room-assets/premium-gifts/120/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"64c-nTTb0i7s3ujiPngVRYaO6K+vX1w\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1612,
		"path": "../public/room-assets/premium-gifts/120/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"7d6-X+Ufl4nPxFTddY9bB63SJ6CawuU\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 2006,
		"path": "../public/room-assets/premium-gifts/120/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"798-awfBT0hPXbrg9+b9+gSv8ztovj8\"",
		"mtime": "2026-10-21T07:17:50.813Z",
		"size": 1944,
		"path": "../public/room-assets/premium-gifts/120/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"70c-8G3jRr6OzudN7VAmHhne9MPA27U\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 1804,
		"path": "../public/room-assets/premium-gifts/120/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"67a-566Eeq4eLYHOpmFEZLS2raReTrk\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 1658,
		"path": "../public/room-assets/premium-gifts/120/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"6f2-9+mNFlGiZRoly3Smo9FSKn6G2fs\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 1778,
		"path": "../public/room-assets/premium-gifts/120/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"6fc-Lslk1Zk86V2sW9MxzRmZ1QkBMIY\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 1788,
		"path": "../public/room-assets/premium-gifts/120/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"7de-YqCV0nsL7dycYlTMIIu33nzBLEY\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2014,
		"path": "../public/room-assets/premium-gifts/120/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"8ec-6hlNkP3tbJS9Cl+18y4uJPFffoQ\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2284,
		"path": "../public/room-assets/premium-gifts/120/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"9c8-KDOnorMLZ/ClDUOcCRnKcAQBNlk\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2504,
		"path": "../public/room-assets/premium-gifts/120/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"e88-AxluGWSHgg6JJUhuixSg7CIOmoc\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 3720,
		"path": "../public/room-assets/premium-gifts/120/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"d44-OI1ehX6SGE3OTVDyBj2SHSD8dtE\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 3396,
		"path": "../public/room-assets/premium-gifts/120/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"a4a-383ZlNAcaURoK5SqpyZc9KPOOwQ\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2634,
		"path": "../public/room-assets/premium-gifts/120/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"ade-MlYqY/uWQ5e3LW7rwmJ8C6A64H4\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2782,
		"path": "../public/room-assets/premium-gifts/120/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"a6e-pdcSO6voxMWNmxOBLRGvkOtu+5E\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2670,
		"path": "../public/room-assets/premium-gifts/120/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"85c-4Y0V5ej4wB3KwyCpYm3zeHcG1FU\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2140,
		"path": "../public/room-assets/premium-gifts/120/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"8b6-wcyebL8E6xMiAAZn6he1Eo7Oa7Q\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2230,
		"path": "../public/room-assets/premium-gifts/120/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"b9e-QUvLMWH5Ygp78QW/9EgWgnxso8E\"",
		"mtime": "2026-10-21T07:17:50.817Z",
		"size": 2974,
		"path": "../public/room-assets/premium-gifts/120/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"998-up5Zll2+VM4JnvvsGn98EHDWVgE\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2456,
		"path": "../public/room-assets/premium-gifts/120/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"ad8-j06DJprGexkW8cZFtIze4lnAovo\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 2776,
		"path": "../public/room-assets/premium-gifts/120/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"ac6-wOnNMhKslmYHGQcpdlRVS7uZzdk\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2758,
		"path": "../public/room-assets/premium-gifts/120/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"932-QvZYMqQ04M5CRQ8JB0FAafUDxUg\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2354,
		"path": "../public/room-assets/premium-gifts/120/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"89e-owIbynPFhcpGk1cRm3Kdw6kuJM0\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2206,
		"path": "../public/room-assets/premium-gifts/120/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"8f2-fb7zOVaTrienUVHBnZ/P9nYVD+I\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2290,
		"path": "../public/room-assets/premium-gifts/120/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"98a-eZwOEgl2vvPOd6loqqGg0cefaZw\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2442,
		"path": "../public/room-assets/premium-gifts/120/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"932-g/kyBzmPZAz2AMpQYIQguoCkkTM\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2354,
		"path": "../public/room-assets/premium-gifts/120/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"c18-ngaUKfHqZJL7LrO85uH6+IDw/0k\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 3096,
		"path": "../public/room-assets/premium-gifts/120/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"9a0-kIGNoaoyZGoasqf65oMpKAhhxkc\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2464,
		"path": "../public/room-assets/premium-gifts/120/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"9d6-qS3rgMsPJ1z4TWxLa/6LyX+6qBA\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2518,
		"path": "../public/room-assets/premium-gifts/120/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"918-gkYLWlzfkfifLzyY7ke7A7J3pIQ\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2328,
		"path": "../public/room-assets/premium-gifts/120/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"92c-ogE5vo35lYtKbfmuEazIyP9df2k\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2348,
		"path": "../public/room-assets/premium-gifts/120/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"992-UWHoXTRQTYIhGJafJneqKzCsQWM\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2450,
		"path": "../public/room-assets/premium-gifts/120/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"ad0-amb0dtTbeNOKes1TfKNhPGRJbcU\"",
		"mtime": "2026-10-21T07:17:50.821Z",
		"size": 2768,
		"path": "../public/room-assets/premium-gifts/120/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"9e8-F1Hi1zXueNJ26X1P7NyQmA6uUMM\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2536,
		"path": "../public/room-assets/premium-gifts/120/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"ac8-29RbRCuMISOTNS3x6YndNaSvP3w\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2760,
		"path": "../public/room-assets/premium-gifts/120/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"c00-0ldU5SJcZQY7YI2A7GK2Pq3HY8M\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 3072,
		"path": "../public/room-assets/premium-gifts/120/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"994-GJ1JmjEDVeY531hoKcp5HjlNV1o\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2452,
		"path": "../public/room-assets/premium-gifts/120/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"a02-fU1tV8HmXqMJJvYZXNku60FeFWw\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2562,
		"path": "../public/room-assets/premium-gifts/120/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"e1a-NTsnk99LGwcziTpbM+31kCqr/94\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 3610,
		"path": "../public/room-assets/premium-gifts/120/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"a22-+LxwtrExigoLdspJ7cfANqX7LeI\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2594,
		"path": "../public/room-assets/premium-gifts/120/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"a04-67q7T6ZhvkXxwIqG7KSazFbwBXg\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2564,
		"path": "../public/room-assets/premium-gifts/120/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"8e2-vILzGRQMI/ltJTkdAM+unRM978w\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2274,
		"path": "../public/room-assets/premium-gifts/120/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"94a-41h9YfrP4MbnGVAyNB23nmCm8Ns\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2378,
		"path": "../public/room-assets/premium-gifts/120/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"a32-B+S5h4wyTNr8y+X2PY7uR/yVwZw\"",
		"mtime": "2026-10-21T07:17:50.825Z",
		"size": 2610,
		"path": "../public/room-assets/premium-gifts/120/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"a3e-sWPsBPF15J31fkoqNaE+nrIGgVA\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2622,
		"path": "../public/room-assets/premium-gifts/120/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"9e6-xKwFwvWHWoSZp5E3Wrk4YiO8MIE\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2534,
		"path": "../public/room-assets/premium-gifts/120/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"8d0-hfWOZ9GnG7O8huBPmpyYocgk9I8\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2256,
		"path": "../public/room-assets/premium-gifts/120/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"ab0-mLMgvlBk75t9Tm/wHsIJNunvFVE\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2736,
		"path": "../public/room-assets/premium-gifts/120/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"a40-h3XecHDL8o5nyphterjtTY19lEE\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2624,
		"path": "../public/room-assets/premium-gifts/120/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"906-uxqPK1N69/YskXgvHqSfKYOhdt0\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2310,
		"path": "../public/room-assets/premium-gifts/120/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/120/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"b9c-sHKxNUFOz6/nv8j/V/eLHU2/99A\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2972,
		"path": "../public/room-assets/premium-gifts/120/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"6c8-FaXy3AaiqplbrG5Ih7orFSNmNrg\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 1736,
		"path": "../public/room-assets/premium-gifts/120/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"690-WePzZB3RvsfKwTwCiuEFX/2EoJA\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 1680,
		"path": "../public/room-assets/premium-gifts/120/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"67e-ePhVlHafUlI8dx6wcYN9OpfdOBU\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 1662,
		"path": "../public/room-assets/premium-gifts/120/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"67a-juEU81xAqG+KzoE02aIrysjAQw0\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 1658,
		"path": "../public/room-assets/premium-gifts/120/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"6f0-4x9zwNE5Vtjz8CB7Bim3jKo4AhM\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 1776,
		"path": "../public/room-assets/premium-gifts/120/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"ea6-FMLagBgxi5SPHpY0kJ44/L1xLZI\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 3750,
		"path": "../public/room-assets/premium-gifts/120/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"9ca-gxr4NJpax34sSgWmmJqHDrYD+EI\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2506,
		"path": "../public/room-assets/premium-gifts/120/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"a0e-FjuDZyLUkQ1wXdQYLwyIkFYIVak\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 2574,
		"path": "../public/room-assets/premium-gifts/120/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"a0c-m93QhY/R5sKSKUAQmZzDC+CSW4Q\"",
		"mtime": "2026-10-21T07:17:50.829Z",
		"size": 2572,
		"path": "../public/room-assets/premium-gifts/120/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/120/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"9ce-qOiTCgDrZRgE7GoS4LbmfiTWzL8\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 2510,
		"path": "../public/room-assets/premium-gifts/120/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"6e0-+KcIYhMkmHede+AEw4IdgeGOTLU\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 1760,
		"path": "../public/room-assets/premium-gifts/120/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"6b8-bt/Vlt2Cz34UIlqOUg4G4R8UqjE\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 1720,
		"path": "../public/room-assets/premium-gifts/120/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"698-EhQAuMbOw6apNOiVWWTHHcUfW+U\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 1688,
		"path": "../public/room-assets/premium-gifts/120/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"69c-0gjAhI8a4EiZAkOB/dNQvafRpII\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 1692,
		"path": "../public/room-assets/premium-gifts/120/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"710-ap2Ey4YFF1Va9D5NQSlaGTV6b0o\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 1808,
		"path": "../public/room-assets/premium-gifts/120/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"ba4-o5DeuUY+ZTeBZn5oDQ57XKwJBWg\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 2980,
		"path": "../public/room-assets/premium-gifts/120/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"a48-O2vHhLH6BFT0Uumkia+5yozbuhA\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 2632,
		"path": "../public/room-assets/premium-gifts/120/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"a60-RG6RYY9azYazN8T3B83vSwbwOEI\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 2656,
		"path": "../public/room-assets/premium-gifts/120/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"a0a-m+oWYS6x+zjDdHw9q0ziItjzuiM\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 2570,
		"path": "../public/room-assets/premium-gifts/120/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/120/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"b8e-tlptIPPt2zSmbnhgOxq7uK2u/jc\"",
		"mtime": "2026-10-21T07:17:50.833Z",
		"size": 2958,
		"path": "../public/room-assets/premium-gifts/120/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"6c8-glZWqwebXt8D1PnRq+nYcN2a+Aw\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1736,
		"path": "../public/room-assets/premium-gifts/120/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"6da-xRSbyPGV0C3XsJMIL9mhsdVAGz4\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1754,
		"path": "../public/room-assets/premium-gifts/120/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"6da-LYb36ioP0ZxrsPYfcWizbEgNrbI\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1754,
		"path": "../public/room-assets/premium-gifts/120/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"67c-+uDjMNa9n0Ly+bc2BaGD+KeS7/U\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1660,
		"path": "../public/room-assets/premium-gifts/120/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"716-q2YovxGfVM0oj2A0DhGl3irqAfw\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1814,
		"path": "../public/room-assets/premium-gifts/120/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"bdc-7RAQgdh8+r2nCw5QVHdhh5oFGjQ\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 3036,
		"path": "../public/room-assets/premium-gifts/120/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"afa-Ts9hmX1TPrGjeCYCnP5G5BAAVhU\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 2810,
		"path": "../public/room-assets/premium-gifts/120/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"aec-QC7MgDJL358F6469OR+Er/CIeCg\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 2796,
		"path": "../public/room-assets/premium-gifts/120/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"ae4-y0D4sQFPzILjMJgYSUuQV3fDEKM\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 2788,
		"path": "../public/room-assets/premium-gifts/120/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/120/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"9f0-g1Ro2p/3ExERQm/+FhnC6J4IQL8\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 2544,
		"path": "../public/room-assets/premium-gifts/120/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/120/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"6da-MFd04DM+U9ObvrQ97+ZGrq5m0ig\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1754,
		"path": "../public/room-assets/premium-gifts/120/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"6b6-TvW/zxk6Z1qJRcN7g0GBW06Lfq8\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1718,
		"path": "../public/room-assets/premium-gifts/120/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"6cc-6+BJWmk8LCTrMG8v0O9WQ4tk5x4\"",
		"mtime": "2026-10-21T07:17:50.837Z",
		"size": 1740,
		"path": "../public/room-assets/premium-gifts/120/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"69a-xlee4tBl0DVm50mXfkwdEmgfK9Y\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1690,
		"path": "../public/room-assets/premium-gifts/120/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/120/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"714-Th309YuVvUgpZnn3VDmE2B9IFhU\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1812,
		"path": "../public/room-assets/premium-gifts/120/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"abc-dAc72lIZpnVnkf9VZxeA5Xk48vI\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 2748,
		"path": "../public/room-assets/premium-gifts/120/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/120/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"67e-+DfOh7UPC1m2acRhSuGgiWwMk6Q\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1662,
		"path": "../public/room-assets/premium-gifts/120/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"678-ocH6Py4EGtiCGpou9MZWQDMwOwo\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1656,
		"path": "../public/room-assets/premium-gifts/120/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"68c-GM2fRFXm695GLoCmaoreLuS4RCA\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1676,
		"path": "../public/room-assets/premium-gifts/120/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"624-yYMJOWaznvAUCEenVrzcYboNUKI\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1572,
		"path": "../public/room-assets/premium-gifts/120/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/120/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"6e4-0qYxUQXciM/EUipgK+jJhHFqUPw\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1764,
		"path": "../public/room-assets/premium-gifts/120/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"852-s0hxipW30VC1JkODJKkLjqQBHKU\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 2130,
		"path": "../public/room-assets/premium-gifts/120/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/120/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"614-RZ08GknMRRepoEKR5bfWlV5eJiI\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1556,
		"path": "../public/room-assets/premium-gifts/120/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"5d4-RjUuV6bquTIYfBX5DzsFLsms9fM\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1492,
		"path": "../public/room-assets/premium-gifts/120/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"5c8-1EDTkgj/1SqModii6Si3oTYAiNQ\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1480,
		"path": "../public/room-assets/premium-gifts/120/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"5ca-HhoMNfW3wnOpW39RCQkYlm8DRyc\"",
		"mtime": "2026-10-21T07:17:50.841Z",
		"size": 1482,
		"path": "../public/room-assets/premium-gifts/120/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/120/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"62e-P98r9De9/+swOjgo/8/8/Rzf3Ko\"",
		"mtime": "2026-10-21T07:17:50.845Z",
		"size": 1582,
		"path": "../public/room-assets/premium-gifts/120/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/120/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"a8c-pXfLaezqpF3jo2DnCIY6IEdEkSY\"",
		"mtime": "2026-10-21T07:17:50.845Z",
		"size": 2700,
		"path": "../public/room-assets/premium-gifts/120/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/120/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"a76-egxuZDLvyzsEoxlTaRpe6Hu1pWM\"",
		"mtime": "2026-10-21T07:17:50.845Z",
		"size": 2678,
		"path": "../public/room-assets/premium-gifts/120/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/120/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"a6a-2JTgdpjVZgJzfOFbKQogSIh62NQ\"",
		"mtime": "2026-10-21T07:17:50.845Z",
		"size": 2666,
		"path": "../public/room-assets/premium-gifts/120/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/120/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"a4e-tlx1I1FBbw/sbKxLAYWKVdhMit8\"",
		"mtime": "2026-10-21T07:17:50.845Z",
		"size": 2638,
		"path": "../public/room-assets/premium-gifts/120/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"62e-62UPFOyf8CRA5mYS5N6Yh8DoO/A\"",
		"mtime": "2026-10-21T07:17:49.933Z",
		"size": 1582,
		"path": "../public/room-assets/premium-gifts/150/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"8e2-rJ7kcrLKdT10gN9dSkRDwt21mck\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2274,
		"path": "../public/room-assets/premium-gifts/150/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"934-NURVsdqTM6Zn4Ie4NEYfNVrIoUw\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2356,
		"path": "../public/room-assets/premium-gifts/150/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"7d6-/M3zc4t6Zl92w2Y9h46qSFFVIHw\"",
		"mtime": "2026-10-21T07:17:51.021Z",
		"size": 2006,
		"path": "../public/room-assets/premium-gifts/150/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"7ec-vM+DVhxTHdrQ4P1YBdqbLNGz9x0\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2028,
		"path": "../public/room-assets/premium-gifts/150/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"b5c-Jjbo/0P6u/OZ/h4wg8m9b2bjJqM\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2908,
		"path": "../public/room-assets/premium-gifts/150/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"87a-Lz+J+3IsJQLyR3vjTJ94MGWWbKA\"",
		"mtime": "2026-10-21T07:17:51.021Z",
		"size": 2170,
		"path": "../public/room-assets/premium-gifts/150/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"890-UUUeGkZ5k1oHSae4EjioU9GqGJE\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2192,
		"path": "../public/room-assets/premium-gifts/150/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"ca0-Smweel8LXAlsVqvcQQwb0hmzeOo\"",
		"mtime": "2026-10-21T07:17:51.029Z",
		"size": 3232,
		"path": "../public/room-assets/premium-gifts/150/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"66e-fESfkDoTYeGkxxbrMJ68d2j7vFs\"",
		"mtime": "2026-10-21T07:17:51.029Z",
		"size": 1646,
		"path": "../public/room-assets/premium-gifts/150/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"66e-fESfkDoTYeGkxxbrMJ68d2j7vFs\"",
		"mtime": "2026-10-21T07:17:51.029Z",
		"size": 1646,
		"path": "../public/room-assets/premium-gifts/150/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"66e-fESfkDoTYeGkxxbrMJ68d2j7vFs\"",
		"mtime": "2026-10-21T07:17:51.029Z",
		"size": 1646,
		"path": "../public/room-assets/premium-gifts/150/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"694-la+/igs04F6j6HHYv96SgqaiOWQ\"",
		"mtime": "2026-10-21T07:17:51.033Z",
		"size": 1684,
		"path": "../public/room-assets/premium-gifts/150/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"718-4lqis1UbhHl7NH4HLDZxC5whSJ4\"",
		"mtime": "2026-10-21T07:17:51.033Z",
		"size": 1816,
		"path": "../public/room-assets/premium-gifts/150/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"6e8-jVDjz3b/kNoX4WQT6vX/IO2Y1/Q\"",
		"mtime": "2026-10-21T07:17:51.033Z",
		"size": 1768,
		"path": "../public/room-assets/premium-gifts/150/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"672-AyMiZ4/dzSM1ginCJDxSDFxoIAo\"",
		"mtime": "2026-10-21T07:17:51.033Z",
		"size": 1650,
		"path": "../public/room-assets/premium-gifts/150/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"93e-owd0wkAsfLG45ak+Zbi2mhVPKtI\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2366,
		"path": "../public/room-assets/premium-gifts/150/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"7bc-+aeOU7n8/z3T8REko7mRkXMF/zc\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 1980,
		"path": "../public/room-assets/premium-gifts/150/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/150/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"87a-eFH2fS3kuybJbiLfDpWPh8K52WY\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2170,
		"path": "../public/room-assets/premium-gifts/150/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"920-wTWK3tV+9EepvH4jHv/TNCFvMNA\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2336,
		"path": "../public/room-assets/premium-gifts/150/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"920-wTWK3tV+9EepvH4jHv/TNCFvMNA\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2336,
		"path": "../public/room-assets/premium-gifts/150/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"920-wTWK3tV+9EepvH4jHv/TNCFvMNA\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2336,
		"path": "../public/room-assets/premium-gifts/150/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"e3c-4yeKNiKBTl7Iv9AEOyH8MjIqCFY\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 3644,
		"path": "../public/room-assets/premium-gifts/150/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"b28-xEeRVzI8VvyeDjFcPs+YNNjEvCk\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2856,
		"path": "../public/room-assets/premium-gifts/150/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"91e-ilkbl6WakQzZPgZqjFK0T4HhTSQ\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2334,
		"path": "../public/room-assets/premium-gifts/150/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"a48-4kiozx0X4/dYF9DtTv0Dlgws7Mw\"",
		"mtime": "2026-10-21T07:17:51.037Z",
		"size": 2632,
		"path": "../public/room-assets/premium-gifts/150/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"762-UDZerK6ywczMDqiQnnrdr8cIhZw\"",
		"mtime": "2026-10-21T07:17:51.041Z",
		"size": 1890,
		"path": "../public/room-assets/premium-gifts/150/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"6c2-XU2xfC8xVfPAg0PtTRF1mGn3gVA\"",
		"mtime": "2026-10-21T07:17:51.041Z",
		"size": 1730,
		"path": "../public/room-assets/premium-gifts/150/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"c00-adoRpHvSPt6MGOw/TEknPnORPu8\"",
		"mtime": "2026-10-21T07:17:51.041Z",
		"size": 3072,
		"path": "../public/room-assets/premium-gifts/150/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"bce-XjA7vIQdGfveBj/pahtE4uo9RA0\"",
		"mtime": "2026-10-21T07:17:51.041Z",
		"size": 3022,
		"path": "../public/room-assets/premium-gifts/150/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"762-uM6k7BRhoBBaKgo5/Mf5/Mwl/OI\"",
		"mtime": "2026-10-21T07:17:51.045Z",
		"size": 1890,
		"path": "../public/room-assets/premium-gifts/150/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"702-dn7jG3eImV8bc1G5rgu8DC9S4YA\"",
		"mtime": "2026-10-21T07:17:51.045Z",
		"size": 1794,
		"path": "../public/room-assets/premium-gifts/150/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"af6-0YE4IgDOf5sMOvIWgM9CWl86jcI\"",
		"mtime": "2026-10-21T07:17:51.045Z",
		"size": 2806,
		"path": "../public/room-assets/premium-gifts/150/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"c0a-LYsPD/mFQXQdnCfCSIkaAFeFHaI\"",
		"mtime": "2026-10-21T07:17:51.045Z",
		"size": 3082,
		"path": "../public/room-assets/premium-gifts/150/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"8f0-FVetl7oeIaALLpAYfXX3Bdd54iE\"",
		"mtime": "2026-10-21T07:17:51.045Z",
		"size": 2288,
		"path": "../public/room-assets/premium-gifts/150/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"7ca-8otUYvG1cAfr74aa4w+i6w8f2rQ\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 1994,
		"path": "../public/room-assets/premium-gifts/150/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"9e4-3nJwtGWSLjry1b0bAFTcvCkvlcU\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 2532,
		"path": "../public/room-assets/premium-gifts/150/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"84c-LsV7wp0EoQqNWcluO9GMxmFWBeM\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 2124,
		"path": "../public/room-assets/premium-gifts/150/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"674-i4gP4GwhwYV0p4QPWzU1/xMhPTM\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 1652,
		"path": "../public/room-assets/premium-gifts/150/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"4f6-1ioYcnIl956Rt62YyvuqjfMoZIo\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 1270,
		"path": "../public/room-assets/premium-gifts/150/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"6f6-uu9aiAYRt7F7N4jAabJY8JqEtoc\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 1782,
		"path": "../public/room-assets/premium-gifts/150/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"71c-nHMuuezP6ALqTCsoFmoH8s5kGWQ\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 1820,
		"path": "../public/room-assets/premium-gifts/150/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"6d0-6TyBvIvSMsoutEZU8Gpms8azJkk\"",
		"mtime": "2026-10-21T07:17:51.053Z",
		"size": 1744,
		"path": "../public/room-assets/premium-gifts/150/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"5ba-silHJUYUZSiMJ5cWjj4BIF8mIPc\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 1466,
		"path": "../public/room-assets/premium-gifts/150/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"66a-F10a/Cs0A/bmLYamm6e0O4cww5U\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 1642,
		"path": "../public/room-assets/premium-gifts/150/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"884-duyE4ZuXTs6MMQumrfAJdEbx11E\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 2180,
		"path": "../public/room-assets/premium-gifts/150/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"884-duyE4ZuXTs6MMQumrfAJdEbx11E\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 2180,
		"path": "../public/room-assets/premium-gifts/150/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"69e-0lMMrZifIRHdoOsG3Y5F2CGpmS0\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 1694,
		"path": "../public/room-assets/premium-gifts/150/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"6f0-xH/uv6wag52mBZJ0f8m+du1XwW0\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 1776,
		"path": "../public/room-assets/premium-gifts/150/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"6f4-grLyTO7OxAV/e4dxnWqRlV6ALGE\"",
		"mtime": "2026-10-21T07:17:51.061Z",
		"size": 1780,
		"path": "../public/room-assets/premium-gifts/150/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"5f6-UaKiiyZB2XW2sHF+nVu/IyDZSwM\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 1526,
		"path": "../public/room-assets/premium-gifts/150/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"5fc-sxHTHohw/3fFfq4IN4sk6jATrzM\"",
		"mtime": "2026-10-21T07:17:51.057Z",
		"size": 1532,
		"path": "../public/room-assets/premium-gifts/150/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"5f8-dj+Au/B0tV+suFuZPmeKF8dr9mo\"",
		"mtime": "2026-10-21T07:17:51.061Z",
		"size": 1528,
		"path": "../public/room-assets/premium-gifts/150/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"948-+5iWdz/n5tEiSnp5AnPeEGhs2B4\"",
		"mtime": "2026-10-21T07:17:51.061Z",
		"size": 2376,
		"path": "../public/room-assets/premium-gifts/150/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"920-zH/C1I2g+iO2p+AsURmwf1Lxn2Q\"",
		"mtime": "2026-10-21T07:17:51.061Z",
		"size": 2336,
		"path": "../public/room-assets/premium-gifts/150/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"960-YPfzU6hjrofbYOHoNn3DtMq69X8\"",
		"mtime": "2026-10-21T07:17:51.061Z",
		"size": 2400,
		"path": "../public/room-assets/premium-gifts/150/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"8e8-FIZLlVCzRsvyNsABO/Jv2YaZoLU\"",
		"mtime": "2026-10-21T07:17:51.061Z",
		"size": 2280,
		"path": "../public/room-assets/premium-gifts/150/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"7ec-SZtPfrFodGOvD94GEPRfT4zs5vg\"",
		"mtime": "2026-10-21T07:17:51.065Z",
		"size": 2028,
		"path": "../public/room-assets/premium-gifts/150/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"8f2-lREc92HpHS53jZxXCpVIYwuLbY4\"",
		"mtime": "2026-10-21T07:17:51.065Z",
		"size": 2290,
		"path": "../public/room-assets/premium-gifts/150/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"794-3f8oRT4rovj3smDvLNxnwpLA5Oc\"",
		"mtime": "2026-10-21T07:17:51.065Z",
		"size": 1940,
		"path": "../public/room-assets/premium-gifts/150/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"808-xN0xQlVER9ZouAvv8q4iuEc+8gs\"",
		"mtime": "2026-10-21T07:17:51.065Z",
		"size": 2056,
		"path": "../public/room-assets/premium-gifts/150/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"7b2-y+cKAkjGCxoY0Iynox0CtCvcOMU\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 1970,
		"path": "../public/room-assets/premium-gifts/150/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"95c-BUeKMt0xgxksBPV31wAtxncD3PM\"",
		"mtime": "2026-10-21T07:17:51.065Z",
		"size": 2396,
		"path": "../public/room-assets/premium-gifts/150/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"950-EqEi4PSsDgbZHpZUprVsiS6gjHw\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 2384,
		"path": "../public/room-assets/premium-gifts/150/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"8c8-rpZyv5Rc2oPo8T7PPD2QgKjg9Ks\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 2248,
		"path": "../public/room-assets/premium-gifts/150/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"804-gX725GUV/gWo7tSy7v1ls8Ogdmc\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 2052,
		"path": "../public/room-assets/premium-gifts/150/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"906-zIlLQXbwTtM2GXbo0zO3vWOz1fM\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 2310,
		"path": "../public/room-assets/premium-gifts/150/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"8ae-ZtvOcqBcqerBy8Ep6oZpE2OViLo\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 2222,
		"path": "../public/room-assets/premium-gifts/150/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"9b2-Zdencm/VIVDxO7HaiZmy8F72qZc\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 2482,
		"path": "../public/room-assets/premium-gifts/150/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"b24-asKlaJZ08KS3q5vL3dOWwyoLpZM\"",
		"mtime": "2026-10-21T07:17:51.069Z",
		"size": 2852,
		"path": "../public/room-assets/premium-gifts/150/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"bae-kgMITrZ9NMlwIB6UGJ/3xOewXqk\"",
		"mtime": "2026-10-21T07:17:51.073Z",
		"size": 2990,
		"path": "../public/room-assets/premium-gifts/150/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1384-69Oko9nlrpL6AI2lyVOV+CuoHkE\"",
		"mtime": "2026-10-21T07:17:51.077Z",
		"size": 4996,
		"path": "../public/room-assets/premium-gifts/150/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"10b2-ktVn8s6W28VIKBjAFMZTzhvT4AE\"",
		"mtime": "2026-10-21T07:17:51.073Z",
		"size": 4274,
		"path": "../public/room-assets/premium-gifts/150/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"d98-P2dfyYmxAii4QjQY6z+4HWnbWrg\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 3480,
		"path": "../public/room-assets/premium-gifts/150/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"da4-YuH/+Rv061r2uLmiblrs0yNfbYY\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 3492,
		"path": "../public/room-assets/premium-gifts/150/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"d7e-gkOw3rkJ1wGjBi2cItLeMTN8uuU\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 3454,
		"path": "../public/room-assets/premium-gifts/150/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"a88-as09mcV/VuPMo/tW76c1yWD5fMw\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 2696,
		"path": "../public/room-assets/premium-gifts/150/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"b26-nYwdmD6gcpW/bYN9ezdoRGSQYlY\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 2854,
		"path": "../public/room-assets/premium-gifts/150/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"e6e-ICtuxb37z20j+h8N5k1jqru35cA\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 3694,
		"path": "../public/room-assets/premium-gifts/150/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"bac-zF6B5WVTP/FMmFKyPLVZ2L6EyvM\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 2988,
		"path": "../public/room-assets/premium-gifts/150/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"e8e-+fOm2IoVMQeiSX0PTcIAz7Ezi/w\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 3726,
		"path": "../public/room-assets/premium-gifts/150/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"e46-5NswepBkuf2RuTk+X8FigPhHrPc\"",
		"mtime": "2026-10-21T07:17:51.097Z",
		"size": 3654,
		"path": "../public/room-assets/premium-gifts/150/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"bb0-zyZrMtpSEkpqszpRwDCHByGWYWo\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 2992,
		"path": "../public/room-assets/premium-gifts/150/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"a8a-itd3E1ueUbOd/l+T2I5v8+2l14s\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 2698,
		"path": "../public/room-assets/premium-gifts/150/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"be4-tB4Lz99xRjRJoPu7aYi0o/fyuXw\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 3044,
		"path": "../public/room-assets/premium-gifts/150/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"bc0-T7u84iS/WqXitNZbbK5yBhx+IBw\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 3008,
		"path": "../public/room-assets/premium-gifts/150/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"ba4-l9HGcNBf2CQL3XXuy1m20WnHpnM\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 2980,
		"path": "../public/room-assets/premium-gifts/150/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"1012-VBycQBWmcN8BuMhZLcB9sJLOprE\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 4114,
		"path": "../public/room-assets/premium-gifts/150/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"c38-J41N35Ul+e+FesZqFqTABtZM8II\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 3128,
		"path": "../public/room-assets/premium-gifts/150/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"d12-qONwf9QIW9Vz1443BXfMQu7bRHw\"",
		"mtime": "2026-10-21T07:17:51.105Z",
		"size": 3346,
		"path": "../public/room-assets/premium-gifts/150/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"b8a-K3pSolIuqj3um5UrPAibgCnUpSA\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 2954,
		"path": "../public/room-assets/premium-gifts/150/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"b80-LytJ1WWuXn31ZSqtlh+OAXXZjCA\"",
		"mtime": "2026-10-21T07:17:51.101Z",
		"size": 2944,
		"path": "../public/room-assets/premium-gifts/150/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"bb8-SDs59HYs6k0oUcWpP2IFNlO/Gnk\"",
		"mtime": "2026-10-21T07:17:51.105Z",
		"size": 3e3,
		"path": "../public/room-assets/premium-gifts/150/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"e24-UawNtLhn9omeeZgbbgtradAoQDA\"",
		"mtime": "2026-10-21T07:17:51.105Z",
		"size": 3620,
		"path": "../public/room-assets/premium-gifts/150/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"cb4-MdPeGro7sPhsG+0ms+/PZz7Zm2w\"",
		"mtime": "2026-10-21T07:17:51.105Z",
		"size": 3252,
		"path": "../public/room-assets/premium-gifts/150/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"d96-+Y7VeFX31O0+hpNL52VbQeNLO0Q\"",
		"mtime": "2026-10-21T07:17:51.105Z",
		"size": 3478,
		"path": "../public/room-assets/premium-gifts/150/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"ed8-Xf49i3HkE7QG3yNdYOB8UTLDei0\"",
		"mtime": "2026-10-21T07:17:51.105Z",
		"size": 3800,
		"path": "../public/room-assets/premium-gifts/150/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"c34-QxBUgY18HHqKJeAzC8K6FUx7+9U\"",
		"mtime": "2026-10-21T07:17:51.109Z",
		"size": 3124,
		"path": "../public/room-assets/premium-gifts/150/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"c98-CvrPMiuLCKdTC2DHdYXHMNnt7uI\"",
		"mtime": "2026-10-21T07:17:51.109Z",
		"size": 3224,
		"path": "../public/room-assets/premium-gifts/150/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"126e-0Dsha7y3A2BPNE8SZ0PZcVH8Kyg\"",
		"mtime": "2026-10-21T07:17:51.109Z",
		"size": 4718,
		"path": "../public/room-assets/premium-gifts/150/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"cb8-nENgVLWJdXt3PDn+3zZjv/YRbfA\"",
		"mtime": "2026-10-21T07:17:51.109Z",
		"size": 3256,
		"path": "../public/room-assets/premium-gifts/150/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"cd8-B2JgFD4XlWjEEmAKnRzR/lHHxak\"",
		"mtime": "2026-10-21T07:17:51.109Z",
		"size": 3288,
		"path": "../public/room-assets/premium-gifts/150/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"b16-vPajM17ndWY/6baS5VhuXgWD5DQ\"",
		"mtime": "2026-10-21T07:17:51.109Z",
		"size": 2838,
		"path": "../public/room-assets/premium-gifts/150/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"c1e-2cG1vxKzAgEg6stUqlTJQkwWVj0\"",
		"mtime": "2026-10-21T07:17:51.113Z",
		"size": 3102,
		"path": "../public/room-assets/premium-gifts/150/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"c76-jPbWQFbTBC6soTcs/wxwHKT0ewY\"",
		"mtime": "2026-10-21T07:17:51.113Z",
		"size": 3190,
		"path": "../public/room-assets/premium-gifts/150/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"cac-twGjoaoM3tMYaVT9JMdRoMt5InE\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 3244,
		"path": "../public/room-assets/premium-gifts/150/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"c30-EjGWDWIZpR0LdrjUc/llYtcKu7Y\"",
		"mtime": "2026-10-21T07:17:51.113Z",
		"size": 3120,
		"path": "../public/room-assets/premium-gifts/150/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"b12-9ucZtfwso3QnJVXZxPi3rT8Dh9g\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 2834,
		"path": "../public/room-assets/premium-gifts/150/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"dfa-xmNzyhLp0M5XcLlHMCJsXxtcnCw\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 3578,
		"path": "../public/room-assets/premium-gifts/150/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"cc8-KMQ2kxVe3yEieDP4YG/9PtmLhjk\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 3272,
		"path": "../public/room-assets/premium-gifts/150/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"c10-p0NP3H8xauaYj/Imc15M85eUdcY\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 3088,
		"path": "../public/room-assets/premium-gifts/150/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/150/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"ef0-KCp6qQ9kVA83VNfWLSBF5+YV/XI\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 3824,
		"path": "../public/room-assets/premium-gifts/150/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"89e-yaejjDe2suoxKvhhjin/pGDAbQ0\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 2206,
		"path": "../public/room-assets/premium-gifts/150/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"828-S1e8H1kfpb5v3SQhZWUxUigq+m4\"",
		"mtime": "2026-10-21T07:17:51.117Z",
		"size": 2088,
		"path": "../public/room-assets/premium-gifts/150/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"810-yoqhv35ca7jhd9mUbpJu9U4vFIQ\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 2064,
		"path": "../public/room-assets/premium-gifts/150/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"8cc-wxyFI2R9e4qQTD0318ICqHzYAoo\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 2252,
		"path": "../public/room-assets/premium-gifts/150/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"8c4-ELSvw0+kF7RsTL4TuSitRvdcwEk\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 2244,
		"path": "../public/room-assets/premium-gifts/150/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"1268-zVoJLln0gi5Rz/Ev5KJENuOh96w\"",
		"mtime": "2026-10-21T07:17:51.125Z",
		"size": 4712,
		"path": "../public/room-assets/premium-gifts/150/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"c56-jqrJbU4qaBKsz9s8kKgd7AsQZKU\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 3158,
		"path": "../public/room-assets/premium-gifts/150/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"c7c-0+VhRN+mvrjnYyDB1TLbpOjJWz8\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 3196,
		"path": "../public/room-assets/premium-gifts/150/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"c96-OhTeWMvez7N11i+GKD36o372tlg\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 3222,
		"path": "../public/room-assets/premium-gifts/150/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/150/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"c26-RlAPUOs8ztPA/eU+RbwvwoVwCwU\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 3110,
		"path": "../public/room-assets/premium-gifts/150/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"8da-zaKg/VGdMJ4KVl0rTFL7ESne3rg\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 2266,
		"path": "../public/room-assets/premium-gifts/150/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"842-9r/OFUnRieVnw/UI0GM/mVI3G2A\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 2114,
		"path": "../public/room-assets/premium-gifts/150/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"82c-r+7BtCshdiffTuFxlhTNeDveekI\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 2092,
		"path": "../public/room-assets/premium-gifts/150/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"8e6-UhV9D+Cd/AxL9I24G3okscJ4D98\"",
		"mtime": "2026-10-21T07:17:51.121Z",
		"size": 2278,
		"path": "../public/room-assets/premium-gifts/150/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"8f0-RrHIf0dCL+AprEfqEHGGDpziXtM\"",
		"mtime": "2026-10-21T07:17:51.125Z",
		"size": 2288,
		"path": "../public/room-assets/premium-gifts/150/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"eba-CXz2F6wadAIApgzYO7fBxgBQJ6A\"",
		"mtime": "2026-10-21T07:17:51.125Z",
		"size": 3770,
		"path": "../public/room-assets/premium-gifts/150/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"ca2-RZYmuInWfZOsXTTNqmhXtZzLHbY\"",
		"mtime": "2026-10-21T07:17:51.125Z",
		"size": 3234,
		"path": "../public/room-assets/premium-gifts/150/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"cb8-wpt6PTy3ULuTqRacDv/YSuCu9Rs\"",
		"mtime": "2026-10-21T07:17:51.125Z",
		"size": 3256,
		"path": "../public/room-assets/premium-gifts/150/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"c74-V2+QG6Y7D0uw+Pirvz2nj2OR3Fs\"",
		"mtime": "2026-10-21T07:17:51.125Z",
		"size": 3188,
		"path": "../public/room-assets/premium-gifts/150/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/150/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"ea0-9g9rsgmhC/asktsC5DcjW/EeKVs\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 3744,
		"path": "../public/room-assets/premium-gifts/150/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"8c0-LgvjGfsW7JTqZdI1xE/+bsbB5tU\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 2240,
		"path": "../public/room-assets/premium-gifts/150/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"86a-614CZb8bEmu8tQzo6E64YEkyEqU\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 2154,
		"path": "../public/room-assets/premium-gifts/150/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"8a2-X5tZ6uyHzoV2SwkD/vgtLz1o5uk\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 2210,
		"path": "../public/room-assets/premium-gifts/150/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"8f4-+PmyZ5mjf8VTXNrVBhCkwSecNHA\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 2292,
		"path": "../public/room-assets/premium-gifts/150/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"900-RpPKzQNT4WNuwN3gqcrAis/8X9o\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 2304,
		"path": "../public/room-assets/premium-gifts/150/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"f0e-S32aZCjFsmP359Z8Y5EuWFklufw\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 3854,
		"path": "../public/room-assets/premium-gifts/150/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"d70-9/E859GFLbHO2ZAAh2vtV5Bzfqk\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 3440,
		"path": "../public/room-assets/premium-gifts/150/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"d88-Ks8VYumC3vERvF2PjE4+kTy2paQ\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 3464,
		"path": "../public/room-assets/premium-gifts/150/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"d74-O386H0IM5eqSmVy65uIo9hyHcyI\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 3444,
		"path": "../public/room-assets/premium-gifts/150/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/150/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"ce4-UL7nwE+eNcXT4dMsAHhDGznjzdQ\"",
		"mtime": "2026-10-21T07:17:51.165Z",
		"size": 3300,
		"path": "../public/room-assets/premium-gifts/150/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/150/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"8b4-+ukdvuHM0PeuHC6OhrsBLhR81ts\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2228,
		"path": "../public/room-assets/premium-gifts/150/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"84e-ygMVl2lYUNtC59mC4yBG6rQDfSw\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2126,
		"path": "../public/room-assets/premium-gifts/150/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"854-S3sGrUj/5sASfYqIcfDXIlw29ng\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2132,
		"path": "../public/room-assets/premium-gifts/150/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"8f4-OL7Cc3PF+XiaZi/Q8sMBIt4B4gk\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 2292,
		"path": "../public/room-assets/premium-gifts/150/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/150/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"8f0-uLIy2qgdFeyUIcD0hKIIeXptCU8\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2288,
		"path": "../public/room-assets/premium-gifts/150/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"d9a-BqWJhDmeSja81Ul64EwUbFu6cjk\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 3482,
		"path": "../public/room-assets/premium-gifts/150/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/150/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"85c-YuFcO6p5CBG07SpmRoomhhtOFho\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2140,
		"path": "../public/room-assets/premium-gifts/150/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"812-Lb4NZeDDYAqVM0J95nvjJry5IXk\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2066,
		"path": "../public/room-assets/premium-gifts/150/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"824-t3JiW71rplBYcAHyyLgnMMd/O6I\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2084,
		"path": "../public/room-assets/premium-gifts/150/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"8a4-OGsUMLTLbN/OVGmrn2UZotsT8dY\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 2212,
		"path": "../public/room-assets/premium-gifts/150/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/150/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"8c2-+mSdL3kL9QvZxz5/NRFmpsF1Lro\"",
		"mtime": "2026-10-21T07:17:51.169Z",
		"size": 2242,
		"path": "../public/room-assets/premium-gifts/150/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"a42-YrvOjOSmUyp7h82bYZ8MeLLSa3U\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 2626,
		"path": "../public/room-assets/premium-gifts/150/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/150/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"77c-qRmUz7IsbW7GvZYW9o4GL62sfdM\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 1916,
		"path": "../public/room-assets/premium-gifts/150/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"748-5gdBssZ7IZANx29moS5okzJGJr8\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 1864,
		"path": "../public/room-assets/premium-gifts/150/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"718-2sBi2xiSfrE6urDgZtfe2dli56U\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 1816,
		"path": "../public/room-assets/premium-gifts/150/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"770-wz3sFBx9gTqpYMyxfKOZ6kwSpGo\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 1904,
		"path": "../public/room-assets/premium-gifts/150/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/150/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"7a6-gLmGUeEYaGyejDSStCb5W9aKrNA\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 1958,
		"path": "../public/room-assets/premium-gifts/150/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/150/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"cf8-ugyxNcKPzWSEqa5S1cUBVkc6Fk0\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 3320,
		"path": "../public/room-assets/premium-gifts/150/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/150/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"d00-IfE0qBaVpsq/RAlJT+QEjtp47vY\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 3328,
		"path": "../public/room-assets/premium-gifts/150/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/150/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"ce4-RuME9g2SeG5CmFhY41A846nsfjo\"",
		"mtime": "2026-10-21T07:17:51.173Z",
		"size": 3300,
		"path": "../public/room-assets/premium-gifts/150/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/150/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"d0c-dGvu6aH0LbgzBQNl9v/tuK/UyU8\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 3340,
		"path": "../public/room-assets/premium-gifts/150/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"71a-sFSiIX1NlFDNHu93wXT9EvmrIoM\"",
		"mtime": "2026-10-21T07:17:49.929Z",
		"size": 1818,
		"path": "../public/room-assets/premium-gifts/180/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"a16-Mv7Qc5e7Z83RLbI5W/AzRhx2CRM\"",
		"mtime": "2026-10-21T07:17:50.861Z",
		"size": 2582,
		"path": "../public/room-assets/premium-gifts/180/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"af0-Vy7ioScHmy0fqJUxCB0JIzbo1Pc\"",
		"mtime": "2026-10-21T07:17:50.865Z",
		"size": 2800,
		"path": "../public/room-assets/premium-gifts/180/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"9c4-z6cdO7MN7DIZpNWI9aOO0nPO8pQ\"",
		"mtime": "2026-10-21T07:17:50.865Z",
		"size": 2500,
		"path": "../public/room-assets/premium-gifts/180/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"960-o5EyqKjUOK1+84uA12dvOgFMCKk\"",
		"mtime": "2026-10-21T07:17:50.865Z",
		"size": 2400,
		"path": "../public/room-assets/premium-gifts/180/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"da0-d0Xy4fUndyJIc6m2r/le0xdgia4\"",
		"mtime": "2026-10-21T07:17:50.861Z",
		"size": 3488,
		"path": "../public/room-assets/premium-gifts/180/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"9b4-y7WeV2NUrpVQiWh93Evhex/ba2M\"",
		"mtime": "2026-10-21T07:17:50.861Z",
		"size": 2484,
		"path": "../public/room-assets/premium-gifts/180/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"996-0iQrXuhZ2y6rR9m7VkhVxH5JfHE\"",
		"mtime": "2026-10-21T07:17:50.869Z",
		"size": 2454,
		"path": "../public/room-assets/premium-gifts/180/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"eca-uHJpB5QMIl6gAMurwZ2aP17cQlw\"",
		"mtime": "2026-10-21T07:17:50.865Z",
		"size": 3786,
		"path": "../public/room-assets/premium-gifts/180/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"776-5KcLBjaGSOe/qq3G3XoF1cMsrHU\"",
		"mtime": "2026-10-21T07:17:50.865Z",
		"size": 1910,
		"path": "../public/room-assets/premium-gifts/180/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"776-5KcLBjaGSOe/qq3G3XoF1cMsrHU\"",
		"mtime": "2026-10-21T07:17:50.865Z",
		"size": 1910,
		"path": "../public/room-assets/premium-gifts/180/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"776-5KcLBjaGSOe/qq3G3XoF1cMsrHU\"",
		"mtime": "2026-10-21T07:17:50.869Z",
		"size": 1910,
		"path": "../public/room-assets/premium-gifts/180/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"7ae-3Z6XqbJHymBDyYTbb1EAXl7G5Yw\"",
		"mtime": "2026-10-21T07:17:50.869Z",
		"size": 1966,
		"path": "../public/room-assets/premium-gifts/180/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"86c-XT9EVGvny3Fr7Ps8gYaBX+XqJB4\"",
		"mtime": "2026-10-21T07:17:50.869Z",
		"size": 2156,
		"path": "../public/room-assets/premium-gifts/180/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"7d4-DqmlhcdclV7eBp5h3KSTsqvMyaE\"",
		"mtime": "2026-10-21T07:17:50.869Z",
		"size": 2004,
		"path": "../public/room-assets/premium-gifts/180/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"794-1OnjIchMeLtWQmjI6QuRzXwttIQ\"",
		"mtime": "2026-10-21T07:17:50.869Z",
		"size": 1940,
		"path": "../public/room-assets/premium-gifts/180/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"a60-DfFABl7XCjaOfTDoFF5YbubRngQ\"",
		"mtime": "2026-10-21T07:17:50.869Z",
		"size": 2656,
		"path": "../public/room-assets/premium-gifts/180/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"928-aCDnZA7mYaIT9KNHGg7PeW8np1Y\"",
		"mtime": "2026-10-21T07:17:50.873Z",
		"size": 2344,
		"path": "../public/room-assets/premium-gifts/180/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/180/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"9bc-XrDXoPe/BqVGfAXoAJ3hImqfvAE\"",
		"mtime": "2026-10-21T07:17:50.873Z",
		"size": 2492,
		"path": "../public/room-assets/premium-gifts/180/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"ae6-UTDRmQL2hoLhm0KSxHFTgkUmzB4\"",
		"mtime": "2026-10-21T07:17:50.873Z",
		"size": 2790,
		"path": "../public/room-assets/premium-gifts/180/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"ae6-UTDRmQL2hoLhm0KSxHFTgkUmzB4\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 2790,
		"path": "../public/room-assets/premium-gifts/180/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"ae6-UTDRmQL2hoLhm0KSxHFTgkUmzB4\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 2790,
		"path": "../public/room-assets/premium-gifts/180/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"11a2-PezDeTngttW0J3dLLLc8rcDzeEc\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 4514,
		"path": "../public/room-assets/premium-gifts/180/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"d68-NuxwlcqdkaqLIcVizGWcsQkPTtM\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 3432,
		"path": "../public/room-assets/premium-gifts/180/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"a9e-XG7ATOEUyzkL1pFJRQrgz3yEvew\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 2718,
		"path": "../public/room-assets/premium-gifts/180/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"c80-dvnmg6AK+6pCtus0/87XlJB4G3E\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 3200,
		"path": "../public/room-assets/premium-gifts/180/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"88e-ZMu+CAUtk6lmGQxmSAs1fNNZOzg\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 2190,
		"path": "../public/room-assets/premium-gifts/180/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"7e4-TFrNAwRYUn0eppB/0JfoyWhMu+4\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 2020,
		"path": "../public/room-assets/premium-gifts/180/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"dbc-iuN9Av3MSOXtxrD6hSpX1AZbUuc\"",
		"mtime": "2026-10-21T07:17:50.941Z",
		"size": 3516,
		"path": "../public/room-assets/premium-gifts/180/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"e2a-KFCLQIqBNAogn9lsxXbUyiLcgYw\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 3626,
		"path": "../public/room-assets/premium-gifts/180/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"850-nOrlIgFrhrWewCr0ybNYu96QoVM\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 2128,
		"path": "../public/room-assets/premium-gifts/180/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"826-zCyzF/kzAnx6MusrOjZ86li1P0s\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 2086,
		"path": "../public/room-assets/premium-gifts/180/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"d66-7G/pdQd9t13v3mbgWBxLLt2YdEk\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 3430,
		"path": "../public/room-assets/premium-gifts/180/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"e42-UmcAMAFED1sRaiuTsYYFcSgK408\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 3650,
		"path": "../public/room-assets/premium-gifts/180/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"a18-Fa4CSK7KcuVq6SHHkmfUjatsy8w\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 2584,
		"path": "../public/room-assets/premium-gifts/180/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"8ba-EfnI1GDQxbw9NlkDhD7x4Bc9AfU\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 2234,
		"path": "../public/room-assets/premium-gifts/180/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"c36-En4RkV+2CF+JZIjdOkghQwk+79M\"",
		"mtime": "2026-10-21T07:17:50.949Z",
		"size": 3126,
		"path": "../public/room-assets/premium-gifts/180/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"962-L25dPKq2lWdCWJ7atVgUWmYrqv8\"",
		"mtime": "2026-10-21T07:17:50.945Z",
		"size": 2402,
		"path": "../public/room-assets/premium-gifts/180/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"764-3hEOz6ydj2CIkdNHButA19XogPQ\"",
		"mtime": "2026-10-21T07:17:50.949Z",
		"size": 1892,
		"path": "../public/room-assets/premium-gifts/180/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"58e-a8Ck5ALE8Q26emkpZItD6MhP+m8\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 1422,
		"path": "../public/room-assets/premium-gifts/180/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"7e6-iVx5jNnNkRg0p0w8CP4+CpLCccY\"",
		"mtime": "2026-10-21T07:17:50.949Z",
		"size": 2022,
		"path": "../public/room-assets/premium-gifts/180/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"84e-1veobrmCtzYS+rYeFd/Hh/OrjIk\"",
		"mtime": "2026-10-21T07:17:50.949Z",
		"size": 2126,
		"path": "../public/room-assets/premium-gifts/180/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"7b4-JThgexXrSMwHgtrP7t7D8XuXftA\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 1972,
		"path": "../public/room-assets/premium-gifts/180/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"64e-YCr+1i7EvypSgrYloSWj4IrEI3o\"",
		"mtime": "2026-10-21T07:17:50.949Z",
		"size": 1614,
		"path": "../public/room-assets/premium-gifts/180/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"786-rJkQWDEWS1Yfw8viz4niR5TYVH0\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 1926,
		"path": "../public/room-assets/premium-gifts/180/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"a30-nIz7w8bGlr3j3e5k2V266hjTo0Q\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 2608,
		"path": "../public/room-assets/premium-gifts/180/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"a30-nIz7w8bGlr3j3e5k2V266hjTo0Q\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 2608,
		"path": "../public/room-assets/premium-gifts/180/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"7be-FWZWLR4n6uhLscM/xnwVzO+8ceU\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 1982,
		"path": "../public/room-assets/premium-gifts/180/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"7c4-jBLLzM62Qno9dXjp/bRkRDCpDkU\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 1988,
		"path": "../public/room-assets/premium-gifts/180/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"80c-IImnmsJsCkn66x9lTqTcFjtpk2E\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 2060,
		"path": "../public/room-assets/premium-gifts/180/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"686-QwJXrVQtIm+pVCzwwRy+8EAorBI\"",
		"mtime": "2026-10-21T07:17:50.953Z",
		"size": 1670,
		"path": "../public/room-assets/premium-gifts/180/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"6a0-zolUQ3AHBFWq8D55iRb5g9op9Yg\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 1696,
		"path": "../public/room-assets/premium-gifts/180/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"696-KEoala5nFy8BEMagRl9HDIUT7lc\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 1686,
		"path": "../public/room-assets/premium-gifts/180/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"b64-tiG5QvgaJ5IyHnMZDCRRIrpbm5k\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 2916,
		"path": "../public/room-assets/premium-gifts/180/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"b0c-UyND7smm5RnBgxsOOTWewXmzVUw\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 2828,
		"path": "../public/room-assets/premium-gifts/180/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"b7c-MbukYM9qnQufvTZHzxYwUIaVD2k\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 2940,
		"path": "../public/room-assets/premium-gifts/180/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"b3c-2z3JWNfw1r4uRR63RXn83DfNMNg\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 2876,
		"path": "../public/room-assets/premium-gifts/180/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"9d0-L+QfS2Cjc6/86tM6+E7oCfX88rc\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 2512,
		"path": "../public/room-assets/premium-gifts/180/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"b20-sTV5UWjXt6sExgemCSzaPkIc+a8\"",
		"mtime": "2026-10-21T07:17:50.957Z",
		"size": 2848,
		"path": "../public/room-assets/premium-gifts/180/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"994-ImdcNhQbs2LvXjKs1Cws77Bgqws\"",
		"mtime": "2026-10-21T07:17:50.961Z",
		"size": 2452,
		"path": "../public/room-assets/premium-gifts/180/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"a10-v0joxjbzwuI5OWhv8KduFDa3lpU\"",
		"mtime": "2026-10-21T07:17:50.961Z",
		"size": 2576,
		"path": "../public/room-assets/premium-gifts/180/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"8cc-m09dE2031NRTeZvqAuYoG0WXl/k\"",
		"mtime": "2026-10-21T07:17:50.961Z",
		"size": 2252,
		"path": "../public/room-assets/premium-gifts/180/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"aac-fmPq04LDyctPfbbS0ajkXzpq2d8\"",
		"mtime": "2026-10-21T07:17:50.961Z",
		"size": 2732,
		"path": "../public/room-assets/premium-gifts/180/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"afa-RwXv0SXxOKGQ+oN9mFHs5qRwKJ0\"",
		"mtime": "2026-10-21T07:17:50.961Z",
		"size": 2810,
		"path": "../public/room-assets/premium-gifts/180/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"b34-jyYN7yuvBzv4zTanM8vFzhEraio\"",
		"mtime": "2026-10-21T07:17:50.965Z",
		"size": 2868,
		"path": "../public/room-assets/premium-gifts/180/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"9c0-WFd6MUXR0i32EuY/c3j4dm9BjXY\"",
		"mtime": "2026-10-21T07:17:50.965Z",
		"size": 2496,
		"path": "../public/room-assets/premium-gifts/180/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"9b6-uXBzFxvmcXAv0UpHsEDZxM3fhz0\"",
		"mtime": "2026-10-21T07:17:50.965Z",
		"size": 2486,
		"path": "../public/room-assets/premium-gifts/180/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"b68-tARrWGsfBcS076RO+NmjUjMwgnw\"",
		"mtime": "2026-10-21T07:17:50.965Z",
		"size": 2920,
		"path": "../public/room-assets/premium-gifts/180/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"be4-NAHb8yWZr7Lda/1s3lE6TrNIZBc\"",
		"mtime": "2026-10-21T07:17:50.965Z",
		"size": 3044,
		"path": "../public/room-assets/premium-gifts/180/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"d32-KU8Mvs692vHQhzWOEJ+HB9PyGXQ\"",
		"mtime": "2026-10-21T07:17:50.965Z",
		"size": 3378,
		"path": "../public/room-assets/premium-gifts/180/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"e36-GAykTv7xEfNfeGm6Wc3Jp+51mDY\"",
		"mtime": "2026-10-21T07:17:50.965Z",
		"size": 3638,
		"path": "../public/room-assets/premium-gifts/180/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1862-kt6ZHCICKfj/YuIqC9LIkTy31Yk\"",
		"mtime": "2026-10-21T07:17:50.969Z",
		"size": 6242,
		"path": "../public/room-assets/premium-gifts/180/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"1576-BDJTY5Afg4ZuS751lAoMUq4HYyM\"",
		"mtime": "2026-10-21T07:17:50.969Z",
		"size": 5494,
		"path": "../public/room-assets/premium-gifts/180/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"1040-uHtJqbLduCRvOFn2aEaNsyzpMWg\"",
		"mtime": "2026-10-21T07:17:50.969Z",
		"size": 4160,
		"path": "../public/room-assets/premium-gifts/180/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1104-6jD/Spz+1eWxko7CpbYM/HITuIU\"",
		"mtime": "2026-10-21T07:17:50.969Z",
		"size": 4356,
		"path": "../public/room-assets/premium-gifts/180/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"103e-41n8M59wksdQ+6WDtS+HdE7Omoc\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 4158,
		"path": "../public/room-assets/premium-gifts/180/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"d20-V0J1dPqFDkqvB3OFWXgB/O++IuM\"",
		"mtime": "2026-10-21T07:17:50.969Z",
		"size": 3360,
		"path": "../public/room-assets/premium-gifts/180/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"e38-jfN7AUSydIxqHWvPZ/l3L3ueBnE\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 3640,
		"path": "../public/room-assets/premium-gifts/180/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"11de-xP5gzXLi71B8dZEDgeQCYHEDwb4\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 4574,
		"path": "../public/room-assets/premium-gifts/180/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"e80-BRvEKsJyrZ4yH/cpmwzUf6Jbj6I\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 3712,
		"path": "../public/room-assets/premium-gifts/180/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"12a2-DiOzg8wgmf2Tn7pz9i0x9AL+kaQ\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 4770,
		"path": "../public/room-assets/premium-gifts/180/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"1186-5vXj3r7680wfuW24lyvzgHfQjtk\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 4486,
		"path": "../public/room-assets/premium-gifts/180/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"e34-kCj679VIHgNrREgPiZUFbTg0to4\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 3636,
		"path": "../public/room-assets/premium-gifts/180/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"c9c-r6bQuNTweyiwdn5OlYz+gf2ow40\"",
		"mtime": "2026-10-21T07:17:50.973Z",
		"size": 3228,
		"path": "../public/room-assets/premium-gifts/180/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"e5e-rASLR4jyeAfMKKj6fYptMcQnops\"",
		"mtime": "2026-10-21T07:17:50.977Z",
		"size": 3678,
		"path": "../public/room-assets/premium-gifts/180/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"eac-KhjNBZAxkwf4i4XryZhWvv4gszY\"",
		"mtime": "2026-10-21T07:17:50.977Z",
		"size": 3756,
		"path": "../public/room-assets/premium-gifts/180/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"dfe-wE/gt/yST9En6u4ybnmVGfW0suE\"",
		"mtime": "2026-10-21T07:17:50.977Z",
		"size": 3582,
		"path": "../public/room-assets/premium-gifts/180/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"14c2-lFq8VextnIS3rsOPDA7ES1kWVsI\"",
		"mtime": "2026-10-21T07:17:50.977Z",
		"size": 5314,
		"path": "../public/room-assets/premium-gifts/180/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"eb6-6klPvwHbQ6ACdhjuA5L8UvP97Z0\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 3766,
		"path": "../public/room-assets/premium-gifts/180/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"fb0-88N95Uf468w3ov7dlCaBehpxwrQ\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 4016,
		"path": "../public/room-assets/premium-gifts/180/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"e44-Bbf7dOAhEDxuUUTNnXT4cAFZw1k\"",
		"mtime": "2026-10-21T07:17:50.977Z",
		"size": 3652,
		"path": "../public/room-assets/premium-gifts/180/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"dbc-5vbFN9V5sBvST/P5w6aRGz5vhlM\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 3516,
		"path": "../public/room-assets/premium-gifts/180/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"e2a-VH4dLNF/qu66B1M4KNFwrMn9M0M\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 3626,
		"path": "../public/room-assets/premium-gifts/180/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"1088-208lRgji6qzkAShxaUbV5Cf7BGM\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 4232,
		"path": "../public/room-assets/premium-gifts/180/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"ef4-yuPgPxwwuD3tbm4u4B5T2AZq0Os\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 3828,
		"path": "../public/room-assets/premium-gifts/180/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"10b6-8ZQp97zt47tHta0FhWoJ1CYjS0w\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 4278,
		"path": "../public/room-assets/premium-gifts/180/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"1230-eEAWn0v5MYCv6U/7AGfJ4y9jBmI\"",
		"mtime": "2026-10-21T07:17:50.985Z",
		"size": 4656,
		"path": "../public/room-assets/premium-gifts/180/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"f36-YhOkn4sFjyfDE4savJ3TPYOB7W8\"",
		"mtime": "2026-10-21T07:17:50.981Z",
		"size": 3894,
		"path": "../public/room-assets/premium-gifts/180/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"102e-O4msZdqhGNB/btx1kmE5XZ46Foo\"",
		"mtime": "2026-10-21T07:17:50.985Z",
		"size": 4142,
		"path": "../public/room-assets/premium-gifts/180/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"16e0-YrL6+WeNm/T1waD7w/d4vzSQiHY\"",
		"mtime": "2026-10-21T07:17:50.985Z",
		"size": 5856,
		"path": "../public/room-assets/premium-gifts/180/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"f12-pnwNIorcW+fbnXl9fe0SzmBpId8\"",
		"mtime": "2026-10-21T07:17:50.985Z",
		"size": 3858,
		"path": "../public/room-assets/premium-gifts/180/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"fd6-WQwTeTdYCERLHbuJjIcsn7E55R0\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 4054,
		"path": "../public/room-assets/premium-gifts/180/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"cfc-EiU5xXlvuojmpdNhQfiZsWM+/wk\"",
		"mtime": "2026-10-21T07:17:50.985Z",
		"size": 3324,
		"path": "../public/room-assets/premium-gifts/180/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"e28-JbMBCiQFdmGuzBdZ7CU+ulrqpKY\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 3624,
		"path": "../public/room-assets/premium-gifts/180/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"fa8-1GH1p0DZBFwDYTPbiHbo/Os3knc\"",
		"mtime": "2026-10-21T07:17:50.985Z",
		"size": 4008,
		"path": "../public/room-assets/premium-gifts/180/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"102c-eaQn7DbKjDjYi3H0H2R+DK56+3s\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 4140,
		"path": "../public/room-assets/premium-gifts/180/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"f84-KQ7YFQfwuJj7f1rFMJLg1Bmu3j4\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 3972,
		"path": "../public/room-assets/premium-gifts/180/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"dce-uQFHTspdqCK2xEfZj/QMlmKGxyc\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 3534,
		"path": "../public/room-assets/premium-gifts/180/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"115e-XQEylrYHcqg7H7AVOMAOis3nCKE\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 4446,
		"path": "../public/room-assets/premium-gifts/180/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"f6c-MRtnCXlEnbO7B5+ri+xZGGeIAlE\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 3948,
		"path": "../public/room-assets/premium-gifts/180/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"e36-aZkjeWDZbOBtwHZbxJuGj62o+dw\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 3638,
		"path": "../public/room-assets/premium-gifts/180/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/180/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"12f8-ktNrMnM4JlZ+Zoo7Ytada9gRy4w\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 4856,
		"path": "../public/room-assets/premium-gifts/180/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"ada-/tNrENK059+9KNPKyS/AY/7jHKY\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 2778,
		"path": "../public/room-assets/premium-gifts/180/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"99e-j1cy1fFuBZbKBgckhI9stOiHAfE\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 2462,
		"path": "../public/room-assets/premium-gifts/180/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"9b6-4yLaxaw2VMWgVHif213xr/ne7pI\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 2486,
		"path": "../public/room-assets/premium-gifts/180/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"aac-cSThyxOFL/8kan0W722tr4zGi5U\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 2732,
		"path": "../public/room-assets/premium-gifts/180/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"b32-50fje0f1DAT5xM33Zc1uyVueA+w\"",
		"mtime": "2026-10-21T07:17:50.989Z",
		"size": 2866,
		"path": "../public/room-assets/premium-gifts/180/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"1698-7Q9JFBCD6Sy5Djb2X8I+ynnp9RM\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 5784,
		"path": "../public/room-assets/premium-gifts/180/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"f20-54X168++K0/flhHFl0VAILgjX4c\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 3872,
		"path": "../public/room-assets/premium-gifts/180/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"f64-4oKkdBwQ+xDY7isz3+CiRNYt6hI\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 3940,
		"path": "../public/room-assets/premium-gifts/180/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"101c-clIIZ3jGoyO5qsPhWJn+Rfh5lgs\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 4124,
		"path": "../public/room-assets/premium-gifts/180/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/180/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"f8c-V2C4Vm7irYEh7bsVNW6R3LJ4wLI\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 3980,
		"path": "../public/room-assets/premium-gifts/180/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"aea-5ICOm1lxzYeIFO73kPmDHGJVOH4\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 2794,
		"path": "../public/room-assets/premium-gifts/180/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"9e0-GTvWqy1inTPJcvPPiqDjlcDECmI\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 2528,
		"path": "../public/room-assets/premium-gifts/180/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"9f2-MjH7XbDx67CwTgmDWCBxi4d07OA\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 2546,
		"path": "../public/room-assets/premium-gifts/180/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"ac8-4UaqBDJwYKhw8XbvXr5b/ZNhV0c\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 2760,
		"path": "../public/room-assets/premium-gifts/180/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"b62-mJqTCwfKVZXC+hpPxG+7z6D/dYc\"",
		"mtime": "2026-10-21T07:17:50.993Z",
		"size": 2914,
		"path": "../public/room-assets/premium-gifts/180/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"1204-2OLKPSfxIN5ItepkSkQLqF4RB2Y\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 4612,
		"path": "../public/room-assets/premium-gifts/180/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"fda-G+tKJlS1UyiSWYWBBe7k5UDme5E\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 4058,
		"path": "../public/room-assets/premium-gifts/180/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1050-gOhUZ/T91rUlN2iMzrYJ3TBMSc8\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 4176,
		"path": "../public/room-assets/premium-gifts/180/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"fb2-0XwsaWFCJSr7t1l8CBCM8rD2pIY\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 4018,
		"path": "../public/room-assets/premium-gifts/180/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/180/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"118c-udj5dBKTtn+tqjwtjgh66oeHGXE\"",
		"mtime": "2026-10-21T07:17:51.001Z",
		"size": 4492,
		"path": "../public/room-assets/premium-gifts/180/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"ad4-ow2t7yyEgoy9t2puI/3ZW0Gaqsk\"",
		"mtime": "2026-10-21T07:17:50.997Z",
		"size": 2772,
		"path": "../public/room-assets/premium-gifts/180/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"a02-gOxwR8EKroprsERKFcxhECb4gO0\"",
		"mtime": "2026-10-21T07:17:51.009Z",
		"size": 2562,
		"path": "../public/room-assets/premium-gifts/180/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"a84-AWmxesnzVwWtIB32VmgcirVE6/k\"",
		"mtime": "2026-10-21T07:17:51.009Z",
		"size": 2692,
		"path": "../public/room-assets/premium-gifts/180/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"aee-OSMS7xDn9pHVqFa6msZY0/WDwaQ\"",
		"mtime": "2026-10-21T07:17:51.001Z",
		"size": 2798,
		"path": "../public/room-assets/premium-gifts/180/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"b7c-kv/Hg7wDOTJJhXtLB+a+X+HMmLY\"",
		"mtime": "2026-10-21T07:17:51.001Z",
		"size": 2940,
		"path": "../public/room-assets/premium-gifts/180/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"1298-BG/LI8YqoBX46laUoiE7kpTmjj8\"",
		"mtime": "2026-10-21T07:17:51.001Z",
		"size": 4760,
		"path": "../public/room-assets/premium-gifts/180/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"10ba-AHCF3W+X00G84YmT9KlDo03N1Kk\"",
		"mtime": "2026-10-21T07:17:51.001Z",
		"size": 4282,
		"path": "../public/room-assets/premium-gifts/180/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1128-ISccXJZpxgnIG6Ntf+5ccTneigA\"",
		"mtime": "2026-10-21T07:17:51.005Z",
		"size": 4392,
		"path": "../public/room-assets/premium-gifts/180/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"115c-SDTS3OKSZVcysN2j8PHVcRVWIzs\"",
		"mtime": "2026-10-21T07:17:51.005Z",
		"size": 4444,
		"path": "../public/room-assets/premium-gifts/180/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/180/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"fee-WFcegeRKCEKvboPMe8MsNcxmUlw\"",
		"mtime": "2026-10-21T07:17:51.005Z",
		"size": 4078,
		"path": "../public/room-assets/premium-gifts/180/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/180/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"ae0-0Mll8G0vqp+fl6umP5PPvrAsyu0\"",
		"mtime": "2026-10-21T07:17:51.005Z",
		"size": 2784,
		"path": "../public/room-assets/premium-gifts/180/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"9e8-4/TlmeeOrY/QSU/p9r31gj4/8wo\"",
		"mtime": "2026-10-21T07:17:51.009Z",
		"size": 2536,
		"path": "../public/room-assets/premium-gifts/180/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"a2a-2C6a3bR1UbIhsjKrykFwD4lqXH8\"",
		"mtime": "2026-10-21T07:17:51.009Z",
		"size": 2602,
		"path": "../public/room-assets/premium-gifts/180/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"ac4-gpvR50s8VP3eZcmjY+7SI6mjMq8\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2756,
		"path": "../public/room-assets/premium-gifts/180/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/180/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"b74-nQP1No8hv7SOlBV08kG+SY8QUGA\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2932,
		"path": "../public/room-assets/premium-gifts/180/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"ff0-bADw5D81lMDYgx2z6h0IVwVHvw0\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 4080,
		"path": "../public/room-assets/premium-gifts/180/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/180/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"a56-Q2NKUHs+VIbKOx6HUO2JGQWa1wg\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2646,
		"path": "../public/room-assets/premium-gifts/180/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"976-wtRe6vnnaOlaItjmsr9xG3jyMCE\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2422,
		"path": "../public/room-assets/premium-gifts/180/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"9ca-hqh1mG8T2SyYtNEnrQ42eHsI76k\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2506,
		"path": "../public/room-assets/premium-gifts/180/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"a3a-1Mtnj2syvHNnJp0W7kSNYKKnPNU\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2618,
		"path": "../public/room-assets/premium-gifts/180/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/180/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"b4e-wzFAkYcQYAgwsOywdcy4Wp3i9B0\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2894,
		"path": "../public/room-assets/premium-gifts/180/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"cde-qFSMBXF0UX5UZ8OqkUUBO5Tavlo\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 3294,
		"path": "../public/room-assets/premium-gifts/180/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/180/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"914-WkogsjXBGgDuCYYOox3wSLkW7XM\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2324,
		"path": "../public/room-assets/premium-gifts/180/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"8c6-G+wgvMAYgbiUWAmhbdux71ooy3o\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2246,
		"path": "../public/room-assets/premium-gifts/180/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"87c-9HoiBnbIxx8eGC8tDjC36g3353Y\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2172,
		"path": "../public/room-assets/premium-gifts/180/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"8fa-xH7MFvM+vdqZVhjHgurClWVl9Bo\"",
		"mtime": "2026-10-21T07:17:51.013Z",
		"size": 2298,
		"path": "../public/room-assets/premium-gifts/180/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/180/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"9ba-EsQvzfwRksf2qugt0SaUxlvQp+A\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 2490,
		"path": "../public/room-assets/premium-gifts/180/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/180/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"102a-2ihWHTioQa36KZYFheuKnN+7KaM\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 4138,
		"path": "../public/room-assets/premium-gifts/180/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/180/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"108a-UeN4VvEvL6MaX991fO3eH3re6ug\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 4234,
		"path": "../public/room-assets/premium-gifts/180/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/180/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"107a-J9NRvKO9HysUkGQ4K7nOjeReh3I\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 4218,
		"path": "../public/room-assets/premium-gifts/180/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/180/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"106e-Zc7RDaT9m46SKLUBQO7v01i7RAY\"",
		"mtime": "2026-10-21T07:17:51.017Z",
		"size": 4206,
		"path": "../public/room-assets/premium-gifts/180/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"790-IbJH/4MOpwLokDQoFiLPVG7b4/s\"",
		"mtime": "2026-10-21T07:17:49.949Z",
		"size": 1936,
		"path": "../public/room-assets/premium-gifts/200/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"b3e-FB3pn4EFQS3B7W4VUgaQIQowWRw\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2878,
		"path": "../public/room-assets/premium-gifts/200/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"bd0-oLVMVp4M+sBQFGQipqpKSk38MXc\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 3024,
		"path": "../public/room-assets/premium-gifts/200/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"a1c-E1+7FMXbKGKcoKCXR4wfE3Y2t+Y\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2588,
		"path": "../public/room-assets/premium-gifts/200/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"a78-20H9gLefnzPG/pDZQ2HibwFBcl4\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 2680,
		"path": "../public/room-assets/premium-gifts/200/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"f1a-5TPpbUzGHe22BZP7jze+zPIBz0w\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 3866,
		"path": "../public/room-assets/premium-gifts/200/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"ace-Rt3CzKqdaB9h4Y9PA/f8114XEpc\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2766,
		"path": "../public/room-assets/premium-gifts/200/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"a5e-pqz/mrFFYZO133X0Oz6fKgOK21o\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2654,
		"path": "../public/room-assets/premium-gifts/200/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"1096-Rtd69XYPHmikXiQXrIJ4VLmYc8E\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 4246,
		"path": "../public/room-assets/premium-gifts/200/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"806-qEJokGCblyUh3dhPVaIu2a10ObM\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2054,
		"path": "../public/room-assets/premium-gifts/200/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"806-qEJokGCblyUh3dhPVaIu2a10ObM\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2054,
		"path": "../public/room-assets/premium-gifts/200/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"806-qEJokGCblyUh3dhPVaIu2a10ObM\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2054,
		"path": "../public/room-assets/premium-gifts/200/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"85a-Os2cvMtyiadY4H6g6oRujtSQ4KQ\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2138,
		"path": "../public/room-assets/premium-gifts/200/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"876-o/qs21UZGNxLH9GRawWKw1HyDRg\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2166,
		"path": "../public/room-assets/premium-gifts/200/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"8b0-SofeyBVVvT0vrwLQs2bUHSfAG6g\"",
		"mtime": "2026-10-21T07:17:51.177Z",
		"size": 2224,
		"path": "../public/room-assets/premium-gifts/200/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"81c-BenOVns6A2Lvtq6xVFv+S8AlEVQ\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 2076,
		"path": "../public/room-assets/premium-gifts/200/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"b98-uZS6xkLpEh5gEZUhNo5NQQzLfLU\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 2968,
		"path": "../public/room-assets/premium-gifts/200/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"984-KJdBVFlLay/SC4swY2FUAtpzxmM\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 2436,
		"path": "../public/room-assets/premium-gifts/200/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/200/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"a7c-f/5NrFl2a0J/M3s3THw1GLX1Tog\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 2684,
		"path": "../public/room-assets/premium-gifts/200/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"c16-1VhrqAKOEZwU2ziTmwz/xg3dnbo\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 3094,
		"path": "../public/room-assets/premium-gifts/200/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"c16-1VhrqAKOEZwU2ziTmwz/xg3dnbo\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 3094,
		"path": "../public/room-assets/premium-gifts/200/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"c16-1VhrqAKOEZwU2ziTmwz/xg3dnbo\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 3094,
		"path": "../public/room-assets/premium-gifts/200/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"1316-tHfiDkNM5Lezewd+yjDOFNZVNsg\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 4886,
		"path": "../public/room-assets/premium-gifts/200/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"e96-ll/690BuoyibnfqU7JQemshsGDA\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 3734,
		"path": "../public/room-assets/premium-gifts/200/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"b62-UMbJhzDIWvpd7h6GRI/HfKESa+Q\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 2914,
		"path": "../public/room-assets/premium-gifts/200/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"df2-flsmDzp49/6XZQmzmt+dcUtgz9Q\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 3570,
		"path": "../public/room-assets/premium-gifts/200/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"92c-PPRv3t2IeuMIyCqB6Ls6GC+TSW4\"",
		"mtime": "2026-10-21T07:17:51.181Z",
		"size": 2348,
		"path": "../public/room-assets/premium-gifts/200/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"8fc-cpQ7h5wkkhdgsIuHci+BzLNq794\"",
		"mtime": "2026-10-21T07:17:51.185Z",
		"size": 2300,
		"path": "../public/room-assets/premium-gifts/200/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"e2e-6gw2/l7CxyPjQVaMWDwvuXvAAtk\"",
		"mtime": "2026-10-21T07:17:51.185Z",
		"size": 3630,
		"path": "../public/room-assets/premium-gifts/200/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"1060-J+oT0yZ82JZ1vwNE8iMgyI8262A\"",
		"mtime": "2026-10-21T07:17:51.185Z",
		"size": 4192,
		"path": "../public/room-assets/premium-gifts/200/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"904-py0Y7vHIwtfQAP/ngQ0aCUJym9s\"",
		"mtime": "2026-10-21T07:17:51.185Z",
		"size": 2308,
		"path": "../public/room-assets/premium-gifts/200/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"948-sPuhFo8DRssVlHSJ5FhEOcP3R+I\"",
		"mtime": "2026-10-21T07:17:51.185Z",
		"size": 2376,
		"path": "../public/room-assets/premium-gifts/200/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"ef2-klE/vmWXSNtc4dYRftI3q6STf3k\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 3826,
		"path": "../public/room-assets/premium-gifts/200/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"109c-Ltl5Fbf4khtcA9wHya1U9Etnt1g\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 4252,
		"path": "../public/room-assets/premium-gifts/200/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"b54-4RwHpzUxlWZ89H4jasN0KkczhPo\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2900,
		"path": "../public/room-assets/premium-gifts/200/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"972-KHV+pk83VML1rIClEeCUJ/LOS5I\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2418,
		"path": "../public/room-assets/premium-gifts/200/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"cee-1jLRjaYSsZHfnMKHGIwDxrfs/Cs\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 3310,
		"path": "../public/room-assets/premium-gifts/200/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"a68-TNGH4agXa0pU2IJfXW0+RpFyOE0\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2664,
		"path": "../public/room-assets/premium-gifts/200/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"7b6-PX36Lei5Aj0RAUfChjbTxxpa1FE\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 1974,
		"path": "../public/room-assets/premium-gifts/200/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"60a-o/KA7hQLMzR2ScsSlyHvlJkb8VY\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 1546,
		"path": "../public/room-assets/premium-gifts/200/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"8fc-2mwz634Aw4UjPds1FDj4JVYpCCw\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2300,
		"path": "../public/room-assets/premium-gifts/200/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"910-FLzv4s15ufGGDsCVOSnWysEeV70\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2320,
		"path": "../public/room-assets/premium-gifts/200/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"888-CZnx5mY5B2avfrRiEas8dpGzVmE\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2184,
		"path": "../public/room-assets/premium-gifts/200/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"6d6-svpzd89M43oxCPVYn71olPvvFZk\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 1750,
		"path": "../public/room-assets/premium-gifts/200/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"85a-rz5ecC8j1wTQ4JOm5mTCR53B9kI\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2138,
		"path": "../public/room-assets/premium-gifts/200/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"b18-JpakmpFkx1v0AiyGMWYg5u72oLk\"",
		"mtime": "2026-10-21T07:17:51.189Z",
		"size": 2840,
		"path": "../public/room-assets/premium-gifts/200/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"b18-JpakmpFkx1v0AiyGMWYg5u72oLk\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 2840,
		"path": "../public/room-assets/premium-gifts/200/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"808-JpwHN3biN4dGdJwStRr+CrhU3MI\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 2056,
		"path": "../public/room-assets/premium-gifts/200/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"892-9d/jSEfqixk+x5e95tTKFCWMQQU\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 2194,
		"path": "../public/room-assets/premium-gifts/200/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"8c0-xK1W+3o+4cv54m8m8bgh+HzOySQ\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 2240,
		"path": "../public/room-assets/premium-gifts/200/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"70e-gV9OYDP9KOIG20LBFnhXBbgFctY\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 1806,
		"path": "../public/room-assets/premium-gifts/200/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"70e-0+mifgAnNqnuq/QtuoT6Ixv2Yxk\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 1806,
		"path": "../public/room-assets/premium-gifts/200/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"6fe-vtempWxT1R+w6/k3Atn4tzDPG2k\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 1790,
		"path": "../public/room-assets/premium-gifts/200/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"d28-ABvrJa+OnTjuBI4Q8KP34JmAOl8\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 3368,
		"path": "../public/room-assets/premium-gifts/200/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"bec-vbU4cJZYkU3HPfIQo2APgxBtrYY\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 3052,
		"path": "../public/room-assets/premium-gifts/200/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"d7e-OxO0W9Ynr2onOeSg1os9O4qYF/8\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3454,
		"path": "../public/room-assets/premium-gifts/200/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"c66-Adg3K0/vVUoTtljadN6Dms9Zejk\"",
		"mtime": "2026-10-21T07:17:51.193Z",
		"size": 3174,
		"path": "../public/room-assets/premium-gifts/200/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"bf4-NDKB6nEV9Qhy0hyMfRanNuPLivU\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3060,
		"path": "../public/room-assets/premium-gifts/200/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"cf0-y+mT9qhgx1z1NoXc+g8wq1cu3JQ\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3312,
		"path": "../public/room-assets/premium-gifts/200/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"b22-Z9ZtxgDUB2xVQF0CUCiMhnqk5f0\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 2850,
		"path": "../public/room-assets/premium-gifts/200/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"ba2-fL9+Dtj2w+F+IzeXdVcuoT2w7/Q\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 2978,
		"path": "../public/room-assets/premium-gifts/200/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"9bc-gzRDxH1+srUSyKp0QCBuJkvQNKs\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 2492,
		"path": "../public/room-assets/premium-gifts/200/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"b3e-OeqgapHbr3Deo+lxCWOpZcxwVbE\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 2878,
		"path": "../public/room-assets/premium-gifts/200/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"bdc-+1sKPAAUkoyxm0uyJ20tyiGLCrg\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3036,
		"path": "../public/room-assets/premium-gifts/200/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"c08-R34irWrbM3iXbCawZH5saS/JOx0\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3080,
		"path": "../public/room-assets/premium-gifts/200/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"b9c-bcjK3B/JzDx2q6Yvfoki9rJl+ag\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 2972,
		"path": "../public/room-assets/premium-gifts/200/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"b76-0PzcIjgauTwk10jSTRVltuakxo4\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 2934,
		"path": "../public/room-assets/premium-gifts/200/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"bfa-25ygfDkDEiKNdsr5WmE3z1xovp4\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3066,
		"path": "../public/room-assets/premium-gifts/200/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"d9e-ZWSaliAOlqtU+aklWA3dYlVD89Q\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3486,
		"path": "../public/room-assets/premium-gifts/200/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"f40-WuxOXDJ/+sLxC9UICHwMonLkLno\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 3904,
		"path": "../public/room-assets/premium-gifts/200/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"fee-WkfAFVkSh2oUdxm9zNNejFTEDdM\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 4078,
		"path": "../public/room-assets/premium-gifts/200/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1c2c-iQ98s+324PX8WUbcYhcoTUSMP1Y\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 7212,
		"path": "../public/room-assets/premium-gifts/200/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"1886-mco/TGw1pJbs2f5Bt2LmexLqqGM\"",
		"mtime": "2026-10-21T07:17:51.197Z",
		"size": 6278,
		"path": "../public/room-assets/premium-gifts/200/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"12e0-pa0Meiwi1kilZFVVQNQSQNzUO08\"",
		"mtime": "2026-10-21T07:17:51.201Z",
		"size": 4832,
		"path": "../public/room-assets/premium-gifts/200/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"143a-GrD6/O4vjvyKd5x8IhSil90k5PE\"",
		"mtime": "2026-10-21T07:17:51.201Z",
		"size": 5178,
		"path": "../public/room-assets/premium-gifts/200/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"1282-hhAUFJEXfFpvV6YCnKrnA7ZgA4g\"",
		"mtime": "2026-10-21T07:17:51.201Z",
		"size": 4738,
		"path": "../public/room-assets/premium-gifts/200/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"e38-fkx1cb1c544NrJH6d397qAMMovQ\"",
		"mtime": "2026-10-21T07:17:51.201Z",
		"size": 3640,
		"path": "../public/room-assets/premium-gifts/200/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"fd8-peEqYD4+4QaS7Lych7weI450TYc\"",
		"mtime": "2026-10-21T07:17:51.201Z",
		"size": 4056,
		"path": "../public/room-assets/premium-gifts/200/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"14e4-uDxOdFgaAwPxLTzTjVuDlu6ag5U\"",
		"mtime": "2026-10-21T07:17:51.201Z",
		"size": 5348,
		"path": "../public/room-assets/premium-gifts/200/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1086-Xgpbyz+srrgbsuO7TMphTZfUYi8\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4230,
		"path": "../public/room-assets/premium-gifts/200/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1470-7glRqeYHe4UREY0MvNnGp3fheCk\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 5232,
		"path": "../public/room-assets/premium-gifts/200/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"13ac-By54yPBR0MUAZJWa5l+yn3yfHdc\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 5036,
		"path": "../public/room-assets/premium-gifts/200/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"ffe-8KdnluGU1woRVMlPvv/P22z3qfc\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4094,
		"path": "../public/room-assets/premium-gifts/200/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"dce-R4c8JV2qeQDVA3L51SOW77TiRkM\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 3534,
		"path": "../public/room-assets/premium-gifts/200/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"f80-wQfl/bguPUm3J4hNZ0l8Vrj1e9A\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 3968,
		"path": "../public/room-assets/premium-gifts/200/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"fc0-cZoz4nRM1dgot92qs9LsSJMP7zk\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4032,
		"path": "../public/room-assets/premium-gifts/200/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"102a-iTRUzyaSvY7D2dDXy6IlM5ohkxg\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4138,
		"path": "../public/room-assets/premium-gifts/200/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"1754-2kqFrmjVuv2f4OQvwakUZfXPpco\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 5972,
		"path": "../public/room-assets/premium-gifts/200/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"10ae-oFyQNQY/Wwcu/BsysqUMUM4x2t8\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4270,
		"path": "../public/room-assets/premium-gifts/200/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"11d6-9FVcUJOB7LLs8IXkDKdGqZFRYos\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4566,
		"path": "../public/room-assets/premium-gifts/200/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"fe6-FTG5zawf9V+5QYIqWGYhnvQZUCk\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4070,
		"path": "../public/room-assets/premium-gifts/200/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"f5a-S473Ib+f9nYFdSkc75Evyc0sQRc\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 3930,
		"path": "../public/room-assets/premium-gifts/200/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"102c-SYr42ZYGiMVe9n/qZKBHkKiGdxc\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4140,
		"path": "../public/room-assets/premium-gifts/200/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"1264-wskXbJjvjq7wSo8c+FE2pLkSNxc\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4708,
		"path": "../public/room-assets/premium-gifts/200/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"10ba-vismV7gskz23hh05H6aGq/z5iYE\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4282,
		"path": "../public/room-assets/premium-gifts/200/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"124e-lEwilX9LJphCDOqu59j+v0bwNwM\"",
		"mtime": "2026-10-21T07:17:51.205Z",
		"size": 4686,
		"path": "../public/room-assets/premium-gifts/200/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"1482-WmOkBCbPk0JTzHU/SP7FYn03QRI\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 5250,
		"path": "../public/room-assets/premium-gifts/200/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"10a8-qCHSiBfuPNl2GzUkMXBK7opS4yQ\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4264,
		"path": "../public/room-assets/premium-gifts/200/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"11e8-qHH6rFL/ZIbMatfHoquqLA3CGy0\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4584,
		"path": "../public/room-assets/premium-gifts/200/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"1abc-rhdt0CWrqtSmNm+uY1blNvcNX1g\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 6844,
		"path": "../public/room-assets/premium-gifts/200/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"113e-cpkn1arfIC/MUR30rqldbWc2KNE\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4414,
		"path": "../public/room-assets/premium-gifts/200/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"1232-ZGL6pJpH1Eqqmz8iC4ipr6Zd5Ws\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4658,
		"path": "../public/room-assets/premium-gifts/200/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"f18-Byxda1YzkEPDv0UMv2PQ8dIpQMU\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 3864,
		"path": "../public/room-assets/premium-gifts/200/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"103a-OTnqXRzj7GJse2WUdD+77CBKW8M\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4154,
		"path": "../public/room-assets/premium-gifts/200/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"11b2-4Zh8zsGuhnO2ts5jqS6VKKczl+w\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4530,
		"path": "../public/room-assets/premium-gifts/200/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"11d0-FLK7/gREIKJ3WnvFUBpzJEg6kug\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4560,
		"path": "../public/room-assets/premium-gifts/200/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"1140-TJjwV7uKc+msChuqMY+BodkWHzQ\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4416,
		"path": "../public/room-assets/premium-gifts/200/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"ebe-G1U09Y1gEk9V9TtauN3VTgWCORM\"",
		"mtime": "2026-10-21T07:17:51.213Z",
		"size": 3774,
		"path": "../public/room-assets/premium-gifts/200/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"13fa-617j6BzI0uQwY/nz410V6KprgMY\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 5114,
		"path": "../public/room-assets/premium-gifts/200/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"11cc-71xLyt/WpOazjwthrS+HeDpcB80\"",
		"mtime": "2026-10-21T07:17:51.209Z",
		"size": 4556,
		"path": "../public/room-assets/premium-gifts/200/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"107a-SXBW05SeAV+VeuYX1gTCG8I7AVo\"",
		"mtime": "2026-10-21T07:17:51.213Z",
		"size": 4218,
		"path": "../public/room-assets/premium-gifts/200/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/200/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"1556-xK+TPywJijHk7w9U1+rfAvsYklE\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 5462,
		"path": "../public/room-assets/premium-gifts/200/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"c28-wkqpfxYvv0gpWzLX55jgmNm2pg0\"",
		"mtime": "2026-10-21T07:17:51.213Z",
		"size": 3112,
		"path": "../public/room-assets/premium-gifts/200/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"ad0-FO0zf9wAJFVA2Nq9IOiNeAbUdyg\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 2768,
		"path": "../public/room-assets/premium-gifts/200/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"a84-x1J+apQzQ5SJLf6yKexWDscshtw\"",
		"mtime": "2026-10-21T07:17:51.213Z",
		"size": 2692,
		"path": "../public/room-assets/premium-gifts/200/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"b16-sjSbaI9KP7HJSmp4FL9xM2OqeZk\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 2838,
		"path": "../public/room-assets/premium-gifts/200/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"c1a-z4lUKUQPEhcO/9RgWLEu1yIcFj4\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 3098,
		"path": "../public/room-assets/premium-gifts/200/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"18f2-2hNRVruWzl4SryZCoigBbugmRcc\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 6386,
		"path": "../public/room-assets/premium-gifts/200/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"110e-Z/N0FB5f5eBrQSx5vX7SZoheN7o\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 4366,
		"path": "../public/room-assets/premium-gifts/200/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1188-rnOQdAyxGNcdXk0qKacbXefSbX4\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 4488,
		"path": "../public/room-assets/premium-gifts/200/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1198-ypdJ+ayWJlosj5jDHmA6zkueJc8\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 4504,
		"path": "../public/room-assets/premium-gifts/200/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/200/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"112c-d8oAbre8whg1JiB27RSOwGyk/S4\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 4396,
		"path": "../public/room-assets/premium-gifts/200/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"c80-ky44hGQDp4WurqqPQ1spt9EnqYM\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 3200,
		"path": "../public/room-assets/premium-gifts/200/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"b26-jkygFfFi+npE2n4Nn9jF+08bwnE\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 2854,
		"path": "../public/room-assets/premium-gifts/200/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"a8c-JpiG/MOaealJuKTxxazFgP92Iws\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 2700,
		"path": "../public/room-assets/premium-gifts/200/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"b5c-j9byYBJIffmPznoIL8rXeYYhV/s\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 2908,
		"path": "../public/room-assets/premium-gifts/200/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"c5a-kL9GjIJaXgDwEA5y2omDk1YdtG8\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 3162,
		"path": "../public/room-assets/premium-gifts/200/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"1440-tvq2ka1Nmvp5vlco9DljfuzbImc\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 5184,
		"path": "../public/room-assets/premium-gifts/200/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"120a-gtHChHI9qBtggeHkmUkXsa2SShk\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 4618,
		"path": "../public/room-assets/premium-gifts/200/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1256-fuUb5ERB39ZEd6aUu/GADu4lEMc\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 4694,
		"path": "../public/room-assets/premium-gifts/200/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"1190-/qgKiwyQK+9TOt/Yc0E6II9sqWY\"",
		"mtime": "2026-10-21T07:17:51.217Z",
		"size": 4496,
		"path": "../public/room-assets/premium-gifts/200/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/200/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"13e6-WwyW11VrSgzbv9DzmdUN8leWMAY\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 5094,
		"path": "../public/room-assets/premium-gifts/200/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"c36-CgiaXLCYliURhBlbCpGrH6EhG4Y\"",
		"mtime": "2026-10-21T07:17:51.821Z",
		"size": 3126,
		"path": "../public/room-assets/premium-gifts/200/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"b2c-NJKl7u9YMG0r5ycPo3EczViyd6g\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 2860,
		"path": "../public/room-assets/premium-gifts/200/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"b50-hUIbkGkBnmQ7rAsmwh7zl+OuL/Y\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 2896,
		"path": "../public/room-assets/premium-gifts/200/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"b3a-YOYVt+ANWKtcqCuC1MR+TgysmWo\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 2874,
		"path": "../public/room-assets/premium-gifts/200/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"c9e-R4kQUn+FZYF2ZX4DQMo7Bmyfe+U\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 3230,
		"path": "../public/room-assets/premium-gifts/200/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"1560-brtwL1r2Q684y4CuUON+ySuTbUE\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 5472,
		"path": "../public/room-assets/premium-gifts/200/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1364-TvkFQSdggrQ1YNkrgewwM9cOztI\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 4964,
		"path": "../public/room-assets/premium-gifts/200/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"137c-g458NR5dKe+Ee6OEnNES8rn0eEg\"",
		"mtime": "2026-10-21T07:17:51.221Z",
		"size": 4988,
		"path": "../public/room-assets/premium-gifts/200/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"135a-q6jHPbhQEFuv0/zclFBfd1XPgZ8\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 4954,
		"path": "../public/room-assets/premium-gifts/200/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/200/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"11fc-Hp80Kg7xuLwPqUMt+wJH2g7LVFs\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 4604,
		"path": "../public/room-assets/premium-gifts/200/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/200/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"c82-HdsvPrCD44OxXT+7aCGucY5wT+w\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 3202,
		"path": "../public/room-assets/premium-gifts/200/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"b1a-h0zCABoDLgq9RWklut4BK7vhEtg\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 2842,
		"path": "../public/room-assets/premium-gifts/200/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"af2-FToSNnkWnjF27S1O8DMdKSvFwug\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 2802,
		"path": "../public/room-assets/premium-gifts/200/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"b2a-Uy8bjQ2Ri0gJqu6lZ7hfAwAcNwE\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 2858,
		"path": "../public/room-assets/premium-gifts/200/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/200/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"c84-yD7l/2zKmVLjvbmQtx18ns6nrUw\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 3204,
		"path": "../public/room-assets/premium-gifts/200/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"1248-Tu5AakqPLBIYYWawjPCwQXDF/R8\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 4680,
		"path": "../public/room-assets/premium-gifts/200/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/200/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"b92-scDo0Lw5E55N1Vws09I6Q9lT8tw\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 2962,
		"path": "../public/room-assets/premium-gifts/200/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"a8c-4RGcEWcbrHcLg+GVMjcEFHam9sA\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 2700,
		"path": "../public/room-assets/premium-gifts/200/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"aae-z2KSBbBd8hD69kzoU93/YxhCISw\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 2734,
		"path": "../public/room-assets/premium-gifts/200/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"a8c-PI311pkUkTd2LiEf2++ixyVcKOc\"",
		"mtime": "2026-10-21T07:17:51.225Z",
		"size": 2700,
		"path": "../public/room-assets/premium-gifts/200/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/200/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"c28-orqa4cFLYN3UgxUc0/Eroqdc/fs\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 3112,
		"path": "../public/room-assets/premium-gifts/200/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"e90-OiMnKjJTu/E5M/Zw/g27pOG/KyY\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 3728,
		"path": "../public/room-assets/premium-gifts/200/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/200/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"a40-Ry1G0Xgq24QWebpEdf0BlGIr35w\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 2624,
		"path": "../public/room-assets/premium-gifts/200/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"9a0-udLvCE1UsRlb75D4sHCo4jGnLDk\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 2464,
		"path": "../public/room-assets/premium-gifts/200/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"916-fz4j0/9dpYrJG1B9EFqckBeiTqU\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 2326,
		"path": "../public/room-assets/premium-gifts/200/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"984-3WWf8hJD40itwkeC7o92L1GiDZE\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 2436,
		"path": "../public/room-assets/premium-gifts/200/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/200/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"a86-c9cGdQ7LOcelNgO6PT3CDUfi29Q\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 2694,
		"path": "../public/room-assets/premium-gifts/200/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/200/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1288-331jfCFZ67WcbURWqeCtnkuYo3Q\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 4744,
		"path": "../public/room-assets/premium-gifts/200/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/200/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"129c-QObfLSUqbzIGsgm88/404pmWT44\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 4764,
		"path": "../public/room-assets/premium-gifts/200/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/200/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"125e-hx2kkuSscMgRR09oGBhgoUw7gsA\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 4702,
		"path": "../public/room-assets/premium-gifts/200/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/200/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"12a4-vPaZtdoMCib4bijxpIHTKBdbb5w\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 4772,
		"path": "../public/room-assets/premium-gifts/200/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"a92-RJrrbo/jqYlf4bEhSWQDeCUgnU8\"",
		"mtime": "2026-10-21T07:17:49.937Z",
		"size": 2706,
		"path": "../public/room-assets/premium-gifts/300/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"fbe-DHmscnQWu/SXEqkxwyxFyxUe5iM\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 4030,
		"path": "../public/room-assets/premium-gifts/300/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"106a-iG48ac5x4sllSU2AiMwKsT162nE\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 4202,
		"path": "../public/room-assets/premium-gifts/300/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"eb6-44scS7XzbSmmWe25oaOgho2Rwq8\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 3766,
		"path": "../public/room-assets/premium-gifts/300/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"eee-NmmFV+rGJBo6aYCPABfAF0+6FL4\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 3822,
		"path": "../public/room-assets/premium-gifts/300/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"15fe-yvfpuaXUO6yEddtUgsQ9Y2Jjd/s\"",
		"mtime": "2026-10-21T07:17:51.229Z",
		"size": 5630,
		"path": "../public/room-assets/premium-gifts/300/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"e64-WAT4bWSsTV7Algszj48Hn8UvUjY\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 3684,
		"path": "../public/room-assets/premium-gifts/300/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"e52-L+QCKD+VG5cNj/C+r/ikELlPiIA\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 3666,
		"path": "../public/room-assets/premium-gifts/300/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"1652-eqCKB8d4d2TE0ek5lE4BX8jF8Xw\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 5714,
		"path": "../public/room-assets/premium-gifts/300/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"afe-CTkWnVzKN04LoVIhsC9fdYuanYI\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 2814,
		"path": "../public/room-assets/premium-gifts/300/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"afe-CTkWnVzKN04LoVIhsC9fdYuanYI\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 2814,
		"path": "../public/room-assets/premium-gifts/300/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"afe-CTkWnVzKN04LoVIhsC9fdYuanYI\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 2814,
		"path": "../public/room-assets/premium-gifts/300/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"a2e-s9QaA9tBad9ceW8Wj385C9cGizk\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 2606,
		"path": "../public/room-assets/premium-gifts/300/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"a70-m/VRA0UHuhnsBZ41+bH0zm5R0Qg\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 2672,
		"path": "../public/room-assets/premium-gifts/300/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"b18-KA/U/iuMOm5ixOZGDUt9LuCfLpA\"",
		"mtime": "2026-10-21T07:17:51.233Z",
		"size": 2840,
		"path": "../public/room-assets/premium-gifts/300/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"b6e-Tfpo/7MHx2/1kAVMUweup7p1l+s\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 2926,
		"path": "../public/room-assets/premium-gifts/300/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"ed2-jICJi6NgsMRs33NhzzkDFX1F1Pw\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 3794,
		"path": "../public/room-assets/premium-gifts/300/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"e04-15chd+2SoUZ9BcsC+zcsZCfTY0A\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 3588,
		"path": "../public/room-assets/premium-gifts/300/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/300/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"df8-b8ooOGLkyFJ7Cr07w08L/xBHR08\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 3576,
		"path": "../public/room-assets/premium-gifts/300/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"10bc-aU7tJ8cdLFvJxU7Rb+V+7N8o1Lw\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 4284,
		"path": "../public/room-assets/premium-gifts/300/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"10bc-aU7tJ8cdLFvJxU7Rb+V+7N8o1Lw\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 4284,
		"path": "../public/room-assets/premium-gifts/300/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"10bc-aU7tJ8cdLFvJxU7Rb+V+7N8o1Lw\"",
		"mtime": "2026-10-21T07:17:51.237Z",
		"size": 4284,
		"path": "../public/room-assets/premium-gifts/300/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"1c48-DOjHewpyrCkMHoCh3Rel0UdD700\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 7240,
		"path": "../public/room-assets/premium-gifts/300/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"174e-lhoPQmeh5M8Tu1fFy4yuzN1/9ps\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 5966,
		"path": "../public/room-assets/premium-gifts/300/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"fce-SS128QoPvgrjmKxhYggWyteb3fs\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 4046,
		"path": "../public/room-assets/premium-gifts/300/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1594-60Uk/M3K0R/AWPmDrMtycrYBlks\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 5524,
		"path": "../public/room-assets/premium-gifts/300/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"d9c-SapT2Qr548vDGGFSAj0qLH1DvEk\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 3484,
		"path": "../public/room-assets/premium-gifts/300/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"d36-NuVlkVlhvQpChhKwnBjmHWlBTZU\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 3382,
		"path": "../public/room-assets/premium-gifts/300/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"16f8-+4WfQCXQeQnj+CdWaz9xp474jWg\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 5880,
		"path": "../public/room-assets/premium-gifts/300/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"1c1a-XfvF/+N+d5t2xE6mxFnJmGRSA5s\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 7194,
		"path": "../public/room-assets/premium-gifts/300/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"bfa-q8ugIFhLP2TiYGCghbL0jPCTiHU\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 3066,
		"path": "../public/room-assets/premium-gifts/300/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"c5c-k+1+J8WsRE437LC6ASr0j0BCe9w\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 3164,
		"path": "../public/room-assets/premium-gifts/300/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"156c-aevOWrTdsclpiBD8AyHjG6pgXrk\"",
		"mtime": "2026-10-21T07:17:51.241Z",
		"size": 5484,
		"path": "../public/room-assets/premium-gifts/300/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"1d20-gq4hAvK4KEhByQgJGiSUWolzB8Q\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 7456,
		"path": "../public/room-assets/premium-gifts/300/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"101c-Tb7PI2sjdlHHQhqmgfQqABX663o\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 4124,
		"path": "../public/room-assets/premium-gifts/300/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"d40-BQuYpzbGPiCWV1VTh3cVMWzefL0\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 3392,
		"path": "../public/room-assets/premium-gifts/300/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"129c-kJ5XEmPahPc2AcGY/QIpNv4vsX0\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 4764,
		"path": "../public/room-assets/premium-gifts/300/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"ea0-t7wiLCBhO1M1wnGbvgB35U2BUIg\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 3744,
		"path": "../public/room-assets/premium-gifts/300/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"b30-2h/3Q0VnUpSIE9BVixhftLJD4F8\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 2864,
		"path": "../public/room-assets/premium-gifts/300/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"83c-x4F5uw0wAJdAy0UH19rnZjiGjZ0\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 2108,
		"path": "../public/room-assets/premium-gifts/300/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"bf6-RG9hiyDndJQIrCGWz5lKKD20uyA\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 3062,
		"path": "../public/room-assets/premium-gifts/300/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"c52-ylH7MCP0CkEfiiz25HPt01ow0xQ\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 3154,
		"path": "../public/room-assets/premium-gifts/300/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"ce2-8TPsk7nFxpahJvLtOhzsDgLugNw\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 3298,
		"path": "../public/room-assets/premium-gifts/300/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"9ec-xTDRO/RjgU6ASgNCpv4F4T6OtBg\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 2540,
		"path": "../public/room-assets/premium-gifts/300/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"b72-JD03HUKUaL4KwclquEEEiXIp3yc\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 2930,
		"path": "../public/room-assets/premium-gifts/300/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"10f4-EOO7FuAUL/+37jVjf0tsiUW58Vc\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 4340,
		"path": "../public/room-assets/premium-gifts/300/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"10f4-EOO7FuAUL/+37jVjf0tsiUW58Vc\"",
		"mtime": "2026-10-21T07:17:51.249Z",
		"size": 4340,
		"path": "../public/room-assets/premium-gifts/300/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"bd6-OjtWW7A7dGJHjRlnC7irCTSztzE\"",
		"mtime": "2026-10-21T07:17:51.245Z",
		"size": 3030,
		"path": "../public/room-assets/premium-gifts/300/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"c68-/aEFsH2oMGUzJEFEwwU7y9hYsfI\"",
		"mtime": "2026-10-21T07:17:51.249Z",
		"size": 3176,
		"path": "../public/room-assets/premium-gifts/300/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"caa-0PvMyFF199OLWhOuHRsb6EMIBZs\"",
		"mtime": "2026-10-21T07:17:51.249Z",
		"size": 3242,
		"path": "../public/room-assets/premium-gifts/300/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"9be-2IvEEMZjW/35dHFqUxpyDZf6TPg\"",
		"mtime": "2026-10-21T07:17:51.249Z",
		"size": 2494,
		"path": "../public/room-assets/premium-gifts/300/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"9e0-9BXDuroaKuRPUznT9XhW+H92Hh8\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 2528,
		"path": "../public/room-assets/premium-gifts/300/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"9c0-lUaCQIgJGhzDqSKsnzeyu2qexAg\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 2496,
		"path": "../public/room-assets/premium-gifts/300/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"ea6-Of77am5xIobTfmwYQ1fEDM31hQw\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 3750,
		"path": "../public/room-assets/premium-gifts/300/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"e34-nus4qwsmmJX+5ZhjWNZiQ3d4UBw\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 3636,
		"path": "../public/room-assets/premium-gifts/300/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"ecc-DUNiZzE6ezCuJbxPUj0Uxbml9Mo\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 3788,
		"path": "../public/room-assets/premium-gifts/300/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"13e4-oEbZTnoiAetkQzSRxaxBLwfL040\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 5092,
		"path": "../public/room-assets/premium-gifts/300/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"132c-uCwg4R6L0xxuQGCZ/KJqDq0pKVw\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 4908,
		"path": "../public/room-assets/premium-gifts/300/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"1604-TzHy4ulENIVRW+WWRlODUpv+aeo\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 5636,
		"path": "../public/room-assets/premium-gifts/300/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"1228-1qNWHS9xFK/iCQl6VbTqBJU9DCI\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 4648,
		"path": "../public/room-assets/premium-gifts/300/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"1386-IMteWEC2oHxxN+qHKggh1aLgJhI\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 4998,
		"path": "../public/room-assets/premium-gifts/300/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"db4-dwZdl23/JPDDeqpRW0LLvuoOskc\"",
		"mtime": "2026-10-21T07:17:51.253Z",
		"size": 3508,
		"path": "../public/room-assets/premium-gifts/300/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"ff2-8ymrTmlbXmA7g8DUQbeHfr7iXmA\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 4082,
		"path": "../public/room-assets/premium-gifts/300/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"f70-NakHPJRyhrW7g1pf4zrPPae1MBU\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 3952,
		"path": "../public/room-assets/premium-gifts/300/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1292-2mKOe37zkr+KrX/9Qb5zQJyO1LA\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 4754,
		"path": "../public/room-assets/premium-gifts/300/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"116a-+U88Pgx+LFi+Z4nzbsiH69gQnR4\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 4458,
		"path": "../public/room-assets/premium-gifts/300/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"122a-sLjpQmqCpTHXmAHUf0NuVxD3C1o\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 4650,
		"path": "../public/room-assets/premium-gifts/300/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1392-L2L8eCoEZ8u/xLUKRtvF72/zfRA\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 5010,
		"path": "../public/room-assets/premium-gifts/300/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"15ee-ChwhipH6Yg0BsH+cpdiEJ3ZzWZI\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 5614,
		"path": "../public/room-assets/premium-gifts/300/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"1934-aC9IP0WjFd7shuA1atrc6xMPGzI\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 6452,
		"path": "../public/room-assets/premium-gifts/300/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"1ae4-q77De5//V9o3abjH9CTAzk3R3ss\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 6884,
		"path": "../public/room-assets/premium-gifts/300/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"3248-mKjWHLMiXNY/D1skFcYbEM07jrg\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 12872,
		"path": "../public/room-assets/premium-gifts/300/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"2a64-ica+rBixs4PzIgKupMsP2ex1mgo\"",
		"mtime": "2026-10-21T07:17:51.257Z",
		"size": 10852,
		"path": "../public/room-assets/premium-gifts/300/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"1fe4-q5WiqLYtvA3t8NMbkzcyUmsZq7g\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 8164,
		"path": "../public/room-assets/premium-gifts/300/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"20ec-9vZDTafP6bKSVSvYqW5BBRAUwg0\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 8428,
		"path": "../public/room-assets/premium-gifts/300/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"1f8e-T6HJR9NjOOObYhg22SLDVoNdStE\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 8078,
		"path": "../public/room-assets/premium-gifts/300/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"1772-o3tvRRySCjDV6UckLLbO2fn7rmY\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 6002,
		"path": "../public/room-assets/premium-gifts/300/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"1b72-UsI/qorE++YVgeWNsmGkgGkq/L8\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 7026,
		"path": "../public/room-assets/premium-gifts/300/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"23ec-mFIWZeNl1fr2UiAvej98/sav1dg\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 9196,
		"path": "../public/room-assets/premium-gifts/300/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1b62-r45kGtk6L1BlLSSu7q041sAa7og\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 7010,
		"path": "../public/room-assets/premium-gifts/300/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"22e0-j5AJ7hIlYVSuQZHwj/YVn0Qz5x0\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 8928,
		"path": "../public/room-assets/premium-gifts/300/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"228a-ezWxf/XZT3mB6wI4fQD9N265Y1o\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 8842,
		"path": "../public/room-assets/premium-gifts/300/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"1916-nRXUv3NK4jO7N+kNluGavTU2Wo0\"",
		"mtime": "2026-10-21T07:17:51.261Z",
		"size": 6422,
		"path": "../public/room-assets/premium-gifts/300/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"150a-+Bdf4JuLs+ozcRNW53qI+j9e45c\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 5386,
		"path": "../public/room-assets/premium-gifts/300/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"177c-OtAPZQEFHxk5Bx4CpRgwZghOQwI\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6012,
		"path": "../public/room-assets/premium-gifts/300/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"1832-jte/emfXp/c5661A9wkBXYPvnYk\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6194,
		"path": "../public/room-assets/premium-gifts/300/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"17ce-vjuyOp40AKYe/jfbyYTeVNuhklg\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6094,
		"path": "../public/room-assets/premium-gifts/300/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"295c-xBHoj89t9vaYYc0J8e4p+1jzXGY\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 10588,
		"path": "../public/room-assets/premium-gifts/300/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"1ab0-Y72t8YfvkM52ABpNwy78Dyl8VQI\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6832,
		"path": "../public/room-assets/premium-gifts/300/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"1af2-Ycs3/POp/0RqFob1XrSlaVV3nrk\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6898,
		"path": "../public/room-assets/premium-gifts/300/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"18f0-NEVXJD/UOmKhQPBKC879yn8v3Po\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6384,
		"path": "../public/room-assets/premium-gifts/300/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"1910-i7Nrc7nB1XIeLzAK4qYyrbSVrXU\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6416,
		"path": "../public/room-assets/premium-gifts/300/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"18d0-fyevmqlFCkbyWqEL/+vAz5YQO+w\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6352,
		"path": "../public/room-assets/premium-gifts/300/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"1ed8-kUpTS45vWW7s24isXAAN0fFe2rE\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 7896,
		"path": "../public/room-assets/premium-gifts/300/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"1a40-C4sefMNXNg5YM9y4HoawFA6oLMQ\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6720,
		"path": "../public/room-assets/premium-gifts/300/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"1dda-hTsbDsHP790zw/k+mGzGRxpZXME\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 7642,
		"path": "../public/room-assets/premium-gifts/300/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"2218-8jFB1krxiRO1j0ZL6ODZWZ9Pi94\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 8728,
		"path": "../public/room-assets/premium-gifts/300/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"1aac-5RK4bwWvQcET3yfmOS+OSP8VUIw\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 6828,
		"path": "../public/room-assets/premium-gifts/300/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"1d14-JyhPpYhqFH+ET3/JBO1kLeJHH/c\"",
		"mtime": "2026-10-21T07:17:51.265Z",
		"size": 7444,
		"path": "../public/room-assets/premium-gifts/300/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"2d38-6oTnMsOfiZkuxTrJHFVgNBbQXfU\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 11576,
		"path": "../public/room-assets/premium-gifts/300/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"1b40-63koPFYKGTYdxwAml13D9px3T9g\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 6976,
		"path": "../public/room-assets/premium-gifts/300/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"1b60-7n3XRVAwlX+T1227SGLS/60ismc\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 7008,
		"path": "../public/room-assets/premium-gifts/300/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"1748-JvCyTRQYyETwrR8Uy8MDKEURQ90\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 5960,
		"path": "../public/room-assets/premium-gifts/300/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"186c-JJTb7fQsmEMYooTqJEnohLwWq90\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 6252,
		"path": "../public/room-assets/premium-gifts/300/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1c4a-Ab2Nnonul62QXe90Mlc9JyxEeuI\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 7242,
		"path": "../public/room-assets/premium-gifts/300/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1ca2-bqwo0nQ49gzODbOLoYb5iCAQxjo\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 7330,
		"path": "../public/room-assets/premium-gifts/300/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"1bb4-KBg/lCRy/cF4tHCGiE43yLG9xwo\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 7092,
		"path": "../public/room-assets/premium-gifts/300/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"1886-PKxR/D/J1PdguFhx6F5M3Weg3bc\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 6278,
		"path": "../public/room-assets/premium-gifts/300/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"1f48-tXyTML6m3ImM49mZMTyx/HpoezU\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 8008,
		"path": "../public/room-assets/premium-gifts/300/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"1b96-AWYO5o7TwynRAQBjnaTR/6SxELU\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 7062,
		"path": "../public/room-assets/premium-gifts/300/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"18a0-tjkTYOUFCm7ZRgbok+GCcUmjbJo\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 6304,
		"path": "../public/room-assets/premium-gifts/300/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/300/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"244e-/T9VvEp5AFzLtrRljgvGo2IPUog\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 9294,
		"path": "../public/room-assets/premium-gifts/300/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1468-LsJ0GSkAPeX3g22KP3JhGUtJAF8\"",
		"mtime": "2026-10-21T07:17:51.277Z",
		"size": 5224,
		"path": "../public/room-assets/premium-gifts/300/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"12a0-isOhZYpXiAoTRKjoJEgtF0QS/ho\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 4768,
		"path": "../public/room-assets/premium-gifts/300/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"11c2-ksRd5dl2dpXQV7Pfu2Zy6KThdKk\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 4546,
		"path": "../public/room-assets/premium-gifts/300/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"134a-r9SpXyz/eO2HHAAVolIxpQ4gwuU\"",
		"mtime": "2026-10-21T07:17:51.277Z",
		"size": 4938,
		"path": "../public/room-assets/premium-gifts/300/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"13dc-+gyqF1f/6tb/t4wVlBbaDvzWyu4\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 5084,
		"path": "../public/room-assets/premium-gifts/300/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"29e2-LRq4dMEvFXhpKa50FPxMbvxyTOo\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 10722,
		"path": "../public/room-assets/premium-gifts/300/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"1b2a-oCrO88Nq0IhtTtzULxCmkczPKf8\"",
		"mtime": "2026-10-21T07:17:51.273Z",
		"size": 6954,
		"path": "../public/room-assets/premium-gifts/300/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1c5c-ybd0vsmQXUUIRNrpvxlZfekAqB8\"",
		"mtime": "2026-10-21T07:17:51.277Z",
		"size": 7260,
		"path": "../public/room-assets/premium-gifts/300/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1c76-attS69l2bvMYUDsnJXQh+tS25FA\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 7286,
		"path": "../public/room-assets/premium-gifts/300/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/300/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"1bc2-SQwcjyHXUe9wpLmiXxGSrCELpUQ\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 7106,
		"path": "../public/room-assets/premium-gifts/300/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"146e-nRiRC4jUNFEzZOLrQSqrOCPEJJU\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 5230,
		"path": "../public/room-assets/premium-gifts/300/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"12f6-YOwDizul06UAAsl9lrxZ11A702E\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 4854,
		"path": "../public/room-assets/premium-gifts/300/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"11d8-dgIL2j01BjWtHgWo8bbHVh1mSko\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 4568,
		"path": "../public/room-assets/premium-gifts/300/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1384-2jMvvQhdAF/qwuxoz24w17JExbc\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 4996,
		"path": "../public/room-assets/premium-gifts/300/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"13f4-a+evstnk251AAdGsFp7uHEMW8WQ\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 5108,
		"path": "../public/room-assets/premium-gifts/300/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"2126-l1Hv4UcaszxY9CtMpnr3rV0UGs8\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 8486,
		"path": "../public/room-assets/premium-gifts/300/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1cc6-GFIoaMMjfsZD5h+F7Bvd2g2KFRI\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 7366,
		"path": "../public/room-assets/premium-gifts/300/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1d3c-I/RJNtk3UoUgQALCAcZ2v97qZqI\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 7484,
		"path": "../public/room-assets/premium-gifts/300/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"1bf8-nr7B37ayYVUZ+5FH9GgmI0ogif4\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 7160,
		"path": "../public/room-assets/premium-gifts/300/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/300/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"215c-lagG9kJmwxB+yqQoYdUt0sPcHCA\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 8540,
		"path": "../public/room-assets/premium-gifts/300/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"149e-D+AU40ZtrKhxT9D3hGUITrCoKXU\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 5278,
		"path": "../public/room-assets/premium-gifts/300/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1372-wwPUBSyWsWFR8EcZCo+M0jFxq6c\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 4978,
		"path": "../public/room-assets/premium-gifts/300/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"1366-yk9WZLlFjQ3FdQ4vn4O/g2n0xxQ\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 4966,
		"path": "../public/room-assets/premium-gifts/300/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1360-6X2i3lhu1eIcqmZ1A+dwWSZX3HU\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 4960,
		"path": "../public/room-assets/premium-gifts/300/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1462-DlqvOsPYxv80IcndnoY5TMktsiY\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 5218,
		"path": "../public/room-assets/premium-gifts/300/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"227c-E4HCjJl2AsHGUudcx8XHr/RpARo\"",
		"mtime": "2026-10-21T07:17:51.313Z",
		"size": 8828,
		"path": "../public/room-assets/premium-gifts/300/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1eca-MtvAJXq/6ZLryVMmU3ZD+VA79fU\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 7882,
		"path": "../public/room-assets/premium-gifts/300/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1eea-DQER8TRNcVvtReEHyH5/ntncxxE\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 7914,
		"path": "../public/room-assets/premium-gifts/300/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"1ec0-BF6W5rno+1c9aQBqU4AGm+58/RY\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 7872,
		"path": "../public/room-assets/premium-gifts/300/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/300/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"1e0a-vI5wvcYd9WGWIv/soKZIrfA1v9Q\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 7690,
		"path": "../public/room-assets/premium-gifts/300/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/300/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"147e-4zqnFoiaIJnY7P8foCqkmrzvu5U\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 5246,
		"path": "../public/room-assets/premium-gifts/300/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"130a-w3cZN67Ay4LB/bahWB6Op3CvGe8\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 4874,
		"path": "../public/room-assets/premium-gifts/300/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"126c-EJjTZu3CHqGw51l0XQ6I/iJ3Cec\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 4716,
		"path": "../public/room-assets/premium-gifts/300/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1390-nWzl+eH7B57dYsPrH+DtYNplzJk\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 5008,
		"path": "../public/room-assets/premium-gifts/300/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/300/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"146c-XVULar5WUEknmWH05r68ZumqUnI\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 5228,
		"path": "../public/room-assets/premium-gifts/300/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"1e10-4+2ggDL5Fu9wC1MUQhNi48h8Zh8\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 7696,
		"path": "../public/room-assets/premium-gifts/300/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/300/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"13d8-r4StEqa9UhGUVq7rPRHyGn0a0n4\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 5080,
		"path": "../public/room-assets/premium-gifts/300/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1254-ZjXHTAbyIy9ZG3zkRyy2+L950SU\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 4692,
		"path": "../public/room-assets/premium-gifts/300/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"11e6-HSJtvSIKiUiJHr74/awB3pI1Iqk\"",
		"mtime": "2026-10-21T07:17:51.317Z",
		"size": 4582,
		"path": "../public/room-assets/premium-gifts/300/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1270-GqsW+5jMnMy8qtWrRbwq9ZV7RyA\"",
		"mtime": "2026-10-21T07:17:51.321Z",
		"size": 4720,
		"path": "../public/room-assets/premium-gifts/300/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/300/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1434-/gpHhZdNpqIANv0amQ/cPrFb3oY\"",
		"mtime": "2026-10-21T07:17:51.321Z",
		"size": 5172,
		"path": "../public/room-assets/premium-gifts/300/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"17b8-awkbEamcOJN+dE0ux9AKsPpHAvk\"",
		"mtime": "2026-10-21T07:17:51.321Z",
		"size": 6072,
		"path": "../public/room-assets/premium-gifts/300/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/300/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"10dc-VtkXFA9+RCUlzvCbMEs9yKvlNYs\"",
		"mtime": "2026-10-21T07:17:51.321Z",
		"size": 4316,
		"path": "../public/room-assets/premium-gifts/300/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"106c-j39CtCYKWYpCEyi8Xnzh1wnwuvw\"",
		"mtime": "2026-10-21T07:17:51.321Z",
		"size": 4204,
		"path": "../public/room-assets/premium-gifts/300/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"f26-Y37k7S2f4ngDs9gdWS19a+i+iXQ\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 3878,
		"path": "../public/room-assets/premium-gifts/300/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"fa4-GIfkFU7fMw4GjoQbHh4JyOM/xsY\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 4004,
		"path": "../public/room-assets/premium-gifts/300/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/300/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"10ca-QdilcPkUk7t76dQNnmJXb8L2E0g\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 4298,
		"path": "../public/room-assets/premium-gifts/300/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/300/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"1d88-cbP1QiMFKJzU9Wf+ohGuH1M9zsg\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 7560,
		"path": "../public/room-assets/premium-gifts/300/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/300/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"1dda-f7ygr3cUpWpTT6FS0hDkTy2Akrs\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 7642,
		"path": "../public/room-assets/premium-gifts/300/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/300/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"1d62-iIg0Y4fmWe+EvbS33RRMOJErTV8\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 7522,
		"path": "../public/room-assets/premium-gifts/300/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/300/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"1df2-LYIhVSd7tNGkchlmld7UdUH8ny8\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 7666,
		"path": "../public/room-assets/premium-gifts/300/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"d4a-0eSEIL9UreooME9aH4kZLCVT6Fk\"",
		"mtime": "2026-10-21T07:17:49.973Z",
		"size": 3402,
		"path": "../public/room-assets/premium-gifts/400/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"14e8-d97t3thMYfit+AooDp5mmvP/L6s\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 5352,
		"path": "../public/room-assets/premium-gifts/400/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"148e-dtyogy0pjJS289KvIvLAjwM1MdU\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 5262,
		"path": "../public/room-assets/premium-gifts/400/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"11fc-XhqNu7V/GmIXiTwjIzLR/yW1TvM\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 4604,
		"path": "../public/room-assets/premium-gifts/400/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"13cc-cDRJhULnwnocS77f6XJJ5rg7uDE\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 5068,
		"path": "../public/room-assets/premium-gifts/400/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1cf2-lfoctnV1Mgk2IJQjLmt7ibvPzhk\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 7410,
		"path": "../public/room-assets/premium-gifts/400/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"128a-GByDSOj+M0VdmUtrL/hLy5bTOqQ\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 4746,
		"path": "../public/room-assets/premium-gifts/400/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"11e8-QBEqe1YAo5Z561p1qTY+nwo3fog\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 4584,
		"path": "../public/room-assets/premium-gifts/400/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"1ec0-xChSNcfS0EYXvLb+m3O/X0pXOCc\"",
		"mtime": "2026-10-21T07:17:51.349Z",
		"size": 7872,
		"path": "../public/room-assets/premium-gifts/400/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"e40-O4jJuhnRdmpV/HYq1gTJl8Mun/0\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 3648,
		"path": "../public/room-assets/premium-gifts/400/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"e40-O4jJuhnRdmpV/HYq1gTJl8Mun/0\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 3648,
		"path": "../public/room-assets/premium-gifts/400/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"e40-O4jJuhnRdmpV/HYq1gTJl8Mun/0\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 3648,
		"path": "../public/room-assets/premium-gifts/400/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"d28-RXkV4wMkwSmJzToA/JY+bYzancY\"",
		"mtime": "2026-10-21T07:17:51.357Z",
		"size": 3368,
		"path": "../public/room-assets/premium-gifts/400/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"d34-LNdsCcFMiJ6MkCJBuCy71ZRJVFw\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 3380,
		"path": "../public/room-assets/premium-gifts/400/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"e26-z1U/ThBs0XjhW7FgxS7F50mWoak\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 3622,
		"path": "../public/room-assets/premium-gifts/400/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"e1a-Nfludsp6zRjbCREx3VIRefkNGAk\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 3610,
		"path": "../public/room-assets/premium-gifts/400/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"13b0-zQ5Go7BhsMLyxmz0/vbKO8Q6L30\"",
		"mtime": "2026-10-21T07:17:51.357Z",
		"size": 5040,
		"path": "../public/room-assets/premium-gifts/400/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"118c-2su3WR5nbtpSsQLkfpTTc3phKXw\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 4492,
		"path": "../public/room-assets/premium-gifts/400/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/400/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"12e8-dWqp/aZtlMFiB47R/iRlr4o/D1w\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 4840,
		"path": "../public/room-assets/premium-gifts/400/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"17c0-ysPXrqbcMUbAiWJ94H7E+S1MUJQ\"",
		"mtime": "2026-10-21T07:17:51.353Z",
		"size": 6080,
		"path": "../public/room-assets/premium-gifts/400/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"17c0-ysPXrqbcMUbAiWJ94H7E+S1MUJQ\"",
		"mtime": "2026-10-21T07:17:51.357Z",
		"size": 6080,
		"path": "../public/room-assets/premium-gifts/400/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"17c0-ysPXrqbcMUbAiWJ94H7E+S1MUJQ\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 6080,
		"path": "../public/room-assets/premium-gifts/400/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"274a-EJy6ias5qqGJ+bjB3RN/AETVoIA\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 10058,
		"path": "../public/room-assets/premium-gifts/400/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"20c8-JhPjE2W1Db0JSE/tT7+YKBQTebQ\"",
		"mtime": "2026-10-21T07:17:51.357Z",
		"size": 8392,
		"path": "../public/room-assets/premium-gifts/400/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"13c8-h1tmHrdYA3cNgaT4hPLSghMzMFU\"",
		"mtime": "2026-10-21T07:17:51.357Z",
		"size": 5064,
		"path": "../public/room-assets/premium-gifts/400/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1c74-sF716+b3GH2ALB9gJEJPQ26IdGI\"",
		"mtime": "2026-10-21T07:17:51.357Z",
		"size": 7284,
		"path": "../public/room-assets/premium-gifts/400/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"113e-rWmS6wWTKLkJNOv+81ANiLgiwik\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 4414,
		"path": "../public/room-assets/premium-gifts/400/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"1342-K7Iajnugmra7iTTK7814LNiHC7k\"",
		"mtime": "2026-10-21T07:17:51.357Z",
		"size": 4930,
		"path": "../public/room-assets/premium-gifts/400/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"1e2e-O9Rzzi9ggnVSiU80wi7IVrSNwhU\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 7726,
		"path": "../public/room-assets/premium-gifts/400/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"28e2-IFyLCrWoHfaXx0WmHaB5w9D7Ytg\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 10466,
		"path": "../public/room-assets/premium-gifts/400/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"fe6-EMv2bULWaEeBmXnguEvGXHcB038\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 4070,
		"path": "../public/room-assets/premium-gifts/400/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"101c-F8worzPpmLbGEJEc5jGarLxgRO8\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 4124,
		"path": "../public/room-assets/premium-gifts/400/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"1c76-TVQI4r1uEgX2yxlfzotZ3EiUO7U\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 7286,
		"path": "../public/room-assets/premium-gifts/400/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"2acc-2vQv8C3BXodINlzfY4EvdZpMLtw\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 10956,
		"path": "../public/room-assets/premium-gifts/400/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"13d8-EU5pkCuW/TB/L5LCeBAfwKJ11MA\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 5080,
		"path": "../public/room-assets/premium-gifts/400/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"116a-9IqT8T3lsShAjOxXV8Lf2z9icTU\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 4458,
		"path": "../public/room-assets/premium-gifts/400/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"1792-7fRoXWFdNPbC4fA4DutAEMrPivw\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 6034,
		"path": "../public/room-assets/premium-gifts/400/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"136e-fiSrdZz073G62J0bpNbyMEy8ESA\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 4974,
		"path": "../public/room-assets/premium-gifts/400/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"e68-qXxW7krecdEbIf0EbGg02V6/BXA\"",
		"mtime": "2026-10-21T07:17:51.377Z",
		"size": 3688,
		"path": "../public/room-assets/premium-gifts/400/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"a46-rI6A36Dz8DHc0MZBoxC/FF9IoPY\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 2630,
		"path": "../public/room-assets/premium-gifts/400/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"fd0-gTK50xw5vbwP7rRVAAdjvyRnLX0\"",
		"mtime": "2026-10-21T07:17:51.377Z",
		"size": 4048,
		"path": "../public/room-assets/premium-gifts/400/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"1008-ZHHUxmOhF9FD0LrOm76OfYnCvrc\"",
		"mtime": "2026-10-21T07:17:51.373Z",
		"size": 4104,
		"path": "../public/room-assets/premium-gifts/400/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"f8c-Jxxi64uPp6SEHqicuMEo1piLkrI\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3980,
		"path": "../public/room-assets/premium-gifts/400/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"c60-U8C9eEqsHrgW2wn55kewvFvEWqQ\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3168,
		"path": "../public/room-assets/premium-gifts/400/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"f10-EfitdK4F/cMuXuIirgE5e/eZQeU\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3856,
		"path": "../public/room-assets/premium-gifts/400/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"17cc-3/YWTddsmdV+Ct7NdHLqVnkhGB0\"",
		"mtime": "2026-10-21T07:17:51.377Z",
		"size": 6092,
		"path": "../public/room-assets/premium-gifts/400/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"17cc-3/YWTddsmdV+Ct7NdHLqVnkhGB0\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 6092,
		"path": "../public/room-assets/premium-gifts/400/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"db8-cQi7AYtoTMh5uFSropD5+C1je54\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3512,
		"path": "../public/room-assets/premium-gifts/400/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"f3c-drnebCef5Shgot6BIPJJA0jhE6c\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3900,
		"path": "../public/room-assets/premium-gifts/400/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"fa6-Xm7EXSSleErq6n7nnqydloO3kkU\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 4006,
		"path": "../public/room-assets/premium-gifts/400/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"c12-WaJwWGNFaBNePyG0qlob1Auv1JQ\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3090,
		"path": "../public/room-assets/premium-gifts/400/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"c74-Mt1bOKHMy2yojbU9+7LBDFbxuhU\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3188,
		"path": "../public/room-assets/premium-gifts/400/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"c36-8CPtz0fjYu2xw7W1FGZ5NOhCqzM\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 3126,
		"path": "../public/room-assets/premium-gifts/400/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"1288-WQV2+pPrpZgipenV8iRq+afZl6o\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 4744,
		"path": "../public/room-assets/premium-gifts/400/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"12fa-R9gr/X1q/Fza7DUT3EwyOHWTS6I\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 4858,
		"path": "../public/room-assets/premium-gifts/400/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"130a-vuT/CSjm3YHVTxVDEi2N4R2S51k\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 4874,
		"path": "../public/room-assets/premium-gifts/400/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"1daa-84TWmx7sYj0JI6s5LE19Cxrc4Ko\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 7594,
		"path": "../public/room-assets/premium-gifts/400/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"1c04-KCrh8blN02pDmLr0HaBO1YHv6hk\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 7172,
		"path": "../public/room-assets/premium-gifts/400/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"1ea8-MyFQ7KuBsydvr/AkjNbkoMoHaNY\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 7848,
		"path": "../public/room-assets/premium-gifts/400/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"1b08-6c2o65qczER/OD9xIt80AR4qYo8\"",
		"mtime": "2026-10-21T07:17:51.385Z",
		"size": 6920,
		"path": "../public/room-assets/premium-gifts/400/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"1bfe-Mkuv0iMqg3Ma8Lq8Nbp96hywa0s\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 7166,
		"path": "../public/room-assets/premium-gifts/400/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"127e-yLfaj0O1RPJ0Nrh84wwZGorCB/Y\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 4734,
		"path": "../public/room-assets/premium-gifts/400/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"15ec-b+Hjuovxi67pwkvfnbeuOi/4kfU\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 5612,
		"path": "../public/room-assets/premium-gifts/400/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"14cc-U3osrZmOzFzlN4Hz2k8KQve9PEw\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 5324,
		"path": "../public/room-assets/premium-gifts/400/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1b4c-o2H1Do61SWWoyeRWqZumXBsrsb8\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 6988,
		"path": "../public/room-assets/premium-gifts/400/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1860-K+FyzifF2efFLrOE7elTX4L+X9k\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 6240,
		"path": "../public/room-assets/premium-gifts/400/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"19be-EOSAFDAWQ8NUgx9AEOQEjl5CALk\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 6590,
		"path": "../public/room-assets/premium-gifts/400/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1b30-SNbNWvcKishBj4SzqBKHb9OJsqw\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 6960,
		"path": "../public/room-assets/premium-gifts/400/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"2004-oRpy4s8sC+I9NQzOjUUlj+Aczu0\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 8196,
		"path": "../public/room-assets/premium-gifts/400/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"24a8-s9a+j+gt9KQtEWLyzlChsbgSGKU\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 9384,
		"path": "../public/room-assets/premium-gifts/400/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"28f4-H7OBVMaSHDc+fw0fhdQXbqxJmeo\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 10484,
		"path": "../public/room-assets/premium-gifts/400/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"48f6-vdvsCZgvj5FpJeevDqMPdCvQxPo\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 18678,
		"path": "../public/room-assets/premium-gifts/400/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"3f84-CsSPcp+px6gdi5lajoEkiiQaHeA\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 16260,
		"path": "../public/room-assets/premium-gifts/400/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"2f80-PzqpU2QWkJCz7PRQjA1MQ1RKAlE\"",
		"mtime": "2026-10-21T07:17:51.389Z",
		"size": 12160,
		"path": "../public/room-assets/premium-gifts/400/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"306a-eF6lCBe0Xk7i+6mvc6PVN1IEmVw\"",
		"mtime": "2026-10-21T07:17:51.397Z",
		"size": 12394,
		"path": "../public/room-assets/premium-gifts/400/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"2e36-XPDEn7uKMLhU0uCSG7rJ3OeR8QA\"",
		"mtime": "2026-10-21T07:17:51.393Z",
		"size": 11830,
		"path": "../public/room-assets/premium-gifts/400/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"209c-eeF8QI3i32pOjPexVp1MSARJ4rU\"",
		"mtime": "2026-10-21T07:17:51.393Z",
		"size": 8348,
		"path": "../public/room-assets/premium-gifts/400/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"2756-PSXIkRIPu3tRLqp5oQKDv7W/oJs\"",
		"mtime": "2026-10-21T07:17:51.393Z",
		"size": 10070,
		"path": "../public/room-assets/premium-gifts/400/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"3458-Le2WN64VG+0Cg/JahoGoWNVCrqw\"",
		"mtime": "2026-10-21T07:17:51.393Z",
		"size": 13400,
		"path": "../public/room-assets/premium-gifts/400/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"2840-5W7Hu9xP6ZPuaKE1UMJQSZuWfaU\"",
		"mtime": "2026-10-21T07:17:51.397Z",
		"size": 10304,
		"path": "../public/room-assets/premium-gifts/400/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"33fc-Zz/JA+Wj2epF+wWG/4HKk8m/o+Q\"",
		"mtime": "2026-10-21T07:17:51.401Z",
		"size": 13308,
		"path": "../public/room-assets/premium-gifts/400/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"3156-lIcBSb815bqBsngtD6A4WK1Q1+E\"",
		"mtime": "2026-10-21T07:17:51.401Z",
		"size": 12630,
		"path": "../public/room-assets/premium-gifts/400/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"2394-xgLTZ/C7A+hQO7HlR2Nk6eitzuk\"",
		"mtime": "2026-10-21T07:17:51.397Z",
		"size": 9108,
		"path": "../public/room-assets/premium-gifts/400/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"1c88-jyEuaHa5RpS4E1Ra+p1o9twEyds\"",
		"mtime": "2026-10-21T07:17:51.401Z",
		"size": 7304,
		"path": "../public/room-assets/premium-gifts/400/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"215e-sRWAlU55r+iq4HXkk4nIwAsKEB0\"",
		"mtime": "2026-10-21T07:17:51.397Z",
		"size": 8542,
		"path": "../public/room-assets/premium-gifts/400/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"21f0-JNf4/WKcJCO+pyrwNZMUlqwhPA8\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 8688,
		"path": "../public/room-assets/premium-gifts/400/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"2122-W+C6o46/dkH3KCMhbdZY2Y1THDI\"",
		"mtime": "2026-10-21T07:17:51.397Z",
		"size": 8482,
		"path": "../public/room-assets/premium-gifts/400/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"3be6-Gc0ut/WT9vgE29Wm8HCQ2fhVgn0\"",
		"mtime": "2026-10-21T07:17:51.401Z",
		"size": 15334,
		"path": "../public/room-assets/premium-gifts/400/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"2624-Q7ZCAoqd0LvA1JTFLfh6Ng9sUw8\"",
		"mtime": "2026-10-21T07:17:51.405Z",
		"size": 9764,
		"path": "../public/room-assets/premium-gifts/400/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"25a6-0+aCc2WD3osqSIQxAAya7GQHRxo\"",
		"mtime": "2026-10-21T07:17:51.401Z",
		"size": 9638,
		"path": "../public/room-assets/premium-gifts/400/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"246c-QoVc3Of2AlPiSEMiNdkMdTaieEw\"",
		"mtime": "2026-10-21T07:17:51.401Z",
		"size": 9324,
		"path": "../public/room-assets/premium-gifts/400/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"238e-9WY11pKWmMcUD1IS8634lMXBH80\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 9102,
		"path": "../public/room-assets/premium-gifts/400/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"233a-PtLW49Qt7WrXtEr9Yq6jkv8Nl00\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 9018,
		"path": "../public/room-assets/premium-gifts/400/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"2a04-QXLC8nfNe7Ox4Ya/2/3zirffeLY\"",
		"mtime": "2026-10-21T07:17:51.405Z",
		"size": 10756,
		"path": "../public/room-assets/premium-gifts/400/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"2536-2AnkGpEL+vSXTlQAmW57VLEUGqw\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 9526,
		"path": "../public/room-assets/premium-gifts/400/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"2aae-I61iGBXMl940y/Q0TsvJ07iUZ7U\"",
		"mtime": "2026-10-21T07:17:51.405Z",
		"size": 10926,
		"path": "../public/room-assets/premium-gifts/400/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"30a4-6rkFdY34BUWajOzfh5J2xk7Go2I\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 12452,
		"path": "../public/room-assets/premium-gifts/400/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"26ec-0MQitB5fAFYwKdKLle5dn/T65tg\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 9964,
		"path": "../public/room-assets/premium-gifts/400/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"29de-uTsxeRu+UqSHiIv6D7YUT4ozHF4\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 10718,
		"path": "../public/room-assets/premium-gifts/400/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"42b6-dvFW7v1YHXQwieLE3kYFtvhwhms\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 17078,
		"path": "../public/room-assets/premium-gifts/400/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"2646-lX7fD8u31Yscm238qMYXCfEmdqk\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 9798,
		"path": "../public/room-assets/premium-gifts/400/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"279c-OEVHvRCJUq5a+YDf4lPKfkVffAU\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 10140,
		"path": "../public/room-assets/premium-gifts/400/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"211c-iwZ6LjlDJ0sOsh2MIInreM2wL4s\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 8476,
		"path": "../public/room-assets/premium-gifts/400/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"227e-mYIk9yIHis4GQjwJgnyBiDAJFa4\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 8830,
		"path": "../public/room-assets/premium-gifts/400/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"29a2-ht94CNKn2MTkbkfc5QKZ6q1zRp0\"",
		"mtime": "2026-10-21T07:17:51.409Z",
		"size": 10658,
		"path": "../public/room-assets/premium-gifts/400/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"2a06-F6BFh0DQDLrx2NIc3rcfhn03uXQ\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 10758,
		"path": "../public/room-assets/premium-gifts/400/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"286a-o9OcoF1JziHhvOWFaaWIzqEIIys\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 10346,
		"path": "../public/room-assets/premium-gifts/400/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"22f4-E5oMSyinJughPqnKZM8klFOhuMs\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 8948,
		"path": "../public/room-assets/premium-gifts/400/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"2cac-wKiSfAPwD+8P8lyudl8VBr0qv0s\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 11436,
		"path": "../public/room-assets/premium-gifts/400/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"265e-nTE+lncaSDGYMVmAvg77gixYiQk\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 9822,
		"path": "../public/room-assets/premium-gifts/400/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"2326-hOZSKLvRaO1cQhehc6IcILyzLYs\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 8998,
		"path": "../public/room-assets/premium-gifts/400/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/400/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"338a-VGhh/K5xoVtSz30UL3kNbZOF/0g\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 13194,
		"path": "../public/room-assets/premium-gifts/400/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1b4e-pXdUf34jnGQPECfK1eH+Pvb/Itw\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 6990,
		"path": "../public/room-assets/premium-gifts/400/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1898-8pzddRcYKn9ZiCCPdHbCt0DrCtM\"",
		"mtime": "2026-10-21T07:17:51.417Z",
		"size": 6296,
		"path": "../public/room-assets/premium-gifts/400/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"178c-77fFk94D9nOoRstwe4IRrqw9jtQ\"",
		"mtime": "2026-10-21T07:17:51.417Z",
		"size": 6028,
		"path": "../public/room-assets/premium-gifts/400/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1aa0-qsh8WXu0XanhIm3txNW+XiekldE\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 6816,
		"path": "../public/room-assets/premium-gifts/400/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1c82-2JxCDrz4V6q4ii4gHagQgUqiVaA\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 7298,
		"path": "../public/room-assets/premium-gifts/400/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"3d3c-ZU2YFWzqAXDxmRdHMQgrucH0gXo\"",
		"mtime": "2026-10-21T07:17:51.425Z",
		"size": 15676,
		"path": "../public/room-assets/premium-gifts/400/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"2644-P864H75Uu1ac8DJ/S5zjh4hesDc\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 9796,
		"path": "../public/room-assets/premium-gifts/400/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"2988-yF5YexWIFjFFPeNSciY0Dv0ZJkA\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 10632,
		"path": "../public/room-assets/premium-gifts/400/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"29fe-Spj+iROBYxk2tVDEx1in+nC7qzE\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 10750,
		"path": "../public/room-assets/premium-gifts/400/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/400/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"2882-Z4FgG/hjldo1Zb4+WZ/RGfhgrLw\"",
		"mtime": "2026-10-21T07:17:51.413Z",
		"size": 10370,
		"path": "../public/room-assets/premium-gifts/400/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1baa-iCqwzQPlBquzi0ldA3/7aw3D3D4\"",
		"mtime": "2026-10-21T07:17:51.441Z",
		"size": 7082,
		"path": "../public/room-assets/premium-gifts/400/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1922-EI6BqUCjLF58Oo5JrKOvetXAX7g\"",
		"mtime": "2026-10-21T07:17:51.441Z",
		"size": 6434,
		"path": "../public/room-assets/premium-gifts/400/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"17c0-8nGHuPpRQb/ABB9u25TZsxu9sBs\"",
		"mtime": "2026-10-21T07:17:51.425Z",
		"size": 6080,
		"path": "../public/room-assets/premium-gifts/400/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1b0e-v9ugFQIoK/X+n9CJPM7Z1/ntIWg\"",
		"mtime": "2026-10-21T07:17:51.425Z",
		"size": 6926,
		"path": "../public/room-assets/premium-gifts/400/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1cc0-i4hwFl5oggRm45Naannjz4FIDEw\"",
		"mtime": "2026-10-21T07:17:51.425Z",
		"size": 7360,
		"path": "../public/room-assets/premium-gifts/400/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"2f0a-DkOxczKacq93z+G5Y7C0xvQXwm0\"",
		"mtime": "2026-10-21T07:17:51.441Z",
		"size": 12042,
		"path": "../public/room-assets/premium-gifts/400/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"2a8e-NPuddP/0HYYXppCM6OI8y2eXw3g\"",
		"mtime": "2026-10-21T07:17:51.425Z",
		"size": 10894,
		"path": "../public/room-assets/premium-gifts/400/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"2a92-JGJvEyLM3mr+ftv5sJuGcIN8G9g\"",
		"mtime": "2026-10-21T07:17:51.445Z",
		"size": 10898,
		"path": "../public/room-assets/premium-gifts/400/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"291e-/f9/0y4ltRQfsA/DAgH/hloIx9U\"",
		"mtime": "2026-10-21T07:17:51.445Z",
		"size": 10526,
		"path": "../public/room-assets/premium-gifts/400/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/400/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"2fe6-Kn0Bk+I7ZC7Bd8B+jqEIqtRGaP0\"",
		"mtime": "2026-10-21T07:17:51.525Z",
		"size": 12262,
		"path": "../public/room-assets/premium-gifts/400/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1b5e-6uu2ZPn5bV7XiDy8pzlxXZ2EIx0\"",
		"mtime": "2026-10-21T07:17:51.445Z",
		"size": 7006,
		"path": "../public/room-assets/premium-gifts/400/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"19f4-BhUSWm7xy3oqGOV2W1ZcvaTgDWI\"",
		"mtime": "2026-10-21T07:17:51.445Z",
		"size": 6644,
		"path": "../public/room-assets/premium-gifts/400/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"19da-XlaLzQxsPPG6dkBJI3tDOQhPwd0\"",
		"mtime": "2026-10-21T07:17:51.445Z",
		"size": 6618,
		"path": "../public/room-assets/premium-gifts/400/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1b30-IXK21vE/ZCtMi50Ii45ublGZKDc\"",
		"mtime": "2026-10-21T07:17:51.445Z",
		"size": 6960,
		"path": "../public/room-assets/premium-gifts/400/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1dc4-vPSHrCDQV4JXUJxfijfabDTeNok\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 7620,
		"path": "../public/room-assets/premium-gifts/400/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"32c0-Aau7C1CoAtz+GFivRx7XGytUaa0\"",
		"mtime": "2026-10-21T07:17:51.445Z",
		"size": 12992,
		"path": "../public/room-assets/premium-gifts/400/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"2d60-MLLFcO1J+FvTFkAGShww5pcDt78\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 11616,
		"path": "../public/room-assets/premium-gifts/400/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"2da6-7klztrZr5F1mZXvQ89iQTkFj3nk\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 11686,
		"path": "../public/room-assets/premium-gifts/400/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"2d4e-a/tToBjuWP55kPLxCAgpcJj7oFU\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 11598,
		"path": "../public/room-assets/premium-gifts/400/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/400/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"2c92-C9vkHsKwmhc1func3HaQHfPoLu4\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 11410,
		"path": "../public/room-assets/premium-gifts/400/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/400/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1b9a-Fv8/wSSjBY0r4plECMhYbzVAv5M\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 7066,
		"path": "../public/room-assets/premium-gifts/400/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"193e-d2lyu5+igKUKoAtMasWVxo3d1KQ\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 6462,
		"path": "../public/room-assets/premium-gifts/400/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"1880-v5/ofg2J+PvBGhduN73XsRYmuZc\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 6272,
		"path": "../public/room-assets/premium-gifts/400/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1b34-JughXDJTQpUAxnfA2U7W1WWAVsE\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 6964,
		"path": "../public/room-assets/premium-gifts/400/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/400/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1d02-2vxOH0sxZP7xmfTUUfHobt40Ldg\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 7426,
		"path": "../public/room-assets/premium-gifts/400/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"2a82-0Ddn+nDy5/2hE43PYKiejPj+ecU\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 10882,
		"path": "../public/room-assets/premium-gifts/400/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/400/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1a36-GiWlvXIVtpnEY4J/wyTwLKXxgU4\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 6710,
		"path": "../public/room-assets/premium-gifts/400/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"187a-MOaGkgquLzTZ5YQR3J6LVZSICd4\"",
		"mtime": "2026-10-21T07:17:51.529Z",
		"size": 6266,
		"path": "../public/room-assets/premium-gifts/400/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"17fc-obLjo6qrUV7myaXA/NA47F7WzXA\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 6140,
		"path": "../public/room-assets/premium-gifts/400/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"19d0-B0bq4al74Iz0cvj0efTrt39nDlg\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 6608,
		"path": "../public/room-assets/premium-gifts/400/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/400/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1cba-4tQqJwd6URAXUJtOjrJ5I1OJ44M\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 7354,
		"path": "../public/room-assets/premium-gifts/400/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"22d0-35xAYepbyiMmtOKVkNXEQA6vRsw\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 8912,
		"path": "../public/room-assets/premium-gifts/400/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/400/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"167e-IDgyOSxGFcpXvLA51zRdlQtwWdE\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 5758,
		"path": "../public/room-assets/premium-gifts/400/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1600-8LACFjvCMPkdMSS/wqTtf2gz+a8\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 5632,
		"path": "../public/room-assets/premium-gifts/400/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"1450-CdxtMIFBRxTsaKptaa52PpzKv0I\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 5200,
		"path": "../public/room-assets/premium-gifts/400/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"162c-E1uu4AO+1z3UOS9kRzrl+bM1ILE\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 5676,
		"path": "../public/room-assets/premium-gifts/400/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/400/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1816-0xu2WFKJx7t52ZPEOIIRh33AreQ\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 6166,
		"path": "../public/room-assets/premium-gifts/400/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/400/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"2b9a-hHFMhfgRFkTUQntD0dmdYfZmmg8\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 11162,
		"path": "../public/room-assets/premium-gifts/400/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/400/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"2b7c-uyOw1Vru5PTncrhnV5U6Z4Y4zUk\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 11132,
		"path": "../public/room-assets/premium-gifts/400/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/400/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"2afe-ofyoesMm6Q95Sod0vrO6PvjyFLY\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 11006,
		"path": "../public/room-assets/premium-gifts/400/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/400/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"2a68-ajyyVkWgJba/UMzkp9zwXNLKxZU\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 10856,
		"path": "../public/room-assets/premium-gifts/400/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"fc8-HFQ5bnybXtqEo3h1pz6WpL0ydqw\"",
		"mtime": "2026-10-21T07:17:49.945Z",
		"size": 4040,
		"path": "../public/room-assets/premium-gifts/500/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"1a88-MeL9KMFC5SJVeWWhs12JQeoT4Ws\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 6792,
		"path": "../public/room-assets/premium-gifts/500/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"18ea-FDKqgvglUiUGbXEGTayr5Bn+JUU\"",
		"mtime": "2026-10-21T07:17:51.537Z",
		"size": 6378,
		"path": "../public/room-assets/premium-gifts/500/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"156a-owTWxavIESTAXBPJzvbQHYlFZYo\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 5482,
		"path": "../public/room-assets/premium-gifts/500/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"17fc-ZspMsVLYapDZQwTG7XZ5wy89j90\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 6140,
		"path": "../public/room-assets/premium-gifts/500/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"24b0-djv1kzyeVfY4hBrfjIoRIO2tWEc\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 9392,
		"path": "../public/room-assets/premium-gifts/500/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"16e4-T+ngiTWxJRlDitaW0jAuqCSTyus\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 5860,
		"path": "../public/room-assets/premium-gifts/500/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"1564-MW3DOcj9GpAPyXnavBqxHF95NQU\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 5476,
		"path": "../public/room-assets/premium-gifts/500/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"2822-QAaHFwtslfFMMtnu0KB2SkW1X0E\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 10274,
		"path": "../public/room-assets/premium-gifts/500/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"125c-MdWuCvW1t7sjJg4MfUxq+kco9is\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 4700,
		"path": "../public/room-assets/premium-gifts/500/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"125c-MdWuCvW1t7sjJg4MfUxq+kco9is\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 4700,
		"path": "../public/room-assets/premium-gifts/500/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"125c-MdWuCvW1t7sjJg4MfUxq+kco9is\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 4700,
		"path": "../public/room-assets/premium-gifts/500/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"106a-ISbafjWo/48KlfiphYaP/ps0KxU\"",
		"mtime": "2026-10-21T07:17:51.545Z",
		"size": 4202,
		"path": "../public/room-assets/premium-gifts/500/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"10d8-l79/dR359m++QC44f1/4YkNBoGc\"",
		"mtime": "2026-10-21T07:17:51.545Z",
		"size": 4312,
		"path": "../public/room-assets/premium-gifts/500/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"10c8-XiVUvGVerbbhXYcrHjEZTs1yOa8\"",
		"mtime": "2026-10-21T07:17:51.541Z",
		"size": 4296,
		"path": "../public/room-assets/premium-gifts/500/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"11a8-//ihcMMxRuFHU/bAYsLhjrvT9Qw\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 4520,
		"path": "../public/room-assets/premium-gifts/500/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"1772-JbrQioMwRH9Cr7Q6e7jpv9N3SyU\"",
		"mtime": "2026-10-21T07:17:51.545Z",
		"size": 6002,
		"path": "../public/room-assets/premium-gifts/500/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"15b4-lQidZluaGn+YSUe9RCl2mvphcQo\"",
		"mtime": "2026-10-21T07:17:51.545Z",
		"size": 5556,
		"path": "../public/room-assets/premium-gifts/500/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/500/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"1760-RA0GsvbEiC7EpV4uTPi575tGb/M\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 5984,
		"path": "../public/room-assets/premium-gifts/500/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"1b74-rGHRCPKWWCjiPjKI1R3jBLgKAx0\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 7028,
		"path": "../public/room-assets/premium-gifts/500/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"1b74-rGHRCPKWWCjiPjKI1R3jBLgKAx0\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 7028,
		"path": "../public/room-assets/premium-gifts/500/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"1b74-rGHRCPKWWCjiPjKI1R3jBLgKAx0\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 7028,
		"path": "../public/room-assets/premium-gifts/500/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"32f2-AxKygOwFSAVrtriKJXa5Hr1WtnI\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 13042,
		"path": "../public/room-assets/premium-gifts/500/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"2c50-K1sH/EC9f632wDnAHb3eTfGXvkA\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 11344,
		"path": "../public/room-assets/premium-gifts/500/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"183a-gweTpObO/Yh16UXXQ3cA5bl+m/Y\"",
		"mtime": "2026-10-21T07:17:51.553Z",
		"size": 6202,
		"path": "../public/room-assets/premium-gifts/500/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"2406-YVjqZRqUmFaj/5SXO7Fnc46hR4Y\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 9222,
		"path": "../public/room-assets/premium-gifts/500/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"15d2-L2zLH9Qc1ZNZi8cJnyM+saf/O/8\"",
		"mtime": "2026-10-21T07:17:51.549Z",
		"size": 5586,
		"path": "../public/room-assets/premium-gifts/500/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"1920-ep2yXeWW2dQZgRJqHSyR1LwUyYs\"",
		"mtime": "2026-10-21T07:17:51.557Z",
		"size": 6432,
		"path": "../public/room-assets/premium-gifts/500/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"2576-C86m2anLIFA5pfmnz4ixGCDyR3Y\"",
		"mtime": "2026-10-21T07:17:51.553Z",
		"size": 9590,
		"path": "../public/room-assets/premium-gifts/500/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"3b18-t0ayH2eTghwOUhPHqrCkBnTjn3s\"",
		"mtime": "2026-10-21T07:17:51.553Z",
		"size": 15128,
		"path": "../public/room-assets/premium-gifts/500/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"12d0-efn9f3g5biugnLkM6wYIcFYLfXs\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 4816,
		"path": "../public/room-assets/premium-gifts/500/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"13ee-MEq66RyBKLrrtEVW5ayqZnHj0oc\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 5102,
		"path": "../public/room-assets/premium-gifts/500/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"2444-YzTRZEePofuHUYowlQLQUKMVDDk\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 9284,
		"path": "../public/room-assets/premium-gifts/500/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"3e32-VXWegNSg8faneJ69LhzGkPf7IF4\"",
		"mtime": "2026-10-21T07:17:51.557Z",
		"size": 15922,
		"path": "../public/room-assets/premium-gifts/500/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"188a-y82QeEVV8ZDKKV+CQaB9tgXEmLU\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 6282,
		"path": "../public/room-assets/premium-gifts/500/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"14ae-GvXN/iBf78UgyOXuTNS2yYd+aSo\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 5294,
		"path": "../public/room-assets/premium-gifts/500/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"1d70-7puPQX16m6JE8RWXIqiNRn14JKw\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 7536,
		"path": "../public/room-assets/premium-gifts/500/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"18c2-mp3sq+cU3w6WfMHeTC1Li2rwtt8\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 6338,
		"path": "../public/room-assets/premium-gifts/500/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1162-MroK4YTjQmXyEatZqzqZ8F7nebM\"",
		"mtime": "2026-10-21T07:17:51.597Z",
		"size": 4450,
		"path": "../public/room-assets/premium-gifts/500/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"c94-5sOEPjEvM4+n5jTyoM6bT5t9+5I\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 3220,
		"path": "../public/room-assets/premium-gifts/500/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"1370-Tuf4rkyf095BnmZkbrkezvMM0VY\"",
		"mtime": "2026-10-21T07:17:51.597Z",
		"size": 4976,
		"path": "../public/room-assets/premium-gifts/500/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"1458-zrna5OLO+wG53YQ1OcXS0vaTiG0\"",
		"mtime": "2026-10-21T07:17:51.597Z",
		"size": 5208,
		"path": "../public/room-assets/premium-gifts/500/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"136e-lIKslgimdUclibYg7RhZ3ML0DPI\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 4974,
		"path": "../public/room-assets/premium-gifts/500/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"e70-L1h4KuYo1TARDPhWPyaMe6eQ1Lc\"",
		"mtime": "2026-10-21T07:17:51.565Z",
		"size": 3696,
		"path": "../public/room-assets/premium-gifts/500/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"121e-0V6TozLkSIVB8IWQjFKiO8pW6mE\"",
		"mtime": "2026-10-21T07:17:51.597Z",
		"size": 4638,
		"path": "../public/room-assets/premium-gifts/500/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"1d96-jyowyBqXhcT5hf6lR94As7Bs40I\"",
		"mtime": "2026-10-21T07:17:51.597Z",
		"size": 7574,
		"path": "../public/room-assets/premium-gifts/500/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"1d96-jyowyBqXhcT5hf6lR94As7Bs40I\"",
		"mtime": "2026-10-21T07:17:51.597Z",
		"size": 7574,
		"path": "../public/room-assets/premium-gifts/500/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"10d8-NXfn0mo2KW51/KPUVXsot1tSD6I\"",
		"mtime": "2026-10-21T07:17:51.597Z",
		"size": 4312,
		"path": "../public/room-assets/premium-gifts/500/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"1248-nEqsk4TuqsKDgrGn6ymFHNO6i3U\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 4680,
		"path": "../public/room-assets/premium-gifts/500/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"1308-tXX7QXjvdXkUyxSnwtr4Bv+AkQQ\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 4872,
		"path": "../public/room-assets/premium-gifts/500/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"e42-BsspsPkcbgLmzYL7boetwhwjPQg\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 3650,
		"path": "../public/room-assets/premium-gifts/500/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"e90-2i3VMmQe2X1xcR7HLSRO5RBihIc\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 3728,
		"path": "../public/room-assets/premium-gifts/500/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"e34-wqvm89OEH7VLRHDbKovCOJJrxd4\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 3636,
		"path": "../public/room-assets/premium-gifts/500/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"16ce-mescW/WAwMamSrSVBrmjSeCNRr0\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 5838,
		"path": "../public/room-assets/premium-gifts/500/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"17d0-DhX1bRB22vj7yoGuQBZdh5UCWvE\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 6096,
		"path": "../public/room-assets/premium-gifts/500/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"1734-IxpSge1m8HpajJO9QvE7UeLs+RU\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 5940,
		"path": "../public/room-assets/premium-gifts/500/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"27b6-g4nNTYTMGZcx/QElZ61mCNZXqSw\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 10166,
		"path": "../public/room-assets/premium-gifts/500/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"25e8-r5swYQmHxlUXCe6GcYd8JRYUL6U\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 9704,
		"path": "../public/room-assets/premium-gifts/500/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"2980-sl3V4RdPwFhqWNB2WiKjOxy53Bg\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 10624,
		"path": "../public/room-assets/premium-gifts/500/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"2516-gxHWhaBigTP7dWYKIxVVFmO1zPA\"",
		"mtime": "2026-10-21T07:17:51.605Z",
		"size": 9494,
		"path": "../public/room-assets/premium-gifts/500/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"262c-ZGxIzcqfFS/TUvmeB/cKQbXA9Ss\"",
		"mtime": "2026-10-21T07:17:51.605Z",
		"size": 9772,
		"path": "../public/room-assets/premium-gifts/500/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1582-1vdI9QA4bOo3t2yZCGQUq5AJAA4\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 5506,
		"path": "../public/room-assets/premium-gifts/500/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"191a-mzhQRUVXaNA6PjjFJXaCkLSSPYI\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 6426,
		"path": "../public/room-assets/premium-gifts/500/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"1942-Fpc1JhAU7aqgM0mX3+tMkZE5dHY\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 6466,
		"path": "../public/room-assets/premium-gifts/500/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"2408-a6lZY5Zp3wzjHR30Re4C9QcalWs\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 9224,
		"path": "../public/room-assets/premium-gifts/500/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"227c-goWUVdTdIe9bmLPvcUMSZVMtxY0\"",
		"mtime": "2026-10-21T07:17:51.601Z",
		"size": 8828,
		"path": "../public/room-assets/premium-gifts/500/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"236c-a/5gRslyzkSmHAd/GRNoB5oN+rI\"",
		"mtime": "2026-10-21T07:17:51.605Z",
		"size": 9068,
		"path": "../public/room-assets/premium-gifts/500/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"26ba-xyf1JGlcotDGlSw+IrQ6ULY3YWc\"",
		"mtime": "2026-10-21T07:17:51.605Z",
		"size": 9914,
		"path": "../public/room-assets/premium-gifts/500/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"2b02-Z7P/jlwtc0aU9xSnfBktLN4WDvg\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 11010,
		"path": "../public/room-assets/premium-gifts/500/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"31e8-ujo7zrCtorT5+/bGPcN73Grm/SU\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 12776,
		"path": "../public/room-assets/premium-gifts/500/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"3718-yXKcQPdSiTDPel7fCcqMQMk6IJM\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 14104,
		"path": "../public/room-assets/premium-gifts/500/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"65e0-deO55dXua2dc6IUpsBj+gXLql8U\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 26080,
		"path": "../public/room-assets/premium-gifts/500/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"5a78-4MjMevDrD5P0taPy5Fu1bqgsrbA\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 23160,
		"path": "../public/room-assets/premium-gifts/500/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"41ca-dTMN+DVVRZu/6cXUQFp1c0YemR0\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 16842,
		"path": "../public/room-assets/premium-gifts/500/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"4026-dug37sBooF6uS5I7LHkTZa653tI\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 16422,
		"path": "../public/room-assets/premium-gifts/500/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"3e1c-sR1pcaZ1ApocpjRTgUNcX23zrMk\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 15900,
		"path": "../public/room-assets/premium-gifts/500/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"2da2-+xskuZQoa35jc0jYnCIhldYk6nA\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 11682,
		"path": "../public/room-assets/premium-gifts/500/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"3876-st9jBF2OC/7u1BGwgda7VnbvtAE\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 14454,
		"path": "../public/room-assets/premium-gifts/500/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"49c4-gRbxEGRWp416jIYv6HUwN/cZLkI\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 18884,
		"path": "../public/room-assets/premium-gifts/500/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"376a-JhW9ZoyofmHI/CoB6tocj0//5dE\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 14186,
		"path": "../public/room-assets/premium-gifts/500/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"44c4-tEdjR1bQGGWyS0c/VmpWJJohLy0\"",
		"mtime": "2026-10-21T07:17:51.609Z",
		"size": 17604,
		"path": "../public/room-assets/premium-gifts/500/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"425e-baPsAOHk0Pt6J1CwEKiU8LyEJQc\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 16990,
		"path": "../public/room-assets/premium-gifts/500/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"2fa2-4J9YQrZFiRsiCYkqGWJE0omT5Jk\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 12194,
		"path": "../public/room-assets/premium-gifts/500/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"266c-fiOggpB63520YNojIQKrSp01e/4\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 9836,
		"path": "../public/room-assets/premium-gifts/500/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"2cd2-qrEnW4RO9WlTDuehnw2qtz++/Ko\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 11474,
		"path": "../public/room-assets/premium-gifts/500/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"2d1e-s1PHYRfvT/6glaToKVVz/xHVRiE\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 11550,
		"path": "../public/room-assets/premium-gifts/500/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"2c5c-0YcshHCepkEHUJ5xGbMNVXubGD8\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 11356,
		"path": "../public/room-assets/premium-gifts/500/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"5370-xtrdU2LzwtGkvLEZll4xj52dalU\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 21360,
		"path": "../public/room-assets/premium-gifts/500/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"331e-N5OKocEnNAtuR0o2XWL9xGnb5pU\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 13086,
		"path": "../public/room-assets/premium-gifts/500/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"30fe-XsgarXhvJj7s5AHf73kSNkBCnDQ\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 12542,
		"path": "../public/room-assets/premium-gifts/500/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"30ee-LPnKUWdxX8bijgVWWTxouFepeUI\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 12526,
		"path": "../public/room-assets/premium-gifts/500/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"302e-1sHzhZaaUxgSFW1Z2HNDoYz7ItU\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 12334,
		"path": "../public/room-assets/premium-gifts/500/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"2d2e-Z4CRu18EHGZBPiXbKrBS8S6hwuM\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 11566,
		"path": "../public/room-assets/premium-gifts/500/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"36b4-Iu4bAYhE0iBmQffrQPj7qoJcMyk\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 14004,
		"path": "../public/room-assets/premium-gifts/500/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"3146-JKFEEFrqP2pgVNlfR0UPswEOkSo\"",
		"mtime": "2026-10-21T07:17:51.613Z",
		"size": 12614,
		"path": "../public/room-assets/premium-gifts/500/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"38fa-sJDEu1B75UWGyJsqlrtBqwzMxKI\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 14586,
		"path": "../public/room-assets/premium-gifts/500/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"4246-9TJpGslZHMYscX6+36qyDASVoLo\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 16966,
		"path": "../public/room-assets/premium-gifts/500/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"339c-A4ZuTPr04O1zOhwW3D+lXn4Ubds\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 13212,
		"path": "../public/room-assets/premium-gifts/500/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"3894-hb8Isksxt+7fNrrzooA5UQ8p7as\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 14484,
		"path": "../public/room-assets/premium-gifts/500/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"5cf2-UuWAbLM1K8cpAmCItMuvL0u6HTE\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 23794,
		"path": "../public/room-assets/premium-gifts/500/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"3280-z6lN73iZ92QM241qCy6tKUNgbuA\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 12928,
		"path": "../public/room-assets/premium-gifts/500/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"3374-lSfwH0x+DtP5evhh9jPLtTF/EnE\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 13172,
		"path": "../public/room-assets/premium-gifts/500/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"2d32-kRSbmnSteqbptqw1R9/OtUWvnLs\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 11570,
		"path": "../public/room-assets/premium-gifts/500/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"2d10-vkEBvMAIW7+Bu4Cr89o2/rIK9zg\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 11536,
		"path": "../public/room-assets/premium-gifts/500/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"364e-u/YBHy/mI6PWm0VueC6xF5iDvUc\"",
		"mtime": "2026-10-21T07:17:51.617Z",
		"size": 13902,
		"path": "../public/room-assets/premium-gifts/500/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"36dc-x3YybfeXxAEOHoPBzDOHaUJom7g\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 14044,
		"path": "../public/room-assets/premium-gifts/500/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"3414-zusvd9Pw/EPdL4+LC6v4Z2TtIZc\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 13332,
		"path": "../public/room-assets/premium-gifts/500/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"2eda-76v1Fb+rPhQUrxRbnRj0pjZxryo\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 11994,
		"path": "../public/room-assets/premium-gifts/500/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"39fa-E1jVOyVrNBQuU77KQGs12lbivmM\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 14842,
		"path": "../public/room-assets/premium-gifts/500/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"3440-IrFdOtivfo3OOgZum9CpmkhYvPI\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 13376,
		"path": "../public/room-assets/premium-gifts/500/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"2e4e-Yz5c/6Hs5YlXsbV/vaH/dyeReho\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 11854,
		"path": "../public/room-assets/premium-gifts/500/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/500/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"437c-rR3RPtpoM+GTNonzoNzxp2lXLW0\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 17276,
		"path": "../public/room-assets/premium-gifts/500/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"270a-ZxH2nn3CD5EjkJpuAjYGp5Mg6oE\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 9994,
		"path": "../public/room-assets/premium-gifts/500/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"22d6-bV+CtlqykeTp6HQC7zIrYNqoqAY\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 8918,
		"path": "../public/room-assets/premium-gifts/500/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"2166-mHKv6R5+b2FaJYYc1k8urXN0P7A\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 8550,
		"path": "../public/room-assets/premium-gifts/500/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"24b0-TQQyUtnuYgn2yUCQxFf8JJy8xj4\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 9392,
		"path": "../public/room-assets/premium-gifts/500/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"27ee-JwHOdi/eE+/fuc4UNuP+dlKiR9k\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 10222,
		"path": "../public/room-assets/premium-gifts/500/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"52ac-/zOzEjhbDZQ2tX97hf0pbL2bZAE\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 21164,
		"path": "../public/room-assets/premium-gifts/500/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"3356-gR2Ra4mIgHl9Wz4uKymoUjiWgvI\"",
		"mtime": "2026-10-21T07:17:51.621Z",
		"size": 13142,
		"path": "../public/room-assets/premium-gifts/500/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"3596-XSVL0bIQYR1BffhqxF6YJv8lfoI\"",
		"mtime": "2026-10-21T07:17:51.625Z",
		"size": 13718,
		"path": "../public/room-assets/premium-gifts/500/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"3656-hrE/BX02vE35jSY9oM1aWhuF0Jc\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 13910,
		"path": "../public/room-assets/premium-gifts/500/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/500/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"33fa-6rjCJo8Fr5cUEB1iSG6Tyc3PuLM\"",
		"mtime": "2026-10-21T07:17:51.625Z",
		"size": 13306,
		"path": "../public/room-assets/premium-gifts/500/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"281e-darUiSChVZBLogsT6z6jorgX5mg\"",
		"mtime": "2026-10-21T07:17:51.625Z",
		"size": 10270,
		"path": "../public/room-assets/premium-gifts/500/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"2388-+3DI24vWGvGRIcpTuXnmjLKnRWk\"",
		"mtime": "2026-10-21T07:17:51.625Z",
		"size": 9096,
		"path": "../public/room-assets/premium-gifts/500/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"2146-LjdQ6vjc03e7i2yLefnSOTHAmMc\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 8518,
		"path": "../public/room-assets/premium-gifts/500/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"251e-FkOAMRkfd2C1QLvcLnBb11ruyJE\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 9502,
		"path": "../public/room-assets/premium-gifts/500/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"28f2-z+FT4v+OqmrVl0G6llMP6JnPSxw\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 10482,
		"path": "../public/room-assets/premium-gifts/500/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"3f4a-uE/ZnirIw048JffKx2vZLtUOyYI\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 16202,
		"path": "../public/room-assets/premium-gifts/500/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"37b8-KMsyJJhDqDjqjP63zZnA6PuMyEI\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 14264,
		"path": "../public/room-assets/premium-gifts/500/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"386e-eJznBeznCSoV5pV0iIvBOdmbBC4\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 14446,
		"path": "../public/room-assets/premium-gifts/500/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"35c0-w/T5kSfx2eyGi2FoMvvBlnCUMzc\"",
		"mtime": "2026-10-21T07:17:51.629Z",
		"size": 13760,
		"path": "../public/room-assets/premium-gifts/500/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/500/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"3fc4-UOC7JV+1T7AZfuqFg+HD+86k3Pk\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 16324,
		"path": "../public/room-assets/premium-gifts/500/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"27dc-3GCapnn9+tZomFVPIQjVupoZvx8\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 10204,
		"path": "../public/room-assets/premium-gifts/500/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"2528-/OXXqUHG85IJqSl7J/vAxySJhbU\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 9512,
		"path": "../public/room-assets/premium-gifts/500/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"2482-/sAcbYHfHS2hehn9W4Z/9dk6l/U\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 9346,
		"path": "../public/room-assets/premium-gifts/500/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"25aa-NqCNArSBOUZR1JNwwMwiS6IXp0E\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 9642,
		"path": "../public/room-assets/premium-gifts/500/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"29f8-yT93i4jvWSQOWzabeSpxd84OM+8\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 10744,
		"path": "../public/room-assets/premium-gifts/500/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"4434-JDqqfH8uim5i0ZPphdDANpAEPHE\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 17460,
		"path": "../public/room-assets/premium-gifts/500/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"3c46-i1YoSEJrzwaq9VmOMGvSM+Tr8DY\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 15430,
		"path": "../public/room-assets/premium-gifts/500/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"3c24-KfR0qg7URCyuKdX7sQ9RJxTRuh8\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 15396,
		"path": "../public/room-assets/premium-gifts/500/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"3bae-lUHnwGU1fbqLVa8sI75yVDUcXPk\"",
		"mtime": "2026-10-21T07:17:51.633Z",
		"size": 15278,
		"path": "../public/room-assets/premium-gifts/500/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/500/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"3b80-j58TERoY0YzMVngDmfzUX6i0Py4\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 15232,
		"path": "../public/room-assets/premium-gifts/500/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/500/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"280a-FgyfULUbxYlMSmkMUSpFFEBz/uA\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 10250,
		"path": "../public/room-assets/premium-gifts/500/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"2424-k3g8Cpkv4WWHVnhSCk+fr0WTAoI\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 9252,
		"path": "../public/room-assets/premium-gifts/500/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"22a6-m9GXlMNgGFHNGy4pq0cM1PA7QLo\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 8870,
		"path": "../public/room-assets/premium-gifts/500/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"254c-na+x8H9SyHY47w/Kyczt1+GLYCA\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 9548,
		"path": "../public/room-assets/premium-gifts/500/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/500/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"2950-/zUAzbEm6SjTscDBpKYpVXdF+Y4\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 10576,
		"path": "../public/room-assets/premium-gifts/500/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"3976-VQBvqb1M34kfPFztaG2GNymJtL0\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 14710,
		"path": "../public/room-assets/premium-gifts/500/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/500/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"262e-Bxi+E7i12WENsr1sf1CYLgsu3pE\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 9774,
		"path": "../public/room-assets/premium-gifts/500/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"2264-eE8tnYm8qaJc1LBGoNuiXVzqWZk\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 8804,
		"path": "../public/room-assets/premium-gifts/500/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"2202-emUhcUm+LW56MVNFNhjHWQgpnUE\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 8706,
		"path": "../public/room-assets/premium-gifts/500/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"235e-ZVfRuP3okVqAtewVO9gWweVz4RQ\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 9054,
		"path": "../public/room-assets/premium-gifts/500/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/500/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"289c-9dr3nxfsB8BaomtYzqiiCScTY6I\"",
		"mtime": "2026-10-21T07:17:51.637Z",
		"size": 10396,
		"path": "../public/room-assets/premium-gifts/500/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"2f5a-pf2qentOaMuxw+pSPB9LplrM7Pc\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 12122,
		"path": "../public/room-assets/premium-gifts/500/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/500/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"2046-1bRx3B0aCNseQujYmCv2o5VsYEQ\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 8262,
		"path": "../public/room-assets/premium-gifts/500/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"1e80-aXKBP9E7zzku6qgbd7f6POEaWDw\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 7808,
		"path": "../public/room-assets/premium-gifts/500/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"1c80-nbqG/41aZkj2aNYqEYy/uL64eyQ\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 7296,
		"path": "../public/room-assets/premium-gifts/500/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"1e6c-X3qPvTbqSd0/JczUEFV55QvE+Yw\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 7788,
		"path": "../public/room-assets/premium-gifts/500/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/500/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"21c6-Wxoe5S5FH4KSym7m20r9VG07iNs\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 8646,
		"path": "../public/room-assets/premium-gifts/500/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/500/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"391a-/SlklFtxwfU1WOhTenOCwhRN8v0\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 14618,
		"path": "../public/room-assets/premium-gifts/500/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/500/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"3952-uaIBhPBHyvQrg4HXX4zBSn7cG1g\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 14674,
		"path": "../public/room-assets/premium-gifts/500/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/500/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"38e6-poRcvgqI7omd8asgflPxc0nyxfE\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 14566,
		"path": "../public/room-assets/premium-gifts/500/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/500/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"3ae8-PNily8LqnYh/wjZIOKvSW9deDOs\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 15080,
		"path": "../public/room-assets/premium-gifts/500/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"488-fjyM6HJaSW+RNUKGK+/jgD+ARM8\"",
		"mtime": "2026-10-21T07:17:49.949Z",
		"size": 1160,
		"path": "../public/room-assets/premium-gifts/80/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"562-aGgDObRudvi2hRue7DThrnkwgcc\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 1378,
		"path": "../public/room-assets/premium-gifts/80/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"608-VIf/DcOUr37o0PpICP0HAix/r/U\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 1544,
		"path": "../public/room-assets/premium-gifts/80/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"5c4-8LxEa0Fy14ct3sFieJdyUW+AkE0\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 1476,
		"path": "../public/room-assets/premium-gifts/80/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"4ec-/I57GFWTicRHkaEppyCVnMSNb/Y\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1260,
		"path": "../public/room-assets/premium-gifts/80/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"678-C6guogQL5VJ/029B8LGt331s/UA\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1656,
		"path": "../public/room-assets/premium-gifts/80/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"58c-TwyJ+lzilT+ooySIspuHnw/LSIk\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1420,
		"path": "../public/room-assets/premium-gifts/80/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"582-C01FL6MB6TLS9rPCx4B/nQkCQ9w\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1410,
		"path": "../public/room-assets/premium-gifts/80/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"68e-5ifXDw/jnTaakWtv1hajXu5p/Gs\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 1678,
		"path": "../public/room-assets/premium-gifts/80/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_salute2.webp": {
		"type": "image/webp",
		"etag": "\"416-036fPw+wDXimIiORF8D69bGzs8U\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1046,
		"path": "../public/room-assets/premium-gifts/80/g_p1_salute2.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_salute3.webp": {
		"type": "image/webp",
		"etag": "\"416-036fPw+wDXimIiORF8D69bGzs8U\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1046,
		"path": "../public/room-assets/premium-gifts/80/g_p1_salute3.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_salute4.webp": {
		"type": "image/webp",
		"etag": "\"416-036fPw+wDXimIiORF8D69bGzs8U\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1046,
		"path": "../public/room-assets/premium-gifts/80/g_p1_salute4.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_salute5.webp": {
		"type": "image/webp",
		"etag": "\"4a0-K1YxYUS9ave4rKhuDm4+9o1CAt4\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1184,
		"path": "../public/room-assets/premium-gifts/80/g_p1_salute5.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_salute6.webp": {
		"type": "image/webp",
		"etag": "\"4f6-xaZtBkyFAXSYP7d+2iKnEhr5CU8\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1270,
		"path": "../public/room-assets/premium-gifts/80/g_p1_salute6.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_salute7.webp": {
		"type": "image/webp",
		"etag": "\"4d2-zdM/XMqr7Q+TzUGO9KehYQ2Ej+w\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1234,
		"path": "../public/room-assets/premium-gifts/80/g_p1_salute7.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"482-4nBbSw6hY9lO3PATY7EMIqwMn1c\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1154,
		"path": "../public/room-assets/premium-gifts/80/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"65a-tzzvQh4O5WfNbBMWTc0fqOlR8W0\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1626,
		"path": "../public/room-assets/premium-gifts/80/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"51c-g4/F/gpJc+ydlURvf4yHOsfx8eI\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1308,
		"path": "../public/room-assets/premium-gifts/80/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/80/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"5b0-xJOknPGBWgZWMvhlRUizqlxekzI\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1456,
		"path": "../public/room-assets/premium-gifts/80/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_birthdaycake2.webp": {
		"type": "image/webp",
		"etag": "\"592-HMGUeLWKLnUPdB8ZttePYZr746U\"",
		"mtime": "2026-10-21T07:17:51.673Z",
		"size": 1426,
		"path": "../public/room-assets/premium-gifts/80/g_p2_birthdaycake2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_birthdaycake3.webp": {
		"type": "image/webp",
		"etag": "\"592-HMGUeLWKLnUPdB8ZttePYZr746U\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1426,
		"path": "../public/room-assets/premium-gifts/80/g_p2_birthdaycake3.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"592-HMGUeLWKLnUPdB8ZttePYZr746U\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1426,
		"path": "../public/room-assets/premium-gifts/80/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"7c6-qNuQ6SNbooOWTg+Yyahc8KY/c0Q\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1990,
		"path": "../public/room-assets/premium-gifts/80/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"642-5CL4Mh6lEw46yfsLIxcusvyANIM\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1602,
		"path": "../public/room-assets/premium-gifts/80/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"5ac-Muze+qNWGF9QpGfLeqFCHBXD0vY\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1452,
		"path": "../public/room-assets/premium-gifts/80/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"60c-Wt96LvPzYv+IDM0O5NGIcyBBvVk\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1548,
		"path": "../public/room-assets/premium-gifts/80/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"4d6-0Uw2FbggSEPCccVwXDcBd3Iv/4g\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1238,
		"path": "../public/room-assets/premium-gifts/80/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"422-FAJsaxVByqYFc7hn7a6BpFtJg40\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1058,
		"path": "../public/room-assets/premium-gifts/80/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"6ac-fs9ZCr0ayPefwnnQeMrXQFQ54Mk\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1708,
		"path": "../public/room-assets/premium-gifts/80/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"68c-DPfM7x3QPUK0K5BpaWJRcPjUcks\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1676,
		"path": "../public/room-assets/premium-gifts/80/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"4fa-2eiUjguNjnszv3FGpTEGvCMVlmg\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1274,
		"path": "../public/room-assets/premium-gifts/80/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"4fe-ugIVWzVbMYg86pdzKqxBoV0PR70\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1278,
		"path": "../public/room-assets/premium-gifts/80/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"6ec-9xj9TVmchKRQM/Mp9x3u4tpDdo0\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1772,
		"path": "../public/room-assets/premium-gifts/80/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"61a-JAQaWW8ZtNu5zfeZZhW2U7yo6rs\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1562,
		"path": "../public/room-assets/premium-gifts/80/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"5e4-5Vibq7QS8rzXQKfI3iADyvNwEFI\"",
		"mtime": "2026-10-21T07:17:51.677Z",
		"size": 1508,
		"path": "../public/room-assets/premium-gifts/80/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"512-V3/DUlTl7GFhak3JPK97uPEZvBc\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1298,
		"path": "../public/room-assets/premium-gifts/80/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"62e-LzJ9Nu1fDgp/aOJQeTIQsk427js\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1582,
		"path": "../public/room-assets/premium-gifts/80/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"52a-i701iuvS6UYVVOyqFEIn6rH6R+A\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1322,
		"path": "../public/room-assets/premium-gifts/80/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"474-65sz2NRyUfsUhhGMtlfGcUeJaLo\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1140,
		"path": "../public/room-assets/premium-gifts/80/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_leaf2_v2.webp": {
		"type": "image/webp",
		"etag": "\"37c-3Fw1jnWEj/zaCXt5axpiRG6+5j4\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 892,
		"path": "../public/room-assets/premium-gifts/80/g_p2_leaf2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_leaf3_v2.webp": {
		"type": "image/webp",
		"etag": "\"498-vIT8LpwPUA1bSMsDqaoNv0orVqg\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1176,
		"path": "../public/room-assets/premium-gifts/80/g_p2_leaf3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_leaf4_v2.webp": {
		"type": "image/webp",
		"etag": "\"496-5+IgdD0gvKBWkQelqAJohE82Y74\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1174,
		"path": "../public/room-assets/premium-gifts/80/g_p2_leaf4_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_leaf5_v2.webp": {
		"type": "image/webp",
		"etag": "\"4aa-Lbn5AK9lxoTnoKwDwERo+X34jIQ\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1194,
		"path": "../public/room-assets/premium-gifts/80/g_p2_leaf5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_leaf6_v2.webp": {
		"type": "image/webp",
		"etag": "\"3e4-gXAcmeVJzGJlQjvKNUtyB5jq/5E\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 996,
		"path": "../public/room-assets/premium-gifts/80/g_p2_leaf6_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_leaf7_v2.webp": {
		"type": "image/webp",
		"etag": "\"464-rqIiEsxuUD+4m0QDnWfcDnO87bw\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1124,
		"path": "../public/room-assets/premium-gifts/80/g_p2_leaf7_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"522-p5u4jgLT4KvYLNXc8wzpqB9mUkQ\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1314,
		"path": "../public/room-assets/premium-gifts/80/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_mobile2.webp": {
		"type": "image/webp",
		"etag": "\"522-p5u4jgLT4KvYLNXc8wzpqB9mUkQ\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1314,
		"path": "../public/room-assets/premium-gifts/80/g_p2_mobile2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"46a-9F8whdG3Ng5RPx+0gY+EaLpT79Q\"",
		"mtime": "2026-10-21T07:17:51.681Z",
		"size": 1130,
		"path": "../public/room-assets/premium-gifts/80/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_rose5_v2.webp": {
		"type": "image/webp",
		"etag": "\"4a2-xVXjMUhPOROsEO6NtJAZn7el00s\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1186,
		"path": "../public/room-assets/premium-gifts/80/g_p2_rose5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_rose6_v2.webp": {
		"type": "image/webp",
		"etag": "\"4ba-zLkCXz9yvhuysrJutsLkefRhKaE\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1210,
		"path": "../public/room-assets/premium-gifts/80/g_p2_rose6_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_salute2.webp": {
		"type": "image/webp",
		"etag": "\"416-ywoQGdXmm4vmCSuMtHvEeSrqJ2A\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1046,
		"path": "../public/room-assets/premium-gifts/80/g_p2_salute2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_salute3.webp": {
		"type": "image/webp",
		"etag": "\"41c-Y3asA2UC5cOuvsURTXuZdXMrsCA\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1052,
		"path": "../public/room-assets/premium-gifts/80/g_p2_salute3.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_salute4.webp": {
		"type": "image/webp",
		"etag": "\"414-GpesDJv2In4rkHLTb/OkoAbZLv4\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1044,
		"path": "../public/room-assets/premium-gifts/80/g_p2_salute4.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_salute5.webp": {
		"type": "image/webp",
		"etag": "\"59e-aIUlyTYJUbNd8WnU8cePW1IfNqk\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1438,
		"path": "../public/room-assets/premium-gifts/80/g_p2_salute5.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_salute6.webp": {
		"type": "image/webp",
		"etag": "\"57e-YSCL6mSQxCFxOZmubPfOInIO4JU\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1406,
		"path": "../public/room-assets/premium-gifts/80/g_p2_salute6.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_salute7.webp": {
		"type": "image/webp",
		"etag": "\"5aa-zyfHDffeD8IiiQZloRbWaba/wu0\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1450,
		"path": "../public/room-assets/premium-gifts/80/g_p2_salute7.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"550-3vhhxfawlhgomvqwVsq6UZMZAZQ\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1360,
		"path": "../public/room-assets/premium-gifts/80/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_snowball2.webp": {
		"type": "image/webp",
		"etag": "\"450-opWzuOfx4MZz/bEbKsjuga0JknI\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1104,
		"path": "../public/room-assets/premium-gifts/80/g_p2_snowball2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_snowball3.webp": {
		"type": "image/webp",
		"etag": "\"4a2-L55OTS1XoNWjCjtx/QH5xmn3SSw\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1186,
		"path": "../public/room-assets/premium-gifts/80/g_p2_snowball3.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_snowball4.webp": {
		"type": "image/webp",
		"etag": "\"452-p2WohBmndRYxsvk4e44O/3gbNco\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1106,
		"path": "../public/room-assets/premium-gifts/80/g_p2_snowball4.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_snowball5.webp": {
		"type": "image/webp",
		"etag": "\"46c-+8TKLdyY8F0sX5+dtcF5scqOrUY\"",
		"mtime": "2026-10-21T07:17:51.685Z",
		"size": 1132,
		"path": "../public/room-assets/premium-gifts/80/g_p2_snowball5.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"50c-kkDWRVqMAdin2J6lZG1FMRR3DcE\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1292,
		"path": "../public/room-assets/premium-gifts/80/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"5b0-uJAFPQu0Lcofyy8DilJSJlMU4gA\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1456,
		"path": "../public/room-assets/premium-gifts/80/g_p2_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p2_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"5dc-ge5jBRDZ7hs4AdOMLpHM52HFuRM\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1500,
		"path": "../public/room-assets/premium-gifts/80/g_p2_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"534-ChkDy2TIAXOptuDCGKOCEwkUEJE\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1332,
		"path": "../public/room-assets/premium-gifts/80/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"508-UQnYLrnKVVtJlayYxJeCXp8rNPs\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1288,
		"path": "../public/room-assets/premium-gifts/80/g_p6_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"520-w4op2/T96IWAY+V4k5U14dH6aoE\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1312,
		"path": "../public/room-assets/premium-gifts/80/g_p6_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"534-ChkDy2TIAXOptuDCGKOCEwkUEJE\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1332,
		"path": "../public/room-assets/premium-gifts/80/g_p6_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"586-gK8wosmnyNtzag6NlNRC73qGCkk\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1414,
		"path": "../public/room-assets/premium-gifts/80/g_p6_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"5dc-iN3yEa70LBSqgzD2e14mQRJJZoo\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1500,
		"path": "../public/room-assets/premium-gifts/80/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"662-k+KDEJq9g1BL5lHAtF0avwYhBJU\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1634,
		"path": "../public/room-assets/premium-gifts/80/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"9ac-4LP5yAtAlihRph1Ffa+LWvlvfnc\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 2476,
		"path": "../public/room-assets/premium-gifts/80/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"876-0d2Uc9wiTBtNBueLQ/kH0HaWfD0\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 2166,
		"path": "../public/room-assets/premium-gifts/80/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"6f0-VV5ciXfjgbtsJAMJbNCgZD+Judo\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1776,
		"path": "../public/room-assets/premium-gifts/80/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"6d0-LKe53r+Oq6ircsSjtB2kV7Dq1Jc\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1744,
		"path": "../public/room-assets/premium-gifts/80/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"6cc-HORawfuj8ui2SpsLROgvC/kwu04\"",
		"mtime": "2026-10-21T07:17:51.689Z",
		"size": 1740,
		"path": "../public/room-assets/premium-gifts/80/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"5ee-5jQZSwUizzYcL6lb3iJ+2S9iDBY\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1518,
		"path": "../public/room-assets/premium-gifts/80/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"5e8-2HRoV0YEaH7vBTnVUbbV0si5KOA\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1512,
		"path": "../public/room-assets/premium-gifts/80/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"820-DZy9oRw9Vt+4nDYVbMpuMKrcKOc\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 2080,
		"path": "../public/room-assets/premium-gifts/80/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"638-rYd2vjsxImyT5eNAN9ujksXWziw\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1592,
		"path": "../public/room-assets/premium-gifts/80/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_tomato2_v2.webp": {
		"type": "image/webp",
		"etag": "\"726-xt1NKHLPRhOCsQus+JTHHopn7yc\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1830,
		"path": "../public/room-assets/premium-gifts/80/g_p6_tomato2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p6_tomato3_v2.webp": {
		"type": "image/webp",
		"etag": "\"784-cv26Mc4qOw3JIwDDV9CY1L5fl9s\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1924,
		"path": "../public/room-assets/premium-gifts/80/g_p6_tomato3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"638-eDcF7zhye1ceEn9dSDZk2eFHoJ8\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1592,
		"path": "../public/room-assets/premium-gifts/80/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"628-ewNABiQT7UcX8qHutkkEPXiRba8\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1576,
		"path": "../public/room-assets/premium-gifts/80/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"6bc-paG/uz9bgg96BR3On57Yi+EdFTM\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1724,
		"path": "../public/room-assets/premium-gifts/80/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"69c-S4J0QJUeZTUFRYbpnvwxPSw4CoA\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1692,
		"path": "../public/room-assets/premium-gifts/80/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"68c-xZv5I96h1qHGzudw2bNCg1P+K54\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1676,
		"path": "../public/room-assets/premium-gifts/80/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"81a-IARsyVYEclEVrOt2D4VetdGas80\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 2074,
		"path": "../public/room-assets/premium-gifts/80/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"690-xzZkURZgejvcKgG4oMND/q5NPIM\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1680,
		"path": "../public/room-assets/premium-gifts/80/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"702-31XQfoAExponEs+fXwilN2/ZQGc\"",
		"mtime": "2026-10-21T07:17:51.693Z",
		"size": 1794,
		"path": "../public/room-assets/premium-gifts/80/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"61e-p8nzya9Ciw77HbpBHuRVFf2GaVU\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1566,
		"path": "../public/room-assets/premium-gifts/80/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"658-PI0KoC86HZzLj4qgk+Mp3asPiRY\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1624,
		"path": "../public/room-assets/premium-gifts/80/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"6a6-wrefhArvIcX3635uhC9EEtbVVLw\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1702,
		"path": "../public/room-assets/premium-gifts/80/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"776-JHJ6r9n+S7kbN4J9k+m0FDUAC2k\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1910,
		"path": "../public/room-assets/premium-gifts/80/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"6ce-OgYFc5G+9KnNcIhDdbDS5r7LJ0A\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1742,
		"path": "../public/room-assets/premium-gifts/80/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"728-kXGCe5cfP/tPZ3k5UeXb/QLuAHI\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1832,
		"path": "../public/room-assets/premium-gifts/80/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"7f2-/RvuNgY5LO6vHoS3qikcLo9WD80\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 2034,
		"path": "../public/room-assets/premium-gifts/80/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"656-43jgmB5iBzVa5kb8Tv1LvykG980\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1622,
		"path": "../public/room-assets/premium-gifts/80/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"6ae-qW8e5xdRJlHWVvgrPsyDu3FVUbo\"",
		"mtime": "2026-10-21T07:17:51.697Z",
		"size": 1710,
		"path": "../public/room-assets/premium-gifts/80/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"6e2-r1pTBZ+QZiVG9/MbSL2xmovKUO4\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1762,
		"path": "../public/room-assets/premium-gifts/80/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"942-XPRZhNxmMlZjg7M6C1DEiPQuR/c\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 2370,
		"path": "../public/room-assets/premium-gifts/80/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"6d6-UHbJiDCI3fbSmq8081ZXCGsjewg\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1750,
		"path": "../public/room-assets/premium-gifts/80/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"67a-zSu8/8T//dd+W3OB+54GXsHATP8\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1658,
		"path": "../public/room-assets/premium-gifts/80/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"64e-etqY7f57dy6jIg2S4HEzD+Vpgs4\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1614,
		"path": "../public/room-assets/premium-gifts/80/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"6b8-0Ol+bUSkcrm6EVVzRmqDh+bwChk\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1720,
		"path": "../public/room-assets/premium-gifts/80/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"6da-zm8kKJcwOVWtkKoeFQEUsw4DpZw\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1754,
		"path": "../public/room-assets/premium-gifts/80/g_p71_nipple2.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"68a-wcLjb+siF0ISZNa8W4aKKkROhiU\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1674,
		"path": "../public/room-assets/premium-gifts/80/g_p71_nipple3.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"5f0-6/5CtcxPb0Izy5RSkZ1GolS/qKI\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1520,
		"path": "../public/room-assets/premium-gifts/80/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"70c-VXUIyLtlBFV3YOoxY1ZHZo8quM8\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1804,
		"path": "../public/room-assets/premium-gifts/80/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"6e6-9/M7PqfQULOGh55QCZNG8vNb4rI\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1766,
		"path": "../public/room-assets/premium-gifts/80/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"65e-lvFbFqVHfXkoDg2PXDZ3CmKcr/o\"",
		"mtime": "2026-10-21T07:17:51.701Z",
		"size": 1630,
		"path": "../public/room-assets/premium-gifts/80/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/80/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"78c-XB3FZ6RtIjirPBwWbeRdv+CjRZM\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1932,
		"path": "../public/room-assets/premium-gifts/80/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"520-Nico4HYE+za8cwxOnzGprPdaHhI\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1312,
		"path": "../public/room-assets/premium-gifts/80/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"4f2-CzxdaKXBTqp3ZDt9S486R2C78Dc\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1266,
		"path": "../public/room-assets/premium-gifts/80/g_p72_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"508-2E6k2HuQLiJaMKLWvvh/BdMTw10\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1288,
		"path": "../public/room-assets/premium-gifts/80/g_p72_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"51a-vULohX7SxHN+9Vx+NniKDCIwscs\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1306,
		"path": "../public/room-assets/premium-gifts/80/g_p72_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"510-VpJhO2WhSM/3DgNy6LGZF70GCoA\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1296,
		"path": "../public/room-assets/premium-gifts/80/g_p72_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"978-5C3bleXxeCBGbXG/UkH8S1fQYw4\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 2424,
		"path": "../public/room-assets/premium-gifts/80/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"666-NgrIiZerriUs2pQZf8Fu3wR50Q0\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1638,
		"path": "../public/room-assets/premium-gifts/80/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"6be-Zw/DD3g4cwdy5bKJY0V6cN7oO7g\"",
		"mtime": "2026-10-21T07:17:51.705Z",
		"size": 1726,
		"path": "../public/room-assets/premium-gifts/80/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"6c0-o7F3Gmx/oyTAT2co1MblwTNYiPs\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1728,
		"path": "../public/room-assets/premium-gifts/80/g_p72_nipple2.webp"
	},
	"/room-assets/premium-gifts/80/g_p72_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"6a8-d7GJfoyKdxGed0pIDIOXm/44gRc\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1704,
		"path": "../public/room-assets/premium-gifts/80/g_p72_nipple3.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"530-zIF4jxR72rw3LuVWwDHkGFPn2zs\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1328,
		"path": "../public/room-assets/premium-gifts/80/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"4fa-HV9gZcWN00ysoB8c53IJvxRndU0\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1274,
		"path": "../public/room-assets/premium-gifts/80/g_p73_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"51a-imh9kTz+jsdwd5woAq7jgiGlXQs\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1306,
		"path": "../public/room-assets/premium-gifts/80/g_p73_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"53c-NM+Vn94vMlo8KNOzRz/G5LEjEuE\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1340,
		"path": "../public/room-assets/premium-gifts/80/g_p73_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"520-hDu1dC72vdMFQFLngsc0qgE085E\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1312,
		"path": "../public/room-assets/premium-gifts/80/g_p73_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"7c0-WqLBZcb+ACZTug0gBVDmcnrA9AA\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1984,
		"path": "../public/room-assets/premium-gifts/80/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"6c8-JtdwRVDD/orx5B0jFH09LfpQl54\"",
		"mtime": "2026-10-21T07:17:51.713Z",
		"size": 1736,
		"path": "../public/room-assets/premium-gifts/80/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"6e6-4jHhKO4aFb7mpnyNijkk3OYsf2c\"",
		"mtime": "2026-10-21T07:17:51.713Z",
		"size": 1766,
		"path": "../public/room-assets/premium-gifts/80/g_p73_nipple2.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"6c2-Trmm3KeD0TJikRPUM7w3Q2pFspY\"",
		"mtime": "2026-10-21T07:17:51.709Z",
		"size": 1730,
		"path": "../public/room-assets/premium-gifts/80/g_p73_nipple3.webp"
	},
	"/room-assets/premium-gifts/80/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"7cc-Gt58UIXXi37MWNRH1g7rKD9ic/E\"",
		"mtime": "2026-10-21T07:17:51.713Z",
		"size": 1996,
		"path": "../public/room-assets/premium-gifts/80/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"532-BXGXIuEbkBpg4DrdZgiLvd3OjMY\"",
		"mtime": "2026-10-21T07:17:51.713Z",
		"size": 1330,
		"path": "../public/room-assets/premium-gifts/80/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"524-9V4cc+lvYwiXtIM07qbsb2q7Rq8\"",
		"mtime": "2026-10-21T07:17:51.713Z",
		"size": 1316,
		"path": "../public/room-assets/premium-gifts/80/g_p74_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"56e-KeKXaN0LJWWmiNBLJ1Bi2N5/Y94\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1390,
		"path": "../public/room-assets/premium-gifts/80/g_p74_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"546-gU86Ub5yoCnkks0OI3GUagg3emQ\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1350,
		"path": "../public/room-assets/premium-gifts/80/g_p74_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"53c-0NijcxvlgAZISfQmKysSlsMTJaU\"",
		"mtime": "2026-10-21T07:17:51.713Z",
		"size": 1340,
		"path": "../public/room-assets/premium-gifts/80/g_p74_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"7f2-Oi9p+31XUpKgwqad7+m7Yj1K7mQ\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 2034,
		"path": "../public/room-assets/premium-gifts/80/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"71a-wr54cVq98o6Sq2LOKX5sXX07jh8\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1818,
		"path": "../public/room-assets/premium-gifts/80/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"710-IYhfOCsabwsHJUHM6l/rIs51NcU\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1808,
		"path": "../public/room-assets/premium-gifts/80/g_p74_nipple2.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"722-IXTlF9vDboyvHPZRuJJYRCRiY1Y\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 1826,
		"path": "../public/room-assets/premium-gifts/80/g_p74_nipple3.webp"
	},
	"/room-assets/premium-gifts/80/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"6cc-3bWIh8YI7Xv3+S7h7pINv1Ct8TA\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1740,
		"path": "../public/room-assets/premium-gifts/80/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/80/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"52c-mf1jEIhuUB9WUAXNN/5xec798g8\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1324,
		"path": "../public/room-assets/premium-gifts/80/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p75_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"514-9R/ZQRfXKVltFU8TTNgO7sFOlz0\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1300,
		"path": "../public/room-assets/premium-gifts/80/g_p75_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p75_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"53c-BSIFB9434vMPTPnBrQUFutnrB7I\"",
		"mtime": "2026-10-21T07:17:51.717Z",
		"size": 1340,
		"path": "../public/room-assets/premium-gifts/80/g_p75_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p75_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"534-2hV4pdOLy02FvZu97mpR+dxUMGE\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1332,
		"path": "../public/room-assets/premium-gifts/80/g_p75_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/80/g_p75_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"520-bd70GNzSD4fgPJ5ARClGW70hejM\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1312,
		"path": "../public/room-assets/premium-gifts/80/g_p75_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"728-u60z1rWyGcdBDppgOmiyzriBfxs\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1832,
		"path": "../public/room-assets/premium-gifts/80/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/80/g_p76_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"4dc-w6soY23RpRwgEFQJIdS1TOq1DS4\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1244,
		"path": "../public/room-assets/premium-gifts/80/g_p76_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p76_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"502-iGnMhM1cVwF9/t1NHjelYPU6zmc\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1282,
		"path": "../public/room-assets/premium-gifts/80/g_p76_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p76_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"4fc-MCojtkeQILlJeHVnz6OKEPg8IvY\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1276,
		"path": "../public/room-assets/premium-gifts/80/g_p76_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/80/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"4f6-Ps3ds4RCLTl6M0f8ztNyAvPuhpw\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1270,
		"path": "../public/room-assets/premium-gifts/80/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p76_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"50e-pO39hDhZoMJ6wk27XZbcsx0RwhU\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1294,
		"path": "../public/room-assets/premium-gifts/80/g_p76_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"5c2-NLFcnXjNfVfR4fxDhnQAWRXW0Bg\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1474,
		"path": "../public/room-assets/premium-gifts/80/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/80/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"4ae-iEWYQCZE/sICu1aVlJT2XauVBJI\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1198,
		"path": "../public/room-assets/premium-gifts/80/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p77_air_kiss2_v2.webp": {
		"type": "image/webp",
		"etag": "\"48a-Ab0YxXTx3jTSLsZITNfu73YGTBo\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1162,
		"path": "../public/room-assets/premium-gifts/80/g_p77_air_kiss2_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p77_air_kiss3_v2.webp": {
		"type": "image/webp",
		"etag": "\"496-9QgbuMQNamh71PdR3LmtLR3WFeI\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 1174,
		"path": "../public/room-assets/premium-gifts/80/g_p77_air_kiss3_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p77_air_kiss4_v3.webp": {
		"type": "image/webp",
		"etag": "\"498-nzyCL97m2ap+ikkKvCCdhSQblEM\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 1176,
		"path": "../public/room-assets/premium-gifts/80/g_p77_air_kiss4_v3.webp"
	},
	"/room-assets/premium-gifts/80/g_p77_air_kiss5_v2.webp": {
		"type": "image/webp",
		"etag": "\"496-idMZQFKRoeSHlbz8c8hZ084Iltc\"",
		"mtime": "2026-10-21T07:17:51.721Z",
		"size": 1174,
		"path": "../public/room-assets/premium-gifts/80/g_p77_air_kiss5_v2.webp"
	},
	"/room-assets/premium-gifts/80/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"6e0-84GNrQEjiYWgWggYZbawElbt/RQ\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 1760,
		"path": "../public/room-assets/premium-gifts/80/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/80/g_p78_nipple2.webp": {
		"type": "image/webp",
		"etag": "\"6f0-bKfQcfdmy0/xBUjlnmxFXFF3Kno\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 1776,
		"path": "../public/room-assets/premium-gifts/80/g_p78_nipple2.webp"
	},
	"/room-assets/premium-gifts/80/g_p78_nipple3.webp": {
		"type": "image/webp",
		"etag": "\"6e2-xdPZn+gvLqS+ghVf7EkC9JAoENQ\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 1762,
		"path": "../public/room-assets/premium-gifts/80/g_p78_nipple3.webp"
	},
	"/room-assets/premium-gifts/80/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"6ee-/ahwNSHweyEQ+DC0NGtMRq5/y5Y\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 1774,
		"path": "../public/room-assets/premium-gifts/80/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"86c-waq5lI35spVwb+SXYrpXL3C23PM\"",
		"mtime": "2026-10-21T07:17:49.949Z",
		"size": 2156,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"936-8n9Dg2L8bll35gLYtntZ54krO2Y\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 2358,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"bde-UxivbuAr4j9eksgkCKp3ynOIEzY\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 3038,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"7e2-JCoIPcD0CKNzXZIVYS4in8OVW08\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 2018,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"a1e-LDfi8Enh+DTwmst4nDfLBnFbMmg\"",
		"mtime": "2026-10-21T07:17:51.641Z",
		"size": 2590,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1018-vHoxgYxIn75vUp2BIIJsmRJ8pdQ\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 4120,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"834-bNlBXdrjI2d+iU3hSsk9y5w73/U\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2100,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"788-jo+QGJDL9BOsEkqTIijieUS3Vek\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 1928,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"a86-VYM+5kfD2nIz7M1xAfYLkpN9aOA\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2694,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_salute1.webp": {
		"type": "image/webp",
		"etag": "\"a16-BLoP5CG62y+5RIEk46vA8TZ6eHc\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2582,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_salute1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"77a-1wZiNETVDQwqZ4nyEWWq2u0lBck\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 1914,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"802-nH+RPvghq2y04OTYJ4OdO3+9mbA\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2050,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"b74-nX/KUCNqsv2oNgxGvwyC+j+1YpA\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2932,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"80c-QT2e0xg6KQ/1yoPlX3dAsVTsCYI\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2060,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"796-JBoZqWF84v2hyb+N7FgowYpTV2U\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 1942,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"cdc-+hywFN3WOapho0wqztxyceAB284\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 3292,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"acc-pgX+Okih9l8USWPWcOgeGXIgAok\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2764,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"80c-5jXFnHUrfXzpNDbVs+ap1DhpPH8\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2060,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"e78-V8MDGh0MkZK+fHr+GGUNhhs+hl8\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 3704,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"9f2-zCtftq13QMqeVBI9/EqS1HwRtKw\"",
		"mtime": "2026-10-21T07:17:51.645Z",
		"size": 2546,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"ab4-lRLnFk0gG/a/O/XsbaY2lQNis4A\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 2740,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"c30-H2srDGsBDaNXViuvn5wC+myh5Hs\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 3120,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"a0a-yeZk1cVDXhgZxGRv6sHbUvi5cBs\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 2570,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"770-863Hhq2Bivldh89YwfPfkwkWvrs\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 1904,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"6fe-HVf57kO+BXEQ/HmREQydezYL/1A\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 1790,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"ad2-QWocOOltOv9QXJgVVbcZY83Gg8g\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 2770,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"ae4-ZGc0UT6zFwym9MRXE3orBmL9F7c\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 2788,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"d16-sOkHfMocarPp3+dSBr7ZFX82SPA\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 3350,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"76c-Dpv3WrHNj0v/CXnnvKMA+7nnKBQ\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 1900,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"ba4-bfEsDbs/xEAVY7T44uGP8binPcg\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 2980,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"ee6-dZgPlCQqTYO5WLbz5NSETh1cF54\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 3814,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"988-ml6pyAZKaZ0Nn4Bjl8UL8Er8arM\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 2440,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"bca-IEflMjihcDgZ0pGO9KdAd8AGMUk\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 3018,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"818-9WDDq4bieENOCXKxdAQZqGIWFx8\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 2072,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_salute1.webp": {
		"type": "image/webp",
		"etag": "\"fde-aYrtPyKfS3yyPCDKXI+MOwoWYY8\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 4062,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_salute1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"115c-9eZm43T2pLQWR3HmYr9dt9BBx/0\"",
		"mtime": "2026-10-21T07:17:51.649Z",
		"size": 4444,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"cb0-4M5UcGO+bbgPAC+aDJ/bNX7+MHg\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 3248,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"e8c-v0Jwnttp2lH8EAu5sAhZjBamzuE\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 3724,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"b94-EELxH3yc/q8O46wm196PRI8GUIk\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 2964,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"dfa-9Cbm/xZaUd6nvx04OAV1xS+ABC4\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 3578,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"13ee-C8mg1/pXfj3Ix83ftXLrwVOvyTc\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 5102,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"e46-q0TpEwDHNOqpJPw3UenzFEa6ImA\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 3654,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"fd0-S1rm3Xbbh5jWGk1ikuxBuzBHPtQ\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 4048,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1566-rKr/y2ZxCCxifIoeeX9lzqU2n+o\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 5478,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"fb0-GXqVEh3BqeXxJ9ES6KqtqpGw4is\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 4016,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"efe-qpj+KnDlAmJN6dBkAQYhgow4qIk\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 3838,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"10c6-jF8SoOiDagdG1By2VfRSTkXFEsU\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 4294,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"1004-5WdwBvaiCw8g5gHk5qUT027SIFo\"",
		"mtime": "2026-10-21T07:17:51.653Z",
		"size": 4100,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"17e8-bxTPYUH4+46nHIZnraZqtnMifyg\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 6120,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"c4e-DGk+0jPyAmT8PNEZj+K5YFGH7vU\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 3150,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"b10-hNUf7D5pXda7V+fJvX+MOztz4YQ\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 2832,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"d10-pOTds0LB9VACn2ZaIVcyqbKnP00\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 3344,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"d22-a+UC1ekc+PAtfPXXsuzOrSITIvA\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 3362,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"ce4-2qg7aJQ1eBshPn6t6oQdngPyO5Y\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 3300,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"10fe-LSNjVDdn73Uldmrv1P/7G+0jV5o\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 4350,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"c92-jWfWR10oHQvyVft1KdqpW64ku7E\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 3218,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"e0e-XL7j4sUgF7z3o9RGUC+X7g4Lmxg\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 3598,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"c6c-4h6ix3aZRTDIuc1NjtXcKdUpR5I\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 3180,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"b2c-JSC+gjmF7eNruGn5d0EPBglZw4Y\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 2860,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1192-gTJnLYBLBmQZ86Ex6ofvGMwRzcI\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 4498,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"fe6-NXpMheDNgFpcKPedwA9AZlcUVuE\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 4070,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"11cc-irFP0bJD0fIVk+a530Wiv0Hc+G0\"",
		"mtime": "2026-10-21T07:17:51.657Z",
		"size": 4556,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"108a-dWoWtq+oihvJ4wKVJQ3HQzQ2l9s\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 4234,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"fee-r7dMTM53OlJaRyawk7pEQWcDk0c\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 4078,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"d24-p960CDwrYaoPhxwS1eJRdDK3z1I\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 3364,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"dce-c7HWObzWMk5CQOUzp8DFwKf3Rac\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 3534,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"12ea-6ukDN6Ih95tLwfgUYV0k1zgwi/Q\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 4842,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"cb8-nENgVLWJdXt3PDn+3zZjv/YRbfA\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 3256,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"e30-hl1+Z101gZjyP0r3YBWI/ioDWlg\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 3632,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"b12-VagyAzVqe4Ci2+s+r3HfQ6jH5ic\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 2834,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"d6c-MRiZ1z5R9wIs0qKN6OWcZOk5YP8\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 3436,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"fa8-1GH1p0DZBFwDYTPbiHbo/Os3knc\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 4008,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"bd2-iHczmEMrI6nucBdgq88edtJ7O/Q\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 3026,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"1012-JeOBFJUSYFz5iWJYm85KWIMH5/I\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 4114,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"eb6-zdmqD7gPT+3Z1zwePXQGJx1L6rs\"",
		"mtime": "2026-10-21T07:17:51.661Z",
		"size": 3766,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"d84-gaRNvIHuIH9Qtj4gwSu1kpFgKKQ\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3460,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"12ee-HQNM5YA/vA5hOjl+F77YVsA1zsw\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 4846,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"f7a-HltXhXgRlUCjx2DqNUP2JaW1LLA\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3962,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"11c0-wRnO50U9IWLw26OJl5l6TpqhGNY\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 4544,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"bd8-8hZhFdhbUGrCuKt8zLdCMyI0wG4\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3032,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"f64-4oKkdBwQ+xDY7isz3+CiRNYt6hI\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3940,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"fc6-F/kkXKeAQMV0CyVibc7sZAXeltQ\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 4038,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"c7a-XtSuWf/dLEfpwnd+qh93ids++4E\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3194,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"fda-G+tKJlS1UyiSWYWBBe7k5UDme5E\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 4058,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"ce6-ZaYb53YRbmCiZD3Op4PyTzhO0Ss\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3302,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"f94-l2nOtIxSy78Vx4/mpRv1T37eMBE\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3988,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"e68-612hOyECU8PYQiBeX/bYM7UanPA\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 3688,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"10ba-AHCF3W+X00G84YmT9KlDo03N1Kk\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 4282,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"10f4-poRVCmltFXasB8fU0RcwvoCROoQ\"",
		"mtime": "2026-10-21T07:17:51.665Z",
		"size": 4340,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"fae-3di3kaCXwwz9mvwuh2f3h8XlL8o\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 4014,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"afc-6VVTorKJfkpqiFCnn2TDg0mrvco\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 2812,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"edc-kf8sz9Khvcmn/vL/E2bU4ruH8Es\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 3804,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"ddc-XbzFo8yPjI0eVZ5sRwCS/rHNqxg\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 3548,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"cb6-5DNu4fk/uZvqoEeHEyba+KC6b8s\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 3254,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"102a-2ihWHTioQa36KZYFheuKnN+7KaM\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 4138,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg100/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"e7c-ePoOMVfva035NLo2EwDTT2+SQZI\"",
		"mtime": "2026-10-21T07:17:51.669Z",
		"size": 3708,
		"path": "../public/room-assets/premium-gifts/dlg100/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"e22-3z/p7HrtP5oTFTmlA11LhHb+B30\"",
		"mtime": "2026-10-21T07:17:49.977Z",
		"size": 3618,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"10c4-E/fB3BQZay1Q/pPcAVz2cjr9FdM\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 4292,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"146c-5/G2m9wtNkQAjTEgAvbcdGhxJVc\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 5228,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"d5e-2l131rUNjoxIC1imSIjbM8X/G4U\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 3422,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"1320-atEwkDOnsIHJ7qFnVMzY6RrRzpQ\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 4896,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1ebe-LnZPBxj2WKmTdGX1FneUsRYAi3Q\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 7870,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"e34-Js2YgMn+dZrDIicvckhJp8rys18\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 3636,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"cf0-flsu2tOR5upwfsttFtQmeTxdTBI\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 3312,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"1412-aO57Xi7PrfSy1o5zz6EA/JJtOio\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 5138,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_salute1.webp": {
		"type": "image/webp",
		"etag": "\"1232-GirGSx0HrFAzpTVoC4fBl6hpCgY\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 4658,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_salute1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"cbe-7yesxhe8aGnkpP1ma0ujSh6FRJ0\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 3262,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"d86-iJioeWWuIWcweCS9Y6ZM+hH3Bg4\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 3462,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"15ec-xItXFdUdDjf3MVyFBjLF2fohEWI\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 5612,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"ec8-DwEu2ztdpX12A/dGrKEDq1Cr1mg\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 3784,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"d66-DCBLP/0lgiY76OGuuRN+VZY11vA\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 3430,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"1832-LUsVPJAwkVLuIx4JBcAvFfAfuGU\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 6194,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"15a4-CQZ7/tus0iUKQL9c4uS61JFo6IU\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 5540,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"e18-QfihT/yPkV42nzxnxAAkfOQwdHU\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 3608,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"1e30-OxLpWySlitE63Mf1im/dh53tIRc\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 7728,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"11fe-Fyg3jmJGAG+84e8uS2baBwpmQJI\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 4606,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"184e-6/HG6dESXim3tJVf547fkc0ePc4\"",
		"mtime": "2026-10-21T07:17:51.765Z",
		"size": 6222,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"19b6-queh0O019E56+AcQ34AEZ9ym9uo\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 6582,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"177c-j2ncIErtdatQByTuIoeExkUfvz8\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 6012,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"cae-TvqHl3WbCFNoKgJJonLPY/zmHyA\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 3246,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"c70-913VicAZyEE9XwV86Qsratj25X0\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 3184,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"14e0-VVmcda/6G1LNyx4kF5aALhgZtGI\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 5344,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"1b04-mW+YUDO0PxvtcicM/jxVBWi7IdU\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 6916,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"1772-sK7RSZydZu4El0w24mgM2DaU9oc\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 6002,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"d22-j4hebxMgm29yDuKKQgE+QqqKFUs\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 3362,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"14ea-qwqns25HPGR1ISHSJ6zVAtJw+dg\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 5354,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"1c1e-IadIuMu44ddJp9+8nwgxdpR43Ko\"",
		"mtime": "2026-10-21T07:17:51.769Z",
		"size": 7198,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"11d2-TV6RQBmXqf4InCMN7hw4UEkB0R0\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 4562,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"19ba-2Oh4Gj1dS9o7AelvFPPRv44Oxx0\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 6586,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"eea-l/ZBcHgmNpoMi7g41hZwAApBIzw\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 3818,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_salute1.webp": {
		"type": "image/webp",
		"etag": "\"1fb6-FDnPaiVSn47KBi8G6Fc30VXeowI\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 8118,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_salute1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"2ca4-xfROC6FgGmuuvkksaqoP9LnLYXY\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 11428,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"17da-lHi0gx2auus2NMBHEjVDHgnCuA0\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 6106,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"21c6-tWSAPuK7RqXpq3cH6bwlHEqROhs\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 8646,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"1baa-m6gbmHyKswf1JvyV59kGh8AYe4A\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 7082,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"20b0-RT/2sng7g9c6sDKSNs7UR6dja5A\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 8368,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"2fca-DzuyBTKB6eUtdpTbfhT2D4PugdE\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 12234,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"233a-WmjcvhOrx6KC5VkpL71PYx0X5a4\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 9018,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"28da-67Etu3w2610uI2y6hFp13I0G8kk\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 10458,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"34c6-qMDRDJEzwvOO5vtOyQ0Uoe7SCzU\"",
		"mtime": "2026-10-21T07:17:51.773Z",
		"size": 13510,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"2640-UHmX0S+XiLc6xsDhsuqSTX0DJDc\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 9792,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"22aa-PneFOHFmTwZWrE6WZMj1Pb48odY\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 8874,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"29d8-nDtnpEkaUGdHgO9bN7Fxfj3q2Ew\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 10712,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"2770-H8K1icGIVHJH2EsFxm+8RN0Ym7U\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 10096,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"3b12-lg4UK3DVisOQpFYmfPI1tkFrsGQ\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 15122,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"1afa-oBKyVikD4kpCr7v7t7XRleUpXt0\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 6906,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"15b2-6ZT2/2JmyzgAAfxcynbEHQ15kIY\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 5554,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"1b7e-poRsB1rK04XjE5DktpNpLKtUW84\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 7038,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"1bf0-9jEGN3pAEVqyU7OBqDKHEU/QMoE\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 7152,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"1b1a-4boVprgbizxbWqx/DsVp/y55c7s\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 6938,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"29d8-mXYA9yi6LjmrHc7pS+nVXbpN7Wo\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 10712,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"1b2c-dbFtSubdLJAP0lEdKtu3JZmf5jc\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 6956,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"1cc6-4x4OAOin4K53c2P7nCH0S7Na8+s\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 7366,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"1b8a-GwEUHOzW2/4Ixu6K5yizFQMMUwk\"",
		"mtime": "2026-10-21T07:17:51.777Z",
		"size": 7050,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"178e-D+Ve/FJgzt6TtO1qIQRvUter+RY\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 6030,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"25fc-xMDENJa8tOqjLKJ+HX+tCuTC1/k\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 9724,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"238a-vUExshXt++eIt1xk4hhFfxvxAdI\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 9098,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"270e-b4xH2kIRMMZ9WY1boeXujjyFp+g\"",
		"mtime": "2026-10-21T07:17:51.841Z",
		"size": 9998,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"26de-1klEPpqpTS7H/kAdDDUwdoaivNU\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 9950,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"24f4-zluvlAzogmwFzaDh104te5Sm7vg\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 9460,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"1d00-Icd70bSrGkUsXS0HZucwIaYPYiQ\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 7424,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"1f6c-y566WBXqu0COlgGH6sEBBb4cj0M\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 8044,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"2f02-AB1zubNUPQRf+f10fZBSsoHooCk\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 12034,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"1b40-63koPFYKGTYdxwAml13D9px3T9g\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 6976,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"1fda-XFDhKgqnrDlmbHoGvB9SN2BbAN0\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 8154,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"16b8-6QCMTd/OMN3b+DMogjvTk9Fh0Yg\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 5816,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"1c2a-e0/LxHFKVvH6RRrcXCxIKBFP7J4\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 7210,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"2426-SQ2r91hifW3EQAlqE0Sw4FNYdMI\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 9254,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"1aba-ZeI6+LcvnSyWgVDNX9gVsSr39W8\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 6842,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"23da-kCSljfCVdK3HWaZ3Tb4MZO4/gs8\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 9178,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"1f26-TMPB8J1O1BrMMnptr+KLmvy9N5U\"",
		"mtime": "2026-10-21T07:17:51.781Z",
		"size": 7974,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"1c80-HCxCUc7jVc2/LrHdwMd6oEUqR/o\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 7296,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"2e3c-Ur+jU96Ajlt5mS0NmgANUwAkt7A\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 11836,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"2412-cRvLePm6frf83a4ISCp6GqDCBYc\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 9234,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"2900-cEqHHmZloi9rmFYngYfQ/QkXWjY\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 10496,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"19f4-q2MeDTQhkd5bfKIoZTeZls2LYxA\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 6644,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"2408-vZr/F+HDaPq0C8iNnGob3pb9Slk\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 9224,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"24a2-9ND07adIs8UfpJDygVWjjpNkuZ0\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 9378,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"1baa-cdFt21COfLhgXKsLx/EhzPq4mYQ\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 7082,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"24c0-fU3gtdccGMruDLpwUOu20OGT5Lo\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 9408,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"1d42-EyVWvzzG9kgSWaLlFJwEE407Lyk\"",
		"mtime": "2026-10-21T07:17:51.785Z",
		"size": 7490,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"24ae-plkSNBHiMsNpTbeocwRZ4qCCWNw\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 9390,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"20c0-6iURH0puYj0Rd3/NAub0d8dR+Yk\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 8384,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"27a8-9HhVRZmRHdavK2VIPtu1rYhvEr4\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 10152,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"289e-mVu4DILK1zDfsQtyedrHzON+Vpk\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 10398,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"2446-fWRVudnjmLo6LhUhLJletq2gIug\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 9286,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"1800-3dMivFdoHLlaAf8SljqysPHVB5Q\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 6144,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"22b8-3B7yzYNw1ZkwxZcgCCmmo8xZVFk\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 8888,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"2082-TMChBsSnHy/o/l6LNNmx3OdFeRs\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 8322,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"1d8c-TtDNg+CDYYHswpSeVupg/fOiZmg\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 7564,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"2620-FSZSHoH+Wg3gBPk++omu3hTAum4\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 9760,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg200/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"2050-M6yNeZUZSFw3+qMf+BKGtnAz0c4\"",
		"mtime": "2026-10-21T07:17:51.789Z",
		"size": 8272,
		"path": "../public/room-assets/premium-gifts/dlg200/g_p79_latte.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_b52.webp": {
		"type": "image/webp",
		"etag": "\"14b6-4CMOEF8XbKZVCpK5E+HAN34bS3s\"",
		"mtime": "2026-10-21T07:17:49.949Z",
		"size": 5302,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_b52.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"1914-kRo2/BWLVRONNGmA1MCR+8ijF1Q\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 6420,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_bloodymary.webp": {
		"type": "image/webp",
		"etag": "\"1d1c-OK8Qd35EsAORybhufCZQL0Bu6hY\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 7452,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_bloodymary.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_cognacglass.webp": {
		"type": "image/webp",
		"etag": "\"1bfc-jQBOksNnTe9P59CQgMIPIF1rHLk\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 7164,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_cognacglass.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_crown1.webp": {
		"type": "image/webp",
		"etag": "\"2f6c-Wx9dJ2RkbSfsMJBvXNNwkT+pRls\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 12140,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_champagne.webp": {
		"type": "image/webp",
		"etag": "\"11fc-XhqNu7V/GmIXiTwjIzLR/yW1TvM\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 4604,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_champagne.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_martini.webp": {
		"type": "image/webp",
		"etag": "\"1552-U1SL1HuoNXuFMS/egGASez/LhYo\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 5458,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_martini.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_mojito.webp": {
		"type": "image/webp",
		"etag": "\"1232-1gpT2yuVJrdk9NmQ1avxwYSBIgY\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 4658,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_mojito.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_pinacolada.webp": {
		"type": "image/webp",
		"etag": "\"1be0-IGqBUT7C0YoK6+oDlb4jTGEqJQw\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 7136,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_pinacolada.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_salute1.webp": {
		"type": "image/webp",
		"etag": "\"1a6c-duVc8qnHRxpnhBbFZVmqkhEUszo\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 6764,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_salute1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_sigara.webp": {
		"type": "image/webp",
		"etag": "\"12ce-cCYEcwp0oPN+GktAFwh0el5/ryk\"",
		"mtime": "2026-10-21T07:17:51.725Z",
		"size": 4814,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_sigara.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_vipchampagne.webp": {
		"type": "image/webp",
		"etag": "\"12a8-93Da09Yg2pDf0WcV6afxZpgpdKM\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 4776,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_vipchampagne.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_whiskey.webp": {
		"type": "image/webp",
		"etag": "\"2030-Hf5D+TEc2ulOuPu/TMNqVQI3nJg\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 8240,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_whiskey.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p1_wine.webp": {
		"type": "image/webp",
		"etag": "\"1360-BwXFOOF3f2nIRTRTDdzvXqu/AaU\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 4960,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p1_wine.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_birthdaycake_v2.webp": {
		"type": "image/webp",
		"etag": "\"1316-IFqDBLY+wMSyTDzqyynckJ3CHC8\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 4886,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_birthdaycake_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"26ea-cKUsOxUWFJ/JmqF9n2sx7jr8oK8\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 9962,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"23d8-CAtk4dYfhyeKMerS1xpSF+xeUXg\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 9176,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_champagne.webp": {
		"type": "image/webp",
		"etag": "\"13c8-h1tmHrdYA3cNgaT4hPLSghMzMFU\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 5064,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_champagne.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_crown1.webp": {
		"type": "image/webp",
		"etag": "\"303c-P3G2QEUCIXvXvUb8GUJy/o5CscQ\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 12348,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_diamond.webp": {
		"type": "image/webp",
		"etag": "\"1b0a-8gnDk9OTZmFz+b/zzi/FWaxTEkE\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 6922,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_diamond.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_dollar.webp": {
		"type": "image/webp",
		"etag": "\"26a8-NdpW9ajBh8ONeakUmGC11l+nX+w\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 9896,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_dollar.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_dove.webp": {
		"type": "image/webp",
		"etag": "\"2696-3WHwOlyVPWfjyz3cvxFy6Y717Dk\"",
		"mtime": "2026-10-21T07:17:51.729Z",
		"size": 9878,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_dove.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_eiffeltower.webp": {
		"type": "image/webp",
		"etag": "\"274e-I1Gu0LCp1GkunS2ugE+UgHx0aoU\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 10062,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_eiffeltower.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_flagaz.webp": {
		"type": "image/webp",
		"etag": "\"10f8-S9agmYQr28gSxQlp/hMaVd/xQps\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 4344,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_flagaz.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_flagge.webp": {
		"type": "image/webp",
		"etag": "\"1202-5XIOUw2ZBRRpdU+xMCZ7R+/GyAc\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 4610,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_flagge.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_genielamp_v2.webp": {
		"type": "image/webp",
		"etag": "\"1f44-O1mRWi4zMatGf5pT0onn1iSKp+0\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 8004,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_genielamp_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_goldenmic.webp": {
		"type": "image/webp",
		"etag": "\"2e2a-tmGtHiLZwCXVtnL9qeeNKsQ+bEA\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 11818,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_goldenmic.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_goldstar.webp": {
		"type": "image/webp",
		"etag": "\"21fa-vDuaSiAG2dXU8vdZsPoqE36kJX8\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 8698,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_goldstar.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_heartangel.webp": {
		"type": "image/webp",
		"etag": "\"1278-jJZ5fkA+NKWLjz3u7orIUrzxUZ4\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 4728,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_heartangel.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_heartlock.webp": {
		"type": "image/webp",
		"etag": "\"1f9e-cH3i9v44BtKRLNwSsQ9tk1zJmto\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 8094,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_heartlock.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_iloveyou.webp": {
		"type": "image/webp",
		"etag": "\"2cb0-lOSaEYKO3+aPtGBn7bAkdtxsIOM\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 11440,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_iloveyou.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_leaf1_v2.webp": {
		"type": "image/webp",
		"etag": "\"188a-UOKvsrq5tOrpmWngbAVcZs4iBbY\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 6282,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_leaf1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_mobile1.webp": {
		"type": "image/webp",
		"etag": "\"2ad2-s/48Bm3hxIvKluP2LGBUde/2bMs\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 10962,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_mobile1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_rose4_v2.webp": {
		"type": "image/webp",
		"etag": "\"13be-7j3w+2TsRE9x3sX8SubpyRY0QAQ\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 5054,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_rose4_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_salute1.webp": {
		"type": "image/webp",
		"etag": "\"3046-Dz0JG/lQ0JpAYdp6fDZ0leiE+Uo\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 12358,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_salute1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_snowball1.webp": {
		"type": "image/webp",
		"etag": "\"4de2-31EJn4mTnqu+PATOEXUKCZyRIC4\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 19938,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_snowball1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p2_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"24d8-rG/Yth06p9C9BEb3W/pd+x33gkA\"",
		"mtime": "2026-10-21T07:17:51.733Z",
		"size": 9432,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p2_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"3d1c-qTaoqh5FusMIO7GnQLKSt2T+dL0\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 15644,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"2fdc-F3echrdRchULvk/LcX07RbK3JjI\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 12252,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_blackring.webp": {
		"type": "image/webp",
		"etag": "\"39b8-9sw6OY54QNhCkf8qtqw0XPjJKrg\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 14776,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_blackring.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_bouquet2_v2.webp": {
		"type": "image/webp",
		"etag": "\"53ba-knpRd5TIEquJqdqzi7cI8OxtFYA\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 21434,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_bouquet2_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_bouquet_v2.webp": {
		"type": "image/webp",
		"etag": "\"3e66-YI1pPdOYXX70pIpQjlGhIvD3Thw\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 15974,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_bouquet_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_clutch.webp": {
		"type": "image/webp",
		"etag": "\"49ce-1rCv7qUYuzLe72kJZybL51ggX+s\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 18894,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_clutch.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_crown1.webp": {
		"type": "image/webp",
		"etag": "\"5b74-M02+NBkwIQ31sQHorAfJ4ylXfuA\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 23412,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_crown2.webp": {
		"type": "image/webp",
		"etag": "\"45d4-wY5+OUVBj1jhnk0k9j3PoVzo8ig\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 17876,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_crown2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_diamond.webp": {
		"type": "image/webp",
		"etag": "\"3b6c-xCBNSzgddUg3B8HlPTqB6fTp9uw\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 15212,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_diamond.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_diamondgift.webp": {
		"type": "image/webp",
		"etag": "\"4b9a-eFTcqrNfjf+kzFNppKirpITlAls\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 19354,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_diamondgift.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_djcap.webp": {
		"type": "image/webp",
		"etag": "\"4618-WYSBx0bKEOyD74YqZ536kcktXWo\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 17944,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_djcap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p6_tomato1_v2.webp": {
		"type": "image/webp",
		"etag": "\"62fa-heDNU21FNgdsy/53quuzzQIOFog\"",
		"mtime": "2026-10-21T07:17:51.737Z",
		"size": 25338,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p6_tomato1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_babecap.webp": {
		"type": "image/webp",
		"etag": "\"2cdc-VeYyRnxS8RcutJS4EazFczoLaaM\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 11484,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_babecap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_baseball1.webp": {
		"type": "image/webp",
		"etag": "\"23f8-jBeBo6JxItIP9g9tpx6NFsOZGx8\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 9208,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_baseball1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_baseball4.webp": {
		"type": "image/webp",
		"etag": "\"2fcc-+Ly1dlzvD1taDU7Z4PwclEDFDXA\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 12236,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_baseball4.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_baseball5.webp": {
		"type": "image/webp",
		"etag": "\"2dcc-nZSI87Bw4sJABmkAhYHrIfB7Rdo\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 11724,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_baseball5.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_baseball6.webp": {
		"type": "image/webp",
		"etag": "\"2e00-vqvRKwEleo0T/R9EqOn/rJipJHM\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 11776,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_baseball6.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_blackcrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"49f2-/lavoHK8g4G7ZXadKnwv7lGD0tc\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 18930,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_blackcrown_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_blackoverlordcap_v2.webp": {
		"type": "image/webp",
		"etag": "\"2da2-QkJ8GSuEkZjqNZ3PLlHrIgtxceE\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 11682,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_blackoverlordcap_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_bosscap.webp": {
		"type": "image/webp",
		"etag": "\"2ee0-+iHDcO7exSERT1qDiduQfqJZQyA\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 12e3,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_bosscap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_boybyecap.webp": {
		"type": "image/webp",
		"etag": "\"2ec4-8pXnk9Y1bJg6XEBUDmv2Io/6evs\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 11972,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_boybyecap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_cappy_v2.webp": {
		"type": "image/webp",
		"etag": "\"2702-4Gw00o63dt0p52LRPCHRJTfKZvg\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 9986,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_cappy_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_crown1.webp": {
		"type": "image/webp",
		"etag": "\"3e5c-GXduEj9sjsyZCMjNJItzySRlAlE\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 15964,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_crown1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_crown2.webp": {
		"type": "image/webp",
		"etag": "\"3ba8-/TagOYN2cuHDlMvQeCgtMB9HgOc\"",
		"mtime": "2026-10-21T07:17:51.741Z",
		"size": 15272,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_crown2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_crown3.webp": {
		"type": "image/webp",
		"etag": "\"4126-z+G1up7a+7TCxTLSJX/+EHlAPnA\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 16678,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_crown3.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_crown4.webp": {
		"type": "image/webp",
		"etag": "\"427a-/Ur7/wMzm+vmn+X2mNXFigRRG5E\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 17018,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_crown4.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_djcap.webp": {
		"type": "image/webp",
		"etag": "\"3ebe-Wy05YzwHZPgMCiyxyWa84uoz8JY\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 16062,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_djcap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_goodenuffcap.webp": {
		"type": "image/webp",
		"etag": "\"313e-6GHeT77BMwGmAZEuxaFzSV68yUA\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 12606,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_goodenuffcap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_goodvibescap.webp": {
		"type": "image/webp",
		"etag": "\"3682-/rezwQde9pMZ0QS06lmfLzBycjg\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 13954,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_goodvibescap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_icecrown_v2.webp": {
		"type": "image/webp",
		"etag": "\"521e-W0oNYXpZasGln/xm6ZXz0nTjxoE\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 21022,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_icecrown_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_juice.webp": {
		"type": "image/webp",
		"etag": "\"2c76-++jGaxg8Fb3BgUZ/5D1AfK7wQRI\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 11382,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_juice.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_kingcap.webp": {
		"type": "image/webp",
		"etag": "\"3616-xKSBOgI5B2wn6jJV5mw9rPYz93E\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 13846,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_kingcap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_lenincap_v2.webp": {
		"type": "image/webp",
		"etag": "\"2576-Ub9ek82N0iFTAzYH0Pmt7TLSwUc\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 9590,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_lenincap_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_mrcoolcap.webp": {
		"type": "image/webp",
		"etag": "\"2f90-Q//WTJ74Cua7pH7X16cg7Fg9M6E\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 12176,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_mrcoolcap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"3e28-mjdLn8TWeZy4v6S84wS9uvdKHGQ\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 15912,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_omgcap.webp": {
		"type": "image/webp",
		"etag": "\"2d08-cq8uEwNjDgYK1ESiUsLN1J3RTpU\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 11528,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_omgcap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_savagecap.webp": {
		"type": "image/webp",
		"etag": "\"3c28-hMghhEtfUXm5TvCwqIghCGsChJU\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 15400,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_savagecap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_superbowlcap_2020.webp": {
		"type": "image/webp",
		"etag": "\"33fa-YePgc2s+w2AF6yOh6t4+IWRkjSY\"",
		"mtime": "2026-10-21T07:17:51.745Z",
		"size": 13306,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_superbowlcap_2020.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_supermecap.webp": {
		"type": "image/webp",
		"etag": "\"2fa6-McujIG/WxL3ut1Fd6yiAGDQHTnM\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 12198,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_supermecap.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p71_vipcrown.webp": {
		"type": "image/webp",
		"etag": "\"4dfe-GZyqjaF2DXefyOsqP7f6sFb8yyY\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 19966,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p71_vipcrown.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p72_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"3fca-Gzu+phog42WvBPcNefjewB0Xuyc\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 16330,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p72_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p72_cocoscocktail_v2.webp": {
		"type": "image/webp",
		"etag": "\"46b4-Enxi8GftEhZwbUOzyOEjJOdghSk\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 18100,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p72_cocoscocktail_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p72_milkcoctail.webp": {
		"type": "image/webp",
		"etag": "\"297a-pgkHiyXo1aQesbkiNzQVUu8DLgs\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 10618,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p72_milkcoctail.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p72_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"3e04-EM/8u2fS0paQ5RAsoxwLn9xIRHY\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 15876,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p72_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p73_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"40a6-+cUYB8gsQM/zkvteEuyqUuT41Pw\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 16550,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p73_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p73_bluelagoon.webp": {
		"type": "image/webp",
		"etag": "\"2e56-S9DNeTSraNOsJb97Y9MK43Yklmc\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 11862,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p73_bluelagoon.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p73_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"3fb2-h6d8IhR4JPV0VUuDyf3kf5J5nv0\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 16306,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p73_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p73_smoothie.webp": {
		"type": "image/webp",
		"etag": "\"2fe6-Kn0Bk+I7ZC7Bd8B+jqEIqtRGaP0\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 12262,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p73_smoothie.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p74_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"410a-MBiHkdGUV6mmCPEpZ4lagR1NVJ8\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 16650,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p74_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p74_daiquiri.webp": {
		"type": "image/webp",
		"etag": "\"38e0-mqEmwqCAClOPQsRBP04eiQumkTU\"",
		"mtime": "2026-10-21T07:17:51.749Z",
		"size": 14560,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p74_daiquiri.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p74_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"442c-tSbjUA4yCz5VJLTGmudOjyr31i0\"",
		"mtime": "2026-10-21T07:17:51.753Z",
		"size": 17452,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p74_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p74_vodka.webp": {
		"type": "image/webp",
		"etag": "\"4440-YL37TV4SQhJNOBaqf1nBK7aVTw4\"",
		"mtime": "2026-10-21T07:17:51.753Z",
		"size": 17472,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p74_vodka.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p75_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"40cc-EoZtQvNca0w2NXvBfNca8Zdi03A\"",
		"mtime": "2026-10-21T07:17:51.757Z",
		"size": 16588,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p75_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p75_sexonthebeach.webp": {
		"type": "image/webp",
		"etag": "\"2776-CerpfsvsRxBGPD4/RXwuLyonnss\"",
		"mtime": "2026-10-21T07:17:51.757Z",
		"size": 10102,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p75_sexonthebeach.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p76_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"3cbc-2FKaw5xVcdWq3WdWfAmXp1c02N0\"",
		"mtime": "2026-10-21T07:17:51.757Z",
		"size": 15548,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p76_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p76_tequilashot.webp": {
		"type": "image/webp",
		"etag": "\"37a4-GIQOlIeNGodmzKZRgEZKmuP0iAE\"",
		"mtime": "2026-10-21T07:17:51.753Z",
		"size": 14244,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p76_tequilashot.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p77_air_kiss1_v2.webp": {
		"type": "image/webp",
		"etag": "\"3510-pPMUmuEf4pi51DrLXFYjww01p+E\"",
		"mtime": "2026-10-21T07:17:51.753Z",
		"size": 13584,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p77_air_kiss1_v2.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p78_nipple1.webp": {
		"type": "image/webp",
		"etag": "\"40f6-fYZ/mwvjUrUeOBzvslsCC08is9Y\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 16630,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p78_nipple1.webp"
	},
	"/room-assets/premium-gifts/dlg300/g_p79_latte.webp": {
		"type": "image/webp",
		"etag": "\"3864-IXaYICdK5MVpydOMsaRUHrpbqOU\"",
		"mtime": "2026-10-21T07:17:51.761Z",
		"size": 14436,
		"path": "../public/room-assets/premium-gifts/dlg300/g_p79_latte.webp"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_L8GEZH = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_L8GEZH
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
