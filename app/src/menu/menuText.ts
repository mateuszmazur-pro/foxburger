/** Dzieli opis na (maks.) trzy linie po przecinkach tak, by najdłuższa linia była jak najkrótsza. */
export function descLines(description: string): string[] {
  const parts = description.replace(/\.\s*$/, '').split(', ').filter(Boolean);
  if (parts.length <= 3) return parts.map((p, i) => (i < parts.length - 1 ? `${p},` : p));
  let best: string[] = [];
  let bestLen = Infinity;
  for (let i = 1; i < parts.length - 1; i++) {
    for (let j = i + 1; j < parts.length; j++) {
      const lines = [parts.slice(0, i).join(', ') + ',', parts.slice(i, j).join(', ') + ',', parts.slice(j).join(', ')];
      const len = Math.max(...lines.map((l) => l.length));
      if (len < bestLen) { bestLen = len; best = lines; }
    }
  }
  return best;
}

/** Cena do menu: sama liczba, bez „zł”; grosze tylko gdy niezerowe. */
export function priceNumber(grosze: number): string {
  const zl = Math.floor(grosze / 100);
  const gr = grosze % 100;
  return gr === 0 ? String(zl) : `${zl},${String(gr).padStart(2, '0')}`;
}
