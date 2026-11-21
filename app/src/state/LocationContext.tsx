import { createContext, ReactNode, useContext, useState } from 'react';
import { Location, tenant } from '../tenant';

type Api = { location: Location; setLocationId: (id: string) => void };
const Ctx = createContext<Api | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(tenant.locations[0].id);
  const location = tenant.locations.find((l) => l.id === id) ?? tenant.locations[0];
  return <Ctx.Provider value={{ location, setLocationId: setId }}>{children}</Ctx.Provider>;
}

export function useLocation(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLocation poza LocationProvider');
  return v;
}
