// Live game data, loaded directly from the game's own servers (same chain as preloader.js):
// server.json -> assets.json -> bundle images / spine skeletons.
import { completeLoadingStage, failGameLoading } from "./game-loading";
const SERVER_JSON_URL = "https://cdn-s.ciliz.com/mobile/server.json";

// MetaRegistry constants from preloader.js.
export const VIRTUAL_SIZE = 375;
export const ASSETS_TO_VIRTUAL = (375 / 704) * 1.17;
// ImageLoader.designToTable() for non-UI spines.
export const SPINE_DESIGN_TO_TABLE = 0.1 * (64 / 102);

export interface CilizFrame {
  type: string;
  image: string;
  spine?: string;
  stick?: boolean;
  storeImage: string;
  storeImage_v2: string;
}
export interface CilizStone {
  type: string;
  image: string;
  storeImage: string;
}
export interface CilizDecor {
  id: string;
  cond?: "pass" | "pass_buy";
  league_s?: number;
  social?: string[];
  storePrice?: number;
}
interface Bundle {
  size: number;
  url: string;
}
interface DialogBundle {
  dpr: number;
  url: string;
}
export type GiftStickPoint = "ava" | "hat" | "drink";
export interface CilizGift {
  category: string;
  chatIcon: string;
  finishSounds: string[];
  flyImages: string[];
  spine?: string[];
  spine_v2?: string[];
  startSounds: string[];
  stickImages: string[];
  stickPoint: GiftStickPoint;
  storeImage: string;
  storePrice: number;
  type: string;
  vfx?: string;
  kiss?: number;
}
export interface CilizGiftStoreEntry {
  id: string;
  social?: string[];
  birthday?: boolean;
  kisses_s?: number;
  vip_s?: boolean;
  user_s?: string[];
  platform?: string[];
}
export interface CilizAchievement {
  counters?: Array<number | string>; translate_counters?: boolean; name_depends_on_level?: boolean;
  image?: string | string[]; image_male?: string | string[]; image_female?: string | string[];
  since_ms?: number; social?: string[];
}
export interface CilizBooster { category: 'choice' | 'league'; image: string; type: string; spine?: string }
export interface CilizAssets {
  boosters?: Record<string, CilizBooster>;
  bottles?: Record<string, CilizBottle>;
  bottleStore?: Array<{ id: string; social?: string[]; vip_s?: boolean }>;
  bottle3d?: Record<string, CilizBottle3d>;
  gifts: Record<string, CilizGift>;
  giftStore: CilizGiftStoreEntry[];
  spines: Record<string, { finishSec?: number }>;
  sfxUrl: string;
  frames: Record<string, CilizFrame>;
  stones: Record<string, CilizStone>;
  decor: CilizDecor[];
  images: Record<string, { size: number[]; size_v2?: number[] }>;
  translation: Record<string, string>;
  achievements?: Record<string, CilizAchievement>;
  bundles: Bundle[];
  dialogBundles: DialogBundle[];
}

let assetsPromise: Promise<CilizAssets> | null = null;

export function loadCilizAssets(): Promise<CilizAssets> {
  if (!assetsPromise) {
    assetsPromise = (async () => {
      const server = await (await fetch(SERVER_JSON_URL)).json();
      completeLoadingStage("server");
      const json = await (await fetch(server.assets.url)).json();
      completeLoadingStage("assets");
      return {
        bottles: Object.fromEntries(Object.entries(json.bottles as Record<string, CilizBottle>).filter(([key]) => !key.startsWith('__'))),
        bottleStore: json.bottles.__store.flat(),
        bottle3d: json.bottle3d,
        gifts: json.gifts,
        giftStore: json.gifts.__store,
        spines: json.spines,
        sfxUrl: server.assets.sfx_url_v2,
        frames: json.frames,
        stones: json.stones,
        decor: json.decor.__store,
        images: json.images,
        translation: json.translation.tr,
        achievements: json.achievement,
        boosters: json.boosters,
        bundles: server.assets.bundles_v2.table,
        dialogBundles: server.assets.bundles_v2.dlg,
      } satisfies CilizAssets;
    })();
    assetsPromise.catch(() => {
      failGameLoading();
      assetsPromise = null;
    });
  }
  return assetsPromise;
}

export interface CilizBottle { type: string; image: string; bottle3d?: string; storePrice: number }
export interface CilizBottle3d {
  size: number[]; shadowSize: number[]; anchorX: number; anchorY: number;
  lightX: number; lightY: number; lightZ: number; viewerX: number; viewerY: number; viewerZ: number;
  shadowH: number; kd: number; ks: number; shininess: number;
}

export function translate(assets: CilizAssets, key: string, ...args: string[]) {
  let text = assets.translation[key] ?? key;
  args.forEach((arg, index) => {
    text = text.replace(`%${index}`, arg);
  });
  return text;
}

function pickBundle(assets: CilizAssets, targetSize: number) {
  const bundle = assets.bundles.find((bundle) => bundle.size >= targetSize) ?? assets.bundles.at(-1);
  if (!bundle) throw new Error("No table image bundles available");
  return bundle;
}

function dpr() {
  return typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
}

export function bundleUrl(assets: CilizAssets, name: string, ext: "png" | "json", targetSize?: number) {
  const bundle = pickBundle(assets, targetSize ?? VIRTUAL_SIZE * dpr());
  return bundle.url.replace("${name}", `${name}.${ext}`);
}

function virtualFrame(assets: CilizAssets, name: string) {
  const meta = assets.images[name];
  if (!meta) return { width: 0, height: 0 };
  const size = meta.size_v2 || meta.size;
  return { width: (size[2] ?? 0) * ASSETS_TO_VIRTUAL, height: (size[3] ?? 0) * ASSETS_TO_VIRTUAL };
}

/** ImageLoader.dlgData(): source and fitted size for an image shown in a dialog. */
export function dialogImage(assets: CilizAssets, name: string, w?: number, h?: number) {
  // MetaRegistry.getDialog uses the dedicated dlg bundle, never the table bundle.
  // Store thumbnails (fp_*_v2) exist only in these dialog bundles.
  const bundle = assets.dialogBundles.find((entry) => entry.dpr >= dpr()) ?? assets.dialogBundles.at(-1);
  if (!bundle) throw new Error("No dialog image bundles available");
  const frame = virtualFrame(assets, name);
  const width = w ?? frame.width;
  const height = h ?? frame.height;
  const scale = frame.width && frame.height ? Math.min(width / frame.width, height / frame.height) : 1;
  return {
    src: bundle.url.replace("${name}", `${name}.png`),
    width: Math.round(scale * frame.width),
    height: Math.round(scale * frame.height),
  };
}

export function tableFrameSize(assets: CilizAssets, name: string) {
  return virtualFrame(assets, name);
}
