import { pickupSlots } from '../orders/pickup';

const at = (h: number, m: number) => new Date(2026, 10, 21, h, m, 0, 0);

test('pierwszy termin to teraz + 30 min zaokrąglone w górę do kwadransa', () => {
  expect(pickupSlots(at(18, 8), 21)[0]).toBe('18:45');
  expect(pickupSlots(at(18, 0), 21)[0]).toBe('18:30');
});

test('ostatni termin kwadrans przed zamknięciem', () => {
  const s = pickupSlots(at(18, 8), 21);
  expect(s[s.length - 1]).toBe('20:45');
});

test('tuż przed zamknięciem nie ma terminów', () => {
  expect(pickupSlots(at(20, 31), 21)).toEqual([]);
});
