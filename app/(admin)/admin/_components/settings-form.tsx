'use client';

import { useActionState } from 'react';
import { Briefcase, Link2, Sparkles, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { SiteData } from '@/lib/settings';
import { saveSettings, type FormState } from '../_actions/content';
import { Field, Status } from './fields';
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
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, null);
  const link = (label: string) => s.links.find((l) => l.label === label)?.href ?? '';
  const orgT = (o: string | T): T => (typeof o === 'string' ? { pt: o, en: o } : o);

  return (
    <form action={action}>
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
          <Panel title="Etapas" description="Trabalho e formação, na ordem em que aparecem. Deixe o título vazio para remover.">
            {pad(s.journey, 5, { title: empty, org: empty, kind: empty, text: empty }).map((j, i) => (
              <Item key={i} n={i + 1}>
                <Bi label="Cargo ou curso" name={`journey.${i}.title`} value={j.title} />
                <Bi label="Instituição" name={`journey.${i}.org`} value={orgT(j.org)} />
                <Bi label="Tipo" name={`journey.${i}.kind`} value={j.kind} hint="Ex.: Trabalho, Formação, Projeto." />
                <Bi label="Descrição" name={`journey.${i}.text`} value={j.text} long />
              </Item>
            ))}
          </Panel>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 z-10 mt-8 flex items-center gap-4 rounded-full border border-border bg-background/90 p-2 pl-6 shadow-[0_10px_40px_-15px_rgb(0_0_0/0.3)] backdrop-blur">
        <div className="min-w-0 flex-1">
          {state ? <Status state={state} /> : <p className="text-sm text-muted-foreground">As alterações vão ao ar assim que você salvar.</p>}
        </div>
        <Button type="submit" size="pill" className="h-11 shrink-0 px-6" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar conteúdo'}
        </Button>
      </div>
    </form>
  );
}
