'use client';

import { useActionState, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { savePost, type FormState } from '../_actions/content';
import { Area, Choice, Field, MarkdownField, SlugField, Status, Toggle, slugify } from './fields';
import { Panel } from './ui';

export type PostRow = {
  id: string; slug: string; title: string; excerpt: string; body: string; kind: string;
  project_slug: string | null; published: boolean; published_at: string;
};

const ddmmyyyy = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

/* Editor de novidade: conteúdo à esquerda, publicação fixa à direita. */
export function PostForm({ p, projects }: { p?: PostRow; projects: { slug: string; title: string }[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, null);
  const [title, setTitle] = useState(p?.title ?? '');
  const [slug, setSlug] = useState(p?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(p));

  return (
    <form action={action} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
      {p && <input type="hidden" name="id" value={p.id} />}

      <div className="min-w-0 space-y-6">
        <Panel title="Apresentação" description="Título e resumo aparecem na lista de novidades da home.">
          <Field
            label="Título"
            name="title"
            required
            maxLength={160}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
          <SlugField
            prefix="/novidades/"
            value={slug}
            onChange={(v) => {
              setSlugTouched(true);
              setSlug(v);
            }}
          />
          <Area label="Resumo" name="excerpt" defaultValue={p?.excerpt} rows={3} maxLength={400} />
        </Panel>

        <Panel title="Texto completo" description="O conteúdo da página da novidade. Use Markdown.">
          <MarkdownField name="body" defaultValue={p?.body} />
        </Panel>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-8">
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold tracking-tight">Publicação</p>
          <div className="space-y-4">
            <Toggle label="Publicado" name="published" defaultChecked={p?.published} hint="Desligado = rascunho, só você vê." />
            <Field
              label="Data"
              name="published_at"
              inputMode="numeric"
              defaultValue={ddmmyyyy(p?.published_at)}
              pattern="\d{2}/\d{2}/\d{4}"
              hint="DD/MM/AAAA. Data futura = aparece só no dia."
              required
            />
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
          </div>
          <Button type="submit" size="pill" className="mt-5 h-11 w-full" disabled={pending}>
            {pending ? 'Salvando…' : p ? 'Salvar alterações' : 'Criar novidade'}
          </Button>
          <div className="mt-3 min-h-5 text-center">
            <Status state={state} />
          </div>
          {p?.published && (
            <a
              href={`/novidades/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Ver no site <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      </aside>
    </form>
  );
}
