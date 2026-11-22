/** Pieczątki za zamówienie: pół pieczątki za każde pełne `zlPerHalf` zł (poniżej 50 zł → 0; 50 → 0,5; 100 → 1 …). */
export function stampsForOrder(totalGrosze: number, zlPerHalf: number): number {
  if (totalGrosze <= 0) return 0;
  return Math.floor(totalGrosze / (zlPerHalf * 100)) / 2;
}

/** Ile groszy brakuje do kolejnej połówki pieczątki. */
export function groszeToNextHalf(totalGrosze: number, zlPerHalf: number): number {
  const step = zlPerHalf * 100;
  return step - (Math.max(0, totalGrosze) % step);
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

export type StampSlot = 'full' | 'half' | 'empty' | 'reward';

/** Pola karty pieczątek; ostatnie pole to zawsze nagroda (darmowy burger). */
export function stampSlots(stamps: number, total: number): StampSlot[] {
  return Array.from({ length: total }, (_, i): StampSlot => {
    if (i === total - 1) return 'reward';
    if (stamps >= i + 1) return 'full';
    if (stamps > i) return 'half';
    return 'empty';
  });
}
