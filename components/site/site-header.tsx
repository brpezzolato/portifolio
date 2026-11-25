'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav, site } from '@/lib/site';
import { cn } from 'cn';

/* Cabeçalho mínimo: nome à esquerda, dois links à direita. */
export function SiteHeader() {
  const pathname = usePathname();
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-background from-40% to-transparent pb-6">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-sm">
        <Link href="/" className="font-medium tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Principal" className="flex gap-6">
          {nav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-foreground after:transition-transform after:duration-500',
                active(item.href)
                  ? 'text-foreground after:scale-x-100'
                  : 'text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
