'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav, site } from '@/lib/site';
import { cn } from 'cn';
import { LiveClock } from './live-clock';
import { ScrambleText } from './scramble-text';

/* Cabeçalho mínimo em três pontas: nome, navegação e relógio. Usa
   mix-blend-difference para ler bem sobre qualquer fundo. */
export function SiteHeader() {
  const pathname = usePathname();
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-4 px-5 pt-[max(1.1rem,env(safe-area-inset-top))] pb-3 text-sm sm:grid-cols-3 sm:px-8">
        <Link href="/" className="font-medium tracking-tight">
          <ScrambleText text={site.name} hover />
        </Link>
        <nav aria-label="Principal" className="flex gap-5 sm:justify-center">
          {nav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('transition-opacity hover:opacity-100', active(item.href) ? 'opacity-100' : 'opacity-60')}
            >
              <ScrambleText text={item.label} hover />
            </Link>
          ))}
        </nav>
        <LiveClock className="hidden justify-self-end font-mono text-xs opacity-60 sm:block" />
      </div>
    </header>
  );
}
