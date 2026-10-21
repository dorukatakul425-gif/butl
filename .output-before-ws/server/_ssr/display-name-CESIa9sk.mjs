//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/display-name-CESIa9sk.js
/**
* Ciliz parity: masadaki etiket "Ad, yaş" formatındadır ve Telegram adındaki
* emojiler/semboller masada gösterilmez. Harfler (ə, ğ, ı, кириллица dahil),
* rakamlar, boşluk ve temel noktalama kalır; gerisi silinir.
*/
function cleanDisplayName(name) {
	return name.replace(/[^\p{L}\p{N} .,'-]/gu, "").replace(/\s+/g, " ").trim();
}
//#endregion
export { cleanDisplayName as t };
