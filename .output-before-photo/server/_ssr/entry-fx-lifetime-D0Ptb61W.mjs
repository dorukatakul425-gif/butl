import { C as translate } from "./player-name-Cyu_I4Wa.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/entry-fx-lifetime-D0Ptb61W.js
var RAND_MOD = 233280;
/** random(seed) LCG from preloader.js (used for the 'ava' stick position). */
function seededRandom(seed) {
	let s = Math.round(seed || 0);
	return () => {
		s = (s % RAND_MOD * 9301 + 49297) % RAND_MOD;
		return s / RAND_MOD;
	};
}
function createSentGift(assets, d, randomValue) {
	const random = Math.round(randomValue || 0);
	const pick = (list) => list[random % list.length];
	const spines = d.spine_v2 || d.spine;
	const spine = spines?.length ? pick(spines) : void 0;
	return {
		type: d.type,
		random,
		flyImage: pick(d.flyImages),
		stickImage: pick(d.stickImages),
		spine,
		spineFinishSec: spine ? assets.spines[spine]?.finishSec : void 0,
		startSound: pick(d.startSounds),
		finishSound: pick(d.finishSounds),
		stickPoint: d.stickPoint,
		vfx: d.vfx
	};
}
/** Store list (gifts.__store) filtered the same way the game hides unavailable entries. */
function buildGiftItems(assets, social, viewer = {
	kisses: 0,
	vip: false
}) {
	const seen = /* @__PURE__ */ new Set();
	const items = [];
	for (const entry of assets.giftStore) {
		if (entry.id.startsWith("__") || entry.birthday || seen.has(entry.id)) continue;
		if (entry.social && !entry.social.includes(social)) continue;
		if (entry.user_s && !(viewer.id && entry.user_s.includes(viewer.id))) continue;
		if (entry.platform && !entry.platform.includes(viewer.platform ?? "web")) continue;
		const gift = assets.gifts[entry.id];
		if (!gift || !gift.storeImage || !assets.images[gift.storeImage]) continue;
		seen.add(entry.id);
		items.push({
			type: entry.id,
			name: translate(assets, `${gift.category}:${gift.type}`),
			image: gift.storeImage,
			price: gift.storePrice,
			gift,
			lock: entry.kisses_s && viewer.kisses < entry.kisses_s ? {
				kind: "kisses",
				need: entry.kisses_s
			} : entry.vip_s && !viewer.vip ? { kind: "vip" } : void 0
		});
	}
	const rank = (i) => i.lock ? i.lock.kind === "kisses" ? 1 : 2 : 0;
	return items.map((item, index) => ({
		item,
		index
	})).sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index).map((x) => x.item);
}
/** A delayed/playing entrance belongs to a room, renderer and occupant—not a reusable seat. */
function entryParticipantCurrent(expected, current) {
	return expected.roomId !== null && expected.roomId === current.roomId && expected.table === current.table && expected.playerId === current.playerId;
}
//#endregion
export { seededRandom as a, entryParticipantCurrent as i, buildGiftItems as n, createSentGift as r, RAND_MOD as t };
