import { formatPLN } from '../format';

test('pełne złote bez groszy', () => {
  expect(formatPLN(3900)).toBe('39 zł');
  expect(formatPLN(0)).toBe('0 zł');
});

test('grosze po przecinku', () => {
  expect(formatPLN(3950)).toBe('39,50 zł');
  expect(formatPLN(4305)).toBe('43,05 zł');
});
