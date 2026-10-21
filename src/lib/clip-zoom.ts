export type ClipZoom = 0 | 1 | 2;
export function loadClipZoom(): ClipZoom {
  try { const z = Number(localStorage.getItem('clipZoom')); return z === 1 || z === 2 ? z : 0; } catch { return 0; }
}
export function nextClipZoom(z: ClipZoom): ClipZoom {
  const next = z === 2 ? 0 : z === 1 ? 2 : 1;
  try { localStorage.setItem('clipZoom', String(next)); } catch { /* storage unavailable */ }
  return next;
}
export function clipZoomTitle(z: ClipZoom) {
  return z === 1 ? 'Klip 1x böyüdülüb - yenə bas: 2x' : z === 2 ? 'Klip 2x böyüdülüb - bas: əvvəlki ölçü' : 'Klipi böyüt';
}