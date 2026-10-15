import type { ChatUser } from './music-session';

export interface VerifiedHaremPurchase { id: string; viewerId: string; price: number; target: ChatUser; newOwner: ChatUser; oldOwner: ChatUser }
/** HaremPurchasePresenter.show: the purchaser sees no inbox dialog. */
export function haremNotice(p: VerifiedHaremPurchase) {
  if (p.newOwner.id === p.viewerId) return null;
  if (p.target.id === p.viewerId) return {
    user: p.newOwner, key: p.oldOwner.id === p.viewerId ? 'dlg:harem:new:viewer:viewer' : 'dlg:harem:new:viewer:old',
    args: [p.newOwner.name, String(p.newOwner.male), p.oldOwner.name],
  };
  if (p.oldOwner.id === p.viewerId) return {
    user: p.target, key: p.target.id === p.newOwner.id ? 'dlg:harem:target:target:viewer' : 'dlg:harem:new:target:viewer',
    args: p.target.id === p.newOwner.id ? [p.target.name, String(p.target.male)] : [p.newOwner.name, String(p.newOwner.male), p.target.name],
  };
  return null;
}