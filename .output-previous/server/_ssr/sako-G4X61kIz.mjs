import { i as __toESM } from "../_runtime.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { t as telegramNoticeSchema } from "./telegram-notifications-DBMBBFlt.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { n as roulettePrizeNames, t as rouletteConfigSchema } from "./roulette-config-D0UHMX9J.mjs";
import { i as appearanceInput, n as NAME_STYLES, r as NAME_STYLE_LABELS } from "./player-appearance-BO0_Ac72.mjs";
import { d as require_react, n as CheckboxIndicator, t as Checkbox$1, u as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { i as useAuth } from "./auth-BrRZs5FB.mjs";
import { $ as Check, S as RefreshCw, b as Send, nt as Bold, t as X, u as Upload } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as gameError } from "./game-language-BY9iR37b.mjs";
import { S as tableRpc, a as LEVEL_FRAMES, f as customFrameUrl, o as PlayerName, u as customFrameImageName } from "./player-name-CqT1z4a7.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxspnPmW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sako-G4X61kIz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var checkAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0df6a912ffe4ab8c08b2802754fd812aaa5a08909865dc6907d1c19fbab16a80"));
var getAdminStats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4fec70c92c2624b017310f557d52373f6e45b4f5283a3272a864213d4d65e68d"));
var ListInput = objectType({
	search: stringType().trim().max(60).default(""),
	page: numberType().int().min(0).max(1e4).default(0)
});
var listPlayers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ListInput.parse(d)).handler(createSsrRpc("5876880f9460044d2cee04222fc041b2984a96c7f1e01f4fcc1acc407b294502"));
var BalanceInput = objectType({
	userId: stringType().uuid(),
	field: enumType([
		"gold",
		"tokens",
		"dat"
	]),
	delta: numberType().int().min(-1e7).max(1e7)
});
var adjustBalance = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BalanceInput.parse(d)).handler(createSsrRpc("b8999623daee78b706e1c720cdcd4a1447ff0a2b08503502eb476a7a550fad3e"));
var KissesInput = objectType({
	userId: stringType().uuid(),
	value: numberType().int().min(0).max(1e7)
});
/** Admin: set a player's total kiss count to an exact value. */
var setKisses = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => KissesInput.parse(d)).handler(createSsrRpc("3233a93a22a0cdf45aced1e0500e8cad2d942a9f336e49efa0fc1e3e7f6f23a0"));
var BanInput = objectType({
	userId: stringType().uuid(),
	banned: booleanType(),
	reason: stringType().trim().max(300).default(""),
	hours: numberType().int().min(1).max(876e3).nullable().default(null)
});
var setBan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BanInput.parse(d)).handler(createSsrRpc("822155bcd1be13e3a8e1f4ba680c415aa4c8bdd97c6bfc1b742d3cba4868b2a7"));
var BroadcastInput = objectType({
	roomId: numberType().int().positive(),
	text: stringType().trim().min(1).max(300)
});
/** Original admin_chat: a green announcement line in the chosen room's chat. */
var sendBroadcast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => BroadcastInput.parse(d)).handler(createSsrRpc("bde0067a66870a55f410c347c8e29529ddffc5e667d4df1559d1d194db48e7b8"));
/** Original viewtable: admins can watch any table — live seats + chat, read-only. */
var listRoomsAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("6c6f2514a47ca8bd16c6df19d6111f6d42041ec7a65b94c7ea5147ed1d5cb1c9"));
var ViewRoomInput = objectType({ roomId: numberType().int().positive() });
var viewRoomAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ViewRoomInput.parse(d)).handler(createSsrRpc("58aafa9101181d03a080fd1acc7f24420dc2a1078b4c2789f5175f298d5d5080"));
var ReportsInput = objectType({ status: enumType([
	"open",
	"reviewed",
	"dismissed"
]).default("open") });
var listReports = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ReportsInput.parse(d)).handler(createSsrRpc("c9956b44cec3c1fce949ecfd38437e467b57699a11f341d5b3196cf08648be73"));
var ResolveInput = objectType({
	id: stringType().uuid(),
	status: enumType([
		"reviewed",
		"dismissed",
		"open"
	]),
	note: stringType().trim().max(500).default("")
});
var resolveReport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => ResolveInput.parse(d)).handler(createSsrRpc("6fac58f2682ac346176b61a1647ce58c52925ac2e4c76d5ec29c62561a8ac845"));
var StatusListInput = objectType({ review: enumType([
	"pending",
	"approved",
	"rejected"
]).default("pending") });
var listStatusReviews = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => StatusListInput.parse(d)).handler(createSsrRpc("204f47c307b90513baa75d8c2e53c3f9d046a21d274476a509053815a79d4078"));
var StatusReviewInput = objectType({
	id: stringType().uuid(),
	approve: booleanType()
});
var reviewStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => StatusReviewInput.parse(d)).handler(createSsrRpc("fadf8509e30882cccd4681aa362793b1b2e426baf063edcf6c354bd393545833"));
/** Direct Bot API: uses the same explicitly configured bot token as Telegram login. */
var sendTelegramNotifications = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => telegramNoticeSchema.parse(d)).handler(createSsrRpc("c029b68a5bf957bd4e8d738b068d6c68bdbc1f0fe40a9345244c6405e6e232de"));
var uploadTelegramMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => {
	if (!(d instanceof FormData)) throw new Error("Fayl tələb olunur.");
	return d;
}).handler(createSsrRpc("330c3911397e0e2fbc9ce66360469e910809ecf6c06cf0f16a14530e7b390e7d"));
var replaceTelegramBotToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input || typeof input !== "object" || !("token" in input) || typeof input.token !== "string" || !/^\d{5,16}:[A-Za-z0-9_-]{20,200}$/.test(input.token)) throw new Error("Etibarsız bot tokeni.");
	return { token: input.token };
}).handler(createSsrRpc("e17cf45638992b4b40befd835dc4d6d57d6c53fe6d317529266731653aa3976e"));
var LevelInput = objectType({
	userId: stringType().uuid(),
	level: numberType().int().min(0).max(100)
});
/** Admin: player's gift level and individually granted level frames. */
var getPlayerLevel = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ userId: stringType().uuid() }).parse(d)).handler(createSsrRpc("2118e4ea8e6ae20ad4e70a6b24348be937f09a41339d4cc79da1dc991ae82a22"));
/** Admin: set an exact gift level (1400 points per level, max 100). */
var setGiftLevel = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => LevelInput.parse(d)).handler(createSsrRpc("13e7d580e80954ce318cd475af8531560d2d4767779576b1a768aecdc8907fd3"));
/** Admin: give or take one animated level frame regardless of level. */
var grantFrame = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	userId: stringType().uuid(),
	frame: stringType().regex(/^cf_\d+$/),
	give: booleanType()
}).parse(d)).handler(createSsrRpc("7a45cf54b54c404acd83463ae7ab780d1566333d117a7ab0ace72c81f3dcf8fc"));
var getRouletteAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("bb2f9541ef946a4d0e310750f53a8fbb64a2a335d8d581e8d417837797bd930f"));
var saveRouletteAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => rouletteConfigSchema.parse(input)).handler(createSsrRpc("23d3d4d7e23a602b5820020cc3bca43a0e16c8f79ddd74d13bc01d1acca5de60"));
var getPlayerNameStyle = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ userId: stringType().uuid() }).parse(input)).handler(createSsrRpc("97937b81ab64a30426178598ad9298ed13ec92888d77675e22c3bd9bdfea2dc5"));
var savePlayerNameStyle = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => appearanceInput.parse(input)).handler(createSsrRpc("31a815ab29a11bbd7ca9e4c7f3c139db1583e4c81a4d0e2c1d7f922aa7ac3a33"));
var requestSiteRefresh = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	const title = String(input?.title ?? "").trim().slice(0, 80);
	const countdown = Math.round(Number(input?.countdown ?? 10));
	if (!Number.isFinite(countdown) || countdown < 3 || countdown > 300) throw new Error("Geri sayım 3-300 saniyə olmalıdır");
	return {
		title,
		countdown
	};
}).handler(createSsrRpc("23eb726ffbb3824866530503758ef69c4935754d245cdf04f956beef1893484d"));
function TelegramNotifications() {
	const send = useServerFn(sendTelegramNotifications), upload = useServerFn(uploadTelegramMedia);
	const [kind, setKind] = (0, import_react.useState)("text");
	const [text, setText] = (0, import_react.useState)(""), [media, setMedia] = (0, import_react.useState)("");
	const [bold, setBold] = (0, import_react.useState)(false), [silent, setSilent] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false), [uploading, setUploading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(""), [fileName, setFileName] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null), lock = (0, import_react.useRef)(false);
	const submit = async () => {
		if (lock.current || !window.confirm("Bütün Telegram oyunçularına göndərilsin?")) return;
		lock.current = true;
		setBusy(true);
		setError("");
		setResult(null);
		let after = null, sent = 0, failed = 0, total = 0;
		try {
			do {
				const r = await send({ data: {
					text,
					bold,
					silent,
					kind,
					media,
					after
				} });
				sent += r.sent;
				failed += r.failed;
				total += r.attempted;
				setResult({
					sent,
					failed,
					total,
					done: r.done
				});
				if (r.errors.length) setError(r.errors.join(" · "));
				after = r.after;
				if (r.done) break;
			} while (after);
		} catch (e) {
			setError(gameError(e));
		} finally {
			lock.current = false;
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-3xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "Telegram bildirişləri"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"text",
					"photo",
					"video"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: kind === k ? "default" : "outline",
					disabled: busy || uploading,
					onClick: () => {
						setKind(k);
						setMedia("");
						setFileName("");
						setResult(null);
					},
					children: k === "text" ? "Mətn" : k === "photo" ? "Şəkil" : "Video"
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: bold ? "secondary" : "outline",
					size: "icon",
					"aria-label": "Qalın mətn",
					title: "Qalın mətn",
					"aria-pressed": bold,
					disabled: busy,
					onClick: () => setBold(!bold),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: silent,
						disabled: busy,
						onCheckedChange: (v) => setSilent(v === true)
					}), "Səssiz bildiriş"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				"aria-label": "Bildiriş mətni",
				placeholder: "Bildiriş mətni",
				value: text,
				disabled: busy,
				maxLength: kind === "text" ? 4096 : 1024,
				rows: 6,
				onChange: (e) => setText(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Telegram mətn rəngini dəyişməyə icazə vermir. Rəngli mətn olan şəkil göndərə bilərsiniz."
			}),
			kind !== "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						"aria-label": "Media keçidi və ya Telegram fayl ID-si",
						placeholder: "HTTPS keçidi və ya Telegram fayl ID-si",
						value: media,
						disabled: busy || uploading,
						onChange: (e) => {
							setMedia(e.target.value);
							setFileName("");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						className: "hidden",
						type: "file",
						accept: kind === "photo" ? "image/jpeg,image/png" : "video/mp4",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							setUploading(true);
							setError("");
							try {
								const f = new FormData();
								f.set("file", file);
								f.set("kind", kind);
								const r = await upload({ data: f });
								setMedia(r.fileId);
								setFileName(file.name);
							} catch (e) {
								setError(gameError(e));
							} finally {
								setUploading(false);
								if (fileRef.current) fileRef.current.value = "";
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							disabled: busy || uploading,
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 size-4" }), uploading ? "Yüklənir…" : "Fayl seç"]
						}), fileName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-sm",
							children: fileName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "Faylı sil",
							disabled: busy,
							onClick: () => {
								setMedia("");
								setFileName("");
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: busy || uploading || (kind === "text" ? !text.trim() : !media.trim()),
				onClick: () => void submit(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 size-4" }), busy ? "Göndərilir…" : "Telegram oyunçularına göndər"]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "status",
				className: "text-sm",
				children: [
					result.done ? "Tamamlandı" : busy ? "Göndərilir" : "Dayandırıldı",
					" · Cəhd: ",
					result.total,
					" · Göndərildi: ",
					result.sent,
					" · Uğursuz: ",
					result.failed
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "break-words text-sm text-destructive",
				children: error
			})
		]
	});
}
function TelegramBotSettings() {
	const replace = useServerFn(replaceTelegramBotToken);
	const field = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6 border-b pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-lg font-semibold",
				children: "Telegram bot ayarları"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3 sm:flex-row",
				onSubmit: async (event) => {
					event.preventDefault();
					if (busy || !field.current?.value.trim()) return;
					const token = field.current.value.trim();
					field.current.value = "";
					setBusy(true);
					setMessage("");
					try {
						await replace({ data: { token } });
						setMessage("Bot tokeni yeniləndi. Bot ən gec 35 saniyəyə yeni tokenə keçir.");
					} catch {
						setMessage("Token yenilənmədi. BotFather tokenini və bağlantını yoxlayın.");
					} finally {
						setBusy(false);
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					ref: field,
					type: "password",
					"aria-label": "Yeni bot tokeni",
					placeholder: "BotFather-dən yeni bot tokeni",
					autoComplete: "off",
					spellCheck: false,
					required: true,
					disabled: busy
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Yoxlanılır…" : "Tokeni dəyiş"
				})]
			}),
			message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mt-2 text-sm text-muted-foreground",
				children: message
			})
		]
	});
}
var FRAMES = [...LEVEL_FRAMES, {
	key: "cf_131",
	level: 0
}];
/** Admin: gift level (frames + entrance effect follow it) and per-player animated frame grants. */
function PlayerLevelPanel({ userId }) {
	const qc = useQueryClient();
	const load = useServerFn(getPlayerLevel);
	const setLevel = useServerFn(setGiftLevel);
	const grant = useServerFn(grantFrame);
	const key = [
		"admin",
		"level",
		userId
	];
	const q = useQuery({
		queryKey: key,
		queryFn: () => load({ data: { userId } })
	});
	const [value, setValue] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)("");
	const levelM = useMutation({
		mutationFn: (level) => setLevel({ data: {
			userId,
			level
		} }),
		onSuccess: (r) => {
			setMsg(`Yeni səviyyə: Lv ${r.level}`);
			setValue("");
			qc.invalidateQueries({ queryKey: key });
		},
		onError: (e) => setMsg(e.message)
	});
	const frameM = useMutation({
		mutationFn: (v) => grant({ data: {
			userId,
			...v
		} }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: key }),
		onError: (e) => setMsg(e.message)
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-xs text-muted-foreground",
		children: "Yüklənir…"
	});
	if (q.error || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-xs text-destructive",
		children: q.error?.message ?? "Xəta"
	});
	const { level, points, owned } = q.data;
	const n = parseInt(value, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 space-y-3 rounded-md border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-medium",
						children: ["Hədiyyə səviyyəsi: Lv ", level]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							"(",
							points,
							" xal)"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "w-28",
						type: "number",
						min: 0,
						max: 100,
						placeholder: "0-100",
						value,
						onChange: (e) => setValue(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !(n >= 0 && n <= 100) || levelM.isPending,
						onClick: () => levelM.mutate(n),
						children: "Təyin et"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: levelM.isPending,
						onClick: () => levelM.mutate(100),
						children: "Lv 100"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Səviyyə dəyişəndə ramkalar və masaya giriş effekti avtomatik ona uyğun olur."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: FRAMES.map((f) => {
					const given = owned.includes(f.key);
					const open = given || f.level > 0 && level >= f.level;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-1 rounded-md border p-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: customFrameUrl(customFrameImageName(f.key)) ?? "",
								alt: f.key,
								className: "h-16 w-16 object-contain",
								loading: "lazy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: f.level ? `Lv ${f.level}` : "Xüsusi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: given ? "Verilib" : open ? "Səviyyə ilə açıq" : "Bağlı"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: given ? "outline" : "default",
								disabled: frameM.isPending,
								onClick: () => frameM.mutate({
									frame: f.key,
									give: !given
								}),
								children: given ? "Geri al" : "Ver"
							})
						]
					}, f.key);
				})
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: msg
			})
		]
	});
}
function TablePricePanel() {
	const qc = useQueryClient(), [price, setPrice] = (0, import_react.useState)(null);
	const query = useQuery({
		queryKey: ["admin", "table-price"],
		queryFn: () => tableRpc("my_table_info")
	});
	const save = useMutation({
		mutationFn: (amount) => tableRpc("admin_set_table_price", { p_price: amount }),
		onSuccess: async () => {
			setPrice(null);
			await qc.invalidateQueries({ queryKey: ["admin", "table-price"] });
		}
	});
	const current = price ?? (query.data?.price == null ? "" : String(query.data.price));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8 space-y-3 border-b pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Masa yarat · 30 gün"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-wrap items-end gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					const n = Number(current);
					if (current !== "" && Number.isSafeInteger(n) && n >= 0) save.mutate(n);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Masa yaratma qiyməti · DAT" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						"aria-label": "Masa yaratma qiyməti · DAT",
						type: "number",
						min: 0,
						max: 1e9,
						step: 1,
						required: true,
						value: current,
						onChange: (e) => setPrice(e.target.value),
						disabled: save.isPending || query.isPending
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: save.isPending || query.isPending || current === "",
					children: save.isPending ? "Saxlanılır…" : "Saxla"
				})]
			}),
			query.data?.price == null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Qiymət təyin olunmayıb. Masa yaratmaq bağlıdır."
			}),
			(query.error || save.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: (query.error ?? save.error)?.message
			}),
			save.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-sm",
				children: "DAT qiyməti saxlanıldı."
			})
		]
	});
}
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function RoulettePanel() {
	const read = useServerFn(getRouletteAdmin), save = useServerFn(saveRouletteAdmin), qc = useQueryClient();
	const [draft, setDraft] = (0, import_react.useState)(null), [notice, setNotice] = (0, import_react.useState)("");
	const query = useQuery({
		queryKey: ["admin", "roulette"],
		queryFn: () => read()
	});
	const mutation = useMutation({
		mutationFn: (data) => save({ data }),
		onSuccess: async () => {
			setDraft(null);
			setNotice("Çarx ayarları saxlanıldı.");
			await qc.invalidateQueries({ queryKey: ["admin", "roulette"] });
		}
	});
	if (query.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Yüklənir…" });
	if (query.error || !query.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		role: "alert",
		children: ["Çarx ayarları alınmadı. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => void query.refetch(),
			children: "Yenidən yoxla"
		})]
	});
	const data = query.data, current = draft ?? data.config;
	const total = current.prizes.reduce((s, p) => s + Math.round(p.percentage * 100), 0) / 100;
	const change = (patch) => {
		setDraft({
			...current,
			...patch
		});
		setNotice("");
	};
	const submit = () => {
		const parsed = rouletteConfigSchema.safeParse(current);
		if (!parsed.success) {
			setNotice(parsed.error.issues[0]?.message ?? "Ayarlar düzgün deyil.");
			return;
		}
		mutation.mutate(parsed.data);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Şans çarxı"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-3",
					children: ["Aktiv", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: current.enabled,
						onCheckedChange: (v) => change({ enabled: v }),
						disabled: mutation.isPending
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4",
				children: [
					["spinCost", "Bir dövr üçün şans"],
					["dailyChances", "Gündəlik pulsuz şans"],
					["bundleChances", "Paketdə şans"],
					["bundleDat", "Paket qiyməti · DAT"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: key === "dailyChances" ? 0 : 1,
						step: 1,
						value: current[key],
						onChange: (e) => change({ [key]: Number(e.target.value) }),
						disabled: mutation.isPending
					})]
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y border-y",
				children: data.prizes.map((prize) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[40px_1fr_100px] items-center gap-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: `roulette__reward-icon roulette__reward-icon--${prize.image}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-medium",
								children: [
									prize.amount,
									" × ",
									roulettePrizeNames[prize.image] ?? prize.image
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: ["Sektor ", prize.id + 1]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"aria-label": `Sektor ${prize.id + 1} ehtimalı`,
								type: "number",
								min: 0,
								max: 100,
								step: .01,
								value: current.prizes.find((p) => p.id === prize.id)?.percentage ?? 0,
								disabled: mutation.isPending,
								onChange: (e) => change({ prizes: current.prizes.map((p) => p.id === prize.id ? {
									...p,
									percentage: Number(e.target.value)
								} : p) })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "%" })]
						})
					]
				}, prize.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
					className: total === 100 ? "text-foreground" : "text-destructive",
					children: [
						"Cəmi: ",
						total.toFixed(2),
						"%"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: mutation.isPending || total !== 100,
					children: mutation.isPending ? "Saxlanılır…" : "Saxla"
				})]
			}),
			(notice || mutation.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-sm",
				children: mutation.error?.message ?? notice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-bold",
				children: "Son çarx əməliyyatları"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y border-y",
				children: [data.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-between gap-2 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						event.name,
						" · ",
						event.action === "buy" ? "Şans paketi" : `${event.amount ?? ""} × ${roulettePrizeNames[event.image ?? ""] ?? "Mükafat"}`
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						className: "text-muted-foreground",
						children: new Date(event.created_at).toLocaleString("az-AZ")
					})]
				}, event.id)), !data.events.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-3 text-sm text-muted-foreground",
					children: "Hələ əməliyyat yoxdur."
				})]
			})] })
		]
	});
}
function PlayerNamePanel({ userId, name }) {
	const get = useServerFn(getPlayerNameStyle);
	const query = useQuery({
		queryKey: [
			"admin",
			"name-style",
			userId
		],
		queryFn: () => get({ data: { userId } })
	});
	if (!query.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted-foreground",
		children: query.isError ? "Ad üslubu yüklənmədi." : "Yüklənir…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameEditor, {
		userId,
		name,
		initial: query.data
	}, `${userId}:${query.data.nameStyle}:${query.data.creator}`);
}
function NameEditor({ userId, name, initial }) {
	const [nameStyle, setNameStyle] = (0, import_react.useState)(initial.nameStyle);
	const [creator, setCreator] = (0, import_react.useState)(initial.creator);
	const save = useServerFn(savePlayerNameStyle);
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: () => save({ data: {
			userId,
			nameStyle,
			creator
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"admin",
				"name-style",
				userId
			] });
			qc.invalidateQueries({ queryKey: ["player-appearance"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-3 border-t pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerName, {
				name,
				appearance: {
					level: initial.level,
					nameStyle,
					creator
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2",
				role: "group",
				"aria-label": "Ad rəngi",
				children: NAME_STYLES.map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: nameStyle === style ? "default" : "outline",
					title: NAME_STYLE_LABELS[style],
					"aria-label": NAME_STYLE_LABELS[style],
					"aria-pressed": nameStyle === style,
					onClick: () => setNameStyle(style),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `name-swatch name-swatch--${style}` })
				}, style))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: creator,
					onCheckedChange: setCreator
				}), "Creator"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				disabled: mutation.isPending,
				onClick: () => mutation.mutate(),
				children: "Yadda saxla"
			}),
			mutation.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: mutation.error.message
			}),
			mutation.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Ad üslubu yadda saxlanıldı."
			})
		]
	});
}
function SiteRefreshPanel() {
	const request = useServerFn(requestSiteRefresh);
	const [title, setTitle] = (0, import_react.useState)("Yeni versiya hazırdır");
	const [countdown, setCountdown] = (0, import_react.useState)(10);
	const mutation = useMutation({ mutationFn: () => request({ data: {
		title,
		countdown
	} }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8 border-t py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-lg font-semibold",
				children: "Saytı yenilə"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 grid gap-2 sm:grid-cols-[1fr_140px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm",
					children: ["Başlıq", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "h-9 rounded-md border bg-background px-3",
						maxLength: 80,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Yeni versiya hazırdır"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm",
					children: ["Geri sayım (saniyə)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "h-9 rounded-md border bg-background px-3",
						type: "number",
						min: 3,
						max: 300,
						value: countdown,
						onChange: (e) => setCountdown(Number(e.target.value))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: mutation.isPending,
				onClick: () => mutation.mutate(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Hamıya yeniləmə göndər"]
			}),
			mutation.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Yeniləmə bildirişi göndərildi."
			}),
			mutation.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-destructive",
				children: mutation.error.message
			})
		]
	});
}
var TABS = [
	["umumi", "Ümumi"],
	["masalar", "Masalar"],
	["oyuncular", "Oyunçular"],
	["sikayetler", "Şikayətlər"],
	["statuslar", "Statuslar"],
	["telegram", "Telegram bildirişləri"],
	["roulette", "Şans çarxı"]
];
function AdminPage() {
	const auth = useAuth();
	const check = useServerFn(checkAdmin);
	const role = useQuery({
		queryKey: [
			"admin",
			"role",
			auth.session?.user.id
		],
		queryFn: () => check(),
		enabled: !!auth.session
	});
	if (!auth.ready || auth.session && role.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: "Yüklənir…" });
	if (!auth.session) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Center, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-4",
		children: "İdarə paneli üçün giriş edin."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth",
			children: "Giriş et"
		})
	})] });
	if (!role.data?.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: "Bu səhifəyə giriş icazəniz yoxdur." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {});
}
function Center({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center text-foreground",
		children
	});
}
function Dashboard() {
	const [tab, setTab] = (0, import_react.useState)("umumi");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 text-foreground md:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "İdarə paneli"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Oyuna qayıt"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex flex-wrap gap-2 border-b pb-3",
					children: TABS.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: tab === key ? "default" : "outline",
						onClick: () => setTab(key),
						children: label
					}, key))
				}),
				tab === "umumi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteRefreshPanel, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Broadcast, {})
				] }),
				tab === "masalar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePricePanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rooms, {})] }),
				tab === "oyuncular" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Players, {}),
				tab === "sikayetler" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reports, {}),
				tab === "statuslar" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusReviews, {}),
				tab === "telegram" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelegramBotSettings, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelegramNotifications, {})] }),
				tab === "roulette" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoulettePanel, {})
			]
		})
	});
}
function Stats() {
	const stats = useServerFn(getAdminStats);
	const s = useQuery({
		queryKey: ["admin", "stats"],
		queryFn: () => stats(),
		refetchInterval: 3e4
	});
	const items = [
		["Ümumi oyunçu", s.data?.players],
		["Son 24 saat yeni", s.data?.newToday],
		["Masada oturan", s.data?.seated],
		["Masalar", s.data?.rooms],
		["Hədiyyələr", s.data?.gifts],
		["Mesajlar", s.data?.messages]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-8 grid grid-cols-2 gap-3 md:grid-cols-6",
		children: items.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border bg-card p-4 text-card-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-2xl font-semibold",
				children: value ?? "—"
			})]
		}, label))
	});
}
/** Original admin_chat: green announcement into a room's chat. */
function Broadcast() {
	const rooms = useServerFn(listRoomsAdmin);
	const send = useServerFn(sendBroadcast);
	const qc = useQueryClient();
	const r = useQuery({
		queryKey: ["admin", "rooms"],
		queryFn: () => rooms(),
		refetchInterval: 15e3
	});
	const [roomId, setRoomId] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const m = useMutation({
		mutationFn: () => send({ data: {
			roomId: roomId ?? 0,
			text
		} }),
		onSuccess: () => {
			setText("");
			qc.invalidateQueries({ queryKey: ["admin", "room"] });
		}
	});
	const list = r.data?.rooms ?? [];
	const chosen = roomId ?? list[0]?.id ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 rounded-lg border bg-card p-4 text-card-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-lg font-semibold",
				children: "Elan (yaşıl admin mesajı)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-2 md:flex-row",
				onSubmit: (e) => {
					e.preventDefault();
					if (chosen && text.trim()) m.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "rounded-md border bg-background px-3 py-2 text-sm",
						value: chosen ?? "",
						onChange: (e) => setRoomId(Number(e.target.value)),
						children: list.map((rm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: rm.id,
							children: [
								"Masa ",
								rm.id,
								" · ",
								rm.players,
								" oyunçu"
							]
						}, rm.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Bütün masada görünəcək elan mətni",
						value: text,
						onChange: (e) => setText(e.target.value),
						maxLength: 300
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: m.isPending || !chosen || !text.trim(),
						children: "Göndər"
					})
				]
			}),
			m.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-destructive",
				children: m.error.message
			}),
			m.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-green-600",
				children: "Elan göndərildi."
			})
		]
	});
}
/** Original viewtable: watch any table live — seats and chat, read-only. */
function Rooms() {
	const rooms = useServerFn(listRoomsAdmin);
	const view = useServerFn(viewRoomAdmin);
	const r = useQuery({
		queryKey: ["admin", "rooms"],
		queryFn: () => rooms(),
		refetchInterval: 15e3
	});
	const [open, setOpen] = (0, import_react.useState)(null);
	const detail = useQuery({
		queryKey: [
			"admin",
			"room",
			open
		],
		queryFn: () => view({ data: { roomId: open ?? 0 } }),
		enabled: open !== null,
		refetchInterval: 5e3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 rounded-lg border bg-card p-4 text-card-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-lg font-semibold",
				children: "Masaları izlə"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [(r.data?.rooms ?? []).map((rm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: open === rm.id ? "default" : "outline",
					size: "sm",
					onClick: () => setOpen(open === rm.id ? null : rm.id),
					children: [
						"Masa ",
						rm.id,
						" · ",
						rm.players
					]
				}, rm.id)), r.data && r.data.rooms.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Aktiv masa yoxdur."
				})]
			}),
			open !== null && detail.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-xs text-muted-foreground",
					children: "Oturacaqlar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [detail.data.seats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center rounded-md border p-2",
						children: [s.photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.photoUrl,
							alt: "",
							className: "h-10 w-10 rounded-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 rounded-full bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 max-w-full truncate text-xs",
							children: s.name
						})]
					}, s.seat)), detail.data.seats.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "col-span-4 text-sm text-muted-foreground",
						children: "Masa boşdur."
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-xs text-muted-foreground",
					children: "Canlı söhbət (son 50)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-64 space-y-1 overflow-y-auto rounded-md border p-2 text-sm",
					children: [detail.data.messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: msg.kind === "admin_chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-green-600",
						children: msg.text
					}) : msg.kind === "ban" || msg.kind === "disabled_ban" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-red-600",
						children: msg.kind === "ban" ? `${msg.text} oyundan qadağan edildi` : `${msg.text} istifadəçisinin qadağası ləğv edildi`
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [msg.name, ":"]
						}),
						" ",
						msg.text
					] }) }, msg.id)), detail.data.messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Mesaj yoxdur."
					})]
				})] })]
			})
		]
	});
}
function Players() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(0);
	const list = useServerFn(listPlayers);
	const r = useQuery({
		queryKey: [
			"admin",
			"players",
			query,
			page
		],
		queryFn: () => list({ data: {
			search: query,
			page
		} })
	});
	const pages = r.data ? Math.max(1, Math.ceil(r.data.total / r.data.pageSize)) : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-4 flex gap-2",
			onSubmit: (e) => {
				e.preventDefault();
				setPage(0);
				setQuery(search);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "İstifadəçi adı, ad və ya oyunçu nömrəsi",
				value: search,
				onChange: (e) => setSearch(e.target.value)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Axtar"
			})]
		}),
		r.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-destructive",
			children: r.error.message
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				r.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Yüklənir…"
				}),
				r.data?.players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerRow, { p }, p.id)),
				r.data && r.data.players.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Oyunçu tapılmadı."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: page === 0,
					onClick: () => setPage(page - 1),
					children: "Əvvəlki"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted-foreground",
					children: [
						page + 1,
						" / ",
						pages,
						" · ",
						r.data?.total ?? 0,
						" oyunçu"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: page + 1 >= pages,
					onClick: () => setPage(page + 1),
					children: "Növbəti"
				})
			]
		})
	] });
}
function PlayerRow({ p }) {
	const qc = useQueryClient();
	const adjust = useServerFn(adjustBalance);
	const kiss = useServerFn(setKisses);
	const ban = useServerFn(setBan);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [kissOpen, setKissOpen] = (0, import_react.useState)(false);
	const [levelOpen, setLevelOpen] = (0, import_react.useState)(false);
	const [nameOpen, setNameOpen] = (0, import_react.useState)(false);
	const [kissValue, setKissValue] = (0, import_react.useState)("");
	const [field, setField] = (0, import_react.useState)("gold");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)("");
	const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
	const bal = useMutation({
		mutationFn: (sign) => adjust({ data: {
			userId: p.id,
			field,
			delta: sign * Math.abs(parseInt(amount, 10) || 0)
		} }),
		onSuccess: (res) => {
			setMsg(`Yeni balans: ${res.value}`);
			setAmount("");
			refresh();
		},
		onError: (e) => setMsg(e.message)
	});
	const kissM = useMutation({
		mutationFn: () => kiss({ data: {
			userId: p.id,
			value: Math.abs(parseInt(kissValue, 10) || 0)
		} }),
		onSuccess: (res) => {
			setMsg(`Öpüş sayı: ${res.value}`);
			setKissValue("");
			setKissOpen(false);
			refresh();
		},
		onError: (e) => setMsg(e.message)
	});
	const [banOpen, setBanOpen] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)("");
	const [hours, setHours] = (0, import_react.useState)("perm");
	const banM = useMutation({
		mutationFn: () => ban({ data: {
			userId: p.id,
			banned: !p.banned,
			reason,
			hours: hours === "perm" ? null : parseInt(hours, 10)
		} }),
		onSuccess: () => {
			setBanOpen(false);
			setReason("");
			refresh();
		},
		onError: (e) => setMsg(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border bg-card p-3 text-card-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium",
							children: [
								p.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										"@",
										p.username,
										" · #",
										p.player_no
									]
								}),
								p.banned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 rounded bg-destructive px-2 py-0.5 text-xs text-destructive-foreground",
									children: "QADAĞANLI"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								p.male ? "Kişi" : "Qadın",
								p.age ? ` · ${p.age}` : "",
								p.city ? ` · ${p.city}` : "",
								" · Qızıl ",
								p.gold,
								" · Jeton ",
								p.tokens,
								" · DAT ",
								p.dat,
								" · Öpüş ",
								p.kisses
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setOpen(!open),
						children: "Balans"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setKissOpen(!kissOpen),
						children: "Öpüş"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setLevelOpen(!levelOpen),
						children: "Səviyyə / Ramka"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setNameOpen(!nameOpen),
						children: "Ad / Creator"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: p.banned ? "secondary" : "destructive",
						disabled: banM.isPending,
						onClick: () => {
							if (p.banned) {
								if (confirm("Qadağa ləğv edilsin?")) banM.mutate();
							} else setBanOpen(!banOpen);
						},
						children: p.banned ? "Qadağanı ləğv et" : "Qadağan et"
					})
				]
			}),
			p.banned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-destructive",
				children: [
					"Səbəb: ",
					p.banReason || "—",
					" · ",
					p.bannedUntil ? `Bitmə: ${new Date(p.bannedUntil).toLocaleString("az-AZ")}` : "Daimi"
				]
			}),
			banOpen && !p.banned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "min-w-48 flex-1",
						maxLength: 300,
						placeholder: "Qadağa səbəbi (oyunçu görür)",
						value: reason,
						onChange: (e) => setReason(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-9 rounded-md border bg-background px-2 text-sm",
						value: hours,
						onChange: (e) => setHours(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "1",
								children: "1 saat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "24",
								children: "1 gün"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "168",
								children: "7 gün"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "720",
								children: "30 gün"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "perm",
								children: "Daimi"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						disabled: banM.isPending,
						onClick: () => banM.mutate(),
						children: "Qadağan et"
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-9 rounded-md border bg-background px-2 text-sm",
						value: field,
						onChange: (e) => setField(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gold",
								children: "Qızıl"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "tokens",
								children: "Jeton"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dat",
								children: "DAT"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "w-32",
						type: "number",
						min: 1,
						placeholder: "Miqdar",
						value: amount,
						onChange: (e) => setAmount(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !amount || bal.isPending,
						onClick: () => bal.mutate(1),
						children: "Əlavə et"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: !amount || bal.isPending,
						onClick: () => bal.mutate(-1),
						children: "Çıx"
					})
				]
			}),
			kissOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: ["İndiki: ", p.kisses]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "w-32",
						type: "number",
						min: 0,
						placeholder: "Yeni say",
						value: kissValue,
						onChange: (e) => setKissValue(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !kissValue || kissM.isPending,
						onClick: () => kissM.mutate(),
						children: "Təyin et"
					})
				]
			}),
			levelOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerLevelPanel, { userId: p.id }),
			nameOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerNamePanel, {
				userId: p.id,
				name: p.name
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: msg
			})
		]
	});
}
var CATEGORY_AZ = {
	spam: "Spam",
	harassment: "Təhqir / təcavüz",
	inappropriate: "Uyğunsuz məzmun",
	fake: "Saxta profil",
	scam: "Dələduzluq",
	other: "Digər",
	photo: "Şəkil (qadağan)"
};
function Reports() {
	const [status, setStatus] = (0, import_react.useState)("open");
	const list = useServerFn(listReports);
	const resolve = useServerFn(resolveReport);
	const qc = useQueryClient();
	const r = useQuery({
		queryKey: [
			"admin",
			"reports",
			status
		],
		queryFn: () => list({ data: { status } }),
		refetchInterval: 2e4
	});
	const m = useMutation({
		mutationFn: (v) => resolve({ data: {
			...v,
			note: ""
		} }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reports"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mr-auto text-xl font-bold",
					children: ["Şikayətlər ", r.data?.open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 rounded bg-destructive px-2 py-0.5 text-sm text-destructive-foreground",
						children: [r.data.open, " yeni"]
					}) : null]
				}), [
					"open",
					"reviewed",
					"dismissed"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: status === s ? "default" : "outline",
					onClick: () => setStatus(s),
					children: s === "open" ? "Açıq" : s === "reviewed" ? "Baxıldı" : "Rədd edildi"
				}, s))]
			}),
			r.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: r.error.message
			}),
			r.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Yüklənir…"
			}),
			r.data && r.data.reports.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Şikayət yoxdur."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: r.data?.reports.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-card p-3 text-card-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive",
								children: CATEGORY_AZ[x.category] ?? x.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									new Date(x.createdAt).toLocaleString("az-AZ"),
									" · ",
									x.context === "chat" ? "Şəxsi mesaj" : x.context === "game" ? "Oyun profili" : "Profil"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Şikayət edilən:" }),
								" ",
								x.reported.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										"@",
										x.reported.username,
										x.reported.playerNo ? ` · #${x.reported.playerNo}` : ""
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Şikayət edən:" }),
								" ",
								x.reporter.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["@", x.reporter.username]
								})
							]
						}),
						x.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: x.photoUrl,
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: x.photoUrl,
								alt: "Şikayət edilən şəkil",
								className: "mt-2 h-28 w-28 rounded object-cover"
							})
						}),
						x.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap rounded bg-muted p-2 text-sm",
							children: x.details
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								status !== "reviewed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: m.isPending,
									onClick: () => m.mutate({
										id: x.id,
										status: "reviewed"
									}),
									children: "Baxıldı"
								}),
								status !== "dismissed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: m.isPending,
									onClick: () => m.mutate({
										id: x.id,
										status: "dismissed"
									}),
									children: "Rədd et"
								}),
								status !== "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: m.isPending,
									onClick: () => m.mutate({
										id: x.id,
										status: "open"
									}),
									children: "Yenidən aç"
								})
							]
						})
					]
				}, x.id))
			})
		]
	});
}
var STATUS_GRADIENTS = {
	emerald: "linear-gradient(160deg, oklch(.6 .15 165), oklch(.36 .09 195))",
	sunset: "linear-gradient(160deg, oklch(.72 .17 50), oklch(.55 .21 15))",
	night: "linear-gradient(160deg, oklch(.35 .08 260), oklch(.18 .04 280))",
	rose: "linear-gradient(160deg, oklch(.72 .16 0), oklch(.5 .2 340))",
	ocean: "linear-gradient(160deg, oklch(.7 .13 220), oklch(.42 .14 250))",
	gold: "linear-gradient(160deg, oklch(.85 .15 90), oklch(.62 .15 60))"
};
function StatusReviews() {
	const [review, setReview] = (0, import_react.useState)("pending");
	const list = useServerFn(listStatusReviews);
	const decide = useServerFn(reviewStatus);
	const qc = useQueryClient();
	const r = useQuery({
		queryKey: [
			"admin",
			"statuses",
			review
		],
		queryFn: () => list({ data: { review } }),
		refetchInterval: 2e4
	});
	const m = useMutation({
		mutationFn: (v) => decide({ data: v }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "statuses"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mr-auto text-xl font-bold",
					children: ["Status təsdiqi ", r.data?.pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 rounded bg-destructive px-2 py-0.5 text-sm text-destructive-foreground",
						children: [r.data.pending, " gözləyir"]
					}) : null]
				}), [
					"pending",
					"approved",
					"rejected"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: review === s ? "default" : "outline",
					onClick: () => setReview(s),
					children: s === "pending" ? "Gözləyən" : s === "approved" ? "Təsdiqlənən" : "Rədd edilən"
				}, s))]
			}),
			r.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: r.error.message
			}),
			r.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Yüklənir…"
			}),
			r.data && r.data.statuses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Status yoxdur."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: r.data?.statuses.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-lg border bg-card text-card-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex aspect-[9/14] items-center justify-center overflow-hidden bg-muted",
						style: x.kind === "text" ? { background: STATUS_GRADIENTS[x.bg] ?? STATUS_GRADIENTS["emerald"] } : void 0,
						children: [
							x.kind === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap break-words p-3 text-center text-sm font-semibold text-primary-foreground",
								children: x.body
							}),
							x.kind === "image" && x.mediaUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: x.mediaUrl,
								alt: "",
								className: "h-full w-full object-cover"
							}),
							x.kind === "video" && x.mediaUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: x.mediaUrl,
								className: "h-full w-full object-cover",
								controls: true,
								playsInline: true,
								preload: "metadata"
							}),
							x.kind !== "text" && !x.mediaUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Fayl yoxdur"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-sm font-semibold",
								children: [
									x.author.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal text-muted-foreground",
										children: ["@", x.author.username]
									})
								]
							}),
							x.kind !== "text" && x.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs",
								children: x.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: new Date(x.createdAt).toLocaleString("az-AZ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [review !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "flex-1",
									disabled: m.isPending,
									onClick: () => m.mutate({
										id: x.id,
										approve: true
									}),
									children: "Təsdiqlə"
								}), review !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1",
									disabled: m.isPending,
									onClick: () => m.mutate({
										id: x.id,
										approve: false
									}),
									children: "Rədd et"
								})]
							})
						]
					})]
				}, x.id))
			})
		]
	});
}
//#endregion
export { AdminPage as component };
