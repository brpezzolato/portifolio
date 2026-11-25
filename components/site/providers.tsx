'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import type { Lang } from '@/lib/site';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: Record<Lang, string>) => string };
const LangCtx = createContext<Ctx>({ lang: 'pt', setLang: () => {}, t: (v) => v.pt });

export const useLang = () => useContext(LangCtx);

/* Tema (claro/escuro, via next-themes) e idioma (PT/EN, guardado no navegador). */
export function Providers({ children, nonce }: { children: React.ReactNode; nonce?: string }) {
  const [lang, setLangState] = useState<Lang>('pt');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'en' || saved === 'pt') setLangState(saved);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  };
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} nonce={nonce} disableTransitionOnChange>
      <LangCtx.Provider value={{ lang, setLang, t: (v) => v[lang] }}>{children}</LangCtx.Provider>
    </ThemeProvider>
  );
}

/* Texto traduzido dentro de Server Components. */
export function Tr({ v }: { v: Record<Lang, string> }) {
  const { t } = useLang();
  return <>{t(v)}</>;
}
