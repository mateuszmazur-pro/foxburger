// Sprawdza folder brand/ — uruchom `npm test` po każdej zmianie menu, kolorów czy logo.
import brand from '../../brand/brand.json';
import { logoAspect, tenant } from '../tenant';

// Moduły Node w testach (bez dokładania @types/node do aplikacji).
declare const __dirname: string;
const fs = require('fs');
const path = require('path');
const appConfig = require('../../app.config.js');

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('brand.json', () => {
  test('identyfikator aplikacji pasuje do App Store i Google Play', () => {
    // np. pl.foxburger.app — małe litery, cyfry, kropki; każdy człon zaczyna się literą
    expect(brand.identyfikatorAplikacji).toMatch(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/);
  });

  test('slug to małe litery, cyfry i myślniki', () => {
    expect(brand.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test('wszystkie kolory są w formacie #RRGGBB', () => {
    const all = [...Object.values(brand.kolory), brand.kolorEkranuStartowego, brand.kolorTlaIkonyAndroid];
    for (const c of all) expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  test('pliki ikon wskazane w konfiguracji istnieją', () => {
    const e = appConfig.expo;
    const splash = e.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen')[1].image;
    const files = [e.icon, e.web.favicon, splash, ...Object.values(e.android.adaptiveIcon).filter((v) => String(v).startsWith('./'))];
    for (const f of files) expect(fs.existsSync(path.join(__dirname, '../..', String(f)))).toBe(true);
  });
});

describe('logo.svg', () => {
  test('to SVG z viewBox', () => {
    expect(tenant.logoSvg).toContain('<svg');
    expect(tenant.logoSvg).toMatch(/viewBox=/);
  });

  test('proporcje liczone z viewBox', () => {
    expect(logoAspect('<svg viewBox="0 0 200 100">')).toBe(0.5);
    expect(logoAspect('<svg>')).toBe(1);
  });
});

describe('restauracja.ts', () => {
  test('ma co najmniej jeden lokal, kategorię i produkt', () => {
    expect(tenant.locations.length).toBeGreaterThan(0);
    expect(tenant.categories.length).toBeGreaterThan(0);
    expect(tenant.products.length).toBeGreaterThan(0);
  });

  test('identyfikatory się nie powtarzają', () => {
    expect(unique(tenant.locations.map((l) => l.id))).toBe(true);
    expect(unique(tenant.categories.map((c) => c.id))).toBe(true);
    expect(unique(tenant.products.map((p) => p.id))).toBe(true);
    expect(unique(tenant.banner.map((b) => b.id))).toBe(true);
  });

  test('każdy produkt ma dodatnią cenę i istniejącą kategorię', () => {
    const cats = new Set(tenant.categories.map((c) => c.id));
    for (const p of tenant.products) {
      expect(p.price).toBeGreaterThan(0);
      expect(cats.has(p.categoryId)).toBe(true);
      for (const a of p.addons) expect(a.price).toBeGreaterThanOrEqual(0);
    }
  });

  test('banery wskazują istniejące produkty', () => {
    const ids = new Set(tenant.products.map((p) => p.id));
    for (const b of tenant.banner) if (b.productId) expect(ids.has(b.productId)).toBe(true);
  });

  test('godziny zamknięcia lokali są w zakresie 0–23', () => {
    for (const l of tenant.locations) {
      expect(l.closesAt).toBeGreaterThanOrEqual(0);
      expect(l.closesAt).toBeLessThanOrEqual(23);
    }
  });

  test('program lojalnościowy i teksty są uzupełnione', () => {
    expect(tenant.loyalty.programName.trim()).not.toBe('');
    expect(tenant.loyalty.qrPrefix).toMatch(/^[A-Z0-9]+$/);
    expect(tenant.loyalty.stampsToReward).toBeGreaterThan(0);
    expect(tenant.texts.homeTitle.trim()).not.toBe('');
    expect(tenant.texts.promoEmpty.trim()).not.toBe('');
  });
});
