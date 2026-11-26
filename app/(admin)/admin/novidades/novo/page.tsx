import { adminBase, requireAdmin } from '@/lib/admin';
import { PostForm } from '../../_components/post-form';
import { PageHeader } from '../../_components/ui';

export default async function NewPost() {
  const { db } = await requireAdmin();
  const { data } = await db.from('pf_projects').select('slug,title').order('title');
  return (
    <>
      <PageHeader back={{ href: `${adminBase()}/novidades`, label: 'Novidades' }} title="Nova novidade" description="Salve como rascunho e publique quando quiser." />
      <PostForm projects={data ?? []} />
    </>
  );
}
