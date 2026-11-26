'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Briefcase, Link2, Plus, Sparkles, Trash2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { SiteData } from '@/lib/settings';
import { saveSettings } from '../_actions/content';
import { Field } from './fields';
import { SaveBar } from './save-bar';
import { useSave } from './use-save';
import { Panel } from './ui';

type T = { pt: string; en: string };

/* Campo bilíngue: PT e EN lado a lado, com etiqueta do idioma dentro do campo. */
function Bi({ label, name, value, long, hint }: { label: string; name: string; value: T; long?: boolean; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['pt', 'en'] as const).map((l) => (
          <div key={l} className="relative">
            <span className="pointer-events-none absolute top-2.5 right-3 z-10 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground uppercase">
              {l}
            </span>
            {long ? (
              <Textarea
                aria-label={`${label} (${l.toUpperCase()})`}
                name={`${name}.${l}`}
                defaultValue={value[l]}
                rows={5}
                maxLength={1200}
                className="rounded-xl bg-background pr-12"
              />
            ) : (
              <Input
                aria-label={`${label} (${l.toUpperCase()})`}
                name={`${name}.${l}`}
                defaultValue={value[l]}
                maxLength={1200}
                autoComplete="off"
                className="h-11 rounded-xl bg-background pr-12"
              />
            )}
          </div>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* Item numerado (cartão, etapa, etiqueta). */
function Item({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-border bg-background p-5 pl-14">
      <span className="absolute top-5 left-5 grid size-6 place-items-center rounded-full bg-muted font-mono text-xs text-muted-foreground">{n}</span>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

const empty: T = { pt: '', en: '' };
const pad = <X,>(arr: readonly X[], n: number, fill: X) => [...arr, ...Array(Math.max(0, n - arr.length)).fill(fill)].slice(0, n) as X[];

const tabs = [
  { v: 'contato', l: 'Contato e links', icon: Link2 },
  { v: 'heroi', l: 'Topo da página', icon: Sparkles },
  { v: 'sobre', l: 'Sobre mim', icon: UserRound },
  { v: 'jornada', l: 'Jornada', icon: Briefcase },
] as const;

export function SettingsForm({ s }: { s: SiteData }) {
  const save = useSave(saveSettings);
  const link = (label: string) => s.links.find((l) => l.label === label)?.href ?? '';
  const orgT = (o: string | T): T => (typeof o === 'string' ? { pt: o, en: o } : o);

  return (
    <form {...save.form}>
      <Tabs defaultValue="contato" className="gap-6">
        <TabsList variant="line" className="h-auto! w-full justify-start gap-1 overflow-x-auto border-b border-border pb-0">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              className="h-10 flex-none gap-2 px-3 after:bottom-[-1px]! after:bg-signal"
            >
              <t.icon className="size-4" /> {t.l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="contato" keepMounted className="space-y-6">
          <Panel title="Onde te encontram" description="Aparece na seção de contato e no rodapé.">
            <Field label="E-mail" name="email" type="email" defaultValue={s.email} placeholder="voce@exemplo.com" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="GitHub" name="github" type="url" defaultValue={link('GitHub')} placeholder="https://github.com/…" />
              <Field label="LinkedIn" name="linkedin" type="url" defaultValue={link('LinkedIn')} placeholder="https://linkedin.com/in/…" />
            </div>
            <p className="text-xs text-muted-foreground">O currículo agora é enviado na aba Currículo do menu.</p>
          </Panel>
        </TabsContent>

        <TabsContent value="heroi" keepMounted className="space-y-6">
          <Panel title="Frases" description="O topo da página: a frase digitada, a frase depois que o nome se junta e os cantos.">
            <Bi label="Frase digitada" name="tagline" value={s.tagline} />
            <Bi label="Frase de efeito" name="hook" value={s.hook} hint="Aparece palavra por palavra quando o nome se junta." />
            <Bi label="Status (com o ponto vermelho)" name="status" value={s.status} />
            <Bi label="Linha do canto direito" name="short" value={s.short} />
          </Panel>
          <Panel title="Etiquetas" description="As pílulas que aparecem embaixo da frase de efeito. Deixe vazio para não mostrar.">
            {pad(s.chips, 4, empty).map((c, i) => (
              <Item key={i} n={i + 1}>
                <Bi label="Texto" name={`chips.${i}`} value={c} />
              </Item>
            ))}
          </Panel>
        </TabsContent>

        <TabsContent value="sobre" keepMounted className="space-y-6">
          <Panel title="Textos" description="O texto que se preenche palavra por palavra na rolagem.">
            <Bi label="Sobre mim" name="bio" value={s.bio} long />
            <Bi label="Apresentação curta" name="intro" value={s.intro} long hint="Usada nos resultados de busca e ao compartilhar o link." />
            <Field label="Tecnologias" name="stack" defaultValue={s.stack.join(', ')} hint="Separadas por vírgula. Aparecem na faixa gigante em movimento." />
          </Panel>
          <Panel title="Cartões" description="Os cartões ao lado do texto. Deixe o título vazio para remover.">
            {pad(s.skills, 6, { title: empty, detail: empty }).map((k, i) => (
              <Item key={i} n={i + 1}>
                <Bi label="Título" name={`skills.${i}.title`} value={k.title} />
                <Bi label="Detalhe" name={`skills.${i}.detail`} value={k.detail} />
              </Item>
            ))}
          </Panel>
        </TabsContent>

        <TabsContent value="jornada" keepMounted className="space-y-6">
          <JourneyEditor initial={s.journey.map((j) => ({ ...j, org: orgT(j.org) }))} onChange={save.touch} />
        </TabsContent>
      </Tabs>

      <SaveBar {...save} label="Salvar conteúdo" />
    </form>
  );
}

type Step = { title: T; org: T; kind: T; text: T };

/* Etapas da jornada: só as preenchidas, botão para adicionar quantas quiser,
   e cada uma pode subir, descer ou ser removida. A chave fixa de cada etapa
   mantém o que foi digitado quando a ordem muda. */
function JourneyEditor({ initial, onChange }: { initial: Step[]; onChange: () => void }) {
  const seq = useRef(0);
  const make = (st: Step) => ({ key: `e${seq.current++}`, ...st });
  const [steps, setSteps] = useState(() => initial.map(make));
  const listRef = useRef<HTMLDivElement>(null);

  const move = (i: number, d: -1 | 1) => {
    setSteps((arr) => {
      const next = [...arr];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });
    onChange();
  };
  const remove = (i: number) => {
    setSteps((arr) => arr.filter((_, k) => k !== i));
    onChange();
  };
  const add = () => {
    setSteps((arr) => [...arr, make({ title: empty, org: empty, kind: empty, text: empty })]);
    onChange();
    // leva até a nova etapa e foca o primeiro campo
    requestAnimationFrame(() => {
      const items = listRef.current?.querySelectorAll('[data-step]');
      const last = items?.[items.length - 1] as HTMLElement | undefined;
      last?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      last?.querySelector('input')?.focus({ preventScroll: true });
    });
  };

  return (
    <Panel title="Etapas" description="Trabalho e formação, na ordem em que aparecem no site. Adicione quantas quiser; para tirar uma, use "Excluir etapa" e depois salve.">
      <div ref={listRef} className="space-y-4">
        {steps.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhuma etapa ainda.</p>
        )}
        {steps.map((j, i) => (
          <div key={j.key} data-step className="relative rounded-2xl border border-border bg-background p-5 pl-14">
            <span className="absolute top-5 left-5 grid size-6 place-items-center rounded-full bg-muted font-mono text-xs text-muted-foreground">{i + 1}</span>
            <div className="absolute top-3.5 right-3.5 flex items-center gap-0.5">
              <button type="button" aria-label="Subir etapa" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent">
                <ArrowUp className="size-4" />
              </button>
              <button type="button" aria-label="Descer etapa" disabled={i === steps.length - 1} onClick={() => move(i, 1)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent">
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-full bg-destructive/10 px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
              >
                <Trash2 className="size-3.5" /> Excluir etapa
              </button>
            </div>
            <div className="space-y-4 pt-8 sm:pt-6">
              <Bi label="Cargo ou curso" name={`journey.${i}.title`} value={j.title} />
              <Bi label="Instituição" name={`journey.${i}.org`} value={j.org} />
              <Bi label="Tipo e período" name={`journey.${i}.kind`} value={j.kind} hint="Ex.: Trabalho · 2025–atual, Formação · 2024–2025." />
              <Bi label="Descrição" name={`journey.${i}.text`} value={j.text} long />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-signal/50 hover:bg-signal/5 hover:text-foreground"
      >
        <Plus className="size-4" /> Adicionar etapa
      </button>
    </Panel>
  );
}
