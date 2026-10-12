import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Eye, EyeOff, Heart, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useCloudAccount } from '@/lib/cloud-account';
import wood from '@/assets/original-wood-table.png.asset.json';
import accountLogo from '@/assets/account-game-logo.svg';

export function AuthScreen() {
  const { user, refresh } = useCloudAccount();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => { if (user) void navigate({ to: '/home', replace: true }); }, [user?.id]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setNotice('');
    const fields = new FormData(event.currentTarget);
    const email = z.string().email().safeParse(fields.get('email'));
    if (!email.success) { setNotice('Geçerli bir e-posta adresi girin.'); return; }
    const password = String(fields.get('password') ?? '');
    if (mode !== 'forgot' && password.length < 8) { setNotice('Şifreniz en az 8 karakter olmalı.'); return; }
    setBusy(true);
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error; setNotice('Şifre yenileme bağlantısı e-posta adresinize gönderildi.');
      } else if (mode === 'signup') {
        const username = String(fields.get('username') ?? '').trim().toLowerCase();
        if (!/^[a-z0-9_]{3,30}$/.test(username)) throw new Error('Kullanıcı adı 3–30 harf, rakam veya alt çizgi olmalı.');
        const display_name = String(fields.get('display_name') ?? '').trim();
        if (!display_name || display_name.length > 40) throw new Error('Görünen adınızı girin (en fazla 40 karakter).');
        const { data, error } = await supabase.auth.signUp({ email: email.data, password, options: { emailRedirectTo: `${window.location.origin}/auth`, data: { username, display_name } } });
        if (error) throw error;
        if (!data.session) setNotice('Hesabınızı etkinleştirmek için e-postanızdaki onay bağlantısına tıklayın.');
        else await refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.data, password });
        if (error) throw error;
        await refresh(); await navigate({ to: '/home' });
      }
    } catch (e) { setNotice(e instanceof Error ? e.message : 'İşlem tamamlanamadı.'); }
    finally { setBusy(false); }
  };
  return <main className="account-page"><img src={wood.url} className="account-backdrop" alt="" /><div className="account-shade" /><div className="account-brand"><img src={accountLogo} alt="Şişe Çevirmece" /><span>ŞİŞE ÇEVİRMECE</span></div><section className="auth-surface">
    <div className="auth-mark"><Heart fill="currentColor" size={25} /></div>
    <h1>{mode === 'signup' ? 'Masada yerin hazır.' : mode === 'forgot' ? 'Yeniden başlayalım.' : 'Yeniden hoş geldin.'}</h1>
    <p className="account-subtitle">{mode === 'signup' ? 'Bir isim seç. Yeni insanlarla tanış.' : mode === 'forgot' ? 'Şifreni yenile, masaya geri dön.' : 'Sohbet kaldığı yerden devam etsin.'}</p>
    {mode !== 'forgot' && <div className="auth-tabs"><Button variant="ghost" className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setNotice(''); }}>Giriş yap</Button><Button variant="ghost" className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setNotice(''); }}>Kayıt ol</Button></div>}
    <form onSubmit={event => void submit(event)} className="auth-form">
      {mode === 'signup' && <><label>Görünen ad<div className="auth-field"><UserRound size={18} /><Input name="display_name" autoComplete="nickname" placeholder="Masada görünen adın" maxLength={40} required /></div></label><label>Kullanıcı adı<div className="auth-field"><span>@</span><Input name="username" placeholder="kullanici_adi" minLength={3} maxLength={30} required /></div></label></>}
      <label>E-posta<div className="auth-field"><Mail size={18} /><Input name="email" type="email" autoComplete="email" placeholder="sen@ornek.com" maxLength={254} required /></div></label>
      {mode !== 'forgot' && <label>Şifre<div className="auth-field"><LockKeyhole size={18} /><Input name="password" type={visible ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="En az 8 karakter" minLength={8} maxLength={128} required /><Button type="button" variant="ghost" size="icon" aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</Button></div></label>}
      {mode === 'login' && <Button type="button" variant="link" className="auth-forgot" onClick={() => { setMode('forgot'); setNotice(''); }}>Şifremi unuttum</Button>}
      {notice && <p className="auth-notice" role="status">{notice}</p>}
      <Button type="submit" className="account-primary" disabled={busy}>{busy ? 'Bekleyin…' : mode === 'signup' ? 'Hesap oluştur' : mode === 'forgot' ? 'Yenileme bağlantısı gönder' : 'Giriş yap'}<ArrowRight size={18} /></Button>
    </form>
    {mode !== 'forgot' ? <><div className="auth-divider"><span>veya</span></div><Button variant="outline" className="account-google" disabled={busy} onClick={async () => { setBusy(true); setNotice(''); try { const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/auth` }); if (result.error) throw result.error; if (!result.redirected) await refresh(); } catch (e) { setNotice(e instanceof Error ? e.message : 'Google ile giriş başarısız.'); } finally { setBusy(false); } }}><span className="google-letter">G</span>Google ile devam et</Button></> : <Button variant="link" onClick={() => setMode('login')}>Girişe dön</Button>}
  </section><footer className="account-footer">Bir şişe. Yeni bir hikâye.</footer></main>;
}