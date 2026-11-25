import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AiOrb } from '@/components/site/ai-orb';
import { Reveal } from '@/components/site/reveal';
import { ScrollWords } from '@/components/site/scroll-words';
import { TypeLines } from '@/components/site/type-lines';
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
  const [projects, posts] = await Promise.all([getProjects(), getPosts(4)]);

  return (
    <>
      {/* Herói: a orbe passeando atrás do título, que é digitado */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-8">
        <div className={`${wrap} relative flex flex-1 flex-col`}>
          <div className="relative my-auto py-10">
            <AiOrb className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(88vw,70svh)] -translate-x-1/2 -translate-y-1/2" />
            <p className="relative mb-4 text-lg text-muted-foreground sm:text-xl">
              <TypeLines lines={[site.hello]} speed={45} keepCaret={false} />
            </p>
            <h1 className="relative text-[clamp(3.2rem,12.5vw,13rem)] leading-[0.88] font-semibold tracking-[-0.06em]">
              <TypeLines
                lines={[...site.headline]}
                lineClassNames={['', 'text-foreground/90 sm:pl-[15%]']}
                speed={55}
                delay={site.hello.length * 50 + 350}
              />
            </h1>
          </div>
          <div className="relative mt-10 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
            <p className="text-muted-foreground">{site.study}</p>
            <p className="text-muted-foreground sm:text-center">{site.work}</p>
            <a href="#sobre" className="inline-flex items-center gap-1.5 sm:justify-self-end">
              Role para me conhecer <ArrowDownRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Faixa com o que me define */}
      <div aria-label="Temas" className="overflow-hidden border-y border-border py-5">
        <div className="marquee">
          {[0, 1, 2].map((dup) => (
            <ul key={dup} aria-hidden={dup > 0} className="flex shrink-0 items-center">
              {site.tags.map((t) => (
                <li key={t} className="flex items-center text-2xl font-medium tracking-tight whitespace-nowrap sm:text-3xl">
                  <span className="px-6">{t}</span>
                  <span className="text-signal">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Sobre: manifesto que se preenche na rolagem */}
      <section id="sobre" className={`${wrap} py-28 sm:py-40`}>
        <Label n="01">Sobre mim</Label>
        <ScrollWords
          text={site.manifesto}
          className="max-w-5xl text-[clamp(1.7rem,4vw,3.6rem)] leading-[1.12] font-medium tracking-[-0.03em]"
        />
      </section>

      {/* Agora */}
      <section className={`${wrap} pb-28 sm:pb-40`}>
        <Label n="02">Agora</Label>
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {site.doing.map((d, i) => (
            <li key={d.verb} className="bg-background">
              <Reveal delay={i * 0.08} className="flex h-full flex-col justify-between gap-16 p-6 sm:p-8">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="signal-dot size-1.5!" />
                  {d.verb}
                </span>
                <div>
                  <p className="text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">{d.what}</p>
                  <p className="mt-2 text-muted-foreground">{d.note}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Projetos */}
      <section className={`${wrap} pb-28 sm:pb-40`}>
        <Label n="03">Projetos</Label>
        <div className="mb-6 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">O que eu construo</h2>
          <Link href="/projetos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            Todos <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <ul className="border-t border-border">
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

      {/* Novidades */}
      <section className={`${wrap} pb-28 sm:pb-40`}>
        <Label n="04">Novidades</Label>
        <div className="mb-6 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">O que tem de novo</h2>
          <Link href="/novidades" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            Ver tudo <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {posts.map((p, i) => (
            <li key={p.slug} className={i === 0 ? 'md:col-span-2' : ''}>
              <Link
                href={`/novidades/${p.slug}`}
                className="group flex h-full flex-col justify-between gap-10 rounded-3xl border border-border bg-card/40 p-6 transition-colors hover:border-foreground/20 hover:bg-card sm:p-8"
              >
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{postKindLabel[p.kind]}</span>
                  <time dateTime={p.publishedAt} className="font-mono text-xs">{formatShortDate(p.publishedAt)}</time>
                </div>
                <div>
                  <p className={`font-medium tracking-[-0.03em] ${i === 0 ? 'text-3xl sm:text-5xl' : 'text-2xl'}`}>{p.title}</p>
                  <p className="mt-2 max-w-2xl text-muted-foreground">{p.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
