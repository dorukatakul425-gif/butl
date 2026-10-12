import { describe, expect, it } from "vitest";
import { buildGiftItems, createSentGift, seededRandom } from "@/lib/gifts";
import type { CilizAssets, CilizGift } from "@/lib/ciliz-assets";

const airKiss: CilizGift = {
  category: "gift", chatIcon: "kiss", finishSounds: ["tick"], flyImages: ["k1", "k2", "k3"],
  startSounds: ["kiss1", "kiss2"], stickImages: ["k1", "k2", "k3"], stickPoint: "ava",
  storeImage: "k1", storePrice: 1, type: "air_kiss",
};
const rose: CilizGift = {
  category: "drink", chatIcon: "gift", finishSounds: ["beer_tap"], flyImages: ["g_rose_v2"], spine: ["s_rose_v2"],
  startSounds: ["snow"], stickImages: ["g_rose_v2"], stickPoint: "drink", storeImage: "g_rose_v2", storePrice: 1, type: "rose",
};
const assets = {
  gifts: { air_kiss: airKiss, rose }, spines: { s_rose_v2: { finishSec: 4.2 } },
  giftStore: [{ id: "__SCHEDULED__" }, { id: "rose" }, { id: "labubu", social: ["vk"] }, { id: "air_kiss" }, { id: "partyhat", birthday: true }],
  images: { g_rose_v2: { size: [0, 0, 1, 1] }, k1: { size: [0, 0, 1, 1] } },
  translation: { "drink:rose": "Gül" },
} as unknown as CilizAssets;

describe("gifts from the game server", () => {
  it("picks images and sounds by the server random value", () => {
    const g = createSentGift(assets, airKiss, 4);
    expect(g.flyImage).toBe("k2");
    expect(g.startSound).toBe("kiss1");
    expect(g.finishSound).toBe("tick");
  });
  it("uses the spine finish time from assets", () => {
    expect(createSentGift(assets, rose, 0).spineFinishSec).toBe(4.2);
  });
  it("preserves the original magic trail and head attachment for every crown", () => {
    for (const type of ["crown1", "crown2", "crown3", "crown4", "icecrown", "vipcrown"]) {
      const crown: CilizGift = { ...airKiss, type, stickPoint: "hat", vfx: "magic" };
      const sent = createSentGift(assets, crown, 0);
      expect(sent.vfx).toBe("magic");
      expect(sent.stickPoint).toBe("hat");
    }
  });
  it("matches the game's seeded random sequence", () => {
    expect(seededRandom(0)()).toBeCloseTo(49297 / 233280);
  });
  it("hides scheduled, other-network and birthday entries", () => {
    expect(buildGiftItems(assets, "ok").map((i) => i.type)).toEqual(["rose", "air_kiss"]);
  });
});
