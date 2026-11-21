export type OrderStatus = 'przyjete' | 'przygotowanie' | 'gotowe';

/** Demo: zamówienie samo przechodzi przez statusy (w etapie 3 statusy przyjdą z tabletu w lokalu). */
export function statusAt(createdMs: number, nowMs: number): OrderStatus {
  const s = nowMs - createdMs;
  if (s < 10000) return 'przyjete';
  if (s < 40000) return 'przygotowanie';
  return 'gotowe';
}
