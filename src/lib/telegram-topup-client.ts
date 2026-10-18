import { getAuth } from './auth';
import { shouldContactTelegramAdmin, telegramTopupUrl } from './telegram-topup';

export function contactTelegramAdminOnInsufficient(message: string, datAmount: number): boolean {
  const profile = getAuth().profile;
  const app = window.Telegram?.WebApp;
  if (!shouldContactTelegramAdmin(message.toLowerCase().includes('insufficient'), profile?.telegram_id, app?.initData)) return false;
  const url = telegramTopupUrl(datAmount, profile?.player_no);
  if (app?.openTelegramLink) app.openTelegramLink(url);
  else window.location.assign(url);
  return true;
}