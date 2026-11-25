import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Markdown } from '@/components/site/markdown';
import { PostTimeline } from '@/components/site/post-timeline';
import { Reveal } from '@/components/site/reveal';
import { getPosts, getProject } from '@/lib/content';
import { projectStatusLabel } from '@/lib/format';
import { cn } from 'cn';

export async function generateMetadata({
  params,
}: PageProps<'/projetos/[slug]'>): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: PageProps<'/projetos/[slug]'>) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const related = (await getPosts()).filter((p) => p.projectSlug === slug);

  return (
    <article className="pt-6">
      <Link href="/projetos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Projetos
      </Link>
      <Reveal>
        <header className="pt-8 pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={project.status === 'arquivado' ? 'mono' : 'signal'}>
              {projectStatusLabel[project.status]}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
          </div>
          <h1 className="text-sheen mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Badge key={s} variant="mono">{s}</Badge>
            ))}
          </div>
          {(project.url || project.repo) && (
            <div className="mt-8 flex gap-3">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'glass', size: 'pill' }))}>
                  Abrir projeto <ArrowUpRight data-icon="inline-end" />
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'glass-quiet', size: 'pill' }))}>
                  Código <ArrowUpRight data-icon="inline-end" />
                </a>
              )}
            </div>
          )}
        </header>
      </Reveal>
      <Separator className="mb-10" />
      <Reveal>
        <div className="max-w-2xl">
          <Markdown>{project.body}</Markdown>
        </div>
      </Reveal>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-lg font-medium tracking-tight">Diário do projeto</h2>
          <PostTimeline posts={related} />
        </section>
      )}
    </article>
  );
}
