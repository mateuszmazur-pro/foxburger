import type { Addon, Tenant } from './types';
import { foxLogoSvg } from './fox-logo';
import { foxLoaderSvg } from './fox-loader';
import { foxSplatSvg } from './fox-splat';

const burgerImg = require('../../assets/images/burger.jpg');

// PRZYKŁADOWE — do potwierdzenia z Foxem (ceny dodatków nieznane)
const burgerAddons: Addon[] = [
  { id: 'podwojne-mieso', name: 'Podwójne mięso', price: 1200 },
  { id: 'ekstra-bekon', name: 'Ekstra bekon', price: 600 },
  { id: 'oscypek', name: 'Oscypek', price: 600 },
];
// PRZYKŁADOWE — do potwierdzenia z Foxem
const setUpgrade = { label: 'Duże frytki belgijskie + napój', price: 1500 };

const burger = (
  id: string,
  name: string,
  description: string,
  ingredients: string[],
  price: number,
) => ({ id, name, description, ingredients, price, categoryId: 'burgery', image: burgerImg, addons: burgerAddons, setUpgrade });

export const fox: Tenant = {
  id: 'fox-burger',
  name: 'Fox Burger',
  colors: {
    bg: '#F8F3F0',
    card: '#FFFFFF',
    text: '#1C1917',
    muted: '#78716C',
    line: '#EDE4DD',
    brand: '#AD0000',
    brandDark: '#8A0000',
    brandLight: '#FBE6E4',
    navActive: '#FDBA74',
    navIdle: '#D6D3D1',
    dark: '#1C1917',
    stampOn: '#E0302A',
  },
  logoSvg: foxLogoSvg,
  introSvg: foxLoaderSvg,
  priceSplatSvg: foxSplatSvg,
  locations: [
    { id: 'pabianice', name: 'Pabianice', address: 'Popławska 4/20, Pabianice', phone: '+48503563292', closesAt: 21 },
    { id: 'opoczno', name: 'Opoczno', address: 'ul. Gen. Kazimierza Bończy-Załęskiego 29A, Opoczno', closesAt: 21 },
    { id: 'sulejow', name: 'Sulejów (foodtruck)', address: 'Polana, Sulejów', closesAt: 20 },
    { id: 'lodz', name: 'Łódź', address: 'Łódź', closesAt: 21 },
  ],
  categories: [
    { id: 'burgery', name: 'Burgery' },
    { id: 'frytki', name: 'Frytki' },
    { id: 'napoje', name: 'Napoje' },
  ],
  products: [
    burger('sulejowska-bula', 'Sulejowska Buła', '100% wołowiny, bekon, pomidor, sałata, cebula, pikle, sos firmowy.', ['100% wołowiny', 'Bekon', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy'], 3300),
    burger('fox-burger-cheese', 'Fox Burger Cheese', '100% wołowiny, bekon, ser, pomidor, sałata, cebula, pikle, sos firmowy.', ['100% wołowiny', 'Bekon', 'Ser', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy'], 3500),
    burger('fox-double-cheese', 'Fox Double Cheese', '100% wołowiny, bekon, dwa rodzaje sera, pomidor, sałata, cebula, pikle, sos firmowy.', ['100% wołowiny', 'Bekon', 'Dwa rodzaje sera', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy'], 3700),
    burger('fox-sausage', 'Fox Sausage', '100% wołowiny, bekon, ser, kiełbaski, pomidor, sałata, cebula, pikle, sos firmowy.', ['100% wołowiny', 'Bekon', 'Ser', 'Bułka', 'Kiełbaski', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy'], 3900),
    burger('fox-farmer', 'Fox Farmer', '100% wołowiny, bekon, ser, pomidor, sałata, cebula, pikle, sos firmowy, jajo sadzone.', ['100% wołowiny', 'Bekon', 'Ser', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy', 'Jajo sadzone'], 3900),
    burger('fox-meal', 'Fox Meal', '100% wołowiny, bekon, ser, pomidor, sałata, cebula, pikle, sos firmowy, małe frytki.', ['100% wołowiny', 'Bekon', 'Ser', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy', 'Małe frytki'], 4200),
    burger('fox-royale', 'Fox Royale', '100% wołowiny, bekon, ser, pomidor, sałata, cebula, pikle, sos firmowy, kiełbaski, jajo sadzone.', ['100% wołowiny', 'Bekon', 'Ser', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy', 'Kiełbaski', 'Jajo sadzone'], 4300),
    burger('fox-zakopianski', 'Fox Zakopiański', '100% wołowiny, bekon, ser, pomidor, sałata, cebula, pikle, oscypek, żurawina, sos firmowy.', ['100% wołowiny', 'Bekon', 'Ser', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Oscypek', 'Żurawina', 'Sos firmowy'], 4300),
    burger('mad-fox', 'Mad Fox', '2 × 100% wołowiny, 2 × bekon, ser, pomidor, sałata, cebula, pikle, sos firmowy.', ['2 × 100% wołowiny', '2 × bekon', 'Ser', 'Bułka', 'Pomidor', 'Sałata', 'Cebula', 'Pikle', 'Sos firmowy'], 4800),
    // PRZYKŁADOWE — do potwierdzenia z Foxem
    { id: 'frytki-duze', name: 'Duże frytki belgijskie', description: 'Chrupiące, grubo krojone.', ingredients: [], price: 1200, categoryId: 'frytki', image: burgerImg, addons: [] },
    { id: 'napoj', name: 'Napój 0,5 l', description: 'Do wyboru w lokalu.', ingredients: [], price: 800, categoryId: 'napoje', image: burgerImg, addons: [] },
  ],
  banner: [
    { id: 'burger-tygodnia', label: 'BURGER TYGODNIA', title: 'Fox Farmer', description: '100% wołowiny, bekon, ser, jajo sadzone i sos firmowy.', image: burgerImg, priceLabel: 'Cena', price: 3900, cta: 'Zamów', productId: 'fox-farmer' },
    { id: 'promocja', label: 'PROMOCJA', title: 'Zestaw z frytkami', description: 'Burger, duże frytki belgijskie i napój w lepszej cenie.', image: burgerImg, priceLabel: 'Cena zestawu', cta: 'Zamów', productId: 'fox-farmer' },
  ],
  loyalty: { stampsToReward: 10, demoStamps: 7, zlPerHalfStamp: 50, clubName: 'Fox Club' },
  demoCustomer: { id: 'demo-mateusz', firstName: 'Mateusz' },
};
