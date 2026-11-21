import { toothPath } from '../components/toothPath';

test('dolina ząbka wypada dokładnie pod środkiem ekranu', () => {
  expect(toothPath(390, 137)).toContain('L195 125L');
  expect(toothPath(414, 150)).toContain('L207 138L');
});

test('ścieżka zaczyna się w lewym górnym rogu i pokrywa całą szerokość', () => {
  const d = toothPath(390, 137);
  expect(d.startsWith('M')).toBe(true);
  const xs = d.match(/-?\d+(\.\d+)? \d+/g)!.map((p) => Number(p.split(' ')[0]));
  expect(Math.min(...xs)).toBeLessThanOrEqual(0);
  expect(Math.max(...xs)).toBeGreaterThanOrEqual(390);
});

function inside(d: string, x: number, y: number): boolean {
  const pts = d.match(/-?\d+(\.\d+)?[ ,]-?\d+(\.\d+)?/g)!.map((p) => p.split(/[ ,]/).map(Number));
  // V/H skróty rozwijamy przez porównanie kolejnych punktów — ścieżka używa tylko M/L oraz V/H na krawędziach
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]; const [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

test('ciemne tło wypełnia całą górę nagłówka, łącznie z lewym górnym rogiem (bez skosu)', () => {
  const d = toothPath(390, 137);
  expect(inside(d, 3, 3)).toBe(true);
  expect(inside(d, 195, 60)).toBe(true);
  expect(inside(d, 387, 3)).toBe(true);
  expect(inside(d, 3, 120)).toBe(true);
  expect(inside(d, 195, 132)).toBe(false); // pod dnem wcięcia na środku jest jasne tło
});
