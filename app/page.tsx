import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PostTimeline } from '@/components/site/post-timeline';
import { ProjectCard } from '@/components/site/project-card';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { getPosts, getProjects } from '@/lib/content';
import { site } from '@/lib/site';
import { cn } from 'cn';

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts(4)]);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="pt-10 pb-20 sm:pt-16 sm:pb-28">
        <Reveal>
          <div className="mb-8 flex items-center gap-3">
            <Avatar className="size-11 ring-1 ring-foreground/10">
              <AvatarFallback className="bg-muted font-mono text-sm">BP</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="font-medium">{site.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {site.role} · {site.location}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="text-sheen max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
            {site.headline}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            {site.intro}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/projetos" className={cn(buttonVariants({ variant: 'glass', size: 'pill' }))}>
              Ver projetos
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`mailto:${site.email}`}
                    className={cn(buttonVariants({ variant: 'glass-quiet', size: 'pill' }))}
                  />
                }
              >
                <Mail data-icon="inline-start" />
                Falar comigo
              </TooltipTrigger>
              <TooltipContent>{site.email}</TooltipContent>
            </Tooltip>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-card/50 py-1.5 pr-4 pl-1.5 text-sm">
            <Badge variant="signal" className="shrink-0">
              <span className="signal-dot size-1.5!" />
              Agora
            </Badge>
            <span className="truncate text-muted-foreground">{site.now}</span>
          </div>
        </Reveal>
      </section>

      {/* Projetos em destaque — bento: o primeiro ocupa duas colunas */}
      <section className="pb-24">
        <Reveal>
          <SectionHeading index="01" title="Projetos em destaque" href="/projetos" linkLabel="Todos os projetos" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className={cn(i === 0 && 'sm:col-span-2')}>
              <ProjectCard project={p} large={i === 0} />
            </Reveal>
          ))}
          {/* Fecha a linha do bento quando sobra uma coluna vazia. */}
          {featured.length % 2 === 0 && (
            <Reveal delay={featured.length * 0.06}>
              <div className="flex h-full min-h-56 flex-col items-start justify-between rounded-2xl border border-dashed border-foreground/12 p-4">
                <Badge variant="mono">Em breve</Badge>
                <div>
                  <p className="text-xl font-medium tracking-tight text-muted-foreground">Próximo projeto</p>
                  <p className="mt-1 text-sm text-muted-foreground/70">Ainda no rascunho. Acompanhe pelas novidades.</p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Novidades */}
      <section className="pb-24">
        <Reveal>
          <SectionHeading index="02" title="Novidades" href="/novidades" linkLabel="Ver tudo" />
        </Reveal>
        <Reveal delay={0.05}>
          <PostTimeline posts={posts} />
        </Reveal>
      </section>

      {/* Contato */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 px-6 py-12 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-2/3 rounded-full bg-foreground/10 blur-3xl" />
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">03 · Contato</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tem uma ideia? Vamos construir.
          </h2>
          <a
            href={`mailto:${site.email}`}
            className={cn(buttonVariants({ variant: 'glass', size: 'pill' }), 'mt-8')}
          >
            {site.email}
          </a>
        </section>
      </Reveal>
    </>
  );
}
