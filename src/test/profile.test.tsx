import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import type { CilizAssets } from "@/lib/ciliz-assets";

const assets: CilizAssets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: "", frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: { "warning:self_chat:desc": "Kendinize mesaj atamazsınız", "dlg:profile:harem:btn": "Beğen" } };
afterEach(cleanup);
function mount(self: boolean) {
  const callbacks = { onClose: vi.fn(), onGift: vi.fn(), onDecor: vi.fn(), onMusic: vi.fn() };
  render(<ProfileDialog player={{ name: "Sen", photoUrl: "/photo.png", frame: "", stone: "" }} self={self} assets={assets} {...callbacks} />);
  return callbacks;
}
describe("source-based profiles", () => {
  it("offers own decor/music and prevents self messaging", () => {
    const cb = mount(true);
    fireEvent.click(screen.getByRole("button", { name: "Süsleme" }));
    fireEvent.click(screen.getByRole("button", { name: "Müzik seç" }));
    expect(cb.onDecor).toHaveBeenCalledOnce();
    expect(cb.onMusic).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "Hediye gönder" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Mesaj gönder" }));
    expect(screen.getByRole("status")).toHaveTextContent("Kendinize mesaj atamazsınız");
  });
  it("keeps other-player gifts repeatable and statistics unknown", () => {
    const cb = mount(false);
    for (let i = 0; i < 20; i++) fireEvent.click(screen.getByRole("button", { name: "Hediye gönder" }));
    expect(cb.onGift).toHaveBeenCalledTimes(20);
    fireEvent.click(screen.getByRole("button", { name: "İstatistikleri genişlet" }));
    expect(screen.getByRole("button", { name: "İstatistikleri genişlet" })).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Başarılar" }));
    expect(screen.getByRole("status")).toHaveTextContent("Oyuncu hesabı bağlı değil");
  });
  it("closes the report menu before the profile on Escape", () => {
    const cb = mount(false);
    fireEvent.click(screen.getByRole("button", { name: "Şikayet ve engelleme" }));
    expect(screen.getAllByRole("dialog")).toHaveLength(2);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(cb.onClose).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(cb.onClose).toHaveBeenCalledOnce();
  });
});