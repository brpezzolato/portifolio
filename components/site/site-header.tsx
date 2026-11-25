'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { nav, site } from '@/lib/site';
import { cn } from 'cn';

/* Barra flutuante em vidro, centralizada (a única superfície com lente). */
export function SiteHeader() {
  const pathname = usePathname();
  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <nav
        aria-label="Principal"
        className="glass glass-bar glass-lens flex items-center gap-1 p-1.5"
      >
        <Link
          href="/"
          aria-label={`${site.name}, início`}
          className="mr-1 grid size-8 place-items-center rounded-full bg-foreground font-mono text-xs font-semibold text-background"
        >
          {site.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
        </Link>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative rounded-full px-3.5 py-1.5 text-sm transition-colors',
              active(item.href)
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active(item.href) && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 -z-10 rounded-full bg-foreground/8 ring-1 ring-foreground/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
