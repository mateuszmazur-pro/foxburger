/** Ścieżka SVG nagłówka z ząbkami; wcięcie (dolina) wypada dokładnie na środku szerokości. */
export function toothPath(width: number, height: number, toothWidth = 26, depth = 12): string {
  const cx = width / 2;
  const valley = height - depth;
  let x = cx;
  while (x - toothWidth / 2 > 0) x -= toothWidth;
  // x = położenie pierwszej doliny od lewej (może być < toothWidth/2)
  const pts: string[] = [];
  let tip = x - toothWidth / 2;
  pts.push(`${tip} ${height}`);
  for (let v = x; v < width + toothWidth; v += toothWidth) {
    pts.push(`${v} ${valley}`);
    pts.push(`${v + toothWidth / 2} ${height}`);
  }
  return `M${Math.min(0, tip)} 0H${width + toothWidth}V${height}L${pts.join('L')}Z`;
}
