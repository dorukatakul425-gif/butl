import { describe, expect, it } from "vitest";
import {
  createTutorial,
  spinBottle,
  bottleStopped,
  answerKiss,
  sendTutorialGift,
  sendTutorialMessage,
  opponent,
  OPPONENT_GIFT,
  TUTORIAL_STEPS,
} from "@/lib/tutorial-session";

describe("tutorial session", () => {
  it("seats the viewer at 0 and an opposite-sex opponent at 7", () => {
    const s = createTutorial(true);
    expect(s.players.find((p) => p.seat === 0)?.name).toBe("Sən");
    const opp = opponent(s);
    expect(opp.seat).toBe(7);
    expect(opp.male).toBe(false);
    expect(s.players).toHaveLength(12);
  });

  it("runs the original 5-step order: spin → kiss → gift → chat → finish", () => {
    let s = createTutorial(false);
    expect(s.step).toBe("spin");
    expect(s.stepIndex).toBe(1);
    expect(TUTORIAL_STEPS).toBe(5);

    s = spinBottle(s);
    expect(s.bottleSpinning).toBe(true);
    s = bottleStopped(s);
    expect(s.step).toBe("kiss");

    // Refuse still moves on, and the opponent always sends the first gift.
    s = answerKiss(s, false);
    expect(s.step).toBe("gift");
    expect(s.kissed).toBe(false);
    expect(s.giftFromOpponent).toBe(OPPONENT_GIFT);

    s = sendTutorialGift(s, "🌹");
    expect(s.step).toBe("chat");
    expect(s.chat[0]?.from).toBe("opponent");

    s = sendTutorialMessage(s, "Salam!");
    expect(s.step).toBe("finish");
    expect(s.stepIndex).toBe(5);
    expect(s.chat.at(-1)).toEqual({ from: "viewer", text: "Salam!" });
  });

  it("ignores out-of-order actions", () => {
    const s = createTutorial(true);
    expect(answerKiss(s, true)).toBe(s);
    expect(sendTutorialGift(s, "🌹")).toBe(s);
    expect(sendTutorialMessage(s, "hi")).toBe(s);
    expect(bottleStopped(s)).toBe(s); // not spinning yet
  });

  it("ignores empty chat messages", () => {
    let s = sendTutorialGift(answerKiss(bottleStopped(spinBottle(createTutorial(true))), true), "🧸");
    const before = s;
    s = sendTutorialMessage(s, "   ");
    expect(s).toBe(before);
  });
});
