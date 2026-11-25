import type { Metadata } from 'next';
import { ProjectList } from '@/components/site/lists';
import { Reveal } from '@/components/site/reveal';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = { title: 'Projetos' };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <Reveal>
        <h1 className="text-3xl font-medium tracking-[-0.04em]">Projetos</h1>
        <p className="mt-2 mb-12 text-muted-foreground">O que eu construí e o que estou construindo.</p>
      </Reveal>
      <ProjectList projects={projects} />
    </>
  );
}
