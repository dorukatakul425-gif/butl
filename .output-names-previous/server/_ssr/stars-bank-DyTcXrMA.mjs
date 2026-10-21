//#region node_modules/.nitro/vite/services/ssr/assets/stars-bank-DyTcXrMA.js
var TG_STARS_PACKAGES = [
	{
		stars: 50,
		gold: 50,
		bonus: 0
	},
	{
		stars: 250,
		gold: 250,
		bonus: 0
	},
	{
		stars: 500,
		gold: 500,
		bonus: 0
	},
	{
		stars: 1e3,
		gold: 1e3,
		bonus: 200,
		label: "hit"
	},
	{
		stars: 2500,
		gold: 2500,
		bonus: 625
	},
	{
		stars: 5e3,
		gold: 5e3,
		bonus: 2e3,
		label: "profitable"
	}
];
/** BankDialog ile aynı sıralama: büyük paket üstte, idx = options.length - i. */
function starsBankOptions() {
	const sorted = [...TG_STARS_PACKAGES].sort((a, b) => b.gold - a.gold);
	return sorted.map((o, i) => ({
		stars: o.stars,
		gold: o.gold,
		bonus: o.bonus,
		idx: sorted.length - i,
		label: "label" in o ? { type: o.label } : void 0
	}));
}
/** Fatura payload'ı: hearts.{toplamKalp}.{stars}.{telegramId} — bot ödemeyi buna göre doğrular. */
function buildStarsPayload(totalGold, stars, telegramId) {
	return `hearts.${totalGold}.${stars}.${telegramId}`;
}
//#endregion
export { buildStarsPayload as n, starsBankOptions as r, TG_STARS_PACKAGES as t };
