import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { loadProfileBio, saveBio } from "@/lib/profile-social";
import type { CilizAssets } from "@/lib/ciliz-assets";

const store = vi.hoisted(() => ({ rows: new Map<string, string | null>(), refresh: [] as Array<() => void> }));
vi.mock("@/lib/supabase", () => ({ getSupabase: () => ({
  from: () => ({
    update: ({ bio }: { bio: string | null }) => ({ eq: async (_: string, id: string) => {
      store.rows.set(id, bio); store.refresh.forEach(fn => fn()); return { error: null };
    } }),
    select: () => ({ eq: (_: string, id: string) => ({ maybeSingle: async () => ({ data: { bio: store.rows.get(id) ?? null }, error: null }) }) }),
  }),
  rpc: async () => ({ data: null, error: new Error("stats migration not applied") }),
  channel: () => { const channel = { on: (_: string, __: unknown, fn: () => void) => { store.refresh.push(fn); return channel; }, subscribe: () => channel }; return channel; },
  removeChannel: async () => {},
}) }));

const assets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: "", frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: {} } as CilizAssets;
function dialog(id: string) {
  return <ProfileDialog player={{ id, name: "Duru", photoUrl: "/p.png", frame: "", stone: "", male: false }} self={false} assets={assets} onClose={() => {}} onGift={() => {}} onDecor={() => {}} onMusic={() => {}} />;
}
beforeEach(() => {
  store.rows.clear(); store.refresh = [];
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 400 });
});
afterEach(() => { cleanup(); Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 0 }); });

describe("home bio to game profile", () => {
  it("reads the actual bio saved by the home editor without a statistics RPC", async () => {
    expect(await saveBio("player-a", "Benim gerçek bio metnim" )).toBe(true);
    expect(await loadProfileBio("player-a")).toBe("Benim gerçek bio metnim");
    render(dialog("player-a"));
    expect(await screen.findByText("Benim gerçek bio metnim")).toBeVisible();
  });
  it("refreshes an open popup after the bio changes and removes a cleared bio", async () => {
    await saveBio("player-a", "İlk bio"); render(dialog("player-a"));
    await screen.findByText("İlk bio");
    await act(async () => { await saveBio("player-a", "Yeni bio"); });
    expect(await screen.findByText("Yeni bio")).toBeVisible();
    await act(async () => { await saveBio("player-a", ""); });
    await waitFor(() => expect(screen.queryByText("Yeni bio")).toBeNull());
    expect(await loadProfileBio("player-a")).toBeNull();
  });
  it("does not show one player's bio in another player's popup", async () => {
    await saveBio("player-a", "Sadece A oyuncusu");
    const view = render(dialog("player-a")); await screen.findByText("Sadece A oyuncusu");
    await act(async () => { view.rerender(dialog("player-b")); });
    expect(screen.queryByText("Sadece A oyuncusu")).toBeNull();
    expect(await loadProfileBio("player-b")).toBeNull();
  });
});