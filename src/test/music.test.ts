import { describe, expect, it } from "vitest";
import { CilizMusicService, secondsToMMSS, social2platform, YTVideoService } from "@/lib/music";

describe("music services from the game source", () => {
  it("charges 5 hearts for music and 9 for video", () => {
    expect(new CilizMusicService("h", { country: "TR", age: 25 }, "ok").musicPrice).toBe(5);
    expect(new YTVideoService({ socialId: "fb", user_country: "TR", user_vip: false }).musicPrice).toBe(9);
  });
  it("skips catalogue rows without a url and forces https", () => {
    const s = new CilizMusicService("h", { country: "TR", age: 25 }, "ok");
    expect(s.parseResponse([{ id: "a", duration: 1, url: "http://x/a.mp3" }, { id: "b", duration: 1, url: "" }]).map(i => i.url)).toEqual(["https://x/a.mp3"]);
  });
  it("maps web networks to the bottle_fb video catalogue", () => {
    expect(social2platform("gg")).toBe("bottle_fb");
    expect(social2platform("ok")).toBe("bottle_ok");
  });
  it("formats durations like the game", () => {
    expect(secondsToMMSS(270)).toBe("04:30");
  });
});
