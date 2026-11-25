'use client';

import { useLang } from '@/components/site/providers';
import { ScrollWords } from '@/components/site/scroll-words';
import { site, ui } from '@/lib/site';
import { CountUp, wrap } from './shared';

/* Sobre mim: o texto se preenche com a rolagem. Rótulo fixo à esquerda
   no desktop; números discretos no fim. */
export function About({ stats }: { stats: { projects: number; news: number } }) {
  const { t } = useLang();
  return (
    <section id="sobre" className="scroll-mt-10 py-28 sm:py-40">
      <div className={`${wrap} grid gap-8 lg:grid-cols-12`}>
        <p className="text-sm text-muted-foreground lg:sticky lg:top-28 lg:col-span-2 lg:self-start">{t(ui.aboutTitle)}</p>
        <div className="lg:col-span-10">
          <ScrollWords
            text={t(site.bio)}
            className="text-[clamp(1.8rem,4.2vw,3.9rem)] leading-[1.1] font-medium tracking-[-0.035em]"
          />
          <dl className="mt-16 flex flex-wrap gap-x-14 gap-y-6">
            {[
              { n: stats.projects, l: t(ui.statProjects) },
              { n: site.stack.length, l: t(ui.statStack) },
              { n: stats.news, l: t(ui.statNews) },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline gap-3">
                <dd className="text-5xl font-semibold tracking-[-0.05em] text-signal">
                  <CountUp to={s.n} />
                </dd>
                <dt className="max-w-[9rem] text-sm leading-snug text-muted-foreground">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
