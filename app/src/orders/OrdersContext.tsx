import { createContext, ReactNode, useContext, useState } from 'react';
import type { CartLine } from '../cart/cart';

export type Pickup = { locationId: string; mode: 'asap' | 'time'; time?: string };
export type Order = { id: string; number: number; lines: CartLine[]; total: number; pickup: Pickup; payment: string; createdMs: number };

type Api = { orders: Order[]; place: (o: Omit<Order, 'id' | 'number' | 'createdMs'>) => string; get: (id: string) => Order | undefined };
const Ctx = createContext<Api | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const api: Api = {
    orders,
    place: (o) => {
      const number = 128 + orders.length;
      const id = `z${number}`;
      setOrders((prev) => [...prev, { ...o, id, number, createdMs: Date.now() }]);
      return id;
    },
    get: (id) => orders.find((o) => o.id === id),
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useOrders(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOrders poza OrdersProvider');
  return v;
}
