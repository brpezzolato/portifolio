'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import type { SiteData } from '@/lib/settings';
import { saveSettings, type FormState } from '../_actions/content';
import { Area, Field, Status } from './fields';

type T = { pt: string; en: string };

function Bi({ label, name, value, long }: { label: string; name: string; value: T; long?: boolean }) {
  const C = long ? Area : Field;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <C label={`${label} · PT`} name={`${name}.pt`} id={`${name}.pt`} defaultValue={value.pt} {...(long ? { rows: 4 } : {})} />
      <C label={`${label} · EN`} name={`${name}.en`} id={`${name}.en`} defaultValue={value.en} {...(long ? { rows: 4 } : {})} />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

const empty: T = { pt: '', en: '' };
const pad = <X,>(arr: readonly X[], n: number, fill: X) => [...arr, ...Array(Math.max(0, n - arr.length)).fill(fill)].slice(0, n) as X[];

export function SettingsForm({ s }: { s: SiteData }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, null);
  const link = (label: string) => s.links.find((l) => l.label === label)?.href ?? '';
  const orgT = (o: string | T): T => (typeof o === 'string' ? { pt: o, en: o } : o);
  return (
    <form action={action} className="space-y-6">
      <Block title="Contato e links">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" defaultValue={s.email} />
          <Field label="Currículo (link do PDF)" name="cv" type="url" defaultValue={s.cv ?? ''} placeholder="https://" />
          <Field label="GitHub" name="github" type="url" defaultValue={link('GitHub')} placeholder="https://" />
          <Field label="LinkedIn" name="linkedin" type="url" defaultValue={link('LinkedIn')} placeholder="https://" />
        </div>
      </Block>

      <Block title="Herói">
        <Bi label="Frase digitada" name="tagline" value={s.tagline} />
        <Bi label="Frase de efeito (depois do nome)" name="hook" value={s.hook} />
        <Bi label="Status (ponto vermelho)" name="status" value={s.status} />
        <Bi label="Linha do canto" name="short" value={s.short} />
        <p className="text-sm text-muted-foreground">Etiquetas depois do nome</p>
        {pad(s.chips, 4, empty).map((c, i) => (
          <Bi key={i} label={`Etiqueta ${i + 1}`} name={`chips.${i}`} value={c} />
        ))}
      </Block>

      <Block title="Sobre mim">
        <Bi label="Texto que se preenche na rolagem" name="bio" value={s.bio} long />
        <Bi label="Apresentação curta (busca e redes)" name="intro" value={s.intro} long />
        <Field label="Tecnologias (faixa gigante)" name="stack" defaultValue={s.stack.join(', ')} hint="Separadas por vírgula" />
        <p className="text-sm text-muted-foreground">Cartões (deixe o título vazio para remover)</p>
        {pad(s.skills, 6, { title: empty, detail: empty }).map((k, i) => (
          <div key={i} className="space-y-4 rounded-2xl border border-border p-4">
            <Bi label={`Cartão ${i + 1} · título`} name={`skills.${i}.title`} value={k.title} />
            <Bi label={`Cartão ${i + 1} · detalhe`} name={`skills.${i}.detail`} value={k.detail} />
          </div>
        ))}
      </Block>

      <Block title="Minha jornada">
        <p className="text-sm text-muted-foreground">Etapas (deixe o título vazio para remover)</p>
        {pad(s.journey, 5, { title: empty, org: empty, kind: empty, text: empty }).map((j, i) => (
          <div key={i} className="space-y-4 rounded-2xl border border-border p-4">
            <Bi label={`Etapa ${i + 1} · título`} name={`journey.${i}.title`} value={j.title} />
            <Bi label="Instituição" name={`journey.${i}.org`} value={orgT(j.org)} />
            <Bi label="Tipo (ex.: Trabalho, Formação)" name={`journey.${i}.kind`} value={j.kind} />
            <Bi label="Descrição" name={`journey.${i}.text`} value={j.text} long />
          </div>
        ))}
      </Block>

      <div className="sticky bottom-4 z-10 flex items-center gap-4 rounded-full border border-border bg-background/90 p-2 pl-6 backdrop-blur">
        <Status state={state} />
        <Button type="submit" size="pill" className="ml-auto h-11 px-6" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar conteúdo'}
        </Button>
      </div>
    </form>
  );
}
