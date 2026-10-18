import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import type { CilizAssets } from "@/lib/ciliz-assets";

const assets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: "", frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: {} } as CilizAssets;
afterEach(cleanup);

const profile = {
  status: "Merhaba, ben Ciliz",
  total_kisses: 120, total_kisses_rank: 5,
  dj_score: 0, gestures: 3, gestures_rank: 9,
  price: 10, price_rank: 4, harem_price: 0, harem_price_rank: 0, league: 0,
};

// Source dialog: the status renders only once the square photo is measured (infoSize > 0);
// jsdom reports clientWidth 0, so give elements a real width first.
beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 400 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, value: 600 });
});
afterEach(() => {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 0 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, value: 0 });
});

describe("profile bio", () => {
  it("shows the player's bio above the stats, like the Telegram popup", () => {
    render(<ProfileDialog player={{ name: "Duru", photoUrl: "/p.png", frame: "", stone: "", male: false }} self={false} assets={assets} onClose={() => {}} onGift={() => {}} onDecor={() => {}} onMusic={() => {}} profile={profile} />);
    expect(screen.getByText("Merhaba, ben Ciliz")).toBeVisible();
  });
});
