import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { completeLoadingStage, useGameLoading } from "@/lib/game-loading";

describe("actual game loading readiness", () => {
  it("keeps the loading screen until the manifest, graphics, icons and bottle finish", () => {
    const { result } = renderHook(() => useGameLoading());
    expect(result.current.progress).toBe(10);
    act(() => { completeLoadingStage("server"); completeLoadingStage("assets"); completeLoadingStage("renderer"); completeLoadingStage("bottle"); });
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBe(75);
    act(() => completeLoadingStage("icons"));
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBe(95);
    act(() => completeLoadingStage("artwork"));
    expect(result.current.ready).toBe(true);
    expect(result.current.progress).toBe(100);
    act(() => completeLoadingStage("icons"));
    expect(result.current.progress).toBe(100);
  });
});