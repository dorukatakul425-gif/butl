import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { leftRight, useBottle, turnOfferSound, decisionArrowsVisible, decisionTimerVisible, DECISION_SECONDS, type Decision } from "@/lib/bottle-game";
import { decide as decideRpc, spinBottle, toDisplay, useRoom } from "@/lib/room-session";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import { playSfx, preloadSfx, unlockSfx } from "@/lib/sfx";
import { BottleIcon, preloadBottleIcon } from "./bottle-icon";
import { completeLoadingStage, failGameLoading } from "@/lib/game-loading";
import kissUp from "@/assets/ui_arrow_kiss_up.svg.asset.json";
import kissDown from "@/assets/ui_arrow_kiss_down.svg.asset.json";
import refuseUp from "@/assets/ui_arrow_refuse_up.svg.asset.json";
import refuseDown from "@/assets/ui_arrow_refuse_down.svg.asset.json";
import kissButton from "@/assets/ui_btn_kiss.svg.asset.json";
import refuseButton from "@/assets/ui_btn_refuse.svg.asset.json";
import rollBig from "@/assets/ui_game_roll_big_arrow.svg.asset.json";
import rollSmall from "@/assets/ui_game_roll_small_arrow.svg.asset.json";

type Table = Awaited<ReturnType<typeof import("./pixi-table").createPixiTable>>;
type Round = {phase: "offer"|"spin"|"choose"|"result"|"return"; spinner: number; target: number; decisions: Record<number,Decision>};
const VIEWER = 5;
// RollSmallData from the source: arrow x/y/rotation and text x/y.
const offers = [[35,-94,-45,13,-82],[74,-83,0,30,-74],[83,-43,45,27,-48],[83,38,45,27,32],[74,78,90,30,54],[35,91,135,13,67],[-47,91,135,-69,67],[-89,78,180,-90,54],[-99,38,-135,-86,32],[-99,-43,-135,-86,-48],[-89,-83,-90,-90,-74],[-47,-94,-45,-69,-82]];

/** Renders the server-owned round: every player at the table sees the same phase, spinner, target and choices. */
export function BottlePlay({table, assets}: {table: Table; assets: CilizAssets}) {
  const selected = useBottle();
  const overlay = useRef<HTMLDivElement>(null);
  const live = useRoom();
  const srv = live.room;
  const round: Round = srv ? {
    phase: srv.phase,
    spinner: srv.spinner === null ? -1 : toDisplay(srv.spinner, live.mySeat),
    target: srv.target === null ? -1 : toDisplay(srv.target, live.mySeat),
    decisions: Object.fromEntries(Object.entries(srv.decisions ?? {}).map(([seat, d]) => [toDisplay(Number(seat), live.mySeat), d])),
  } : {phase:"offer",spinner:-1,target:-1,decisions:{}};
  const [remaining,setRemaining] = useState(DECISION_SECONDS);
  const [bottleError,setBottleError] = useState(false);
  const [ready,setReady] = useState(false);
  const animated = useRef({spun:-1, returned:-1, kissed:-1, from:-1, to:-1});
  useEffect(() => {
    void Promise.all([kissUp,kissDown,refuseUp,refuseDown,kissButton,refuseButton,rollBig,rollSmall].map(asset => preloadBottleIcon(asset.url)))
      .then(() => completeLoadingStage("icons"), failGameLoading);
  },[]);
  useEffect(() => {
    preloadSfx(assets.sfxUrl, "ding");
    // Browsers keep audio suspended until a gesture; unlock on the first touch so the turn ding is instant.
    const unlock = () => unlockSfx();
    window.addEventListener("pointerdown", unlock, {once:true});
    window.addEventListener("keydown", unlock, {once:true});
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, [assets.sfxUrl]);
  useEffect(() => {
    const sound = turnOfferSound(round.phase, round.spinner, VIEWER, ready);
    if (sound) void playSfx(assets.sfxUrl, sound);
  }, [round.phase, round.spinner, ready, assets.sfxUrl]);
  useEffect(() => {
    let alive = true; setReady(false); setBottleError(false);
    table.setBottle(selected).then(()=>{if(alive){setReady(true);completeLoadingStage("bottle");}},()=>{if(alive){setBottleError(true);failGameLoading();}});
    return ()=>{alive=false;};
  },[selected,table]);
  useEffect(() => {
    const el = overlay.current; const host = el?.parentElement;
    if (!el || !host) return;
    const layout = () => {
      const header = host.parentElement?.querySelector(".original-table-header")?.getBoundingClientRect().height ?? 0;
      const scale = Math.min(host.clientWidth/375,(host.clientHeight-header)/375);
      el.style.transform = `translate(${host.clientWidth/2}px,${header+(host.clientHeight-header)/2}px) scale(${scale})`;
    };
    layout(); const ro = new ResizeObserver(layout); ro.observe(host); return ()=>ro.disconnect();
  },[]);
  const roundNo = srv?.round ?? 0;
  // Animations follow server phases; a late joiner skips the part already over.
  useEffect(() => {
    if (round.phase==="spin" && animated.current.spun!==roundNo && round.spinner>=0 && round.target>=0) {
      animated.current.spun = roundNo; animated.current.from = round.spinner; animated.current.to = round.target;
      unlockSfx();
      void table.spinBottle(round.spinner, round.target);
    }
    if (round.phase==="result" && animated.current.kissed!==roundNo && round.decisions[round.spinner]==="kiss" && round.decisions[round.target]==="kiss") {
      animated.current.kissed = roundNo;
      table.addKiss(round.spinner); table.addKiss(round.target);
    }
    if ((round.phase==="return" || round.phase==="offer") && animated.current.spun===roundNo && animated.current.returned!==roundNo) {
      animated.current.returned = roundNo;
      void table.returnPlayers(animated.current.from, animated.current.to);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[round.phase, roundNo, table]);
  useEffect(() => {
    if(round.phase!=="choose") return;
    const tick = () => setRemaining(Math.max(0, DECISION_SECONDS - Math.floor((Date.now()-live.phaseReceivedAt)/1000)));
    tick(); const interval=window.setInterval(tick,250);
    return ()=>window.clearInterval(interval);
  },[round.phase, live.phaseReceivedAt]);
  const spin = () => {
    if (round.phase!=="offer" || round.spinner!==VIEWER || !ready) return;
    unlockSfx();
    void spinBottle();
  };
  const participating = round.spinner===VIEWER || round.target===VIEWER;
  const [left,right] = round.spinner>=0 && round.target>=0 ? leftRight(round.spinner,round.target) : [-1,-1];
  const offer = offers[round.spinner] ?? offers[0];
  const decide = (decision:Decision) => {
    if(round.phase!=="choose" || !participating || round.decisions[VIEWER])return;
    void decideRpc(decision==="kiss");
  };
  return <div ref={overlay} className="bottle-play-overlay" aria-label="Şişe oyunu" data-phase={round.phase} data-spinner={round.spinner} data-target={round.target}>
    {round.phase==="offer" && round.spinner===VIEWER && <>
      <Button variant="ghost" className="bottle-spin-hit" aria-label="Şişeyi çevir" disabled={!ready} onClick={spin} />
      <BottleIcon className="bottle-roll-big" src={rollBig.url} alt="" /><span className="bottle-roll-text">{translate(assets,"game:spin")}</span>
    </>}
    {round.phase==="offer" && round.spinner!==VIEWER && round.spinner>=0 && offer && <>
      <BottleIcon className="bottle-roll-small" src={rollSmall.url} alt="" style={{left:offer[0],top:offer[1],transform:`translate(-50%,-50%) rotate(${offer[2]}deg)`}} />
      <span className="bottle-small-text" style={{left:offer[3],top:offer[4]}}>{translate(assets,"game:spins")}</span>
    </>}
    {decisionArrowsVisible(round.phase) && <>
      {round.decisions[left] && <BottleIcon className="bottle-decision-arrow bottle-arrow-up" src={round.decisions[left]==="kiss" ? kissUp.url:refuseUp.url} alt={round.decisions[left]==="kiss" ? "Öptü":"Vazgeçti"} />}
      {round.decisions[right] && <BottleIcon className="bottle-decision-arrow bottle-arrow-down" src={round.decisions[right]==="kiss" ? kissDown.url:refuseDown.url} alt={round.decisions[right]==="kiss" ? "Öptü":"Vazgeçti"} />}
      {decisionTimerVisible(round.phase,participating,Boolean(round.decisions[VIEWER])) && <span className="bottle-countdown" role="timer" aria-label="Karar süresi">{remaining}</span>}
      {round.phase==="choose" && participating && !round.decisions[VIEWER] && <>
        <Button variant="ghost" className="bottle-decision-button bottle-refuse-button" onClick={()=>decide("refuse")}><BottleIcon src={refuseButton.url} alt="" /><span>{translate(assets,"game:choose:btn_kiss_cancel")}</span></Button>
        <Button variant="ghost" className="bottle-decision-button bottle-kiss-button" onClick={()=>decide("kiss")}><BottleIcon src={kissButton.url} alt="" /><span>{translate(assets,"game:choose:btn_kiss")}</span></Button>
      </>}
    </>}
    {bottleError && <Button variant="ghost" className="bottle-retry" onClick={()=>{setBottleError(false);void table.setBottle(selected).then(()=>setReady(true),()=>setBottleError(true));}}>Şişeyi yeniden yükle</Button>}
  </div>;
}