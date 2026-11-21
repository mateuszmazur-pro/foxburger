import { tenant } from '../tenant';

describe('konfiguracja Fox Burger', () => {
  test('każdy produkt ma dodatnią cenę i istniejącą kategorię', () => {
    const cats = new Set(tenant.categories.map((c) => c.id));
    for (const p of tenant.products) {
      expect(p.price).toBeGreaterThan(0);
      expect(cats.has(p.categoryId)).toBe(true);
    }
  });

  test('ma co najmniej jeden lokal', () => {
    expect(tenant.locations.length).toBeGreaterThan(0);
  });

  test('ceny burgerów z Pabianic', () => {
    const price = (name: string) => tenant.products.find((p) => p.name === name)?.price;
    expect(price('Fox Farmer')).toBe(3900);
    expect(price('Sulejowska Buła')).toBe(3300);
    expect(price('Mad Fox')).toBe(4800);
    expect(tenant.products.filter((p) => p.categoryId === 'burgery')).toHaveLength(9);
  });
});
