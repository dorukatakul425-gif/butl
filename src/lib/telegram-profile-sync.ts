import type { TelegramWebAppUser } from './telegram-auth';

/** Only call with a verified Telegram identity and server-fetched chat information. */
export function telegramIdentity(user: TelegramWebAppUser, chat?: { first_name?: string; last_name?: string; username?: string }) {
  const current = chat?.first_name ? chat : user;
  const username = (current.username ?? '').toLowerCase().replace(/[^a-z0-9_.]/g, '') || `tg${user.id}`;
  const name = [current.first_name, current.last_name].filter(Boolean).join(' ').slice(0, 40) || username;
  return { name, username };
}
