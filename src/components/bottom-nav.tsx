import { Button } from "@/components/ui/button";
import { translate, usePreferences } from "@/lib/app-preferences";
// Mobile app style bottom tab bar for the home page; "Oyunlar" is the raised round centre button.
import { useState } from "react";
import { IconHome as House, IconLive as Radio, IconChat as MessageCircle, IconUser as UserRound } from "@/components/ui-icons";
import { useSocial } from "@/lib/social";
import gamesIcon from "@/assets/nav-games.webp";

export type NavTab = "home" | "live" | "games" | "messages" | "profile";

export function BottomNav({ active = "home", onSelect }: { active?: NavTab; onSelect: (tab: NavTab) => void }) {
  usePreferences();
  const social = useSocial();
  const unread = Object.values(social.unread ?? {}).reduce((a, b) => a + (b || 0), 0);
  const [tapped, setTapped] = useState<NavTab | null>(null);
  const tap = (t: NavTab) => { setTapped(t); window.setTimeout(() => setTapped(null), 380); onSelect(t); };
  const item = (t: NavTab, label: string, Icon: typeof House) =>
    <Button variant="ghost" type="button" className={"bn-item" + (active === t ? " on" : "") + (tapped === t ? " tap" : "")} onClick={() => tap(t)} aria-current={active === t ? "page" : undefined}>
      <span className="bn-ico"><Icon size={23} strokeWidth={active === t ? 2.3 : 1.8} />{t === "messages" && unread > 0 && <b className="bn-badge">{unread > 99 ? "99+" : unread}</b>}</span><span className="bn-label">{label}</span>
    </Button>;
  return <nav className="bn" aria-label={translate("Əsas menyu")}>
    <style>{BN_STYLES}</style>
    <div className="bn-bar">
      {item("home", translate("Əsas"), House)}
      {item("live", translate("Canlı"), Radio)}
      <Button variant="ghost" type="button" className={"bn-games" + (tapped === "games" ? " tap" : "")} onClick={() => tap("games")} aria-label={translate("Oyunlar")}>
        <span className="bn-games-ring"><img src={gamesIcon} alt="" width={64} height={64} /></span>
        <span className="bn-label">{translate("Oyunlar")}</span>
      </Button>
      {item("messages", translate("Mesajlar"), MessageCircle)}
      {item("profile", translate("Profil"), UserRound)}
    </div>
  </nav>;
}

const BN_STYLES = `
.bn{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;pointer-events:none;}
.bn-bar{pointer-events:auto;position:relative;width:100%;max-width:640px;height:calc(64px + env(safe-area-inset-bottom));box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr 88px 1fr 1fr;align-items:start;padding:8px 8px env(safe-area-inset-bottom);
  background:color-mix(in oklch,var(--surface) 82%,transparent);backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);border-top:1px solid var(--border);box-shadow:0 -8px 30px oklch(.25 .04 260 / .10);}
@media(min-width:641px){.bn{padding-bottom:10px;}.bn-bar{border:1px solid var(--border);border-radius:26px;height:68px;padding-bottom:0;}}
.bn-item,.bn-games{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--muted-foreground);-webkit-tap-highlight-color:transparent;user-select:none;}
.bn-item:focus-visible,.bn-games:focus-visible{outline:2px solid var(--primary);outline-offset:3px;border-radius:12px;}
.bn-ico{position:relative;display:grid;place-items:center;width:52px;height:32px;border-radius:16px;transition:background .25s,color .25s,transform .25s;}
.bn-label{font-size:10.5px;font-weight:650;letter-spacing:.1px;}
.bn-item.on{color:var(--primary);}
.bn-item.on .bn-label{font-weight:800;}
.bn-item.on .bn-ico{background:color-mix(in oklch,var(--primary) 14%,transparent);}
.bn-item.tap .bn-ico{animation:bn-bounce .38s ease;}
.bn-badge{position:absolute;top:-2px;right:6px;min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:9px;background:var(--heart);color:var(--primary-foreground);font-size:10px;font-weight:800;display:grid;place-items:center;border:2px solid var(--surface);}
.bn-games{position:relative;color:var(--foreground);}
.bn-games-ring{display:block;width:62px;height:62px;margin-top:-30px;border-radius:50%;padding:3px;background:linear-gradient(145deg,var(--gold),var(--heart));box-shadow:0 8px 22px oklch(.55 .2 20 / .35),0 0 0 5px var(--background);animation:bn-float 3.2s ease-in-out infinite;}
.bn-games-ring img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;background:var(--surface);}
.bn-games .bn-label{margin-top:2px;}
.bn-games::before{content:'';position:absolute;top:-30px;left:50%;width:62px;height:62px;margin-left:-31px;border-radius:50%;background:var(--heart);opacity:.35;animation:bn-ping 2.4s ease-out infinite;}
.bn-games.tap .bn-games-ring{animation:bn-spin .45s ease;}
@keyframes bn-bounce{40%{transform:translateY(-3px) scale(1.1);}}
@keyframes bn-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
@keyframes bn-ping{0%{transform:scale(1);opacity:.35;}80%,100%{transform:scale(1.35);opacity:0;}}
@keyframes bn-spin{50%{transform:scale(.88) rotate(-12deg);}100%{transform:scale(1) rotate(0);}}
@media(prefers-reduced-motion:reduce){.bn *,.bn ::before{animation:none!important;}}
`;
