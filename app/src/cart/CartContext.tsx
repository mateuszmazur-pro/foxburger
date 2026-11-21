import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';
import { tenant } from '../tenant';
import { CartAction, CartLine, cartCount, cartReducer, cartTotal } from './cart';

type AddArgs = Omit<Extract<CartAction, { type: 'add' }>, 'type'>;
type CartApi = {
  lines: CartLine[];
  total: number;
  count: number;
  add: (a: AddArgs) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const api = useMemo<CartApi>(
    () => ({
      lines,
      total: cartTotal(lines, tenant.products),
      count: cartCount(lines),
      add: (a) => dispatch({ type: 'add', ...a }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [lines],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart(): CartApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart poza CartProvider');
  return v;
}
