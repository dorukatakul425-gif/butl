/** Remaining VIP time shown on the bought plan's button: "6g 23:59:59", under a day "23:59:59". */
export function vipCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400), h = Math.floor((total % 86400) / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  const two = (n: number) => String(n).padStart(2, "0");
  return `${d > 0 ? `${d}g ` : ""}${two(h)}:${two(m)}:${two(s)}`;
}
