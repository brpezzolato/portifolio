'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { langs, type Lang } from '@/lib/site';

type Text = Partial<Record<Lang, string>>;
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: Text) => string };

/* Texto no idioma escolhido; se faltar (ex.: algo ainda sem espanhol), cai
   para o inglês e depois para o português. */
const pick = (v: Text, l: Lang) => v[l] || v.en || v.pt || '';
const LangCtx = createContext<Ctx>({ lang: 'pt', setLang: () => {}, t: (v) => pick(v, 'pt') });

export const useLang = () => useContext(LangCtx);

/* Tema (claro/escuro, via next-themes) e idioma (PT/EN/ES, guardado no navegador). */
export function Providers({ children, nonce }: { children: React.ReactNode; nonce?: string }) {
  const [lang, setLangState] = useState<Lang>('pt');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if ((langs as readonly string[]).includes(saved ?? '')) setLangState(saved as Lang);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = { pt: 'pt-BR', en: 'en', es: 'es' }[lang];
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  };
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} nonce={nonce} disableTransitionOnChange>
      <LangCtx.Provider value={{ lang, setLang, t: (v) => pick(v, lang) }}>{children}</LangCtx.Provider>
    </ThemeProvider>
  );
}

/* Texto traduzido dentro de Server Components. */
export function Tr({ v }: { v: Text }) {
  const { t } = useLang();
  return <>{t(v)}</>;
}
