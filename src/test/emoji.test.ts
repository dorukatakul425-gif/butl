import { describe, expect, it } from "vitest";
import { emojiPickerSize, emojiSendDecision, insertEmoji, stringFromCodepoint } from "@/lib/emoji";
import { EMOJI_UNICODES } from "@/lib/emoji-unicodes";

describe("chat emoji", () => {
  it("non-VIP message with emoji asks before sending", () => expect(emojiSendDecision("selam 😀", false)).toBe("warn"));
  it("plain text sends directly", () => expect(emojiSendDecision("selam", false)).toBe("send"));
  it("VIP sends emoji directly", () => expect(emojiSendDecision("😀", true)).toBe("send"));
  it("picker is 90% of chat width capped at 560", () => { expect(emojiPickerSize(300)).toBe(270); expect(emojiPickerSize(1000)).toBe(560); });
  it("inserts at caret", () => expect(insertEmoji("ab", 1, 1, "😀")).toEqual({ text: "a😀b", caret: 3 }));
  it("first original emoji is grinning face", () => expect(stringFromCodepoint(EMOJI_UNICODES[0])).toBe("😀"));
});
