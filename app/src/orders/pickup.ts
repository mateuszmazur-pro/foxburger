/** Godziny odbioru co 15 min: od teraz + 30 min (w górę do kwadransa) do kwadransa przed zamknięciem. */
export function pickupSlots(now: Date, closesAtHour: number): string[] {
  const start = new Date(now.getTime() + 30 * 60000);
  start.setSeconds(0, 0);
  const m = start.getMinutes();
  if (m % 15 !== 0) start.setMinutes(m + (15 - (m % 15)));
  const close = new Date(now);
  close.setHours(closesAtHour, 0, 0, 0);
  const out: string[] = [];
  for (let t = start; t.getTime() <= close.getTime() - 15 * 60000; t = new Date(t.getTime() + 15 * 60000)) {
    out.push(`${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`);
  }
  return out;
}

/** Ostateczny sposób odbioru przy zamówieniu: godzina zawsze z aktualnych terminów, bez terminów — „jak najszybciej”. */
export function effectivePickup(mode: 'asap' | 'time', time: string | undefined, slots: string[]): { mode: 'asap' | 'time'; time: string | undefined } {
  if (mode === 'asap' || slots.length === 0) return { mode: 'asap', time: undefined };
  return { mode: 'time', time: time && slots.includes(time) ? time : slots[0] };
}
