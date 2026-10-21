import { describe, expect, it, beforeEach } from "vitest";
import { flyGoldToCounter, goldCounterPoint, inplaceGold, pulseGoldCounter } from "@/lib/gold-fly";

describe("gold-fly (ureyimsen addViewerGold / inplaceGold)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("sayaç yoksa uçuş başlamaz", () => {
    flyGoldToCounter({ x: 10, y: 10 });
    expect(document.querySelector(".gold-fly__heart")).toBeNull();
  });

  it("sayaç varken kalp tıklama noktasında belirir ve sayaca uçar", () => {
    document.body.innerHTML = `<div class="original-heart-button" style="position:fixed;left:20px;top:20px;width:40px;height:40px"></div>`;
    flyGoldToCounter({ x: 200, y: 400 });
    const heart = document.querySelector<HTMLImageElement>(".gold-fly__heart");
    expect(heart).not.toBeNull();
    expect(heart!.style.left).toBe("182px");
    expect(heart!.style.top).toBe("382px");
  });

  it("goldCounterPoint sayacın merkezini verir", () => {
    document.body.innerHTML = `<div class="original-heart-button"></div>`;
    const pt = goldCounterPoint();
    expect(pt).not.toBeNull();
  });

  it("inplaceGold kalbi yerinde gösterir", () => {
    inplaceGold({ x: 50, y: 60 });
    const heart = document.querySelector<HTMLImageElement>(".gold-fly__heart");
    expect(heart).not.toBeNull();
    expect(heart!.style.left).toBe("32px");
  });

  it("pulseGoldCounter sayaca nabız sınıfı ekler", () => {
    document.body.innerHTML = `<div class="original-heart-button"></div>`;
    pulseGoldCounter();
    expect(document.querySelector(".original-heart-button")!.classList.contains("gold-fly-pulse")).toBe(true);
  });
});
