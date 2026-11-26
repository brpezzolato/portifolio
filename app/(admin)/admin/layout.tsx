import Link from 'next/link';
import { FileText, FolderKanban, Inbox, LayoutDashboard, LogOut, PenSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminBase, getAuthState } from '@/lib/admin';
import { signOut } from './_actions/auth';

const items = [
  { href: '', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/conteudo', label: 'Conteúdo do site', icon: PenSquare },
  { href: '/projetos', label: 'Projetos', icon: FolderKanban },
  { href: '/novidades', label: 'Novidades', icon: FileText },
  { href: '/mensagens', label: 'Mensagens', icon: Inbox },
  { href: '/seguranca', label: 'Segurança', icon: ShieldCheck },
];

/* Moldura do painel. Só aparece para admin com dois fatores; antes disso,
   a página mostra apenas o fluxo de entrada. */
export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const state = await getAuthState();
  const base = adminBase()!;
  if (state.step !== 'admin') return <>{children}</>;
  return (
    <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-6 text-sm font-semibold tracking-tight">
          Painel<span className="text-signal">.</span>
        </p>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {items.map((i) => (
            <Link
              key={i.href}
              href={`${base}${i.href}`}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <i.icon className="size-4" />
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden border-t border-border pt-6 lg:block">
          <p className="truncate text-xs text-muted-foreground">{state.email}</p>
          <form action={signOut} className="mt-3">
            <Button variant="outline" size="sm" type="submit" className="w-full">
              <LogOut data-icon="inline-start" /> Sair de todas as sessões
            </Button>
          </form>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
