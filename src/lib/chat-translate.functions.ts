import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({ text: z.string().trim().min(1).max(500), lang: z.string().regex(/^[a-z]{2}$/) });

/** Server side of session.translateText({type:'translate', text, lang}) → {ttext}. */
export const translateChatText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ ttext: string }> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Tərcümə xidməti konfiqurasiya edilməyib.");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch", "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        store: false,
        instructions: `Translate the user's chat message into the language with ISO code "${data.lang}". Keep emojis, names and tone. Reply with the translation only, no quotes or comments. If it is already in that language, return it unchanged.`,
        input: data.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`AI gateway [${res.status}]: ${body}`);
      throw new Error(`Çeviri alınamadı (${res.status}).`);
    }
    const json = await res.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
    const ttext = (json.output_text ?? json.output?.flatMap(o => o.content ?? []).filter(c => c.type === "output_text").map(c => c.text ?? "").join("") ?? "").trim();
    if (!ttext) throw new Error("Tərcümə alınmadı.");
    return { ttext };
  });
