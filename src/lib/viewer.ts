import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import type { DecorViewer } from "@/lib/decor-selection";

// Local player profile used until real accounts exist.
// Filled from the signed-in profile before the game mounts (setViewerProfile).
export const VIEWER = {
  id: "",
  playerNo: 0,
  name: "Sen",
  age: 25,
  male: true,
  photoUrl: DEFAULT_PHOTO,
};

export const VIEWER_STORE: Omit<DecorViewer, "ownedItems"> = {
  social: "ok",
  // New accounts start below every league: league frames stay locked, store frames must be bought.
  league: 0,
  maxLeague: 16,
};

export function setViewerProfile(p: { id: string; player_no: number; name: string; age: number | null; male: boolean; photo_url: string | null }) {
  Object.assign(VIEWER, { id: p.id, playerNo: p.player_no, name: p.name, age: p.age ?? 0, male: p.male, photoUrl: p.photo_url || DEFAULT_PHOTO });
}
