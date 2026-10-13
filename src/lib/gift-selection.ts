// Browser-safe port of TablePresenter.selectedUsers / selectMen / selectWomen and TableUserView selection state.
export type SeatSelection = "none" | "highlighted" | "selectable" | "selected";

export interface GiftTargetState {
  receiver: number | null;
  selective: boolean;
  selected: number[];
}

export const closedTarget: GiftTargetState = { receiver: null, selective: false, selected: [] };

/** showGifts(receiver): solo receiver, highlighted; re-targets an already open dialog. */
export function openFor(state: GiftTargetState, seat: number, viewerSeat: number): GiftTargetState {
  if (seat === viewerSeat) return state;
  if (state.selective && state.receiver !== null) return toggleSeat(state, seat, viewerSeat);
  return { receiver: seat, selective: false, selected: [seat] };
}

/** pointertap while selectable: isSelected = !isSelected. */
export function toggleSeat(state: GiftTargetState, seat: number, viewerSeat: number): GiftTargetState {
  if (seat === viewerSeat) return state;
  const selected = state.selected.includes(seat) ? state.selected.filter(s => s !== seat) : [...state.selected, seat];
  return { ...state, selected };
}

/** onselectstatechange(isSelective): selection resets to the dialog's receiver. */
export function setSelective(state: GiftTargetState, selective: boolean): GiftTargetState {
  if (state.receiver === null) return state;
  return { ...state, selective, selected: [state.receiver] };
}

/** selectMen / selectWomen: adds every non-viewer of that gender, keeping existing picks. */
export function selectGender(state: GiftTargetState, males: boolean[], male: boolean, viewerSeat: number): GiftTargetState {
  const selected = [...state.selected];
  males.forEach((isMale, seat) => {
    if (seat !== viewerSeat && isMale === male && !selected.includes(seat)) selected.push(seat);
  });
  return { ...state, selected };
}

/** giftStore.onsend -> viewerSendGift(tablePresenter.selectedUsers): solo sends to the receiver only. */
export function giftReceivers(state: GiftTargetState): number[] {
  if (state.receiver === null) return [];
  return state.selective ? [...state.selected].sort((a, b) => a - b) : [state.receiver];
}

/** updateSelection(): selectable/selected while selective, otherwise chat highlight on the receiver. */
export function seatSelection(state: GiftTargetState, seat: number, viewerSeat: number): SeatSelection {
  if (state.receiver === null) return "none";
  if (state.selective) return seat === viewerSeat ? "none" : state.selected.includes(seat) ? "selected" : "selectable";
  return seat === state.receiver ? "highlighted" : "none";
}
