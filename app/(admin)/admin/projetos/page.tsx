import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { adminBase, requireAdmin } from '@/lib/admin';
import { projectStatusLabel } from '@/lib/format';
import type { ProjectStatus } from '@/lib/types';
import { cn } from 'cn';
import { deleteProject } from '../_actions/content';
import { AdminList } from '../_components/list';
import { PageHeader } from '../_components/ui';

export default async function AdminProjects() {
  const { db } = await requireAdmin();
  const base = adminBase()!;
  const { data } = await db
    .from('pf_projects')
    .select('id,title,slug,year,status,featured,published')
    .order('featured', { ascending: false })
    .order('year', { ascending: false });
  return (
    <>
      <PageHeader
        eyebrow="Publicações"
        title="Projetos"
        description="O que aparece na faixa de projetos da home e em /projetos. Rascunhos ficam só aqui."
        actions={
          <Link href={`${base}/projetos/novo`} className={cn(buttonVariants({ size: 'pill' }), 'h-10')}>
            <Plus data-icon="inline-start" /> Novo projeto
          </Link>
        }
      />
      <AdminList
        icon="projetos"
        newHref={`${base}/projetos/novo`}
        newLabel="Novo projeto"
        remove={deleteProject}
        empty={{ title: 'Nenhum projeto ainda', text: 'Cadastre o primeiro e publique quando estiver pronto.' }}
        rows={(data ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          meta: `${p.year} · ${projectStatusLabel[p.status as ProjectStatus]} · /projetos/${p.slug}`,
          tag: p.featured ? 'Destaque' : undefined,
          published: p.published,
          href: `${base}/projetos/${p.id}`,
        }))}
      />
    </>
  );
}
