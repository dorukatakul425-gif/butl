import { useState } from "react";
import { Check, Clock, MessageCircle, UserPlus, Users, X } from "lucide-react";
import { translate, usePreferences } from "@/lib/app-preferences";
import { otherParty, removeFriendship, respondFriendRequest, useSocial } from "@/lib/social";

// Profile section: incoming friend requests (accept / decline), sent requests and the friend list.
export function FriendRequests({ me, defaultPhoto, onOpenChat }: { me: string; defaultPhoto: string; onOpenChat: (id: string) => void }) {
  usePreferences();
  const social = useSocial();
  const [busy, setBusy] = useState<string | null>(null);
  const incoming = social.friendships.filter(f => f.status === "pending" && f.addressee_id === me);
  const sent = social.friendships.filter(f => f.status === "pending" && f.requester_id === me);
  const friends = social.friendships.filter(f => f.status === "accepted");
  const act = async (id: string, run: () => Promise<boolean>) => { setBusy(id); await run(); setBusy(null); };
  const who = (id: string) => social.profiles[id];
  return <section className="mp-section fr-box" aria-label={translate("Dostluq istəkləri")}>
    <style>{FR_STYLES}</style>
    <h3><UserPlus size={16} />{translate("Dostluq istəkləri")}{incoming.length > 0 && <span className="fr-count">{incoming.length}</span>}</h3>
    {incoming.length === 0 && <p className="fr-empty">{translate("Yeni istək yoxdur.")}</p>}
    <ul className="fr-list">
      {incoming.map(f => { const p = who(f.requester_id); return <li key={f.id} className="fr-item fr-new">
        <img src={p?.photo_url || defaultPhoto} alt="" />
        <span className="fr-who"><strong>{p?.name ?? "…"}</strong><small>@{p?.username ?? ""}</small></span>
        <button type="button" className="fr-btn fr-yes" disabled={busy === f.id} onClick={() => void act(f.id, () => respondFriendRequest(f.id, true))}><Check size={15} />{translate("Qəbul et")}</button>
        <button type="button" className="fr-btn fr-no" aria-label={translate("Rədd et")} disabled={busy === f.id} onClick={() => void act(f.id, () => respondFriendRequest(f.id, false))}><X size={15} /></button>
      </li>; })}
    </ul>
    {sent.length > 0 && <>
      <h4><Clock size={14} />{translate("Göndərilən istəklər")}</h4>
      <ul className="fr-list">{sent.map(f => { const p = who(f.addressee_id); return <li key={f.id} className="fr-item">
        <img src={p?.photo_url || defaultPhoto} alt="" />
        <span className="fr-who"><strong>{p?.name ?? "…"}</strong><small>{translate("Cavab gözlənilir")}</small></span>
        <button type="button" className="fr-btn fr-no" disabled={busy === f.id} onClick={() => void act(f.id, () => removeFriendship(f.id))}>{translate("Ləğv et")}</button>
      </li>; })}</ul>
    </>}
    <h4><Users size={14} />{translate("Dostlar")} · {friends.length}</h4>
    {friends.length === 0 ? <p className="fr-empty">{translate("Əsas səhifədə “izlə” düyməsi ilə dost əlavə et.")}</p> :
      <div className="fr-friends">{friends.map(f => { const id = otherParty(f, me); const p = who(id); return <button type="button" key={f.id} className="fr-friend" onClick={() => onOpenChat(id)}>
        <span className="fr-friend-photo"><img src={p?.photo_url || defaultPhoto} alt="" />{(social.unread[id] ?? 0) > 0 && <i>{social.unread[id]}</i>}</span>
        <span>{p?.name ?? "…"}</span><MessageCircle size={12} />
      </button>; })}</div>}
  </section>;
}

const FR_STYLES = `
.fr-box h3{display:flex;align-items:center;gap:7px;}
.fr-count{margin-left:auto;min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:var(--heart);color:var(--primary-foreground);font-size:11px;font-weight:800;display:grid;place-items:center;}
.fr-box h4{display:flex;align-items:center;gap:6px;margin:14px 0 6px;font-size:12px;font-weight:700;color:var(--muted-foreground);}
.fr-empty{margin:4px 0;font-size:12px;color:var(--muted-foreground);}
.fr-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}
.fr-item{display:flex;align-items:center;gap:10px;padding:8px;border-radius:14px;background:var(--background);border:1px solid var(--border);}
.fr-item.fr-new{animation:fr-in .35s ease-out both;border-color:color-mix(in oklch,var(--heart) 45%,var(--border));}
.fr-item img{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;}
.fr-who{flex:1;min-width:0;display:flex;flex-direction:column;}
.fr-who strong{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.fr-who small{font-size:11px;color:var(--muted-foreground);}
.fr-btn{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:4px;height:32px;padding:0 12px;border-radius:16px;font-size:12px;font-weight:700;transition:transform .15s;}
.fr-btn:active{transform:scale(.92);}.fr-btn:disabled{opacity:.5;cursor:default;}
.fr-yes{background:var(--primary);color:var(--primary-foreground);}
.fr-no{background:var(--surface);color:var(--muted-foreground);border:1px solid var(--border);padding:0 10px;}
.fr-friends{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
.fr-friend{all:unset;cursor:pointer;flex:0 0 64px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;color:var(--foreground);text-align:center;}
.fr-friend>span:nth-child(2){max-width:64px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.fr-friend svg{color:var(--primary);}
.fr-friend-photo{position:relative;}
.fr-friend-photo img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);}
.fr-friend-photo i{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;border-radius:9px;background:var(--heart);color:var(--primary-foreground);font-size:10px;font-style:normal;font-weight:800;display:grid;place-items:center;border:2px solid var(--surface);}
@keyframes fr-in{from{transform:translateY(6px);opacity:0;}}
`;
