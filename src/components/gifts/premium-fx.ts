// ureyimsen Pd (gift notices under the chat top), Zd.announce queue and Dd (+N crystal pop), DAT edition.
const MAX = 3;
let box: HTMLDivElement | null = null;

function chatRect() {
  const list = document.querySelectorAll(".original-chat, .chat");
  for (const el of Array.from(list)) {
    const r = el.getBoundingClientRect();
    if (r.width > 60 && r.height > 60 && r.bottom > 0 && r.top < window.innerHeight) return r;
  }
  return null;
}
function place() {
  if (!box) return;
  const r = chatRect();
  const left = r ? r.left : 0, width = r ? r.width : window.innerWidth;
  const top = r ? Math.max(0, r.top) : Math.round(0.62 * window.innerHeight);
  box.style.left = `${Math.round(left + width / 2)}px`;
  box.style.top = `${Math.round(top + 8)}px`;
  box.style.width = `${Math.max(140, Math.round(width - 16))}px`;
}
if (typeof window !== "undefined") window.addEventListener("resize", place);

export function addNotice(el: HTMLElement, ms: number) {
  if (!box || !box.isConnected) { box = document.createElement("div"); box.className = "gift-notices"; document.body.appendChild(box); }
  place();
  box.appendChild(el);
  while (box.children.length > MAX) box.firstChild?.remove();
  window.setTimeout(() => { el.classList.add("gift-notice-out"); window.setTimeout(() => el.remove(), 280); }, ms);
}

export function premiumToast(text: string) {
  const el = document.createElement("div");
  el.className = "table-bg-toast";
  el.textContent = text;
  addNotice(el, 3200);
}

const queue: Array<{ title: string; text: string }> = [];
let showing = false;
export function premiumAnnounce(title: string, text: string) {
  queue.push({ title, text });
  while (queue.length > 3) queue.shift();
  if (!showing) next();
}
function next() {
  const item = queue.shift();
  if (!item) { showing = false; return; }
  showing = true;
  const el = document.createElement("div");
  el.className = "premium-announce";
  const t = document.createElement("div"); t.className = "premium-announce__title"; t.textContent = item.title;
  const x = document.createElement("div"); x.className = "premium-announce__text"; x.textContent = item.text;
  el.append(t, x);
  addNotice(el, 4500);
  window.setTimeout(next, 4500);
}

/** Dd.show: big "+N" pop for the receiver. */
export function datRewardPop(n: number) {
  const el = document.createElement("div");
  el.className = "crystal-fx";
  el.textContent = `+${n} DAT`;
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 2600);
}
