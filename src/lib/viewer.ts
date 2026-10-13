import { DEFAULT_PHOTO } from "@/lib/ciliz-default-photo";
import type { DecorViewer } from "@/lib/decor-selection";

// Local player profile used until real accounts exist.
export const VIEWER = {
  name: "Sen",
  age: 25,
  male: true,
  photoUrl: DEFAULT_PHOTO,
};

export const VIEWER_STORE: Omit<DecorViewer, "ownedItems"> = {
  social: "ok",
  league: 16,
  maxLeague: 16,
};
