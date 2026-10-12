// Disposable public catalogue cache only; never cache accounts or purchase results.
let cached: { expires: number; manifest: Record<string, Record<string, unknown>> } | undefined;
let loading: Promise<Record<string, Record<string, unknown>>> | undefined;

export async function purchaseManifest() {
  if (cached && cached.expires > Date.now()) return cached.manifest;
  if (loading) return loading;
  loading = loadManifest();
  try { return await loading; }
  finally { loading = undefined; }
}

async function loadManifest() {
  const response = await fetch('https://cdn-s.ciliz.com/mobile/server.json');
  if (!response.ok) throw new Error('Ürün listesi yüklenemedi.');
  const server = await response.json() as { assets: { url: string } };
  const url = new URL(server.assets.url);
  if (url.protocol !== 'https:' || !(url.hostname.endsWith('.ciliz.com') || url.hostname === 'butilochka.cdnvideo.ru')) throw new Error('Ürün kaynağı doğrulanamadı.');
  const manifestResponse = await fetch(url);
  if (!manifestResponse.ok) throw new Error('Ürünler yüklenemedi.');
  const manifest = await manifestResponse.json() as Record<string, Record<string, unknown>>;
  cached = { manifest, expires: Date.now() + 60000 };
  return manifest;
}