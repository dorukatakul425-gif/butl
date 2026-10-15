import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("inspector notice", () => {
  it("prints the exact requested text once", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { showInspectorNotice } = await import("@/lib/inspector-notice");
    showInspectorNotice();
    showInspectorNotice();
    expect(info).toHaveBeenCalledExactlyOnceWith("Mənim s*m bildiyini sənin başın bilmir ;)\n\nboş yerə kod axtarma ogurlamaq uvun");
  });

  it("does not interrupt the site when a console override throws", async () => {
    vi.spyOn(console, "info").mockImplementation(() => { throw new Error("Console unavailable"); });
    const { showInspectorNotice } = await import("@/lib/inspector-notice");
    expect(() => showInspectorNotice()).not.toThrow();
  });
});