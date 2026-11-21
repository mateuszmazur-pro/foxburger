import { loyaltyCode, secondsToRefresh } from '../loyalty/code';

const at = (h: number, m: number, s: number, ms = 0) => Date.UTC(2026, 10, 21, h, m, s, ms);

test('kod jest stały w obrębie minuty', () => {
  expect(loyaltyCode('demo', at(12, 0, 5))).toBe(loyaltyCode('demo', at(12, 0, 59)));
});

test('kod zmienia się na granicy minuty', () => {
  expect(loyaltyCode('demo', at(12, 1, 0))).not.toBe(loyaltyCode('demo', at(12, 0, 59, 999)));
});

test('różni klienci mają różne kody', () => {
  expect(loyaltyCode('a', at(12, 0, 0))).not.toBe(loyaltyCode('b', at(12, 0, 0)));
});

test('format XXXX-XXXX bez mylących znaków', () => {
  for (let m = 0; m < 50; m++) expect(loyaltyCode('demo', at(12, m, 0))).toMatch(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
});

test('sekundy do odświeżenia: 1 tuż przed końcem minuty, 60 na początku, nigdy mniej niż 1', () => {
  expect(secondsToRefresh(at(12, 0, 59, 500))).toBe(1);
  expect(secondsToRefresh(at(12, 1, 0, 0))).toBe(60);
  expect(secondsToRefresh(at(12, 0, 59, 999))).toBeGreaterThanOrEqual(1);
});
