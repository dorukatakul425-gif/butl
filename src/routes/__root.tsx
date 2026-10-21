import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { PreferencesProvider } from "@/lib/app-preferences";
import { BanGuard } from "@/components/ban-guard";
import { SiteRefreshHost } from '@/components/site-refresh-host';
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { showInspectorNotice } from "../lib/inspector-notice";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" },
      { title: "DeltaGame.az" },
      { name: "description", content: "Şüşəni fırlat, yeni insanlarla tanış ol və canlı oyun masasında əylənin — DeltaGame.az-a indi qoşul!" },
      { name: "author", content: "DeltaGame.az" },
      { property: "og:title", content: "DeltaGame.az" },
      { property: "og:description", content: "Şüşəni fırlat, yeni insanlarla tanış ol və canlı oyun masasında əylənin — DeltaGame.az-a indi qoşul!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#c98b4f" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "DeltaGame" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "application-name", content: "DeltaGame" },
    ],
    // Telegram Mini App SDK on every page, so the game sees Telegram wherever the app opens.
    scripts: [{ src: "https://telegram.org/js/telegram-web-app.js" }],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="az">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    showInspectorNotice();
  }, []);
  useEffect(() => {
    const editable = (t: EventTarget | null) => t instanceof HTMLElement && !!t.closest("input, textarea, [contenteditable='true']");
    const block = (e: Event) => { if (!editable(e.target)) e.preventDefault(); };
    const pinch = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    let lastTap = 0;
    const dblTap = (e: TouchEvent) => { const now = Date.now(); if (now - lastTap < 300 && !editable(e.target)) e.preventDefault(); lastTap = now; };
    const wheel = (e: WheelEvent) => { if (e.ctrlKey) e.preventDefault(); };
    const keys = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].includes(e.key)) e.preventDefault(); };
    const opts = { passive: false } as const;
    const ev: Array<[string, EventListener]> = [["copy", block], ["cut", block], ["contextmenu", block], ["selectstart", block], ["dragstart", block], ["gesturestart", block], ["gesturechange", block], ["touchmove", pinch as EventListener], ["touchend", dblTap as EventListener], ["wheel", wheel as EventListener], ["keydown", keys as EventListener]];
    ev.forEach(([n, f]) => document.addEventListener(n, f, opts));
    return () => ev.forEach(([n, f]) => document.removeEventListener(n, f));
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <PreferencesProvider><Outlet /></PreferencesProvider> breaks all child routes. */}
      <PreferencesProvider><BanGuard><Outlet /><SiteRefreshHost /></BanGuard></PreferencesProvider>
    </QueryClientProvider>
  );
}
