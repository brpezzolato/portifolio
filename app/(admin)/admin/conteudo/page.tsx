import { requireAdmin } from '@/lib/admin';
import { getSiteData } from '@/lib/settings';
import { SettingsForm } from '../_components/settings-form';

export default async function AdminContent() {
  await requireAdmin();
  const s = await getSiteData();
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Conteúdo do site</h1>
      <p className="mt-1 mb-8 text-muted-foreground">Textos em português e inglês, links, cartões e jornada.</p>
      <SettingsForm s={s} />
    </div>
  );
}
