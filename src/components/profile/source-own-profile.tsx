import { Fragment, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SourceFeaturePopup } from '@/components/table/source-feature-popup';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';
import { useSourceFeatureSession } from '@/lib/source-feature-session';
import { ProfileInfoDialog } from '@/components/settings/profile-info-dialog';

/** Source league index of "Demir Lig" (wood, rock, iron…) that unlocks the profile frame. */
export const IRON_LEAGUE_INDEX = 2;

/** Renders source <b> markup safely, dropping any other tags. */
export function sourceRich(text: string): ReactNode {
  return text.split(/(<b>.*?<\/b>)/g).map((part, i) => {
    const bold = /^<b>(.*)<\/b>$/.exec(part);
    return <Fragment key={i}>{bold ? <b>{bold[1]}</b> : part.replace(/<[^>]+>/g, '')}</Fragment>;
  });
}

export function useFrameUnlocked() {
  const session = useSourceFeatureSession();
  return (session.league?.level ?? -1) >= IRON_LEAGUE_INDEX;
}

/** Original locked-feature popup ("Gerektirir" + reason + "Davam et"). */
export function SourceLockedPopup({ assets, title, desc, onClose }: { assets: CilizAssets; title: string; desc: string; onClose: () => void }) {
  const t = (k: string) => translate(assets, k);
  return <SourceFeaturePopup title={title} onClose={onClose} className="source-profile-locked">
    <div className="source-profile-locked__icon" aria-hidden />
    <p className="source-profile-locked__desc">{sourceRich(desc)}</p>
    <div className="popup__buttons popup__buttons--center"><Button className="button--confirm" onClick={onClose}>{t('dlg:league_locked_gift:btn')}</Button></div>
  </SourceFeaturePopup>;
}

/** Both own-photo and table settings open the same original Telegram edit dialog. */
export function SourceProfileSettings({ assets, onClose }: { assets: CilizAssets; name: string; photo: string; onClose: () => void }) {
  return <ProfileInfoDialog assets={assets} onClose={onClose} />;
}
