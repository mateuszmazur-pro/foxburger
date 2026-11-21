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

export type Tenant = {
  id: string;
  name: string;
  colors: Colors;
  logoSvg: string;
  /** Animowane intro przy starcie aplikacji (SVG z animacjami CSS). */
  introSvg?: string;
  /** Grafika pod ceną w menu (np. maźnięcie pędzla), rysowana kolorem marki. */
  priceSplatSvg?: string;
  locations: Location[];
  categories: Category[];
  products: Product[];
  banner: BannerSlide[];
  loyalty: { stampsToReward: number; demoStamps: number; /** co ile zł pół pieczątki za zamówienie */ zlPerHalfStamp: number; clubName: string };
  demoCustomer: { id: string; firstName: string };
};
