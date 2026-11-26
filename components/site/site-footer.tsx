'use client';

import { ui } from '@/lib/site';
import { useSite } from '@/components/site/site-data';
import { useLang } from './providers';

export function SiteFooter() {
  const site = useSite();
  const { t } = useLang();
  return (
    <footer className="mx-auto max-w-[1280px] px-5 pb-10 sm:px-8">
      <div className="flex flex-col justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{t(ui.rights)}</span>
      </div>
    </footer>
  );
}
