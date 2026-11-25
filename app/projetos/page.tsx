import type { Metadata } from 'next';
import { Projects } from '@/components/site/home/projects';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = { title: 'Projetos' };

export default async function ProjectsPage() {
  return <Projects projects={await getProjects()} standalone />;
}
