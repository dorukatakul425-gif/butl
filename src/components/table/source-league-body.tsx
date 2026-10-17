import { Button } from '@/components/ui/button';
import { dialogImage, translate, type CilizAssets } from '@/lib/ciliz-assets';
import { splitLeague } from '@/lib/league';
import type { SourceFeatureSnapshot } from '@/lib/source-feature-session';
import { DEFAULT_PHOTO } from '@/lib/ciliz-default-photo';

type League = NonNullable<SourceFeatureSnapshot['league']>;

function Img({ assets, name, size }: { assets: CilizAssets; name: string; size: number }) {
  if (!assets.images[name]) return null;
  const image = dialogImage(assets, name, size, size);
  return <img src={image.src} width={size} height={size} alt="" />;
}

/** Port of LeagueDialog.tsx: info header, then up / stay / down sections with labels. */
export function SourceLeagueBody({ assets, league, viewerId, onLadder, onPrize, onLimit, onClaim }: {
  assets: CilizAssets; league: League; viewerId: string | null;
  onLadder: () => void; onPrize: (pos: number) => void; onLimit: () => void; onClaim: () => void;
}) {
  const t = (key: string, ...args: string[]) => translate(assets, key, ...args);
  const finished = league.state === 'finished';
  const usersMax = league.usersMax ?? 20, moveUp = league.moveUp ?? 3, moveDown = league.moveDown ?? 3;
  const rows = league.players.map((p, i) => ({ ...p, pos: i + 1 }));
  const parts = splitLeague(rows, moveUp, moveDown, usersMax);
  const entry = assets.leagues?.[league.level];
  const limit = !finished && league.limit ? 'limited' : undefined;
  const user = (u: (typeof rows)[number]) => {
    const viewer = u.id === viewerId;
    // Presents: 1-3 special gift chests for the promoted places, regular gift for the rest.
    const present = u.pos <= moveUp && u.pos < 4 ? String(u.pos) : 'regular';
    return <div className="league__user" key={u.id}>
      <div className="league__photo" style={{ backgroundImage: `url(${u.photo || DEFAULT_PHOTO})`, backgroundSize: 'cover', backgroundPosition: 'center top' }} onClick={() => window.dispatchEvent(new CustomEvent('source:open-profile', { detail: u.id }))} />
      <div className={`league__user-info${viewer ? ' league__user-info--viewer' : ''}`}>
        <div className="league__name"><span className="league__position">{u.pos}.</span>{u.name}</div>
        <div className="league__stats">
          <div className="league__stars">
            <div className={`league__stars-icon${viewer && limit ? ' league__stars-icon--enabled' : ''}`} onClick={viewer && limit ? onLimit : undefined}>{viewer && limit ? '!' : ''}</div>
            <div className="league__stars-count">{u.score}</div>
          </div>
          <div className={`league__present league__present--${present}`} onClick={() => onPrize(u.pos)}><div className={`league__present-icon league__present-icon--${present}`} /></div>
        </div>
      </div>
    </div>;
  };
  return <div className="league">
    <div className="league__section league__section--up">
      <div className="league__header"><div className="league__info">
        <div className={`league__info-title${finished ? ' league__info-title--no-boosters' : ''}`}>
          <div className="league__description">{finished ? t('dlg:league_finish:desc') : t('dlg:league:desc:boosters')}</div>
        </div>
        <Button variant="ghost" className={`league__cup-bg league__cup-bg--${finished ? 'finish' : 'altar'}${finished ? '' : ' league__cup-bg--enabled'}`} aria-label={t('dlg:league:ladder:title')} onClick={finished ? undefined : onLadder}>
          <Img assets={assets} name={entry?.image ?? ''} size={84} />{!finished && <span className="league__ladder-icon" />}
        </Button>
      </div></div>
      <div className="league__list">{parts.up.length > 0 && <>{parts.up.map(user)}<div className="league__label league__label--move">{t('dlg:league:desc:up')}</div></>}</div>
    </div>
    <div className="league__section"><div className="league__list">{parts.stay.length > 0 && <><div className="league__label league__label--stay">{t('dlg:league:desc:stay')}</div>{parts.stay.map(user)}<div className="league__label league__label--stay">{t('dlg:league:desc:stay')}</div></>}</div></div>
    <div className="league__section league__section--down"><div className="league__list">{parts.down.length > 0 && <><div className="league__label league__label--move">{t('dlg:league:desc:down')}</div>{parts.down.map(user)}</>}</div></div>
    {finished && <div className="popup__buttons">
      <div className="source-feature-message">{t('dlg:league:desc:prize_finish', String(league.finalPos ?? '—'))}</div>
      <div className="source-feature-rewards">
        {(league.rewardGifts ?? []).map(id => <Img key={id} assets={assets} name={assets.gifts[id]?.storeImage ?? ''} size={60} />)}
        {league.rewardGold ? <span className="source-feature-reward"><span aria-hidden className="roulette__heart" />{league.rewardGold}</span> : null}
      </div>
      <Button variant="ghost" className="button button--confirm" onClick={onClaim}>{t('dlg:league:manual:btn')}</Button>
    </div>}
  </div>;
}
