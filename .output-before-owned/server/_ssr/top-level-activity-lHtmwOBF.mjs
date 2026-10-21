//#region node_modules/.nitro/vite/services/ssr/assets/top-level-activity-lHtmwOBF.js
/** Telegram Puanlar extra sections (ureyimsen TopsDialog: glv + activity). */
var LEVEL_POINTS = 1400;
/** Every heart spent on gifts is 1 level point; 1400 points = 1 level, capped at 100. */
function levelFromPoints(points) {
	return Math.min(100, Math.floor(Math.max(0, Number(points) || 0) / LEVEL_POINTS));
}
/** Original La.text: "{m} dəq", "{h} saat", "{h} saat {m} dəq". */
function activityText(minutes, hoursOnly = false) {
	const total = Math.max(0, Math.floor(Number(minutes) || 0));
	const h = Math.floor(total / 60), m = total % 60;
	if (!h) return `${m} dəq`;
	const hours = h.toLocaleString("tr-TR");
	return hoursOnly || !m ? `${hours} saat` : `${hours} saat ${m} dəq`;
}
/** Original score cell: activity -> time, glv -> "Lv N" (absolute list, level > 0), else the number. */
function extraScoreText(section, score, period) {
	if (section === "activity") return activityText(score);
	const level = period ? 0 : levelFromPoints(score);
	return level ? `Lv ${level}` : score.toLocaleString("tr-TR");
}
//#endregion
export { extraScoreText as n, levelFromPoints as r, activityText as t };
