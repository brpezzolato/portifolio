'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveProject } from '../_actions/content';
import { Area, Choice, Field, MarkdownField, SlugField, Status, Toggle, slugify } from './fields';
import { Panel } from './ui';
import { useSave } from './use-save';

export type ProjectRow = {
  id: string; slug: string; title: string; summary: string; body: string; year: number;
  status: string; stack: string[]; url: string | null; repo: string | null; featured: boolean; published: boolean;
};

/* Editor de projeto: conteúdo à esquerda, publicação fixa à direita. */
export function ProjectForm({ p }: { p?: ProjectRow }) {
  const { state, pending, dirty, form } = useSave(saveProject);
  const [title, setTitle] = useState(p?.title ?? '');
  const [slug, setSlug] = useState(p?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(p));

  return (
    <form {...form} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
      {p && <input type="hidden" name="id" value={p.id} />}

      <div className="min-w-0 space-y-6">
        <Panel title="Apresentação" description="Como o projeto aparece no cartão da home e no topo da página dele.">
          <Field
            label="Título"
            name="title"
            required
            maxLength={120}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
          <SlugField
            prefix="/projetos/"
            value={slug}
            onChange={(v) => {
              setSlugTouched(true);
              setSlug(v);
            }}
          />
          <Area label="Resumo" name="summary" defaultValue={p?.summary} rows={3} maxLength={400} hint="Uma ou duas frases: o problema e a solução." />
        </Panel>

        <Panel title="Texto completo" description="A história do projeto, na página /projetos/… Use Markdown.">
          <MarkdownField name="body" defaultValue={p?.body} />
        </Panel>

        <Panel title="Detalhes">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Ano" name="year" inputMode="numeric" defaultValue={p?.year ?? new Date().getFullYear()} required />
            <Choice
              label="Situação"
              name="status"
              defaultValue={p?.status ?? 'em-construcao'}
              items={[
                { value: 'em-construcao', label: 'Construindo' },
                { value: 'em-producao', label: 'No ar' },
                { value: 'arquivado', label: 'Arquivado' },
              ]}
            />
          </div>
          <Field label="Tecnologias" name="stack" defaultValue={p?.stack.join(', ')} hint="Separadas por vírgula. Ex.: Next.js, Python, SQL" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Link do projeto" name="url" type="url" defaultValue={p?.url ?? ''} placeholder="https://" />
            <Field label="Link do código" name="repo" type="url" defaultValue={p?.repo ?? ''} placeholder="https://" />
          </div>
        </Panel>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-8">
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold tracking-tight">Publicação</p>
          <div className="space-y-3">
            <Toggle label="Publicado" name="published" defaultChecked={p?.published} hint="Desligado = rascunho, só você vê." />
            <Toggle label="Destaque" name="featured" defaultChecked={p?.featured} hint="Aparece primeiro na home." />
          </div>
          <Button type="submit" size="pill" className="mt-5 h-11 w-full" disabled={pending}>
            {pending ? 'Salvando…' : p ? 'Salvar alterações' : 'Criar projeto'}
          </Button>
          <div className="mt-3 min-h-5 text-center">
            {state?.error || !dirty ? (
              <Status state={state} />
            ) : (
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="size-1.5 rounded-full bg-amber-500" /> Alterações não salvas
              </p>
            )}
          </div>
          {p?.published && (
            <a
              href={`/projetos/${p.slug}`}
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
