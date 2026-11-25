'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { nav, site, ui } from '@/lib/site';
import { cn } from 'cn';
import { useLang } from './providers';

/* Navegação em pílula flutuante (fundo levemente translúcido, borda fina e
   desfoque discreto, sem vidro líquido): iniciais,
   links das seções com uma "gota" que segue o mouse, idioma e tema. Ao rolar,
   a pílula encolhe um pouco. No celular, os links vão para uma gaveta. */
export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const Lang = (
    <div className="flex items-center rounded-full bg-foreground/5 p-0.5 text-xs">
      {(['pt', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            'rounded-full px-2 py-1 uppercase transition-colors',
            lang === l ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[max(0.9rem,env(safe-area-inset-top))]">
      <div
        className={cn(
          'pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-background/80 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.18)] backdrop-blur-md transition-[padding] duration-500',
          scrolled ? 'p-1' : 'p-1.5',
        )}
      >
        <Link
          href="/#inicio"
          aria-label={site.name}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background transition-transform hover:scale-105"
        >
          {site.initials}
        </Link>

        <nav aria-label="Principal" className="hidden md:block" onPointerLeave={() => setHover(null)}>
          <ul className="flex items-center">
            {nav.slice(1).map((n) => (
              <li key={n.key} className="relative">
                <Link
                  href={n.href}
                  onPointerEnter={() => setHover(n.key)}
                  className="relative z-10 block rounded-full px-3.5 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {t(ui.nav[n.key])}
                </Link>
                {hover === n.key && (
                  <motion.span
                    layoutId="nav-drop"
                    className="absolute inset-0 rounded-full bg-foreground/[0.07] ring-1 ring-foreground/10"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <span className="mx-1 hidden h-5 w-px bg-foreground/10 md:block" />
        <div className="hidden sm:block">{Lang}</div>
        <button
          type="button"
          aria-label={t(ui.theme)}
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="grid size-9 place-items-center rounded-full transition-colors hover:bg-foreground/[0.07]"
        >
          {mounted && resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <Sheet>
          <SheetTrigger
            render={<button type="button" aria-label={t(ui.menu)} className="grid size-9 place-items-center rounded-full hover:bg-foreground/[0.07] md:hidden" />}
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
    </header>
  );
}
