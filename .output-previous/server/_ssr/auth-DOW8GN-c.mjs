import { i as __toESM } from "../_runtime.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as usernameEmail, n as normalizeUsername, t as getSupabase } from "./supabase-BUCaDQ6-.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { i as useAuth, n as refreshProfile } from "./auth-BrRZs5FB.mjs";
import { a as useAppTranslation, o as usePreferences } from "./app-preferences-zyvxFMgU.mjs";
import { a as isBanError, t as checkBanForUsername } from "./ban-CafDu266.mjs";
import { H as Eye, I as LockKeyhole, L as LoaderCircle, U as EyeOff, Y as CircleAlert, ot as ArrowRight, s as UserRound, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as AppControls } from "./app-controls-D3gGUfTe.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DOW8GN-c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var auth_logo_default = "/assets/auth-logo-C3zqRrgr.png";
function LiveIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.4",
		strokeLinecap: "round",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.5 9.5a9.2 9.2 0 0 0 0 13" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22.5 9.5a9.2 9.2 0 0 1 0 13" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M5.2 5.2a15.3 15.3 0 0 0 0 21.6",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M26.8 5.2a15.3 15.3 0 0 1 0 21.6",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				className: "auth-live-dot",
				cx: "16",
				cy: "16",
				r: "4",
				stroke: "none"
			})
		]
	});
}
var authStyles = `
.butl-auth {
  --auth-bg: oklch(0.2 0.045 20);
  --auth-bg-2: oklch(0.13 0.03 15);
  --auth-glow-1: oklch(0.62 0.21 25 / 0.45);
  --auth-glow-2: oklch(0.7 0.17 145 / 0.3);
  --auth-highlight: oklch(0.86 0.13 75);
  --auth-headline: linear-gradient(100deg, oklch(0.97 0.02 80) 0%, oklch(0.88 0.12 70) 60%, oklch(0.8 0.16 40) 100%);
  --auth-text: oklch(0.98 0.005 60);
  --auth-muted: oklch(0.78 0.02 40);
  --auth-sheet: oklch(0.22 0.03 20 / 0.72);
  --auth-surface: oklch(1 0 0 / 0.07);
  --auth-surface-2: oklch(1 0 0 / 0.12);
  --auth-border: oklch(1 0 0 / 0.13);
  --auth-brand: oklch(0.66 0.21 25);
  --auth-brand-2: oklch(0.58 0.22 15);
  --auth-brand-grad: linear-gradient(135deg, oklch(0.72 0.19 35) 0%, oklch(0.6 0.23 20) 100%);
  --auth-ink: oklch(0.99 0 0);
  --auth-live: oklch(0.64 0.24 25);
  --auth-error: oklch(0.85 0.1 25);
  --auth-error-bg: oklch(0.4 0.12 25 / 0.35);
  --auth-shadow: 0 18px 50px oklch(0.05 0.02 20 / 0.55);
  --auth-btn-shadow: 0 10px 28px oklch(0.6 0.22 25 / 0.45);
  --background: var(--auth-bg);
  --foreground: var(--auth-text);
  --primary: var(--auth-brand);
  --primary-foreground: var(--auth-ink);
  --muted-foreground: var(--auth-muted);
  --accent: var(--auth-surface);
  --accent-foreground: var(--auth-text);
  --input: var(--auth-border);
  --ring: var(--auth-brand);
  --auth-font: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  box-sizing: border-box; width: 100%; min-height: 100svh; min-height: 100dvh;
  position: relative;
  background:
    radial-gradient(120% 60% at 0% 0%, var(--auth-glow-1), transparent 60%),
    radial-gradient(90% 50% at 100% 100%, var(--auth-glow-2), transparent 60%),
    linear-gradient(180deg, var(--auth-bg) 0%, var(--auth-bg-2) 100%);
  color: var(--auth-text); font-family: var(--auth-font);
  letter-spacing: 0; overflow-x: clip; isolation: isolate;
  display: flex; flex-direction: column; align-items: center;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  -webkit-text-size-adjust: 100%;
}
.butl-auth *, .butl-auth *::before, .butl-auth *::after { box-sizing: border-box; letter-spacing: 0; }
.butl-auth .auth-top { width: 100%; max-width: 440px; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; }
.butl-auth .auth-wordmark { margin: 0; font-size: 20px; line-height: 1.3; font-weight: 800; white-space: nowrap; }
.butl-auth .auth-wordmark span { color: var(--auth-highlight); font-weight: 600; }
.butl-auth .auth-content { width: 100%; min-width: 0; max-width: 440px; margin: auto 0; padding: 20px 0; }
.butl-auth .auth-intro { text-align: center; margin-bottom: 22px; }
.butl-auth .auth-brand-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin: 0 auto 18px; }
.butl-auth .auth-mark { width: 96px; height: 96px; object-fit: cover; display: block; border-radius: 26px; box-shadow: var(--auth-shadow), 0 0 0 3px oklch(1 0 0 / 0.12); animation: auth-float 4s ease-in-out infinite; }
.butl-auth .auth-live { position: relative; width: 64px; height: 64px; border-radius: 20px; display: grid; place-items: center; background: var(--auth-surface-2); border: 1px solid var(--auth-border); box-shadow: var(--auth-shadow); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.butl-auth .auth-live svg { width: 34px; height: 34px; color: var(--auth-text); }
.butl-auth .auth-live-dot { fill: var(--auth-live); transform-origin: center; animation: auth-pulse 1.4s ease-in-out infinite; }
.butl-auth .auth-live-label { position: absolute; bottom: -9px; left: 50%; transform: translateX(-50%); padding: 2px 7px; border-radius: 999px; background: var(--auth-live); color: var(--auth-ink); font-size: 9px; font-weight: 800; line-height: 1.4; text-transform: uppercase; white-space: nowrap; box-shadow: 0 4px 12px oklch(0.6 0.24 25 / 0.5); }
.butl-auth h1 { font-size: 26px; line-height: 1.25; font-weight: 800; margin: 0 0 8px; overflow-wrap: break-word; text-wrap: balance; color: var(--auth-highlight); }
@supports (background-clip: text) { .butl-auth h1 { background: var(--auth-headline); background-clip: text; -webkit-background-clip: text; color: transparent; } }
.butl-auth .auth-subtitle { margin: 0; font-size: 14px; line-height: 1.55; color: var(--auth-muted); }
.butl-auth .auth-sheet { background: var(--auth-sheet); border: 1px solid var(--auth-border); border-radius: 28px; padding: 18px; box-shadow: var(--auth-shadow); backdrop-filter: blur(18px) saturate(140%); -webkit-backdrop-filter: blur(18px) saturate(140%); }
.butl-auth .auth-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 5px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 999px; margin-bottom: 20px; }
.butl-auth .auth-tab { border: 0; height: 42px; min-width: 0; border-radius: 999px; background: transparent; color: var(--auth-muted); font-size: 14px; font-weight: 700; box-shadow: none; white-space: normal; transition: background .2s, color .2s; }
.butl-auth .auth-tab:hover { background: var(--auth-surface); color: var(--auth-text); }
.butl-auth .auth-tab[aria-pressed="true"] { background: var(--auth-brand-grad); color: var(--auth-ink); box-shadow: var(--auth-btn-shadow); }
.butl-auth .auth-form { display: grid; gap: 14px; }
.butl-auth .auth-field { display: grid; gap: 7px; min-width: 0; }
.butl-auth .auth-label { color: var(--auth-muted); font-size: 12px; font-weight: 700; line-height: 1.4; padding-left: 4px; }
.butl-auth .auth-input-wrap { position: relative; min-width: 0; }
.butl-auth .auth-input { width: 100%; height: 54px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 16px; color: var(--auth-text); font-family: inherit; font-size: 16px; line-height: 1.4; padding: 0 16px; box-shadow: none; transition: border-color .2s, background .2s; }
.butl-auth .auth-input:focus { background: var(--auth-surface-2); border-color: var(--auth-brand); }
.butl-auth .auth-input.with-icon { padding-left: 48px; }
.butl-auth .auth-input.password { padding-right: 54px; }
.butl-auth .auth-input::placeholder { color: var(--auth-muted); opacity: 0.7; }
.butl-auth .auth-input:focus-visible { outline: none; box-shadow: 0 0 0 4px oklch(0.66 0.21 25 / 0.25); }
.butl-auth .auth-field-icon { position: absolute; left: 17px; top: 18px; width: 18px; height: 18px; color: var(--auth-muted); pointer-events: none; }
.butl-auth .auth-eye { border: 0; position: absolute; right: 5px; top: 5px; width: 44px; height: 44px; padding: 0; border-radius: 12px; background: transparent; color: var(--auth-muted); box-shadow: none; }
.butl-auth .auth-eye:hover { color: var(--auth-text); background: var(--auth-surface); }
.butl-auth .auth-eye svg { width: 19px; height: 19px; }
.butl-auth .auth-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 12px; }
.butl-auth .auth-gender { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.butl-auth .auth-gender-button { min-width: 0; height: 54px; padding: 0 8px; border: 1px solid var(--auth-border); background: var(--auth-surface); color: var(--auth-muted); border-radius: 16px; box-shadow: none; font-size: 14px; font-weight: 700; }
.butl-auth .auth-gender-button:hover { background: var(--auth-surface-2); color: var(--auth-text); }
.butl-auth .auth-gender-button[aria-pressed="true"] { border-color: var(--auth-brand); color: var(--auth-text); background: oklch(0.66 0.21 25 / 0.22); }
.butl-auth .auth-submit { width: 100%; min-height: 56px; height: auto; padding: 15px 20px; display: grid; grid-template-columns: 20px minmax(0, 1fr) 20px; gap: 10px; background: var(--auth-brand-grad); color: var(--auth-ink); border: 0; border-radius: 18px; font-size: 16px; font-weight: 800; box-shadow: var(--auth-btn-shadow); white-space: normal; margin-top: 6px; transition: transform .15s, filter .2s; }
.butl-auth .auth-submit:hover { filter: brightness(1.07); }
.butl-auth .auth-submit:active { transform: scale(0.98); }
.butl-auth .auth-submit svg { width: 20px; height: 20px; }
.butl-auth .auth-submit:disabled { opacity: 0.6; }
.butl-auth .auth-error { display: grid; grid-template-columns: 18px minmax(0, 1fr); align-items: start; gap: 10px; padding: 12px; border-radius: 14px; background: var(--auth-error-bg); color: var(--auth-error); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.butl-auth .auth-error svg { width: 18px; height: 18px; margin-top: 1px; }
.butl-auth .auth-switch { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; margin: 12px 0 0; font-size: 13px; line-height: 1.5; color: var(--auth-muted); }
.butl-auth .auth-switch-button { border: 0; background: transparent; min-height: 44px; height: auto; padding: 8px 4px; color: var(--auth-highlight); font-size: 13px; font-weight: 700; white-space: normal; }
.butl-auth .auth-footer { max-width: 440px; flex-wrap: wrap; display: flex; align-items: center; justify-content: center; gap: 7px; color: var(--auth-muted); font-size: 11px; line-height: 1.5; text-align: center; width: 100%; }
.butl-auth .auth-footer-brand { flex-basis: 100%; margin: 0 0 6px; font-size: 12px; line-height: 1.6; color: var(--auth-muted); }
.butl-auth .auth-footer-brand strong { color: var(--auth-highlight); font-weight: 700; }
.butl-auth .auth-footer svg { width: 14px; height: 14px; flex-shrink: 0; }
.butl-auth .auth-spin { animation: auth-spin 0.8s linear infinite; }
@keyframes auth-spin { to { transform: rotate(360deg); } }
@keyframes auth-float { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
@keyframes auth-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.8); } }
@media (min-width: 640px) { .butl-auth { padding: 28px 40px; } .butl-auth .auth-sheet { padding: 24px; } }
@media (max-height: 720px) { .butl-auth .auth-content { padding: 12px 0; } .butl-auth .auth-mark { width: 72px; height: 72px; border-radius: 20px; } .butl-auth .auth-live { width: 52px; height: 52px; border-radius: 16px; } .butl-auth .auth-intro { margin-bottom: 14px; } .butl-auth .auth-form { gap: 10px; } .butl-auth h1 { font-size: 22px; } }
@media (prefers-reduced-motion: reduce) { .butl-auth *, .butl-auth *::before, .butl-auth *::after { animation: none !important; transition: none !important; } }
`;
function AuthPage() {
	const preferences = usePreferences();
	const t = useAppTranslation();
	const auth = useAuth();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("login");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [age, setAge] = (0, import_react.useState)("");
	const [male, setMale] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const login = mode === "login";
	const unavailable = auth.ready && !auth.configured;
	(0, import_react.useEffect)(() => {
		if (auth.ready && auth.session && auth.profile) navigate({ to: "/" });
	}, [
		auth.ready,
		auth.session,
		auth.profile,
		navigate
	]);
	const changeMode = (next) => {
		if (busy || next === mode) return;
		setMode(next);
		setError("");
		setShowPassword(false);
	};
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		const sb = getSupabase();
		if (!sb) {
			setError(t("Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et."));
			return;
		}
		const uname = normalizeUsername(username);
		if (uname.length < 3) {
			setError(t("İstifadəçi adı ən azı 3 hərf və ya rəqəmdən ibarət olmalıdır."));
			return;
		}
		if (password.length < 6) {
			setError(t("Şifrə ən azı 6 simvoldan ibarət olmalıdır."));
			return;
		}
		setBusy(true);
		setError("");
		try {
			if (mode === "login") {
				const { error } = await sb.auth.signInWithPassword({
					email: usernameEmail(uname),
					password
				});
				if (error && !await checkBanForUsername(uname) && !isBanError(error.message)) setError(t("İstifadəçi adı və ya şifrə yanlışdır."));
			} else {
				const { data, error } = await sb.auth.signUp({
					email: usernameEmail(uname),
					password,
					options: { data: {
						username: uname,
						name: name.trim() || uname,
						male,
						age: age || null
					} }
				});
				if (error) setError(error.message.includes("registered") ? t("Bu istifadəçi adı artıq istifadə olunur.") : t("Qeydiyyat alınmadı. Məlumatlarını yoxlayıb yenidən cəhd et."));
				else if (!data.session) setError(t("Hesab yaradıldı. Daxil olmaq üçün hesabın təsdiqlənməlidir."));
				else await refreshProfile();
			}
		} catch {
			setError(t("Bağlantıda problem yarandı. Yenidən cəhd et."));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "butl-auth",
		lang: preferences.language,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: authStyles }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "auth-top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "auth-wordmark",
					children: ["Deltagame", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ".az" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppControls, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "auth-content",
				"aria-labelledby": "auth-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "auth-intro",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "auth-brand-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: auth_logo_default,
									alt: "Deltagame.az",
									className: "auth-mark",
									width: "96",
									height: "96"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "auth-live",
									role: "img",
									"aria-label": t("Canlı"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveIcon, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "auth-live-label",
										children: t("Canlı")
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								id: "auth-heading",
								children: login ? t("Əyləncənin dadını çıxarmağa hazırsan?") : t("Tanışlıq buradan başlayır")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "auth-subtitle",
								children: login ? t("Söhbətə qaldığın yerdən davam et.") : t("Öz hesabını yarat, yeni insanlarla tanış ol.")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "auth-sheet",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "auth-tabs",
							role: "group",
							"aria-label": t("Hesaba giriş üsulu"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								className: "auth-tab",
								"aria-pressed": login,
								disabled: busy,
								onClick: () => changeMode("login"),
								children: t("Giriş")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								className: "auth-tab",
								"aria-pressed": !login,
								disabled: busy,
								onClick: () => changeMode("register"),
								children: t("Qeydiyyat")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "auth-form",
							onSubmit: submit,
							"aria-busy": busy,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "auth-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "auth-label",
										htmlFor: "auth-username",
										children: t("İstifadəçi adı")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "auth-input-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
											className: "auth-field-icon",
											"aria-hidden": "true"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "auth-username",
											name: "username",
											className: "auth-input with-icon",
											placeholder: t("İstifadəçi adını yaz"),
											value: username,
											onChange: (e) => setUsername(e.target.value),
											autoComplete: "username",
											autoCapitalize: "none",
											autoCorrect: "off",
											spellCheck: false,
											disabled: busy,
											required: true
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "auth-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "auth-label",
										htmlFor: "auth-password",
										children: t("Şifrə")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "auth-input-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, {
												className: "auth-field-icon",
												"aria-hidden": "true"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "auth-password",
												name: "password",
												className: "auth-input with-icon password",
												placeholder: t("Şifrəni yaz"),
												type: showPassword ? "text" : "password",
												value: password,
												onChange: (e) => setPassword(e.target.value),
												autoComplete: login ? "current-password" : "new-password",
												autoCapitalize: "none",
												autoCorrect: "off",
												spellCheck: false,
												disabled: busy,
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "ghost",
												className: "auth-eye",
												"aria-label": showPassword ? t("Şifrəni gizlət") : t("Şifrəni göstər"),
												title: showPassword ? t("Şifrəni gizlət") : t("Şifrəni göstər"),
												"aria-pressed": showPassword,
												onClick: () => setShowPassword((value) => !value),
												disabled: busy,
												children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {})
											})
										]
									})]
								}),
								!login && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "auth-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "auth-label",
										htmlFor: "auth-name",
										children: t("Oyunda görünən ad")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "auth-name",
										name: "name",
										className: "auth-input",
										placeholder: t("Sənə necə müraciət edək?"),
										value: name,
										onChange: (e) => setName(e.target.value),
										maxLength: 20,
										autoComplete: "nickname",
										disabled: busy
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "auth-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "auth-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "auth-label",
											htmlFor: "auth-age",
											children: t("Yaş")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "auth-age",
											name: "age",
											className: "auth-input",
											placeholder: t("Yaşın"),
											type: "number",
											inputMode: "numeric",
											min: 14,
											max: 99,
											value: age,
											onChange: (e) => setAge(e.target.value),
											disabled: busy
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "auth-field",
										role: "group",
										"aria-labelledby": "auth-gender-label",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											id: "auth-gender-label",
											className: "auth-label",
											children: t("Cins")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "auth-gender",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												className: "auth-gender-button",
												"aria-pressed": male,
												disabled: busy,
												onClick: () => setMale(true),
												children: t("Kişi")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												className: "auth-gender-button",
												"aria-pressed": !male,
												disabled: busy,
												onClick: () => setMale(false),
												children: t("Qadın")
											})]
										})]
									})]
								})] }),
								(error || unavailable) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "auth-error",
									role: "alert",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { "aria-hidden": "true" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error || t("Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et.") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									className: "auth-submit",
									disabled: busy || unavailable,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "aria-hidden": "true" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy ? t("Bir az gözlə…") : login ? t("Daxil ol") : t("Hesab yarat") }),
										busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
											className: "auth-spin",
											"aria-hidden": "true"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { "aria-hidden": "true" })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "auth-switch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: login ? t("Hələ hesabın yoxdur?") : t("Artıq hesabın var?") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "link",
							className: "auth-switch-button",
							disabled: busy,
							onClick: () => changeMode(login ? "register" : "login"),
							children: login ? t("Qeydiyyatdan keç") : t("Daxil ol")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "auth-footer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "auth-footer-brand",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Deltagame.az" }),
							" — ",
							t("hər fırlanış yeni tanışlıq, hər oyun unudulmaz bir an. Şüşəni fırlat və əyləncəyə qoşul!")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { "aria-hidden": "true" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("Şifrən heç vaxt digər oyunçulara göstərilmir.") })
				]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
