import type { ImgHTMLAttributes } from "react";
import { bottleIconFallbacks } from "@/lib/bottle-icon-fallbacks";

export function BottleIcon({ src, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} src={src} onError={event => {
    const image = event.currentTarget;
    const fallback = bottleIconFallbacks[src?.split("/").at(-1) ?? ""];
    if (fallback && image.src !== fallback) image.src = fallback;
  }} />;
}

export function preloadBottleIcon(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => {
      const fallback = bottleIconFallbacks[url.split("/").at(-1) ?? ""];
      if (fallback && image.src !== fallback) image.src = fallback;
      else reject(new Error(`Bottle icon unavailable: ${url}`));
    };
    image.src = url;
  });
}