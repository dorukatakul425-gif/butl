// Ureyimsen custom animated frames (preloader_new.js `hi` registry + `pd` level-frame store).
// Assets are served from /custom-frames: *.anim.png (APNG, dialogs) and *.thin.png / *.sheet.png
// sprite sheets (table, Pixi AnimatedSprite).
import data from "./custom-frames-data.json";
import { ASSETS_TO_VIRTUAL, type CilizAssets } from "./ciliz-assets";

export interface CustomFrameMeta {
  width: number;
  height: number;
  cols: number;
  rows: number;
  count: number;
  loop: number;
  delays: number[];
  window: { x: number; y: number; w: number; h: number };
}
export interface CustomFrame {
  html?: string;
  sheet: string;
  meta: CustomFrameMeta;
}

export const CUSTOM_FRAME_PHOTO = 64;
export const CUSTOM_FRAMES = data as unknown as Record<string, CustomFrame>;

/** Level frames sent by the ureyimsen server (level_frames.list): unlocked at this gift level. */
export const LEVEL_FRAMES: ReadonlyArray<{ key: string; level: number }> = [
  { key: "cf_42", level: 20 },
  { key: "cf_59", level: 26 },
  { key: "cf_63", level: 31 },
  { key: "cf_64", level: 37 },
  { key: "cf_92", level: 43 },
  { key: "cf_95", level: 49 },
  { key: "cf_169", level: 54 },
  { key: "cf_186", level: 60 },
  { key: "cf_263", level: 66 },
  { key: "cf_402", level: 71 },
  { key: "cf_781", level: 77 },
  { key: "cf_1112", level: 83 },
  { key: "cf_1121", level: 89 },
  { key: "cf_1133", level: 94 },
  { key: "cf_1135", level: 100 },
];

export function getCustomFrame(key: string): CustomFrame | null {
  return CUSTOM_FRAMES[key] ?? null;
}

const IMAGE_PREFIX = "cfimg_";
export const customFrameImageName = (key: string) => IMAGE_PREFIX + key;

export function customFrameKeyOfImage(name: string): string {
  const key = name.indexOf(IMAGE_PREFIX) === 0 ? name.slice(IMAGE_PREFIX.length) : "";
  return CUSTOM_FRAMES[key] ? key : "";
}

export function customFrameLayout(frame: CustomFrame) {
  const win = frame.meta.window;
  const s = CUSTOM_FRAME_PHOTO / win.w;
  return {
    s,
    w: frame.meta.width * s,
    h: frame.meta.height * s,
    left: -CUSTOM_FRAME_PHOTO / 2 - win.x * s,
    top: -CUSTOM_FRAME_PHOTO / 2 - win.y * s,
  };
}

/** hi.url(): animated image URL for a custom frame image name (also its _store variant). */
export function customFrameUrl(name: string): string {
  const key = customFrameKeyOfImage(String(name).replace(/_store$/, ""));
  if (!key) return "";
  const frame = CUSTOM_FRAMES[key]!;
  return frame.html || frame.sheet;
}

/** hi.inject(): registers every custom frame as a regular game frame + image meta. */
export function injectCustomFrames(assets: Pick<CilizAssets, "frames" | "images">) {
  const k = 1 / ASSETS_TO_VIRTUAL;
  for (const key of Object.keys(CUSTOM_FRAMES)) {
    const frame = CUSTOM_FRAMES[key]!;
    const l = customFrameLayout(frame);
    const image = customFrameImageName(key);
    assets.images[image] = { size: [l.left * k, l.top * k, l.w * k, l.h * k] };
    assets.images[`${image}_store`] = { size: [0, 0, (42 * frame.meta.width) / frame.meta.height, 42] };
    assets.frames[key] = { type: key, image, storeImage: `${image}_store`, storeImage_v2: `${image}_store`, custom: key };
  }
}

/** pd.isOpen() for an account without purchases: gift level reaches the frame level. */
export function isLevelFrameOpen(level: number, giftLevel: number) {
  return giftLevel >= level;
}
