'use client';

import { createContext, useContext } from 'react';
import { site as defaults } from '@/lib/site';
import type { SiteData } from '@/lib/settings';

/* Disponibiliza o conteúdo editável (vindo do banco) para os componentes
   do site. Sem provedor, usa os valores padrão de lib/site.ts. */
const Ctx = createContext<SiteData>(defaults as unknown as SiteData);

export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
