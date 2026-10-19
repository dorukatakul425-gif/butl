// Telegram Stars faturası: Mini App'ten gelen doğrulanmış initData ile fatura linki üretir.
// Oyuncu bu linki WebApp.openInvoice ile açar; ödeme onayını bot successful_payment ile alır.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validateInitData } from "./telegram-auth";
import { buildStarsPayload, TG_STARS_PACKAGES } from "./stars-bank";

export const createStarsInvoice = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ initData: z.string().min(10).max(4096), stars: z.number().int().positive() }).parse(input),
  )
  .handler(async ({ data }) => {
    const pk = TG_STARS_PACKAGES.find((p) => p.stars === data.stars);
    if (!pk) throw new Error("Bilinmeyen paket.");

    const { getTelegramBotToken } = await import("./telegram-config.server");
    const botToken = await getTelegramBotToken();
    const { createHmac } = await import("node:crypto");
    const hmac = (key: string | Buffer, msg: string) => createHmac("sha256", key).update(msg).digest();
    const parsed = validateInitData(data.initData, botToken, hmac, Math.floor(Date.now() / 1000));
    if (!parsed) throw new Error("Telegram oturumu doğrulanamadı.");

    const totalGold = pk.gold + pk.bonus;
    const title = `❤️ ${totalGold}`;
    const res = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: `Deltagame.az — ${totalGold} kalp paketi`,
        payload: buildStarsPayload(totalGold, pk.stars, parsed.user.id),
        currency: "XTR",
        prices: [{ label: title, amount: pk.stars }],
      }),
    });
    const json = (await res.json()) as { ok: boolean; result?: string; description?: string };
    if (!json.ok || !json.result) throw new Error(json.description || "Fatura oluşturulamadı.");
    return { link: json.result, totalGold };
  });
