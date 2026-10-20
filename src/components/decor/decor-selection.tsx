import { useEffect, useMemo, useState } from "react";
import { loadCilizAssets, type CilizAssets } from "@/lib/ciliz-assets";
import { buildDecorItems, findDecorItem, type DecorItem } from "@/lib/decor-selection";
import { purchaseItem, setDecorations, useDecorState, useGiftLevel } from "@/lib/decor-store";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { OPEN_BANK_EVENT, showSourceToast } from "@/components/source-dialogs";
import { LEVEL_FRAMES } from "@/lib/custom-frames";
import { DecorSelectionDialog } from "@/components/decor/decor-selection-dialog";

export function useCilizAssets() {
  const [assets, setAssets] = useState<CilizAssets | null>(null);
  useEffect(() => {
    let alive = true;
    loadCilizAssets().then(
      (value) => alive && setAssets(value),
      (error) => console.error("Game assets could not be loaded", error),
    );
    return () => {
      alive = false;
    };
  }, []);
  return assets;
}

/** DecorSelectionPresenter: builds the items and applies the chosen decor. */
export function DecorSelection({ open, onClose }: { open: boolean; onClose: () => void }) {
  const assets = useCilizAssets();
  const decor = useDecorState();
  const giftLevel = useGiftLevel(open);
  const items = useMemo(
    () => (assets ? buildDecorItems(assets, { ...VIEWER_STORE, ownedItems: decor.ownedItems, giftLevel }) : []),
    [assets, decor.ownedItems, giftLevel],
  );
  if (!assets || items.length === 0) return null;
  const activeItem = findDecorItem(items, decor.frame, decor.stone);

  const onApply = async (item: DecorItem) => {
    if (item.price.type === "open" && item.price.price && !decor.ownedItems.includes(item.type)) {
      const res = await purchaseItem(item.type);
      if (!res.ok) {
        if (res.reason.includes("insufficient")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
        else showSourceToast("Satın alınamadı.");
        return;
      }
    }
    if (item.price.type === "lock") {
      const entry = LEVEL_FRAMES.find((f) => f.key === item.type);
      if (entry) showSourceToast(`🔒 Bu ramka hədiyyə səviyyəsi ${entry.level}-də açılır (sənin səviyyən: ${giftLevel})`);
      return;
    }
    const ok = await setDecorations(item.frame?.type || "", item.stone?.type || "");
    if (!ok) showSourceToast("Uygulanamadı.");
  };

  return (
    <DecorSelectionDialog
      open={open}
      assets={assets}
      items={items}
      activeItem={activeItem}
      user={VIEWER}
      onApply={onApply}
      onClose={onClose}
    />
  );
}
