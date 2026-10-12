import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCloudAccount } from '@/lib/cloud-account';
import { usernameEmail, usernameSchema } from '@/lib/account-identity';
import { loginWithIdentity } from '@/lib/account-login.functions';
import scene from '@/assets/auth-table-scene.jpg';
import accountLogo from '@/assets/account-game-logo.svg';

export function AuthScreen() {
  const { user, refresh } = useCloudAccount();
  const navigate = useNavigate();
  const login = useServerFn(loginWithIdentity);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => { if (user) void navigate({ to: '/home', replace: true }); }, [user?.id]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setNotice('');
    const fields = new FormData(event.currentTarget);
    const identity = String(fields.get('identity') ?? '').trim().toLowerCase();
    const password = String(fields.get('password') ?? '');
    if (password.length < 8 || password.length > 128) { setNotice('Şifreniz 8–128 karakter olmalı.'); return; }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const username = usernameSchema.parse(identity);
        const { data, error } = await supabase.auth.signUp({ email: usernameEmail(username), password, options: { data: { username, display_name: username } } });
        if (error) throw error;
        if (!data.session) throw new Error('Kayıt tamamlanamadı; lütfen tekrar deneyin.');
      } else {
        const tokens = await login({ data: { identity, password } });
        const { error } = await supabase.auth.setSession(tokens);
        if (error) throw error;
      }
      await refresh(); await navigate({ to: '/home' });
    } catch (e) { setNotice(e instanceof Error ? e.message : 'İşlem tamamlanamadı.'); }
    finally { setBusy(false); }
  };
  return <main className="account-page auth-page">
    <img src={scene} width={1536} height={1024} className="account-backdrop auth-scene" alt="Yeşil oyun masasında şişe ve kalpler" />
    <div className="account-shade" />
    <header className="auth-top"><div className="account-brand"><img src={accountLogo} alt="" /><span>ŞİŞE ÇEVİRMECE</span></div><span className="auth-edition"><Sparkles size={14} /> Senin masan.</span></header>
    <section className="auth-surface" aria-label="Oyuncu hesabı">
      <div className="auth-heading"><span className="auth-eyebrow">ŞİŞE ÇEVİRMECE</span><h1>{mode === 'signup' ? 'Yeni bir başlangıç.' : 'Masaya hoş geldin.'}</h1></div>
      <div className="auth-tabs" role="tablist" aria-label="Hesap işlemi"><Button role="tab" aria-selected={mode === 'login'} variant="ghost" className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setNotice(''); }}>Giriş yap</Button><Button role="tab" aria-selected={mode === 'signup'} variant="ghost" className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setNotice(''); }}>Kayıt ol</Button></div>
      <form key={mode} onSubmit={event => void submit(event)} className="auth-form">
        <label>{mode === 'signup' ? 'Kullanıcı adı' : 'Kullanıcı adı / Oyuncu ID'}<div className="auth-field"><UserRound size={18} /><Input name="identity" autoComplete="username" placeholder={mode === 'signup' ? 'kullanici_adi' : 'Kullanıcı adın veya ID’n'} minLength={3} maxLength={40} required /></div></label>
        <label>Şifre<div className="auth-field"><LockKeyhole size={18} /><Input name="password" type={visible ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="En az 8 karakter" minLength={8} maxLength={128} required /><Button type="button" variant="ghost" size="icon" aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</Button></div></label>
        {notice && <p className="auth-notice" role="alert">{notice}</p>}
        <Button type="submit" className="account-primary" disabled={busy}>{busy ? 'Bekleyin…' : mode === 'signup' ? 'Hesap oluştur' : 'Giriş yap'}<ArrowRight size={18} /></Button>
      </form>
      <p className="auth-bottom">{mode === 'signup' ? 'Zaten bir hesabın var mı?' : 'Henüz masada yerin yok mu?'}<Button variant="link" disabled={busy} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setNotice(''); }}>{mode === 'signup' ? 'Giriş yap' : 'Kayıt ol'}</Button></p>
    </section><footer className="account-footer">Bir şişe. Yeni bir hikâye.<span>18+</span></footer>
  </main>;
}
