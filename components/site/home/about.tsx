'use client';

import { BrainCircuit, Briefcase, Code2, GraduationCap } from 'lucide-react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { site, ui } from '@/lib/site';
import { SectionTitle, wrap } from './shared';

const icons = [GraduationCap, Briefcase, Code2, BrainCircuit];

export function About() {
  const { t } = useLang();
  return (
    <section id="sobre" className="scroll-mt-24 py-20 sm:py-28">
      <div className={wrap}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionTitle title={t(ui.aboutTitle)} />
              <p className="-mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">{t(site.bio)}</p>
            </Reveal>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {site.skills.map((s, i) => {
              const Icon = icons[i % icons.length];
              return (
                <li key={s.title.pt}>
                  <Reveal delay={i * 0.07} className="h-full">
                    <div className="group h-full rounded-3xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-[0_20px_40px_-24px_rgb(0_0_0/0.25)]">
                      <span className="grid size-11 place-items-center rounded-2xl bg-signal/10 text-signal transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon className="size-5" />
                      </span>
                      <p className="mt-8 text-xl font-medium tracking-tight">{t(s.title)}</p>
                      <p className="mt-1 text-muted-foreground">{t(s.detail)}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div aria-label="Tecnologias" className="mt-20 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee">
          {[0, 1].map((d) => (
            <ul key={d} aria-hidden={d === 1} className="flex shrink-0 gap-3 pr-3">
              {site.stack.map((s) => (
                <li key={s} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm whitespace-nowrap">
                  {s}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
