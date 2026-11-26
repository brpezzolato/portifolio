'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { savePost, type FormState } from '../_actions/content';
import { Area, Choice, Field, Status, Toggle } from './fields';

export type PostRow = {
  id: string; slug: string; title: string; excerpt: string; body: string; kind: string;
  project_slug: string | null; published: boolean; published_at: string;
};

const ddmmyyyy = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

export function PostForm({ p, projects }: { p?: PostRow; projects: { slug: string; title: string }[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, null);
  return (
    <form action={action} className="space-y-5">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Título" name="title" defaultValue={p?.title} required maxLength={160} />
        <Field label="Slug (endereço)" name="slug" defaultValue={p?.slug} required maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" hint="Ex.: lancei-o-vetra → /novidades/lancei-o-vetra" />
      </div>
      <Area label="Resumo" name="excerpt" defaultValue={p?.excerpt} rows={2} maxLength={400} />
      <Area label="Texto completo (Markdown)" name="body" defaultValue={p?.body} rows={12} maxLength={50000} className="[&_textarea]:font-mono [&_textarea]:text-sm" />
      <div className="grid gap-5 sm:grid-cols-3">
        <Choice
          label="Tipo"
          name="kind"
          defaultValue={p?.kind ?? 'atualizacao'}
          items={[
            { value: 'lancamento', label: 'Lançamento' },
            { value: 'atualizacao', label: 'Atualização' },
            { value: 'nota', label: 'Nota' },
          ]}
        />
        <Choice
          label="Projeto relacionado"
          name="project_slug"
          defaultValue={p?.project_slug ?? 'nenhum'}
          items={[{ value: 'nenhum', label: 'Nenhum' }, ...projects.map((x) => ({ value: x.slug, label: x.title }))]}
        />
        <Field label="Data" name="published_at" inputMode="numeric" defaultValue={ddmmyyyy(p?.published_at)} pattern="\d{2}/\d{2}/\d{4}" hint="DD/MM/AAAA" required />
      </div>
      <Toggle label="Publicado" name="published" defaultChecked={p?.published} hint="Desligado = rascunho, só você vê" />
      <div className="flex items-center gap-4">
        <Button type="submit" size="pill" className="h-11 px-6" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar novidade'}
        </Button>
        <Status state={state} />
      </div>
    </form>
  );
}
