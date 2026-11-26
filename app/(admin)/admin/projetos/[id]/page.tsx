import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';
import { ProjectForm, type ProjectRow } from '../../_components/project-form';

export default async function EditProject({ params }: PageProps<'/admin/projetos/[id]'>) {
  const { db } = await requireAdmin();
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) notFound();
  const { data } = await db.from('pf_projects').select('*').eq('id', id.data).maybeSingle<ProjectRow>();
  if (!data) notFound();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Editar projeto</h1>
      <ProjectForm p={data} />
    </div>
  );
}
