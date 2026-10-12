import { describe, expect, it } from "vitest";
import { buildGestureItems, gestureEligibility, type GestureAccount, type CilizGesture } from "@/lib/gestures";
import type { CilizAssets } from "@/lib/ciliz-assets";
const gesture = (type: string): CilizGesture => ({ type, image: type, storeImage: type, storePrice: 2, spine: type, shade: [0, 0.2, 5, 5.7] });
const assets = { gestures: { first: gesture("first"), event: gesture("event"), hello: gesture("hello"), vip: gesture("vip") }, gestureStore: [{ id: "first", kisses_s: 10 }, { id: "__SCHEDULED__" }, { id: "hello", kisses_s: 30 }, { id: "vip", vip_s: true }], translation: {} } as unknown as CilizAssets;
const account: GestureAccount = { userId: "test", kisses: 15, vip: false, tokens: 2, social: "ok", platform: "html5", scheduled: [{ id: "event" }] };
describe("source gesture rules", () => {
  it("injects scheduled entries then groups available, kisses, VIP", () => {
    const items = buildGestureItems(assets, account);
    expect(items.map(i => i.gesture.type)).toEqual(["first", "event", "hello", "vip"]);
    expect(items[2]?.lock).toEqual({ kind: "kisses", needed: 30, current: 15 });
    expect(items[3]?.lock?.kind).toBe("vip");
  });
  it("never invents a scheduled list or grants an absent account currency", () => {
    const items = buildGestureItems(assets, null);
    expect(items.map(i => i.gesture.type)).not.toContain("event");
    const first = items[0];
    if (!first) throw new Error("Missing gesture");
    expect(gestureEligibility(first, null)).toBe("session");
  });
  it("uses exact unlock boundaries and token price", () => {
    const updated = { ...account, kisses: 30, vip: true, tokens: 1 };
    const items = buildGestureItems(assets, updated);
    expect(items.every(i => !i.lock)).toBe(true);
    const first = items[0];
    if (!first) throw new Error("Missing gesture");
    expect(gestureEligibility(first, updated)).toBe("tokens");
    expect(gestureEligibility(first, { ...updated, tokens: 2 })).toBe("available");
  });
});