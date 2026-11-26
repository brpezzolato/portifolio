import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from 'cn';

/* Peças visuais comuns do painel (servidor ou cliente). */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8 sm:mb-10">
      {back && (
        <Link
          href={back.href}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rounded-full bg-signal" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-[clamp(1.9rem,3.5vw,2.6rem)] leading-none font-semibold tracking-[-0.04em]">{title}</h1>
          {description && <p className="mt-3 max-w-xl text-pretty text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/* Bloco de formulário: título e explicação à esquerda, campos à direita. */
export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-3xl border border-border bg-card', className)}>
      <div className="border-b border-border px-6 py-5 sm:px-8">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-5 p-6 sm:p-8">{children}</div>
    </section>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-medium">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-pretty text-muted-foreground">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        published ? 'bg-signal/10 text-signal' : 'bg-muted text-muted-foreground',
      )}
    >
      <span className={cn('size-1.5 rounded-full', published ? 'bg-signal' : 'bg-muted-foreground/60')} />
      {published ? 'Publicado' : 'Rascunho'}
    </span>
  );
}
