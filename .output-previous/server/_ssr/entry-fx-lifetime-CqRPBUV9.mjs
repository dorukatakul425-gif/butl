import { t as ASSETS_TO_VIRTUAL, w as translate } from "./player-name-CqT1z4a7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/entry-fx-lifetime-CqRPBUV9.js
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
var GIFT_SCALE = .75;
1.3 * GIFT_SCALE;
function giftImageFrame(assets, name) {
	const meta = assets.images[name];
	const size = meta?.size_v2 || meta?.size || [];
	return {
		x: -(size[0] ?? 0) * ASSETS_TO_VIRTUAL,
		y: -(size[1] ?? 0) * ASSETS_TO_VIRTUAL,
		width: (size[2] ?? 0) * ASSETS_TO_VIRTUAL,
		height: (size[3] ?? 0) * ASSETS_TO_VIRTUAL
	};
}
function calcGiftPosition(gift) {
	switch (gift.stickPoint) {
		case "ava": {
			const random = seededRandom(gift.random);
			return {
				x: -32 + random() * 64,
				y: -32 + random() * 64,
				scale: GIFT_SCALE,
				rotation: 360 * random()
			};
		}
		case "drink": return {
			x: 32,
			y: 32,
			scale: GIFT_SCALE,
			rotation: 0
		};
		case "hat": return {
			x: -32,
			y: -32,
			scale: GIFT_SCALE,
			rotation: -45
		};
	}
}
/** A delayed/playing entrance belongs to a room, renderer and occupant—not a reusable seat. */
function entryParticipantCurrent(expected, current) {
	return expected.roomId !== null && expected.roomId === current.roomId && expected.table === current.table && expected.playerId === current.playerId;
}
//#endregion
export { createSentGift as a, calcGiftPosition as i, RAND_MOD as n, entryParticipantCurrent as o, buildGiftItems as r, giftImageFrame as s, GIFT_SCALE as t };
