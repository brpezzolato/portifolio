'use client';

import { useLang } from '@/components/site/providers';
import { site } from '@/lib/site';
import { Kinetic } from './kinetic';

/* Competências (Ciência de Dados, IA…) como faixas de palavras gigantes. */
export function KineticSkills() {
  const { t } = useLang();
  return <Kinetic top={site.skills.map((s) => t(s.title))} bottom={[...site.stack]} />;
}
