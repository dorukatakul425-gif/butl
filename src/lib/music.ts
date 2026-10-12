// Ported from the game's CilizMusicService / YTVideoService / CilizVideoService: live catalogues from the game servers.
export interface MusicItem {
  artist: string;
  duration: number;
  icon?: string | undefined;
  song_id: string;
  provider: "cz" | "yt";
  title: string;
  url: string;
}

export interface MusicService {
  id: "cz" | "yt";
  musicPrice: number;
  confirmationTitleId: string;
  mediaSearchCooldown: number;
  supportsMusicTabs: boolean;
  search(query: string): Promise<MusicItem[]>;
  getPopular(): Promise<MusicItem[]>;
  getMusicByIds(ids: string[]): Promise<MusicItem[]>;
}

const qs = (params: Record<string, string | number>) =>
  Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");

async function loadJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wrong response: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

interface CzRaw { id: string; artist?: string; title?: string; duration: number; url?: string }

export class CilizMusicService implements MusicService {
  readonly id = "cz" as const;
  readonly musicCount = 48;
  readonly musicPrice = 5;
  readonly supportsMusicTabs = true;
  readonly confirmationTitleId = "ios:dlg:music_confirm:title";
  readonly mediaSearchCooldown = 200;
  constructor(private host: string, private receiver: { country: string; age: number }, private platform: string) {}
  private updateUrl(url: string) { return url.replace("http://", "https://"); }
  parseResponse(response: CzRaw[] | null): MusicItem[] {
    if (!response) return [];
    return response.filter(item => item.url).map(item => ({
      artist: item.artist || "",
      duration: item.duration,
      song_id: item.id,
      provider: "cz" as const,
      title: item.title || "",
      url: this.updateUrl(item.url ?? ""),
    }));
  }
  async getDefaultAudios() {
    return this.parseResponse(await loadJSON<CzRaw[]>(`${this.host}/get_by_ids_and_popular?${qs({ count: this.musicCount })}`));
  }
  async search(query: string) {
    if (!query) return this.getDefaultAudios();
    const params = qs({ query, count: this.musicCount, country: this.receiver.country, age: this.receiver.age, platform: this.platform });
    return this.parseResponse(await loadJSON<CzRaw[]>(`${this.host}/search?${params}`));
  }
  getPopular() { return this.search(""); }
  async getMusicByIds(ids: string[]) {
    if (!ids.length) return [];
    const songs = this.parseResponse(await loadJSON<CzRaw[]>(`${this.host}/get_by_ids_and_popular?${qs({ ids: ids.join(","), count: 0 })}`));
    const byId = new Map(songs.map(s => [s.song_id, s]));
    return ids.map(id => byId.get(id)).filter((s): s is MusicItem => !!s);
  }
}

// CilizVideoService request(): main host first, proxy as fallback, 10s timeout.
const YT_BASE = "https://youtube.ciliz.com/";
const YT_PROXY = "https://api-proxy.ciliz.com/youtube/";
let useProxy = false;
interface YtRaw { id: string; title?: string; icon?: string; duration: number }
async function ytRequest(method: string, params: Record<string, string | number>): Promise<YtRaw[]> {
  if (method === "get_by_ids" && "id" in params && !params["id"]) return [];
  const query = qs(params);
  const get = (proxy: boolean) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    return fetch(`${proxy ? YT_PROXY : YT_BASE}${method}?${query}`, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(`video server ${r.status}`); return r.json(); })
      .finally(() => clearTimeout(timer));
  };
  const proxy = useProxy;
  let result: unknown;
  try { result = await get(proxy); } catch { result = await get(!proxy); useProxy = !proxy; }
  return Array.isArray(result) ? (result as YtRaw[]) : [];
}

const item2music = (item: YtRaw): MusicItem => ({
  artist: "",
  duration: item.duration,
  icon: item.icon,
  song_id: item.id,
  provider: "yt",
  title: item.title || "",
  url: `https://www.youtube.com/watch?v=${item.id}`,
});

export function social2platform(id: string) {
  switch (id) {
    case "as": case "fb": case "gg": return "bottle_fb";
    default: return `bottle_${id}`;
  }
}

export class YTVideoService implements MusicService {
  readonly id = "yt" as const;
  readonly musicPrice = 9;
  readonly videoCount = 48;
  readonly supportsMusicTabs = true;
  readonly confirmationTitleId = "dlg:video:title";
  readonly mediaSearchCooldown = 200;
  constructor(private p: { socialId: string; user_country: string; user_vip: boolean }) {}
  async search(query: string) {
    const q = query ? query.replace(/[-.,]/gi, "") : "";
    if (!q || /^[ ]*$/.test(q)) {
      return (await ytRequest("popular", { count: this.videoCount, platform: social2platform(this.p.socialId), user_country: this.p.user_country })).map(item2music);
    }
    return (await ytRequest("search", { q, count: this.videoCount, user_vip: this.p.user_vip ? "1" : "0" })).map(item2music);
  }
  getPopular() { return this.search(""); }
  async getMusicByIds(ids: string[]) {
    if (!ids.length) return [];
    return (await ytRequest("get_by_ids", { id: ids.join(",") })).map(item2music);
  }
}

export function secondsToMMSS(sec: number) {
  const two = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const m = Math.floor(sec / 60);
  return `${two(m)}:${two(Math.floor(sec - m * 60))}`;
}

/** MusicFolderServiceCache: newest first, capped at the folder limit. Kept on this device. */
export class MusicFolder {
  songs: string[];
  constructor(private key: string, readonly limit: number) {
    let saved: unknown = [];
    try { saved = JSON.parse(localStorage.getItem(key) || "[]"); } catch { /* ignore */ }
    this.songs = Array.isArray(saved) ? saved.filter((v): v is string => typeof v === "string") : [];
  }
  mark(id: string, on: boolean) {
    let songs = this.songs.filter(o => o !== id);
    if (on) songs.unshift(id);
    this.songs = songs.slice(0, this.limit);
    try { localStorage.setItem(this.key, JSON.stringify(this.songs)); } catch { /* ignore */ }
  }
  has(id: string) { return this.songs.includes(id); }
  get hasSpace() { return this.songs.length < this.limit; }
}
