import { useState } from "react";
import { translate, usePreferences } from "@/lib/app-preferences";
import { friendStateFor, requestNotifyPermission, respondFriendRequest, sendFriendRequest, useSocial, unlockSocialAudio } from "@/lib/social";

// "izlə" on the home users row: sends a friend request, then reflects the live friendship state.
export function FriendButton({ me, userId, onMessage }: { me: string; userId: string; onMessage: () => void }) {
  usePreferences();
  const social = useSocial();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const st = friendStateFor(me, userId, social.friendships);
  const pending = social.friendships.find(f => f.requester_id === userId && f.addressee_id === me && f.status === "pending");
  const label = failed ? translate("Yenidən") : st === "friends" ? translate("Mesaj") : st === "sent" ? translate("Göndərildi") : st === "received" ? translate("Qəbul et") : translate("izlə");
  const click = async () => {
    unlockSocialAudio();
    if (st === "friends") { onMessage(); return; }
    if (st === "sent" || busy) return;
    requestNotifyPermission();
    setBusy(true);
    setFailed(false);
    const ok = st === "received" && pending ? await respondFriendRequest(pending.id, true) : (await sendFriendRequest(userId)).ok;
    setBusy(false);
    if (!ok) setFailed(true);
  };
  return <>
    <style>{FB_STYLES}</style>
    <button type="button" className={"mh-follow fb-" + st + (busy ? " fb-busy" : "")} disabled={st === "sent"} aria-busy={busy} onClick={() => void click()}>{busy ? "…" : label}</button>
  </>;
}

const FB_STYLES = `
.mh-follow{transition:transform .15s ease,background .25s,color .25s;}
.mh-follow:active{transform:scale(.92);}
.mh-follow.fb-sent{background:var(--surface);color:var(--muted-foreground);border:1px solid var(--border);cursor:default;}
.mh-follow.fb-received{background:var(--heart);color:var(--primary-foreground);animation:fb-pulse 1.6s infinite;}
.mh-follow.fb-friends{background:var(--accent);color:var(--primary);}
.mh-follow.fb-busy{opacity:.7;}
@keyframes fb-pulse{50%{transform:scale(1.06);}}
@media(prefers-reduced-motion:reduce){.mh-follow{animation:none!important;}}
`;
