import { translate, type CilizAssets, type CilizFrame, type CilizStone } from "@/lib/ciliz-assets";

export type DecorPrice = { type: "open"; price?: number } | { type: "lock" };

export interface DecorItem {
  type: string;
  frame?: CilizFrame | undefined;
  stone?: CilizStone | undefined;
  price: DecorPrice;
  title: string;
  btnTitle: string;
  description: string;
}

export interface DecorViewer {
  /** Social network id used by the game to filter the store (decor.social). */
  social: string;
  league: number;
  maxLeague: number;
  ownedItems: string[];
}

/** Port of DecorSelectionViewModel.Items from preloader.js. */
export function buildDecorItems(assets: CilizAssets, viewer: DecorViewer): DecorItem[] {
  const t = (key: string, ...args: string[]) => translate(assets, key, ...args);
  const items: DecorItem[] = [
    {
      type: "empty",
      price: { type: "open" },
      title: t("dlg:decor_selection:title:empty"),
      btnTitle: t("dlg:decor_selection:btn:apply"),
      description: t("dlg:decor_selection:desc:empty"),
    },
  ];
  for (const decor of assets.decor) {
    if (decor.social && decor.social.indexOf(viewer.social) === -1) continue;
    if (decor.league_s !== undefined && decor.league_s > viewer.maxLeague) continue;
    const item: DecorItem = {
      type: decor.id,
      frame: assets.frames[decor.id],
      stone: assets.stones[decor.id],
      price: { type: "lock" },
      title: "",
      btnTitle: "",
      description: "",
    };
    if (decor.league_s) {
      const isSet = Boolean(item.frame && item.stone);
      const prefix = t(isSet ? "dlg:decor_selection:title:set" : "dlg:decor_selection:title:item");
      item.price = decor.league_s <= viewer.league ? { type: "open" } : { type: "lock" };
      item.btnTitle = t("dlg:decor_selection:btn:apply");
      item.title = `${prefix} ${t(`dlg:league:${decor.league_s}`)}`;
      item.description = t(isSet ? "dlg:decor_selection:desc:league_set" : "dlg:decor_selection:desc:league_item");
    } else if (decor.cond) {
      const owned = viewer.ownedItems.includes(decor.id);
      item.price = owned ? { type: "open" } : decor.storePrice ? { type: "open", price: decor.storePrice } : { type: "lock" };
      item.title = t("dlg:decor_selection:title:set", t(`decor:${decor.id}`));
      item.btnTitle = decor.storePrice && !owned ? t("dlg:decor_selection:btn:buy") : t("dlg:decor_selection:btn:apply");
      item.description = t(decor.cond === "pass" ? "dlg:decor_selection:desc:pass" : "dlg:decor_selection:desc:pass_buy");
    } else {
      continue;
    }
    items.push(item);
  }
  return items;
}

/** DecorSelectionViewModel.find(): the item matching an applied (frame, stone) pair. */
export function findDecorItem(items: DecorItem[], frame = "", stone = "") {
  return items.find((item) => (item.frame?.type || "") === frame && (item.stone?.type || "") === stone) ?? items[0];
}
