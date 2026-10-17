import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AppControls } from '@/components/app-controls';
import { useAppTranslation, usePreferences } from '@/lib/app-preferences';
import { getProfileStats, loadPublicProfile, MAX_BIO_LENGTH, recordProfileView, saveBio, type ProfileStats, type PublicProfile } from '@/lib/profile-social';
import { refreshProfile } from '@/lib/auth';
import { FriendButton } from '@/components/social/friend-button';
import { useSocial } from '@/lib/social';
import { IconBack, IconCamera, IconCheck, IconClose, IconEye, IconGear, IconGrid, IconInfo, IconLogout, IconPen, IconUsers } from '@/components/ui-icons';

export type MobileProfileData={id?:string;name:string;username:string;player_no:string|number;photo_url?:string|null;age?:number|null;city?:string|null;created_at?:string;bio?:string|null;gold?:number;kisses?:number;dat?:number|null};

function useStats(id: string | undefined) {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const social = useSocial();
  useEffect(() => { if (!id) return; let on = true; void getProfileStats(id).then(s => { if (on) setStats(s); }); return () => { on = false; }; }, [id, social.friendships.length]);
  return stats;
}

function Stats({ stats }: { stats: ProfileStats | null }) {
  const t = useAppTranslation(); const { language } = usePreferences();
  const n = (v: number | undefined) => v == null ? '—' : new Intl.NumberFormat(language, { notation: v >= 10000 ? 'compact' : 'standard' }).format(v);
  return <div className="pf-stats">
    <div><strong>{n(stats?.followers)}</strong><span>{t('İzləyici')}</span></div>
    <div><strong>{n(stats?.following)}</strong><span>{t('İzlənilən')}</span></div>
    <div><strong className="pf-views"><IconEye size={16} />{n(stats?.views)}</strong><span>{t('Baxış')}</span></div>
  </div>;
}

function Details({ p }: { p: { username: string; player_no: string | number | null; age?: number | null; city?: string | null; created_at?: string | null } }) {
  const t = useAppTranslation(); const { language } = usePreferences();
  const d = p.created_at ? new Date(p.created_at) : null;
  const rows: [string, ReactNode][] = [[t('İstifadəçi adı'), `@${p.username}`], [t('Oyunçu nömrəsi'), `#${p.player_no ?? '—'}`], [t('Yaş'), p.age ?? t('Göstərilməyib')], [t('Şəhər'), p.city || t('Göstərilməyib')], [t('Qeydiyyat tarixi'), d && !Number.isNaN(d.valueOf()) ? new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(d) : t('Göstərilməyib')]];
  return <section className="pf-card"><h3><IconInfo size={17} />{t('Şəxsi məlumatlar')}</h3><dl>{rows.map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl></section>;
}

export function MobileProfile({profile:p,defaultPhoto,onBack,onPhoto,uploading,notice,onSignOut,extra}:{profile:MobileProfileData;defaultPhoto:string;onBack:()=>void;onPhoto:(f:File)=>void;uploading:boolean;notice:string;onSignOut:()=>void;onTopUp?:()=>void;extra?:ReactNode}) {
  const t = useAppTranslation();
  const [tab, setTab] = useState<'overview' | 'settings'>('overview');
  const photo = useRef<HTMLInputElement>(null);
  const stats = useStats(p.id);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(p.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { if (!editing) setBio(p.bio ?? ''); }, [p.bio, editing]);
  const save = async () => {
    if (!p.id) return; setSaving(true); setErr('');
    const ok = await saveBio(p.id, bio);
    setSaving(false);
    if (!ok) { setErr(t('Status yadda saxlanılmadı')); return; }
    await refreshProfile(); setEditing(false);
  };
  return <section className="pf-page" aria-label={t('Profil')}>
    <style>{PF_STYLES}</style>
    <header className="pf-bar"><button type="button" className="pf-ic" onClick={onBack} aria-label={t('Geri')}><IconBack size={20} /></button><h1>@{p.username}</h1><button type="button" className={'pf-ic' + (tab === 'settings' ? ' on' : '')} onClick={() => setTab(tab === 'settings' ? 'overview' : 'settings')} aria-label={t('Ayarlar')}><IconGear size={20} /></button></header>
    <div className="pf-cover" aria-hidden="true" />
    <div className="pf-hero">
      <div className="pf-avatar"><img src={p.photo_url || defaultPhoto} alt={p.name} /><button type="button" disabled={uploading} aria-label={t('Şəkli dəyiş')} onClick={() => photo.current?.click()}>{uploading ? <span className="pf-spin" /> : <IconCamera size={16} />}</button></div>
      <h2>{p.name}</h2>
      <p className="pf-handle">@{p.username} · #{p.player_no}</p>
      {editing ? <div className="pf-bio-edit">
        <textarea value={bio} maxLength={MAX_BIO_LENGTH} rows={3} autoFocus onChange={e => setBio(e.target.value)} placeholder={t('Status və ya bio yaz…')} />
        <div><small>{bio.length}/{MAX_BIO_LENGTH}</small><button type="button" className="pf-chip ghost" onClick={() => { setEditing(false); setErr(''); }}><IconClose size={15} />{t('Ləğv et')}</button><button type="button" className="pf-chip" disabled={saving} onClick={() => void save()}><IconCheck size={15} />{saving ? '…' : t('Yadda saxla')}</button></div>
      </div> : <button type="button" className={'pf-bio' + (p.bio ? '' : ' empty')} onClick={() => setEditing(true)}>{p.bio || t('Status əlavə et')}<IconPen size={14} /></button>}
      {err && <p className="pf-err" role="alert">{err}</p>}
    </div>
    <input type="file" accept="image/*" hidden ref={photo} onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onPhoto(f); }} />
    {notice && <p className="pf-err" role="status">{notice}</p>}
    <Stats stats={stats} />
    <div className="pf-seg" role="tablist">
      <button type="button" role="tab" aria-selected={tab === 'overview'} onClick={() => setTab('overview')}><IconGrid size={17} />{t('Ümumi')}</button>
      <button type="button" role="tab" aria-selected={tab === 'settings'} onClick={() => setTab('settings')}><IconGear size={17} />{t('Ayarlar')}</button>
    </div>
    {tab === 'overview' && <>{extra}<Details p={p} /></>}
    {tab === 'settings' && <section className="pf-card"><h3><IconGear size={17} />{t('Ayarlar')}</h3><div className="pf-row"><span>{t('Görünüş')} / {t('Dil')}</span><AppControls /></div><button type="button" className="pf-signout" onClick={onSignOut}><IconLogout size={18} />{t('Çıxış et')}</button></section>}
  </section>;
}

/** Another player's profile: counts a view, shows bio/stats and follow/message actions. */
export function UserProfileView({ me, userId, defaultPhoto, onBack, onMessage }: { me: string; userId: string; defaultPhoto: string; onBack: () => void; onMessage: (id: string) => void }) {
  const t = useAppTranslation();
  const [p, setP] = useState<PublicProfile | null>(null);
  const [missing, setMissing] = useState(false);
  const stats = useStats(userId);
  useEffect(() => {
    let on = true; setP(null); setMissing(false);
    void loadPublicProfile(userId).then(r => { if (!on) return; if (r) setP(r); else setMissing(true); });
    if (userId !== me) void recordProfileView(userId);
    return () => { on = false; };
  }, [userId, me]);
  useEffect(() => { const o = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = o; }; }, []);
  return <section className="pf-page pf-other" role="dialog" aria-modal="true" aria-label={t('Profil')}>
    <style>{PF_STYLES}</style>
    <header className="pf-bar"><button type="button" className="pf-ic" onClick={onBack} aria-label={t('Geri')}><IconBack size={20} /></button><h1>{p ? '@' + p.username : ''}</h1><span className="pf-ic-space" /></header>
    <div className="pf-cover" aria-hidden="true" />
    {missing ? <p className="pf-empty">{t('Profil tapılmadı')}</p> : <>
      <div className="pf-hero">
        <div className="pf-avatar">{p ? <img src={p.photo_url || defaultPhoto} alt={p.name} /> : <span className="pf-skel" />}</div>
        <h2>{p?.name ?? '…'}</h2>
        <p className="pf-handle">{p ? `@${p.username} · #${p.player_no ?? ''}` : ''}</p>
        {p?.bio && <p className="pf-bio static">{p.bio}</p>}
      </div>
      <Stats stats={stats} />
      {userId !== me && <div className="pf-actions"><FriendButton me={me} userId={userId} onMessage={() => onMessage(userId)} /><button type="button" className="pf-chip ghost big" onClick={() => onMessage(userId)}><IconUsers size={17} />{t('Mesaj')}</button></div>}
      {p && <Details p={p} />}
    </>}
  </section>;
}

const PF_STYLES = `
.pf-page{position:fixed;inset:0;z-index:35;overflow-y:auto;overscroll-behavior:contain;background:var(--background);color:var(--foreground);padding:0 0 calc(120px + env(safe-area-inset-bottom));animation:pf-in .3s cubic-bezier(.2,.9,.3,1) both;-webkit-overflow-scrolling:touch;}
.pf-page.pf-other{z-index:70;padding-bottom:max(30px,env(safe-area-inset-bottom));}
.pf-page>*{max-width:520px;margin-left:auto;margin-right:auto;}
.pf-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:10px;padding:max(10px,env(safe-area-inset-top)) 14px 10px;background:color-mix(in oklch,var(--background) 80%,transparent);backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5);}
.pf-bar h1{flex:1;margin:0;text-align:center;font-size:16px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pf-ic,.pf-ic-space{all:unset;cursor:pointer;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--surface);border:1px solid var(--border);color:var(--foreground);flex-shrink:0;transition:transform .15s;}
.pf-ic-space{visibility:hidden;}.pf-ic:active{transform:scale(.9);}.pf-ic.on{color:var(--primary);}
.pf-cover{height:110px;margin-top:-60px!important;border-radius:0 0 28px 28px;background:linear-gradient(135deg,color-mix(in oklch,var(--primary) 70%,var(--background)),color-mix(in oklch,var(--heart) 55%,var(--background)));}
.pf-hero{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 22px;margin-top:-52px!important;}
.pf-avatar{position:relative;width:104px;height:104px;}
.pf-avatar img,.pf-skel{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;border:4px solid var(--background);box-shadow:0 10px 30px oklch(.2 .05 260 / .25);background:var(--surface);}
.pf-avatar button{all:unset;cursor:pointer;position:absolute;right:0;bottom:2px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);border:3px solid var(--background);}
.pf-hero h2{margin:12px 0 2px;font-size:23px;font-weight:850;letter-spacing:-.3px;overflow-wrap:anywhere;}
.pf-handle{margin:0;font-size:13px;color:var(--muted-foreground);}
.pf-bio{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;margin-top:12px;max-width:100%;padding:8px 14px;border-radius:16px;background:var(--surface);border:1px solid var(--border);font-size:14px;line-height:1.4;white-space:pre-wrap;overflow-wrap:anywhere;}
.pf-bio svg{flex-shrink:0;color:var(--muted-foreground);}
.pf-bio.empty{color:var(--primary);font-weight:700;border-style:dashed;}
.pf-bio.static{cursor:default;}
.pf-bio-edit{width:100%;margin-top:12px;}
.pf-bio-edit textarea{box-sizing:border-box;width:100%;resize:none;padding:12px 14px;border-radius:16px;border:1.5px solid var(--primary);background:var(--surface);color:var(--foreground);font:inherit;font-size:14px;outline:none;}
.pf-bio-edit>div{display:flex;align-items:center;gap:8px;margin-top:8px;}.pf-bio-edit small{flex:1;text-align:left;color:var(--muted-foreground);font-size:11px;}
.pf-chip{all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 14px;border-radius:17px;background:var(--primary);color:var(--primary-foreground);font-size:13px;font-weight:750;}
.pf-chip.ghost{background:var(--surface);color:var(--foreground);border:1px solid var(--border);}
.pf-chip.big{height:40px;border-radius:20px;flex:1;}
.pf-chip:disabled{opacity:.6;}
.pf-err{margin:10px 22px 0;text-align:center;font-size:12px;color:var(--heart);font-weight:650;}
.pf-stats{display:grid;grid-template-columns:repeat(3,1fr);margin:20px 16px 0!important;padding:14px 4px;border-radius:20px;background:var(--surface);border:1px solid var(--border);}
.pf-stats>div{display:flex;flex-direction:column;align-items:center;gap:3px;}
.pf-stats>div+div{border-left:1px solid var(--border);}
.pf-stats strong{display:inline-flex;align-items:center;gap:5px;font-size:20px;font-weight:850;font-variant-numeric:tabular-nums;}
.pf-views svg{color:var(--primary);}
.pf-stats span{font-size:11.5px;color:var(--muted-foreground);font-weight:600;}
.pf-actions{display:flex;gap:10px;margin:16px 16px 0!important;}
.pf-actions .mh-follow{flex:1;height:40px;border-radius:20px;font-size:14px;font-weight:800;border:0;cursor:pointer;background:var(--primary);color:var(--primary-foreground);}
.pf-seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin:20px 16px 0!important;padding:4px;border-radius:16px;background:var(--surface);border:1px solid var(--border);}
.pf-seg button{all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;height:38px;border-radius:12px;font-size:13px;font-weight:700;color:var(--muted-foreground);transition:background .2s,color .2s;}
.pf-seg button[aria-selected=true]{background:var(--background);color:var(--foreground);box-shadow:0 2px 8px oklch(.2 .02 260 / .12);}
.pf-card{margin:16px 16px 0!important;padding:16px;border-radius:20px;background:var(--surface);border:1px solid var(--border);}
.pf-card h3{display:flex;align-items:center;gap:8px;margin:0 0 6px;font-size:14px;font-weight:800;}.pf-card h3 svg{color:var(--primary);}
.pf-card dl{margin:0;}.pf-card dl>div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;font-size:13px;}.pf-card dl>div+div{border-top:1px solid var(--border);}
.pf-card dt{color:var(--muted-foreground);}.pf-card dd{margin:0;text-align:right;font-weight:650;overflow-wrap:anywhere;}
.pf-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;font-size:13px;}
.pf-signout{all:unset;cursor:pointer;display:flex;align-items:center;gap:8px;margin-top:8px;padding:12px 0;color:var(--heart);font-weight:750;font-size:14px;}
.pf-page .fr-root,.pf-page>section:not(.pf-card){margin-left:16px;margin-right:16px;}
.pf-empty{text-align:center;color:var(--muted-foreground);padding:60px 20px;}
.pf-spin{width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:pf-rot .7s linear infinite;}
@keyframes pf-in{from{transform:translateY(16px);opacity:0;}}
@keyframes pf-rot{to{transform:rotate(360deg);}}
@media(prefers-reduced-motion:reduce){.pf-page{animation:none;}}
`;
