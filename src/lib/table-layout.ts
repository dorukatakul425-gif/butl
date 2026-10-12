/** Source 375px table space, with the lowest name at the table/chat edge. */
export function tableLayout(width: number, height: number, header: number) {
  const available = Math.max(0, height - header);
  const scale = Math.min(width / 375, available / 375);
  return { scale, x: width / 2, y: height - 187.5 * scale, available };
}