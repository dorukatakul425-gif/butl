import { describe, expect, it } from "vitest";
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
  OPPONENT_GIFT,
  TUTORIAL_GIFTS,
  TUTORIAL_STEPS,
  TUTORIAL_BONUS_GOLD,
} from "@/lib/tutorial-session";

describe("tutorial session", () => {
  it("seats the viewer at 0 and an opposite-sex opponent at 7, with photos", () => {
    const s = createTutorial(true);
    expect(s.players.find((p) => p.seat === 0)?.name).toBe("Sən");
    const opp = opponent(s);
    expect(opp.seat).toBe(7);
    expect(opp.male).toBe(false);
    expect(s.players).toHaveLength(12);
    // Fake players use realistic photos, not emoji placeholders.
    for (const p of s.players.filter((x) => x.seat !== 0)) {
      expect(p.photo).toMatch(/^[mf][1-6]$/);
    }
  });

  it("runs the original 5-step order: spin → kiss → gift → chat → finish", () => {
    let s = createTutorial(false);
    expect(s.step).toBe("spin");
    expect(s.phase).toBe("prompt");
    expect(s.stepIndex).toBe(1);
    expect(TUTORIAL_STEPS).toBe(5);

    // Step 1: spin.
    s = spinBottle(s);
    expect(s.phase).toBe("spinning");
    s = bottleStopped(s);
    expect(s.step).toBe("kiss");
    expect(s.phase).toBe("opponent-turn");

    // Step 2: opponent's turn is shown, then the choice; refuse still moves on.
    s = showKissChoice(s);
    expect(s.phase).toBe("choice");
    s = answerKiss(s, false);
    expect(s.kissed).toBe(false);
    expect(s.phase).toBe("kiss-back");

    // Step 3: the opponent always sends the first gift (original: sexonthebeach).
    s = startGiftExchange(s);
    expect(s.step).toBe("gift");
    expect(s.giftFromOpponent).toBe(OPPONENT_GIFT.id);
    s = promptPhotoPick(s);
    expect(s.phase).toBe("pick-photo");
    s = openGiftDialog(s);
    expect(s.phase).toBe("gift-dialog");
    s = sendTutorialGift(s, "flower");
    expect(s.giftSent).toBe("flower");
    expect(s.phase).toBe("gift-sent");

    // Step 4: opponent's incoming message, then the viewer's reply.
    s = startChatStep(s);
    expect(s.step).toBe("chat");
    expect(s.chat[0]?.from).toBe("opponent");
    s = promptChatReply(s);
    s = sendTutorialMessage(s, "Salam!");
    expect(s.step).toBe("finish");
    expect(s.stepIndex).toBe(5);
    expect(s.chat.at(-1)).toEqual({ from: "viewer", text: "Salam!" });

    // Step 5: change-table button → finished dialog with the gold bonus.
    s = finishTutorial(s);
    expect(s.phase).toBe("done");
    expect(TUTORIAL_BONUS_GOLD).toBe(50);
  });

  it("mirrors the original gift store (15 items)", () => {
    expect(TUTORIAL_GIFTS.map((g) => g.id)).toEqual([
      "crown1", "air_kiss", "gem", "strawberry", "tomato", "flower", "milk",
      "teddybear", "icecream", "champagne", "wine", "vanilla", "bosscap",
      "tequilashot", "weddingring1",
    ]);
  });

  it("ignores out-of-order actions", () => {
    const s = createTutorial(true);
    expect(answerKiss(s, true)).toBe(s);
    expect(sendTutorialGift(s, "flower")).toBe(s);
    expect(sendTutorialMessage(s, "hi")).toBe(s);
    expect(bottleStopped(s)).toBe(s); // not spinning yet
    expect(finishTutorial(s)).toBe(s);
    // Cannot skip the photo tap straight to the dialog.
    const picking = promptPhotoPick(startGiftExchange(answerKiss(showKissChoice(bottleStopped(spinBottle(createTutorial(true)))), true)));
    expect(sendTutorialGift(picking, "flower")).toBe(picking);
  });

  it("ignores empty chat messages", () => {
    let s = createTutorial(true);
    s = spinBottle(s);
    s = bottleStopped(s);
    s = showKissChoice(s);
    s = answerKiss(s, true);
    s = startGiftExchange(s);
    s = promptPhotoPick(s);
    s = openGiftDialog(s);
    s = sendTutorialGift(s, "teddybear");
    s = startChatStep(s);
    s = promptChatReply(s);
    const before = s;
    s = sendTutorialMessage(s, "   ");
    expect(s).toBe(before);
  });
});
