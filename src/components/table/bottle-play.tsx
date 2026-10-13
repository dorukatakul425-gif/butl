import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { leftRight, pickTarget, useBottle, turnOfferSound, decisionArrowsVisible, decisionTimerVisible, DECISION_SECONDS, type Decision } from "@/lib/bottle-game";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import { playSfx, preloadSfx, unlockSfx } from "@/lib/sfx";
import { BottleIcon, preloadBottleIcon } from "./bottle-icon";
import { completeLoadingStage, failGameLoading } from "@/lib/game-loading";
import { addViewerKiss } from "@/lib/viewer-progress";
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

export function BottlePlay({table, assets}: {table: Table; assets: CilizAssets}) {
  const selected = useBottle();
  const overlay = useRef<HTMLDivElement>(null);
  const [round,setRound] = useState<Round>({phase:"offer",spinner:VIEWER,target:0,decisions:{}});
  const [remaining,setRemaining] = useState(DECISION_SECONDS);
  const [bottleError,setBottleError] = useState(false);
  const [ready,setReady] = useState(false);
  const roundRef = useRef(round); roundRef.current = round;
  useEffect(() => {
    void Promise.all([kissUp,kissDown,refuseUp,refuseDown,kissButton,refuseButton,rollBig,rollSmall].map(asset => preloadBottleIcon(asset.url)))
      .then(() => completeLoadingStage("icons"), failGameLoading);
  },[]);
  useEffect(() => { preloadSfx(assets.sfxUrl, "ding"); }, [assets.sfxUrl]);
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
  const spin = () => {
    const state = roundRef.current;
    if (state.phase!=="offer" || !ready) return;
    const target = pickTarget(state.spinner);
    setRound({...state,phase:"spin",target,decisions:{}});
    unlockSfx();
    void table.spinBottle(state.spinner,target).then(()=>{
      setRemaining(DECISION_SECONDS); setRound(prev=>({...prev,phase:"choose"}));
    });
  };
  useEffect(() => {
    if (round.phase!=="offer" || round.spinner===VIEWER || !ready) return;
    const timer = window.setTimeout(spin,1400+Math.random()*1400);
    return ()=>window.clearTimeout(timer);
  },[round.phase,round.spinner,ready]);
  useEffect(() => {
    if(round.phase!=="choose") return;
    const timers = [round.spinner,round.target].filter(seat=>seat!==VIEWER).map(seat=>window.setTimeout(()=>{
      setRound(prev=>({...prev,decisions:{...prev.decisions,[seat]:Math.random()<0.8 ? "kiss":"refuse"}}));
    },700+Math.random()*1700));
    const interval=window.setInterval(()=>setRemaining(n=>Math.max(0,n-1)),1000);
    return ()=>{timers.forEach(window.clearTimeout);window.clearInterval(interval);};
  },[round.phase,round.spinner,round.target]);
  useEffect(() => {
    if(round.phase!=="choose")return;
    if(remaining===0) {
      setRound(prev=>({...prev,phase:"result",decisions:{[prev.spinner]:"refuse",[prev.target]:"refuse",...prev.decisions}}));
    } else if(round.decisions[round.spinner] && round.decisions[round.target]) setRound(prev=>({...prev,phase:"result"}));
  },[round,remaining]);
  useEffect(() => {
    if(round.phase!=="result")return;
    // Mutual kiss with the viewer counts toward totalKisses (kiss-locked gifts).
    if((round.spinner===VIEWER||round.target===VIEWER) && round.decisions[round.spinner]==="kiss" && round.decisions[round.target]==="kiss") addViewerKiss();
    const timer=window.setTimeout(()=>{
      setRound(prev=>({...prev,phase:"return",decisions:{}}));
    },2000);
    return ()=>window.clearTimeout(timer);
  },[round.phase]);
  useEffect(() => {
    if(round.phase!=="return")return;
    let alive=true;
      void table.returnPlayers(round.spinner,round.target).then(()=>{
        if(alive)setRound({phase:"offer",spinner:round.target,target:0,decisions:{}});
      });
    return ()=>{alive=false;};
  },[round.phase,round.spinner,round.target,table]);
  const participating = round.spinner===VIEWER || round.target===VIEWER;
  const [left,right] = leftRight(round.spinner,round.target);
  const offer = offers[round.spinner] ?? offers[0];
  const decide = (decision:Decision) => {
    if(round.phase!=="choose" || !participating || round.decisions[VIEWER])return;
    setRound(prev=>({...prev,decisions:{...prev.decisions,[VIEWER]:decision}}));
  };
  return <div ref={overlay} className="bottle-play-overlay" aria-label="Şişe oyunu" data-phase={round.phase} data-spinner={round.spinner} data-target={round.target}>
    {round.phase==="offer" && round.spinner===VIEWER && <>
      <Button variant="ghost" className="bottle-spin-hit" aria-label="Şişeyi çevir" disabled={!ready} onClick={spin} />
      <BottleIcon className="bottle-roll-big" src={rollBig.url} alt="" /><span className="bottle-roll-text">{translate(assets,"game:spin")}</span>
    </>}
    {round.phase==="offer" && round.spinner!==VIEWER && offer && <>
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