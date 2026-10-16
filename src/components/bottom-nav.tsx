// Mobile app style bottom tab bar for the home page; "Oyunlar" is the raised round centre button.
import { useState } from "react";
import { House, Radio, MessageCircle, UserRound } from "lucide-react";
import gamesIcon from "@/assets/nav-games.webp";

export type NavTab = "home" | "live" | "games" | "messages" | "profile";

export function BottomNav({ active = "home", onSelect }: { active?: NavTab; onSelect: (tab: NavTab) => void }) {
  const [tapped, setTapped] = useState<NavTab | null>(null);
  const tap = (t: NavTab) => { setTapped(t); window.setTimeout(() => setTapped(null), 380); onSelect(t); };
  const item = (t: NavTab, label: string, Icon: typeof House) =>
    <button type="button" className={"bn-item" + (active === t ? " on" : "") + (tapped === t ? " tap" : "")} onClick={() => tap(t)} aria-current={active === t ? "page" : undefined}>
      <span className="bn-ico"><Icon size={22} strokeWidth={active === t ? 2.4 : 1.9} /></span><span className="bn-label">{label}</span>
    </button>;
  return <nav className="bn" aria-label="Əsas menyu">
    <style>{BN_STYLES}</style>
    <div className="bn-bar">
      {item("home", "Əsas", House)}
      {item("live", "Canlı", Radio)}
      <button type="button" className={"bn-games" + (tapped === "games" ? " tap" : "")} onClick={() => tap("games")} aria-label="Oyunlar">
        <span className="bn-games-ring"><img src={gamesIcon} alt="" width={64} height={64} /></span>
        <span className="bn-label">Oyunlar</span>
      </button>
      {item("messages", "Mesajlar", MessageCircle)}
      {item("profile", "Profil", UserRound)}
    </div>
  </nav>;
}

const BN_STYLES = `
.bn{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;pointer-events:none;padding:0 10px max(8px,env(safe-area-inset-bottom));}
.bn-bar{pointer-events:auto;position:relative;width:min(100%,500px);height:66px;display:grid;grid-template-columns:1fr 1fr 84px 1fr 1fr;align-items:end;padding:0 6px 7px;border-radius:24px;
  background:color-mix(in oklch,var(--surface) 88%,transparent);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);border:1px solid var(--border);box-shadow:0 10px 30px oklch(.25 .05 165 / .14);}
.bn-item,.bn-games{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--muted-foreground);-webkit-tap-highlight-color:transparent;}
.bn-item:focus-visible,.bn-games:focus-visible{outline:2px solid var(--primary);outline-offset:3px;border-radius:12px;}
.bn-ico{display:grid;place-items:center;width:44px;height:30px;border-radius:15px;transition:background .25s,color .25s,transform .25s;}
.bn-label{font-size:10px;font-weight:650;letter-spacing:0;}
.bn-item.on{color:var(--primary);}
.bn-item.on .bn-ico{background:var(--accent);}
.bn-item.tap .bn-ico{animation:bn-bounce .38s ease;}
.bn-games{position:relative;color:var(--foreground);}
.bn-games-ring{display:block;width:64px;height:64px;margin-top:-34px;border-radius:50%;padding:4px;background:linear-gradient(145deg,var(--gold),var(--heart));box-shadow:0 8px 20px oklch(.55 .2 20 / .35),0 0 0 5px var(--background);animation:bn-float 3.2s ease-in-out infinite;}
.bn-games-ring img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;background:var(--surface);}
.bn-games::before{content:'';position:absolute;top:-34px;left:50%;width:64px;height:64px;margin-left:-32px;border-radius:50%;background:var(--heart);opacity:.35;animation:bn-ping 2.4s ease-out infinite;}
.bn-games.tap .bn-games-ring{animation:bn-spin .45s ease;}
@keyframes bn-bounce{40%{transform:translateY(-4px) scale(1.12);}}
@keyframes bn-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
@keyframes bn-ping{0%{transform:scale(1);opacity:.35;}80%,100%{transform:scale(1.35);opacity:0;}}
@keyframes bn-spin{50%{transform:scale(.88) rotate(-12deg);}100%{transform:scale(1) rotate(0);}}
@media(prefers-reduced-motion:reduce){.bn *,.bn ::before{animation:none!important;}}
`;
