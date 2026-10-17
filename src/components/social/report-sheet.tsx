// Detailed report popup: category + description, sent to the admin panel's report queue.
import { useState } from "react";
import { translate } from "@/lib/app-preferences";
import { reportUser, type ReportCategory } from "@/lib/social";
import { IconCheck, IconClose, IconFlag } from "@/components/ui-icons";

const CATS: { key: ReportCategory; label: string; hint: string }[] = [
  { key: "harassment", label: "Təhqir və ya təqib", hint: "Söyüş, hədə, narahat etmə" },
  { key: "inappropriate", label: "Uyğunsuz məzmun", hint: "Çılpaq, zorakı və ya iyrənc şəkil/mesaj" },
  { key: "spam", label: "Spam", hint: "Reklam, təkrarlanan mesajlar" },
  { key: "scam", label: "Fırıldaq", hint: "Pul, kod və ya şəxsi məlumat istəyir" },
  { key: "fake", label: "Saxta profil", hint: "Başqasının adından, saxta şəkil" },
  { key: "other", label: "Digər", hint: "Başqa səbəb" },
];

export function ReportSheet({ me, target, targetName, context = "chat", onClose }: { me: string; target: string; targetName: string; context?: "chat" | "profile"; onClose: () => void }) {
  const [cat, setCat] = useState<ReportCategory | null>(null);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const submit = async () => {
    if (!cat || busy) return;
    if (cat === "other" && details.trim().length < 5) { setErr(translate("Zəhmət olmasa səbəbi qısaca yaz")); return; }
    setBusy(true); setErr("");
    const ok = await reportUser(me, target, cat, details, context);
    setBusy(false);
    if (ok) setDone(true); else setErr(translate("Şikayət göndərilmədi, yenidən cəhd et"));
  };
  return <div className="rs-wrap" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <style>{RS_STYLES}</style>
    <div className="rs-sheet" role="dialog" aria-modal="true" aria-label={translate("Şikayət et")}>
      <span className="rs-grip" aria-hidden="true" />
      <button type="button" className="rs-x" onClick={onClose} aria-label={translate("Bağla")}><IconClose size={18} /></button>
      {done ? <div className="rs-done">
        <span className="rs-ico ok"><IconCheck size={28} /></span>
        <strong>{translate("Şikayətin göndərildi")}</strong>
        <p>{translate("Moderatorlar şikayətini yoxlayacaq. Təşəkkür edirik!")}</p>
        <button type="button" className="rs-btn" onClick={onClose}>{translate("Bağla")}</button>
      </div> : <>
        <div className="rs-head"><span className="rs-ico"><IconFlag size={22} /></span><div><strong>{translate("Şikayət et")}</strong><small>{targetName}</small></div></div>
        <p className="rs-lead">{translate("Səbəbi seç — şikayət birbaşa adminə göndəriləcək.")}</p>
        <div className="rs-cats" role="radiogroup">
          {CATS.map(c => <button key={c.key} type="button" role="radio" aria-checked={cat === c.key} className={cat === c.key ? "on" : ""} onClick={() => { setCat(c.key); setErr(""); }}>
            <span className="rs-radio" /><span><b>{translate(c.label)}</b><small>{translate(c.hint)}</small></span>
          </button>)}
        </div>
        <label className="rs-field">{translate("Ətraflı izah (istəyə bağlı)")}
          <textarea rows={3} maxLength={1000} value={details} onChange={e => setDetails(e.target.value)} placeholder={translate("Nə baş verdi?")} />
          <small>{details.length}/1000</small>
        </label>
        {err && <p className="rs-err" role="alert">{err}</p>}
        <button type="button" className="rs-btn danger" disabled={!cat || busy} onClick={() => void submit()}>{busy ? "…" : translate("Şikayəti göndər")}</button>
      </>}
    </div>
  </div>;
}

const RS_STYLES = `
.rs-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:oklch(0 0 0 / .5);animation:rs-fade .2s;}
.rs-sheet{position:relative;width:100%;max-width:520px;max-height:92dvh;overflow-y:auto;box-sizing:border-box;padding:10px 18px max(18px,env(safe-area-inset-bottom));border-radius:26px 26px 0 0;background:var(--background);color:var(--foreground);animation:rs-up .3s cubic-bezier(.2,.9,.3,1);}
.rs-grip{display:block;width:40px;height:5px;border-radius:3px;margin:0 auto 12px;background:var(--border);}
.rs-x{all:unset;cursor:pointer;position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--surface);}
.rs-head{display:flex;align-items:center;gap:12px;}
.rs-head div{display:flex;flex-direction:column;}.rs-head strong{font-size:18px;font-weight:850;}.rs-head small{font-size:12px;color:var(--muted-foreground);}
.rs-ico{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:color-mix(in oklch,var(--heart) 15%,transparent);color:var(--heart);flex-shrink:0;}
.rs-ico.ok{background:color-mix(in oklch,var(--primary) 15%,transparent);color:var(--primary);width:60px;height:60px;}
.rs-lead{margin:12px 0 10px;font-size:13px;color:var(--muted-foreground);}
.rs-cats{display:flex;flex-direction:column;gap:8px;}
.rs-cats button{all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;background:var(--surface);border:1.5px solid var(--border);transition:border-color .2s,background .2s;}
.rs-cats button.on{border-color:var(--heart);background:color-mix(in oklch,var(--heart) 8%,var(--surface));}
.rs-cats b{display:block;font-size:14px;}.rs-cats small{display:block;font-size:11.5px;color:var(--muted-foreground);margin-top:1px;}
.rs-radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;box-sizing:border-box;transition:border .2s;}
.rs-cats button.on .rs-radio{border:6px solid var(--heart);}
.rs-field{display:flex;flex-direction:column;gap:6px;margin-top:14px;font-size:12.5px;font-weight:700;}
.rs-field textarea{box-sizing:border-box;width:100%;resize:none;padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:var(--surface);color:var(--foreground);font:inherit;font-size:14px;font-weight:400;outline:none;}
.rs-field textarea:focus{border-color:var(--heart);}
.rs-field small{align-self:flex-end;font-weight:500;color:var(--muted-foreground);font-size:11px;}
.rs-err{margin:8px 0 0;font-size:12.5px;color:var(--heart);font-weight:650;}
.rs-btn{all:unset;box-sizing:border-box;cursor:pointer;width:100%;height:50px;margin-top:14px;display:grid;place-items:center;border-radius:16px;background:var(--surface);font-weight:850;font-size:15px;}
.rs-btn.danger{background:var(--heart);color:var(--primary-foreground);}
.rs-btn:disabled{opacity:.45;cursor:default;}
.rs-done{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:18px 0 4px;}
.rs-done strong{font-size:18px;}.rs-done p{margin:0;font-size:13px;color:var(--muted-foreground);}
@keyframes rs-fade{from{opacity:0;}}
@keyframes rs-up{from{transform:translateY(100%);}}
`;
