// Telegram Mini App login: validates initData with the bot token, finds or creates
// the player account, copies the Telegram name/photo, and returns a one-time
// magic-link token the browser exchanges for a session.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validateInitData, telegramEmail } from "./telegram-auth";

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    const { fetchTelegramProfile } = await import("./telegram-profile-sync.server");
    const current = await fetchTelegramProfile(botToken, tg);

    // Existing player linked to this Telegram account?
    const { data: existing } = await admin
      .from("profiles")
      .select("id, photo_url, username")
      .eq("telegram_id", tg.id)
      .maybeSingle();

    let userId: string | null = existing?.id ?? null;

    if (!userId) {
      const { name } = current;
      const { data: taken } = await admin.from("profiles").select("id").eq("username", current.username).maybeSingle();
      const username = taken ? `tg${tg.id}` : current.username;
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

    if (!userId) throw new Error("Telegram hesabı bulunamadı.");
    // Synchronize on every verified launch; a failed Telegram request is not a removed photo/bio.
    const patch: { name: string; username?: string; photo_url?: string | null; bio?: string } = { name: current.name };
    const { data: usernameOwner, error: usernameError } = await admin.from("profiles").select("id").eq("username", current.username).maybeSingle();
    if (usernameError) throw new Error("Telegram profil adı yenilenemedi.");
    if (!usernameOwner || usernameOwner.id === userId) patch.username = current.username;
    if (current.bio !== undefined) patch.bio = current.bio;
    if (current.photo === null) patch.photo_url = null;
    if (current.photo && current.photo.byteLength > 0) {
      // A new object key prevents browser/CDN caches from showing the previous Telegram photo.
      const path = `${userId}/telegram-${Date.now()}-${crypto.randomUUID()}.jpg`;
      const upload = await admin.storage.from("avatars").upload(path, current.photo, { contentType: "image/jpeg" });
      if (upload.error) throw new Error("Telegram fotoğrafı yenilenemedi.");
      const signed = await admin.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
      if (!signed.data?.signedUrl) throw new Error("Telegram fotoğrafı açılamadı.");
      patch.photo_url = signed.data.signedUrl;
    }
    const { error: syncError } = await admin.from("profiles").update(patch).eq("id", userId);
    if (syncError) throw new Error("Telegram profil bilgileri yenilenemedi.");

    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError || !link?.properties?.hashed_token) throw new Error("Oturum açılamadı.");

    return { tokenHash: link.properties.hashed_token as string };
  });
