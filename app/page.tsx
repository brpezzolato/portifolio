import Link from 'next/link';
import { ArrowRight, Database, GraduationCap, Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PostTimeline } from '@/components/site/post-timeline';
import { ProjectCard } from '@/components/site/project-card';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { JarvisOrb } from '@/components/site/jarvis-orb';
import { Spotlight } from '@/components/site/spotlight';
import { TypedWord } from '@/components/site/typed-word';
import { getPosts, getProjects } from '@/lib/content';
import { site } from '@/lib/site';
import { cn } from 'cn';

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts(4)]);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* Hero: texto à esquerda, a orbe-assistente "falando" à direita */}
      <section className="grid grid-cols-1 items-center gap-6 pt-2 pb-20 sm:pb-28 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10 lg:pt-10">
        <div className="order-2 min-w-0 lg:order-1">
          <Reveal>
            <div className="mb-8 flex items-center gap-3">
              <Avatar className="size-11 ring-1 ring-foreground/10">
                <AvatarFallback className="bg-muted font-mono text-sm">BP</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="font-medium">{site.name}</p>
                <p className="text-sm text-muted-foreground">
                  {site.role} · {site.location}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-sheen text-4xl leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl">
              <span className="lg:whitespace-nowrap">{site.headline}</span>{' '}
              <span className="block">
                <TypedWord words={[...site.typed]} />
              </span>
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
            <div className="mt-10 inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-card/50 py-1.5 pr-4 pl-1.5 text-sm">
              <Badge variant="signal" className="shrink-0">
                <span className="signal-dot size-1.5!" />
                Agora
              </Badge>
              <span className="truncate text-muted-foreground">{site.now}</span>
            </div>
          </Reveal>
        </div>

        <Reveal className="order-1 min-w-0 lg:order-2" delay={0.1}>
          <JarvisOrb lines={[...site.assistant]} />
        </Reveal>
      </section>

      {/* Sobre: formação e trabalho */}
      <section className="pb-24">
        <Reveal>
          <SectionHeading index="01" title="Sobre" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: GraduationCap, ...site.study },
            { icon: Database, ...site.work },
          ].map(({ icon: Icon, label, title, detail }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <Spotlight className="h-full rounded-2xl">
                <Card className="h-full">
                  <CardContent className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal ring-1 ring-signal/20">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="mt-0.5 text-lg font-medium tracking-tight">{title}</p>
                      <p className="text-sm text-muted-foreground">{detail}</p>
                    </div>
                  </CardContent>
                </Card>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projetos em destaque — bento: o primeiro ocupa duas colunas */}
      <section className="pb-24">
        <Reveal>
          <SectionHeading index="02" title="Projetos em destaque" href="/projetos" linkLabel="Todos os projetos" />
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
          <SectionHeading index="03" title="Novidades" href="/novidades" linkLabel="Ver tudo" />
        </Reveal>
        <Reveal delay={0.05}>
          <PostTimeline posts={posts} />
        </Reveal>
      </section>

      {/* Contato */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/60 px-6 py-12 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-2/3 rounded-full bg-foreground/10 blur-3xl" />
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">04 · Contato</p>
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
