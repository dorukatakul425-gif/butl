import { describe, expect, it } from "vitest";
import { setupProblem, SETUP_AGE_FROM, SETUP_AGE_TO } from "@/components/profile/profile-setup-dialog";

describe("Telegram first-entry profile setup", () => {
  it("requires a gender before continuing", () => {
    expect(setupProblem(undefined)).toBe("male");
    expect(setupProblem(true)).toBeNull();
    expect(setupProblem(false)).toBeNull();
  });
  it("offers ages 18 to 90", () => {
    expect([SETUP_AGE_FROM, SETUP_AGE_TO]).toEqual([18, 90]);
  });
});
