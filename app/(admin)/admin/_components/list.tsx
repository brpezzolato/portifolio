import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from 'cn';

/* Lista padrão do painel: título, metadados, rascunho/publicado, editar e
   apagar (com confirmação nativa do formulário via botão em duas etapas). */
export function AdminList({
  title,
  newHref,
  rows,
  remove,
}: {
  title: string;
  newHref: string;
  rows: { id: string; title: string; meta: string; published?: boolean; href: string }[];
  remove: (form: FormData) => Promise<void>;
}) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <Link href={newHref} className={cn(buttonVariants({ size: 'pill' }), 'h-10 px-5')}>
          <Plus data-icon="inline-start" /> Novo
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">Nada aqui ainda.</p>
      ) : (
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-4 p-4 sm:p-5">
              <Link href={r.href} className="min-w-0 flex-1">
                <span className="block truncate font-medium hover:text-signal">{r.title}</span>
                <span className="block truncate text-sm text-muted-foreground">{r.meta}</span>
              </Link>
              {r.published !== undefined && <Badge variant={r.published ? 'signal' : 'mono'}>{r.published ? 'Publicado' : 'Rascunho'}</Badge>}
              <details className="group relative">
                <summary className="list-none">
                  <span className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'cursor-pointer')} aria-label="Apagar">
                    <Trash2 className="size-4" />
                  </span>
                </summary>
                <form action={remove} className="absolute right-0 z-10 mt-2 w-56 rounded-2xl border border-border bg-popover p-3 shadow-lg">
                  <input type="hidden" name="id" value={r.id} />
                  <p className="text-sm">Apagar de vez? Não dá para desfazer.</p>
                  <Button type="submit" variant="destructive" size="sm" className="mt-3 w-full">
                    Apagar
                  </Button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
