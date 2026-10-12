import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { SendGiftDialog } from "@/components/gifts/send-gift-dialog";
import { useDecorState } from "@/lib/decor-store";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { buildGiftItems, createSentGift, RAND_MOD, type GiftStoreItem } from "@/lib/gifts";
import { playSfx, preloadSfx, unlockSfx } from "@/lib/sfx";
import type { CilizAssets } from "@/lib/ciliz-assets";

export interface SeatPlayer {
  name: string;
  photoUrl: string;
  frame: string;
  stone: string;
}

// Players sitting at the other seats, each wearing a different animated frame from the game.
const DEMO_FRAMES = ["diamond", "nitrodecor", "heartsdecor", "lavadecor", "discodecor", "angel", "demon", "icedecor", "kissesdecor", "egyptdecor", "cinemadecor"];
export const VIEWER_SEAT = 5;

type PixiTable = Awaited<ReturnType<typeof import("@/components/table/pixi-table").createPixiTable>>;

export function TableSeats() {
  const hostRef = useRef<HTMLDivElement>(null);
  const assets = useCilizAssets();
  const decor = useDecorState();
  const tableRef = useRef<PixiTable | null>(null);
  const playersRef = useRef<SeatPlayer[]>([]);
  const [giftSeat, setGiftSeat] = useState<number | null>(null);

  const giftItems = useMemo(() => (assets ? buildGiftItems(assets, VIEWER_STORE.social) : []), [assets]);

  useEffect(() => {
    if (!assets || !hostRef.current) return;
    let disposed = false;
    const host = hostRef.current;
    import("@/components/table/pixi-table").then(async ({ createPixiTable }) => {
      const table = await createPixiTable(host, assets, {
        onSeatClick: (index) => {
          unlockSfx();
          setGiftSeat(index);
        },
        playSfx: (id) => void playSfx(assets.sfxUrl, id),
      });
      if (disposed) {
        table.destroy();
        return;
      }
      tableRef.current = table;
      playersRef.current = buildPlayers(assets, decor.frame, decor.stone);
      table.setPlayers(playersRef.current);
    });
    return () => {
      disposed = true;
      tableRef.current?.destroy();
      tableRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  useEffect(() => {
    if (!assets) return;
    const viewer = { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame: decor.frame, stone: decor.stone };
    playersRef.current[VIEWER_SEAT] = viewer;
    tableRef.current?.setPlayer(VIEWER_SEAT, viewer);
  }, [assets, decor.frame, decor.stone]);

  // Warm the sounds of the store gifts once the drawer opens, so the first send plays instantly.
  useEffect(() => {
    if (giftSeat === null || !assets) return;
    const ids = new Set(giftItems.flatMap((item) => [...item.gift.startSounds, ...item.gift.finishSounds]));
    ids.forEach((id) => preloadSfx(assets.sfxUrl, id));
  }, [giftSeat, assets, giftItems]);

  const send = useCallback(
    (item: GiftStoreItem) => {
      if (!assets || giftSeat === null) return;
      unlockSfx();
      const gift = createSentGift(assets, item.gift, Math.floor(Math.random() * RAND_MOD));
      void tableRef.current?.sendGift(VIEWER_SEAT, giftSeat, gift);
    },
    [assets, giftSeat],
  );
  const close = useCallback(() => setGiftSeat(null), []);

  return (
    <>
      <div ref={hostRef} className="original-table-seats" aria-label="Masadaki oyuncular" />
      {assets && (
        <SendGiftDialog
          open={giftSeat !== null}
          assets={assets}
          items={giftItems}
          receiverName={giftSeat !== null ? (playersRef.current[giftSeat]?.name ?? "") : ""}
          onSend={send}
          onClose={close}
        />
      )}
    </>
  );
}

function buildPlayers(assets: CilizAssets, frame: string, stone: string): SeatPlayer[] {
  let demo = 0;
  return Array.from({ length: 12 }, (_, seat) => {
    if (seat === VIEWER_SEAT) return { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame, stone };
    const id = DEMO_FRAMES[demo++ % DEMO_FRAMES.length] ?? "";
    return {
      name: `Oyuncu ${seat + 1}`,
      photoUrl: VIEWER.photoUrl,
      frame: assets.frames[id] ? id : "",
      stone: assets.stones[id] ? id : "",
    };
  });
}
