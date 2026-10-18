import { describe, expect, it } from "vitest";
import { pushGestureLine } from "@/lib/music-session";

const sender = { id: "u1", name: "Ali", photoUrl: "/p.png" };

describe("gesture chat line (original createGestureLine)", () => {
  it("adds a gesture line attributed to the performer", () => {
    expect(pushGestureLine(sender, "applause", "Alkış", "/g.png", 910001)).toBe(true);
  });

  it("never shows the same gesture event twice (reconnect replay)", () => {
    expect(pushGestureLine(sender, "applause", "Alkış", "/g.png", 910002)).toBe(true);
    expect(pushGestureLine(sender, "applause", "Alkış", "/g.png", 910002)).toBe(false);
  });
});
