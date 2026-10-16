import azFlag from "@/assets/flags/az.svg";
import trFlag from "@/assets/flags/tr.svg";
import ruFlag from "@/assets/flags/ru.svg";
import enFlag from "@/assets/flags/en.svg";
const flags={az:azFlag,tr:trFlag,ru:ruFlag,en:enFlag};
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { languages, setPreferences, usePreferences, useAppTranslation } from '@/lib/app-preferences';
export function AppControls() {
 const {language,theme}=usePreferences(); const t=useAppTranslation(); const [open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(e.target instanceof Node&&!ref.current?.contains(e.target))setOpen(false);};const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};},[open]);
 const selected=languages.find(l=>l.code===language)??{code:"az" as const,name:"Azərbaycan",flag:"🇦🇿"};
 return <div className="app-controls" ref={ref}>
  <Button type="button" variant="ghost" className="app-theme-control" onClick={()=>setPreferences({theme:theme==='dark'?'light':'dark'})} aria-label={t(theme==='dark'?'Gündüz rejimi':'Gecə rejimi')} title={t(theme==='dark'?'Gündüz rejimi':'Gecə rejimi')}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</Button>
  <Button type="button" variant="ghost" ref={trigger} className="app-language-control" aria-label={t('Dil')} aria-expanded={open} aria-controls="app-language-options" onClick={()=>setOpen(v=>!v)}><img src={flags[selected.code]} alt="" width={24} height={16}/><span>{language.toUpperCase()}</span><ChevronDown size={12}/></Button>
  {open&&<div className="app-language-menu" id="app-language-options" role="group" aria-label={t('Dil')}>{languages.map(l=><Button key={l.code} variant="ghost" type="button" lang={l.code} aria-pressed={l.code===language} onClick={()=>{setPreferences({language:l.code});setOpen(false);trigger.current?.focus();}}><img src={flags[l.code]} alt="" width={24} height={16}/><span>{l.name}</span>{l.code===language&&<Check size={16}/>}</Button>)}</div>}
 </div>;
}
