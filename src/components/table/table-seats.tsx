import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { SendGiftDialog } from "@/components/gifts/send-gift-dialog";
import { useDecorState } from "@/lib/decor-store";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { buildGiftItems, createSentGift, RAND_MOD, type GiftStoreItem } from "@/lib/gifts";
import { playSfx, preloadSfx, prepareSfx, unlockSfx } from "@/lib/sfx";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { closedTarget, giftReceivers, openFor, seatSelection, selectGender, setSelective, type GiftTargetState } from "@/lib/gift-selection";
import { pushGiftLine } from "@/lib/music-session";
import { BottlePlay } from "./bottle-play";
import { completeLoadingStage, failGameLoading } from "@/lib/game-loading";

export interface SeatPlayer {
  name: string;
  photoUrl: string;
  frame: string;
  stone: string;
  male: boolean;
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
  const [target, setTarget] = useState<GiftTargetState>(closedTarget);
  const giftSeat = target.receiver;
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
          // showGifts(receiver) / selectable pointertap: self gifts refused; others re-target or toggle.
          setTarget(state => openFor(state, index, VIEWER_SEAT));
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
    const viewer = { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame: decor.frame, stone: decor.stone, male: true };
    playersRef.current[VIEWER_SEAT] = viewer;
    tableRef.current?.setPlayer(VIEWER_SEAT, viewer);
  }, [assets, decor.frame, decor.stone]);

  useEffect(() => {
    activeTable?.setSelection(Array.from({ length: 12 }, (_, seat) => seatSelection(target, seat, VIEWER_SEAT)));
  }, [activeTable, target]);

  // Warm sounds on open; visible/pointed gift items preload their own visuals.
  // Parsing the entire catalogue here competes with rapid sends on slower phones.
  useEffect(() => {
    if (giftSeat === null || !assets) return;
    const ids = new Set(giftItems.flatMap((item) => [...item.gift.startSounds, ...item.gift.finishSounds]));
    ids.forEach((id) => preloadSfx(assets.sfxUrl, id));
  }, [giftSeat, assets, giftItems]);

  const send = useCallback(
    (item: GiftStoreItem) => {
      if (!assets) return;
      unlockSfx();
      // viewerSendGift(selectedUsers, gift): one independent gift per selected receiver.
      for (const seat of giftReceivers(target)) {
        const gift = createSentGift(assets, item.gift, Math.floor(Math.random() * RAND_MOD));
        void tableRef.current?.sendGift(VIEWER_SEAT, seat, gift);
        const receiver = playersRef.current[seat];
        pushGiftLine(
          { id: "viewer", name: VIEWER.name, photoUrl: VIEWER.photoUrl },
          { id: `seat-${seat}`, name: receiver?.name ?? "", photoUrl: receiver?.photoUrl ?? "" },
          { type: item.type, name: item.name, image: dialogImage(assets, item.image, 28, 28).src },
        );
      }
    },
    [assets, target],
  );
  const preload = useCallback((item: GiftStoreItem) => {
    void tableRef.current?.preloadGift(item.gift).catch(error => console.warn(`Gift preload ${item.type}`, error));
  }, []);
  const close = useCallback(() => setTarget(closedTarget), []);
  const multiselect = useMemo(() => ({
    title: assets ? translate(assets, "mobile:dlg:gift:multiselect", "Birden fazla kişi seç") : "",
    onSelectState: (on: boolean) => setTarget(state => setSelective(state, on)),
    onSelectMen: () => setTarget(state => selectGender(state, playersRef.current.map(p => p.male), true, VIEWER_SEAT)),
    onSelectWomen: () => setTarget(state => selectGender(state, playersRef.current.map(p => p.male), false, VIEWER_SEAT)),
  }), [assets]);

  return (
    <>
      <div ref={hostRef} className="original-table-seats" aria-label="Masadaki oyuncular">
        {activeTable && assets && <BottlePlay table={activeTable} assets={assets} />}
      </div>
      {assets && (
        <SendGiftDialog
          open={giftSeat !== null}
          assets={assets}
          items={giftItems}
          receiverName={giftSeat !== null ? (playersRef.current[giftSeat]?.name ?? "") : ""}
          onSend={send}
          onPreload={preload}
          onClose={close}
          selective={target.selective}
          multiselect={multiselect}
        />
      )}
    </>
  );
}

function buildPlayers(assets: CilizAssets, frame: string, stone: string): SeatPlayer[] {
  let demo = 0;
  return Array.from({ length: 12 }, (_, seat) => {
    if (seat === VIEWER_SEAT) return { name: VIEWER.name, photoUrl: VIEWER.photoUrl, frame, stone, male: true };
    const id = DEMO_FRAMES[demo++ % DEMO_FRAMES.length] ?? "";
    return {
      name: `Oyuncu ${seat + 1}`,
      photoUrl: VIEWER.photoUrl,
      frame: assets.frames[id] ? id : "",
      stone: assets.stones[id] ? id : "",
      // Demo seats alternate gender so men/women multiselect has targets.
      male: seat % 2 === 0,
    };
  });
}
