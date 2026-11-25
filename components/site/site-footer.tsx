import { Separator } from '@/components/ui/separator';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8">
      <Separator className="mb-6" />
      <div className="flex flex-col justify-between gap-3 font-mono text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name} · feito à mão com Next.js e
          Supabase
        </p>
        <ul className="flex gap-4">
          {site.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
