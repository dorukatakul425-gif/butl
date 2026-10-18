// Scripted first-entry tutorial — a faithful port of the original Telegram client's
// TutorialPresenter (preloader.js): 5 steps on a demo table with fake players,
// original timings, then handoff to a real table.
//   1 spin → 2 kiss/refuse (opponent kisses back) → 3 gift exchange (opponent sends
//   first, viewer taps opponent's photo, gift dialog) → 4 chat (incoming message,
//   prefilled input) → 5 change-table button → finished dialog with gold bonus.
// Pure state machine so the flow is unit-testable without the DOM.

export const TUTORIAL_STEPS = 5;
export const VIEWER_SEAT = 0;
export const OPPONENT_SEAT = 7;
/** Original: TutorialFinishedDialog grants a gold bonus via addViewerGold. */
export const TUTORIAL_BONUS_GOLD = 50;

export interface TutorialPlayer {
  seat: number;
  name: string;
  male: boolean;
  /** Photo key into TUTORIAL_PHOTOS — fake players use realistic photos. */
  photo: string;
}

export type TutorialStep = "spin" | "kiss" | "gift" | "chat" | "finish";

/** Sub-phases inside a step, mirroring the original awaits/delays. */
export type TutorialPhase =
  | "prompt"        // shade on, waiting for the viewer's tap
  | "spinning"      // bottle animation running
  | "opponent-turn" // step 2: opponent is shown as selected (5 s)
  | "choice"        // step 2: kiss/refuse buttons visible
  | "kiss-back"     // step 2: opponent kisses back
  | "gift-incoming" // step 3: opponent's gift is flying to the viewer (6 s)
  | "pick-photo"    // step 3: opponent's photo spotlighted, wait for tap
  | "gift-dialog"   // step 3: gift sheet open
  | "gift-sent"     // step 3: viewer's gift flying to the opponent (6 s)
  | "chat-incoming" // step 4: opponent's message just arrived
  | "chat-reply"    // step 4: input prefilled, waiting for send
  | "change-table"  // step 5: change-table button spotlighted
  | "done";         // finished dialog visible

export interface TutorialState {
  step: TutorialStep;
  phase: TutorialPhase;
  stepIndex: number; // 1-based, shown as "Addım n/5"
  players: TutorialPlayer[];
  viewerSeat: number;
  opponentSeat: number;
  kissed: boolean | null;
  giftFromOpponent: string | null;
  giftSent: string | null;
  chat: Array<{ from: "opponent" | "viewer"; text: string }>;
}

/** Fake roster (Azerbaijani names) with realistic photos, like the original demo roster. */
const MALE: Array<[string, string]> = [
  ["Elvin", "m1"], ["Tural", "m2"], ["Rəşad", "m3"], ["Orxan", "m4"], ["Samir", "m5"], ["Elmar", "m6"],
];
const FEMALE: Array<[string, string]> = [
  ["Aysel", "f1"], ["Nigar", "f2"], ["Günel", "f3"], ["Lamiyə", "f4"], ["Aynur", "f5"], ["Sevinc", "f6"],
];

/** Original gift store shown in the tutorial dialog (TutorialPresenter.giftsStore). */
export const TUTORIAL_GIFTS: Array<{ id: string; icon: string; name: string }> = [
  { id: "crown1", icon: "👑", name: "Taxt" },
  { id: "air_kiss", icon: "💋", name: "Havadan öpüş" },
  { id: "gem", icon: "💎", name: "Brilyant" },
  { id: "strawberry", icon: "🍓", name: "Çiyələk" },
  { id: "tomato", icon: "🍅", name: "Pomidor" },
  { id: "flower", icon: "🌹", name: "Qızılgül" },
  { id: "milk", icon: "🥛", name: "Süd" },
  { id: "teddybear", icon: "🧸", name: "Ayıcıq" },
  { id: "icecream", icon: "🍦", name: "Dondurma" },
  { id: "champagne", icon: "🍾", name: "Şampan" },
  { id: "wine", icon: "🍷", name: "Şərab" },
  { id: "vanilla", icon: "🍨", name: "Vanil" },
  { id: "bosscap", icon: "🧢", name: "Kepka" },
  { id: "tequilashot", icon: "🥃", name: "Tekila" },
  { id: "weddingring1", icon: "💍", name: "Üzük" },
];
/** The opponent always opens the gift exchange with this one (original: sexonthebeach). */
export const OPPONENT_GIFT = { id: "sexonthebeach", icon: "🍹", name: "Kokteyl" };

export const TUTORIAL_TEXT = {
  step: (n: number) => `Addım ${n}/${TUTORIAL_STEPS}`,
  spin: "Şişəni çevirmək üçün şişəyə toxun",
  kiss: "Şişə sənin üzərində dayandı! Qarşındakı oyunçunu öpəcəksən, yoxsa rədd edəcəksən?",
  gift: (name: string) => `${name} sənə hədiyyə göndərdi! İndi sən ona hədiyyə göndər — şəklinə toxun`,
  giftPointer: "Hədiyyə seç və göndər",
  chat: "İndi söhbətə bir mesaj yaz",
  chatPointer: "Mesajını bura yaz",
  finish: "Əla! İndi əsl masaya keç və real oyunçularla oyna",
  opponentIncoming: "Salam! Oyuna xoş gəldin 😊",
  viewerOutgoing: "Salam! Çox sağ ol 😊",
  finishedTitle: "Təlim bitdi!",
  finishedText: "İndi real oyunçularla oynamağa hazırsan.",
  finishedText2: "Şişəni çevir, öpüş, hədiyyə göndər və söhbət et.",
  finishedText3: "Bonusun hesabına əlavə olundu:",
  finishedBtn: "Oyuna başla",
} as const;

export function createTutorial(viewerMale: boolean): TutorialState {
  const players: TutorialPlayer[] = [];
  // Viewer sits at seat 0 (original: VIEWER_POS); opponent of the opposite sex at seat 7.
  players.push({ seat: VIEWER_SEAT, name: "Sən", male: viewerMale, photo: "viewer" });
  const males = [...MALE];
  const females = [...FEMALE];
  const opponentPool = viewerMale ? females : males;
  const [opponentName, opponentPhoto] = opponentPool.shift()!;
  for (let seat = 1; seat <= 11; seat++) {
    if (seat === OPPONENT_SEAT) {
      players.push({ seat, name: opponentName, male: !viewerMale, photo: opponentPhoto });
      continue;
    }
    const pool = seat % 2 === 0 ? females : males;
    const pick = pool.length ? pool.shift()! : ["Oyunçu", seat % 2 === 0 ? "f2" : "m2"];
    players.push({ seat, name: pick[0], male: seat % 2 === 1, photo: pick[1] });
  }
  return {
    step: "spin",
    phase: "prompt",
    stepIndex: 1,
    players,
    viewerSeat: VIEWER_SEAT,
    opponentSeat: OPPONENT_SEAT,
    kissed: null,
    giftFromOpponent: null,
    giftSent: null,
    chat: [],
  };
}

export function opponent(state: TutorialState): TutorialPlayer {
  return state.players.find((p) => p.seat === state.opponentSeat)!;
}

/** Step 1: viewer taps the bottle → spin animation starts. */
export function spinBottle(state: TutorialState): TutorialState {
  if (state.step !== "spin" || state.phase !== "prompt") return state;
  return { ...state, phase: "spinning" };
}

/** Bottle animation finished → landed on the opponent; show the opponent's turn (5 s). */
export function bottleStopped(state: TutorialState): TutorialState {
  if (state.step !== "spin" || state.phase !== "spinning") return state;
  return { ...state, step: "kiss", phase: "opponent-turn", stepIndex: 2 };
}

/** After the 5 s opponent-turn display, the kiss/refuse choice appears. */
export function showKissChoice(state: TutorialState): TutorialState {
  if (state.step !== "kiss" || state.phase !== "opponent-turn") return state;
  return { ...state, phase: "choice" };
}

/** Step 2: viewer kisses or refuses; the opponent always kisses back. */
export function answerKiss(state: TutorialState, kiss: boolean): TutorialState {
  if (state.step !== "kiss" || state.phase !== "choice") return state;
  return { ...state, kissed: kiss, phase: "kiss-back" };
}

/** Kiss-back animation done → step 3, the opponent's gift starts flying in. */
export function startGiftExchange(state: TutorialState): TutorialState {
  if (state.step !== "kiss" || state.phase !== "kiss-back") return state;
  return { ...state, step: "gift", phase: "gift-incoming", stepIndex: 3, giftFromOpponent: OPPONENT_GIFT.id };
}

/** Opponent's gift arrived → spotlight the opponent's photo, wait for the tap. */
export function promptPhotoPick(state: TutorialState): TutorialState {
  if (state.step !== "gift" || state.phase !== "gift-incoming") return state;
  return { ...state, phase: "pick-photo" };
}

/** Viewer tapped the opponent's photo → open the gift dialog. */
export function openGiftDialog(state: TutorialState): TutorialState {
  if (state.step !== "gift" || state.phase !== "pick-photo") return state;
  return { ...state, phase: "gift-dialog" };
}

/** Viewer picked a gift in the dialog → it flies to the opponent. */
export function sendTutorialGift(state: TutorialState, gift: string): TutorialState {
  if (state.step !== "gift" || state.phase !== "gift-dialog") return state;
  return { ...state, giftSent: gift, phase: "gift-sent" };
}

/** Viewer's gift arrived → step 4, the opponent's chat message arrives. */
export function startChatStep(state: TutorialState): TutorialState {
  if (state.step !== "gift" || state.phase !== "gift-sent") return state;
  return {
    ...state,
    step: "chat",
    phase: "chat-incoming",
    stepIndex: 4,
    chat: [{ from: "opponent", text: TUTORIAL_TEXT.opponentIncoming }],
  };
}

/** Incoming message shown → prefill the input and wait for the viewer's reply. */
export function promptChatReply(state: TutorialState): TutorialState {
  if (state.step !== "chat" || state.phase !== "chat-incoming") return state;
  return { ...state, phase: "chat-reply" };
}

/** Step 4: viewer sends a chat message → step 5, spotlight the change-table button. */
export function sendTutorialMessage(state: TutorialState, text: string): TutorialState {
  if (state.step !== "chat" || state.phase !== "chat-reply") return state;
  const trimmed = text.trim();
  if (!trimmed) return state;
  return {
    ...state,
    step: "finish",
    phase: "change-table",
    stepIndex: 5,
    chat: [...state.chat, { from: "viewer", text: trimmed }],
  };
}

/** Viewer tapped the highlighted change-table button → finished dialog with the bonus. */
export function finishTutorial(state: TutorialState): TutorialState {
  if (state.step !== "finish" || state.phase !== "change-table") return state;
  return { ...state, phase: "done" };
}
