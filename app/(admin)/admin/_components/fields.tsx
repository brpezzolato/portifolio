'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from 'cn';

/* Campos padronizados do painel (todos do shadcn). */
export function Field({ label, hint, className, ...props }: React.ComponentProps<typeof Input> & { label: string; hint?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={props.id ?? props.name}>{label}</Label>
      <Input id={props.id ?? props.name} className="h-11" autoComplete="off" {...props} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Area({ label, hint, className, ...props }: React.ComponentProps<typeof Textarea> & { label: string; hint?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={props.id ?? props.name}>{label}</Label>
      <Textarea id={props.id ?? props.name} {...props} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
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
        <SelectTrigger id={name} className="h-11 w-full">
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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4">
      <div>
        <Label htmlFor={name}>{label}</Label>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
    </div>
  );
}

export function Status({ state }: { state: { ok?: string; error?: string } | null }) {
  if (!state) return null;
  return (
    <p role="status" className={cn('text-sm', state.error ? 'text-destructive' : 'text-signal')}>
      {state.error ?? state.ok}
    </p>
  );
}
