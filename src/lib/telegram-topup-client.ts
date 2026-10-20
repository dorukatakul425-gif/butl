import { getAuth } from './auth';
import { shouldContactTelegramAdmin, telegramTopupUrl } from './telegram-topup';

export function contactTelegramAdminOnInsufficient(message: string, datAmount: number): boolean {
  const profile = getAuth().profile;
  const app = window.Telegram?.WebApp;
  if (!shouldContactTelegramAdmin(message.toLowerCase().includes('insufficient'), profile?.telegram_id)) return false;
  const url = telegramTopupUrl(datAmount, profile?.player_no);
  // Telegram içinde kendi paylaşım ekranı; sitede oyunu kapatmadan yeni sekme.
  if (app?.openTelegramLink) app.openTelegramLink(url);
  else window.open(url, '_blank', 'noopener');
  return true;
}
