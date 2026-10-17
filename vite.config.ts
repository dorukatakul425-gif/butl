// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import JavaScriptObfuscator from "javascript-obfuscator";
import type { Plugin } from "vite";

// Obfuscates only our own client-side source (src/**), never node_modules and never
// the SSR/server bundle, so game logic and server code keep working unchanged.
// Disable with DISABLE_CODE_PROTECTION=1 when debugging a production build.
function codeProtectionPlugin(): Plugin {
  const isSource = (id: string) => {
    const file = id.split("?")[0];
    return (
      file.includes("/src/") && /\.(tsx?|jsx?|mjs)$/.test(file) && !file.includes("node_modules")
    );
  };

  return {
    name: "butl-code-protection",
    enforce: "post",
    apply: "build",
    transform(code, id, options) {
      if (options?.ssr) return null;
      if (!isSource(id)) return null;
      const result = JavaScriptObfuscator.obfuscate(code, {
        target: "browser",
        compact: true,
        simplify: true,
        identifierNamesGenerator: "mangled-shuffled",
        numbersToExpressions: true,
        stringArray: true,
        stringArrayThreshold: 0.75,
        stringArrayEncoding: ["base64"],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        // Kept off on purpose: these either break post-minification or slow the game down.
        selfDefending: false,
        debugProtection: false,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        renameGlobals: false,
        transformObjectKeys: false,
        splitStrings: false,
        unicodeEscapeSequence: false,
      });
      return { code: result.getObfuscatedCode(), map: null };
    },
  };
}

const protectionEnabled = process.env.DISABLE_CODE_PROTECTION !== "1";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: { sourcemap: false },
    plugins: protectionEnabled ? [codeProtectionPlugin()] : [],
  },
});
