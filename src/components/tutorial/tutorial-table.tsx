// First-entry tutorial table: scripted 5-step flow with fake players,
// mirroring the original Telegram client (spin → kiss/refuse → gift → chat → real table).
import { useEffect, useMemo, useRef, useState } from "react";
import woodTable from "@/assets/original-wood-table.png";
import "@/styles/tutorial.css";
import {
  createTutorial,
  spinBottle,
  bottleStopped,
  answerKiss,
  sendTutorialGift,
  sendTutorialMessage,
  opponent,
  TUTORIAL_GIFTS,
  TUTORIAL_STEPS,
  TUTORIAL_TEXT,
  type TutorialState,
} from "@/lib/tutorial-session";

/** 12 seats around an ellipse, percentages of the table area. */
const SEAT_POS: Array<[number, number]> = [
  [50, 6], [74, 10], [91, 26], [96, 50], [91, 74], [74, 90],
  [50, 94], [26, 90], [9, 74], [4, 50], [9, 26], [26, 10],
];

export function TutorialTable({ viewerMale, onFinish }: { viewerMale: boolean; onFinish: () => void }) {
  const [state, setState] = useState<TutorialState>(() => createTutorial(viewerMale));
  const [giftFloat, setGiftFloat] = useState<string | null>(null);
  const [message, setMessage] = useState(TUTORIAL_TEXT.viewerOutgoing);
  const spinTimer = useRef<number | null>(null);

  useEffect(() => () => { if (spinTimer.current) window.clearTimeout(spinTimer.current); }, []);

  const opp = useMemo(() => opponent(state), [state]);

  const hint = useMemo(() => {
    switch (state.step) {
      case "spin": return TUTORIAL_TEXT.spin;
      case "kiss": return TUTORIAL_TEXT.kiss;
      case "gift": return state.giftSent ? "" : TUTORIAL_TEXT.gift(opp.name);
      case "chat": return TUTORIAL_TEXT.chat;
      case "finish": return TUTORIAL_TEXT.finish;
    }
  }, [state, opp.name]);

  const onBottle = () => {
    setState((s) => {
      const next = spinBottle(s);
      if (next !== s) {
        spinTimer.current = window.setTimeout(() => setState((cur) => bottleStopped(cur)), 1700);
      }
      return next;
    });
  };

  const onKiss = (kiss: boolean) => {
    setState((s) => answerKiss(s, kiss));
    setGiftFloat(null);
    window.setTimeout(() => setGiftFloat("from"), 600);
  };

  const onGift = (gift: string) => {
    setState((s) => sendTutorialGift(s, gift));
    setGiftFloat("to");
    window.setTimeout(() => setGiftFloat(null), 2400);
  };

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => sendTutorialMessage(s, message));
    setMessage("");
  };

  return (
    <main className="tutorial-page" aria-label="Oyun təlimi">
      <div className="tutorial-table-wrap" style={{ backgroundImage: `url(${woodTable})` }}>
        <div className="tutorial-step-badge">{state.stepIndex}/{TUTORIAL_STEPS}</div>

        {state.players.map((p) => (
          <div
            key={p.seat}
            className={
              "tutorial-seat" +
              (state.step === "gift" && !state.giftSent && p.seat === state.opponentSeat ? " tutorial-seat--highlight" : "")
            }
            style={{ left: `${SEAT_POS[p.seat][0]}%`, top: `${SEAT_POS[p.seat][1]}%` }}
          >
            <span aria-hidden>{p.avatar}</span>
            <span className="tutorial-seat-name">{p.name}</span>
          </div>
        ))}

        <button
          type="button"
          className={
            "tutorial-bottle" +
            (state.step === "spin" && !state.bottleSpinning ? " tutorial-bottle--highlight" : "") +
            (state.bottleSpinning ? " tutorial-bottle--spinning" : "")
          }
          onClick={onBottle}
          aria-label="Şişəni çevir"
        >
          🍾
        </button>

        {state.step === "kiss" && (
          <div className="tutorial-kiss-actions">
            <button type="button" className="tutorial-kiss-yes" onClick={() => onKiss(true)}>Öp 😘</button>
            <button type="button" className="tutorial-kiss-no" onClick={() => onKiss(false)}>Rədd et</button>
          </div>
        )}

        {giftFloat === "from" && <div className="tutorial-gift-float" aria-hidden>🍹</div>}
        {giftFloat === "to" && state.giftSent && <div className="tutorial-gift-float" aria-hidden>{state.giftSent}</div>}

        {state.step === "gift" && !state.giftSent && giftFloat !== "from" && (
          <div className="tutorial-gift-bar" role="group" aria-label="Hədiyyə seç">
            {TUTORIAL_GIFTS.map((g) => (
              <button key={g} type="button" onClick={() => onGift(g)} aria-label={`Hədiyyə ${g}`}>{g}</button>
            ))}
          </div>
        )}

        {hint && <div className="tutorial-hint">{hint}</div>}
      </div>

      <div className="tutorial-chat">
        {state.chat.map((line, i) => (
          <p key={i} className="tutorial-chat-line">
            <b>{line.from === "opponent" ? opp.name : "Sən"}:</b>{line.text}
          </p>
        ))}
        {state.step === "chat" && (
          <form className="tutorial-chat-form" onSubmit={onSend}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} aria-label="Mesaj" />
            <button type="submit">Göndər</button>
          </form>
        )}
        {state.step === "finish" && (
          <button type="button" className="tutorial-finish-btn" onClick={onFinish}>
            Əsl masaya keç →
          </button>
        )}
      </div>
    </main>
  );
}
