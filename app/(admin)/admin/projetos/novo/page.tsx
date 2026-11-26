import { adminBase, requireAdmin } from '@/lib/admin';
import { ProjectForm } from '../../_components/project-form';
import { PageHeader } from '../../_components/ui';

export default async function NewProject() {
  await requireAdmin();
  return (
    <>
      <PageHeader back={{ href: `${adminBase()}/projetos`, label: 'Projetos' }} title="Novo projeto" description="Salve como rascunho e publique quando estiver pronto." />
      <ProjectForm />
    </>
  );
}
