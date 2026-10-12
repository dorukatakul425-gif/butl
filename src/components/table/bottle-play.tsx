import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { leftRight, useBottle, decisionArrowsVisible, decisionTimerVisible, DECISION_SECONDS, type Decision } from "@/lib/bottle-game";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import { playSfx, preloadSfx, unlockSfx } from "@/lib/sfx";
import { BottleIcon, preloadBottleIcon } from "./bottle-icon";
import { performRound, type CloudRoom } from "@/lib/cloud-room";
import { toast } from "sonner";
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
// RollSmallData from the source: arrow x/y/rotation and text x/y.
const offers = [[35,-94,-45,13,-82],[74,-83,0,30,-74],[83,-43,45,27,-48],[83,38,45,27,32],[74,78,90,30,54],[35,91,135,13,67],[-47,91,135,-69,67],[-89,78,180,-90,54],[-99,38,-135,-86,32],[-99,-43,-135,-86,-48],[-89,-83,-90,-90,-74],[-47,-94,-45,-69,-82]];

export function BottlePlay({table, assets, room, viewerId}: {table: Table; assets: CilizAssets; room: CloudRoom | null; viewerId: string}) {
  const selected = useBottle();
  const overlay = useRef<HTMLDivElement>(null);
  const shared = room?.round;
  const VIEWER = room?.players.find(p => p.id === viewerId)?.seat ?? 5;
  const spinner = room?.players.find(p => p.id === shared?.spinner)?.seat ?? VIEWER;
  const target = room?.players.find(p => p.id === shared?.target)?.seat ?? 0;
  const [spinning, setSpinning] = useState(false);
  const eligible = Boolean(room?.players.some(p => p.onboarded && p.gender === 'male') && room?.players.some(p => p.onboarded && p.gender === 'female'));
  const waiting = !eligible || shared?.phase === 'waiting';
  const animated = useRef('');
  const previousPair = useRef<[number, number] | null>(null);
  const round = { phase: waiting ? 'waiting' : spinning ? 'spin' : shared?.phase ?? 'waiting', spinner, target, decisions: Object.fromEntries((room?.players ?? []).flatMap(p => shared?.decisions[p.id] ? [[p.seat, shared.decisions[p.id]]] : [])) as Record<number, Decision> };
  const [remaining,setRemaining] = useState(DECISION_SECONDS);
  const [bottleError,setBottleError] = useState(false);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    void Promise.all([kissUp,kissDown,refuseUp,refuseDown,kissButton,refuseButton,rollBig,rollSmall].map(asset => preloadBottleIcon(asset.url)))
      .then(() => completeLoadingStage("icons"), failGameLoading);
  },[]);
  useEffect(() => { preloadSfx(assets.sfxUrl, "ding"); }, [assets.sfxUrl]);
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
  const spin = () => { unlockSfx(); void performRound('spin').catch(e => toast.error(e.message)); };
  useEffect(() => { if (waiting && ready) { setSpinning(false); table.resetWaitingBottle(); } }, [waiting, ready, table]);
  useEffect(() => {
    if (waiting || !shared || !ready || !shared.started_at || shared.phase === 'offer' || animated.current === shared.started_at) return;
    animated.current = shared.started_at;
    previousPair.current = [spinner, target];
    setSpinning(true);
    void table.spinBottle(spinner, target, Date.parse(shared.started_at), shared.turns ?? 10).then(() => setSpinning(false));
  }, [shared?.started_at, waiting, ready, spinner, target, table]);
  useEffect(() => {
    if (shared?.phase !== 'offer' && shared?.phase !== 'waiting' || !previousPair.current) return;
    const [from, to] = previousPair.current;
    previousPair.current = null;
    void table.returnPlayers(from, to).then(() => { if (waiting) table.resetWaitingBottle(); });
  }, [shared?.phase, waiting, table]);
  useEffect(() => {
    if (!shared?.deadline) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((Date.parse(shared.deadline ?? '') - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) void performRound('refresh').catch(() => {});
    };
    tick(); const timer = window.setInterval(tick, 1000); return () => clearInterval(timer);
  }, [shared?.deadline, shared?.phase, viewerId]);
  const participating = round.spinner===VIEWER || round.target===VIEWER;
  const [left,right] = leftRight(round.spinner,round.target);
  const offer = offers[round.spinner] ?? offers[0];
  const decide = (decision: Decision) => { void performRound('decide', decision).catch(e => toast.error(e.message)); };
  return <div ref={overlay} className="bottle-play-overlay" aria-label="Şişe oyunu" data-phase={round.phase} data-spinner={round.spinner} data-target={round.target}>
    <span role="status" className="bottle-turn-status">{waiting ? 'Oyuncular bekleniyor…' : round.phase==="offer" ? (round.spinner===VIEWER ? "Sıra sende" : `Oyuncu ${round.spinner+1} • Sırası`) : round.phase==="spin" ? `${round.spinner===VIEWER ? "Sen" : `Oyuncu ${round.spinner+1}`} • Şişeyi çeviriyor` : round.phase==="choose" ? (participating ? translate(assets,"game:choose:title") : translate(assets,"game:willtheykiss")) : ""}</span>
    {round.phase==="offer" && round.spinner===VIEWER && <>
      <Button variant="ghost" className="bottle-spin-hit" aria-label="Şişeyi çevir" disabled={!ready || !room || !eligible} onClick={spin} />
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