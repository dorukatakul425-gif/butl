import type { TelegramWebAppUser } from './telegram-auth';

/** Only call with a verified Telegram identity and server-fetched chat information. */
export function telegramIdentity(user: TelegramWebAppUser, chat?: { first_name?: string; last_name?: string; username?: string }) {
  const current = chat?.first_name ? chat : user;
  const username = (current.username ?? '').toLowerCase().replace(/[^a-z0-9_.]/g, '') || `tg${user.id}`;
  const name = [current.first_name, current.last_name].filter(Boolean).join(' ').slice(0, 40) || 'Telegram';
  return { name, username };
}

/** Internal storage host is unreachable from players' phones. Keep the signed path/query intact. */
export function telegramPublicPhotoUrl(signedUrl: string, publicBase: string) {
  const signed = new URL(signedUrl);
  const base = new URL(publicBase);
  if (base.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(base.hostname)) throw new Error('Invalid public storage host');
  return `${base.origin}${signed.pathname}${signed.search}`;
}
