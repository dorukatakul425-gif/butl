import { g as translate } from "./ciliz-assets-Bqoyx58m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/entry-fx-lifetime-V0m3CLF_.js
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
var TIERS = [
	[
		"Bürünc",
		"#f0b27a",
		"#8a4a1f",
		"#ffe0c2",
		"star"
	],
	[
		"Gümüş",
		"#eef3fa",
		"#7f8ea3",
		"#ffffff",
		"star"
	],
	[
		"Qızıl",
		"#ffe27a",
		"#c98a09",
		"#fff6c4",
		"gem"
	],
	[
		"Zümrüd",
		"#6ff5bb",
		"#0b7a4a",
		"#d2ffec",
		"gem"
	],
	[
		"Sapfir",
		"#7cc0ff",
		"#1c4fd6",
		"#dcefff",
		"crown"
	],
	[
		"Ametist",
		"#dba8ff",
		"#6d1fc4",
		"#f3e2ff",
		"crown"
	],
	[
		"Yaqut",
		"#ff8595",
		"#b0102a",
		"#ffdbe0",
		"wings"
	],
	[
		"Qızılgül",
		"#ffaad8",
		"#c21f7a",
		"#ffe4f3",
		"wings"
	],
	[
		"Brilyant",
		"#c4f7ff",
		"#2a8fd6",
		"#ffffff",
		"flame"
	],
	[
		"Əfsanə",
		"#ffd86b",
		"#ff2f6d",
		"#fff3c4",
		"flame"
	],
	[
		"Kosmos",
		"#9fb4ff",
		"#2a1b6e",
		"#e3e8ff",
		"star"
	],
	[
		"Aurora",
		"#8dffd8",
		"#3a2fb8",
		"#e6fff7",
		"gem"
	],
	[
		"Lava",
		"#ffb36b",
		"#c2210c",
		"#ffe5cc",
		"flame"
	],
	[
		"Okean",
		"#7ff0ff",
		"#0a5a8c",
		"#dffbff",
		"gem"
	],
	[
		"Şimşək",
		"#fff36b",
		"#6b4dff",
		"#fffbe0",
		"crown"
	],
	[
		"Kristal",
		"#e8f6ff",
		"#5f86c9",
		"#ffffff",
		"gem"
	],
	[
		"Feniks",
		"#ffcf5c",
		"#e0341d",
		"#fff0c8",
		"wings"
	],
	[
		"Ulduz tozu",
		"#ffe1fb",
		"#8a2be2",
		"#fff4fe",
		"star"
	],
	[
		"İmperator",
		"#ffe79a",
		"#7a1fa2",
		"#fff7d6",
		"crown"
	],
	[
		"Mütləq",
		"#fff3c4",
		"#ff2f6d",
		"#ffffff",
		"crown"
	]
];
var ENTRY_STYLES = [
	["spark", "rise"],
	["star4", "orbit"],
	["coin", "burst"],
	["leaf", "spiral"],
	["drop", "ripple"],
	["star5", "runes"],
	["flame", "rise"],
	["petal", "fall"],
	["shard", "burst"],
	["feather", "wings"],
	["star4", "spiral"],
	["leaf", "orbit"],
	["flame", "burst"],
	["drop", "spiral"],
	["shard", "runes"],
	["shard", "orbit"],
	["feather", "fall"],
	["star5", "orbit"],
	["coin", "wings"],
	["star5", "wings"]
];
var EXTRA_STYLES = [
	["star4", "orbit"],
	["star5", "runes"],
	["petal", "fall"],
	["shard", "burst"],
	["coin", "fall"]
];
function tier(level) {
	const z = Math.max(1, level | 0);
	const i = z <= 50 ? Math.min(9, Math.floor(z / 5)) : Math.min(TIERS.length - 1, 10 + Math.floor((z - 50 - 1) / 5));
	const t = TIERS[i];
	if (!t) throw new Error("Entry tier unavailable");
	return {
		i,
		name: t[0],
		c1: t[1],
		c2: t[2],
		rim: t[3],
		emblem: t[4]
	};
}
/** Ids present in `next` but not in `prev` (players who just sat down). */
function joinedIds(prev, next) {
	const before = new Set(prev.filter(Boolean));
	return [...new Set(next.filter((id) => Boolean(id) && !before.has(id)))];
}
/** A delayed/playing entrance belongs to a room, renderer and occupant—not a reusable seat. */
function entryParticipantCurrent(expected, current) {
	return expected.roomId !== null && expected.roomId === current.roomId && expected.table === current.table && expected.playerId === current.playerId;
}
//#endregion
export { buildGiftItems as a, joinedIds as c, TIERS as i, seededRandom as l, EXTRA_STYLES as n, createSentGift as o, RAND_MOD as r, entryParticipantCurrent as s, ENTRY_STYLES as t, tier as u };
