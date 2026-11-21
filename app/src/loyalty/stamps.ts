/** Pieczątki za zamówienie: każde rozpoczęte `zlPerHalf` zł to pół pieczątki (do 50 zł → 0,5; 50,01–100 → 1 …). */
export function stampsForOrder(totalGrosze: number, zlPerHalf: number): number {
  if (totalGrosze <= 0) return 0;
  return Math.ceil(totalGrosze / (zlPerHalf * 100)) / 2;
}

/** „0,5 pieczątki”, „1 pieczątka”, „2 pieczątki”, „5 pieczątek”. */
export function stampsLabel(stamps: number): string {
  const num = String(stamps).replace('.', ',');
  if (!Number.isInteger(stamps)) return `${num} pieczątki`;
  if (stamps === 1) return '1 pieczątka';
  const d = stamps % 10;
  const dd = stamps % 100;
  return `${num} ${d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? 'pieczątki' : 'pieczątek'}`;
}
