import type { Metadata } from 'next';
import { ProjectCard } from '@/components/site/project-card';
import { Reveal } from '@/components/site/reveal';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = { title: 'Projetos' };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <Reveal>
        <header className="pt-10 pb-12">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {projects.length} projetos
          </p>
          <h1 className="text-sheen mt-2 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Projetos
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Tudo o que eu construí ou estou construindo — do rascunho ao que já
            está no ar.
          </p>
        </header>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
