import { i as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as useAppTranslation, n as languages, o as usePreferences, r as setPreferences } from "./app-preferences-zyvxFMgU.mjs";
import { $ as Check, E as Moon, Q as ChevronDown, m as Sun } from "../_libs/lucide-react.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/app-controls-D3gGUfTe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var flags = {
	az: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2060%2030'%3e%3cpath%20fill='%2300b5e2'%20d='M0%200h60v10H0z'/%3e%3cpath%20fill='%23ef3340'%20d='M0%2010h60v10H0z'/%3e%3cpath%20fill='%23509e2f'%20d='M0%2020h60v10H0z'/%3e%3cpath%20fill='%23fff'%20d='M31%2010a5%205%200%201%200%200%2010%204%204%200%201%201%200-10Z'/%3e%3cpath%20fill='%23fff'%20d='m35%2011%201%202%202-1-1%202%202%201-2%201%201%202-2-1-1%202-1-2-2%201%201-2-2-1%202-1-1-2%202%201Z'/%3e%3c/svg%3e",
	tr: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2060%2030'%3e%3cpath%20fill='%23e30a17'%20d='M0%200h60v30H0z'/%3e%3ccircle%20fill='%23fff'%20cx='24'%20cy='15'%20r='8'/%3e%3ccircle%20fill='%23e30a17'%20cx='27'%20cy='15'%20r='6.5'/%3e%3cpath%20fill='%23fff'%20d='m35%2010%201.2%203.6H40l-3%202.2%201.2%203.6-3.2-2.2-3.2%202.2%201.2-3.6-3-2.2h3.8Z'/%3e%3c/svg%3e",
	ru: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2060%2030'%3e%3cpath%20fill='%23fff'%20d='M0%200h60v10H0z'/%3e%3cpath%20fill='%230039a6'%20d='M0%2010h60v10H0z'/%3e%3cpath%20fill='%23d52b1e'%20d='M0%2020h60v10H0z'/%3e%3c/svg%3e",
	en: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2060%2030'%3e%3cpath%20fill='%23012169'%20d='M0%200h60v30H0z'/%3e%3cpath%20stroke='%23fff'%20stroke-width='6'%20d='m0%200%2060%2030m0-30L0%2030'/%3e%3cpath%20stroke='%23c8102e'%20stroke-width='2'%20d='m0%200%2060%2030m0-30L0%2030'/%3e%3cpath%20stroke='%23fff'%20stroke-width='10'%20d='M30%200v30M0%2015h60'/%3e%3cpath%20stroke='%23c8102e'%20stroke-width='6'%20d='M30%200v30M0%2015h60'/%3e%3c/svg%3e"
};
function AppControls() {
	const { language, theme } = usePreferences();
	const t = useAppTranslation();
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const trigger = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const outside = (e) => {
			if (e.target instanceof Node && !ref.current?.contains(e.target)) setOpen(false);
		};
		const escape = (e) => {
			if (e.key === "Escape") {
				setOpen(false);
				trigger.current?.focus();
			}
		};
		document.addEventListener("pointerdown", outside);
		document.addEventListener("keydown", escape);
		return () => {
			document.removeEventListener("pointerdown", outside);
			document.removeEventListener("keydown", escape);
		};
	}, [open]);
	const selected = languages.find((l) => l.code === language) ?? {
		code: "az",
		name: "Azərbaycan",
		flag: "🇦🇿"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-controls",
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				className: "app-theme-control",
				onClick: () => setPreferences({ theme: theme === "dark" ? "light" : "dark" }),
				"aria-label": t(theme === "dark" ? "Gündüz rejimi" : "Gecə rejimi"),
				title: t(theme === "dark" ? "Gündüz rejimi" : "Gecə rejimi"),
				children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { size: 18 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				ref: trigger,
				className: "app-language-control",
				"aria-label": t("Dil"),
				"aria-expanded": open,
				"aria-controls": "app-language-options",
				onClick: () => setOpen((v) => !v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: flags[selected.code],
						alt: "",
						width: 24,
						height: 16
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: language.toUpperCase() }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 12 })
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "app-language-menu",
				id: "app-language-options",
				role: "group",
				"aria-label": t("Dil"),
				children: languages.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					type: "button",
					lang: l.code,
					"aria-pressed": l.code === language,
					onClick: () => {
						setPreferences({ language: l.code });
						setOpen(false);
						trigger.current?.focus();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: flags[l.code],
							alt: "",
							width: 24,
							height: 16
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.name }),
						l.code === language && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 })
					]
				}, l.code))
			})
		]
	});
}
//#endregion
export { AppControls as t };
