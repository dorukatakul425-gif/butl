import { useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, Camera, Heart, Coins, UserRound, Wallet, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppControls } from '@/components/app-controls';
import { useAppTranslation, usePreferences } from '@/lib/app-preferences';
export type MobileProfileData={name:string;username:string;player_no:string|number;photo_url?:string|null;age?:number|null;city?:string|null;created_at?:string;gold:number;kisses:number;dat?:number|null};
export function MobileProfile({profile:p,defaultPhoto,onBack,onPhoto,uploading,notice,onSignOut,onTopUp,extra}:{profile:MobileProfileData;defaultPhoto:string;onBack:()=>void;onPhoto:(f:File)=>void;uploading:boolean;notice:string;onSignOut:()=>void;onTopUp:()=>void;extra?:ReactNode}) {
 const t=useAppTranslation();const {language}=usePreferences();const [section,setSection]=useState<'overview'|'wallet'|'settings'>('overview');const photo=useRef<HTMLInputElement>(null);
 const value=(n:number|null|undefined)=>n==null?'—':new Intl.NumberFormat(language).format(n);
 const date=p.created_at?new Date(p.created_at):null;
 return <section className="mp-page" aria-label={t('Profil')}>
 <header className="mp-header"><Button variant="ghost" className="mp-back" onClick={onBack} aria-label={t('Geri')}><ArrowLeft size={20}/></Button><h1>{t('Profil')}</h1><AppControls/></header>
 <div className="mp-identity"><div className="mp-photo"><img src={p.photo_url||defaultPhoto} alt={p.name}/><Button variant="ghost" disabled={uploading} aria-label={t('Şəkli dəyiş')} onClick={()=>photo.current?.click()}><Camera size={17}/></Button></div><h2>{p.name}</h2><p>@{p.username}</p><span className="mp-player">{t('Oyunçu nömrəsi')} · #{p.player_no}</span></div>
 <input type="file" accept="image/*" hidden ref={photo} onChange={e=>{const f=e.target.files?.[0];e.target.value='';if(f)onPhoto(f);}}/>
 {notice&&<p className="mh-notice" role="status">{notice}</p>}
 <div className="mp-stats"><div><Heart size={18}/><strong>{value(p.kisses)}</strong><span>{t('Öpüşlər')}</span></div><div><Coins size={18}/><strong>{value(p.gold)}</strong><span>{t('Qızıl')}</span></div><div><Wallet size={18}/><strong>{value(p.dat)}</strong><span>DAT</span></div></div>
 <div className="mp-tabs" role="group" aria-label={t('Profil')}>{(['overview','wallet','settings'] as const).map((key,i)=><Button variant="ghost" key={key} aria-pressed={section===key} onClick={()=>setSection(key)}>{t(['Ümumi','Cüzdan','Ayarlar'][i] ?? 'Ümumi')}</Button>)}</div>
 {section==='overview'&&extra}
 {section==='overview'&&<section className="mp-section"><h3><UserRound size={16}/>{t('Şəxsi məlumatlar')}</h3><dl>{[[t('İstifadəçi adı'),`@${p.username}`],[t('Oyunçu nömrəsi'),`#${p.player_no}`],[t('Yaş'),p.age??t('Göstərilməyib')],[t('Şəhər'),p.city||t('Göstərilməyib')],[t('Qeydiyyat tarixi'),date&&!Number.isNaN(date.valueOf())?new Intl.DateTimeFormat(language,{dateStyle:'medium'}).format(date):t('Göstərilməyib')]].map(([label,v])=><div key={label}><dt>{label}</dt><dd>{v}</dd></div>)}</dl></section>}
 {section==='wallet'&&<section className="mp-section"><h3><Wallet size={16}/>{t('Cüzdan')}</h3><div className="mp-balance"><span>{t('DAT balansı')}</span><strong>{value(p.dat)} <small>DAT</small></strong><Button onClick={onTopUp}>{t('Balansı artır')}<ChevronRight size={16}/></Button></div></section>}
 {section==='settings'&&<section className="mp-section"><h3><Settings size={16}/>{t('Ayarlar')}</h3><div className="mp-setting"><span>{t('Görünüş')} / {t('Dil')}</span><AppControls/></div><Button variant="ghost" className="mp-signout" onClick={onSignOut}><LogOut size={18}/>{t('Çıxış et')}</Button></section>}
 </section>;
}
