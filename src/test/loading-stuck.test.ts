import { describe, expect, it, vi, beforeEach } from "vitest";

// Loader'da takılma hatası: oyuna ikinci girişte yükleme sıfırlanınca,
// önbellekteki varlıklar "server"/"assets" aşamalarını tekrar tamamlamalı —
// yoksa yükleme ekranı sonsuza kadar açık kalır.

const serverJson = {
  assets: {
    url: "https://example.test/assets.json",
    sfx_url_v2: "https://example.test/sfx",
    bundles_v2: { table: [{ size: 1, url: "u" }], dlg: [{ dpr: 1, url: "d" }] },
  },
};
const assetsJson = {
  bottles: { __store: [[]] },
  gestures: {},
  gifts: { __store_v7: [[]] },
  spines: {},
  frames: {},
  stones: {},
  decor: { __store: [] },
  images: {},
  translation: { tr: {} },
};

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("fetch", vi.fn(async (url: string) => ({
    json: async () => (String(url).includes("server.json") ? serverJson : assetsJson),
  })));
});

describe("loadCilizAssets önbelleği", () => {
  it("ilk yüklemede server ve assets aşamalarını tamamlar", async () => {
    const { loadCilizAssets } = await import("@/lib/ciliz-assets");
    const loading = await import("@/lib/game-loading");
    loading.resetGameLoading();
    await loadCilizAssets();
    // progress = 10 (başlangıç) + server(10) + assets(15) = 35
    expect(loading.getGameLoadingState().progress).toBe(35);
  });

  it("önbellekten dönüşte server ve assets aşamalarını tekrar tamamlar (takılma yok)", async () => {
    const { loadCilizAssets } = await import("@/lib/ciliz-assets");
    const loading = await import("@/lib/game-loading");

    await loadCilizAssets(); // ilk yükleme, önbellek dolar
    loading.resetGameLoading(); // oyuna yeniden giriş — yükleme sıfırlanır
    expect(loading.getGameLoadingState().progress).toBe(10);

    await loadCilizAssets(); // önbellek dönüşü
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(loading.getGameLoadingState().progress).toBe(35);

    // Diğer aşamalar da tamamlanınca ready olur.
    loading.completeLoadingStage("artwork");
    loading.completeLoadingStage("renderer");
    loading.completeLoadingStage("icons");
    loading.completeLoadingStage("bottle");
    expect(loading.getGameLoadingState().ready).toBe(true);
  });
});
