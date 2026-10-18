import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { translate, type CilizAssets } from '@/lib/ciliz-assets';
import { executeSourceFeature, useSourceFeatureSession } from '@/lib/source-feature-session';
import { ProfileInfoDialog } from './profile-info-dialog';
import { SourceFeaturePopup } from '@/components/table/source-feature-popup';

export function SourceSettingsChild({ kind, assets, onClose }: { kind: string; assets: CilizAssets; onClose: () => void }) {
  const session = useSourceFeatureSession();
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [inviteUrl, setInviteUrl] = useState('');
  const t = (key: string) => translate(assets, key);
  const act = async (action: 'invite' | 'feedback') => {
    if (busy) return; setBusy(true);
    try { const r = await executeSourceFeature(action); if (r.inviteUrl) setInviteUrl(r.inviteUrl); else if (r.confirmed) onClose(); else setMessage(r.message ?? t('dlg:music:unavailable')); }
    catch (e) { setMessage(e instanceof Error ? e.message : t('dlg:music:unavailable')); } finally { setBusy(false); }
  };
  const title = kind === 'invite' ? t('dlg:invite_friend:title') : kind === 'profile' ? t('dlg:profile_info:title') : t('dlg:settings:contacts');
  if (kind === 'profile') return createPortal(<ProfileInfoDialog assets={assets} onClose={onClose} />, document.body);
  return createPortal(<SourceFeaturePopup title={title} onClose={onClose}>
    {kind === 'invite' ? <div className="invite-friend"><div className="source-feature-message">{t('dlg:invite_friend_teaser:text:v2').replace('<gold/>', '— ♥')}</div>{inviteUrl && <input readOnly aria-label="Davet bağlantısı" value={inviteUrl} />}<div className="popup__buttons"><Button variant="ghost" className="button--confirm" disabled={busy || !session.viewerId} onClick={() => void act('invite')}>{t('dlg:invite_friend:invite')}</Button>{inviteUrl && <Button variant="ghost" onClick={async () => { try { await navigator.clipboard.writeText(inviteUrl); setMessage(t('dlg:invite_friend_qr:toast')); } catch { setMessage(t('dlg:invite_friend_qr:toast2')); } }}>{t('dlg:invite_friend_qr:btn_copy')}</Button>}</div></div> : <div className="settings"><a className="settings__item settings__item--selectable" href={t('dlg:settings:contacts:href')} target="_blank" rel="noopener noreferrer"><span className="settings__icon settings__icon--faq" /><span className="settings__item-name">{t('dlg:settings:faq')}</span></a><Button variant="ghost" className="settings__item settings__item--selectable" disabled={!session.viewerId || busy} onClick={() => void act('feedback')}><span className="settings__icon settings__icon--report" /><span className="settings__item-name">{t('dlg:settings:console_report:menu')}</span></Button></div>}
    {message && <div className="source-feature-message" role="status">{message}</div>}
  </SourceFeaturePopup>, document.body);
}
