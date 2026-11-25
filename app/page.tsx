import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AiOrb } from '@/components/site/ai-orb';
import { LatentSpace } from '@/components/site/latent-space';
import { LossCurve } from '@/components/site/loss-curve';
import { NeuralNet } from '@/components/site/neural-net';
import { Reveal } from '@/components/site/reveal';
import { ScrambleText } from '@/components/site/scramble-text';
import { ScrollWords } from '@/components/site/scroll-words';
import { getPosts, getProjects } from '@/lib/content';
import { formatShortDate, postKindLabel, projectStatusLabel } from '@/lib/format';
import { site } from '@/lib/site';

const wrap = 'mx-auto w-full max-w-[1400px] px-5 sm:px-8';

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-10 flex items-center gap-3 font-mono text-xs text-muted-foreground">
      <span className="text-signal">{n}</span>
      <span className="h-px w-8 bg-border" />
      {children}
    </p>
  );
}

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts(5)]);

  return (
    <>
      {/* Herói: a orbe ao centro, título gigante por cima, rodapé em três colunas */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-8">
        <AiOrb className="absolute top-1/2 left-1/2 aspect-square w-[min(92vw,78svh)] -translate-x-1/2 -translate-y-[56%]" />
        <div className={`${wrap} relative`}>
          <h1 className="text-[clamp(3.2rem,12.5vw,13rem)] leading-[0.86] font-semibold tracking-[-0.06em]">
            <ScrambleText text={site.headline[0]} delay={1500} className="block" />
            <ScrambleText text={site.headline[1]} delay={1700} className="block text-right text-foreground/90" />
          </h1>
          <div className="mt-10 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
            <p className="text-muted-foreground">{site.study}</p>
            <p className="text-muted-foreground sm:text-center">{site.work}</p>
            <a href="#manifesto" className="inline-flex items-center gap-1.5 sm:justify-self-end">
              Role para explorar <ArrowDownRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Tokens: o vocabulário do trabalho, como um tokenizador veria */}
      <div aria-label="Ferramentas e temas" className="overflow-hidden border-y border-border py-4">
        <div className="marquee">
          {[0, 1].map((dup) => (
            <ul key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center gap-3 pr-3">
              {site.tokens.map((t, i) => (
                <li key={t} className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm whitespace-nowrap">
                  <span className="font-mono text-[0.65rem] text-signal">{(1042 + i * 317).toString()}</span>
                  {t}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Manifesto */}
      <section id="manifesto" className={`${wrap} py-28 sm:py-40`}>
        <Label n="01">Sobre</Label>
        <ScrollWords
          text={site.manifesto}
          className="max-w-5xl text-[clamp(1.7rem,4vw,3.6rem)] leading-[1.12] font-medium tracking-[-0.03em]"
        />
      </section>

      {/* Trajetória como treino */}
      <section className={`${wrap} pb-28 sm:pb-40`}>
        <Label n="02">Trajetória</Label>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Cada etapa, uma época de treino.
          </h2>
          <LossCurve epochs={[...site.epochs]} />
        </div>
      </section>

      {/* Projetos: espaço latente + lista */}
      <section className={`${wrap} pb-28 sm:pb-40`}>
        <Label n="03">Projetos</Label>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">Espaço latente</h2>
          <p className="max-w-sm text-muted-foreground">
            Cada nuvem é um projeto. Passe o mouse num rótulo para acender o cluster.
          </p>
        </div>
        <Reveal>
          <LatentSpace
            items={projects.map((p) => ({ slug: p.slug, title: p.title, status: projectStatusLabel[p.status] }))}
          />
        </Reveal>
        <ul className="mt-12 border-t border-border">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/projetos/${p.slug}`}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-border py-6 transition-colors hover:bg-foreground/[0.025] sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_auto] sm:py-8"
              >
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-3xl font-medium tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-2 sm:text-5xl">
                  {p.title}
                </span>
                <span className="hidden text-sm text-muted-foreground sm:block">{p.summary}</span>
                <span className="flex items-center gap-3">
                  <Badge variant={p.status === 'arquivado' ? 'mono' : 'signal'}>{projectStatusLabel[p.status]}</Badge>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Como eu trabalho */}
      <section className={`${wrap} pb-28 sm:pb-40`}>
        <Label n="04">Como eu trabalho</Label>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Do dado bruto à decisão, camada por camada.
          </h2>
          <p className="max-w-sm text-muted-foreground">Passe o mouse num neurônio para ver as ligações.</p>
        </div>
        <Reveal>
          <NeuralNet labels={[...site.layers]} />
        </Reveal>
      </section>

      {/* Novidades: log de treino */}
      <section className={`${wrap} pb-28 sm:pb-40`}>
        <Label n="05">Novidades</Label>
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">Log</h2>
          <Link href="/novidades" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            Ver tudo <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <ol className="rounded-3xl border border-border bg-card/40 p-2 font-mono text-sm">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/novidades/${p.slug}`}
                className="grid grid-cols-1 gap-1 rounded-2xl px-4 py-4 transition-colors hover:bg-foreground/[0.04] sm:grid-cols-[7rem_8rem_minmax(0,1fr)] sm:gap-4"
              >
                <time dateTime={p.publishedAt} className="text-muted-foreground">[{formatShortDate(p.publishedAt)}]</time>
                <span className="text-signal">{postKindLabel[p.kind].toLowerCase()}</span>
                <span className="font-sans">
                  <span className="text-foreground">{p.title}</span>
                  <span className="block text-muted-foreground">{p.excerpt}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
