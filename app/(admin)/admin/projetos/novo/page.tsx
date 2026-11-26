import { requireAdmin } from '@/lib/admin';
import { ProjectForm } from '../../_components/project-form';

export default async function NewProject() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Novo projeto</h1>
      <ProjectForm />
    </div>
  );
}
