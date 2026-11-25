'use client';

import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { site, ui } from '@/lib/site';
import { wrap } from './shared';

/* Jornada em linhas largas: número, tipo, título enorme e instituição.
   No hover a linha se inverte (fundo escuro, texto claro). */
export function Journey() {
  const { t } = useLang();
  return (
    <section id="jornada" className="scroll-mt-10 py-20 sm:py-28">
      <div className={wrap}>
        <Reveal>
          <h2 className="mb-10 text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em]">{t(ui.journeyTitle)}</h2>
        </Reveal>
        <ol className="border-t border-foreground">
          {site.journey.map((j, i) => (
            <li key={i}>
              <Reveal delay={i * 0.06}>
                <div className="group relative grid gap-3 overflow-hidden border-b border-foreground py-8 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-10">
                  <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(.22,.9,.28,1)] group-hover:scale-y-100" />
                  <span className="relative font-mono text-sm text-muted-foreground transition-colors group-hover:text-background/60 sm:col-span-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative text-sm text-signal sm:col-span-2">{t(j.kind)}</span>
                  <h3 className="relative text-3xl font-medium tracking-[-0.04em] transition-colors group-hover:text-background sm:col-span-5 sm:text-5xl">{t(j.title)}</h3>
                  <span className="relative transition-colors group-hover:text-background sm:col-span-4 sm:text-right">
                    <span className="block font-medium">{typeof j.org === 'string' ? j.org : t(j.org)}</span>
                    <span className="block text-sm text-muted-foreground transition-colors group-hover:text-background/60">{t(j.text)}</span>
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
