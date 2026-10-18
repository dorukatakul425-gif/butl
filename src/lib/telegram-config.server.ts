import { loadBotToken } from '../../bot/telegram-config.mjs';

export function getTelegramBotToken() {
  return loadBotToken({
    url: process.env['SUPABASE_URL'],
    key: process.env['SUPABASE_SERVICE_ROLE_KEY'],
    fallback: process.env['TELEGRAM_BOT_TOKEN'],
  });
}