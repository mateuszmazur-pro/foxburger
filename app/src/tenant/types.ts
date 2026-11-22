import type { ImageSourcePropType } from 'react-native';

export type Colors = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  line: string;
  brand: string;
  brandDark: string;
  brandLight: string;
  navActive: string;
  navIdle: string;
  dark: string;
  stampOn: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  /** Zamknięcie lokalu, godzina 0–23 — do wyboru godziny odbioru. */
  closesAt: number;
};

export type Category = { id: string; name: string };

export type Addon = { id: string; name: string; price: number };

export type Product = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  /** Cena w groszach. */
  price: number;
  categoryId: string;
  image: ImageSourcePropType;
  addons: Addon[];
  setUpgrade?: { label: string; price: number };
};

export type BannerSlide = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  priceLabel: string;
  price?: number;
  cta: string;
  productId?: string;
};

export type Loyalty = {
  /** Nazwa programu lojalnościowego, np. „Fox Club”. */
  programName: string;
  /** Przedrostek w kodzie QR, np. „FOXCLUB” — kasa rozpoznaje po nim lokal. */
  qrPrefix: string;
  stampsToReward: number;
  demoStamps: number;
};

export type Texts = {
  /** Druga linia powitania na ekranie Start, pod „Witaj, Imię!”. */
  homeTitle: string;
  /** Tekst na pustej zakładce Promocje. */
  promoEmpty: string;
};

/** Treść restauracji z brand/restauracja.ts — wszystko poza nazwą, kolorami i logo. */
export type RestaurantContent = {
  locations: Location[];
  categories: Category[];
  products: Product[];
  banner: BannerSlide[];
  loyalty: Loyalty;
  texts: Texts;
  demoCustomer: { id: string; firstName: string };
};

export type Tenant = RestaurantContent & {
  id: string;
  name: string;
  colors: Colors;
  logoSvg: string;
};
