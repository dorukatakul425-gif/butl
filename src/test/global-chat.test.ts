import { describe, expect, it } from "vitest";
import { GLOBAL_MAX_LENGTH, mentionsMe, normalizeGlobal, slowModeWait } from "@/lib/global-chat";

describe("global chat rules", () => {
  it("allows one message every 3 seconds", () => {
    expect(slowModeWait(null, 1000)).toBe(0);
    expect(slowModeWait(1000, 2000)).toBe(2000);
    expect(slowModeWait(1000, 4000)).toBe(0);
  });
  it("rejects empty and over-500-character messages", () => {
    expect(normalizeGlobal("   ")).toBeNull();
    expect(normalizeGlobal("a".repeat(GLOBAL_MAX_LENGTH + 1))).toBeNull();
    expect(normalizeGlobal("  salam ")).toBe("salam");
    expect(GLOBAL_MAX_LENGTH).toBe(500);
  });
  it("detects @mentions of my name", () => {
    expect(mentionsMe("salam @Gunay", "gunay")).toBe(true);
    expect(mentionsMe("salam Gunay", "gunay")).toBe(false);
  });
});
