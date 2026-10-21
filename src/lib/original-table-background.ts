// TableView background construction and updateLayout, extracted from the original
// preloader.fa928eddbe11.js (125443–125450, 125824–125829, 126481–126491).
import { BLEND_MODES, Container, Renderer, Sprite, Texture } from 'pixi.js';

export type OriginalBackgroundLayout = {
  background: { x: number; y: number; width: number; height: number };
  game: { width: number; height: number };
};

export async function createOriginalTableBackground(host: HTMLElement, url: string) {
  const renderer = new Renderer({
    antialias: false,
    autoDensity: true,
    backgroundColor: 0xc78747,
    resolution: window.devicePixelRatio,
  });
  const view = renderer.view as HTMLCanvasElement;
  view.style.display = 'block';
  view.style.pointerEvents = 'none';
  host.appendChild(view);
  const stage = new Container();
  const background = new Sprite();
  background.blendMode = BLEND_MODES.NONE;
  background.anchor.set(0.5);
  stage.addChild(background);
  let disposed = false;
  let current: OriginalBackgroundLayout | undefined;
  const updateLayout = (layout: OriginalBackgroundLayout) => {
    current = layout;
    if (disposed) return;
    const bgFrame = layout.background;
    background.x = bgFrame.x;
    background.y = bgFrame.y;
    background.width = bgFrame.width;
    background.height = bgFrame.height;
    renderer.events.resolution = window.devicePixelRatio;
    renderer.resolution = window.devicePixelRatio;
    renderer.resize(layout.game.width, layout.game.height);
    renderer.render(stage);
  };
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => {
    if (disposed) return;
    background.texture = Texture.from(image);
    if (current) updateLayout(current);
  };
  image.onerror = () => console.error('Original ui_table texture failed to load');
  image.src = url;
  return {
    updateLayout,
    destroy() {
      disposed = true;
      image.onload = null;
      stage.destroy({ children: true, texture: true, baseTexture: true });
      renderer.destroy(true);
    },
  };
}