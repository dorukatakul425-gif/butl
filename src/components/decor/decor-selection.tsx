import { useEffect, useMemo, useState } from "react";
import { loadCilizAssets, type CilizAssets } from "@/lib/ciliz-assets";
import { buildDecorItems, findDecorItem, type DecorItem } from "@/lib/decor-selection";
import { setDecorations, useDecorState } from "@/lib/decor-store";
import { useCloudAccount } from '@/lib/cloud-account';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  const { user, profile } = useCloudAccount();
  const items = useMemo(
    () => (assets ? buildDecorItems(assets, { ...VIEWER_STORE, league: 0, maxLeague: 0, ownedItems: [] }) : []),
    [assets, decor.ownedItems],
  );
  if (!assets || items.length === 0) return null;
  const activeItem = findDecorItem(items, profile?.frame ?? decor.frame, profile?.stone ?? decor.stone);
  if (!activeItem) return null;

  const onApply = async (item: DecorItem) => {
    if (item.price.type === 'lock' || item.price.price) { toast.error('Bu süsleme henüz kullanıma açılmadı.'); return; }
    if (user) {
      const { error } = await supabase.from('profiles').update({ frame: item.frame?.type || '', stone: item.stone?.type || '' }).eq('id', user.id);
      if (error) { toast.error(error.message); return; }
    }
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
