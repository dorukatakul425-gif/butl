import { describe, expect, it } from 'vitest';
import { hasSceneAnimation, originalCenterDimensions, tableTweenSeconds, webGiftDestination, webGiftSample, webRenderQuality, webTableLayout } from '@/lib/web-table-rendering';

describe('shared website and Telegram reference rendering', () => {
  it('uses the original center ornament dimensions independently of platform density', () => {
    const scale = 375 / 704 * 1.17;
    expect(originalCenterDimensions([-143.7, -143.75, 287.4, 287.5], scale)).toEqual({ width: 287.4 * scale, height: 287.5 * scale });
    expect(originalCenterDimensions(undefined, scale)).toEqual({ width: 287.4 * scale, height: 287.5 * scale });
  });
  it('fits the source 375-unit square below the header on the requested phone', () => {
    expect(webTableLayout(393, 441, 48)).toEqual({ x: 196.5, y: 244.5, scale: 393 / 375, side: 393 });
  });
  it('does not clip seats in a short table area', () => {
    expect(webTableLayout(393, 280, 48)).toEqual({ x: 196.5, y: 164, scale: 232 / 375, side: 232 });
  });
  it('keeps source 2x resolution and reference device exceptions', () => {
    expect(webRenderQuality(3, 'Android 14 Chrome')).toEqual({ resolution: 2, antialias: true });
    expect(webRenderQuality(1.5, 'Android 8.1 Chrome').antialias).toBe(false);
    expect(webRenderQuality(1.5, 'Safari')).toEqual({ resolution: 1.5, antialias: false });
  });
  it('finds live animation inside a gift wrapper, ignoring hidden/destroyed views', () => {
    const live = { children: [], moving: true };
    const test = (n: object) => 'moving' in n && n.moving === true;
    expect(hasSceneAnimation({ children: [{ children: [live] }] }, test)).toBe(true);
    expect(hasSceneAnimation({ children: [{ destroyed: true, children: [live] }] }, test)).toBe(false);
    expect(hasSceneAnimation({ visible: false, children: [live] }, test)).toBe(false);
  });
  it('uses native Telegram density and antialias without changing the website', () => {
    expect(webRenderQuality(3, 'Safari', true)).toEqual({ resolution: 3, antialias: true });
    expect(webRenderQuality(2.75, 'Android 14 Chrome', true).resolution).toBe(2.75);
    expect(webRenderQuality(NaN, 'Safari', true).resolution).toBe(1);
    expect(webRenderQuality(3, 'Safari')).toEqual({ resolution: 2, antialias: false });
  });
  it('keeps Telegram motion on elapsed time after a slow frame while preserving website timing', () => {
    expect(tableTweenSeconds(100, 350, true)).toBe(0.35);
    expect(tableTweenSeconds(350, 350, false)).toBe(0.1);
  });
  it('lands exactly on the enlarged moving receiver rather than its old seat', () => {
    const target = webGiftDestination({ x: 46, y: -5, scale: 1.5, rotation: 0 }, { x: 32, y: 32, scale: 0.75, rotation: 0 });
    expect(target).toEqual({ x: 94, y: 43, scale: 1.125, rotation: 0 });
    expect(webGiftSample(1, { x: 0, y: 0, scale: 0.75, rotation: 0 }, target)).toEqual(target);
  });
  it('preserves five-second three-stage scale and eased travel', () => {
    const from = { x: 0, y: 0, scale: 0.75, rotation: 0 };
    const to = { x: 100, y: 80, scale: 0.75, rotation: -45 };
    expect(webGiftSample(0, from, to)).toEqual(from);
    expect(webGiftSample(0.5, from, to)).toEqual({ x: 75, y: 60, scale: 0.975, rotation: -33.75 });
    expect(webGiftSample(1, from, to)).toEqual(to);
  });
});