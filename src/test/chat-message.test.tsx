import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { chatMessageIsBold, chatNameClass } from "@/lib/chat-format";
import { pushTextLine } from "@/lib/music-session";
import { OriginalChatPanel } from "@/components/original-chat-panel";

vi.mock("@/components/decor/decor-selection", () => ({ useCilizAssets: () => null }));
vi.mock("@/components/music/music-view", () => ({ MusicView: () => null }));
vi.mock("@/components/music/music-dialogs", () => ({ MusicListDialog: () => null, MusicPreviewDialog: () => null }));
afterEach(cleanup);

describe("original User.color rules", () => {
  it("uses original normal and VIP gender colors", () => {
    expect(chatNameClass({ id: "m", male: true })).toBe("chat__name-color--male");
    expect(chatNameClass({ id: "f", male: false })).toBe("chat__name-color--female");
    expect(chatNameClass({ id: "m", male: true, isVip: true })).toBe("chat__name-color--vip-male");
    expect(chatNameClass({ id: "f", male: false, isVip: true })).toBe("chat__name-color--vip-female");
  });
  it("preserves custom, top, premium precedence", () => {
    expect(chatNameClass({ id: "37343099", male: true, top: true, isPremium: true })).toBe("chat__name-color--custom-green");
    expect(chatNameClass({ id: "top", top: true, isPremium: true })).toBe("chat__name-color--top");
    expect(chatNameClass({ id: "premium", male: true, isVip: true, isPremium: true })).toBe("chat__name-color--premium");
  });
  it("does not invent a gender for unconfigured local profiles", () => {
    expect(chatNameClass({ id: "viewer" })).toBe("chat__name-color--unknown");
  });
  it("bolds viewer-sent and viewer-addressed messages only", () => {
    expect(chatMessageIsBold({ id: "a", isViewer: true })).toBe(true);
    expect(chatMessageIsBold({ id: "a" }, { id: "b", isViewer: true })).toBe(true);
    expect(chatMessageIsBold({ id: "a" })).toBe(false);
  });
});

describe("text chat rendering", () => {
  it("ignores blank messages", () => {
    expect(pushTextLine({ id: "a", name: "A", photoUrl: "" }, "   ")).toBe(false);
  });
  it("submits a local message and clears the input", () => {
    render(<OriginalChatPanel />);
    const input = screen.getByRole("textbox", { name: "Mesaj yaz" });
    fireEvent.change(input, { target: { value: "Merhaba masadakiler" } });
    fireEvent.click(screen.getByRole("button", { name: "Gönder" }));
    const text = screen.getByText("Merhaba masadakiler");
    expect(text.closest(".chat__message-line")).toBeInTheDocument();
    expect(text.closest(".chat__message")).toHaveClass("chat__message--bold");
    expect(input).toHaveValue("");
  });
  it("renders source colors and escapes message markup", () => {
    pushTextLine({ id: "f", name: "Ayşe", male: false, photoUrl: "" }, '<img src=x onerror="alert(1)">');
    pushTextLine({ id: "p", name: "Premium", isPremium: true, photoUrl: "" }, "Premium mesaj");
    render(<OriginalChatPanel />);
    expect(screen.getByText("Ayşe")).toHaveClass("chat__name-color--female");
    expect(screen.getByText("Premium")).toHaveClass("chat__premium-sender-name");
    expect(screen.getByText('<img src=x onerror="alert(1)">').querySelector("img")).toBeNull();
  });
});
