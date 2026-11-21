import { groszeToNextHalf, stampsForOrder, stampsLabel } from '../loyalty/stamps';

const ZL = 100;

test('pół pieczątki za każde pełne 50 zł — poniżej 50 zł nic', () => {
  expect(stampsForOrder(39 * ZL, 50)).toBe(0);
  expect(stampsForOrder(50 * ZL - 1, 50)).toBe(0);
  expect(stampsForOrder(50 * ZL, 50)).toBe(0.5);
  expect(stampsForOrder(78 * ZL, 50)).toBe(0.5);
  expect(stampsForOrder(100 * ZL, 50)).toBe(1);
  expect(stampsForOrder(117 * ZL, 50)).toBe(1);
  expect(stampsForOrder(156 * ZL, 50)).toBe(1.5);
});

test('ile brakuje do następnej połówki', () => {
  expect(groszeToNextHalf(39 * ZL, 50)).toBe(11 * ZL);
  expect(groszeToNextHalf(78 * ZL, 50)).toBe(22 * ZL);
  expect(groszeToNextHalf(100 * ZL, 50)).toBe(50 * ZL);
});

test('pusty koszyk nie daje pieczątek', () => {
  expect(stampsForOrder(0, 50)).toBe(0);
});

test('podpis z przecinkiem i poprawną odmianą', () => {
  expect(stampsLabel(0.5)).toBe('0,5 pieczątki');
  expect(stampsLabel(1)).toBe('1 pieczątka');
  expect(stampsLabel(1.5)).toBe('1,5 pieczątki');
  expect(stampsLabel(2)).toBe('2 pieczątki');
  expect(stampsLabel(5)).toBe('5 pieczątek');
  expect(stampsLabel(12)).toBe('12 pieczątek');
  expect(stampsLabel(22)).toBe('22 pieczątki');
});
