import { describe, expect, it } from "vitest";
import { newcomerKind, newcomersToNotify, shouldScheduleVipTeaser, widgetOfTheDay, widgetParts, VIP_TEASER_DELAY } from "@/lib/chat-promos";

const viewer = { id: "v", male: true };
describe("chat promos", () => {
  it("greets only new opposite-sex players with a photo, once", () => {
    const notified = new Set<string>();
    const users = [{ id: "a", isNew: true, photoUrl: "p", male: false }, { id: "b", isNew: true, photoUrl: "p", male: true }, { id: "c", isNew: false, photoUrl: "p", male: false }, { id: "d", isNew: true, photoUrl: "", male: false }];
    expect(newcomersToNotify(users, viewer, notified).map(u => u.id)).toEqual(["a"]);
    expect(newcomersToNotify(users, viewer, notified)).toEqual([]);
  });
  it("gift widget with hearts, chat widget without", () => { expect(newcomerKind(5)).toBe("gift"); expect(newcomerKind(0)).toBe("chat"); });
  it("splits name into the template", () => {
    const u = { id: "h", name: "Huriye", photoUrl: "" };
    expect(widgetParts("% oyuna ilk kez katılıyor!", u)).toEqual([{ user: u }, { text: " oyuna ilk kez katılıyor!" }]);
  });
  it("VIP teaser after 5 minutes for non-VIP only", () => {
    expect(VIP_TEASER_DELAY).toBe(300000);
    expect(shouldScheduleVipTeaser(false, true)).toBe(true);
    expect(shouldScheduleVipTeaser(true, true)).toBe(false);
  });
  it("no rewarded video means VIP widget", () => expect(widgetOfTheDay("7", 3, false)).toBe("vip"));
});
