import { requireAdmin } from '@/lib/admin';
import { getSiteData } from '@/lib/settings';
import { SettingsForm } from '../_components/settings-form';
import { PageHeader } from '../_components/ui';

export default async function AdminContent() {
  await requireAdmin();
  const s = await getSiteData();
  return (
    <>
      <PageHeader eyebrow="Site" title="Conteúdo" description="Os textos do site em português e inglês, os links e as seções Sobre e Jornada." />
      <SettingsForm s={s} />
    </>
  );
}
