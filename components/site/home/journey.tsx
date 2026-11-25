'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { site, ui } from '@/lib/site';
import { SectionTitle, wrap } from './shared';

/* Linha do tempo: o trilho se preenche conforme a rolagem. */
export function Journey() {
  const { t } = useLang();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <section id="jornada" className="scroll-mt-24 py-20 sm:py-28">
      <div className={`${wrap} grid gap-12 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-4">
          <SectionTitle title={t(ui.journeyTitle)} />
        </Reveal>
        <ol ref={ref} className="relative lg:col-span-8">
          <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
          <motion.span aria-hidden style={{ height: fill }} className="absolute top-2 left-[7px] w-px bg-signal" />
          {site.journey.map((j, i) => (
            <li key={i} className="relative pb-14 pl-12 last:pb-0">
              <span className="absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-signal bg-background" />
              <Reveal delay={i * 0.08}>
                <p className="text-sm text-signal">{t(j.kind)}</p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">{t(j.title)}</h3>
                <p className="mt-1 text-muted-foreground">{typeof j.org === 'string' ? j.org : t(j.org)}</p>
                <p className="mt-4 max-w-xl text-pretty">{t(j.text)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
