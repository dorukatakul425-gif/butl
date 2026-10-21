import { a as objectType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/player-appearance-BO0_Ac72.js
var NAME_STYLES = [
	"default",
	"ruby",
	"emerald",
	"sapphire",
	"gold",
	"rose",
	"rainbow"
];
var NAME_STYLE_LABELS = {
	default: "Standart",
	ruby: "Yaqut",
	emerald: "Zümrüd",
	sapphire: "Sapfir",
	gold: "Qızıl",
	rose: "Qızılgül",
	rainbow: "Göy qurşağı"
};
var appearanceInput = objectType({
	userId: stringType().uuid(),
	nameStyle: enumType(NAME_STYLES),
	creator: booleanType()
});
var DEFAULT_APPEARANCE = {
	level: 0,
	nameStyle: "default",
	creator: false
};
function validNameStyle(value) {
	return NAME_STYLES.find((style) => style === value) ?? "default";
}
/** A revision observed after this document opened needs confirmation, never an automatic reload. */
function needsRefresh(event, openedAt, seen) {
	return Boolean(event && !seen.has(event.id) && Date.parse(event.created_at) >= openedAt);
}
//#endregion
export { needsRefresh as a, appearanceInput as i, NAME_STYLES as n, validNameStyle as o, NAME_STYLE_LABELS as r, DEFAULT_APPEARANCE as t };
