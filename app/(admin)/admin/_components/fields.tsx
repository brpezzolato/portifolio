'use client';

import { useState } from 'react';
import { CheckCircle2, CircleAlert, Eye, PenLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Markdown } from '@/components/site/markdown';
import { cn } from 'cn';

/* Campos padronizados do painel (todos do shadcn). */

export function Field({ label, hint, className, ...props }: React.ComponentProps<typeof Input> & { label: string; hint?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={props.id ?? props.name}>{label}</Label>
      <Input id={props.id ?? props.name} className="h-11 rounded-xl bg-background" autoComplete="off" {...props} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* Área de texto com contador de caracteres quando há limite. */
export function Area({ label, hint, className, maxLength, defaultValue, ...props }: React.ComponentProps<typeof Textarea> & { label: string; hint?: string }) {
  const [n, setN] = useState(String(defaultValue ?? '').length);
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={props.id ?? props.name}>{label}</Label>
        {maxLength && (
          <span className={cn('text-xs tabular-nums', n > maxLength * 0.9 ? 'text-signal' : 'text-muted-foreground')}>
            {n}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        id={props.id ?? props.name}
        maxLength={maxLength}
        defaultValue={defaultValue}
        onInput={(e) => setN((e.target as HTMLTextAreaElement).value.length)}
        className="rounded-xl bg-background"
        {...props}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* Endereço (slug) com prefixo visível. */
export function SlugField({ prefix, value, onChange }: { prefix: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="slug">Endereço</Label>
      <div className="flex h-11 items-center overflow-hidden rounded-xl border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <span className="border-r border-border bg-muted px-3 py-2.5 font-mono text-xs text-muted-foreground">{prefix}</span>
        <input
          id="slug"
          name="slug"
          required
          maxLength={80}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          className="h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none"
        />
      </div>
      <p className="text-xs text-muted-foreground">Só letras minúsculas, números e hífens. Gerado a partir do título.</p>
    </div>
  );
}

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

/* Editor de Markdown com abas Escrever / Visualizar. */
export function MarkdownField({ name, defaultValue, maxLength = 50000 }: { name: string; defaultValue?: string; maxLength?: number }) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  return (
    <div className="overflow-hidden rounded-2xl border border-input bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-2 py-1.5">
        <div className="flex gap-1">
          {(
            [
              ['write', 'Escrever', PenLine],
              ['preview', 'Visualizar', Eye],
            ] as const
          ).map(([k, l, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              aria-pressed={tab === k}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
                tab === k ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-3.5" /> {l}
            </button>
          ))}
        </div>
        <span className="pr-2 text-xs text-muted-foreground tabular-nums">
          {value.length.toLocaleString('pt-BR')} caracteres
        </span>
      </div>
      <textarea
        name={name}
        value={value}
        maxLength={maxLength}
        onChange={(e) => setValue(e.target.value)}
        rows={16}
        aria-label="Texto em Markdown"
        className={cn('block w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed outline-none', tab !== 'write' && 'hidden')}
        placeholder={'## Título de seção\n\nTexto com **negrito**, listas e [links](https://...).'}
      />
      {tab === 'preview' && (
        <div className="min-h-[22rem] p-5">
          {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted-foreground">Nada para visualizar ainda.</p>}
        </div>
      )}
      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        <code className="font-mono">## título</code> · <code className="font-mono">**negrito**</code> ·{' '}
        <code className="font-mono">- lista</code> · <code className="font-mono">[texto](https://…)</code>
      </p>
    </div>
  );
}

export function Choice({
  label,
  name,
  defaultValue,
  items,
  className,
}: {
  label: string;
  name: string;
  defaultValue: string;
  items: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} defaultValue={defaultValue} items={items}>
        <SelectTrigger id={name} className="h-11 w-full rounded-xl bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function Toggle({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label htmlFor={name} className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-foreground/20">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
    </label>
  );
}

export function Status({ state }: { state: { ok?: string; error?: string } | null }) {
  if (!state) return null;
  return (
    <p role="status" className={cn('inline-flex items-center gap-1.5 text-sm', state.error ? 'text-destructive' : 'text-foreground')}>
      {state.error ? <CircleAlert className="size-4 shrink-0" /> : <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
      {state.error ?? state.ok}
    </p>
  );
}
