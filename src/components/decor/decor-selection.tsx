import { useEffect, useMemo, useState } from "react";
import { loadCilizAssets, type CilizAssets } from "@/lib/ciliz-assets";
import { buildDecorItems, findDecorItem, type DecorItem } from "@/lib/decor-selection";
import { purchaseItem, setDecorations, useDecorState } from "@/lib/decor-store";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
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
  const items = useMemo(
    () => (assets ? buildDecorItems(assets, { ...VIEWER_STORE, ownedItems: decor.ownedItems }) : []),
    [assets, decor.ownedItems],
  );
  if (!assets || items.length === 0) return null;
  const activeItem = findDecorItem(items, decor.frame, decor.stone);

  const onApply = (item: DecorItem) => {
    if (item.frame && item.price.type === "open" && item.price.price) purchaseItem(item.type);
    setDecorations(item.frame?.type || "", item.stone?.type || "");
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
