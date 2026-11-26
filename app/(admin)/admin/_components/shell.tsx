'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowUpRight,
  FileBadge,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PenSquare,
  ShieldCheck,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from 'cn';
import { signOut } from '../_actions/auth';

type Item = { href: string; label: string; icon: typeof Inbox; badge?: number };

/* Moldura do painel: barra lateral fixa no computador (marca, navegação em
   grupos, atalho para o site e conta) e barra superior com gaveta no celular. */
export function AdminShell({
  base,
  email,
  messages,
  children,
}: {
  base: string;
  email: string;
  messages: number;
  children: React.ReactNode;
}) {
  const groups: { title: string; items: Item[] }[] = [
    {
      title: 'Geral',
      items: [
        { href: '', label: 'Visão geral', icon: LayoutDashboard },
        { href: '/mensagens', label: 'Mensagens', icon: Inbox, badge: messages },
      ],
    },
    {
      title: 'Site',
      items: [
        { href: '/conteudo', label: 'Conteúdo', icon: PenSquare },
        { href: '/curriculo', label: 'Currículo', icon: FileBadge },
      ],
    },
    {
      title: 'Publicações',
      items: [
        { href: '/projetos', label: 'Projetos', icon: FolderKanban },
        { href: '/novidades', label: 'Novidades', icon: FileText },
      ],
    },
    { title: 'Conta', items: [{ href: '/seguranca', label: 'Segurança', icon: ShieldCheck }] },
  ];

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-card/70 lg:flex">
        <Sidebar base={base} email={email} groups={groups} />
      </aside>

      <MobileBar base={base} email={email} groups={groups} />

      <main className="min-w-0 px-5 pt-6 pb-24 sm:px-8 lg:px-12 lg:pt-12">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

function Brand({ base }: { base: string }) {
  return (
    <Link href={base} className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-xl bg-foreground text-xs font-semibold text-background">BP</span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight">
          Painel<span className="text-signal">.</span>
        </span>
        <span className="block text-xs text-muted-foreground">Bruno Pezzolato</span>
      </span>
    </Link>
  );
}

function Sidebar({
  base,
  email,
  groups,
  onNavigate,
}: {
  base: string;
  email: string;
  groups: { title: string; items: Item[] }[];
  onNavigate?: () => void;
}) {
  const path = usePathname();
  const active = (href: string) => (href === '' ? path === base : path === base + href || path.startsWith(`${base}${href}/`));

  return (
    <div className="flex h-full flex-col p-4">
      <div className="px-2 py-2">
        <Brand base={base} />
      </div>

      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-1.5 px-3 text-[0.7rem] font-medium tracking-wider text-muted-foreground/80 uppercase">{g.title}</p>
            <ul className="space-y-0.5">
              {g.items.map((i) => {
                const on = active(i.href);
                return (
                  <li key={i.href}>
                    <Link
                      href={`${base}${i.href}`}
                      onClick={onNavigate}
                      aria-current={on ? 'page' : undefined}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                        on ? 'bg-foreground text-background' : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <i.icon className={cn('size-4', on ? 'text-background' : 'text-muted-foreground group-hover:text-foreground')} />
                      <span className="flex-1">{i.label}</span>
                      {!!i.badge && (
                        <span
                          className={cn(
                            'grid min-w-5 place-items-center rounded-full px-1.5 text-[0.7rem] font-medium tabular-nums',
                            on ? 'bg-background/20 text-background' : 'bg-signal text-white',
                          )}
                        >
                          {i.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-border pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          Ver o site
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </a>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-signal/10 text-xs font-semibold text-signal uppercase">
            {email.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted-foreground">Conectado como</span>
            <span className="block truncate text-sm">{email}</span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              title="Sair de todas as sessões"
              aria-label="Sair de todas as sessões"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MobileBar({ base, email, groups }: { base: string; email: string; groups: { title: string; items: Item[] }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-5 py-3 backdrop-blur lg:hidden">
      <Brand base={base} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button type="button" aria-label="Abrir menu" className="grid size-10 place-items-center rounded-xl border border-border" />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[18rem] p-0">
          <SheetTitle className="sr-only">Menu do painel</SheetTitle>
          <Sidebar base={base} email={email} groups={groups} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
