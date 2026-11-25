'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { nav, site, ui } from '@/lib/site';
import { cn } from 'cn';
import { useLang } from './providers';

/* Cabeçalho largo: iniciais, âncoras das seções, idioma e tema. Ao rolar,
   ganha fundo de vidro e encolhe. No celular, o menu abre numa gaveta. */
export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const LangSwitch = (
    <div className="flex rounded-full border border-border p-0.5 text-xs">
      {(['pt', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            'rounded-full px-2.5 py-1 uppercase transition-colors',
            lang === l ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );

  const ThemeSwitch = (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label={t(ui.theme)}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div
        className={cn(
          'mx-auto flex max-w-[1280px] items-center justify-between rounded-full px-4 transition-all duration-500',
          scrolled ? 'h-14 border border-border bg-background/75 shadow-sm backdrop-blur-xl' : 'h-16 border border-transparent',
        )}
      >
        <Link href="/#inicio" aria-label={site.name} className="grid size-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
          {site.initials}
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.key}
              href={n.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {t(ui.nav[n.key])}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">{LangSwitch}</div>
          {ThemeSwitch}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label={t(ui.menu)} />}>
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <SheetTitle className="text-sm text-muted-foreground">{t(ui.menu)}</SheetTitle>
              <nav className="mt-6 flex flex-col">
                {nav.map((n) => (
                  <SheetClose key={n.key} render={<Link href={n.href} className="border-b border-border py-4 text-2xl font-medium tracking-tight" />}>
                    {t(ui.nav[n.key])}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6">{LangSwitch}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
