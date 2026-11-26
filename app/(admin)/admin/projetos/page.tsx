import { adminBase, requireAdmin } from '@/lib/admin';
import { deleteProject } from '../_actions/content';
import { AdminList } from '../_components/list';

export default async function AdminProjects() {
  const { db } = await requireAdmin();
  const base = adminBase()!;
  const { data } = await db.from('projects').select('id,title,slug,year,published').order('year', { ascending: false });
  return (
    <AdminList
      title="Projetos"
      newHref={`${base}/projetos/novo`}
      remove={deleteProject}
      rows={(data ?? []).map((p) => ({ id: p.id, title: p.title, meta: `${p.year} · /projetos/${p.slug}`, published: p.published, href: `${base}/projetos/${p.id}` }))}
    />
  );
}
