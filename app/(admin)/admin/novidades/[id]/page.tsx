import { notFound } from 'next/navigation';
import { z } from 'zod';
import { adminBase, requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import { deletePost } from '../../_actions/content';
import { ConfirmDelete } from '../../_components/confirm-delete';
import { PostForm, type PostRow } from '../../_components/post-form';
import { PageHeader } from '../../_components/ui';

export default async function EditPost({ params }: PageProps<'/admin/novidades/[id]'>) {
  const { db } = await requireAdmin();
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) notFound();
  const [{ data }, { data: projects }] = await Promise.all([
    db.from('pf_posts').select('*').eq('id', id.data).maybeSingle<PostRow & { updated_at: string }>(),
    db.from('pf_projects').select('slug,title').order('title'),
  ]);
  if (!data) notFound();
  return (
    <>
      <PageHeader
        back={{ href: `${adminBase()}/novidades`, label: 'Novidades' }}
        title={data.title}
        description={`Última alteração em ${formatDate(data.updated_at)}.`}
        actions={<ConfirmDelete id={data.id} what={data.title} action={deletePost} iconOnly={false} label="Apagar novidade" />}
      />
      <PostForm p={data} projects={projects ?? []} />
    </>
  );
}
