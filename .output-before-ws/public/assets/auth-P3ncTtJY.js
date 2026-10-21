import{i as e,t}from"./react-SIfiwpqq.js";import{t as n}from"./jsx-runtime-0vZSBttN.js";import{a as r,o as i}from"./app-preferences-BPX9y193.js";import{t as a}from"./useNavigate-C_Xk6FgP.js";import{i as o,n as s,t as c}from"./supabase-Dbz9wWdx.js";import{i as l,n as u}from"./auth-AOzKVTZZ.js";import{a as d,t as f}from"./ban-hYKTBtNK.js";import{n as p,r as m,t as h}from"./app-controls-DJdRMEvE.js";import{t as g}from"./createLucideIcon-cPwvoQem.js";import{t as _}from"./button-Ca8fgZo-.js";import{t as v}from"./input-Bn9aSf2E.js";var y=g(`arrow-right`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]),b=g(`circle-alert`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`,key:`1pkeuh`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`,key:`4dfq90`}]]),x=g(`eye-off`,[[`path`,{d:`M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`,key:`ct8e1f`}],[`path`,{d:`M14.084 14.158a3 3 0 0 1-4.242-4.242`,key:`151rxh`}],[`path`,{d:`M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`,key:`13bj9a`}],[`path`,{d:`m2 2 20 20`,key:`1ooewy`}]]),S=g(`eye`,[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,key:`1nclc0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]),C=g(`lock-keyhole`,[[`circle`,{cx:`12`,cy:`16`,r:`1`,key:`1au0dj`}],[`rect`,{x:`3`,y:`10`,width:`18`,height:`12`,rx:`2`,key:`6s8ecr`}],[`path`,{d:`M7 10V7a5 5 0 0 1 10 0v3`,key:`1pqi11`}]]),w=g(`shield-check`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),T=e(t()),E=`/assets/auth-logo-C3zqRrgr.png`,D=n();function O(){return(0,D.jsxs)(`svg`,{viewBox:`0 0 32 32`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.4`,strokeLinecap:`round`,"aria-hidden":`true`,children:[(0,D.jsx)(`path`,{d:`M9.5 9.5a9.2 9.2 0 0 0 0 13`}),(0,D.jsx)(`path`,{d:`M22.5 9.5a9.2 9.2 0 0 1 0 13`}),(0,D.jsx)(`path`,{d:`M5.2 5.2a15.3 15.3 0 0 0 0 21.6`,opacity:`0.55`}),(0,D.jsx)(`path`,{d:`M26.8 5.2a15.3 15.3 0 0 1 0 21.6`,opacity:`0.55`}),(0,D.jsx)(`circle`,{className:`auth-live-dot`,cx:`16`,cy:`16`,r:`4`,stroke:`none`})]})}var k=`
.butl-auth {
  --auth-bg: oklch(0.2 0.045 20);
  --auth-bg-2: oklch(0.13 0.03 15);
  --auth-glow-1: oklch(0.62 0.21 25 / 0.45);
  --auth-glow-2: oklch(0.7 0.17 145 / 0.3);
  --auth-highlight: oklch(0.86 0.13 75);
  --auth-headline: linear-gradient(100deg, oklch(0.97 0.02 80) 0%, oklch(0.88 0.12 70) 60%, oklch(0.8 0.16 40) 100%);
  --auth-text: oklch(0.98 0.005 60);
  --auth-muted: oklch(0.78 0.02 40);
  --auth-sheet: oklch(0.22 0.03 20 / 0.72);
  --auth-surface: oklch(1 0 0 / 0.07);
  --auth-surface-2: oklch(1 0 0 / 0.12);
  --auth-border: oklch(1 0 0 / 0.13);
  --auth-brand: oklch(0.66 0.21 25);
  --auth-brand-2: oklch(0.58 0.22 15);
  --auth-brand-grad: linear-gradient(135deg, oklch(0.72 0.19 35) 0%, oklch(0.6 0.23 20) 100%);
  --auth-ink: oklch(0.99 0 0);
  --auth-live: oklch(0.64 0.24 25);
  --auth-error: oklch(0.85 0.1 25);
  --auth-error-bg: oklch(0.4 0.12 25 / 0.35);
  --auth-shadow: 0 18px 50px oklch(0.05 0.02 20 / 0.55);
  --auth-btn-shadow: 0 10px 28px oklch(0.6 0.22 25 / 0.45);
  --background: var(--auth-bg);
  --foreground: var(--auth-text);
  --primary: var(--auth-brand);
  --primary-foreground: var(--auth-ink);
  --muted-foreground: var(--auth-muted);
  --accent: var(--auth-surface);
  --accent-foreground: var(--auth-text);
  --input: var(--auth-border);
  --ring: var(--auth-brand);
  --auth-font: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  box-sizing: border-box; width: 100%; min-height: 100svh; min-height: 100dvh;
  position: relative;
  background:
    radial-gradient(120% 60% at 0% 0%, var(--auth-glow-1), transparent 60%),
    radial-gradient(90% 50% at 100% 100%, var(--auth-glow-2), transparent 60%),
    linear-gradient(180deg, var(--auth-bg) 0%, var(--auth-bg-2) 100%);
  color: var(--auth-text); font-family: var(--auth-font);
  letter-spacing: 0; overflow-x: clip; isolation: isolate;
  display: flex; flex-direction: column; align-items: center;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  -webkit-text-size-adjust: 100%;
}
.butl-auth *, .butl-auth *::before, .butl-auth *::after { box-sizing: border-box; letter-spacing: 0; }
.butl-auth .auth-top { width: 100%; max-width: 440px; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; }
.butl-auth .auth-wordmark { margin: 0; font-size: 20px; line-height: 1.3; font-weight: 800; white-space: nowrap; }
.butl-auth .auth-wordmark span { color: var(--auth-highlight); font-weight: 600; }
.butl-auth .auth-content { width: 100%; min-width: 0; max-width: 440px; margin: auto 0; padding: 20px 0; }
.butl-auth .auth-intro { text-align: center; margin-bottom: 22px; }
.butl-auth .auth-brand-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin: 0 auto 18px; }
.butl-auth .auth-mark { width: 96px; height: 96px; object-fit: cover; display: block; border-radius: 26px; box-shadow: var(--auth-shadow), 0 0 0 3px oklch(1 0 0 / 0.12); animation: auth-float 4s ease-in-out infinite; }
.butl-auth .auth-live { position: relative; width: 64px; height: 64px; border-radius: 20px; display: grid; place-items: center; background: var(--auth-surface-2); border: 1px solid var(--auth-border); box-shadow: var(--auth-shadow); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.butl-auth .auth-live svg { width: 34px; height: 34px; color: var(--auth-text); }
.butl-auth .auth-live-dot { fill: var(--auth-live); transform-origin: center; animation: auth-pulse 1.4s ease-in-out infinite; }
.butl-auth .auth-live-label { position: absolute; bottom: -9px; left: 50%; transform: translateX(-50%); padding: 2px 7px; border-radius: 999px; background: var(--auth-live); color: var(--auth-ink); font-size: 9px; font-weight: 800; line-height: 1.4; text-transform: uppercase; white-space: nowrap; box-shadow: 0 4px 12px oklch(0.6 0.24 25 / 0.5); }
.butl-auth h1 { font-size: 26px; line-height: 1.25; font-weight: 800; margin: 0 0 8px; overflow-wrap: break-word; text-wrap: balance; color: var(--auth-highlight); }
@supports (background-clip: text) { .butl-auth h1 { background: var(--auth-headline); background-clip: text; -webkit-background-clip: text; color: transparent; } }
.butl-auth .auth-subtitle { margin: 0; font-size: 14px; line-height: 1.55; color: var(--auth-muted); }
.butl-auth .auth-sheet { background: var(--auth-sheet); border: 1px solid var(--auth-border); border-radius: 28px; padding: 18px; box-shadow: var(--auth-shadow); backdrop-filter: blur(18px) saturate(140%); -webkit-backdrop-filter: blur(18px) saturate(140%); }
.butl-auth .auth-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 5px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 999px; margin-bottom: 20px; }
.butl-auth .auth-tab { border: 0; height: 42px; min-width: 0; border-radius: 999px; background: transparent; color: var(--auth-muted); font-size: 14px; font-weight: 700; box-shadow: none; white-space: normal; transition: background .2s, color .2s; }
.butl-auth .auth-tab:hover { background: var(--auth-surface); color: var(--auth-text); }
.butl-auth .auth-tab[aria-pressed="true"] { background: var(--auth-brand-grad); color: var(--auth-ink); box-shadow: var(--auth-btn-shadow); }
.butl-auth .auth-form { display: grid; gap: 14px; }
.butl-auth .auth-field { display: grid; gap: 7px; min-width: 0; }
.butl-auth .auth-label { color: var(--auth-muted); font-size: 12px; font-weight: 700; line-height: 1.4; padding-left: 4px; }
.butl-auth .auth-input-wrap { position: relative; min-width: 0; }
.butl-auth .auth-input { width: 100%; height: 54px; background: var(--auth-surface); border: 1px solid var(--auth-border); border-radius: 16px; color: var(--auth-text); font-family: inherit; font-size: 16px; line-height: 1.4; padding: 0 16px; box-shadow: none; transition: border-color .2s, background .2s; }
.butl-auth .auth-input:focus { background: var(--auth-surface-2); border-color: var(--auth-brand); }
.butl-auth .auth-input.with-icon { padding-left: 48px; }
.butl-auth .auth-input.password { padding-right: 54px; }
.butl-auth .auth-input::placeholder { color: var(--auth-muted); opacity: 0.7; }
.butl-auth .auth-input:focus-visible { outline: none; box-shadow: 0 0 0 4px oklch(0.66 0.21 25 / 0.25); }
.butl-auth .auth-field-icon { position: absolute; left: 17px; top: 18px; width: 18px; height: 18px; color: var(--auth-muted); pointer-events: none; }
.butl-auth .auth-eye { border: 0; position: absolute; right: 5px; top: 5px; width: 44px; height: 44px; padding: 0; border-radius: 12px; background: transparent; color: var(--auth-muted); box-shadow: none; }
.butl-auth .auth-eye:hover { color: var(--auth-text); background: var(--auth-surface); }
.butl-auth .auth-eye svg { width: 19px; height: 19px; }
.butl-auth .auth-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 12px; }
.butl-auth .auth-gender { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.butl-auth .auth-gender-button { min-width: 0; height: 54px; padding: 0 8px; border: 1px solid var(--auth-border); background: var(--auth-surface); color: var(--auth-muted); border-radius: 16px; box-shadow: none; font-size: 14px; font-weight: 700; }
.butl-auth .auth-gender-button:hover { background: var(--auth-surface-2); color: var(--auth-text); }
.butl-auth .auth-gender-button[aria-pressed="true"] { border-color: var(--auth-brand); color: var(--auth-text); background: oklch(0.66 0.21 25 / 0.22); }
.butl-auth .auth-submit { width: 100%; min-height: 56px; height: auto; padding: 15px 20px; display: grid; grid-template-columns: 20px minmax(0, 1fr) 20px; gap: 10px; background: var(--auth-brand-grad); color: var(--auth-ink); border: 0; border-radius: 18px; font-size: 16px; font-weight: 800; box-shadow: var(--auth-btn-shadow); white-space: normal; margin-top: 6px; transition: transform .15s, filter .2s; }
.butl-auth .auth-submit:hover { filter: brightness(1.07); }
.butl-auth .auth-submit:active { transform: scale(0.98); }
.butl-auth .auth-submit svg { width: 20px; height: 20px; }
.butl-auth .auth-submit:disabled { opacity: 0.6; }
.butl-auth .auth-error { display: grid; grid-template-columns: 18px minmax(0, 1fr); align-items: start; gap: 10px; padding: 12px; border-radius: 14px; background: var(--auth-error-bg); color: var(--auth-error); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.butl-auth .auth-error svg { width: 18px; height: 18px; margin-top: 1px; }
.butl-auth .auth-switch { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; margin: 12px 0 0; font-size: 13px; line-height: 1.5; color: var(--auth-muted); }
.butl-auth .auth-switch-button { border: 0; background: transparent; min-height: 44px; height: auto; padding: 8px 4px; color: var(--auth-highlight); font-size: 13px; font-weight: 700; white-space: normal; }
.butl-auth .auth-footer { max-width: 440px; flex-wrap: wrap; display: flex; align-items: center; justify-content: center; gap: 7px; color: var(--auth-muted); font-size: 11px; line-height: 1.5; text-align: center; width: 100%; }
.butl-auth .auth-footer-brand { flex-basis: 100%; margin: 0 0 6px; font-size: 12px; line-height: 1.6; color: var(--auth-muted); }
.butl-auth .auth-footer-brand strong { color: var(--auth-highlight); font-weight: 700; }
.butl-auth .auth-footer svg { width: 14px; height: 14px; flex-shrink: 0; }
.butl-auth .auth-spin { animation: auth-spin 0.8s linear infinite; }
@keyframes auth-spin { to { transform: rotate(360deg); } }
@keyframes auth-float { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
@keyframes auth-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.8); } }
@media (min-width: 640px) { .butl-auth { padding: 28px 40px; } .butl-auth .auth-sheet { padding: 24px; } }
@media (max-height: 720px) { .butl-auth .auth-content { padding: 12px 0; } .butl-auth .auth-mark { width: 72px; height: 72px; border-radius: 20px; } .butl-auth .auth-live { width: 52px; height: 52px; border-radius: 16px; } .butl-auth .auth-intro { margin-bottom: 14px; } .butl-auth .auth-form { gap: 10px; } .butl-auth h1 { font-size: 22px; } }
@media (prefers-reduced-motion: reduce) { .butl-auth *, .butl-auth *::before, .butl-auth *::after { animation: none !important; transition: none !important; } }
`;function A(){let e=i(),t=r(),n=l(),g=a(),[A,j]=(0,T.useState)(`login`),[M,N]=(0,T.useState)(``),[P,F]=(0,T.useState)(``),[I,L]=(0,T.useState)(``),[R,z]=(0,T.useState)(``),[B,V]=(0,T.useState)(!0),[H,U]=(0,T.useState)(!1),[W,G]=(0,T.useState)(``),[K,q]=(0,T.useState)(!1),J=A===`login`,Y=n.ready&&!n.configured;(0,T.useEffect)(()=>{n.ready&&n.session&&n.profile&&g({to:`/`})},[n.ready,n.session,n.profile,g]);let X=e=>{H||e===A||(j(e),G(``),q(!1))};return(0,D.jsxs)(`main`,{className:`butl-auth`,lang:e.language,children:[(0,D.jsx)(`style`,{children:k}),(0,D.jsxs)(`header`,{className:`auth-top`,children:[(0,D.jsxs)(`p`,{className:`auth-wordmark`,children:[`Deltagame`,(0,D.jsx)(`span`,{children:`.az`})]}),(0,D.jsx)(h,{})]}),(0,D.jsxs)(`section`,{className:`auth-content`,"aria-labelledby":`auth-heading`,children:[(0,D.jsxs)(`div`,{className:`auth-intro`,children:[(0,D.jsxs)(`div`,{className:`auth-brand-row`,children:[(0,D.jsx)(`img`,{src:E,alt:`Deltagame.az`,className:`auth-mark`,width:`96`,height:`96`}),(0,D.jsxs)(`span`,{className:`auth-live`,role:`img`,"aria-label":t(`Canlı`),children:[(0,D.jsx)(O,{}),(0,D.jsx)(`span`,{className:`auth-live-label`,children:t(`Canlı`)})]})]}),(0,D.jsx)(`h1`,{id:`auth-heading`,children:t(J?`Əyləncənin dadını çıxarmağa hazırsan?`:`Tanışlıq buradan başlayır`)}),(0,D.jsx)(`p`,{className:`auth-subtitle`,children:t(J?`Söhbətə qaldığın yerdən davam et.`:`Öz hesabını yarat, yeni insanlarla tanış ol.`)})]}),(0,D.jsxs)(`div`,{className:`auth-sheet`,children:[(0,D.jsxs)(`div`,{className:`auth-tabs`,role:`group`,"aria-label":t(`Hesaba giriş üsulu`),children:[(0,D.jsx)(_,{type:`button`,variant:`ghost`,className:`auth-tab`,"aria-pressed":J,disabled:H,onClick:()=>X(`login`),children:t(`Giriş`)}),(0,D.jsx)(_,{type:`button`,variant:`ghost`,className:`auth-tab`,"aria-pressed":!J,disabled:H,onClick:()=>X(`register`),children:t(`Qeydiyyat`)})]}),(0,D.jsxs)(`form`,{className:`auth-form`,onSubmit:async e=>{if(e.preventDefault(),H)return;let n=c();if(!n){G(t(`Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et.`));return}let r=s(M);if(r.length<3){G(t(`İstifadəçi adı ən azı 3 hərf və ya rəqəmdən ibarət olmalıdır.`));return}if(P.length<6){G(t(`Şifrə ən azı 6 simvoldan ibarət olmalıdır.`));return}U(!0),G(``);try{if(A===`login`){let{error:e}=await n.auth.signInWithPassword({email:o(r),password:P});e&&!await f(r)&&!d(e.message)&&G(t(`İstifadəçi adı və ya şifrə yanlışdır.`))}else{let{data:e,error:i}=await n.auth.signUp({email:o(r),password:P,options:{data:{username:r,name:I.trim()||r,male:B,age:R||null}}});i?G(i.message.includes(`registered`)?t(`Bu istifadəçi adı artıq istifadə olunur.`):t(`Qeydiyyat alınmadı. Məlumatlarını yoxlayıb yenidən cəhd et.`)):e.session?await u():G(t(`Hesab yaradıldı. Daxil olmaq üçün hesabın təsdiqlənməlidir.`))}}catch{G(t(`Bağlantıda problem yarandı. Yenidən cəhd et.`))}finally{U(!1)}},"aria-busy":H,children:[(0,D.jsxs)(`div`,{className:`auth-field`,children:[(0,D.jsx)(`label`,{className:`auth-label`,htmlFor:`auth-username`,children:t(`İstifadəçi adı`)}),(0,D.jsxs)(`div`,{className:`auth-input-wrap`,children:[(0,D.jsx)(p,{className:`auth-field-icon`,"aria-hidden":`true`}),(0,D.jsx)(v,{id:`auth-username`,name:`username`,className:`auth-input with-icon`,placeholder:t(`İstifadəçi adını yaz`),value:M,onChange:e=>N(e.target.value),autoComplete:`username`,autoCapitalize:`none`,autoCorrect:`off`,spellCheck:!1,disabled:H,required:!0})]})]}),(0,D.jsxs)(`div`,{className:`auth-field`,children:[(0,D.jsx)(`label`,{className:`auth-label`,htmlFor:`auth-password`,children:t(`Şifrə`)}),(0,D.jsxs)(`div`,{className:`auth-input-wrap`,children:[(0,D.jsx)(C,{className:`auth-field-icon`,"aria-hidden":`true`}),(0,D.jsx)(v,{id:`auth-password`,name:`password`,className:`auth-input with-icon password`,placeholder:t(`Şifrəni yaz`),type:K?`text`:`password`,value:P,onChange:e=>F(e.target.value),autoComplete:J?`current-password`:`new-password`,autoCapitalize:`none`,autoCorrect:`off`,spellCheck:!1,disabled:H,required:!0}),(0,D.jsx)(_,{type:`button`,variant:`ghost`,className:`auth-eye`,"aria-label":t(K?`Şifrəni gizlət`:`Şifrəni göstər`),title:t(K?`Şifrəni gizlət`:`Şifrəni göstər`),"aria-pressed":K,onClick:()=>q(e=>!e),disabled:H,children:K?(0,D.jsx)(x,{}):(0,D.jsx)(S,{})})]})]}),!J&&(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)(`div`,{className:`auth-field`,children:[(0,D.jsx)(`label`,{className:`auth-label`,htmlFor:`auth-name`,children:t(`Oyunda görünən ad`)}),(0,D.jsx)(v,{id:`auth-name`,name:`name`,className:`auth-input`,placeholder:t(`Sənə necə müraciət edək?`),value:I,onChange:e=>L(e.target.value),maxLength:20,autoComplete:`nickname`,disabled:H})]}),(0,D.jsxs)(`div`,{className:`auth-row`,children:[(0,D.jsxs)(`div`,{className:`auth-field`,children:[(0,D.jsx)(`label`,{className:`auth-label`,htmlFor:`auth-age`,children:t(`Yaş`)}),(0,D.jsx)(v,{id:`auth-age`,name:`age`,className:`auth-input`,placeholder:t(`Yaşın`),type:`number`,inputMode:`numeric`,min:14,max:99,value:R,onChange:e=>z(e.target.value),disabled:H})]}),(0,D.jsxs)(`div`,{className:`auth-field`,role:`group`,"aria-labelledby":`auth-gender-label`,children:[(0,D.jsx)(`span`,{id:`auth-gender-label`,className:`auth-label`,children:t(`Cins`)}),(0,D.jsxs)(`div`,{className:`auth-gender`,children:[(0,D.jsx)(_,{type:`button`,variant:`outline`,className:`auth-gender-button`,"aria-pressed":B,disabled:H,onClick:()=>V(!0),children:t(`Kişi`)}),(0,D.jsx)(_,{type:`button`,variant:`outline`,className:`auth-gender-button`,"aria-pressed":!B,disabled:H,onClick:()=>V(!1),children:t(`Qadın`)})]})]})]})]}),(W||Y)&&(0,D.jsxs)(`div`,{className:`auth-error`,role:`alert`,children:[(0,D.jsx)(b,{"aria-hidden":`true`}),(0,D.jsx)(`span`,{children:W||t(`Hazırda xidmətə qoşulmaq mümkün deyil. Bir az sonra yenidən cəhd et.`)})]}),(0,D.jsxs)(_,{type:`submit`,className:`auth-submit`,disabled:H||Y,children:[(0,D.jsx)(`span`,{"aria-hidden":`true`}),(0,D.jsx)(`span`,{children:t(H?`Bir az gözlə…`:J?`Daxil ol`:`Hesab yarat`)}),H?(0,D.jsx)(m,{className:`auth-spin`,"aria-hidden":`true`}):(0,D.jsx)(y,{"aria-hidden":`true`})]})]})]}),(0,D.jsxs)(`div`,{className:`auth-switch`,children:[(0,D.jsx)(`span`,{children:t(J?`Hələ hesabın yoxdur?`:`Artıq hesabın var?`)}),(0,D.jsx)(_,{type:`button`,variant:`link`,className:`auth-switch-button`,disabled:H,onClick:()=>X(J?`register`:`login`),children:t(J?`Qeydiyyatdan keç`:`Daxil ol`)})]})]}),(0,D.jsxs)(`footer`,{className:`auth-footer`,children:[(0,D.jsxs)(`p`,{className:`auth-footer-brand`,children:[(0,D.jsx)(`strong`,{children:`Deltagame.az`}),` — `,t(`hər fırlanış yeni tanışlıq, hər oyun unudulmaz bir an. Şüşəni fırlat və əyləncəyə qoşul!`)]}),(0,D.jsx)(w,{"aria-hidden":`true`}),(0,D.jsx)(`span`,{children:t(`Şifrən heç vaxt digər oyunçulara göstərilmir.`)})]})]})}export{A as component};