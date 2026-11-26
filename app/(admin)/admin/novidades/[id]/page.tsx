import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';
import { PostForm, type PostRow } from '../../_components/post-form';

export default async function EditPost({ params }: PageProps<'/admin/novidades/[id]'>) {
  const { db } = await requireAdmin();
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) notFound();
  const [{ data }, { data: projects }] = await Promise.all([
    db.from('pf_posts').select('*').eq('id', id.data).maybeSingle<PostRow>(),
    db.from('pf_projects').select('slug,title').order('title'),
  ]);
  if (!data) notFound();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Editar novidade</h1>
      <PostForm p={data} projects={projects ?? []} />
    </div>
  );
}
