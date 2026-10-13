import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import type { CilizAssets } from "@/lib/ciliz-assets";
const assets = { gifts: {}, giftStore: [], spines: {}, sfxUrl: "", frames: {}, stones: {}, decor: [], images: {}, bundles: [], dialogBundles: [], translation: { "dlg:profile_info:title": "Profil ayarları", "dlg:profile_info:save": "Kaydet", "dlg:league_locked_gift:title": "Gerektirir", "dlg:profile:frame:unavailable": "Fotoğrafınızı güzelleştirmek için Demir Lig'e ulaşın", "dlg:league_locked_gift:btn": "Devam et" } } as CilizAssets;
afterEach(cleanup);
const mount = () => render(<ProfileDialog player={{ name: "Sen", photoUrl: "/p.png", frame: "", stone: "", male: true }} self assets={assets} onClose={() => {}} onGift={() => {}} onDecor={() => {}} onMusic={() => {}} />);
describe("own profile", () => {
  it("opens locked frame popup without a verified league", () => {
    mount(); fireEvent.click(screen.getByRole("button", { name: "Süsleme" }));
    expect(screen.getByText("Fotoğrafınızı güzelleştirmek için Demir Lig'e ulaşın")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Devam et" }));
    expect(screen.queryByText("Gerektirir")).toBeNull();
  });
  it("opens profile settings with save disabled until a session exists", () => {
    mount(); fireEvent.click(screen.getByRole("button", { name: "Profil ayarları" }));
    expect(screen.getByRole("button", { name: "Kaydet" })).toBeDisabled();
  });
});
