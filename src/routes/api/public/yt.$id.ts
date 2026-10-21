import { createFileRoute } from "@tanstack/react-router";

// Fallback video stream for players whose network blocks YouTube (e.g. Russia):
// the VPS downloads the clip once with yt-dlp (360p mp4, merged with ffmpeg when
// YouTube has no single-file format), caches it on disk and serves it with ranges.
const ID_RE = /^[\w-]{11}$/;
const pending = new Map<string, Promise<string>>();
const MAX_CACHE_BYTES = 3 * 1024 ** 3;

async function cacheDir() {
  const fs = await import("node:fs/promises");
  const dir = process.env.YT_CACHE_DIR || "/var/cache/butl-yt";
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function prune(dir: string) {
  const fs = await import("node:fs/promises");
  const names = (await fs.readdir(dir)).filter((n) => n.endsWith(".mp4"));
  const stats = await Promise.all(names.map(async (n) => ({ n, s: await fs.stat(`${dir}/${n}`) })));
  stats.sort((a, b) => b.s.atimeMs - a.s.atimeMs);
  let total = 0;
  for (const { n, s } of stats) {
    total += s.size;
    if (total > MAX_CACHE_BYTES) await fs.rm(`${dir}/${n}`, { force: true });
  }
}

async function ensureFile(id: string): Promise<string> {
  const fs = await import("node:fs/promises");
  const dir = await cacheDir();
  const file = `${dir}/${id}.mp4`;
  try { await fs.access(file); return file; } catch { /* download */ }
  const running = pending.get(id);
  if (running) return running;
  const job = (async () => {
    const { execFile } = await import("node:child_process");
    const tmp = `${dir}/${id}.part-${Date.now()}`;
    await new Promise<void>((resolve, reject) => {
      execFile(
        process.env.YTDLP_BIN || "yt-dlp",
        ["--js-runtimes", "node", "--no-playlist", "--no-part", "--max-filesize", "400M",
          "-f", "18/bv*[height<=360][ext=mp4]+ba[ext=m4a]/b[height<=480]/bv*[height<=480]+ba/b",
          "--merge-output-format", "mp4", "-o", `${tmp}.%(ext)s`, `https://www.youtube.com/watch?v=${id}`],
        { timeout: 170000, maxBuffer: 4 << 20 },
        (err) => (err ? reject(err) : resolve()),
      );
    });
    const made = (await fs.readdir(dir)).find((n) => n.startsWith(`${id}.part-`) && n.endsWith(".mp4"));
    if (!made) throw new Error("no file");
    await fs.rename(`${dir}/${made}`, file);
    void prune(dir).catch(() => undefined);
    return file;
  })().finally(() => pending.delete(id));
  pending.set(id, job);
  return job;
}

async function serveFile(file: string, range: string | null): Promise<Response> {
  const fs = await import("node:fs");
  const { Readable } = await import("node:stream");
  const size = (await fs.promises.stat(file)).size;
  const base = { "content-type": "video/mp4", "accept-ranges": "bytes", "cache-control": "public, max-age=3600" };
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (m && (m[1] || m[2])) {
    let start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
    let end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    if (start >= size) return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}` } });
    if (end < start) end = size - 1;
    start = Math.max(0, start);
    const body = Readable.toWeb(fs.createReadStream(file, { start, end })) as ReadableStream;
    return new Response(body, { status: 206, headers: { ...base, "content-length": String(end - start + 1), "content-range": `bytes ${start}-${end}/${size}` } });
  }
  const body = Readable.toWeb(fs.createReadStream(file)) as ReadableStream;
  return new Response(body, { status: 200, headers: { ...base, "content-length": String(size) } });
}

export const Route = createFileRoute("/api/public/yt/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const raw = params.id;
        const thumb = raw.endsWith(".jpg");
        const id = thumb ? raw.slice(0, -4) : raw;
        if (!ID_RE.test(id)) return new Response("bad id", { status: 400 });
        try {
          if (thumb) {
            const r = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
            return new Response(r.body, { status: r.status, headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=86400" } });
          }
          return await serveFile(await ensureFile(id), request.headers.get("range"));
        } catch {
          return new Response("unavailable", { status: 502 });
        }
      },
    },
  },
});
