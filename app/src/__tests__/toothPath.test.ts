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
