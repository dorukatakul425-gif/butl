// First-entry tutorial table — faithful port of the original Telegram client's
// TutorialPresenter: real table look (wood, photo seats, center bottle), shade
// overlay with a spotlight on the active element, original step timings, gift
// dialog, chat step and a finished dialog with a gold bonus.
import { useEffect, useMemo, useRef, useState } from "react";
import woodTable from "@/assets/original-wood-table.png";
import bottleImg from "@/assets/ui_table_default_bottle.svg";
import kissBtn from "@/assets/ui_btn_kiss.svg";
import changeTableIcon from "@/assets/ui_btn_change_table.svg";
import avatarM1 from "@/assets/tutorial/avatar-m1.jpg";
import avatarM2 from "@/assets/tutorial/avatar-m2.jpg";
import avatarM3 from "@/assets/tutorial/avatar-m3.jpg";
import avatarM4 from "@/assets/tutorial/avatar-m4.jpg";
import avatarM5 from "@/assets/tutorial/avatar-m5.jpg";
import avatarM6 from "@/assets/tutorial/avatar-m6.jpg";
import avatarF1 from "@/assets/tutorial/avatar-f1.jpg";
import avatarF2 from "@/assets/tutorial/avatar-f2.jpg";
import avatarF3 from "@/assets/tutorial/avatar-f3.jpg";
import avatarF4 from "@/assets/tutorial/avatar-f4.jpg";
import avatarF5 from "@/assets/tutorial/avatar-f5.jpg";
import avatarF6 from "@/assets/tutorial/avatar-f6.jpg";
import "@/styles/tutorial.css";
import {
  createTutorial,
  spinBottle,
  bottleStopped,
  showKissChoice,
  answerKiss,
  startGiftExchange,
  promptPhotoPick,
  openGiftDialog,
  sendTutorialGift,
  startChatStep,
  promptChatReply,
  sendTutorialMessage,
  finishTutorial,
  opponent,
  TUTORIAL_GIFTS,
  TUTORIAL_BONUS_GOLD,
  TUTORIAL_TEXT,
  OPPONENT_GIFT,
  type TutorialState,
} from "@/lib/tutorial-session";

const PHOTOS: Record<string, string> = {
  m1: avatarM1, m2: avatarM2, m3: avatarM3, m4: avatarM4, m5: avatarM5, m6: avatarM6,
  f1: avatarF1, f2: avatarF2, f3: avatarF3, f4: avatarF4, f5: avatarF5, f6: avatarF6,
};

/** 12 seats around an ellipse, percentages of the table area (seat 0 top center). */
const SEAT_POS: Array<[number, number]> = [
  [50, 7], [74, 11], [91, 27], [96, 50], [91, 73], [74, 89],
  [50, 93], [26, 89], [9, 73], [4, 50], [9, 27], [26, 11],
];

/** Original timings from TutorialPresenter (ms). */
const T = {
  spin: 1700,
  opponentTurn: 5000,
  afterChoice: 1000,
  kissBack: 3000,
  afterKissBack: 2000,
  giftFly: 6000,
  chatIncoming: 1000,
  afterSend: 1000,
};

export function TutorialTable({
  viewerMale,
  viewerName,
  viewerPhoto,
  onFinish,
}: {
  viewerMale: boolean;
  viewerName?: string;
  viewerPhoto?: string | null;
  onFinish: () => void;
}) {
  const [state, setState] = useState<TutorialState>(() => createTutorial(viewerMale));
  const [message, setMessage] = useState(TUTORIAL_TEXT.viewerOutgoing);
  const timers = useRef<number[]>([]);

  useEffect(() => () => { timers.current.forEach((t) => window.clearTimeout(t)); }, []);

  const opp = useMemo(() => opponent(state), [state]);

  /** Advance after `ms`, exactly like the original's `yield delay(ms)` chains. */
  const later = (ms: number, fn: (s: TutorialState) => TutorialState) => {
    timers.current.push(window.setTimeout(() => setState((cur) => fn(cur)), ms));
  };

  // Step 2 timing chain: opponent-turn 5s → choice; choice → 1s → kiss-back 3s → 2s → gift.
  useEffect(() => {
    if (state.step === "kiss" && state.phase === "opponent-turn") later(T.opponentTurn, showKissChoice);
    if (state.step === "kiss" && state.phase === "kiss-back") {
      later(T.kissBack + T.afterKissBack, startGiftExchange);
    }
    // Step 3: opponent's gift flies 6s → photo prompt; viewer's gift flies 6s → chat.
    if (state.step === "gift" && state.phase === "gift-incoming") later(T.giftFly, promptPhotoPick);
    if (state.step === "gift" && state.phase === "gift-sent") later(T.giftFly, startChatStep);
    // Step 4: incoming message → 1s → prefilled reply prompt.
    if (state.step === "chat" && state.phase === "chat-incoming") later(T.chatIncoming, promptChatReply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, state.phase]);

  const onBottle = () => {
    setState((s) => {
      const next = spinBottle(s);
      if (next !== s) later(T.spin, bottleStopped);
      return next;
    });
  };

  const onKiss = (kiss: boolean) => {
    setState((s) => answerKiss(s, kiss));
  };

  const onGift = (giftId: string) => {
    setState((s) => sendTutorialGift(s, giftId));
  };

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => sendTutorialMessage(s, message));
    setMessage("");
  };

  const shade =
    (state.step === "spin" && state.phase === "prompt") ||
    (state.step === "kiss" && state.phase === "choice") ||
    (state.step === "gift" && (state.phase === "pick-photo" || state.phase === "gift-dialog")) ||
    (state.step === "chat" && state.phase === "chat-reply") ||
    (state.step === "finish" && state.phase === "change-table");

  const hint = useMemo(() => {
    if (state.step === "spin" && state.phase === "prompt") return TUTORIAL_TEXT.spin;
    if (state.step === "kiss" && state.phase === "choice") return TUTORIAL_TEXT.kiss;
    if (state.step === "gift" && state.phase === "pick-photo") return TUTORIAL_TEXT.gift(opp.name);
    if (state.step === "chat" && state.phase === "chat-reply") return TUTORIAL_TEXT.chat;
    if (state.step === "finish" && state.phase === "change-table") return TUTORIAL_TEXT.finish;
    return "";
  }, [state, opp.name]);

  const seatPhoto = (photo: string) =>
    photo === "viewer" ? (viewerPhoto || undefined) : PHOTOS[photo];

  const giftIcon = (id: string | null) =>
    id === OPPONENT_GIFT.id ? OPPONENT_GIFT.icon : TUTORIAL_GIFTS.find((g) => g.id === id)?.icon ?? "🎁";

  return (
    <main className="tutorial-page" aria-label="Oyun təlimi">
      <div className="tutorial-table-wrap" style={{ backgroundImage: `url(${woodTable})` }}>
        {/* Step badge — original: trans 'tutorial:step' → "Addım n/5" */}
        {state.phase !== "done" && <div className="tutorial-step-badge">{TUTORIAL_TEXT.step(state.stepIndex)}</div>}

        {/* Change-table button, top-right like the real header; spotlighted in step 5 */}
        <button
          type="button"
          className={
            "tutorial-change-table" +
            (state.step === "finish" && state.phase === "change-table" ? " tutorial-spotlight" : "")
          }
          onClick={() => setState((s) => finishTutorial(s))}
          disabled={!(state.step === "finish" && state.phase === "change-table")}
          aria-label="Masaya keç"
        >
          <img src={changeTableIcon} alt="" />
        </button>

        {state.players.map((p) => {
          const isOpponent = p.seat === state.opponentSeat;
          const isViewer = p.seat === state.viewerSeat;
          const spotlight =
            (state.step === "spin" && state.phase === "prompt" && isViewer) ||
            (state.step === "kiss" && (state.phase === "opponent-turn" || state.phase === "choice") && isOpponent) ||
            (state.step === "gift" && state.phase === "pick-photo" && isOpponent);
          const clickable = state.step === "gift" && state.phase === "pick-photo" && isOpponent;
          return (
            <button
              key={p.seat}
              type="button"
              className={
                "tutorial-seat" +
                (spotlight ? " tutorial-spotlight" : "") +
                (state.step === "kiss" && state.phase === "opponent-turn" && isOpponent ? " tutorial-seat--selected" : "")
              }
              style={{ left: `${SEAT_POS[p.seat][0]}%`, top: `${SEAT_POS[p.seat][1]}%` }}
              onClick={() => clickable && setState((s) => openGiftDialog(s))}
              disabled={!clickable}
              aria-label={p.name}
            >
              {seatPhoto(p.photo) ? <img src={seatPhoto(p.photo)} alt="" /> : <span className="tutorial-seat-fallback">{p.name.slice(0, 1)}</span>}
              <span className="tutorial-seat-name">{isViewer && viewerName ? viewerName : p.name}</span>
              {state.step === "kiss" && state.phase === "kiss-back" && (isViewer || isOpponent) && state.kissed && (
                <span className="tutorial-seat-kiss" aria-hidden>💋</span>
              )}
            </button>
          );
        })}

        {/* Center bottle — spin text on it in step 1, like the original spinText */}
        <button
          type="button"
          className={
            "tutorial-bottle" +
            (state.step === "spin" && state.phase === "prompt" ? " tutorial-spotlight" : "") +
            (state.phase === "spinning" ? " tutorial-bottle--spinning" : "")
          }
          onClick={onBottle}
          disabled={!(state.step === "spin" && state.phase === "prompt")}
          aria-label="Şişəni çevir"
        >
          <img src={bottleImg} alt="" />
          {state.step === "spin" && state.phase === "prompt" && (
            <span className="tutorial-spin-text">{TUTORIAL_TEXT.spin}</span>
          )}
        </button>

        {/* Kiss / refuse choice — original green kiss + red refuse buttons */}
        {state.step === "kiss" && state.phase === "choice" && (
          <div className="tutorial-kiss-actions">
            <button type="button" className="tutorial-kiss-yes" onClick={() => onKiss(true)} aria-label="Öp">
              <img src={kissBtn} alt="" /> Öp
            </button>
            <button type="button" className="tutorial-kiss-no" onClick={() => onKiss(false)} aria-label="Rədd et">
              ✕ Rədd et
            </button>
          </div>
        )}

        {/* Flying gifts: opponent → viewer, then viewer → opponent */}
        {state.step === "gift" && state.phase === "gift-incoming" && (
          <div className="tutorial-gift-float tutorial-gift-float--in" aria-hidden>{giftIcon(state.giftFromOpponent)}</div>
        )}
        {state.step === "gift" && state.phase === "gift-sent" && state.giftSent && (
          <div className="tutorial-gift-float tutorial-gift-float--out" aria-hidden>{giftIcon(state.giftSent)}</div>
        )}

        {/* Gift dialog — original store list, opened by tapping the opponent's photo */}
        {state.step === "gift" && state.phase === "gift-dialog" && (
          <div className="tutorial-gift-sheet" role="dialog" aria-label="Hədiyyə seç">
            <p className="tutorial-gift-sheet-title">{TUTORIAL_TEXT.giftPointer} — {opp.name}</p>
            <div className="tutorial-gift-grid">
              {TUTORIAL_GIFTS.map((g) => (
                <button key={g.id} type="button" onClick={() => onGift(g.id)} aria-label={g.name}>
                  <span aria-hidden>{g.icon}</span>
                  <small>{g.name}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Shade overlay with the tutorial hint — original toggleShade + hint text */}
        {shade && <div className="tutorial-shade" aria-hidden />}
        {hint && <div className="tutorial-hint">{hint}</div>}
      </div>

      {/* Chat — original step 4: opponent's incoming message, prefilled reply */}
      <div className={"tutorial-chat" + (state.step === "chat" && state.phase === "chat-reply" ? " tutorial-spotlight" : "")}>
        {state.chat.map((line, i) => (
          <p key={i} className="tutorial-chat-line">
            <b>{line.from === "opponent" ? opp.name : (viewerName || "Sən")}:</b>{line.text}
          </p>
        ))}
        {state.step === "chat" && state.phase === "chat-reply" && (
          <form className="tutorial-chat-form" onSubmit={onSend}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} aria-label="Mesaj" />
            <button type="submit">Göndər</button>
          </form>
        )}
      </div>

      {/* Finished dialog — original TutorialFinishedDialog with gold bonus */}
      {state.phase === "done" && (
        <div className="tutorial-finished-overlay" role="dialog" aria-label={TUTORIAL_TEXT.finishedTitle}>
          <div className="tutorial-finished">
            <h2>{TUTORIAL_TEXT.finishedTitle}</h2>
            <p>{TUTORIAL_TEXT.finishedText}</p>
            <p>{TUTORIAL_TEXT.finishedText2}</p>
            <p className="tutorial-finished-bonus">
              {TUTORIAL_TEXT.finishedText3} <b>+{TUTORIAL_BONUS_GOLD} 💛</b>
            </p>
            <button type="button" onClick={onFinish}>{TUTORIAL_TEXT.finishedBtn}</button>
          </div>
        </div>
      )}
    </main>
  );
}
