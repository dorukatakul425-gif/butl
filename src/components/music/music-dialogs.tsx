import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { translate, type CilizAssets } from "@/lib/ciliz-assets";
import { MusicFolder, secondsToMMSS, type MusicItem, type MusicService } from "@/lib/music";
import { YouTubeFrame } from "@/components/music/youtube-player";

// Markup and class names ported from MusicListDialog.tsx, MusicPreviewDialog.tsx, PreviewAudioPlayer.tsx and Dialog.*.
const bem = (block: string) => (element = "", mods: Array<string | false | undefined> = []) => {
  const base = element ? `${block}__${element}` : block;
  return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
const listCls = bem("music-list");
const previewCls = bem("music-preview");
const audioCls = bem("preview-audio-player");
const TABS = ["hot", "favourites", "history", "search"] as const;
type Tab = (typeof TABS)[number];
const SPACING = 10;
const CHUNK = 20;

/** CSSTransition('popup--center', 'popup--show', 'popup--hide'). */
function usePopupPhase(open: boolean) {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<"show" | "hide" | null>(null);
  useEffect(() => {
    if (open) {
      setMounted(true);
      setPhase("show");
      const id = window.setTimeout(() => setPhase(null), 300);
      return () => window.clearTimeout(id);
    }
    if (!mounted) return;
    setPhase("hide");
    const id = window.setTimeout(() => { setMounted(false); setPhase(null); }, 100);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return { mounted, phase };
}

function PopupShell({ open, onClose, className, label, z, children }: { open: boolean; onClose: () => void; className: string; label: string; z: number; children: ReactNode }) {
  const { mounted, phase } = usePopupPhase(open);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose]);
  if (!mounted) return null;
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: z, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <div role="dialog" aria-modal="true" aria-label={label}
          className={["popup", className, "popup--center", phase === "show" && "popup--show", phase === "hide" && "popup--hide"].filter(Boolean).join(" ")}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <div className="popup__close popup__close--dlg" onClick={onClose} role="button" aria-label="Kapat">
    <div className="popup__close-icon" />
  </div>
);

interface Song { id: string; artist: string; title: string; duration: string; icon?: string | undefined; favourite: boolean; music: MusicItem }

export interface MusicListDialogProps {
  open: boolean;
  type: "audio" | "video";
  assets: CilizAssets;
  service: MusicService;
  onPurchase: (music: MusicItem) => void;
  onClose: () => void;
}

export function MusicListDialog({ open, type, assets, service, onPurchase, onClose }: MusicListDialogProps) {
  const t = (key: string) => translate(assets, key);
  const [tab, setTab] = useState<Tab>("hot");
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [shown, setShown] = useState(CHUNK);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const debounce = useRef<number | undefined>(undefined);
  const folders = useRef<{ fav: MusicFolder; history: MusicFolder } | null>(null);
  if (!folders.current && typeof window !== "undefined") {
    const prefix = type === "audio" ? "songs" : "videos";
    folders.current = { fav: new MusicFolder(`bottle-fav_${prefix}`, 50), history: new MusicFolder(`bottle-history_${prefix}`, 50) };
  }

  // MusicPresenter.updateSongs(): only the latest request may update the list.
  const update = useCallback(async (load: () => Promise<MusicItem[]>) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const items = await load();
      if (id !== requestId.current) return;
      const fav = folders.current?.fav;
      setSongs(items.map((music) => ({ id: music.song_id, artist: music.artist, title: music.title, duration: secondsToMMSS(music.duration), icon: music.icon, favourite: !!fav?.has(music.song_id), music })));
      setShown(CHUNK);
    } catch (error) {
      console.info(error);
      if (id === requestId.current) setSongs([]);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  const updateTab = useCallback((next: Tab, search: string) => {
    const f = folders.current;
    window.clearTimeout(debounce.current);
    switch (next) {
      case "search":
        if (search.trim() === "" || type === "audio") void update(() => service.search(search));
        else debounce.current = window.setTimeout(() => void update(() => service.search(search)), service.mediaSearchCooldown);
        break;
      case "hot": void update(() => service.getPopular()); break;
      case "favourites": void update(() => service.getMusicByIds(f?.fav.songs ?? [])); break;
      case "history": void update(() => service.getMusicByIds(f?.history.songs ?? [])); break;
    }
  }, [service, type, update]);

  useEffect(() => { if (open) updateTab(tab, query); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [songs]);
  useEffect(() => () => window.clearTimeout(debounce.current), []);

  const onTab = (next: Tab) => { if (next === tab) return; setTab(next); updateTab(next, query); };
  const onSearch = (value: string) => {
    setQuery(value);
    // The original search input always triggers onsearch, even from another tab.
    updateTab("search", value);
  };
  const markFavourite = (song: Song) => {
    const fav = folders.current?.fav;
    if (!fav) return;
    if (!song.favourite && !fav.hasSpace) return;
    fav.mark(song.id, !song.favourite);
    setSongs((list) => list.map((s) => (s.id === song.id ? { ...s, favourite: !s.favourite } : s)));
  };
  const purchase = (music: MusicItem) => {
    folders.current?.history.mark(music.song_id, true);
    onPurchase(music);
  };
  const onScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 35) setShown((n) => Math.min(songs.length, n + CHUNK));
  };

  const titles: Record<Tab, string> = { hot: t("dlg:music:title:hot"), favourites: t("dlg:music:title:favourites"), history: t("dlg:music:title:history"), search: t("dlg:music:title:search") };
  const searchHint = type === "audio" ? t("dlg:music:search_btn") : t("dlg:video:search:hint");
  const showList = !loading && songs.length > 0;
  const visible = songs.slice(0, shown);

  return (
    <PopupShell open={open} onClose={onClose} className={listCls("x_popup")} label={t("dlg:music:title")} z={1000}>
      <div className={`popup__header ${listCls("x_popup__header")}`}>
        <div className={listCls("tabs")}>
          {TABS.map((name) => (
            <div key={name} id={name} role="button" aria-label={titles[name]}
              className={`${listCls("tab")} ${listCls(`${name}-tab`, name === tab ? [] : ["inactive"])}`} onClick={() => onTab(name)} />
          ))}
        </div>
        <div className={listCls("title")}>{titles[tab]}</div>
        <SearchControls inactive={tab !== "search"} hint={searchHint} value={query} onInput={onSearch} />
        <CloseButton onClose={onClose} />
      </div>
      <div ref={scrollRef} onScroll={onScroll} className={`popup__content ${listCls("x_popup__content")}`}>
        {loading && <div className={listCls("loading")}><div className={listCls("loading-icon")} /></div>}
        {showList && (
          <div className={type === "video" ? listCls("video-list") : ""}>
            {type === "audio"
              ? visible.map((song) => (
                  <div key={`audio-item-${song.id}`} className={listCls("audio-item")} onClick={(e) => { e.stopPropagation(); purchase(song.music); }}>
                    <div className={listCls("audio-desc")}>
                      <span className={listCls("song")}>{song.title}</span>
                      <span className={listCls("artist")}>{song.artist}</span>
                    </div>
                    <div className={listCls("audio-duration")}>{song.duration}</div>
                    <div className={`${listCls("favourite")} ${listCls("favourite--audio")} ${song.favourite ? "" : listCls("favourite--inactive")}`}
                      onClick={(e) => { e.stopPropagation(); markFavourite(song); }} />
                  </div>
                ))
              : visible.map((song, idx) => (
                  <div key={song.id} className={listCls("video-item")} style={{ marginRight: idx % 2 === 0 ? SPACING : 0 }} onClick={() => purchase(song.music)}>
                    <div className={listCls("video-thumbnail-container")}>
                      <div style={{ backgroundImage: `url('${song.icon}')` }} className={listCls("video-thumbnail")} />
                      <div className={`${listCls("favourite")} ${listCls("favourite--video")} ${song.favourite ? "" : listCls("favourite--inactive")}`}
                        onClick={(e) => { e.stopPropagation(); markFavourite(song); }} />
                      <div className={listCls("video-duration")}>{song.duration}</div>
                    </div>
                    <div className={listCls("video-desc")}>{song.title}</div>
                  </div>
                ))}
          </div>
        )}
        {!loading && songs.length === 0 && <div className={listCls("empty")}>{t("html:dlg:music:empty")}</div>}
      </div>
      <div className="popup__footer" />
    </PopupShell>
  );
}

function SearchControls({ inactive, hint, value, onInput }: { inactive: boolean; hint: string; value: string; onInput: (v: string) => void }) {
  return (
    <div className={`${listCls("search")} ${inactive ? "" : listCls("search--active")}`}>
      <div className={listCls("search-icon")} />
      <input className={listCls("search-input")} value={value} placeholder={hint} aria-label={hint} onChange={(e) => onInput(e.target.value)} />
      <div className={`${listCls("search-reset")} ${value === "" ? "" : listCls("search-reset--active")}`} onClick={() => onInput("")} />
    </div>
  );
}

function PreviewAudioPlayer({ song }: { song: MusicItem }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => { setPlaying(false); setTime(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => { audio.pause(); audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("loadedmetadata", onMeta); audio.removeEventListener("ended", onEnd); };
  }, []);
  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); return; }
    setPlaying(true);
    audio.play().catch(() => setPlaying(false));
  };
  const pct = duration > 0 ? (time / duration) * 100 : 0;
  return (
    <div className={audioCls("", [duration > 0 ? "" : "loading"])}>
      <audio ref={ref} src={song.url} preload="metadata" />
      <div className={audioCls("button", [playing ? "pause" : "play", duration > 0 ? "" : "disabled"])} onClick={toggle} role="button" aria-label={playing ? "Durdur" : "Çal"} />
      <input className={audioCls("slider")} type="range" min={0} max={Math.ceil(duration)} step={1} value={time} aria-label="İlerleme"
        onChange={(e) => { const v = Number(e.target.value); if (ref.current) ref.current.currentTime = v; setTime(v); }}
        style={{ background: `linear-gradient(to right, #9dc93b ${pct}%, rgba(0, 0, 0, 0.08) ${pct}%)` }} />
      <div className={audioCls("time")}>{time > 0 ? secondsToMMSS(time) : duration ? secondsToMMSS(duration) : ""}</div>
    </div>
  );
}

/** jsxReplaceTags(): fills <title/> and <price/> in the translated template. */
function replaceTags(tmpl: string, tags: Record<string, () => ReactNode>) {
  return tmpl.split(/(<\w+\/>)/g).map((part, i) => {
    const m = part.match(/^<(\w+)\/>$/);
    const f = m?.[1] ? tags[m[1]] : undefined;
    return <span key={i}>{f ? f() : part}</span>;
  });
}

export interface MusicPreviewDialogProps {
  open: boolean;
  assets: CilizAssets;
  service: MusicService;
  music: MusicItem | null;
  onConfirm: (music: MusicItem) => void;
  onClose: () => void;
}

export function MusicPreviewDialog({ open, assets, service, music, onConfirm, onClose }: MusicPreviewDialogProps) {
  const [sent, setSent] = useState(false);
  useEffect(() => { if (open) setSent(false); }, [open, music]);
  const t = (key: string) => translate(assets, key);
  const isVideo = service.id === "yt";
  const tmpl = isVideo ? t("dlg:video_preview:context2:v3") : t("ios:dlg:music_confirm:desc2:v3");
  const title = music ? (isVideo ? music.title : music.artist ? `${music.artist} - ${music.title}` : music.title) : "";
  return (
    <PopupShell open={open && !!music} onClose={onClose} className={previewCls("x_popup")} label={t(service.confirmationTitleId)} z={1010}>
      <div className="popup__header">
        <div className="popup__title">{t(service.confirmationTitleId)}</div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="popup__content popup__content--center">
        {music && (isVideo
          ? <div className={`${previewCls("player")} universal-player`}><YouTubeFrame videoId={music.song_id} preview /></div>
          : <div className={previewCls("audio-preview-container")}><PreviewAudioPlayer key={music.song_id} song={music} /></div>)}
        <div className={previewCls("context")}>
          {replaceTags(tmpl, { title: () => title, price: () => <div className={previewCls("heart")}>{service.musicPrice}</div> })}
        </div>
      </div>
      <div className="popup__buttons popup__buttons--center">
        <div className="button button--cancel" role="button" onClick={onClose}>{t("ios:dlg:music_confirm:cancel")}</div>
        <div className="button button--confirm" role="button" onClick={() => { if (sent || !music) return; setSent(true); onConfirm(music); }}>{t("ios:dlg:music_confirm:confirm")}</div>
      </div>
    </PopupShell>
  );
}
