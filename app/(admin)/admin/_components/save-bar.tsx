'use client';

import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from 'cn';

/* Barra fixa de salvar: mostra sempre em que pé está — salvando, alterações
   não salvas, salvo (com a hora) ou erro. */
export function SaveBar({
  state,
  pending,
  dirty,
  savedAt,
  label,
}: {
  state: { ok?: string; error?: string } | null;
  pending: boolean;
  dirty: boolean;
  savedAt: Date | null;
  label: string;
}) {
  const time = savedAt?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  let msg: React.ReactNode;
  if (pending) {
    msg = (
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Salvando…
      </span>
    );
  } else if (state?.error) {
    msg = (
      <span className="inline-flex items-center gap-2 text-destructive">
        <CircleAlert className="size-4 shrink-0" /> {state.error}
      </span>
    );
  } else if (dirty) {
    msg = (
      <span className="inline-flex items-center gap-2 text-foreground">
        <span className="size-2 rounded-full bg-amber-500" /> Alterações não salvas
      </span>
    );
  } else if (savedAt) {
    msg = (
      <span className="inline-flex items-center gap-2 text-foreground">
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Salvo às {time} · já está no ar
        {state?.ok?.split(' · ').slice(1).map((x) => ` · ${x}`).join('')}
      </span>
    );
  } else {
    msg = <span className="text-muted-foreground">As alterações vão ao ar assim que você salvar.</span>;
  }

  const justSaved = !pending && !dirty && !state?.error && savedAt;
  return (
    <div
      className={cn(
        'sticky bottom-4 z-10 mt-8 flex items-center gap-4 rounded-full border bg-background/90 p-2 pl-6 shadow-[0_10px_40px_-15px_rgb(0_0_0/0.3)] backdrop-blur transition-colors duration-500',
        justSaved ? 'border-emerald-500/40' : dirty ? 'border-amber-500/40' : 'border-border',
      )}
    >
      <p role="status" aria-live="polite" className="min-w-0 flex-1 truncate text-sm">
        {msg}
      </p>
      <Button type="submit" size="pill" className="h-11 shrink-0 px-6" disabled={pending}>
        {pending ? 'Salvando…' : label}
      </Button>
    </div>
  );
}
