import { adminBase, requireAdmin } from '@/lib/admin';
import { formatShortDate } from '@/lib/format';
import { deletePost } from '../_actions/content';
import { AdminList } from '../_components/list';

export default async function AdminPosts() {
  const { db } = await requireAdmin();
  const base = adminBase()!;
  const { data } = await db.from('pf_posts').select('id,title,slug,published,published_at').order('published_at', { ascending: false });
  return (
    <AdminList
      title="Novidades"
      newHref={`${base}/novidades/novo`}
      remove={deletePost}
      rows={(data ?? []).map((p) => ({ id: p.id, title: p.title, meta: `${formatShortDate(p.published_at)} · /novidades/${p.slug}`, published: p.published, href: `${base}/novidades/${p.id}` }))}
    />
  );
}
