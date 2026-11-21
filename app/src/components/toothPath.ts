/** Ścieżka SVG nagłówka z ząbkami; wcięcie (dolina) wypada dokładnie na środku szerokości. Tylko odcinki M/L. */
export function toothPath(width: number, height: number, toothWidth = 26, depth = 12): string {
  const valley = height - depth;
  // pierwsza dolina na lewo od środka, tak by dolina wypadła na środku ekranu
  let v = width / 2;
  while (v - toothWidth / 2 > 0) v -= toothWidth;
  const left = v - toothWidth / 2; // czubek ząbka na lewo od pierwszej doliny (≤ 0)
  const pts: [number, number][] = [[left, 0], [left, height]];
  let right = left;
  for (; v - toothWidth / 2 < width; v += toothWidth) {
    pts.push([v, valley]);
    right = v + toothWidth / 2;
    pts.push([right, height]);
  }
  pts.push([right, 0]);
  return `M${pts.map(([x, y]) => `${x} ${y}`).join('L')}Z`;
}
