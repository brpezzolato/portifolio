'use client';

import { useRef } from 'react';
import { BrainCircuit, Briefcase, Code2, GraduationCap } from 'lucide-react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { ScrollWords } from '@/components/site/scroll-words';
import { site, ui } from '@/lib/site';
import { CountUp, wrap } from './shared';

const icons = [GraduationCap, Briefcase, Code2, BrainCircuit];

/* Sobre mim em duas colunas: à esquerda, o texto "Sou o Bruno…" fica preso
   na tela e se preenche palavra por palavra; à direita, os cartões sobem
   contando o resto (formação, trabalho, produto, IA, números e o agora). */
export function About({ stats }: { stats: { projects: number; news: number } }) {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);

  return (
    <section id="sobre" ref={section} className="scroll-mt-20 py-28 sm:py-36">
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-10`}>
        {/* texto preso */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-32">
            <p className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rounded-full bg-signal" />
              {t(ui.aboutTitle)}
            </p>
            <ScrollWords
              text={t(site.bio)}
              target={section}
              offset={['start 0.6', 'end 0.9']}
              className="text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.1] font-medium tracking-[-0.035em]"
            />
          </div>
        </div>

        {/* cartões */}
        <ul className="grid gap-5 lg:col-span-5 lg:gap-8 lg:pt-[18vh] lg:pb-[22vh]">
          {site.skills.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={s.title.pt}>
                <Reveal delay={0.05}>
                  <article className="group flex items-start gap-5 rounded-[1.75rem] border border-border bg-card p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.3)]">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-signal/10 text-signal transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xl font-medium tracking-tight">{t(s.title)}</p>
                      <p className="mt-1 text-muted-foreground">{t(s.detail)}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}

          {/* números */}
          <li>
            <Reveal delay={0.05}>
              <article className="grid grid-cols-3 gap-4 rounded-[1.75rem] border border-border bg-card p-6">
                {[
                  { n: stats.projects, l: t(ui.statProjects) },
                  { n: site.stack.length, l: t(ui.statStack) },
                  { n: stats.news, l: t(ui.statNews) },
                ].map((x) => (
                  <div key={x.l}>
                    <p className="text-4xl font-semibold tracking-[-0.05em] text-signal">
                      <CountUp to={x.n} />
                    </p>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{x.l}</p>
                  </div>
                ))}
              </article>
            </Reveal>
          </li>

          {/* agora */}
          <li>
            <Reveal delay={0.05}>
              <article className="relative overflow-hidden rounded-[1.75rem] bg-foreground p-6 text-background">
                <span aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-signal/40 blur-3xl" />
                <p className="relative flex items-center gap-2 text-sm text-background/60">
                  <span className="signal-dot size-1.5!" />
                  {t(site.status)}
                </p>
                <p className="relative mt-6 text-2xl font-medium tracking-tight">{t(site.short)}</p>
              </article>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  );
}
