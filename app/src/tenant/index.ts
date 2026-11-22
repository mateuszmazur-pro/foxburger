// Składa restaurację z folderu brand/. Przy nowej apce zmieniasz tylko pliki w brand/.
import brand from '../../brand/brand.json';
import logoSvg from '../../brand/logo.svg';
import { restauracja } from '../../brand/restauracja';
import type { Tenant } from './types';

export * from './types';

export const tenant: Tenant = {
  id: brand.slug,
  name: brand.nazwa,
  colors: brand.kolory,
  logoSvg,
  ...restauracja,
};

/** Proporcje logo (wysokość / szerokość) odczytane z viewBox pliku SVG. */
export function logoAspect(svg: string): number {
  const m = svg.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
  if (!m) return 1;
  const w = parseFloat(m[1]);
  const h = parseFloat(m[2]);
  return w > 0 && h > 0 ? h / w : 1;
}
