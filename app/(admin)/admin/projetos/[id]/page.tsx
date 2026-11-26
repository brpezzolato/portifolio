import { notFound } from 'next/navigation';
import { z } from 'zod';
import { adminBase, requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import { deleteProject } from '../../_actions/content';
import { ConfirmDelete } from '../../_components/confirm-delete';
import { ProjectForm, type ProjectRow } from '../../_components/project-form';
import { PageHeader } from '../../_components/ui';

export default async function EditProject({ params }: PageProps<'/admin/projetos/[id]'>) {
  const { db } = await requireAdmin();
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) notFound();
  const { data } = await db.from('pf_projects').select('*').eq('id', id.data).maybeSingle<ProjectRow & { updated_at: string }>();
  if (!data) notFound();
  return (
    <>
      <PageHeader
        back={{ href: `${adminBase()}/projetos`, label: 'Projetos' }}
        title={data.title}
        description={`Última alteração em ${formatDate(data.updated_at)}.`}
        actions={<ConfirmDelete id={data.id} what={data.title} action={deleteProject} iconOnly={false} label="Apagar projeto" />}
      />
      <ProjectForm p={data} />
    </>
  );
}
