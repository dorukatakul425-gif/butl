import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SendGiftDialog } from "@/components/gifts/send-gift-dialog";
import { pushGiftLine, useMusicSession } from "@/lib/music-session";
import type { CilizAssets } from "@/lib/ciliz-assets";
import type { GiftStoreItem } from "@/lib/gifts";

const assets = {
  images: { rose: { size: [0, 0, 60, 60] } },
  dialogBundles: [{ dpr: 1, url: "https://example.com/${name}" }],
  translation: { "dlg:gift:title": "Hediye %" },
} as unknown as CilizAssets;
const item: GiftStoreItem = {
  type: "rose", name: "Gül", image: "rose", price: 1,
  gift: { type: "rose", category: "gift", chatIcon: "gift", flyImages: ["rose"], stickImages: ["rose"], startSounds: [], finishSounds: [], stickPoint: "ava", storeImage: "rose", storePrice: 1 },
};

function Count() {
  const { lines } = useMusicSession();
  const line = lines.at(-1);
  return <output data-testid="count">{line?.kind === "gift" ? line.count : 0}</output>;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("source gift dispatch has no click cooldown", () => {
  it("dispatches every rapid click while the 500ms highlight is active and counts every gift", () => {
    const onSend = vi.fn(() => pushGiftLine(
      { id: "rapid-sender", name: "Gönderen", photoUrl: "" },
      { id: "receiver", name: "Alıcı", photoUrl: "" },
      { type: item.type, name: item.name, image: "" },
    ));
    render(<><SendGiftDialog open assets={assets} items={[item]} receiverName="Alıcı" onSend={onSend} onPreload={vi.fn()} onClose={vi.fn()} /><Count /></>);
    const gift = screen.getByRole("button", { name: "Gül" });
    for (let i = 0; i < 100; i++) fireEvent.click(gift);
    expect(onSend).toHaveBeenCalledTimes(100);
    expect(screen.getByTestId("count")).toHaveTextContent("100");
    expect(gift).toHaveClass("send-gift__item--active", "touch-manipulation");
    act(() => vi.advanceTimersByTime(500));
    expect(gift).not.toHaveClass("send-gift__item--active");
    fireEvent.click(gift);
    expect(onSend).toHaveBeenCalledTimes(101);
  });

  it("retains locked gifts and sends once per keyboard activation", () => {
    const onSend = vi.fn();
    render(<SendGiftDialog open assets={assets} items={[item, { ...item, type: "locked", name: "Kilitli", lock: { kind: "vip" } }]} receiverName="Alıcı" onSend={onSend} onPreload={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Kilitli" }));
    expect(onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("button", { name: "Gül" }), { key: "Enter" });
    fireEvent.keyDown(screen.getByRole("button", { name: "Gül" }), { key: " " });
    expect(onSend).toHaveBeenCalledTimes(2);
  });
});