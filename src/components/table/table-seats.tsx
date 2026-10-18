import { KickoutSeatFx } from "@/components/table/kickout-seat-fx";
import { telegramZodiac } from "@/lib/telegram-profile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCilizAssets } from "@/components/decor/decor-selection";
import { SendGiftDialog } from "@/components/gifts/send-gift-dialog";
import { ResponseGiftPopup } from "@/components/gifts/response-gift-popup";
import { closeByUser, onGiftToViewer, type ResponseGiftState } from "@/lib/response-gift";
import { OPEN_TOKENS_BANK_EVENT, TokensBankHost } from "@/components/bank/tokens-bank-dialog";
import { GestureDialog } from "@/components/gestures/gesture-dialog";
import { syncDecorFromProfile, useDecorState } from "@/lib/decor-store";
import { VIEWER, VIEWER_STORE } from "@/lib/viewer";
import { buildGiftItems, createSentGift, RAND_MOD, type GiftStoreItem } from "@/lib/gifts";
import { playSfx, preloadSfx, prepareSfx, unlockSfx } from "@/lib/sfx";
import { dialogImage, translate, type CilizAssets } from "@/lib/ciliz-assets";
import { closedTarget, giftReceivers, openFor, seatSelection, selectGender, setSelective, type GiftTargetState } from "@/lib/gift-selection";
import { pushGestureLine, pushGiftLine } from "@/lib/music-session";
import { BottlePlay } from "./bottle-play";
import { completeLoadingStage, failGameLoading } from "@/lib/game-loading";
import { setViewerKisses, useViewerProgress, VIEWER_GOLD } from "@/lib/viewer-progress";
import { GIFT_SENT_EVENT, setSeatLocator } from "@/lib/interactive-hint-flags";
import { OPEN_GIFT_FOR_SEAT_EVENT } from "@/lib/chat-promos";
import { onRoomGift, onRoomGesture, sendGesture, sendGift as sendGiftRpc, useRoom, displaySeatOf, profileBySeat } from "@/lib/room-session";
import { getSupabase, type Profile } from "@/lib/supabase";
import { playerPhoto } from "@/lib/player-photo";
import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import ignoredPhoto from "@/assets/source-ignore-photo.svg";
import { useBlockedUsers } from "@/lib/block-session";
import { showSourceToast } from "@/components/source-dialogs";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { SourceGiftLockedDialog, OPEN_TOPS_EVENT, OPEN_VIP_EVENT, OPEN_BANK_EVENT } from "@/components/source-dialogs";

export interface SeatPlayer {
  id?: string;
  name: string;
  photoUrl: string;
  frame: string;
  stone: string;
  male: boolean;
  /** user.detail.isNew from the server: first time in the game. */
  isNew?: boolean;
  /** Server profile fields (age, city, zodiac index 0-11). */
  age?: number;
  city?: string;
  zodiac?: number;
  /** No player at this server seat. */
  empty?: boolean;
  /** Paid VIP period still running (profiles.vip_until in the future). */
  vipUntil?: number;
  /** Original game.kisses: kisses collected at this table, badge on the photo's top-right. */
  kisses?: number;
}

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
  const [gesturesOpen, setGesturesOpen] = useState(false);

  const progress = useViewerProgress();
  const room = useRoom();
  const blocked = useBlockedUsers();
  const ownKisses = room.players[VIEWER_SEAT]?.kisses;
  useEffect(() => { if (ownKisses !== undefined) setViewerKisses(ownKisses); }, [ownKisses]);
  useEffect(() => {
    const open = (e: Event) => { const seat = (e as CustomEvent<number>).detail; if (seat !== VIEWER_SEAT && playersRef.current[seat]) { setGesturesOpen(false); setTarget(state => openFor(state, seat, VIEWER_SEAT)); } };
    window.addEventListener(OPEN_GIFT_FOR_SEAT_EVENT, open);
    return () => window.removeEventListener(OPEN_GIFT_FOR_SEAT_EVENT, open);
  }, []);
  const [profileSeat, setProfileSeat] = useState<number | null>(null);
  const [ownProfileOpen, setOwnProfileOpen] = useState(false);
  const [offTable, setOffTable] = useState<SeatPlayer | null>(null);
  const assetsRef = useRef<CilizAssets | null>(null);
  assetsRef.current = assets ?? null;
  useEffect(() => {
    const open = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const seat = playersRef.current.findIndex(player => player?.id === id);
      if (seat === VIEWER_SEAT) setOwnProfileOpen(true);
      else if (seat >= 0) setProfileSeat(seat);
      else if (id) void getSupabase()?.from("profiles").select("*").eq("id", id).maybeSingle().then(({ data }) => {
        if (!data) return;
        const p = data as Profile;
        if (assetsRef.current) setOffTable(buildPlayers(assetsRef.current, [p], p.frame, p.stone)[0] ?? null);
      });
    };
    window.addEventListener('source:open-profile', open);
    return () => window.removeEventListener('source:open-profile', open);
  }, []);
  const [lockedGift, setLockedGift] = useState<GiftStoreItem | null>(null);
  // SendGiftPresenter.showResponseGift: a gift to the viewer offers a return gift.
  const responseRef = useRef<ResponseGiftState>({ type: "ready" });
  const [response, setResponse] = useState<{ senderId: string; giftType: string } | null>(null);
  const offerResponse = useCallback((senderId: string, giftType: string) => {
    const next = onGiftToViewer(responseRef.current, senderId, giftType, Date.now());
    if (!next) return;
    responseRef.current = next;
    setResponse({ senderId, giftType });
  }, []);
  const endResponse = useCallback((state: ResponseGiftState) => { responseRef.current = state; setResponse(null); }, []);
  const giftItems = useMemo(() => (assets ? buildGiftItems(assets, VIEWER_STORE.social, { kisses: progress.kisses, vip: progress.vip }) : []), [assets, progress.kisses, progress.vip]);
  const ownTokens = room.players[VIEWER_SEAT]?.tokens;
  const ownId = room.players[VIEWER_SEAT]?.id;
  const gestureAccount = useMemo(() => ownId && ownTokens !== undefined ? ({ userId: ownId, kisses: progress.kisses, vip: progress.vip, tokens: ownTokens, social: VIEWER_STORE.social, platform: "web", scheduled: [] }) : null, [ownId, ownTokens, progress.kisses, progress.vip]);
  const localGestures = useRef(0);
  // Everyone at the table sees every confirmed gesture (ours already played on click).
  useEffect(() => {
    if (!assets) return;
    return onRoomGesture(row => {
      const seat = displaySeatOf(row.sender_id), g = assets.gestures?.[row.gesture];
      const sender = profileBySeat(seat);
      // Original ChatView.createGestureLine: everyone sees the performer's photo + gesture image in chat.
      if (seat >= 0 && g && sender) {
        const im = dialogImage(assets, g.image, 40, 40);
        pushGestureLine(
          { id: row.sender_id, name: sender.name ?? "", photoUrl: sender.photo_url || DEFAULT_PHOTO },
          row.gesture,
          translate(assets, `gesture:${row.gesture}`),
          im?.src ?? g.image,
          row.id,
        );
      }
      if (row.sender_id === playersRef.current[VIEWER_SEAT]?.id && localGestures.current > 0) { localGestures.current--; return; }
      if (seat >= 0 && g) void tableRef.current?.playGesture(seat, g).catch(() => {});
    });
  }, [assets]);
  // GiftLockedPresenter.showKiss: the open dialog follows totalKisses and closes once reached.
  useEffect(() => {
    if (lockedGift?.lock?.kind === "kisses" && progress.kisses >= lockedGift.lock.need) setLockedGift(null);
  }, [lockedGift, progress.kisses]);

  useEffect(() => {
    if (!assets || !hostRef.current) return;
    let disposed = false;
    const host = hostRef.current;
    import("@/components/table/pixi-table").then(async ({ createPixiTable }) => {
      const table = await createPixiTable(host, assets, {
        onSeatClick: (index) => {
          unlockSfx();
          // Own seat opens the gesture picker; other seats re-target or toggle the gift dialog.
          if (index === VIEWER_SEAT) { setTarget(closedTarget); setGesturesOpen(true); return; }
          setGesturesOpen(false);
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
      setActiveTable(table);
      setSeatLocator(seat => table.seatPoint(seat));
      completeLoadingStage("renderer");
    }).catch(error => { console.error("Table loading failed", error); failGameLoading(); });
    return () => {
      disposed = true;
      setSeatLocator(null);
      tableRef.current?.destroy();
      tableRef.current = null;
      setActiveTable(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  const seatSig = useRef<{ sig: string; table: unknown }>({ sig: "", table: null });
  // Real players from the room; empty seats stay empty.
  useEffect(() => {
    if (!assets || !activeTable) return;
    const next = buildPlayers(assets, room.players, decor.frame, decor.stone);
    for (const player of next) if (player.id && blocked.has(player.id)) player.photoUrl = ignoredPhoto;
    playersRef.current = next;
    // Wallet updates (every gift) must not rebuild seats: only redraw when what is drawn changes.
    const sig = JSON.stringify(next.map(p => [p.id, p.name, p.photoUrl, p.frame, p.stone, p.male, p.empty, p.age, p.city, p.vipUntil, p.kisses]));
    if (sig === seatSig.current.sig && seatSig.current.table === activeTable) return;
    seatSig.current = { sig, table: activeTable };
    activeTable.setPlayers(next);
    // Newcomer/birthday widgets come from the once-only server announcement feed.
  }, [assets, activeTable, room.players, decor.frame, decor.stone, blocked]);
  // Decor and ownership come from our server profile (set_decor / buy_decor RPCs).
  const ownProfile = room.players[VIEWER_SEAT];
  useEffect(() => { if (ownProfile) syncDecorFromProfile(ownProfile); }, [ownProfile]);
  // Every confirmed gift in the room (ours included) animates for everyone.
  useEffect(() => {
    if (!assets) return;
    // Realtime delivers rows in bursts; replay each sender's gifts at their server-time cadence.
    const pace = new Map<string, { server: number; local: number }>();
    const timers = new Set<number>();
    const off = onRoomGift(row => {
      const created = Date.parse((row as { created_at?: string }).created_at ?? "") || Date.now();
      const now = performance.now();
      let base = pace.get(row.sender_id);
      let delay = base ? (created - base.server) - (now - base.local) : 0;
      if (!base || delay < -300 || delay > 3000) { base = { server: created, local: now }; pace.set(row.sender_id, base); delay = 0; }
      if (delay <= 0) { play(row); return; }
      const id = window.setTimeout(() => { timers.delete(id); play(row); }, delay);
      timers.add(id);
    });
    return () => { off(); timers.forEach(t => window.clearTimeout(t)); };
    function play(row: Parameters<Parameters<typeof onRoomGift>[0]>[0]) {
      if (!assets) return;
      let mine = false;
      // Our own sends already animated instantly on click.
      const ownKey = `${row.seed}:${row.receiver_id}`;
      if (row.sender_id === playersRef.current[VIEWER_SEAT]?.id && localSent.current.has(ownKey)) { localSent.current.delete(ownKey); mine = true; }
      const from = displaySeatOf(row.sender_id), to = displaySeatOf(row.receiver_id);
      const meta = assets.gifts[row.gift_type];
      if (from < 0 || to < 0 || !meta) return;
      if (!mine) void tableRef.current?.sendGift(from, to, createSentGift(assets, meta, row.seed));
      if (!mine && to === VIEWER_SEAT && row.sender_id !== playersRef.current[VIEWER_SEAT]?.id) offerResponse(row.sender_id, row.gift_type);
      const s = profileBySeat(from), r = profileBySeat(to);
      const item = giftItems.find(i => i.type === row.gift_type);
      pushGiftLine(
        { id: row.sender_id, name: s?.name ?? "", photoUrl: s?.photo_url || DEFAULT_PHOTO },
        { id: row.receiver_id, name: r?.name ?? "", photoUrl: r?.photo_url || DEFAULT_PHOTO },
        (() => { const im = item ? dialogImage(assets, item.image, 28, 28) : null; return { type: row.gift_type, name: item?.name ?? row.gift_type, image: im?.src ?? "", ...(im ? { width: im.width, height: im.height } : {}) }; })(),
      );
    }
  }, [assets, giftItems, offerResponse]);

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

  const spent = useRef(0), localSent = useRef(new Set<string>());
  const send = useCallback(
    (item: GiftStoreItem) => {
      if (!assets) return;
      unlockSfx();
      // Viewer.decGold: not enough hearts for every receiver -> onGoldNeeded -> bank.
      const receivers = giftReceivers(target).map(seat => playersRef.current[seat]?.id).filter((id): id is string => Boolean(id));
      if (!receivers.length) return;
      const serverGold = room.players[VIEWER_SEAT]?.gold ?? VIEWER_GOLD;
      const gold = serverGold - spent.current;
      if (item.price * receivers.length > gold) { window.dispatchEvent(new Event(OPEN_BANK_EVENT)); return; }
      const cost = item.price * receivers.length;
      spent.current += cost;
      const seed = Math.floor(Math.random() * RAND_MOD);
      // Every click animates on its own at once; the server transaction confirms independently.
      const meta = assets.gifts[item.type];
      if (meta) for (const id of receivers) {
        const to = displaySeatOf(id);
        if (to >= 0) { localSent.current.add(`${seed}:${id}`); void tableRef.current?.sendGift(VIEWER_SEAT, to, createSentGift(assets, meta, seed)); }
      }
      // Server checks price, locks and balance in one transaction; the room feed animates it.
      void sendGiftRpc(item.type, receivers, seed).then(res => {
        spent.current = Math.max(0, spent.current - cost);
        if (!res.ok) for (const id of receivers) localSent.current.delete(`${seed}:${id}`);
        if (res.ok) { window.dispatchEvent(new CustomEvent(GIFT_SENT_EVENT, { detail: item.type })); return; }
        if (res.reason.includes("insufficient")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
        else showSourceToast("Hediye gönderilemedi.");
      });
    },
    [assets, target, room.players],
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
        {activeTable && assets && <BottlePlay key={room.roomId} table={activeTable} assets={assets} />}
      </div>
      {activeTable && assets && <KickoutSeatFx assets={assets} seatPoint={seat => activeTable.seatPoint(seat)} />}
      <TokensBankHost />
      {assets && (
        <GestureDialog
          open={gesturesOpen}
          assets={assets}
          account={gestureAccount}
          onClose={() => setGesturesOpen(false)}
          onProfile={() => { setGesturesOpen(false); setOwnProfileOpen(true); }}
          onPreview={async item => {
            const table = tableRef.current;
            if (!table) throw new Error("Table unavailable");
            await table.playGesture(VIEWER_SEAT, item.gesture);
          }}
          onSend={async item => {
            localGestures.current++;
            void tableRef.current?.playGesture(VIEWER_SEAT, item.gesture).catch(() => {});
            const res = await sendGesture(item.gesture.type);
            if (!res.ok) {
              localGestures.current = Math.max(0, localGestures.current - 1);
              if (res.reason.includes("insufficient")) window.dispatchEvent(new Event(OPEN_TOKENS_BANK_EVENT)); else showSourceToast("Jest gönderilemedi.");
            }
          }}
        />
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
          onLocked={setLockedGift}
          onProfile={() => { if (giftSeat !== null) { setProfileSeat(giftSeat); setTarget(closedTarget); } }}
          selective={target.selective}
          multiselect={multiselect}
        />
      )}
      {assets && response && (() => {
        const seat = displaySeatOf(response.senderId), p = playersRef.current[seat];
        if (seat < 0 || !p || p.empty) return null;
        return <ResponseGiftPopup assets={assets} giftType={response.giftType}
          sender={{ id: response.senderId, name: p.name, photoUrl: p.photoUrl, male: p.male }}
          onConfirm={() => { endResponse({ type: "ready" }); setGesturesOpen(false); setTarget(state => openFor(state, seat, VIEWER_SEAT)); }}
          onClose={() => endResponse(closeByUser(Date.now()))}
          onTimeout={() => endResponse({ type: "ready" })} />;
      })()}
      {assets && profileSeat !== null && playersRef.current[profileSeat] && (() => {
        const player = playersRef.current[profileSeat];
        if (!player) return null;
        return <ProfileDialog player={player} self={false} assets={assets}
          onClose={() => setProfileSeat(null)}
          onGift={() => { const seat = profileSeat; setProfileSeat(null); setTarget(state => openFor(state, seat, VIEWER_SEAT)); }}
          onDecor={() => setProfileSeat(null)} onMusic={() => setProfileSeat(null)} />;
      })()}
      {assets && offTable && <ProfileDialog player={offTable} self={false} assets={assets}
        onClose={() => setOffTable(null)} onGift={() => { const seat = offTable.id ? displaySeatOf(offTable.id) : -1; if (seat < 0) return; setOffTable(null); setTarget(state => openFor(state, seat, VIEWER_SEAT)); }} onDecor={() => setOffTable(null)} onMusic={() => setOffTable(null)} />}
      {assets && ownProfileOpen && (
        <ProfileDialog player={{ ...(playersRef.current[VIEWER_SEAT] ?? { name: VIEWER.name, photoUrl: DEFAULT_PHOTO, frame: '', stone: '', male: VIEWER.male }), age: VIEWER.age }} self assets={assets}
          onClose={() => setOwnProfileOpen(false)} onGift={() => setOwnProfileOpen(false)}
          onDecor={() => { setOwnProfileOpen(false); window.dispatchEvent(new CustomEvent("source:open-decor")); }} onMusic={() => { setOwnProfileOpen(false); window.dispatchEvent(new CustomEvent("source:open-music-list")); }} />
      )}
      {assets && lockedGift?.lock && (() => {
        const t = (key: string) => translate(assets, key);
        const vip = lockedGift.lock.kind === "vip";
        return <SourceGiftLockedDialog kind="gift" image={dialogImage(assets, lockedGift.image, 60, 60)}
          title={vip ? t("dlg:locked:vip:title") : t("dlg:locked_gift:title")}
          description={vip ? t("dlg:locked_gift:vip:desc") : t("dlg:locked:kiss:desc")}
          {...(lockedGift.lock.kind === "kisses" ? { lock: { type: "kisses" as const, needed: lockedGift.lock.need, current: progress.kisses } } : {})}
          onClose={() => setLockedGift(null)}
          cancel={{ title: t("dlg:navigate_vip:btn"), onClick: () => setLockedGift(null) }}
          info={{ title: t("mobile:vip:know"), onClick: () => { setLockedGift(null); setTarget(closedTarget); window.dispatchEvent(new CustomEvent(vip ? OPEN_VIP_EVENT : OPEN_TOPS_EVENT, { detail: "total_kisses" })); } }} />;
      })()}
    </>
  );
}

function buildPlayers(assets: CilizAssets, profiles: Array<Profile | null>, frame: string, stone: string): SeatPlayer[] {
  return Array.from({ length: 12 }, (_, seat) => {
    const p = profiles[seat];
    if (!p) return { name: "", photoUrl: DEFAULT_PHOTO, frame: "", stone: "", male: seat % 2 === 1, empty: true };
    const own = seat === VIEWER_SEAT;
    const f = own ? frame : p.frame, st = own ? stone : p.stone;
    return {
      id: p.id,
      name: p.name,
      photoUrl: playerPhoto(p.photo_url, p.telegram_id),
      frame: assets.frames[f] ? f : "",
      stone: assets.stones[st] ? st : "",
      male: p.male,
      isNew: false,
      ...(p.age ? { age: p.age } : {}),
      ...(p.city ? { city: p.city } : {}),
      zodiac: telegramZodiac(p.birthday),
      ...(p.vip_until && Date.parse(p.vip_until) > Date.now() ? { vipUntil: Date.parse(p.vip_until) } : {}),
      kisses: p.table_kisses ?? 0,
    };
  });
}

