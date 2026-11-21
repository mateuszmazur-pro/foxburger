import { statusAt } from '../orders/status';

test('demo: statusy zmieniają się po 10 s i 40 s', () => {
  expect(statusAt(0, 0)).toBe('przyjete');
  expect(statusAt(0, 9999)).toBe('przyjete');
  expect(statusAt(0, 10000)).toBe('przygotowanie');
  expect(statusAt(0, 39900)).toBe('przygotowanie');
  expect(statusAt(0, 40000)).toBe('gotowe');
});
