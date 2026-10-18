// Deltagame.az Telegram botu — oyunun Mini App giriş düğmesini gönderir.
// VPS'te ayrı systemd servisi (butl-bot) olarak çalışır; site bundan bağımsızdır.
//
//   TELEGRAM_BOT_TOKEN=... node bot/telegram-bot.mjs
//
// Ortam değişkenleri:
//   TELEGRAM_BOT_TOKEN  (zorunlu) BotFather tokenı
//   GAME_URL            (opsiyonel) Mini App adresi, varsayılan https://deltagame.az/tg

import { loadBotToken } from './telegram-config.mjs';
const config = () => loadBotToken({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY, fallback: process.env.TELEGRAM_BOT_TOKEN });
let TOKEN = await config();
const GAME_URL = process.env.GAME_URL || "https://deltagame.az/tg";

if (!TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN tanımlı değil.");
  process.exit(1);
}

let offset = 0;

async function call(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${method}: ${json.description || res.status}`);
  return json.result;
}

async function handleMessage(message) {
  const chatId = message.chat?.id;
  if (!chatId) return;
  const text = message.text || "";
  if (!text.startsWith("/start")) return;
  const name = message.from?.first_name || "dost";
  await call("sendMessage", {
    chat_id: chatId,
    text:
      `Salam, ${name}! 🍾\n\n` +
      "Deltagame.az şişe oyununa xoş gəldin. Aşağıdakı düğməyə bas — " +
      "Telegram adın və şəklinlə birbaşa oyuna girəcəksən, qeydiyyat lazım deyil.",
    reply_markup: {
      inline_keyboard: [[{ text: "🍾 Oyuna başla", web_app: { url: GAME_URL } }]],
    },
  });
}

async function poll() {
  for (;;) {
    try {
      const next = await config();
      if (next !== TOKEN) {
        TOKEN = next; offset = 0;
        await call('deleteWebhook', { drop_pending_updates: false });
      }
      const updates = await call("getUpdates", { offset, timeout: 30, allowed_updates: ["message"] });
      for (const update of updates) {
        offset = update.update_id + 1;
        if (update.message) await handleMessage(update.message).catch(() => console.error('Telegram mesajı göndərilmədi.'));
      }
    } catch {
      console.error('Telegram bağlantısı alınmadı; yenidən yoxlanılır.');
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

console.log(`Bot başladı. Mini App: ${GAME_URL}`);
await call("deleteWebhook", { drop_pending_updates: false }).catch(() => undefined);
await poll();
