import { useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { replaceTelegramBotToken } from '@/lib/admin.functions';

export function TelegramBotSettings() {
  const replace = useServerFn(replaceTelegramBotToken);
  const field = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return <section className="mb-6 border-b pb-6">
    <h2 className="mb-3 text-lg font-semibold">Telegram bot ayarları</h2>
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={async event => {
      event.preventDefault();
      if (busy || !field.current?.value.trim()) return;
      const token = field.current.value.trim();
      field.current.value = '';
      setBusy(true); setMessage('');
      try { await replace({ data: { token } }); setMessage('Bot tokeni yeniləndi. Bot ən gec 35 saniyəyə yeni tokenə keçir.'); }
      catch { setMessage('Token yenilənmədi. BotFather tokenini və bağlantını yoxlayın.'); }
      finally { setBusy(false); }
    }}>
      <Input ref={field} type="password" aria-label="Yeni bot tokeni" placeholder="BotFather-dən yeni bot tokeni" autoComplete="off" spellCheck={false} required disabled={busy} />
      <Button type="submit" disabled={busy}>{busy ? 'Yoxlanılır…' : 'Tokeni dəyiş'}</Button>
    </form>
    {message && <p role="status" className="mt-2 text-sm text-muted-foreground">{message}</p>}
  </section>;
}