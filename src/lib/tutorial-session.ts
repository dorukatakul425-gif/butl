// Scripted first-entry tutorial, mirroring the original Telegram client's
// TutorialPresenter: 5 steps with a fake table, then handoff to a real table.
//   1 spin → 2 kiss/refuse → 3 gift exchange → 4 chat → 5 join real table
// Pure state machine so the flow is unit-testable without the DOM.

export const TUTORIAL_STEPS = 5;

export interface TutorialPlayer {
  seat: number;
  name: string;
  male: boolean;
  /** Emoji avatar placeholder — fake players have no real photos. */
  avatar: string;
}

export type TutorialStep = "spin" | "kiss" | "gift" | "chat" | "finish";

export interface TutorialState {
  step: TutorialStep;
  stepIndex: number; // 1-based, shown as "n/5"
  players: TutorialPlayer[];
  viewerSeat: number;
  opponentSeat: number;
  bottleSpinning: boolean;
  kissed: boolean;
  giftFromOpponent: string | null;
  giftSent: string | null;
  chat: Array<{ from: "opponent" | "viewer"; text: string }>;
}

/** Fake roster (Azerbaijani names), like the original's localized demo roster. */
const MALE_NAMES: Array<[string, string]> = [
  ["Elvin", "🧑🏻"], ["Tural", "🧑🏽"], ["Rəşad", "👨🏻"], ["Orxan", "🧔🏻"], ["Samir", "👨🏽"], ["Elmar", "🧑🏼"],
];
const FEMALE_NAMES: Array<[string, string]> = [
  ["Aysel", "👩🏻"], ["Nigar", "👩🏽"], ["Günel", "👱🏻‍♀️"], ["Lamiyə", "👩🏼"], ["Aynur", "👩🏻‍🦰"],
];

export const TUTORIAL_GIFTS = ["🌹", "🧸", "🍾", "💍", "🍓", "🍫"] as const;
/** The opponent always opens the gift exchange with this one (original: sexonthebeach). */
export const OPPONENT_GIFT = "🍹";

export const TUTORIAL_TEXT = {
  spin: "Şişəni çevirmək üçün şişəyə toxun",
  kiss: "Şişə sənə düşdü! Qarşındakı oyunçunu öpəcəksən, yoxsa rədd edəcəksən?",
  gift: (name: string) => `${name} sənə hədiyyə göndərdi! İndi sən ona hədiyyə göndər — şəklinə toxun`,
  chat: "İndi söhbətə bir mesaj yaz",
  finish: "Əla! İndi əsl masaya keç və real oyunçularla oyna",
  opponentIncoming: "Salam! Oyuna xoş gəldin 😊",
  viewerOutgoing: "Salam! Çox sağ ol 😊",
} as const;

export function createTutorial(viewerMale: boolean): TutorialState {
  const players: TutorialPlayer[] = [];
  // Viewer sits at seat 0 (original: position 0); opponent of the opposite sex at seat 7.
  players.push({ seat: 0, name: "Sən", male: viewerMale, avatar: "⭐" });
  const males = [...MALE_NAMES], females = [...FEMALE_NAMES];
  const opponentPool = viewerMale ? females : males;
  const [opponentName, opponentAvatar] = opponentPool.shift()!;
  for (let seat = 1; seat <= 11; seat++) {
    if (seat === 7) {
      players.push({ seat, name: opponentName, male: !viewerMale, avatar: opponentAvatar });
      continue;
    }
    const pool = seat % 2 === 0 ? females : males;
    const pick = pool.length ? pool.shift()! : ["Oyunçu", "🙂"];
    players.push({ seat, name: pick[0], male: seat % 2 === 1, avatar: pick[1] });
  }
  return {
    step: "spin",
    stepIndex: 1,
    players,
    viewerSeat: 0,
    opponentSeat: 7,
    bottleSpinning: false,
    kissed: false,
    giftFromOpponent: null,
    giftSent: null,
    chat: [],
  };
}

export function opponent(state: TutorialState): TutorialPlayer {
  return state.players.find((p) => p.seat === state.opponentSeat)!;
}

/** Step 1: viewer taps the bottle. */
export function spinBottle(state: TutorialState): TutorialState {
  if (state.step !== "spin" || state.bottleSpinning) return state;
  return { ...state, bottleSpinning: true };
}

/** Bottle animation finished → land on the opponent, move to the kiss choice. */
export function bottleStopped(state: TutorialState): TutorialState {
  if (state.step !== "spin" || !state.bottleSpinning) return state;
  return { ...state, bottleSpinning: false, step: "kiss", stepIndex: 2 };
}

/** Step 2: viewer kisses or refuses; the opponent always kisses back. */
export function answerKiss(state: TutorialState, kiss: boolean): TutorialState {
  if (state.step !== "kiss") return state;
  return {
    ...state,
    kissed: kiss,
    step: "gift",
    stepIndex: 3,
    giftFromOpponent: OPPONENT_GIFT,
  };
}

/** Step 3: viewer picks a gift for the opponent. */
export function sendTutorialGift(state: TutorialState, gift: string): TutorialState {
  if (state.step !== "gift") return state;
  return {
    ...state,
    giftSent: gift,
    step: "chat",
    stepIndex: 4,
    chat: [{ from: "opponent", text: TUTORIAL_TEXT.opponentIncoming }],
  };
}

/** Step 4: viewer sends a chat message. */
export function sendTutorialMessage(state: TutorialState, text: string): TutorialState {
  if (state.step !== "chat") return state;
  const trimmed = text.trim();
  if (!trimmed) return state;
  return {
    ...state,
    step: "finish",
    stepIndex: 5,
    chat: [...state.chat, { from: "viewer", text: trimmed }],
  };
}
