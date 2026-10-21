import { createFileRoute } from "@tanstack/react-router";

// Public, write-only crash log: accepts small JSON reports and only prints them to the server log.
// Nothing is stored or returned, so it cannot leak data.
const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f]+/g, " ").slice(0, max);

export const Route = createFileRoute("/api/public/client-error")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const text = (await request.text()).slice(0, 8000);
          const j = JSON.parse(text) as Record<string, unknown>;
          console.error(`[client-error] ${clean(j['where'], 60)} ${clean(j['path'], 80)} :: ${clean(j['message'], 500)} :: ${clean(j['stack'], 2500)} :: ${clean(j['ua'], 200)}`);
        } catch {
          /* ignore malformed reports */
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
