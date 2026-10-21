import { entryBadge } from '@/lib/entry-badge';
import { tier } from '@/lib/entry-fx';
import { DEFAULT_APPEARANCE, type PlayerAppearance } from '@/lib/player-appearance';

export function CreatorLabel({ className = '' }: { className?: string }) {
  return <span className={`player-creator ${className}`} aria-label="Creator">Creator</span>;
}

export function PlayerName({ name, appearance = DEFAULT_APPEARANCE, showCreator = true, nameClass = '', presentation = 'default' }: { name: string; appearance?: PlayerAppearance; showCreator?: boolean; nameClass?: string; presentation?: 'default' | 'chat' }) {
  const band = appearance.level > 0 ? tier(appearance.level).i : null;
  return <span className={`player-name-card player-name-card--${presentation}${band !== null ? ` player-name-card--t${band}` : ''}`}>
    {appearance.level > 0 && <img className="player-level-badge" src={entryBadge(appearance.level)} alt={`Səviyyə ${appearance.level}`} />}
    <span className={`${nameClass} player-name-text player-name-text--${appearance.nameStyle}`}>{name}</span>
    {showCreator && appearance.creator && <CreatorLabel />}
  </span>;
}