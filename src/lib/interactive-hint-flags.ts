// session.interactiveHints / setInteractiveHints from the original client. The bitmask
// belongs to the player account: the backend adapter replaces the local preview store,
// so each real player sees every hint once, on any device.
export const HINT_MASKS = { message: 1 << 0, choice: 1 << 1, gift: 1 << 2 } as const;
export type HintScenario = keyof typeof HINT_MASKS;
export const HINT_SCENARIOS: HintScenario[] = ["message", "choice", "gift"];

export interface HintFlagsAdapter {
  /** undefined = account flags not loaded yet; original shows no hints in that case. */
  read(): number | undefined;
  write(flags: number): void;
}

const STORAGE_KEY = "bottle:interactive-hints";
const localAdapter: HintFlagsAdapter = {
  read: () => { try { return Number(window.localStorage.getItem(STORAGE_KEY)) || 0; } catch { return 0; } },
  write: v => { try { window.localStorage.setItem(STORAGE_KEY, String(v)); } catch { /* ignore */ } },
};
let adapter: HintFlagsAdapter = localAdapter;
export const setHintFlagsAdapter = (next: HintFlagsAdapter | null) => { adapter = next ?? localAdapter; };
export const readHintFlags = () => adapter.read();
export const markHintFinished = (scenario: HintScenario) => adapter.write((adapter.read() ?? 0) | HINT_MASKS[scenario]);

export function pendingScenarios(flags: number | undefined): HintScenario[] {
  if (flags === undefined) return [];
  return HINT_SCENARIOS.filter(name => !(HINT_MASKS[name] & flags));
}

// Seat photo locator registered by the table renderer (tablePresenter.user2presenter).
type SeatLocator = (seat: number) => { x: number; y: number } | null;
let seatLocator: SeatLocator | null = null;
export const setSeatLocator = (fn: SeatLocator | null) => { seatLocator = fn; };
export const locateSeat = (seat: number) => seatLocator?.(seat) ?? null;
export const GIFT_SENT_EVENT = "source:viewer-send-gift";
