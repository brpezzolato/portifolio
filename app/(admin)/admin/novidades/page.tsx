import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { adminBase, requireAdmin } from '@/lib/admin';
import { formatDate, postKindLabel } from '@/lib/format';
import type { PostKind } from '@/lib/types';
import { cn } from 'cn';
import { deletePost } from '../_actions/content';
import { AdminList } from '../_components/list';
import { PageHeader } from '../_components/ui';

export default async function AdminPosts() {
  const { db } = await requireAdmin();
  const base = adminBase()!;
  const { data } = await db.from('pf_posts').select('id,title,slug,kind,published,published_at').order('published_at', { ascending: false });
  return (
    <>
      <PageHeader
        eyebrow="Publicações"
        title="Novidades"
        description="Lançamentos, atualizações e notas. Com data futura, a novidade só aparece no dia."
        actions={
          <Link href={`${base}/novidades/novo`} className={cn(buttonVariants({ size: 'pill' }), 'h-10')}>
            <Plus data-icon="inline-start" /> Nova novidade
          </Link>
        }
      />
      <AdminList
        icon="novidades"
        newHref={`${base}/novidades/novo`}
        newLabel="Nova novidade"
        remove={deletePost}
        empty={{ title: 'Nenhuma novidade ainda', text: 'Conte o que você lançou, mudou ou aprendeu.' }}
        rows={(data ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          meta: `${formatDate(p.published_at)} · /novidades/${p.slug}`,
          tag: postKindLabel[p.kind as PostKind],
          published: p.published,
          href: `${base}/novidades/${p.id}`,
        }))}
      />
    </>
  );
}
