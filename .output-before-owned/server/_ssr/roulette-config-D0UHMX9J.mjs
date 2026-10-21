import { a as objectType, i as numberType, n as booleanType, s as ZodIssueCode, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roulette-config-D0UHMX9J.js
var rouletteConfigSchema = objectType({
	enabled: booleanType(),
	spinCost: numberType().int().min(1).max(1e4),
	dailyChances: numberType().int().min(0).max(1e4),
	bundleChances: numberType().int().min(1).max(1e4),
	bundleDat: numberType().int().min(1).max(1e6),
	revision: numberType().int().nonnegative(),
	prizes: arrayType(objectType({
		id: numberType().int().min(0).max(15),
		percentage: numberType().min(0).max(100).refine((v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6, "Ən çox iki onluq rəqəm.")
	})).length(16)
}).superRefine((v, ctx) => {
	if (new Set(v.prizes.map((p) => p.id)).size !== 16) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "Bütün 16 mükafat bir dəfə göstərilməlidir."
	});
	if (v.prizes.reduce((s, p) => s + Math.round(p.percentage * 100), 0) !== 1e4) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "Ehtimalların cəmi 100% olmalıdır."
	});
});
var roulettePrizeNames = {
	chances: "Çarx şansı",
	tokens: "Token",
	gold: "Ürək",
	kiss_fire: "Alovlu öpüş",
	league5: "Liqa gücləndiricisi",
	league_kiss2x: "İkiqat liqa öpüşü",
	refuse_slap: "Şillə ilə imtina"
};
//#endregion
export { roulettePrizeNames as n, rouletteConfigSchema as t };
