import { gameError } from '@/lib/game-language';
import { useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Bold, Send, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { sendTelegramNotifications, uploadTelegramMedia } from '@/lib/admin.functions';

export function TelegramNotifications() {
  const send = useServerFn(sendTelegramNotifications), upload = useServerFn(uploadTelegramMedia);
  const [kind, setKind] = useState<'text' | 'photo' | 'video'>('text');
  const [text, setText] = useState(''), [media, setMedia] = useState('');
  const [bold, setBold] = useState(false), [silent, setSilent] = useState(false);
  const [busy, setBusy] = useState(false), [uploading, setUploading] = useState(false);
  const [error, setError] = useState(''), [fileName, setFileName] = useState('');
  const [result, setResult] = useState<{ sent: number; failed: number; total: number; done: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null), lock = useRef(false);
  const submit = async () => {
    if (lock.current || !window.confirm('Bütün Telegram oyunçularına göndərilsin?')) return;
    lock.current = true; setBusy(true); setError(''); setResult(null);
    let after: string | null = null, sent = 0, failed = 0, total = 0;
    try {
      do {
        const r = await send({ data: { text, bold, silent, kind, media, after } });
        sent += r.sent; failed += r.failed; total += r.attempted;
        setResult({ sent, failed, total, done: r.done });
        if (r.errors.length) setError(r.errors.join(' · '));
        after = r.after;
        if (r.done) break;
      } while (after);
    } catch (e) { setError(gameError(e)); }
    finally { lock.current = false; setBusy(false); }
  };
  return <section className="max-w-3xl space-y-4">
    <h2 className="text-xl font-semibold">Telegram bildirişləri</h2>
    <div className="flex flex-wrap gap-2">{(['text','photo','video'] as const).map(k => <Button key={k} variant={kind === k ? 'default' : 'outline'} disabled={busy || uploading} onClick={() => { setKind(k); setMedia(''); setFileName(''); setResult(null); }}>{k === 'text' ? 'Mətn' : k === 'photo' ? 'Şəkil' : 'Video'}</Button>)}</div>
    <div className="flex items-center gap-3">
      <Button variant={bold ? 'secondary' : 'outline'} size="icon" aria-label="Qalın mətn" title="Qalın mətn" aria-pressed={bold} disabled={busy} onClick={() => setBold(!bold)}><Bold className="size-4" /></Button>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={silent} disabled={busy} onCheckedChange={v => setSilent(v === true)} />Səssiz bildiriş</label>
    </div>
    <Textarea aria-label="Bildiriş mətni" placeholder="Bildiriş mətni" value={text} disabled={busy} maxLength={kind === 'text' ? 4096 : 1024} rows={6} onChange={e => setText(e.target.value)} />
    <p className="text-sm text-muted-foreground">Telegram mətn rəngini dəyişməyə icazə vermir. Rəngli mətn olan şəkil göndərə bilərsiniz.</p>
    {kind !== 'text' && <div className="space-y-3">
      <Input aria-label="Media keçidi və ya Telegram fayl ID-si" placeholder="HTTPS keçidi və ya Telegram fayl ID-si" value={media} disabled={busy || uploading} onChange={e => { setMedia(e.target.value); setFileName(''); }} />
      <input ref={fileRef} className="hidden" type="file" accept={kind === 'photo' ? 'image/jpeg,image/png' : 'video/mp4'} onChange={async e => {
        const file = e.target.files?.[0]; if (!file) return;
        setUploading(true); setError('');
        try { const f = new FormData(); f.set('file', file); f.set('kind', kind); const r = await upload({ data: f }); setMedia(r.fileId); setFileName(file.name); }
        catch (e) { setError(gameError(e)); }
        finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
      }} />
      <div className="flex items-center gap-2"><Button variant="outline" disabled={busy || uploading} onClick={() => fileRef.current?.click()}><Upload className="mr-2 size-4" />{uploading ? 'Yüklənir…' : 'Fayl seç'}</Button>{fileName && <><span className="truncate text-sm">{fileName}</span><Button size="icon" variant="ghost" aria-label="Faylı sil" disabled={busy} onClick={() => { setMedia(''); setFileName(''); }}><X className="size-4" /></Button></>}</div>
    </div>}
    <Button disabled={busy || uploading || (kind === 'text' ? !text.trim() : !media.trim())} onClick={() => void submit()}><Send className="mr-2 size-4" />{busy ? 'Göndərilir…' : 'Telegram oyunçularına göndər'}</Button>
    {result && <p role="status" className="text-sm">{result.done ? 'Tamamlandı' : busy ? 'Göndərilir' : 'Dayandırıldı'} · Cəhd: {result.total} · Göndərildi: {result.sent} · Uğursuz: {result.failed}</p>}
    {error && <p role="alert" className="break-words text-sm text-destructive">{error}</p>}
  </section>;
}
