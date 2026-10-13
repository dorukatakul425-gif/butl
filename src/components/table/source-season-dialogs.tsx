import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { dialogImage, translate, type CilizAssets } from '@/lib/ciliz-assets';
import { executeSourceFeature, useSourceFeatureSession, type SourceFeatureAction, type SourceReward } from '@/lib/source-feature-session';
import { SourceFeaturePopup } from './source-feature-popup';
import { playSfx } from '@/lib/sfx';

function Text({ text }: { text: string }) {
  return <>{text.split(/(<b>|<\/b>|<[^>]+>)/g).map((part, i) => part === '<b>' || part === '</b>' ? null : part.startsWith('<') ? <span key={i} className={part.includes('star') ? 'bottle-pass__star' : 'roulette__heart'}>—</span> : <span key={i}>{part}</span>)}</>;
}
function Image({ assets, name, size = 60 }: { assets: CilizAssets; name: string; size?: number }) {
  if (!assets.images[name]) return null;
  const image = dialogImage(assets, name, size, size);
  return <img src={image.src} width={image.width} height={image.height} alt="" />;
}
function Rewards({ assets, rewards }: { assets: CilizAssets; rewards: SourceReward[] }) {
  return <div className="source-feature-rewards">{rewards.map(r => <div key={r.id} className="source-feature-reward"><Image assets={assets} name={r.image} /><span>{r.title} {r.count}</span></div>)}</div>;
}

/** Public presentation; schedules, prize tables and every transaction remain host-owned. */
export function SourceSeasonDialog({ feature, onClose }: { feature: 'league' | 'roulette' | 'bottle-pass'; onClose: () => void }) {
  const assets = useCilizAssets(), session = useSourceFeatureSession();
  const [nested, setNested] = useState<'help' | 'ladder' | 'premium' | 'reward-info' | 'reward' | null>(null), [selectedLeague, setSelectedLeague] = useState<number | null>(null), [rewards, setRewards] = useState<SourceReward[]>([]), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [spinning, setSpinning] = useState(false), [now, setNow] = useState(Date.now());
  const wheel = useRef<HTMLDivElement>(null), rotation = useRef(0), timeout = useRef<number | undefined>(undefined), spinGeneration = useRef(0), pendingRewards = useRef<SourceReward[]>([]), seenRewards = useRef(new Set<string>());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => { window.clearInterval(id); window.clearTimeout(timeout.current); spinGeneration.current++; }; }, []);
  if (!assets) return null;
  const t = (key: string, ...args: string[]) => translate(assets, key, ...args);
  const title = feature === 'roulette' ? t('roulette:main:panel1:header') : feature === 'bottle-pass' ? t('dlg:bottle_pass:title') : session.league ? t(`dlg:league:${session.league.level}`) : t('dlg:league:idle:title');
  const showEarned = (items: SourceReward[]) => {
    const verified = items.filter(r => r.id && Number.isSafeInteger(r.count) && r.count > 0 && !seenRewards.current.has(r.id));
    if (!verified.length) return;
    verified.forEach(r => seenRewards.current.add(r.id)); setRewards(verified); setNested('reward');
  };
  const finishSpin = () => { window.clearTimeout(timeout.current); spinGeneration.current++; setSpinning(false); showEarned(pendingRewards.current); pendingRewards.current = []; };
  const act = async (action: SourceFeatureAction, input?: Record<string, string | number>) => {
    if (busy || spinning) return;
    setBusy(true); setMessage('');
    try {
      const result = await executeSourceFeature(action, input);
      if (!result.confirmed) { setMessage(result.message ?? t('dlg:music:unavailable')); return; }
      if (action === 'roulette-spin') {
        const count = session.roulette?.prizes.length ?? 0, idx = result.rewardIndex;
        if (idx === undefined || !Number.isInteger(idx) || idx < 0 || idx >= count) { setMessage(t('dlg:music:unavailable')); return; }
        pendingRewards.current = result.rewards ?? []; setSpinning(true); void playSfx(assets.sfxUrl, 'roulette_spin');
        const generation = ++spinGeneration.current;
        const target = (180 - idx * (360 / count) + 360) % 360;
        rotation.current += 1440 + ((target - rotation.current % 360 + 360) % 360);
        if (wheel.current) { wheel.current.style.transition = 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)'; wheel.current.style.transform = `rotate(${rotation.current}deg)`; }
        timeout.current = window.setTimeout(() => { if (generation === spinGeneration.current) finishSpin(); }, 4000);
      } else showEarned(result.rewards ?? []);
    } catch (e) { setMessage(e instanceof Error ? e.message : t('dlg:music:unavailable')); } finally { setBusy(false); }
  };
  const remaining = (endsAt?: number) => endsAt === undefined ? '—' : `${Math.floor(Math.max(0, endsAt - now) / 3600000)}:${Math.floor(Math.max(0, endsAt - now) / 60000) % 60}`;
  const info = (index: number) => { setSelectedLeague(index); setNested('reward-info'); };
  let body: ReactNode;
  if (feature === 'league') {
    const level = session.league?.level, entry = level === undefined ? undefined : assets.leagues?.[level];
    body = <div className="league"><div className="league__section league__section--up"><div className="league__header"><div className="league__info"><div className="league__info-title"><div className="league__description">{t(session.league ? 'dlg:league:desc:boosters' : 'dlg:league_start:desc')}</div></div><Button variant="ghost" className="league__cup-bg league__cup-bg--enabled" aria-label={t('dlg:league:ladder:title')} onClick={() => setNested('ladder')}><Image assets={assets} name={entry?.image ?? assets.leagues?.[0]?.image ?? ''} size={85} /><span className="league__ladder-icon" /></Button></div></div><div className="league__list">{session.league?.players.map((p, i) => <div className="league__user" key={p.id}>{p.photo && <img src={p.photo} className="league__photo" alt="" />}<div className={`league__user-info${p.id === session.viewerId ? ' league__user-info--viewer' : ''}`}><div className="league__name"><span className="league__position">{i + 1}.</span>{p.name}</div><div className="league__stats"><span className="league__stars"><span className="league__stars-icon" />{p.score}</span></div></div><Button variant="ghost" className="league__present" aria-label={t('dlg:league:desc:prize', String(i + 1))} onClick={() => info(level ?? 0)} /></div>)}</div></div><div className="source-feature-message">{session.league ? `${t('dlg:top:timer:results_in')}: ${remaining(session.league.endsAt)}` : '—'}</div>{!session.league && <div className="popup__buttons"><Button variant="ghost" className="button--confirm" disabled={!session.viewerId || busy} onClick={() => void act('league-join')}>{t('dlg:league_start:btn')}</Button></div>}</div>;
  } else if (feature === 'roulette') {
    body = <div className="roulette"><div className="roulette__paper roulette__paper--guide"><div className="roulette__description"><Text text={t('roulette:main:panel1:desc')} /></div><div className="roulette__chances"><span className="roulette__chances-title">{t('roulette:main:panel1:chances')}</span><span className="roulette__chances-stats">{session.roulette?.freeSpins ?? '—'}</span></div></div><div className="roulette__paper roulette__paper--wheel"><div className="roulette__wheel-section"><div ref={wheel} className="roulette__wheel">{session.roulette?.prizes.map((r, i, list) => <div key={r.id} className="roulette__wheel-item" style={{ transform: `translate(0,-50%) rotate(${i * 360 / list.length}deg) translate(105px) rotate(180deg)` }}><Image assets={assets} name={r.image} size={32} /><span>{r.count}</span></div>)}</div><div className="roulette__wheel-arrow" /><div className="roulette__wheel-center" /></div><div className="roulette__spins"><Text text={t('roulette:main:price').replace('<chance/>', String(session.roulette?.price ?? '—'))} /></div><div className="popup__buttons"><Button variant="ghost" className="button--confirm roulette__x_button" disabled={busy || !session.roulette || !session.viewerId} onClick={() => spinning ? finishSpin() : void act('roulette-spin')}>{t(spinning ? 'roulette:main:btn2' : 'roulette:main:btn1')}</Button></div></div></div>;
  } else {
    body = <div className="bottle-pass"><div className="bottle-pass__season-stats"><span className="bottle-pass__season-timer">{t('dlg:bottle_pass:timer').replace('%', remaining(session.pass?.endsAt))}</span><span className="bottle-pass__star" />{session.pass?.points ?? '—'}</div><div className="bottle-pass__header"><Button variant="ghost" onClick={() => setNested('premium')}>{t('dlg:bottle_pass:premium_rewards')}</Button><span>{t('dlg:bottle_pass:level')}</span><span>{t('dlg:bottle_pass:free_rewards')}</span></div><div className="bottle-pass__levels">{session.pass?.levels.map((l, i) => <div key={i} className={`bottle-pass__level${session.pass && session.pass.points >= l.points ? ' bottle-pass__level--active' : ''}`}><Button variant="ghost" disabled={busy} onClick={() => { setRewards(l.premium); setNested('reward-info'); }}><Rewards assets={assets} rewards={l.premium} /></Button><span>{i + 1}</span><div><Rewards assets={assets} rewards={l.free} /><Button variant="ghost" className="button--confirm" disabled={busy || l.claimed || !session.viewerId || (session.pass?.points ?? 0) < l.points} onClick={() => void act('pass-claim', { level: i, track: 'free' })}>{t(l.claimed ? 'dlg:bottle_pass:reward:collected' : 'dlg:bottle_pass:collect')}</Button></div></div>)}</div>{!session.pass && <div className="source-feature-message">{t('dlg:music:unavailable')}</div>}</div>;
  }
  const closeNested = () => { setNested(null); setSelectedLeague(null); };
  return createPortal(<><SourceFeaturePopup title={title} onClose={onClose} help={() => setNested('help')} inactive={Boolean(nested)} className={feature === 'roulette' ? 'source-roulette-popup' : ''}>{body}{message && <div className="source-feature-message" role="status">{message}</div>}</SourceFeaturePopup>
    {nested === 'help' && <SourceFeaturePopup title={t(feature === 'league' ? 'dlg:league:manual:title' : feature === 'roulette' ? 'roulette:help:header' : 'dlg:bottle_pass_info:title')} onClose={closeNested}>
      {(feature === 'league' ? ['league:help:page1', 'league:help:page2:text1', 'league:help:page2:text2', 'league:help:page2:text3', 'league:help:page2:text4', 'league:help:page2:text5', 'league:help:page2:text6', 'league:help:page3', 'league:help:page4'] : feature === 'roulette' ? ['roulette:help:desc1', 'roulette:help:desc2', 'roulette:help:desc3'] : ['dlg:bottle_pass_info:desc1', 'dlg:bottle_pass_info:desc2', 'dlg:bottle_pass_info:desc3', 'dlg:bottle_pass_info:desc4', 'dlg:bottle_pass_info:desc5', 'dlg:bottle_pass_info:desc6']).map(key => <div key={key} className="source-feature-message"><Text text={t(key)} /></div>)}<div className="popup__buttons"><Button variant="ghost" className="button--confirm" onClick={closeNested}>{t('roulette:help:btn')}</Button></div>
    </SourceFeaturePopup>}
    {nested === 'ladder' && <SourceFeaturePopup title={t('dlg:league:ladder:title')} onClose={closeNested}><div className="league-ladder"><div className="league-ladder__description">{t('dlg:league:ladder:desc')}</div><div className="league-ladder__list">{assets.leagues?.map((l, i) => <Button key={i} variant="ghost" className="league-ladder__item" onClick={() => info(i)}><span className="league-ladder__league"><Image assets={assets} name={l.image} size={50} /><span className="league-ladder__league-title">{t(`dlg:league:${i}`)}</span></span><span className="league-ladder__icon" /></Button>)}</div></div></SourceFeaturePopup>}
    {nested === 'premium' && <SourceFeaturePopup title={t('dlg:bottle_pass:premium_pass')} onClose={closeNested}><div className="source-feature-message"><Text text={t('dlg:bottle_pass_info:desc2')} /></div><div className="popup__buttons"><Button variant="ghost" className="button--confirm" disabled={!session.pass || !session.viewerId || busy || session.pass.premium} onClick={() => void act('pass-buy')}>{t(session.pass?.premium ? 'dlg:premium_pass:purchased' : 'dlg:premium_pass:buy')}</Button></div></SourceFeaturePopup>}
    {(nested === 'reward-info' || nested === 'reward') && <SourceFeaturePopup title={t(nested === 'reward' ? 'dlg:bottle_pass:reward:achieved' : selectedLeague !== null ? `dlg:league:${selectedLeague}` : 'dlg:bottle_pass_reward_info:title')} onClose={() => selectedLeague !== null ? (setSelectedLeague(null), setNested('ladder')) : closeNested()}>
      {selectedLeague !== null && assets.leagues?.[selectedLeague] ? <><Image assets={assets} name={assets.leagues[selectedLeague].image} size={85} /><div className="source-feature-message">{t('dlg:league_reward:desc')}</div><div className="source-feature-rewards">{assets.leagues[selectedLeague].gifts?.map(id => <Image key={id} assets={assets} name={assets.gifts[id]?.storeImage ?? ''} />)}</div></> : <Rewards assets={assets} rewards={rewards} />}
      {nested === 'reward-info' && feature === 'bottle-pass' && <div className="source-feature-message">{t(session.pass?.premium ? 'dlg:bottle_pass:reward:level_block' : 'dlg:bottle_pass:reward:pass_block')}</div>}<div className="popup__buttons"><Button variant="ghost" className="button--confirm" onClick={closeNested}>{t('dlg:navigate_vip:btn')}</Button></div>
    </SourceFeaturePopup>}
  </>, document.body);
}
