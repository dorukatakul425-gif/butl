// Telegram Mini App login: validates initData with the bot token, finds or creates
// the player account, copies the Telegram name/photo, and returns a one-time
// magic-link token the browser exchanges for a session.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validateInitData, telegramEmail } from "./telegram-auth";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function fetchTelegramPhoto(botToken: string, telegramId: number): Promise<Uint8Array | null> {
  try {
    const api = `https://api.telegram.org/bot${botToken}`;
    const photosRes = await fetch(`${api}/getUserProfilePhotos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: telegramId, limit: 1 }),
    });
    const photos = await photosRes.json();
    const fileId = photos?.result?.photos?.[0]?.at(-1)?.file_id;
    if (!fileId) return null;
    const fileRes = await fetch(`${api}/getFile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_id: fileId }),
    });
    const file = await fileRes.json();
    const filePath = file?.result?.file_path;
    if (!filePath) return null;
    const download = await fetch(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
    if (!download.ok) return null;
    return new Uint8Array(await download.arrayBuffer());
  } catch {
    return null;
  }
}

export const telegramLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ initData: z.string().min(10).max(4096) }).parse(input))
  .handler(async ({ data }) => {
    const botToken = process.env["TELEGRAM_BOT_TOKEN"];
    if (!botToken) throw new Error("Telegram girişi yapılandırılmamış.");

    const { createHmac } = await import("node:crypto");
    const hmac = (key: string | Buffer, msg: string) => createHmac("sha256", key).update(msg).digest();
    const parsed = validateInitData(data.initData, botToken, hmac, Math.floor(Date.now() / 1000));
    if (!parsed) throw new Error("Telegram oturumu doğrulanamadı.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const tg = parsed.user;
    const email = telegramEmail(tg.id);

    // Existing player linked to this Telegram account?
    const { data: existing } = await admin
      .from("profiles")
      .select("id, photo_url")
      .eq("telegram_id", tg.id)
      .maybeSingle();

    let userId: string | null = existing?.id ?? null;

    if (!userId) {
      const username = (tg.username ? tg.username.toLowerCase().replace(/[^a-z0-9_.]/g, "") : "") || `tg${tg.id}`;
      const name = [tg.first_name, tg.last_name].filter(Boolean).join(" ").slice(0, 40) || username;
      const password = hmac(botToken, `tg-login:${tg.id}`).toString("hex");
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username, name },
      });
      if (createError || !created?.user?.id) throw new Error("Hesap oluşturulamadı.");
      userId = created.user.id;
      // handle_new_user trigger already inserted the profile row.
      await admin
        .from("profiles")
        .update({ telegram_id: tg.id, tutorial_done: false, profile_setup_done: false, name, username })
        .eq("id", userId);
    }

    // Import once at registration. Missing Telegram photos remain NO PHOTO until the player changes it.
    if (userId && !existing) {
      const photo = await fetchTelegramPhoto(botToken, tg.id);
      if (photo && photo.byteLength > 0) {
        const path = `${userId}/telegram.jpg`;
        const upload = await admin.storage.from("avatars").upload(path, photo, {
          contentType: "image/jpeg",
          upsert: true,
        });
        if (!upload.error) {
          const signed = await admin.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
          if (signed.data?.signedUrl) {
            await admin.from("profiles").update({ photo_url: signed.data.signedUrl }).eq("id", userId);
          }
        }
      }
    }

    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError || !link?.properties?.hashed_token) throw new Error("Oturum açılamadı.");

    return { tokenHash: link.properties.hashed_token as string };
  });
