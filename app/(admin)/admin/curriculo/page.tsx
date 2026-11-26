import { requireAdmin } from '@/lib/admin';
import { getSiteData } from '@/lib/settings';
import { CvUploader } from '../_components/cv-uploader';
import { PageHeader } from '../_components/ui';

export default async function AdminCv() {
  const { db } = await requireAdmin();
  const site = await getSiteData();
  let current: { updated: string; size: number | null } | null = null;
  if (site.cv) {
    const { data } = await db.storage.from('cv').list('', { search: 'curriculo.pdf', limit: 1 });
    const meta = data?.find((f) => f.name === 'curriculo.pdf');
    current = { updated: site.cv, size: (meta?.metadata as { size?: number } | undefined)?.size ?? null };
  }
  return (
    <>
      <PageHeader
        eyebrow="Site"
        title="Currículo"
        description="O PDF que os visitantes baixam na seção de currículo e no contato. Enviar um novo substitui o anterior."
      />
      <CvUploader current={current} />
    </>
  );
}
