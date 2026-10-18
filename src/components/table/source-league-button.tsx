import { canOpenLeague } from '@/lib/league';
import { showSourceToast } from '@/components/source-dialogs';
import { Button } from '@/components/ui/button';
import { useSourceFeatureSession } from '@/lib/source-feature-session';
import backgroundUp from '@/assets/ui_btn_bg_up.svg';
import backgroundDown from '@/assets/ui_btn_bg_down.svg';
import cup from '@/assets/ui_btn_league.svg';
import infoBackground from '@/assets/ui_btn_league_info.svg';
import welcomeBackground from '@/assets/ui_btn_league_info_circle.svg';

/** Original LeagueButton states; rank and time strings remain host-owned. */
export function SourceLeagueButton({ onClick }: { onClick: () => void }) {
  const { leagueHeader: info, league, leagueState } = useSourceFeatureSession();
  const running = info?.type === 'running';
  const limit = league?.limit;
  const pill = running ? info.leftTimeShortText?.replaceAll('&nbsp;', '\u00a0') : info?.type === 'finished' ? info.positionText : undefined;
  return <Button variant="ghost" aria-label="Lig" title="Lig" aria-haspopup="dialog" onClick={() => { if (canOpenLeague(leagueState)) onClick(); else showSourceToast("Liglerde yarışmaya başlamak için 100 öpücük almalısınız"); }} className="original-header-button original-icon-default original-league-button">
    <img src={backgroundUp} alt="" className="original-button-background original-button-up" />
    <img src={backgroundDown} alt="" className="original-button-background original-button-down" />
    {running ? <span className="original-league-position">{info.positionText ?? '—'}</span> : <img src={cup} alt="" className="original-button-icon" />}
    {pill && <span className="original-league-info"><img src={infoBackground} alt="" /><span>{pill}</span></span>}
    {info?.type === 'welcome' && <span className="original-league-info original-league-welcome"><img src={welcomeBackground} alt="" /><span>!</span></span>}
    {running && limit && <span className="original-league-info original-league-welcome original-league-limit"><img src={welcomeBackground} alt="" /><span>!</span></span>}
  </Button>;
}
