// Deltagame.az Telegram botu — oyunun Mini App giriş düğmesini gönderir.
// VPS'te ayrı systemd servisi (butl-bot) olarak çalışır; site bundan bağımsızdır.
//
//   TELEGRAM_BOT_TOKEN=... node bot/telegram-bot.mjs
//
// Ortam değişkenleri:
//   TELEGRAM_BOT_TOKEN  (zorunlu) BotFather tokenı
//   GAME_URL            (opsiyonel) Mini App adresi, varsayılan https://deltagame.az/tg

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GAME_URL = process.env.GAME_URL || "https://deltagame.az/tg";

if (!TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN tanımlı değil.");
  process.exit(1);
}

const API = `https://api.telegram.org/bot${TOKEN}`;
let offset = 0;

async function call(method, body) {
  const res = await fetch(`${API}/${method}`, {
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
      const updates = await call("getUpdates", { offset, timeout: 30, allowed_updates: ["message"] });
      for (const update of updates) {
        offset = update.update_id + 1;
        if (update.message) await handleMessage(update.message).catch((e) => console.error(e));
      }
    } catch (e) {
      console.error(e);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

console.log(`Bot başladı. Mini App: ${GAME_URL}`);
await call("deleteWebhook", { drop_pending_updates: false }).catch(() => undefined);
await poll();
