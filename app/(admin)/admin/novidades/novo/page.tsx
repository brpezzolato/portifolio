import { requireAdmin } from '@/lib/admin';
import { PostForm } from '../../_components/post-form';

export default async function NewPost() {
  const { db } = await requireAdmin();
  const { data } = await db.from('pf_projects').select('slug,title').order('title');
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Nova novidade</h1>
      <PostForm projects={data ?? []} />
    </div>
  );
}
