import { i as __toESM } from "../_runtime.mjs";
import { d as require_react, s as require_react_dom, u as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as fetchPassInfo, c as passClock, f as prizeView, i as claimPassLevel, l as passLeftText, m as ui_btn_gold_add_heart_up_default, n as canClaim, o as getCachedPass, r as claimPassChest, t as buyPassPremium, u as passProgress } from "./season-pass-B7Jrau3J.mjs";
import { Y as showSourceToast } from "./room-session-DdlYu-9b.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/season-pass-dialog-BOeL-8N9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
/**
* ureyimsen GiftAnimations.addViewerGold / inplaceGold, birebir:
* kalp simgesi çıkış noktasında belirir, 2 sn EASE_OUT ile sol üstteki kalp
* sayacına uçar, son 0.3 sn'de sönümlenir; varınca sayaç nabız gibi atar
* (scale 1 → 1.2 → 0.9 → 1, toplam 0.5 sn). Alıcı başkasıysa kalp yerinde
* belirip 32 px yukarı süzülerek 2 sn'de kaybolur.
*/
var FLY_MS = 2e3;
var PULSE_MS = 500;
var HEART_SIZE = 36;
function heartEl(at) {
	const el = document.createElement("img");
	el.src = ui_btn_gold_add_heart_up_default;
	el.alt = "";
	el.className = "gold-fly__heart";
	el.style.left = `${at.x - HEART_SIZE / 2}px`;
	el.style.top = `${at.y - HEART_SIZE / 2}px`;
	document.body.appendChild(el);
	return el;
}
/** Sol üst kalp sayacının ekran koordinatı; sayaç yoksa null. */
function goldCounterPoint() {
	const btn = document.querySelector(".original-heart-button");
	if (!btn) return null;
	const r = btn.getBoundingClientRect();
	return {
		x: r.left + r.width / 2,
		y: r.top + r.height / 2
	};
}
/** Sayaç nabzı: scale 1 → 1.2 → 0.9 → 1 (source playGoldIncreasedAnimation). */
function pulseGoldCounter() {
	const btn = document.querySelector(".original-heart-button");
	if (!btn) return;
	btn.classList.remove("gold-fly-pulse");
	btn.offsetWidth;
	btn.classList.add("gold-fly-pulse");
	window.setTimeout(() => btn.classList.remove("gold-fly-pulse"), PULSE_MS);
}
/** Kalp, çıkış noktasından sol üst kalp sayacına uçar; varınca sayaç nabzı atar. */
function flyGoldToCounter(from, onArrive) {
	const target = goldCounterPoint();
	if (!target) return;
	const el = heartEl(from);
	if (typeof el.animate !== "function") {
		window.setTimeout(() => {
			el.remove();
			pulseGoldCounter();
			onArrive?.();
		}, FLY_MS);
		return;
	}
	const dx = target.x - from.x;
	const dy = target.y - from.y;
	const anim = el.animate([
		{
			transform: "translate(0, 0) scale(1)",
			opacity: 1
		},
		{
			transform: `translate(${dx}px, ${dy}px) scale(0.6)`,
			opacity: 1,
			offset: 1700 / FLY_MS
		},
		{
			transform: `translate(${dx}px, ${dy}px) scale(0.6)`,
			opacity: 0
		}
	], {
		duration: FLY_MS,
		easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
		fill: "forwards"
	});
	anim.onfinish = () => {
		el.remove();
		pulseGoldCounter();
		onArrive?.();
	};
}
/** Port of ureyimsen BottlePassDialog + BottlePassPremiumDialog + bottle_pass_info pager help. */
var CDN = "https://butilochka.cdnvideo.ru/bottle/bundle/dlg300";
var HELP = [
	"Fəsil başa çatmazdan əvvəl mükafatlar əldə etmək üçün xallar qazan və səviyyəni yüksəlt",
	"Hər yeni səviyyədə mükafatları əlçatan et",
	"Hər gün yeni mükafat əldə et",
	"Premium keçid icazəsi olanlar üçün təkrarolunmaz dekor daxil olmaqla, xüsusi güzəştlər və premium mükafatlar"
];
var BOOSTER_NAMES = {
	league_kiss_lim10: "Liqa öpüş limiti +10",
	league_kiss2x: "Liqa öpüşü x2",
	league5: "Liqa +5 xal",
	kiss_fire: "Alovlu öpüş",
	refuse_slap: "Şillə",
	nitrodecor: "Dəst Nitro"
};
function useNow() {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	return now;
}
function rewardText(r) {
	if (!r) return "";
	const parts = [];
	if (r.gold) parts.push(`❤️ ${r.gold}`);
	if (r.tokens) parts.push(`🪙 ${r.tokens}`);
	for (const [k, v] of Object.entries(r.items ?? {})) parts.push(`${BOOSTER_NAMES[k] ?? k} ×${v}`);
	return parts.join(", ");
}
function Prize({ reward }) {
	const v = prizeView(reward);
	if (!v) return null;
	if (v.kind === "heart") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "css-item css-item--heart bottle-pass__item bottle-pass__item--heart",
		style: {
			width: 50,
			height: 50,
			fontSize: 18.18
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "css-item__value ",
			children: ["+", v.value]
		})
	});
	if (v.kind === "tokens") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "css-item css-item--token bottle-pass__item bottle-pass__item--tokens",
		style: {
			width: 36,
			height: 36,
			fontSize: 13.09
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "css-item__value ",
			children: ["+", v.value]
		})
	});
	if (v.kind === "booster") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "booster-item booster-item--list bottle-pass__booster-item",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "booster-item__image",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `booster-item__icon booster-item__icon--${v.id}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "booster-item__hint booster-item__hint--counter",
				children: v.count
			})]
		})
	});
	if (v.kind === "decor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "bottle-pass__item",
		src: `${CDN}/f_${v.id}.webp`,
		width: 56,
		height: 56,
		alt: "",
		crossOrigin: "anonymous"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `bottle-pass__item bottle-pass__item--${v.kind}` });
}
function LevelRow({ info, l, now, onClaim }) {
	const opened = l.level <= info.level;
	const decor = prizeView(l.paid)?.kind === "decor";
	const premiumState = opened && info.pass_premium ? "premium" : "premium-locked";
	const freeState = opened ? "free" : "free-locked";
	const cp = canClaim(info, l, true, now), cf = canClaim(info, l, false, now);
	const icon = (r, mine) => r.claimed ? "claimed" : !mine ? "locked" : "opened";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bottle-pass__level",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `bottle-pass__level-bar bottle-pass__level-bar--${opened ? "opened" : "locked"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-bar-shadow bottle-pass__level-bar-shadow--top" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-bar-shadow bottle-pass__level-bar-shadow--bottom" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `bottle-pass__level-prize bottle-pass__level-prize--${decor ? `premium-decor${premiumState === "premium" ? "" : "-locked"}` : premiumState}`,
				role: "button",
				onClick: (e) => onClaim(l, true, {
					x: e.clientX,
					y: e.clientY
				}),
				children: [
					cp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-prize-light bottle-pass__level-prize-light--premium" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prize, { reward: l.paid }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `bottle-pass__level-prize-icon bottle-pass__level-prize-icon--${icon(l.paid, info.pass_premium)}` }),
					cp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bottle-pass__level-prize-collect bottle-pass__level-prize-collect--premium",
						children: "Topla!"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-dots" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `bottle-pass__level-title bottle-pass__level-title--${opened ? "opened" : "locked"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bottle-pass__level-title bottle-pass__level-title--text",
					children: l.level + 1
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-dots" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `bottle-pass__level-prize bottle-pass__level-prize--${freeState}`,
				role: "button",
				onClick: (e) => onClaim(l, false, {
					x: e.clientX,
					y: e.clientY
				}),
				children: [
					cf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-prize-light bottle-pass__level-prize-light--free" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prize, { reward: l.free }),
					l.free.claimed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-prize-icon bottle-pass__level-prize-icon--claimed" }),
					cf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bottle-pass__level-prize-collect bottle-pass__level-prize-collect--free",
						children: "Topla!"
					})
				]
			})
		]
	});
}
function Popup({ name, z, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `popup popup--center popup--show ${name}`,
		"data-dm-type": "dialog",
		style: {
			pointerEvents: "auto",
			zIndex: z
		},
		children
	});
}
function Close({ onClick, cls }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "popup__close popup__close--dlg",
		role: "button",
		"aria-label": "Bağla",
		onClick,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `popup__close-icon ${cls}` })
	});
}
function SeasonPassDialog({ onClose, startPremium = false }) {
	const [info, setInfo] = (0, import_react.useState)(getCachedPass());
	const [premiumOpen, setPremiumOpen] = (0, import_react.useState)(startPremium);
	const [helpOpen, setHelpOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [claimed, setClaimed] = (0, import_react.useState)(null);
	const now = useNow();
	const scroller = (0, import_react.useRef)(null);
	const t = now + (info ? info.now_ms - Date.now() : 0);
	const reload = () => fetchPassInfo().then((d) => {
		if (d) setInfo(d);
	});
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el || !info) return;
		const rows = el.querySelectorAll(".bottle-pass__level:not(.bottle-pass__level--footer)");
		const row = rows[rows.length - 1 - Math.min(info.level + 1, rows.length - 1)];
		if (row) el.scrollTop = row.offsetTop - el.clientHeight / 2;
		else el.scrollTop = el.scrollHeight;
	}, [info?.level, info === null]);
	const onClaim = async (l, premium, at) => {
		if (!info || busy) return;
		const r = premium ? l.paid : l.free;
		if (r.claimed) {
			showSourceToast("Mükafat artıq alınıb");
			return;
		}
		if (l.start_ms > t) {
			showSourceToast("Bu səviyyəni açmaq üçün daha çox liqa xalı əldə et");
			return;
		}
		if (l.score > info.score) {
			showSourceToast("Bu səviyyəni açmaq üçün daha çox liqa xalı əldə et");
			return;
		}
		if (premium && !info.pass_premium) {
			setPremiumOpen(true);
			return;
		}
		setBusy(true);
		const res = await claimPassLevel(l.level, premium);
		setBusy(false);
		if (res.ok) {
			if (r.gold) {
				flyGoldToCounter(at ?? {
					x: window.innerWidth / 2,
					y: window.innerHeight / 2
				});
				showSourceToast("Mükafat alındı!");
				if (!r.tokens && !Object.keys(r.items ?? {}).length) {
					reload();
					return;
				}
			}
			setClaimed(r);
			reload();
		} else showSourceToast(res.reason === "claimed" ? "Mükafat artıq alınıb" : "Mükafat toplanmadı, yenidən yoxla");
	};
	const onBuy = async () => {
		if (busy || !info) return;
		setBusy(true);
		const r = await buyPassPremium();
		setBusy(false);
		if (r.ok) {
			showSourceToast("✨ Premium icazənamə aktivdir!");
			reload();
		} else showSourceToast(r.reason.includes("insufficient") ? "Kifayət qədər DAT yoxdur 🪙" : r.reason === "purchased" ? "Satın alındı!" : "Alınmadı, yenidən yoxla");
	};
	const onChest = async (at) => {
		if (!info || busy) return;
		if (!info.pass_premium) {
			setPremiumOpen(true);
			return;
		}
		if (info.state === "running") {
			showSourceToast("Mövsüm başa çatana qədər gözlə");
			return;
		}
		setBusy(true);
		const r = await claimPassChest();
		setBusy(false);
		if (r.ok) {
			if (r.gold) flyGoldToCounter(at ?? {
				x: window.innerWidth / 2,
				y: window.innerHeight / 2
			});
			showSourceToast("Mükafat alındı!");
			setClaimed({
				claimed: true,
				gold: r.gold ?? 0
			});
		} else showSourceToast("Sandıq açılmadı");
	};
	const prog = info ? passProgress(info.levels, info.score, info.level) : null;
	const left = info ? info.finish_ms - t : 0;
	const lastLevel = info?.levels.length ?? 35;
	const nextLocked = info?.levels.find((l) => l.start_ms > t);
	const totals = info?.levels.reduce((a, l) => {
		a.gold += l.paid.gold ?? 0;
		a.tokens += l.paid.tokens ?? 0;
		for (const [k, v] of Object.entries(l.paid.items ?? {})) if (!k.endsWith("decor")) a.items[k] = (a.items[k] ?? 0) + v;
		return a;
	}, {
		gold: 0,
		tokens: 0,
		items: {}
	});
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "season-pass-layer",
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1100,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup-shade",
					onClick: onClose
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popup, {
					name: "bottle-pass__x_popup",
					z: 1e3,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "popup__header bottle-pass__x_popup__header",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "popup__title bottle-pass__x_popup__title",
								children: "Mövsümi icazənamə"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bottle-pass__manual",
								role: "button",
								"aria-label": "Qaydalar",
								onClick: () => setHelpOpen(true)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bottle-pass__header-info",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bottle-pass__controls",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass__control bottle-pass__control--premium",
										role: "button",
										onClick: () => setPremiumOpen(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass__premium-icon-bg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__premium-icon" }), info?.pass_premium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__premium-purchased-icon" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bottle-pass__premium-btn-title",
											children: "Premium icazənamə"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass__control bottle-pass__control--state",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `bottle-pass__season-state-icon bottle-pass__season-state-icon--${left > 0 ? "timer" : "finish"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass__season-state-info",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bottle-pass__season-state-title",
												children: left > 0 ? "Etibarlıdır: " : "Mövsüm bitdi"
											}), left > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bottle-pass__season-state-timer",
												children: passLeftText(left)
											})]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bottle-pass__season-stats",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__season-stats-icon" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass__season-stats-progress",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bottle-pass__season-stats-progress bottle-pass__season-stats-progress--bar",
												style: { width: `${prog ? Math.min(100, prog.value / prog.max * 100) : 0}%` }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bottle-pass__season-stats-info",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: prog?.value ?? 0 }),
													"/",
													prog?.max ?? 100
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bottle-pass__season-stats-level bottle-pass__season-stats-level--level",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: Math.min(prog?.next ?? 1, lastLevel) })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__header-border-btm" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
								onClick: onClose,
								cls: "bottle-pass__x_popup__close-icon"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scroller,
						className: "popup__content popup__content--no-padding bottle-pass__x_popup__content",
						style: { overflowY: "auto" },
						children: info && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bottle-pass",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bottle-pass__bonus",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `bottle-pass__bonus-chest-stats bottle-pass__bonus-chest-stats--${info.pass_premium ? "premium" : "disabled"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__bonus-chest-stats-shadow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass__bonus-chest-title",
										children: ["Bonus sandığında: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bottle-pass__bonus-chest-score",
											children: info.chest.gold
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bottle-pass__bonus-chest",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bottle-pass__bonus-chest-title bottle-pass__bonus-chest-title--info",
											children: "Bonus sandığı"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__bonus-chest-icon" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass__bonus-chest-desc",
											children: [
												"Sən ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: lastLevel }),
												" səviyyəsinə çatdıqdan sonra, hər ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "bottle-pass__bonus-chest-desc-icon bottle-pass__bonus-chest-desc-icon--star",
													children: info.chest.overscore2gold
												}),
												" bonus sandığına ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "bottle-pass__bonus-chest-desc-icon bottle-pass__bonus-chest-desc-icon--heart",
													children: "1"
												}),
												" əlavə edəcək. Sandığı, Premium icazənamən olduğu halda mövsümün sonunda açmaq olar."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass__bonus-chest-max",
											children: ["Maksimum: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bottle-pass__bonus-chest-score",
												children: info.chest.gold_max
											})]
										}),
										info.prev_chest > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											role: "button",
											className: "button button--confirm",
											style: { margin: "8px auto 0" },
											onClick: (e) => void onChest({
												x: e.clientX,
												y: e.clientY
											}),
											children: [
												"Sandığı aç (+",
												info.prev_chest,
												" ❤️)"
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bottle-pass__levels",
								children: [
									[...info.levels].reverse().map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelRow, {
										info,
										l,
										now: t,
										onClaim: (lv, p) => void onClaim(lv, p)
									}, l.level)),
									nextLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass__toast",
										style: { position: "relative" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass__toast-title",
											children: [nextLocked.level + 1, " səviyyəsinin açılacağı müddət:"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bottle-pass__toast-timer",
											children: passClock(nextLocked.start_ms - t)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass__level bottle-pass__level--footer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass__level-bar bottle-pass__level-bar--level" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bottle-pass__prize-title bottle-pass__prize-title--premium bottle-pass__prize-title--clickable",
												role: "button",
												onClick: () => setPremiumOpen(true),
												children: "Premium mükafatlar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bottle-pass__level-title bottle-pass__level-title--level",
												children: "Səviyyə"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bottle-pass__prize-title bottle-pass__prize-title--free",
												children: "Mükafatlar"
											})
										]
									})
								]
							})]
						})
					})]
				}),
				premiumOpen && info && totals && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup-shade",
					style: { zIndex: 1001 },
					onClick: () => setPremiumOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popup, {
					name: "bottle-pass-premium__x_popup",
					z: 1002,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "popup__header bottle-pass-premium__x_popup__header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "popup__title bottle-pass-premium__x_popup__title",
								children: "Premium icazənamə"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
								onClick: () => setPremiumOpen(false),
								cls: "bottle-pass-premium__x_popup__close-icon"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__content popup__content--no-padding",
							style: { overflowY: "auto" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bottle-pass-premium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass-premium__info",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bottle-pass-premium__description",
											children: "Mövsüm başa çatana qədər premium mükafatları və xüsusi güzəştləri aşkar et!"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass-premium__pass-icon" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bottle-pass-premium__overall-prize-container",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass-premium__overall-prize",
											children: [
												"Mükafatların ümumi dəyəri ən azı ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "bottle-pass-premium__heart",
													children: "2000"
												}),
												"!"
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass-premium__features",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bottle-pass-premium__feature bottle-pass-premium__feature--decor",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "decor-preview__table",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "decor-preview__photo_bg",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "decor-preview__photo",
															style: { backgroundColor: "rgb(221, 232, 237)" }
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															className: "decor-preview__frame",
															width: 75,
															height: 75,
															crossOrigin: "anonymous",
															src: `${CDN}/f_nitrodecor.webp`,
															alt: ""
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "decor-preview__name_bg",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																className: "decor-preview__stone",
																width: 9,
																height: 9,
																crossOrigin: "anonymous",
																src: `${CDN}/n_nitrodecor.webp`,
																alt: ""
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "decor-preview__name",
																children: "Nitro"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																className: "decor-preview__stone",
																width: 9,
																height: 9,
																crossOrigin: "anonymous",
																src: `${CDN}/n_nitrodecor.webp`,
																alt: ""
															})
														]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "decor-preview__control",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "decor-preview__text",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "decor-preview__title",
															children: "Dəst Nitro"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "decor-preview__desc",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "decor-preview__heart",
																	children: "500"
																}),
																" qiymətində ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "PULSUZ" }),
																" təkrarolunmaz dekor əldə etmək şansı"
															]
														})]
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bottle-pass-premium__feature",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass-premium__feature-icon bottle-pass-premium__feature-icon--name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bottle-pass-premium__feature-title",
													children: "Adını həm söhbətdə, həm də profildə nəzərəçarpacaq şəkildə fərqləndir"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bottle-pass-premium__feature",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass-premium__feature-icon bottle-pass-premium__feature-icon--daily" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bottle-pass-premium__feature-title",
													children: [
														"Gündəlik bonus sayını iki dəfə artır: mövsüm ərzində ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "bottle-pass-premium__heart",
															children: "210"
														}),
														" qədər ürək topla"
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bottle-pass-premium__feature",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass-premium__feature-icon bottle-pass-premium__feature-icon--chest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bottle-pass-premium__feature-title",
													children: [
														"Bütün səviyyələri bitirdikdən sonra bonus sandığında ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "bottle-pass-premium__heart",
															children: info.chest.gold_max
														}),
														" qədər bonus al!"
													]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bottle-pass-premium__prizes",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bottle-pass-premium__prize-title",
											children: "Bütün səviyyələrin tamamlanması üçün digər premium mükafatlar:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bottle-pass-premium__prize-list",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "css-item css-item--heart bottle-pass-premium__item bottle-pass-premium__item--heart",
													style: {
														width: 42,
														height: 42,
														fontSize: 13
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "css-item__value ",
														children: ["+", totals.gold]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "css-item css-item--token-small bottle-pass-premium__item",
													style: {
														width: 42,
														height: 42,
														fontSize: 13
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "css-item__value ",
														children: ["+", totals.tokens]
													})
												}),
												Object.entries(totals.items).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "booster-item booster-item--info bottle-pass-premium__item bottle-pass-premium__item--booster",
													style: {
														width: 42,
														height: 42,
														fontSize: 11
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "booster-item__image",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															width: 42,
															height: 42,
															crossOrigin: "anonymous",
															src: `${CDN}/boost_${k}.webp`,
															alt: ""
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "booster-item__hint booster-item__hint--counter",
															style: { padding: "0 5px" },
															children: v
														})]
													})
												}, k))
											]
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__buttons popup__buttons--center bottle-pass-premium__x_buttons popup__border--top",
							children: info.pass_premium ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bottle-pass-premium__status bottle-pass-premium__status--purchased",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bottle-pass-premium__success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bottle-pass-premium__btn-label bottle-pass-premium__btn-label--purchased",
									children: "Satın alındı!"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bottle-pass-premium__status bottle-pass-premium__status--buy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									role: "button",
									className: `button button--confirm bottle-pass-premium__x_button${busy ? " bottle-pass-premium__x_button--disabled" : ""}`,
									onClick: () => void onBuy(),
									children: [
										"Al ",
										info.price,
										" DAT"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bottle-pass-premium__timer",
									children: ["Etibarlıdır: ", passLeftText(left)]
								})]
							})
						})
					]
				})] }),
				helpOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PassHelp, { onClose: () => setHelpOpen(false) }),
				claimed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup-shade",
					style: { zIndex: 1003 },
					onClick: () => setClaimed(null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popup, {
					name: "info__x_popup",
					z: 1004,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "popup__header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "popup__title",
								children: "Mükafat toplandı!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
								onClick: () => setClaimed(null),
								cls: ""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "popup__content popup__content--center",
							style: {
								textAlign: "center",
								padding: "14px 16px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									justifyContent: "center",
									marginBottom: 10
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prize, { reward: claimed })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { fontSize: 15 },
								children: rewardText(claimed)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__buttons popup__buttons--center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "button",
								className: "button button--confirm",
								onClick: () => setClaimed(null),
								children: "Əla!"
							})
						})
					]
				})] })
			]
		})
	}), document.body);
}
function PassHelp({ onClose }) {
	const [page, setPage] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "popup-shade",
		style: { zIndex: 1001 },
		onClick: onClose
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popup, {
		name: "info__x_popup pager-help__x_popup",
		z: 1002,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup__title",
				children: "Qaydalar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
				onClick: onClose,
				cls: ""
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__content",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pager pager-help__previews",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pager__page pager-help__preview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pager-help__preview",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pager-help__image pager-help__image--bp-help-${page + 1}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pager-help__desc",
							children: HELP[page]
						})]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "page-scroller-controls__container pager-help__controls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `pager-help__control pager-help__control--backward${page > 0 ? " pager-help__control--active" : ""}`,
						role: "button",
						onClick: () => setPage((p) => Math.max(0, p - 1))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "page-scroller-controls__dots-container",
						children: [HELP.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "button",
							className: `page-scroller-controls__dot${i === page ? "" : " page-scroller-controls__dot--clickable"}`,
							onClick: () => setPage(i)
						}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "page-scroller-controls__indicator",
							style: { left: 12 + page * 18 }
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `pager-help__control pager-help__control--forward${page < HELP.length - 1 ? " pager-help__control--active" : ""}`,
						role: "button",
						onClick: () => setPage((p) => Math.min(HELP.length - 1, p + 1))
					})
				]
			})]
		})]
	})] });
}
//#endregion
export { SeasonPassDialog };
