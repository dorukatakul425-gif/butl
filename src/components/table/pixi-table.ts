// Browser-only: rendered with PixiJS + Spine 3.8 exactly like TableView/TableUserView in preloader.js.
import { Application, BaseTexture, Container, MIPMAP_MODES, Rectangle, Sprite, Text, TextStyle, Texture, type DisplayObject } from "pixi.js";
import { TextureAtlas, TextureFilter } from "@pixi-spine/base";
import { AtlasAttachmentLoader, SkeletonJson, Spine, type SkeletonData } from "@pixi-spine/runtime-3.8";
import { bundleUrl, SPINE_DESIGN_TO_TABLE, tableFrameSize, VIRTUAL_SIZE, type CilizAssets, type CilizGift } from "@/lib/ciliz-assets";
import type { SeatPlayer } from "@/components/table/table-seats";
import { type SentGift } from "@/lib/gifts";
import type { SeatSelection } from "@/lib/gift-selection";
import { PHOTO_SIZE as PHOTO, PHOTO_SHADOW_SIZE as SHADOW_SIZE, GIFT_SCALE, OVER_SCALE, FLY_SEC, giftImageFrame, calcGiftPosition } from "@/lib/gift-geometry";
import { GiftEffects } from "@/components/table/gift-effects";
import { matchingTableEffects } from "@/lib/table-gift-effects";
import { originalBottle } from "./original-bottle";
import { spinAngle, leftRight, SPIN_SECONDS, CENTER_SECONDS, RETURN_SECONDS, CENTER_PLAYER_SCALE } from "@/lib/bottle-game";

// TableView seats (virtual 375px table space, origin at table centre).
const SEATS: Array<[number, number]> = [
  [41.5, -140.5], [123.5, -120.5], [138.5, -38.5], [138.5, 42.5], [123.5, 124.5], [41.5, 143.5],
  [-40.5, 143.5], [-122.5, 124.5], [-137.5, 42.5], [-137.5, -38.5], [-122.5, -120.5], [-40.5, -140.5],
];
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
    // The game CDN sometimes serves a cached copy without CORS headers; retry with a fresh URL.
    const attempt = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = src;
    });
    const fresh = (n: number) => `${url}${url.includes("?") ? "&" : "?"}r=${Date.now().toString(36)}${n}`;
    promise = attempt(url).catch(() => attempt(fresh(1))).catch(() => attempt(fresh(2)));
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
        fetch(bundleUrl(assets, name, "json", tableSize)).then((res) => {
          if (!res.ok) throw new Error(`Skeleton ${name}: ${res.status}`);
          return res.json();
        }),
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

const USER_CHAT_HIGHLIGHT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MiIgaGVpZ2h0PSI3MiI+CiAgICA8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNjgiIGhlaWdodD0iNjgiIHJ4PSI4IiBmaWxsLW9wYWNpdHk9IjAiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utb3BhY2l0eT0iLjQ1Ii8+Cjwvc3ZnPgo=";

const USER_SELECTED_HIGHLIGHT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NiIgaGVpZ2h0PSI2NiI+CiAgICA8cmVjdCB3aWR0aD0iNjYiIGhlaWdodD0iNjYiIHJ4PSI2IiBmaWxsPSIjOWJjYzMzIiBmaWxsLW9wYWNpdHk9Ii43NSIvPgogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMwLjUgNDEuNWwtNi4xLTYuOSAyLjMtMiA0IDQuNiAxMC45LTEwLjkgMi4xIDIuMXoiLz4KPC9zdmc+Cg==";
const USER_SELECTABLE_HIGHLIGHT = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHdpZHRoPSI2NiIgaGVpZ2h0PSI2NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CiAgICA8c3R5bGU+LnN0MntmaWxsOiNmZmZ9PC9zdHlsZT4KICAgIDxnIGlkPSJMYXllcl8yXzFfIj4KICAgICAgICA8cGF0aCBkPSJNOCAyaDUwYzMuMyAwIDYgMi43IDYgNnY1MGMwIDMuMy0yLjcgNi02IDZIOGMtMy4zIDAtNi0yLjctNi02VjhjMC0zLjMgMi43LTYgNi02eiIgZmlsbC1vcGFjaXR5PSIuNzUiIGlkPSJMYXllcl8xLTJfMV8iIG9wYWNpdHk9Ii4zNSIvPgogICAgICAgIDxnIGlkPSJMYXllcl8yXzNfIj4KICAgICAgICAgICAgPHBhdGggY2xhc3M9InN0MiIgZD0iTTU4IDJjMy4zIDAgNiAyLjcgNiA2djUwYzAgMy4zLTIuNyA2LTYgNkg4Yy0zLjMgMC02LTIuNy02LTZWOGMwLTMuMyAyLjctNiA2LTZoNTBtMC0ySDhDMy42IDAgMCAzLjYgMCA4djUwYzAgNC40IDMuNiA4IDggOGg1MGM0LjQgMCA4LTMuNiA4LThWOGMwLTQuNC0zLjYtOC04LTh6IiBpZD0iTGF5ZXJfMS0yXzJfIi8+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zNC41IDQyaC0zdi03LjVIMjR2LTNoNy41VjI0aDN2Ny41SDQydjNoLTcuNXoiIGlkPSJMYXllcl8xLTIiLz4KICAgIDwvZz4KPC9zdmc+Cg==";

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
  private photoKey = "";
  private disposed = false;
  // TableUserView.selectionSprite: ui_table_user_chat_highlight, shown while the gift dialog targets this player.
  private selection = new Sprite();

  constructor(onClick: () => void) {
    this.gifts.eventMode = "none";
    this.gifts.sortableChildren = true;
    this.frameContainer.eventMode = "none";
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
    this.selection.eventMode = "none";
    this.selection.anchor.set(0.5);
    this.selection.visible = false;
    this.view.addChild(this.photo, this.frameContainer, this.selection, this.nameContainer, this.gifts);
  }

  // updateSelection(): selected = photo size, selectable = +4, chat highlight = +8.
  setSelection(mode: SeatSelection, res: number) {
    if (this.disposed) return;
    const source = mode === "selected" ? USER_SELECTED_HIGHLIGHT : mode === "selectable" ? USER_SELECTABLE_HIGHLIGHT : mode === "highlighted" ? USER_CHAT_HIGHLIGHT : "";
    if (!source) { this.selection.visible = false; this.selection.texture = Texture.EMPTY; return; }
    const size = PHOTO + (mode === "selected" ? 0 : mode === "selectable" ? 4 : 8);
    this.selection.texture = Texture.from(source, { resourceOptions: { width: size * res, height: size * res } });
    this.selection.width = size;
    this.selection.height = size;
    this.selection.visible = true;
  }

  async set(player: SeatPlayer, assets: CilizAssets, res: number, tableSize: number) {
    if (this.disposed) return;
    const key = `${player.name}|${player.photoUrl}|${player.frame}|${player.stone}|${Math.ceil(res * 2) / 2}`;
    if (key === this.current) return;
    this.current = key;
    const id = ++this.updateId;
    this.nameText.resolution = Math.ceil(res);
    this.nameText.text = player.name;
    const textWidth = this.nameText.width;
    this.stoneLeft.x = -textWidth / 2 - 1;
    this.stoneRight.x = textWidth / 2 + 1;

    const photoKey = `${player.photoUrl}|${Math.ceil(res * 2) / 2}`;
    if (photoKey !== this.photoKey) loadImage(player.photoUrl).then((img) => {
      if (id !== this.updateId || this.disposed) return;
      this.photoKey = photoKey;
      const oldTexture = this.photo.texture;
      this.photo.texture = Texture.from(drawPhoto(img, res));
      if (oldTexture !== Texture.EMPTY) oldTexture.destroy(true);
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
        if (id !== this.updateId || this.disposed) return;
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
        if (id !== this.updateId || this.disposed) { left.destroy(); right.destroy(); return; }
        this.stoneLeft.addChild(left);
        this.stoneRight.addChild(right);
      } catch (error) {
        console.error(`Stone ${player.stone} could not be loaded`, error);
      }
    }
  }

  dispose() {
    this.disposed = true;
    this.updateId++;
    if (this.photo.texture !== Texture.EMPTY) this.photo.texture.destroy(true);
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

const STICK_SORT = { ava: 0, drink: 1, hat: 2 } as const;
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
  const frame = giftImageFrame(assets, name);
  sprite.width = frame.width;
  sprite.height = frame.height;
  if (frame.width && frame.height) sprite.anchor.set(frame.x / frame.width, frame.y / frame.height);
  return sprite;
}

/** TableView.createGift(): spine when available, else the image. Fully loaded before use so the flight never hitches. */
async function createGiftView(assets: CilizAssets, image: string, spine: string | undefined, stick: boolean, tableSize: number): Promise<DisplayObject> {
  // ImageLoader.pixiWrap: animate an outer container, never overwrite the image's intrinsic scale.
  const wrapper = new Container();
  wrapper.eventMode = "none";
  if (spine) {
    try {
      const skeleton = await loadSkeleton(assets, spine, tableSize);
      if (skeleton) {
        const view = spineFromSkeleton(skeleton, stick);
        view.autoUpdate = false;
        view.update(0);
        wrapper.addChild(view);
        return wrapper;
      }
    } catch (error) {
      console.warn(`Gift spine ${spine} unavailable, using image`, error);
    }
  }
  wrapper.addChild(await giftSprite(assets, image, tableSize));
  return wrapper;
}

export interface PixiTableOptions {
  onSeatClick?: (index: number) => void;
  playSfx?: (id: string) => void;
  prepareSfx?: (id: string) => Promise<unknown>;
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
  const bottleLayer = new Container();
  bottleLayer.eventMode = "none";
  stage.addChild(bottleLayer);
  const tableVfxLayer = new Container();
  const giftVfxLayer = new Container();
  tableVfxLayer.eventMode = "none";
  giftVfxLayer.eventMode = "none";
  const effects = new GiftEffects(giftVfxLayer, tableVfxLayer);
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
    effects.setLayout(width / scale, available / scale);
    players.forEach((player, index) => void seats[index]?.set(player, assets, res(), tableSize()));
  };

  stage.addChild(animationLayer, tableVfxLayer, giftVfxLayer);

  // Small timeline runner on Pixi's own ticker (AnimationManager equivalent).
  type Tick = (elapsed: number) => boolean;
  const ticks = new Set<Tick>();
  let destroyed = false;
  app.ticker.add(() => {
    const dt = Math.min(app.ticker.deltaMS / 1000, 0.1);
    for (const tick of ticks) if (!tick(dt)) ticks.delete(tick);
    effects.update(dt);
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
        if (view.destroyed) return;
        const from = view.alpha;
        run(duration, (p) => { if (!view.destroyed) view.alpha = from * (1 - p); }, () => { if (!view.destroyed) destroyView(view); });
      });
    }
  };

  const activate = (view: DisplayObject) => {
    if (view instanceof Container) for (const child of view.children) if (child instanceof Spine) child.autoUpdate = true;
  };

  const activeTableEffects = new Set<string>();
  const startTableEffects = () => {
    for (const name of matchingTableEffects(seats.slice(0, players.length).map(seat => seat.sticks.map(stick => stick.gift.type)))) {
      if (activeTableEffects.has(name)) continue;
      activeTableEffects.add(name);
      void effects.preload(name).then(async () => {
        if (destroyed) return;
        await effects.prepare(app.renderer, name);
        if (destroyed) return;
        effects.create(name, true);
        options.playSfx?.(`vfx_${name}`);
        after(24, () => activeTableEffects.delete(name));
      }).catch(error => { activeTableEffects.delete(name); console.error(error); });
    }
  };

  const stickGift = async (receiver: SeatView, gift: SentGift, flyView: DisplayObject | undefined) => {
    const pt = calcGiftPosition(gift);
    let view = flyView;
    if (!view) view = await createGiftView(assets, gift.stickImage, gift.spine, true, tableSize());
    if (destroyed) { destroyView(view); return; }
    view.parent?.removeChild(view);
    view.position.set(pt.x, pt.y);
    view.scale.set(pt.scale);
    view.rotation = pt.rotation * DEG;
    view.zIndex = STICK_SORT[gift.stickPoint];
    receiver.gifts.addChild(view);
    activate(view);
    // GiftAnimations.onStick()
    hideGifts(receiver, gift.stickPoint, gift.stickPoint === "ava" ? 8 : 0, 2);
    receiver.sticks.push({ gift, view });
    startTableEffects();
  };

  /** GiftAnimations.flyGift() */
  const flyGift = async (from: number, to: number, gift: SentGift) => {
    const sender = seats[from];
    const receiver = seats[to];
    if (!sender || !receiver) return;
    // Optional audio must never hold up a gift flight (slow CDN / suspended audio context).
    void options.prepareSfx?.(gift.startSound)?.catch(() => {});
    void options.prepareSfx?.(gift.finishSound)?.catch(() => {});
    const [flyView, stickView] = await Promise.all([
      createGiftView(assets, gift.flyImage, gift.spine, false, tableSize()),
      !gift.spine && gift.stickImage !== gift.flyImage ? createGiftView(assets, gift.stickImage, undefined, true, tableSize()) : undefined,
      gift.vfx ? effects.preload(gift.vfx) : undefined,
    ]);
    if (destroyed) { destroyView(flyView); if (stickView) destroyView(stickView); return; }
    // Upload in the background: the flight starts immediately, textures upload on first render.
    void app.renderer.plugins["prepare"].upload(flyView);
    if (stickView) void app.renderer.plugins["prepare"].upload(stickView);
    if (gift.vfx) void effects.prepare(app.renderer, gift.vfx);
    activate(flyView);
    const src = { x: sender.view.x, y: sender.view.y, scale: GIFT_SCALE, rotation: 0 };
    flyView.position.set(src.x, src.y);
    flyView.scale.set(src.scale);
    animationLayer.addChild(flyView);
    const emitter = gift.vfx ? effects.create(gift.vfx) : undefined;
    emitter?.updateSpawnPos(src.x, src.y);
    emitter?.resetPositionTracking();
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
      emitter?.updateSpawnPos(flyView.x, flyView.y);
      flyView.rotation = ((1 - p) * src.rotation + p * dst.rotation) * DEG;
      let scale = OVER_SCALE;
      if (p <= 0.1) scale = (1 - p / 0.1) * src.scale + (p / 0.1) * OVER_SCALE;
      else if (p >= 0.9) scale = (1 - (p - 0.9) / 0.1) * OVER_SCALE + ((p - 0.9) / 0.1) * stickPt.scale;
      flyView.scale.set(scale);
    }, () => {
      if (stickView) destroyView(flyView);
      void stickGift(receiver, gift, stickView ?? flyView);
    });
    const finishSec = gift.spine ? gift.spineFinishSec || FLY_SEC : FLY_SEC;
    after(finishSec, () => options.playSfx?.(gift.finishSound));
  };

  const observer = new ResizeObserver(layout);
  observer.observe(host);
  layout();

  const preloadJobs = new Map<string, Promise<void>>();
  let bottleVersion = 0;
  const tween = (duration: number, step: (p: number) => void) => new Promise<void>(resolve => run(duration, step, resolve));
  const movePlayers = async (a: number, b: number, center: boolean) => {
    const [left, right] = leftRight(a,b);
    const moving = [left,right].map((index,i) => ({
      view: seats[index]?.view,
      from: { x: seats[index]?.view.x ?? 0, y: seats[index]?.view.y ?? 0 },
      fromScale: seats[index]?.view.scale.x ?? 1,
      to: center ? [i===0 ? -46 : 46,-5] : SEATS[index] ?? [0,0],
    }));
    await tween(center ? CENTER_SECONDS : RETURN_SECONDS,p => moving.forEach(m => {
      if (!m.view) return;
      const ease = 1-Math.pow(1-p,3);
      m.view.x=m.from.x+((m.to[0] ?? 0)-m.from.x)*ease;
      m.view.y=m.from.y+((m.to[1] ?? 0)-m.from.y)*ease;
      m.view.scale.set(m.fromScale+((center ? CENTER_PLAYER_SCALE : 1)-m.fromScale)*ease);
    }));
  };
  let preloadQueue = Promise.resolve();
  const warmGift = async (gift: CilizGift) => {
    // A single warm-up queue prevents many skeleton parsers from blocking one frame.
    const spines = gift.spine_v2 || gift.spine || [];
    for (const name of spines) {
      if (destroyed) return;
      const view = await createGiftView(assets, gift.flyImages[0] ?? "", name, false, tableSize());
      if (!destroyed) await app.renderer.plugins["prepare"].upload(view);
      destroyView(view);
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    if (!spines.length) for (const name of new Set([...gift.flyImages, ...gift.stickImages])) {
      if (destroyed) return;
      const view = await createGiftView(assets, name, undefined, false, tableSize());
      if (!destroyed) await app.renderer.plugins["prepare"].upload(view);
      destroyView(view);
    }
    if (gift.vfx && !destroyed) { await effects.preload(gift.vfx); if (!destroyed) await effects.prepare(app.renderer, gift.vfx); }
  };

  return {
    async setBottle(type: string) {
      const version = ++bottleVersion;
      const view = await originalBottle(assets,type,tableSize(),loadImage,bottleLayer);
      if (destroyed || version!==bottleVersion) { destroyView(view); return; }
      bottleLayer.removeChildren().forEach(destroyView);
      bottleLayer.addChild(view);
      await app.renderer.plugins["prepare"].upload(view);
    },
    async spinBottle(from: number, to: number) {
      if (destroyed) return;
      bottleLayer.alpha=1;
      const start=bottleLayer.rotation%(2*Math.PI);
      const end=spinAngle(to)*Math.PI/180;
      // GameAnimations.toCenter(): spinner photo tweens to -10deg in 0.1s, then back to 0 in 0.1s (EASE_OUT).
      const spinnerView=seats[from]?.view;
      if (spinnerView) {
        const easeOut=(p:number)=>1-Math.pow(1-p,3);
        void tween(0.1,p=>{spinnerView.rotation=-10*DEG*easeOut(p);})
          .then(()=>tween(0.1,p=>{spinnerView.rotation=-10*DEG*(1-easeOut(p));}))
          .then(()=>{spinnerView.rotation=0;});
      }
      // Bottle kicks back 10deg before the 4.9s spin.
      await tween(0.1,p => { bottleLayer.rotation=start-(Math.PI/18)*(1-Math.pow(1-p,3)); });
      const initial=bottleLayer.rotation;
      await tween(SPIN_SECONDS-0.1,p => { bottleLayer.rotation=initial+(end-initial)*(1-Math.pow(1-p,3)); });
      bottleLayer.rotation=end%(2*Math.PI);
      void tween(1,p=>{bottleLayer.alpha=1-p;});
      await movePlayers(from,to,true);
    },
    async returnPlayers(from: number,to: number) {
      await Promise.all([movePlayers(from,to,false),tween(1,p=>{bottleLayer.alpha=p;})]);
    },
    setPlayers(next: SeatPlayer[]) {
      players = next.slice(0, seats.length);
      layout();
    },
    setPlayer(index: number, player: SeatPlayer) {
      if (!players.length) return;
      players[index] = player;
      void seats[index]?.set(player, assets, res(), tableSize());
    },
    // TablePresenter isSelective / selectedUsers / toggleHighlightUser.
    setSelection(modes: SeatSelection[]) {
      seats.forEach((seat, i) => seat.setSelection(modes[i] ?? "none", res()));
    },
    sendGift(from: number, to: number, gift: SentGift) {
      return flyGift(from, to, gift).catch((error) => console.error(`Gift ${gift.type} could not be shown`, error));
    },
    preloadGift(gift: CilizGift) {
      const key = `${gift.type}@${tableSize()}`;
      const existing = preloadJobs.get(key);
      if (existing) return existing;
      const job = preloadQueue.then(() => warmGift(gift));
      preloadQueue = job.catch(() => {});
      preloadJobs.set(key, job);
      job.catch(() => preloadJobs.delete(key));
      return job;
    },
    destroy() {
      destroyed = true;
      ticks.clear();
      observer.disconnect();
      effects.destroy();
      seats.forEach(seat => seat.dispose());
      app.destroy(true, { children: true });
    },
  };
}
