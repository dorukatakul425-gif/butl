import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { SendGiftDialog } from "@/components/gifts/send-gift-dialog";
import { GestureDialog } from "@/components/gestures/gesture-dialog";
import { useDecorState } from "@/lib/decor-store";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { buildGiftItems, createSentGift, RAND_MOD, type GiftStoreItem } from "@/lib/gifts";
import { playSfx, preloadSfx, prepareSfx, unlockSfx } from "@/lib/sfx";
import type { CilizAssets } from "@/lib/ciliz-assets";
import { BottlePlay } from "./bottle-play";
import { completeLoadingStage, failGameLoading } from "@/lib/game-loading";

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
  const [gesturesOpen, setGesturesOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<PixiTable | null>(null);

  const giftItems = useMemo(() => (assets ? buildGiftItems(assets, VIEWER_STORE.social, { kisses: 0, vip: true }) : []), [assets]);

  useEffect(() => {
    if (!assets || !hostRef.current) return;
    let disposed = false;
    const host = hostRef.current;
    import("@/components/table/pixi-table").then(async ({ createPixiTable }) => {
      const table = await createPixiTable(host, assets, {
        onSeatClick: (index) => {
          unlockSfx();
          if (index === VIEWER_SEAT) { setGiftSeat(null); setGesturesOpen(true); }
          else { setGesturesOpen(false); setGiftSeat(index); }
        },
        playSfx: (id) => void playSfx(assets.sfxUrl, id),
        prepareSfx: (id) => prepareSfx(assets.sfxUrl, id),
      });
      if (disposed) {
        table.destroy();
        return;
      }
      tableRef.current = table;
      playersRef.current = buildPlayers(assets, decor.frame, decor.stone);
      table.setPlayers(playersRef.current);
      setActiveTable(table);
      completeLoadingStage("renderer");
    }).catch(error => { console.error("Table loading failed", error); failGameLoading(); });
    return () => {
      disposed = true;
      tableRef.current?.destroy();
      tableRef.current = null;
      setActiveTable(null);
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
  const preload = useCallback((item: GiftStoreItem) => {
    void tableRef.current?.preloadGift(item.gift).catch(error => console.warn(`Gift preload ${item.type}`, error));
  }, []);
  const close = useCallback(() => setGiftSeat(null), []);

  return (
    <>
      <div ref={hostRef} className="original-table-seats" aria-label="Masadaki oyuncular">
        {activeTable && assets && <BottlePlay table={activeTable} assets={assets} />}
      </div>
      {assets && (
        <GestureDialog open={gesturesOpen} assets={assets} onClose={() => setGesturesOpen(false)} onPreview={async item => {
          const table = tableRef.current;
          if (!table) throw new Error("Table unavailable");
          await table.playGesture(VIEWER_SEAT, item.gesture);
        }} />
      )}
      {assets && (
        <SendGiftDialog
          open={giftSeat !== null}
          assets={assets}
          items={giftItems}
          receiverName={giftSeat !== null ? (playersRef.current[giftSeat]?.name ?? "") : ""}
          onSend={send}
          onPreload={preload}
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
