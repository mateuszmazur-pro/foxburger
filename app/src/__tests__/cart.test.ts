import { cartReducer, cartTotal, cartCount, lineTotal, qtyForProduct, CartLine } from '../cart/cart';
import { tenant } from '../tenant';

const P = tenant.products;
const add = (s: CartLine[], a: Partial<{ productId: string; addonIds: string[]; asSet: boolean; note: string; qty: number }>) =>
  cartReducer(s, { type: 'add', productId: 'fox-farmer', ...a });

test('ten sam produkt bez dodatków dodany 2× to jedna linia z ilością 2', () => {
  const s = add(add([], {}), {});
  expect(s).toHaveLength(1);
  expect(s[0].qty).toBe(2);
});

test('ten sam produkt z dodatkiem to osobna linia', () => {
  const s = add(add([], {}), { addonIds: ['oscypek'] });
  expect(s).toHaveLength(2);
});

test('kolejność dodatków nie tworzy nowej linii', () => {
  const s = add(add([], { addonIds: ['oscypek', 'ekstra-bekon'] }), { addonIds: ['ekstra-bekon', 'oscypek'] });
  expect(s).toHaveLength(1);
  expect(s[0].qty).toBe(2);
});

test('uwagi różniące się tylko spacjami to ta sama linia', () => {
  const s = add(add([], { note: ' bez cebuli ' }), { note: 'bez cebuli' });
  expect(s).toHaveLength(1);
});

test('ustawienie ilości 0 usuwa linię', () => {
  const s = add([], {});
  expect(cartReducer(s, { type: 'setQty', key: s[0].key, qty: 0 })).toEqual([]);
});

test('suma linii: burger + podwójne mięso + zestaw, 2 sztuki', () => {
  const s = add([], { addonIds: ['podwojne-mieso'], asSet: true, qty: 2 });
  expect(lineTotal(s[0], P)).toBe(2 * (3900 + 1200 + 1500));
});

test('pusty koszyk: suma 0, liczba 0', () => {
  expect(cartTotal([], P)).toBe(0);
  expect(cartCount([])).toBe(0);
});

test('liczba sztuk i suma całego koszyka', () => {
  let s = add([], { qty: 2 });
  s = add(s, { productId: 'sulejowska-bula' });
  expect(cartCount(s)).toBe(3);
  expect(cartTotal(s, P)).toBe(2 * 3900 + 3500);
});

test('qtyForProduct liczy tylko linie bez dodatków, zestawu i uwag', () => {
  let s = add([], { qty: 2 });
  s = add(s, { addonIds: ['oscypek'] });
  s = add(s, { note: 'bez cebuli' });
  expect(qtyForProduct(s, 'fox-farmer')).toBe(2);
});

test('clear czyści koszyk', () => {
  expect(cartReducer(add([], {}), { type: 'clear' })).toEqual([]);
});
