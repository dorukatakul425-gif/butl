/** Pixi port of ureyimsen Ud.entryFx / Ud.themeFx: profile entrance effect drawn fully in code. */
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { ENTRY_BASE_MAX, ENTRY_MAX, ENTRY_STYLES, EXTRA_STYLES, tier, type Motion, type Particle } from "@/lib/entry-fx";

export type Animate = (duration: number, step: (p: number, t: number) => void, done: () => void) => void;

const texCache = new Map<string, Texture>();
const cached = (key: string, draw: (ctx: CanvasRenderingContext2D) => void, size = 64) => {
  const hit = texCache.get(key);
  if (hit && !hit.baseTexture.destroyed) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Entry effect canvas unavailable");
  ctx.translate(size / 2, size / 2);
  draw(ctx);
  const tex = Texture.from(canvas);
  texCache.set(key, tex);
  return tex;
};

/** Rd.tex("glow"|"rays", color) */
function fxTex(kind: "glow" | "rays", color: string) {
  return cached(kind + color, (ctx) => {
    if (kind === "glow") {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 128);
      g.addColorStop(0, color); g.addColorStop(0.35, color + "aa"); g.addColorStop(1, color + "00");
      ctx.fillStyle = g; ctx.fillRect(-128, -128, 256, 256);
    } else {
      for (let i = 0; i < 18; i++) {
        const angle = i / 18 * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 128, angle, angle + Math.PI / 36);
        ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      }
      ctx.globalCompositeOperation = "destination-in";
      const g = ctx.createRadialGradient(0, 0, 20.48, 0, 0, 128);
      g.addColorStop(0, "rgba(0,0,0,.9)"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(-128, -128, 256, 256);
    }
  }, 256);
}

const sprite = (tex: Texture, size: number) => {
  const s = new Sprite(tex);
  s.anchor.set(0.5);
  s.width = s.height = size;
  return s;
};

/** Ud.ptex — particle textures. */
function ptex(kind: Particle, color: string) {
  return cached(kind + color, (c) => {
    const star = (n: number, r1: number, r2: number) => {
      c.beginPath();
      for (let i = 0; i < 2 * n; i++) { const a = (i / (2 * n)) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? r2 : r1; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      c.closePath();
    };
    const glowFill = (r: number) => { const g = c.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, "#ffffff"); g.addColorStop(0.35, color); g.addColorStop(1, color + "00"); return g; };
    if (kind === "spark") { c.fillStyle = glowFill(30); c.fillRect(-32, -32, 64, 64); }
    else if (kind === "star4" || kind === "star5") {
      c.fillStyle = glowFill(30); c.globalAlpha = 0.6; c.fillRect(-32, -32, 64, 64); c.globalAlpha = 1;
      if (kind === "star4") star(4, 28, 6); else star(5, 24, 10);
      c.fillStyle = "#ffffff"; c.fill();
    } else if (kind === "coin") {
      const g = c.createLinearGradient(-20, -20, 20, 20);
      g.addColorStop(0, "#fff6c4"); g.addColorStop(0.45, "#f2c64a"); g.addColorStop(1, "#a8741a");
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, 22, 0, 2 * Math.PI); c.fill();
      c.strokeStyle = "#7a5210"; c.lineWidth = 3; c.stroke();
      c.strokeStyle = "#fff3c0"; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 15, 0, 2 * Math.PI); c.stroke();
      star(5, 9, 4); c.fillStyle = "#fff3c0"; c.fill();
    } else if (kind === "leaf" || kind === "petal" || kind === "feather") {
      const g = c.createLinearGradient(0, -28, 0, 28);
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.3, color); g.addColorStop(1, kind === "petal" ? "#c21f7a" : kind === "feather" ? "#ff2f6d" : "#0b7a4a");
      c.fillStyle = g; c.beginPath();
      const w = kind === "feather" ? 9 : kind === "petal" ? 18 : 14;
      c.moveTo(0, -28); c.bezierCurveTo(1.6 * w, -14, w, 18, 0, 28); c.bezierCurveTo(-w, 18, 1.6 * -w, -14, 0, -28); c.fill();
      if (kind !== "petal") { c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -26); c.lineTo(0, 26); c.stroke(); }
    } else if (kind === "drop") {
      const g = c.createRadialGradient(-5, -2, 2, 0, 6, 22);
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.4, color); g.addColorStop(1, "#1c4fd6");
      c.fillStyle = g; c.beginPath(); c.moveTo(0, -26); c.bezierCurveTo(16, -4, 18, 22, 0, 24); c.bezierCurveTo(-18, 22, -16, -4, 0, -26); c.fill();
    } else if (kind === "flame") {
      const g = c.createLinearGradient(0, 28, 0, -28);
      g.addColorStop(0, "#fff6c4"); g.addColorStop(0.35, "#ffb347"); g.addColorStop(0.75, color); g.addColorStop(1, color + "00");
      c.fillStyle = g; c.beginPath(); c.moveTo(0, -30); c.bezierCurveTo(14, -10, 20, 10, 0, 28); c.bezierCurveTo(-20, 10, -14, -10, 0, -30); c.fill();
    } else if (kind === "shard") {
      c.beginPath(); c.moveTo(0, -28); c.lineTo(12, 0); c.lineTo(0, 28); c.lineTo(-12, 0); c.closePath();
      const g = c.createLinearGradient(-12, -28, 12, 28);
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.5, color); g.addColorStop(1, "#2a8fd6");
      c.fillStyle = g; c.fill();
      c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -28); c.lineTo(0, 28); c.moveTo(-12, 0); c.lineTo(12, 0); c.stroke();
    }
  });
}

/** Ud.emojiTex */
function emojiTex(ch: string, tint?: string, alpha = 0) {
  return cached(ch + "|" + (tint ?? "") + "|" + alpha, (c) => {
    c.translate(-64, -64);
    c.textAlign = "center"; c.textBaseline = "middle";
    c.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Segoe UI Symbol",sans-serif';
    c.fillText(ch, 64, 70);
    if (tint) { c.globalCompositeOperation = "source-atop"; c.globalAlpha = alpha || 0.8; c.fillStyle = tint; c.fillRect(0, 0, 128, 128); }
  }, 128);
}

type P = Sprite & { a0: number; v: number; spin: number; delay: number; move?: Motion | undefined; base: number };
type Wing = Container & { side: number };

const hex = (c: string) => parseInt(c.slice(1), 16);

function wings(count: number, male: boolean, size0: number, step: number, rot: number) {
  const out: Wing[] = [];
  for (const side of [-1, 1]) {
    const w = new Container() as Wing;
    for (let i = 0; i < count; i++) {
      const f = sprite(ptex("feather", i % 2 ? (male ? "#141414" : "#ff5fb7") : (male ? "#d4a017" : "#ffffff")), size0 + step * i);
      f.rotation = side * (0.3 + rot * i); f.x = side * (8 + 5 * i); f.y = -4 - 1.5 * i; f.anchor.set(0.5, 1);
      w.addChild(f);
    }
    w.side = side; w.scale.set(0); out.push(w);
  }
  return out;
}

/** Ud.attach: back layer under the photo, front layer above. */
function attach(seat: Container, back: Container, front: Container) {
  seat.addChildAt(back, 0);
  seat.addChild(front);
}

export function playEntryFx(seat: Container, level: number, male: boolean, animate: Animate, valid: () => boolean = () => !seat.destroyed) {
  const lv = Math.max(1, Math.min(ENTRY_MAX, level | 0));
  const t = tier(lv);
  const style = ENTRY_STYLES[t.i] ?? ENTRY_STYLES[0];
  if (!style) return;
  const [kind, motion] = style;
  const Ht = Math.min(lv, ENTRY_BASE_MAX) / ENTRY_BASE_MAX;
  const Jt = Math.max(0, lv - ENTRY_BASE_MAX) / (ENTRY_MAX - ENTRY_BASE_MAX);
  const K = 0.35 + 0.65 * Ht + 0.3 * Jt;
  const dur = 2.4 + 3.4 * Ht + 1.6 * Jt;
  const count = Math.round(8 + 44 * Ht + (lv % 5) * 3 + 24 * Jt);
  const back = new Container(), front = new Container();
  back.eventMode = front.eventMode = "none";
  const glow = sprite(fxTex("glow", t.c1), 100 + 110 * K);
  back.addChild(glow);
  const rays = lv >= 10 ? sprite(fxTex("rays", t.rim), 140 + 160 * K) : null;
  if (rays) back.addChild(rays);
  const rings: Array<Graphics & { phase: number }> = [];
  const ringCount = 1 + Math.floor(Math.min(t.i, 9) / 2) + Math.round(3 * Jt);
  for (let i = 0; i < ringCount; i++) {
    const g = new Graphics() as Graphics & { phase: number };
    g.lineStyle(1.5 + 2.5 * K, hex(i % 2 && Jt > 0 ? t.rim : t.c1), 1).drawCircle(0, 0, 36);
    g.phase = i / ringCount; rings.push(g); back.addChild(g);
  }
  const colors = [t.c1, t.rim, "#ffffff"];
  const parts: P[] = [];
  const addPart = (k: Particle, color: string, size: number, m: Motion | undefined, delay: number) => {
    const s = sprite(ptex(k, k === "coin" ? "#f2c64a" : color), size) as P;
    s.base = s.scale.x; s.a0 = Math.random() * Math.PI * 2; s.v = 0.7 + 0.6 * Math.random(); s.spin = 6 * (Math.random() - 0.5);
    s.delay = delay; s.move = m; s.alpha = 0; parts.push(s); front.addChild(s);
  };
  for (let i = 0; i < count; i++) {
    const size = (10 + 10 * Math.random()) * (0.8 + 0.6 * K) * (kind === "coin" || kind === "shard" ? 1.1 : 1);
    addPart(kind, colors[i % 3] ?? t.c1, size, undefined, motion === "orbit" || motion === "runes" ? 0 : (i / count) * dur * 0.55);
  }
  if (Jt > 0) {
    const extra = EXTRA_STYLES[Math.min(EXTRA_STYLES.length - 1, Math.floor((lv - 51) / 10))];
    if (!extra) return;
    const [k2, m2] = extra;
    const n = Math.round(10 + 26 * Jt);
    for (let i = 0; i < n; i++) addPart(k2, colors[(i + 1) % 3] ?? t.rim, (9 + 8 * Math.random()) * (0.9 + 0.5 * Jt), m2, m2 === "orbit" || m2 === "runes" ? 0 : (i / n) * dur * 0.55);
  }
  const wingViews = motion === "wings" || lv >= 81 ? wings(9, male, 34, 2, 0.16) : [];
  wingViews.forEach((w) => back.addChild(w));
  attach(seat, back, front);
  animate(dur, (p, time) => {
    if (back.destroyed) return;
    if (!valid()) { back.destroy({ children: true }); if (!front.destroyed) front.destroy({ children: true }); return; }
    const fade = p < 0.08 ? p / 0.08 : p > 0.82 ? (1 - p) / 0.18 : 1;
    back.alpha = fade;
    glow.alpha = 0.6 + 0.4 * Math.sin(5 * time);
    if (rays) rays.rotation = time * (0.6 + K);
    for (const r of rings) { const m = (time / 1.1 + r.phase) % 1; r.scale.set(0.9 + (0.8 + K) * m); r.alpha = (1 - m) * fade; }
    for (const w of wingViews) { const m = Math.min(1, time / 0.6); w.scale.set((0.4 + 0.9 * K) * (1 - Math.pow(1 - m, 3))); w.rotation = 0.08 * w.side * Math.sin(6 * time); w.alpha = fade; }
    const life = 0.6 * dur;
    const R = 42 * (0.9 + 0.5 * K);
    for (const s of parts) {
      const m = s.move ?? motion;
      let q = (time - s.delay) / life;
      if (m === "orbit" || m === "runes") q = time / dur;
      if (q <= 0 || q >= 1) { s.alpha = 0; continue; }
      s.alpha = (q < 0.15 ? q / 0.15 : q > 0.7 ? (1 - q) / 0.3 : 1) * fade;
      if (m === "rise") { s.x = Math.cos(s.a0) * R * (0.4 + 0.6 * s.v) + 6 * Math.sin(4 * time + s.a0); s.y = 28 - q * (90 + 60 * K) * s.v; }
      else if (m === "orbit") { const a = s.a0 + 2.2 * time * s.v, r = R + 8 * Math.sin(3 * time + s.a0); s.x = Math.cos(a) * r; s.y = Math.sin(a) * r; s.alpha = fade * (0.4 + 0.6 * Math.abs(Math.sin(5 * time + 3 * s.a0))); }
      else if (m === "burst") { const d = q * (70 + 90 * K) * s.v; s.x = Math.cos(s.a0) * d; s.y = Math.sin(s.a0) * d + 60 * q * q; s.rotation = s.spin * time; }
      else if (m === "spiral") { const a = s.a0 + 5 * q, d = (1 - q) * (100 + 40 * K) + 18; s.x = Math.cos(a) * d; s.y = Math.sin(a) * d; s.rotation = a + Math.PI / 2; }
      else if (m === "ripple") { s.x = Math.cos(s.a0) * R * 0.8 * s.v; s.y = 110 * q - 110 + 10 * Math.sin(s.a0); }
      else if (m === "runes") { const odd = parts.indexOf(s) % 2, a = s.a0 + time * (odd ? -1.6 : 1.1), d = odd ? 0.75 * R : 1.25 * R; s.x = Math.cos(a) * d; s.y = Math.sin(a) * d; s.rotation = 2 * time; s.alpha = fade * (0.5 + 0.5 * Math.sin(4 * time + 2 * s.a0)); }
      else if (m === "fall") { s.x = Math.cos(s.a0) * R * 1.2 * s.v + 16 * Math.sin(3 * time + s.a0); s.y = 220 * q - 120; s.rotation = s.spin * time * 0.5; }
      else if (m === "wings") { const d = q * (90 + 110 * K) * s.v; s.x = Math.cos(s.a0) * d; s.y = Math.sin(s.a0) * d * 0.8 - 20 + 50 * q * q; s.rotation = s.spin * time; }
    }
  }, () => { if (!back.destroyed) back.destroy({ children: true }); if (!front.destroyed) front.destroy({ children: true }); });
  themeFx(seat, male, lv, dur, K, animate, valid);
}

/** Ud.themeFx: male = black/gold feathers falling, female = hearts and pink sparkles rising; small wings below level 81. */
function themeFx(seat: Container, male: boolean, lv: number, dur: number, K: number, animate: Animate, valid: () => boolean) {
  const back = new Container(), front = new Container();
  back.eventMode = front.eventMode = "none";
  type T = Sprite & { m: "fall" | "rise"; a0: number; v: number; d: number; spin: number };
  const items: T[] = [];
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const n = Math.round(6 + 10 * K);
  for (let i = 0; i < n; i++) {
    const tex = male ? ptex("feather", i % 3 ? "#141414" : "#d4a017") : i % 3 ? emojiTex("💖") : emojiTex("✨", "#ff7ac6", 0.6);
    const s = sprite(tex, (male ? rnd(16, 26) : rnd(14, 22)) * (0.8 + 0.5 * K)) as T;
    s.alpha = 0; s.m = male ? "fall" : "rise"; s.a0 = rnd(0, 6.28); s.v = rnd(0.7, 1.3); s.d = (i / n) * dur * 0.5; s.spin = male ? rnd(-2, 2) : 0;
    front.addChild(s); items.push(s);
  }
  const wingViews = lv < 81 ? wings(5 + Math.round(4 * K), male, 28, 2.2, 0.18) : [];
  wingViews.forEach((w) => { w.alpha = 0; back.addChild(w); });
  attach(seat, back, front);
  animate(dur, (p, time) => {
    if (back.destroyed) return;
    if (!valid()) { back.destroy({ children: true }); if (!front.destroyed) front.destroy({ children: true }); return; }
    const fade = p < 0.08 ? p / 0.08 : p > 0.85 ? (1 - p) / 0.15 : 1;
    for (const s of items) {
      const q = (time - s.d) / (0.6 * dur);
      if (q <= 0 || q >= 1) { s.alpha = 0; continue; }
      s.alpha = fade * (q < 0.15 ? q / 0.15 : q > 0.7 ? (1 - q) / 0.3 : 1);
      if (s.m === "fall") { s.x = 60 * Math.cos(s.a0) * s.v + 14 * Math.sin(3 * time + s.a0); s.y = 200 * q - 110; s.rotation = s.spin * time * 0.6; }
      else { s.x = 46 * Math.cos(s.a0) * s.v + 6 * Math.sin(4 * time + s.a0); s.y = 26 - 130 * q * s.v; }
    }
    for (const w of wingViews) { const m = Math.min(1, time / 0.6); w.scale.set((0.5 + 0.8 * K) * (1 - Math.pow(1 - m, 3))); w.rotation = 0.1 * w.side * Math.sin(6 * time); w.alpha = fade; }
  }, () => { if (!back.destroyed) back.destroy({ children: true }); if (!front.destroyed) front.destroy({ children: true }); });
}
