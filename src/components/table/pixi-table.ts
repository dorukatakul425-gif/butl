// Browser-only: rendered with PixiJS + Spine 3.8 exactly like TableView/TableUserView in preloader.js.
import { Application, BaseTexture, Container, MIPMAP_MODES, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { TextureAtlas, TextureFilter } from "@pixi-spine/base";
import { AtlasAttachmentLoader, SkeletonJson, Spine, type SkeletonData } from "@pixi-spine/runtime-3.8";
import { bundleUrl, SPINE_DESIGN_TO_TABLE, tableFrameSize, VIRTUAL_SIZE, type CilizAssets } from "@/lib/ciliz-assets";
import type { SeatPlayer } from "@/components/table/table-seats";

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
  private updateId = 0;
  private current = "";

  constructor() {
    this.photo.x = -PHOTO / 2 - SHADOW_SIZE;
    this.photo.y = -PHOTO / 2;
    this.photo.width = PHOTO + SHADOW_SIZE * 2;
    this.photo.height = PHOTO + SHADOW_SIZE;
    this.nameContainer.y = -PHOTO / 2 + PHOTO - 1 + NAME_HEIGHT / 2;
    this.nameText.anchor.set(0.5);
    this.nameContainer.addChild(this.nameText, this.stoneLeft, this.stoneRight);
    this.view.addChild(this.photo, this.frameContainer, this.nameContainer);
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

export async function createPixiTable(host: HTMLElement, assets: CilizAssets) {
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
  const seats = SEATS.map(([x, y]) => {
    const seat = new SeatView();
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
    destroy() {
      observer.disconnect();
      app.destroy(true, { children: true });
    },
  };
}
