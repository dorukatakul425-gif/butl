/** Rendering-only mathematics adapted from the authorized preloader_new.js. */
export function originalCenterDimensions(size: number[] | undefined, assetScale: number) {
  return { width: (size?.[2] ?? 287.4) * assetScale, height: (size?.[3] ?? 287.5) * assetScale };
}

export function webTableLayout(width: number, height: number, header: number) {
  const available = Math.max(1, height - header);
  const side = Math.min(Math.max(1, width), available);
  return { x: width / 2, y: header + available / 2, scale: side / 375, side };
}

export function webRenderQuality(dpr: number, ua: string, telegram = false) {
  if (telegram) return { resolution: Number.isFinite(dpr) ? Math.max(dpr, 1) : 1, antialias: true };
  const safari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Android/i.test(ua);
  return { resolution: Math.min(Math.max(dpr || 1, 1), 2), antialias: !safari && !/Android [78](?:[.; ]|$)/i.test(ua) };
}

/** Telegram tweens follow elapsed time; particle simulation remains bounded. */
export function tableTweenSeconds(deltaMS: number, elapsedMS: number, telegram: boolean) {
  return Math.max(0, telegram ? elapsedMS : Math.min(deltaMS, 100)) / 1000;
}

export interface GiftPose { x: number; y: number; scale: number; rotation: number }
export function webGiftDestination(receiver: GiftPose, point: GiftPose): GiftPose {
  const r = receiver.rotation * Math.PI / 180;
  return {
    x: receiver.x + receiver.scale * (point.x * Math.cos(r) - point.y * Math.sin(r)),
    y: receiver.y + receiver.scale * (point.x * Math.sin(r) + point.y * Math.cos(r)),
    scale: receiver.scale * point.scale,
    rotation: receiver.rotation + point.rotation,
  };
}

export function webGiftSample(raw: number, source: GiftPose, target: GiftPose): GiftPose {
  const t = Math.min(1, Math.max(0, raw));
  const p = t * (2 - t);
  const cruise = 0.975;
  const scale = p <= 0.1 ? source.scale + p / 0.1 * (cruise - source.scale)
    : p >= 0.9 ? cruise + (p - 0.9) / 0.1 * (target.scale - cruise) : cruise;
  return { x: source.x + p * (target.x - source.x), y: source.y + p * (target.y - source.y),
    rotation: source.rotation + p * (target.rotation - source.rotation), scale };
}

export interface SceneNode { destroyed?: boolean; visible?: boolean; children?: SceneNode[] }
export function hasSceneAnimation(node: SceneNode, animated: (node: SceneNode) => boolean): boolean {
  if (node.destroyed || node.visible === false) return false;
  return animated(node) || Boolean(node.children?.some(child => hasSceneAnimation(child, animated)));
}