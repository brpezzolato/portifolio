import { site } from '@/lib/site';
import { LiveClock } from './live-clock';
import { ScrambleText } from './scramble-text';

export function SiteFooter() {
  return (
    <footer id="contato" className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 pt-20 pb-8 sm:px-8">
        <p className="text-sm text-muted-foreground">Tem uma ideia, um dado ou um problema?</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-3 block text-[clamp(2.2rem,8.5vw,8rem)] leading-[0.95] font-semibold tracking-[-0.045em] break-words transition-colors hover:text-signal"
        >
          <ScrambleText text="Vamos conversar." hover />
        </a>
        <p className="mt-4 font-mono text-sm text-muted-foreground">{site.email}</p>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <ul className="flex gap-5">
            {site.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <LiveClock className="font-mono" />
        </div>
      </div>
    </footer>
  );
}
