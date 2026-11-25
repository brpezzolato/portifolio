'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { nav, site, ui } from '@/lib/site';
import { cn } from 'cn';
import { useLang } from './providers';

/* Barra no topo, de ponta a ponta: iniciais, links das seções (com
   sublinhado que desliza) e idioma/tema. Transparente no início; ao rolar,
   ganha fundo de vidro e uma linha fina embaixo. No celular, menu em gaveta. */
export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const Lang = (
    <div className="flex items-center text-sm">
      {(['pt', 'en'] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="px-1 text-muted-foreground/40">/</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={cn('uppercase transition-colors', lang === l ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled ? 'border-b border-border bg-background/70 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 pt-[env(safe-area-inset-top)] sm:px-8">
        <Link href="/#inicio" className="text-sm font-semibold tracking-tight">
          {site.name}
          <span className="text-signal">.</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {nav.slice(1).map((n) => (
            <Link
              key={n.key}
              href={n.href}
              className="relative text-sm text-muted-foreground transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-500 hover:text-foreground hover:after:origin-left hover:after:scale-x-100"
            >
              {t(ui.nav[n.key])}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">{Lang}</div>
          <button
            type="button"
            aria-label={t(ui.theme)}
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="grid size-9 place-items-center rounded-full transition-colors hover:bg-foreground/5"
          >
            {mounted && resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Sheet>
            <SheetTrigger
              render={<button type="button" aria-label={t(ui.menu)} className="grid size-9 place-items-center rounded-full hover:bg-foreground/5 md:hidden" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <SheetTitle className="text-sm text-muted-foreground">{t(ui.menu)}</SheetTitle>
              <nav className="mt-6 flex flex-col">
                {nav.slice(1).map((n) => (
                  <SheetClose key={n.key} render={<Link href={n.href} className="border-b border-border py-4 text-2xl font-medium tracking-tight" />}>
                    {t(ui.nav[n.key])}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6">{Lang}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
