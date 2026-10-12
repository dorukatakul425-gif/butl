import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatMessageRow } from "@/components/chat/chat-message";
import { attachGameSession, sendChatMessage, type GameSessionAdapter } from "@/lib/game-session";
import { createGiftPreparation } from "@/lib/gift-preparation";
import type { CilizAssets } from "@/lib/ciliz-assets";

const sender = { id: "player", name: "Oyuncu", photoUrl: "/photo.png" };
const assets: CilizAssets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: "", frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: { "dlg:translate:show_translation": "Çeviriyi göster", "dlg:translate:show_original": "Orijinali göster" } };
afterEach(() => { cleanup(); attachGameSession(null); });
describe("authenticated chat boundary", () => {
  it("does not fabricate a send when disconnected", async () => {
    await expect(sendChatMessage("Merhaba")).rejects.toThrow("Oyuncu hesabı bağlı değil");
  });
  it("uses the adapter for sending, translation and profile actions", async () => {
    const adapter: GameSessionAdapter = { getSnapshot: () => ({ viewer: sender, hearts: 123, messages: [] }), subscribe: () => () => {}, sendMessage: vi.fn(async () => {}), translateMessage: vi.fn(async () => "Merhaba"), reportMessage: vi.fn(async () => {}), blockUser: vi.fn(async () => {}) };
    attachGameSession(adapter);
    await sendChatMessage(" Hello ", "other");
    expect(adapter.sendMessage).toHaveBeenCalledWith("Hello", "other");
    const onProfile = vi.fn();
    render(<ChatMessageRow message={{ id: "msg", sender, text: "Hello", canTranslate: true }} assets={assets} selected={false} onSelect={vi.fn()} onProfile={onProfile} onError={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Oyuncu profili" }));
    expect(onProfile).toHaveBeenCalledWith(sender);
    fireEvent.click(screen.getByRole("button", { name: "Çeviriyi göster" }));
    await waitFor(() => expect(screen.getByText("Merhaba")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Orijinali göster" }));
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(adapter.translateMessage).toHaveBeenCalledOnce();
  });
});
describe("gift warm-up", () => {
  it("shares preparation across 30 independent calls", async () => {
    const prepare = createGiftPreparation();
    const upload = vi.fn(async () => {});
    const jobs = Array.from({ length: 30 }, () => prepare("crown", upload));
    expect(jobs.every(job => job === jobs[0])).toBe(true);
    await Promise.all(jobs);
    expect(upload).toHaveBeenCalledOnce();
  });
});