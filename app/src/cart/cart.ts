import type { Product } from '../tenant';

export type CartLine = {
  key: string;
  productId: string;
  qty: number;
  addonIds: string[];
  asSet: boolean;
  note: string;
};

export type CartAction =
  | { type: 'add'; productId: string; addonIds?: string[]; asSet?: boolean; note?: string; qty?: number }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'clear' };

export function lineKey(productId: string, addonIds: string[], asSet: boolean, note: string): string {
  return [productId, [...addonIds].sort().join('+'), asSet ? 'set' : '', note.trim()].join('|');
}

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const addonIds = [...(action.addonIds ?? [])].sort();
      const asSet = action.asSet ?? false;
      const note = (action.note ?? '').trim();
      const qty = action.qty ?? 1;
      const key = lineKey(action.productId, addonIds, asSet, note);
      const existing = state.find((l) => l.key === key);
      if (existing) return state.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...state, { key, productId: action.productId, qty, addonIds, asSet, note }];
    }
    case 'setQty':
      if (action.qty <= 0) return state.filter((l) => l.key !== action.key);
      return state.map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l));
    case 'clear':
      return [];
  }
}

export function unitPrice(line: Pick<CartLine, 'productId' | 'addonIds' | 'asSet'>, products: Product[]): number {
  const p = products.find((x) => x.id === line.productId);
  if (!p) return 0;
  const addons = p.addons.filter((a) => line.addonIds.includes(a.id)).reduce((s, a) => s + a.price, 0);
  return p.price + addons + (line.asSet && p.setUpgrade ? p.setUpgrade.price : 0);
}

export const lineTotal = (line: CartLine, products: Product[]) => unitPrice(line, products) * line.qty;
export const cartTotal = (lines: CartLine[], products: Product[]) => lines.reduce((s, l) => s + lineTotal(l, products), 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((s, l) => s + l.qty, 0);
export const plainKey = (productId: string) => lineKey(productId, [], false, '');
export const qtyForProduct = (lines: CartLine[], productId: string) =>
  lines.find((l) => l.key === plainKey(productId))?.qty ?? 0;
