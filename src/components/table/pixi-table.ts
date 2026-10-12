// Browser-only: rendered with PixiJS + Spine 3.8 exactly like TableView/TableUserView in preloader.js.
import { Application, BaseTexture, Container, MIPMAP_MODES, Rectangle, Sprite, Text, TextStyle, Texture, type DisplayObject } from "pixi.js";
import { TextureAtlas, TextureFilter } from "@pixi-spine/base";
import { AtlasAttachmentLoader, SkeletonJson, Spine, type SkeletonData } from "@pixi-spine/runtime-3.8";
import { ASSETS_TO_VIRTUAL as ASSETS_TO_VIRTUAL_K, bundleUrl, SPINE_DESIGN_TO_TABLE, tableFrameSize, VIRTUAL_SIZE, type CilizAssets } from "@/lib/ciliz-assets";
import type { SeatPlayer } from "@/components/table/table-seats";
import { seededRandom, type SentGift } from "@/lib/gifts";

// TableView seats (virtual 375px table space, origin at table centre).
const SEATS: Array<[number, number]> = [
  [41.5, -140.5], [123.5, -120.5], [138.5, -38.5], [138.5, 42.5], [123.5, 124.5], [41.5, 143.5],
  [-40.5, 143.5], [-122.5, 124.5], [-137.5, 42.5], [-137.5, -38.5], [-122.5, -120.5], [-40.5, -140.5],
];
const PHOTO = 64;
const SHADOW_SIZE = 8;
const NAME_HEIGHT = 14;
const NAME_TEXT_STYLE = new TextStyle({
  align: "center",
  fill: "white",
  fontFamily: ["Arial", "Helvetica", "sans-serif"],
  fontSize: 8,
  fontWeight: "normal",
  lineJoin: "round",
  stroke: "rgba(0, 0, 0, 0.25)",
  strokeThickness: 1.25,
  trim: true,
});

const imageCache = new Map<string, Promise<HTMLImageElement>>();
function loadImage(url: string) {
  let promise = imageCache.get(url);
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });
    promise.catch(() => imageCache.delete(url));
    imageCache.set(url, promise);
  }
  return promise;
}

const skeletonCache = new Map<string, Promise<SkeletonData | undefined>>();
function loadSkeleton(assets: CilizAssets, name: string, tableSize: number) {
  const key = `${name}@${tableSize}`;
  let promise = skeletonCache.get(key);
  if (!promise) {
    promise = (async () => {
      const [img, raw] = await Promise.all([
        loadImage(bundleUrl(assets, name, "png", tableSize)),
        fetch(bundleUrl(assets, name, "json", tableSize)).then((res) => res.json()),
      ]);
      const baseTexture = BaseTexture.from(img, { mipmap: MIPMAP_MODES.ON });
      const atlas = new TextureAtlas(raw.__atlas, (_line, cb) => cb(baseTexture));
      for (const page of atlas.pages) {
        page.minFilter = TextureFilter.MipMapLinearLinear;
        page.magFilter = TextureFilter.MipMapLinearLinear;
      }
      const parser = new SkeletonJson(new AtlasAttachmentLoader(atlas));
      parser.scale = SPINE_DESIGN_TO_TABLE;
      return parser.readSkeletonData(raw);
    })();
    promise.catch(() => skeletonCache.delete(key));
    skeletonCache.set(key, promise);
  }
  return promise;
}

/** ImageLoader.pixiSpineFromSkeleton() */
function spineFromSkeleton(skeleton: SkeletonData, stick: boolean) {
  const spine = new Spine(skeleton);
  const state = spine.state;
  state.timeScale = 1;
  if (stick) {
    if (state.hasAnimation("stick")) {
      const entry = state.setAnimation(0, "stick", true);
      entry.trackTime = entry.animationEnd * Math.random();
    } else {
      const entry = state.setAnimation(0, "animation", false);
      entry.trackTime = entry.animationEnd;
    }
  } else {
    state.setAnimation(0, "animation", false);
    if (state.hasAnimation("stick")) state.addAnimation(0, "stick", true, 0);
  }
  return spine;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** drawPhotoCanvas() + drawUserPhoto() */
function drawPhoto(img: HTMLImageElement, res: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil((PHOTO + 2 * SHADOW_SIZE) * res);
  canvas.height = Math.ceil((PHOTO + SHADOW_SIZE) * res);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const w = Math.ceil(PHOTO * res);
  const h = Math.ceil(PHOTO * res);
  const scale = Math.min(w / 64, h / 64);
  const offX = w + SHADOW_SIZE * scale;
  const offY = h + SHADOW_SIZE * scale;
  const radius = 7 * scale;
  ctx.save();
  ctx.fillStyle = "black";
  ctx.shadowBlur = (SHADOW_SIZE / 2) * scale;
  ctx.shadowColor = "rgba(0, 0, 0, .25)";
  ctx.shadowOffsetX = offX;
  ctx.shadowOffsetY = offY;
  ctx.beginPath();
  roundRectPath(ctx, -offX + SHADOW_SIZE * scale, -offY + 3 * scale, w, h, radius);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  roundRectPath(ctx, SHADOW_SIZE * scale, 0, w, h, radius);
  ctx.clip();
  const fit = Math.max(w / img.width, h / img.height);
  const fw = img.width * fit;
  const fh = img.height * fit;
  const fx = (w - fw) / 2 + SHADOW_SIZE * scale;
  ctx.fillStyle = "#dde8ed";
  ctx.fillRect(fx, 0, fw, fh);
  ctx.drawImage(img, fx, 0, fw, fh);
  ctx.restore();
  return canvas;
}

class SeatView {
  readonly view = new Container();
  private photo = new Sprite();
  private frameContainer = new Container();
  private nameContainer = new Container();
  private nameText = new Text("", NAME_TEXT_STYLE);
  private stoneLeft = new Container();
  private stoneRight = new Container();
  readonly gifts = new Container();
  readonly sticks: Array<{ gift: SentGift; view: DisplayObject }> = [];
  private updateId = 0;
  private current = "";

  constructor(onClick: () => void) {
    this.gifts.eventMode = "none";
    this.gifts.sortableChildren = true;
    this.photo.eventMode = "static";
    this.photo.cursor = "pointer";
    this.photo.on("pointertap", onClick);
    this.photo.x = -PHOTO / 2 - SHADOW_SIZE;
    this.photo.y = -PHOTO / 2;
    this.photo.width = PHOTO + SHADOW_SIZE * 2;
    this.photo.height = PHOTO + SHADOW_SIZE;
    this.nameContainer.y = -PHOTO / 2 + PHOTO - 1 + NAME_HEIGHT / 2;
    this.nameText.anchor.set(0.5);
    this.nameContainer.addChild(this.nameText, this.stoneLeft, this.stoneRight);
    this.view.addChild(this.photo, this.frameContainer, this.nameContainer, this.gifts);
  }

  async set(player: SeatPlayer, assets: CilizAssets, res: number, tableSize: number) {
    const key = `${player.name}|${player.photoUrl}|${player.frame}|${player.stone}|${Math.ceil(res * 2) / 2}`;
    if (key === this.current) return;
    this.current = key;
    const id = ++this.updateId;
    this.nameText.resolution = Math.ceil(res);
    this.nameText.text = player.name;
    const textWidth = this.nameText.width;
    this.stoneLeft.x = -textWidth / 2 - 1;
    this.stoneRight.x = textWidth / 2 + 1;

    loadImage(player.photoUrl).then((img) => {
      if (id !== this.updateId) return;
      this.photo.texture = Texture.from(drawPhoto(img, res));
      this.photo.width = PHOTO + SHADOW_SIZE * 2;
      this.photo.height = PHOTO + SHADOW_SIZE;
      const sx = this.photo.texture.width / (PHOTO + SHADOW_SIZE * 2);
      this.photo.hitArea = new Rectangle(SHADOW_SIZE * sx, 0, PHOTO * sx, PHOTO * sx);
    }, () => {});

    this.frameContainer.removeChildren().forEach((child) => child.destroy());
    const frame = player.frame ? assets.frames[player.frame] : undefined;
    if (frame) {
      try {
        const skeleton = frame.spine ? await loadSkeleton(assets, frame.spine, tableSize) : undefined;
        if (id !== this.updateId) return;
        if (skeleton) {
          this.frameContainer.addChild(spineFromSkeleton(skeleton, Boolean(frame.stick)));
        } else {
          this.frameContainer.addChild(await this.sprite(assets, frame.image, tableSize, 0.5, 0.5));
        }
      } catch (error) {
        console.error(`Frame ${player.frame} could not be loaded`, error);
      }
    }

    this.stoneLeft.removeChildren().forEach((child) => child.destroy());
    this.stoneRight.removeChildren().forEach((child) => child.destroy());
    const stone = player.stone ? assets.stones[player.stone] : undefined;
    if (stone) {
      try {
        const [left, right] = await Promise.all([
          this.sprite(assets, stone.image, tableSize, 1, 0.5),
          this.sprite(assets, stone.image, tableSize, 0, 0.5),
        ]);
        if (id !== this.updateId) return;
        this.stoneLeft.addChild(left);
        this.stoneRight.addChild(right);
      } catch (error) {
        console.error(`Stone ${player.stone} could not be loaded`, error);
      }
    }
  }

  private async sprite(assets: CilizAssets, name: string, tableSize: number, ax: number, ay: number) {
    const img = await loadImage(bundleUrl(assets, name, "png", tableSize));
    const sprite = new Sprite(Texture.from(img));
    const size = tableFrameSize(assets, name);
    sprite.anchor.set(ax, ay);
    sprite.width = size.width;
    sprite.height = size.height;
    return sprite;
  }
}

// GiftAnimations constants and timings from preloader.js.
const GIFT_SCALE = 0.75;
const OVER_SCALE = 1.3 * GIFT_SCALE;
const FLY_SEC = 5;
const STICK_SORT = { ava: 0, drink: 1, hat: 2 } as const;
const PHOTO_FRAME = { x: -PHOTO / 2, y: -PHOTO / 2, width: PHOTO, height: PHOTO };
const easeOut = (p: number) => p * (2 - p);
const DEG = Math.PI / 180;

const baseTextureCache = new Map<string, BaseTexture>();
async function giftSprite(assets: CilizAssets, name: string, tableSize: number) {
  const url = bundleUrl(assets, name, "png", tableSize);
  let base = baseTextureCache.get(url);
  if (!base) {
    base = BaseTexture.from(await loadImage(url), { mipmap: MIPMAP_MODES.ON });
    baseTextureCache.set(url, base);
  }
  const sprite = new Sprite(new Texture(base));
  // ImageLoader.pixiApplyFrame()
  const meta = assets.images[name];
  const sz = meta ? meta.size_v2 || meta.size : [0, 0, 0, 0];
  const frame = { x: -(sz[0] ?? 0) * ASSETS_TO_VIRTUAL_K, y: -(sz[1] ?? 0) * ASSETS_TO_VIRTUAL_K, width: (sz[2] ?? 0) * ASSETS_TO_VIRTUAL_K, height: (sz[3] ?? 0) * ASSETS_TO_VIRTUAL_K };
  sprite.width = frame.width;
  sprite.height = frame.height;
  if (frame.width && frame.height) sprite.anchor.set(frame.x / frame.width, frame.y / frame.height);
  return sprite;
}

/** TableView.createGift(): spine when available, else the image. Fully loaded before use so the flight never hitches. */
async function createGiftView(assets: CilizAssets, image: string, spine: string | undefined, stick: boolean, tableSize: number): Promise<DisplayObject> {
  if (spine) {
    try {
      const skeleton = await loadSkeleton(assets, spine, tableSize);
      if (skeleton) return spineFromSkeleton(skeleton, stick);
    } catch (error) {
      console.warn(`Gift spine ${spine} unavailable, using image`, error);
    }
  }
  return giftSprite(assets, image, tableSize);
}

export interface PixiTableOptions {
  onSeatClick?: (index: number) => void;
  playSfx?: (id: string) => void;
}

export async function createPixiTable(host: HTMLElement, assets: CilizAssets, options: PixiTableOptions = {}) {
  const app = new Application({
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    width: host.clientWidth || 1,
    height: host.clientHeight || 1,
  });
  const canvas = app.view as HTMLCanvasElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  host.appendChild(canvas);

  const stage = new Container();
  app.stage.addChild(stage);
  const animationLayer = new Container();
  animationLayer.eventMode = "none";
  const seats = SEATS.map(([x, y], index) => {
    const seat = new SeatView(() => options.onSeatClick?.(index));
    seat.view.x = x;
    seat.view.y = y;
    stage.addChild(seat.view);
    return seat;
  });
  let players: SeatPlayer[] = [];
  let scale = 1;

  const res = () => scale * (window.devicePixelRatio || 1);
  const tableSize = () => VIRTUAL_SIZE * res();

  const layout = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    app.renderer.resize(width, height);
    const header = (host.parentElement?.querySelector(".original-table-header") as HTMLElement | null)?.offsetHeight ?? 0;
    const available = height - header;
    scale = Math.min(width / VIRTUAL_SIZE, available / VIRTUAL_SIZE);
    stage.scale.set(scale);
    stage.x = width / 2;
    stage.y = header + available / 2;
    players.forEach((player, index) => void seats[index]?.set(player, assets, res(), tableSize()));
  };

  stage.addChild(animationLayer);

  // Small timeline runner on Pixi's own ticker (AnimationManager equivalent).
  type Tick = (elapsed: number) => boolean;
  const ticks = new Set<Tick>();
  let destroyed = false;
  app.ticker.add(() => {
    const dt = Math.min(app.ticker.deltaMS / 1000, 0.1);
    for (const tick of ticks) if (!tick(dt)) ticks.delete(tick);
  });
  const run = (duration: number, step: (p: number) => void, done?: () => void) => {
    let t = 0;
    ticks.add((dt) => {
      t += dt;
      const p = Math.min(1, t / duration);
      step(p);
      if (p >= 1) {
        done?.();
        return false;
      }
      return true;
    });
  };
  const after = (sec: number, f: () => void) => run(sec, () => {}, f);

  const destroyView = (view: DisplayObject) => {
    view.parent?.removeChild(view);
    view.destroy({ children: true });
  };

  const hideGifts = (seat: SeatView, stickPoint: SentGift["stickPoint"], delay: number, duration: number) => {
    for (let i = seat.sticks.length - 1; i >= 0; i--) {
      const stick = seat.sticks[i];
      if (!stick || stick.gift.stickPoint !== stickPoint) continue;
      seat.sticks.splice(i, 1);
      const view = stick.view;
      after(delay, () => {
        const from = view.alpha;
        run(duration, (p) => { if (!view.destroyed) view.alpha = from * (1 - p); }, () => { if (!view.destroyed) destroyView(view); });
      });
    }
  };

  const calcGiftPosition = (gift: SentGift) => {
    switch (gift.stickPoint) {
      case "ava": {
        const r = seededRandom(gift.random);
        const r1 = r(), r2 = r(), r3 = r();
        return { x: PHOTO_FRAME.x + r1 * PHOTO_FRAME.width, y: PHOTO_FRAME.y + r2 * PHOTO_FRAME.height, scale: GIFT_SCALE, rotation: 360 * r3 };
      }
      case "drink":
        return { x: PHOTO_FRAME.x + PHOTO_FRAME.width, y: PHOTO_FRAME.y + PHOTO_FRAME.height, scale: GIFT_SCALE, rotation: 0 };
      case "hat":
        return { x: PHOTO_FRAME.x, y: PHOTO_FRAME.y, scale: GIFT_SCALE, rotation: -45 };
    }
  };

  const stickGift = async (receiver: SeatView, gift: SentGift, flyView: DisplayObject | undefined) => {
    const pt = calcGiftPosition(gift);
    let view = flyView;
    if (view && !gift.spine && gift.stickImage !== gift.flyImage) {
      destroyView(view);
      view = undefined;
    }
    if (!view) view = await createGiftView(assets, gift.stickImage, gift.spine, true, tableSize());
    if (destroyed) return;
    view.parent?.removeChild(view);
    view.position.set(pt.x, pt.y);
    view.scale.set(pt.scale);
    view.rotation = pt.rotation * DEG;
    view.zIndex = STICK_SORT[gift.stickPoint];
    receiver.gifts.addChild(view);
    // GiftAnimations.onStick()
    hideGifts(receiver, gift.stickPoint, gift.stickPoint === "ava" ? 8 : 0, 2);
    receiver.sticks.push({ gift, view });
    // Keep the table light: never hold more than a handful of avatar gifts per seat.
    const ava = receiver.sticks.filter((s) => s.gift.stickPoint === "ava");
    if (ava.length > 12) {
      const old = ava[0];
      if (old) {
        receiver.sticks.splice(receiver.sticks.indexOf(old), 1);
        destroyView(old.view);
      }
    }
  };

  /** GiftAnimations.flyGift() */
  const flyGift = async (from: number, to: number, gift: SentGift) => {
    const sender = seats[from];
    const receiver = seats[to];
    if (!sender || !receiver) return;
    const flyView = await createGiftView(assets, gift.flyImage, gift.spine, false, tableSize());
    if (destroyed) return;
    const src = { x: sender.view.x, y: sender.view.y, scale: GIFT_SCALE, rotation: 0 };
    flyView.position.set(src.x, src.y);
    flyView.scale.set(src.scale);
    animationLayer.addChild(flyView);
    // onFly(): drinks and hats replace the previous one.
    if (gift.stickPoint !== "ava") hideGifts(receiver, gift.stickPoint, 0, 2);
    options.playSfx?.(gift.startSound);
    const stickPt = calcGiftPosition(gift);
    run(FLY_SEC, (raw) => {
      if (flyView.destroyed) return;
      const p = easeOut(raw);
      const dst = { x: receiver.view.x + stickPt.x, y: receiver.view.y + stickPt.y, rotation: stickPt.rotation };
      flyView.x = (1 - p) * src.x + p * dst.x;
      flyView.y = (1 - p) * src.y + p * dst.y;
      flyView.rotation = ((1 - p) * src.rotation + p * dst.rotation) * DEG;
      let scale = OVER_SCALE;
      if (p <= 0.1) scale = (1 - p / 0.1) * src.scale + (p / 0.1) * OVER_SCALE;
      else if (p >= 0.9) scale = (1 - (p - 0.9) / 0.1) * OVER_SCALE + ((p - 0.9) / 0.1) * stickPt.scale;
      flyView.scale.set(scale);
    }, () => void stickGift(receiver, gift, flyView));
    const finishSec = gift.spine ? gift.spineFinishSec || FLY_SEC : FLY_SEC;
    after(Math.min(finishSec, FLY_SEC), () => options.playSfx?.(gift.finishSound));
  };

  const observer = new ResizeObserver(layout);
  observer.observe(host);
  layout();

  return {
    setPlayers(next: SeatPlayer[]) {
      players = next.slice(0, seats.length);
      layout();
    },
    setPlayer(index: number, player: SeatPlayer) {
      if (!players.length) return;
      players[index] = player;
      void seats[index]?.set(player, assets, res(), tableSize());
    },
    sendGift(from: number, to: number, gift: SentGift) {
      return flyGift(from, to, gift).catch((error) => console.error(`Gift ${gift.type} could not be shown`, error));
    },
    preloadGift(gift: SentGift) {
      void createGiftView(assets, gift.flyImage, gift.spine, false, tableSize()).then((v) => v.destroy({ children: true }), () => {});
    },
    destroy() {
      destroyed = true;
      ticks.clear();
      observer.disconnect();
      app.destroy(true, { children: true });
    },
  };
}
