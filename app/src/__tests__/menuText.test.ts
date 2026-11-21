import { descLines, priceNumber } from '../menu/menuText';

test('opis dzieli się na dokładnie trzy linie po przecinkach', () => {
  const lines = descLines('100% wołowiny, bekon, ser, kiełbaski, pomidor, sałata, cebula, pikle, sos firmowy.');
  expect(lines).toEqual(['100% wołowiny, bekon, ser,', 'kiełbaski, pomidor, sałata,', 'cebula, pikle, sos firmowy']);
});

test('linie są możliwie równe — najdłuższa jest najkrótsza z możliwych', () => {
  const lines = descLines('100% wołowiny, bekon, ser, pomidor, sałata, cebula, pikle, sos firmowy, kiełbaski, jajo sadzone.');
  expect(lines).toHaveLength(3);
  expect(Math.max(...lines.map((l) => l.length))).toBeLessThanOrEqual(38);
});

test('krótki opis z mniej niż trzema składnikami nie jest sztucznie łamany', () => {
  expect(descLines('Chrupiące, grubo krojone.')).toEqual(['Chrupiące,', 'grubo krojone']);
  expect(descLines('Do wyboru w lokalu.')).toEqual(['Do wyboru w lokalu']);
});

test('cena w menu to sama liczba, grosze tylko gdy są', () => {
  expect(priceNumber(3900)).toBe('39');
  expect(priceNumber(3950)).toBe('39,50');
});
