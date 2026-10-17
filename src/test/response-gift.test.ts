import { describe, expect, it } from "vitest";
import { closeByUser, onGiftToViewer, RESPONSE_GIFT_HOLD_MS, supportsResponseGift } from "@/lib/response-gift";

describe("response gift popup rules", () => {
  it("opens when ready", () => {
    expect(onGiftToViewer({ type: "ready" }, "u1", "rose", 0)).toEqual({ type: "dialog", senderId: "u1", giftType: "rose" });
  });
  it("does not stack a second popup", () => {
    expect(onGiftToViewer({ type: "dialog", senderId: "u1", giftType: "rose" }, "u2", "cake", 0)).toBeNull();
  });
  it("closing with X holds the popup for 5 minutes", () => {
    const hold = closeByUser(1000);
    expect(onGiftToViewer(hold, "u1", "rose", 1000 + RESPONSE_GIFT_HOLD_MS - 1)).toBeNull();
    expect(onGiftToViewer(hold, "u1", "rose", 1000 + 5 * 60 * 1000)).not.toBeNull();
  });
  it("needs a chat area of at least 236x175", () => {
    expect(supportsResponseGift({ width: 236, height: 175 })).toBe(true);
    expect(supportsResponseGift({ width: 235, height: 300 })).toBe(false);
  });
});
