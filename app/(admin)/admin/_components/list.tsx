'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronRight, FileText, FolderKanban, Plus, Search } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from 'cn';
import { ConfirmDelete } from './confirm-delete';
import { EmptyState, StatusPill } from './ui';

export type ListRow = {
  id: string;
  title: string;
  meta: string;
  tag?: string;
  published: boolean;
  href: string;
};

type Filter = 'todos' | 'publicados' | 'rascunhos';

/* Lista do painel: filtro (todos / publicados / rascunhos), busca por título,
   linhas clicáveis com status e apagar com confirmação. */
export function AdminList({
  rows,
  newHref,
  newLabel,
  remove,
  empty,
  icon,
}: {
  rows: ListRow[];
  newHref: string;
  newLabel: string;
  remove: (form: FormData) => Promise<void>;
  empty: { title: string; text: string };
  icon: 'projetos' | 'novidades';
}) {
  const [filter, setFilter] = useState<Filter>('todos');
  const [q, setQ] = useState('');

  const counts = {
    todos: rows.length,
    publicados: rows.filter((r) => r.published).length,
    rascunhos: rows.filter((r) => !r.published).length,
  };
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === 'todos' || (filter === 'publicados' ? r.published : !r.published)) &&
        (!term || r.title.toLowerCase().includes(term) || r.meta.toLowerCase().includes(term)),
    );
  }, [rows, filter, q]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={icon === 'projetos' ? FolderKanban : FileText}
        title={empty.title}
        text={empty.text}
        action={
          <Link href={newHref} className={cn(buttonVariants({ size: 'pill' }), 'h-10')}>
            <Plus data-icon="inline-start" /> {newLabel}
          </Link>
        }
      />
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" className="flex gap-1 rounded-full bg-muted p-1">
          {(['todos', 'publicados', 'rascunhos'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm capitalize transition-colors',
                filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f} <span className="ml-0.5 text-xs text-muted-foreground tabular-nums">{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="h-10 rounded-full pl-9" aria-label="Buscar" />
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="p-10 text-center text-sm text-muted-foreground">Nada encontrado com esse filtro.</p>
      ) : (
        <ul className="divide-y divide-border">
          {shown.map((r) => (
            <li key={r.id} className="group flex items-center gap-3 px-3 py-2 sm:px-4">
              <Link href={r.href} className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl px-2 py-3 transition-colors">
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium transition-colors group-hover:text-signal">{r.title}</span>
                    {r.tag && <span className="hidden shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground sm:inline">{r.tag}</span>}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-xs text-muted-foreground">{r.meta}</span>
                </span>
                <StatusPill published={r.published} />
                <ChevronRight className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
              </Link>
              <ConfirmDelete id={r.id} what={r.title} action={remove} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
