import { getChatPreferences } from "@/lib/chat-preferences";

// ureyimsen Fd: queued full-screen live gift video. The mp4 holds colour on the left half and
// alpha on the right half; a WebGL shader composes them so the scene floats over the table.
// The clip plays with its own sound (muted only when the browser refuses autoplay with sound).
// Without WebGL the Zd.domEffect icon burst is shown instead.

interface Item { video: string; icon: string; name: string; dat: number }

const VERT = "attribute vec2 p;varying vec2 uv;void main(){uv=vec2((p.x+1.0)*.5,1.0-(p.y+1.0)*.5);gl_Position=vec4(p,0,1);}";
const FRAG = "precision mediump float;varying vec2 uv;uniform sampler2D tex;void main(){vec4 rgb=texture2D(tex,vec2(uv.x*.5,uv.y));float a=texture2D(tex,vec2(.5+uv.x*.5,uv.y)).r;gl_FragColor=vec4(rgb.rgb,a);}";

const fx = {
  queue: [] as Item[],
  playing: false,
  playingSince: 0,
  lost: false,
  el: null as HTMLDivElement | null,
  canvas: null as HTMLCanvasElement | null,
  video: null as HTMLVideoElement | null,
  gl: null as WebGLRenderingContext | null,
  tex: null as WebGLTexture | null,
  frameReq: 0,
  playback: 0,
  finish: null as (() => void) | null,

  cancelFrame() {
    if (!this.frameReq) return;
    if (this.video?.cancelVideoFrameCallback) this.video.cancelVideoFrameCallback(this.frameReq);
    else cancelAnimationFrame(this.frameReq);
    this.frameReq = 0;
  },

  play(item: Item) {
    this.queue.push(item);
    while (this.queue.length > 3) this.queue.shift();
    if (this.playing && Date.now() - this.playingSince > 25000) this.finish?.();
    if (!this.playing) this.run();
  },
  run() {
    this.playing = true;
    this.playingSince = Date.now();
    Promise.resolve().then(() => this.next()).catch(() => {
      this.playing = false;
      if (this.queue.length) window.setTimeout(() => this.run(), 300);
    });
  },
  reset() {
    this.playback++;
    this.cancelFrame();
    try { if (this.video) { this.video.pause(); this.video.removeAttribute("src"); this.video.load(); } } catch { /* ignore */ }
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
    this.el?.remove();
    this.el = null; this.canvas = null; this.video = null; this.gl = null; this.tex = null; this.lost = false;
  },
  fallback(item: Item) { domEffect(item.icon); },
  ensure(): boolean {
    if (this.el && this.gl && this.gl.isContextLost?.()) this.reset();
    if (this.el) return true;
    const el = document.createElement("div");
    el.className = "live-gift-fx";
    const canvas = document.createElement("canvas");
    canvas.width = 360; canvas.height = 640; canvas.className = "live-gift-fx__canvas";
    const video = document.createElement("video");
    video.playsInline = true; video.setAttribute("playsinline", ""); video.preload = "auto"; video.className = "live-gift-fx__video";
    el.append(canvas, video);
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return false;
    const sh = (type: number, src: string) => { const s = gl.createShader(type); if (!s) return null; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    const vert = sh(gl.VERTEX_SHADER, VERT), frag = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!prog || !vert || !frag) return false;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    gl.deleteShader(vert); gl.deleteShader(frag);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); this.lost = true; }, false);
    this.el = el; this.canvas = canvas; this.video = video; this.gl = gl; this.tex = tex;
    return true;
  },
  fit() {
    const el = this.el;
    if (!el) return;
    const vv = window.visualViewport;
    const w = Math.round(vv ? vv.width : window.innerWidth), h = Math.round(vv ? vv.height : window.innerHeight);
    let width = w, height = (16 * w) / 9;
    if (height > 1.3 * h) { height = 1.3 * h; width = (9 * height) / 16; }
    el.style.width = `${Math.round(width)}px`;
    el.style.height = `${Math.round(height)}px`;
    el.style.left = `${Math.round((w - width) / 2)}px`;
    el.style.top = `${Math.round(h - height)}px`;
    el.classList.toggle("live-gift-fx--boxed", width < w - 2);
  },
  draw(version: number) {
    if (version !== this.playback) return;
    const gl = this.gl, v = this.video, c = this.canvas;
    if (!gl || !v || !c || v.paused || v.ended) return;
    if (v.readyState >= 2) {
      gl.viewport(0, 0, c.width, c.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    const rvfc = (v as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }).requestVideoFrameCallback;
    this.frameReq = rvfc ? rvfc.call(v, () => this.draw(version)) : requestAnimationFrame(() => this.draw(version));
  },
  async next(): Promise<void> {
    const item = this.queue.shift();
    if (!item) { this.playing = false; return; }
    this.playing = true;
    this.playingSince = Date.now();
    if (this.lost) this.reset();
    if (document.hidden || !this.ensure()) { if (!document.hidden) this.fallback(item); return this.next(); }
    const v = this.video, el = this.el;
    if (!v || !el) { this.playing = false; return; }
    const version = ++this.playback;
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      this.cancelFrame();
      this.playback++;
      this.finish = null;
      window.clearTimeout(guard);
      v.onended = v.onerror = null;
      v.pause(); v.removeAttribute("src"); v.load();
      if (this.gl) { this.gl.clearColor(0, 0, 0, 0); this.gl.clear(this.gl.COLOR_BUFFER_BIT); }
      el.classList.remove("live-gift-fx--on");
      window.setTimeout(() => this.run(), 120);
    };
    const guard = window.setTimeout(done, 20000);
    this.finish = done;
    if (!el.parentNode) document.body.appendChild(el);
    this.fit();
    v.onended = done;
    v.onerror = () => { this.fallback(item); done(); };
    v.muted = false;
    v.src = item.video;
    el.classList.add("live-gift-fx--on");
    try { await v.play(); }
    catch {
      if (finished || version !== this.playback) return;
      try { v.muted = true; await v.play(); }
      catch { if (!finished && version === this.playback) { this.fallback(item); done(); } return; }
    }
    if (!finished && version === this.playback) this.draw(version);
  },
};

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && fx.video && !fx.video.paused) fx.video.dispatchEvent(new Event("ended"));
  });
}

/** Zd.domEffect: glowing icon burst used when the video cannot play. */
function domEffect(src: string) {
  try {
    const previous = document.querySelectorAll('.premium-fx');
    if (previous.length >= 3) previous[0]?.remove();
    const el = document.createElement("div");
    el.className = "premium-fx";
    el.innerHTML = '<div class="premium-fx__ring"></div><div class="premium-fx__rays"></div><div class="premium-fx__sparks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
    const img = document.createElement("img");
    img.className = "premium-fx__img";
    img.src = src;
    el.appendChild(img);
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 2600);
  } catch { /* ignore */ }
}

/** game_live_gift: everyone at the table sees and hears the clip (setting "premium" off hides it). */
export function playLiveGiftVideo(item: Item) {
  if (typeof window === "undefined" || !getChatPreferences().premium) return;
  fx.play(item);
}

/** Warm the browser cache so the first play starts at once. */
const warmed = new Set<string>();
export function preloadLiveGiftVideo(url: string) {
  if (typeof window === "undefined" || warmed.has(url)) return;
  warmed.add(url);
  void fetch(url, { cache: "force-cache" }).catch(() => warmed.delete(url));
}
