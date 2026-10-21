// Sends browser crashes to the game server log so real-device failures can be diagnosed.
let sent = 0;
let windowStart = 0;
const seen = new Set<string>();

export function reportClientError(error: unknown, where: string) {
  if (typeof window === "undefined") return;
  try {
    const e = error as { message?: string; stack?: string } | undefined;
    const message = String(e?.message ?? error ?? "unknown").slice(0, 500);
    const sig = `${where}|${message}`;
    if (seen.has(sig)) return;
    seen.add(sig);
    const now = Date.now();
    if (now - windowStart > 60000) { windowStart = now; sent = 0; }
    if (++sent > 10) return;
    const body = JSON.stringify({
      where,
      message,
      stack: String(e?.stack ?? "").slice(0, 3000),
      path: window.location.pathname,
      ua: navigator.userAgent.slice(0, 200),
    });
    if (navigator.sendBeacon?.("/api/public/client-error", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/public/client-error", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
  } catch {
    /* reporting must never throw */
  }
}

export function installGlobalErrorReporting() {
  if (typeof window === "undefined") return () => {};
  const onError = (ev: ErrorEvent) => reportClientError(ev.error ?? ev.message, "window.onerror");
  const onRejection = (ev: PromiseRejectionEvent) => reportClientError(ev.reason, "unhandledrejection");
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
