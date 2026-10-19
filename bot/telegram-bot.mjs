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

// Stars ödemesi onaylandı: payload'daki paketi doğrula, kalbi oyuncunun hesabına ekle.
async function handlePayment(message) {
  const pay = message.successful_payment;
  const chatId = message.chat?.id;
  if (!pay || !chatId) return;
  const m = /^hearts\.(\d+)\.(\d+)\.(\d+)$/.exec(pay.invoice_payload || "");
  if (!m) return;
  const [, , stars, tgId] = m;
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { console.error('SUPABASE ayarları yok; kalp eklenemedi.'); return; }
  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/credit_stars_purchase`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      p_telegram_id: Number(tgId),
      p_stars: Number(stars),
      p_charge_id: pay.telegram_payment_charge_id,
    }),
  });
  if (!res.ok) { console.error('Kalp eklenemedi:', await res.text()); return; }
  const got = await res.json();
  if (got > 0) {
    await call("sendMessage", { chat_id: chatId, text: `❤️ ${got} kalp hesabına eklendi. İyi oyunlar!` });
  }
}

// Telegram ödeme öncesi onay sorar; paket bizim olduğu için doğrudan onaylıyoruz.
async function handlePreCheckout(q) {
  await call("answerPreCheckoutQuery", { pre_checkout_query_id: q.id, ok: true });
}

async function handleMessage(message) {
  if (message.successful_payment) return handlePayment(message);
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
      const updates = await call("getUpdates", { offset, timeout: 30, allowed_updates: ["message", "pre_checkout_query"] });
      for (const update of updates) {
        offset = update.update_id + 1;
        if (update.message) await handleMessage(update.message).catch(() => console.error('Telegram mesajı göndərilmədi.'));
        if (update.pre_checkout_query) await handlePreCheckout(update.pre_checkout_query).catch(() => console.error('Ödeme ön onayı göndərilmədi.'));
      }
    } catch {
      console.error('Telegram bağlantısı alınmadı; yenidən yoxlanılır.');
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

// Ciliz'deki gibi sıra sunucuda ilerler: oyuncuların ekranı arka planda
// olsa bile masa donmaz. Her 2 saniyede tüm masaların saati işletilir.
const SB_URL = process.env.SUPABASE_URL, SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (SB_URL && SB_KEY) {
  setInterval(() => {
    fetch(`${SB_URL.replace(/\/$/, "")}/rest/v1/rpc/tick_all_rooms`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
      body: "{}",
    }).catch(() => undefined);
  }, 2000);
} else {
  console.error("SUPABASE ayarları yok; masa saati (tick_all_rooms) çalışmayacak.");
}

console.log(`Bot başladı. Mini App: ${GAME_URL}`);
await call("deleteWebhook", { drop_pending_updates: false }).catch(() => undefined);
await poll();
