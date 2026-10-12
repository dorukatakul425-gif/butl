import { translate, type CilizAssets } from "@/lib/ciliz-assets";

// OKSocial.purchaseOptions() and BankPresenter.showWithoutPromoImpl() from the original preloader.
export const OK_PURCHASE_OPTIONS = [
  { real: 10, gold: 10, bonus: 0 },
  { real: 50, gold: 50, bonus: 0 },
  { real: 100, gold: 100, bonus: 10 },
  { real: 200, gold: 200, bonus: 40, label: "hit" },
  { real: 500, gold: 500, bonus: 150 },
  { real: 1000, gold: 1000, bonus: 350 },
  { real: 5000, gold: 5000, bonus: 1750, label: "profitable" },
] as const;

export interface BankOptionView {
  real: number;
  gold: number;
  bonus: number;
  price: string;
  idx: number;
  label?: { type: "hit" | "profitable"; text: string } | undefined;
}

/** trans.translate('mobile:ok:bank:real', real) — the server string uses a bare "%" placeholder. */
export function translatePrice(assets: CilizAssets, real: number) {
  const text = assets.translation["mobile:ok:bank:real"] ?? "% OK";
  return text.includes("%0") ? text.replace("%0", String(real)) : text.replace("%", String(real));
}

export function bankOptions(assets: CilizAssets): BankOptionView[] {
  const sorted = [...OK_PURCHASE_OPTIONS].sort((a, b) => b.gold - a.gold);
  return sorted.map((o, i) => ({
    real: o.real,
    gold: o.gold,
    bonus: o.bonus,
    price: translatePrice(assets, o.real),
    // BankDialog: idx = options.length - i
    idx: sorted.length - i,
    label: "label" in o ? { type: o.label, text: translate(assets, `bank:${o.label}`) } : undefined,
  }));
}

/** BankOption: Math.round(bonus * 100 / gold) */
export const bonusPercent = (gold: number, bonus: number) => Math.round((bonus * 100) / gold);
