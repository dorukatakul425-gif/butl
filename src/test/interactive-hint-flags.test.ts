import { describe, expect, it } from "vitest";
import { HINT_MASKS, pendingScenarios } from "@/lib/interactive-hint-flags";

describe("interactive hint flags", () => {
  it("shows nothing until account flags are known", () => expect(pendingScenarios(undefined)).toEqual([]));
  it("orders message, choice, gift", () => expect(pendingScenarios(0)).toEqual(["message", "choice", "gift"]));
  it("never repeats a finished hint", () => expect(pendingScenarios(HINT_MASKS.message | HINT_MASKS.gift)).toEqual(["choice"]));
});
