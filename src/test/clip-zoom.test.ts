import { beforeEach, expect, it } from 'vitest';
import { nextClipZoom, loadClipZoom } from '../lib/clip-zoom';
beforeEach(() => localStorage.clear());
it('matches original 0 to 1 to 2 to 0 zoom cycle', () => {
  expect(nextClipZoom(0)).toBe(1); expect(nextClipZoom(1)).toBe(2); expect(nextClipZoom(2)).toBe(0);
});
it('restores the chosen zoom for subsequent videos', () => {
  nextClipZoom(1); expect(loadClipZoom()).toBe(2);
});
it('rejects invalid stored zoom levels', () => {
  localStorage.setItem('clipZoom','99'); expect(loadClipZoom()).toBe(0);
});