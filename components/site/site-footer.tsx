import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-2xl px-5 pt-10 pb-10 text-sm text-muted-foreground">
      <div className="flex justify-between border-t border-border pt-6">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Feito com cuidado</span>
      </div>
    </footer>
  );
}
