// Port of the original presenters/hints (createHintAsset + runHintAnimation):
// the animated hand cursor with three expanding circles and a text bubble.
// Positions and timings are copied 1:1 from the source timeline.

const FLASH_TO_USER = 64 / 102;
const DESIGN_TO_TABLE = 0.1 * FLASH_TO_USER; // ImageLoader.designToTable('hint_hand')
const TRANSPARENT_ALPHA = 0.001;

type Props = { x: number; y: number; rotation: number; scaleX: number; scaleY: number; alpha: number };
class Obj implements Props {
  x = 0; y = 0; rotation = 0; scaleX = 1; scaleY = 1; alpha = 1;
  constructor(public el: HTMLElement) { el.style.position = "absolute"; }
  draw() {
    const t = [
      this.x || this.y ? `translate3d(${this.x}px, ${this.y}px, 0)` : "",
      this.scaleX !== 1 || this.scaleY !== 1 ? `scale(${this.scaleX}, ${this.scaleY})` : "",
      this.rotation ? `rotate(${this.rotation}deg)` : "",
    ].join(" ").trim();
    this.el.style.transform = t || "none";
    this.el.style.opacity = this.alpha === 1 ? "" : String(this.alpha);
  }
}

export interface HintAsset { root: Obj; pointer: Obj; hand: Obj; circles: [Obj, Obj, Obj]; text: Obj; send: Obj; all: Obj[] }

export function createHintAsset(parent: HTMLElement): HintAsset {
  const div = (c: string) => { const d = document.createElement("div"); d.className = `interactive-hints__${c}`; return d; };
  const root = div("container"), text = div("text-container"), send = div("send-button"), handBox = div("hand-container"), hand = div("hand-image");
  const circles = [div("circle"), div("circle"), div("circle")];
  circles.forEach(c => handBox.appendChild(c));
  handBox.appendChild(send); handBox.appendChild(hand);
  root.appendChild(handBox); root.appendChild(text);
  parent.appendChild(root);
  const a: HintAsset = {
    root: new Obj(root), pointer: new Obj(handBox), hand: new Obj(hand), text: new Obj(text), send: new Obj(send),
    circles: circles.map(c => new Obj(c)) as [Obj, Obj, Obj], all: [],
  };
  a.circles.forEach(c => { c.el.style.position = "relative"; });
  a.all = [a.root, a.pointer, a.hand, a.text, a.send, ...a.circles];
  a.root.alpha = 0; a.all.forEach(o => o.draw());
  return a;
}

/** Minimal AnimationManager timeline: absolute-time tweens and callbacks. */
class Timeline {
  private items: Array<{ at: number; dur: number; run: (k: number) => void; done?: boolean; started?: boolean }> = [];
  private t0 = performance.now();
  private raf = 0;
  constructor(private redraw: () => void) { this.loop(); }
  add(at: number, item: { dur: number; run: (k: number) => void } | (() => void)) {
    this.items.push(typeof item === "function" ? { at, dur: 0, run: () => item() } : { at, ...item });
  }
  tween(o: Obj, dur: number, to: Partial<Props>) {
    let from: Partial<Props> = {};
    return { dur, run: (k: number) => {
      if (!Object.keys(from).length) for (const key of Object.keys(to) as Array<keyof Props>) from[key] = o[key];
      for (const key of Object.keys(to) as Array<keyof Props>) o[key] = (from[key] as number) + ((to[key] as number) - (from[key] as number)) * k;
    } };
  }
  private loop = () => {
    const now = (performance.now() - this.t0) / 1000;
    for (const item of [...this.items]) {
      if (item.done || now < item.at) continue;
      const k = item.dur ? Math.min(1, (now - item.at) / item.dur) : 1;
      item.run(k);
      if (k >= 1) item.done = true;
    }
    this.items = this.items.filter(i => !i.done);
    this.redraw();
    this.raf = requestAnimationFrame(this.loop);
  };
  complete() { cancelAnimationFrame(this.raf); this.items = []; this.redraw(); }
}

function textY(angle: number, height: number) {
  let top = 110 * Math.cos(Math.PI * angle / 180);
  if (Math.abs(top) < 65) top = 65 * Math.sign(top);
  return top - height / 2;
}
function textPos(size: { width: number; height: number }, target: { x: number; y: number }, viewportWidth: number, rotation: number) {
  const relativeX = 58 * -Math.sin(Math.PI * rotation / 180) - size.width / 2;
  const tx = target.x + relativeX;
  let x = relativeX;
  if (tx + size.width > viewportWidth - 10) x = viewportWidth - 10 - size.width - target.x;
  if (tx < 10) x = 10 - target.x;
  return { x, y: textY(rotation, size.height) };
}

export function runHintAnimation(a: HintAsset, target: { x: number; y: number }, rotation: number, text: string, opts?: { isSendMessage?: boolean }) {
  let resolveFinished = () => {};
  const finished = new Promise<void>(r => { resolveFinished = r; });
  let cancelled = false;
  const tl = new Timeline(() => a.all.forEach(o => o.draw()));
  const { hand, text: tText, pointer, root, send } = a;
  const [c1, c2, c3] = a.circles;
  tText.el.style.width = "max-content";
  tText.el.innerHTML = text;
  const size = { width: tText.el.clientWidth, height: tText.el.clientHeight };
  const placeText = (p: { x: number; y: number }, r = rotation) => { const pos = textPos(size, p, window.innerWidth, r); tText.x = pos.x; tText.y = pos.y; };
  placeText(target);
  pointer.rotation = rotation;
  root.x = target.x; root.y = target.y; root.alpha = 1;
  Object.assign(hand, { x: -41 * DESIGN_TO_TABLE, y: 438 * DESIGN_TO_TABLE, rotation: 19, scaleY: 0.85, scaleX: 1.07, alpha: 0 });
  for (const c of a.circles) Object.assign(c, { scaleX: 0, scaleY: 0, alpha: TRANSPARENT_ALPHA });
  Object.assign(tText, { scaleX: 0.87, scaleY: 0.87, alpha: 0 });
  Object.assign(send, { rotation: -rotation, x: -13, y: -13, alpha: opts?.isSendMessage ? 1 : 0 });
  tl.add(0, tl.tween(hand, 0.336, { x: -301 * DESIGN_TO_TABLE, y: 118 * DESIGN_TO_TABLE, rotation: 5, scaleY: 1.1, scaleX: 1, alpha: 1 }));
  tl.add(0.336, tl.tween(hand, 0.168, { y: 253 * DESIGN_TO_TABLE, rotation: 0, scaleY: 1, scaleX: 1, alpha: 1 }));
  tl.add(0.336, tl.tween(tText, 0.235, { scaleY: 1.05, scaleX: 1.05, alpha: 1 }));
  tl.add(0.571, tl.tween(tText, 0.168, { scaleY: 1, scaleX: 1 }));
  const addClick = (ts: number) => {
    [c1, c2, c3].forEach((c, i) => {
      const at = ts + i * 0.165;
      tl.add(at, () => { c.alpha = 1; c.scaleX = 0; c.scaleY = 0; });
      tl.add(at, tl.tween(c, 0.6, { scaleX: 8.8, scaleY: 8.8, alpha: TRANSPARENT_ALPHA }));
    });
    tl.add(ts + 0.6, tl.tween(hand, 0.2, { x: -331 * DESIGN_TO_TABLE, y: 95 * DESIGN_TO_TABLE, rotation: -4, scaleY: 0.95, scaleX: 1.05 }));
    tl.add(ts + 0.8, tl.tween(hand, 0.2, { x: -301 * DESIGN_TO_TABLE, y: 253 * DESIGN_TO_TABLE, rotation: 0, scaleY: 1, scaleX: 1 }));
  };
  let loopTs = 1.104;
  const loop = () => {
    addClick(loopTs);
    loopTs += 1;
    tl.add(loopTs, () => {
      if (!cancelled) { loop(); return; }
      tl.add(loopTs, tl.tween(hand, 0.336, { x: -41 * DESIGN_TO_TABLE, y: 438 * DESIGN_TO_TABLE, rotation: 0, scaleY: 1, scaleX: 1, alpha: TRANSPARENT_ALPHA }));
      tl.add(loopTs, tl.tween(tText, 0.235, { scaleY: 1, scaleX: 1, alpha: TRANSPARENT_ALPHA }));
      tl.add(loopTs + 0.336, () => { root.alpha = 0; tl.complete(); resolveFinished(); });
    });
  };
  loop();
  return {
    cancel: (skipEnding: boolean) => {
      cancelled = true;
      if (skipEnding) { root.alpha = 0; tl.complete(); resolveFinished(); }
    },
    update: (p: { x: number; y: number }) => { root.x = p.x; root.y = p.y; placeText(p); },
    finished,
  };
}
