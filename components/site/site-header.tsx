'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { nav, site, ui } from '@/lib/site';
import { cn } from 'cn';
import { useLang } from './providers';

/* Topo: só as iniciais e os botões de idioma e tema, soltos nos cantos.
   Navegação: uma barra flutuante embaixo da tela, que se esconde ao rolar
   para baixo e volta ao rolar para cima. */
export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 400);
      last = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-[max(1.1rem,env(safe-area-inset-top))] sm:px-8">
        <Link href="/#inicio" className="pointer-events-auto text-sm font-semibold tracking-tight">
          {site.initials}
          <span className="text-signal">.</span>
        </Link>
        <div className="pointer-events-auto flex items-center gap-1 text-sm">
          {(['pt', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn('px-1.5 py-1 uppercase transition-colors', lang === l ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              {l}
            </button>
          ))}
          <button
            type="button"
            aria-label={t(ui.theme)}
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="ml-2 grid size-8 place-items-center rounded-full transition-colors hover:bg-foreground/5"
          >
            {mounted && resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>

      <nav
        aria-label="Principal"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-[cubic-bezier(.22,.9,.28,1)]',
          hidden && 'translate-y-[150%]',
        )}
      >
        <ul className="flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-border bg-background/70 p-1.5 shadow-[0_10px_40px_-15px_rgb(0_0_0/0.35)] backdrop-blur-xl">
          {nav.slice(1).map((n) => ((
            <li key={n.key} className={n.key === 'novidades' ? 'hidden sm:block' : undefined}>
              <Link
                href={n.href}
                className="block rounded-full px-2.5 py-2 text-[13px] whitespace-nowrap sm:px-3.5 sm:text-sm text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {t(ui.nav[n.key])}
              </Link>
            </li>
          )))}
        </ul>
      </nav>
    </>
  );
}
