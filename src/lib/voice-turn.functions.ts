import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getVoiceIceServers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<RTCIceServer[]> => {
    const urls = process.env["TURN_URLS"]?.split(",").map(url => url.trim()).filter(Boolean);
    const secret = process.env["TURN_SECRET"];
    if (!urls?.length || !secret) return [];
    const { createHmac } = await import("node:crypto");
    const username = `${Math.floor(Date.now() / 1000) + 3600}:${context.userId}`;
    return [{ urls: ["stun:stun.l.google.com:19302"] }, {
      urls, username, credential: createHmac("sha1", secret).update(username).digest("base64"),
    }];
  });
