'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { saveProject, type FormState } from '../_actions/content';
import { Area, Choice, Field, Status, Toggle } from './fields';

export type ProjectRow = {
  id: string; slug: string; title: string; summary: string; body: string; year: number;
  status: string; stack: string[]; url: string | null; repo: string | null; featured: boolean; published: boolean;
};

export function ProjectForm({ p }: { p?: ProjectRow }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProject, null);
  return (
    <form action={action} className="space-y-5">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Título" name="title" defaultValue={p?.title} required maxLength={120} />
        <Field label="Slug (endereço)" name="slug" defaultValue={p?.slug} required maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" hint="Ex.: meu-projeto → /projetos/meu-projeto" />
      </div>
      <Area label="Resumo" name="summary" defaultValue={p?.summary} rows={2} maxLength={400} />
      <Area label="Texto completo (Markdown)" name="body" defaultValue={p?.body} rows={12} maxLength={50000} className="[&_textarea]:font-mono [&_textarea]:text-sm" />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Ano" name="year" inputMode="numeric" defaultValue={p?.year ?? new Date().getFullYear()} required />
        <Choice
          label="Status"
          name="status"
          defaultValue={p?.status ?? 'em-construcao'}
          items={[
            { value: 'em-construcao', label: 'Construindo' },
            { value: 'em-producao', label: 'No ar' },
            { value: 'arquivado', label: 'Arquivado' },
          ]}
        />
        <Field label="Tecnologias" name="stack" defaultValue={p?.stack.join(', ')} hint="Separadas por vírgula" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Link do projeto" name="url" type="url" defaultValue={p?.url ?? ''} placeholder="https://" />
        <Field label="Link do código" name="repo" type="url" defaultValue={p?.repo ?? ''} placeholder="https://" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Destaque" name="featured" defaultChecked={p?.featured} hint="Aparece primeiro na home" />
        <Toggle label="Publicado" name="published" defaultChecked={p?.published} hint="Desligado = rascunho, só você vê" />
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" size="pill" className="h-11 px-6" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar projeto'}
        </Button>
        <Status state={state} />
      </div>
    </form>
  );
}
