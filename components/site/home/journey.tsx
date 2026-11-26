'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { ui } from '@/lib/site';
import { useSite } from '@/components/site/site-data';
import { wrap } from './shared';

/* Jornada como capítulos: cada etapa tem um marcador e, no computador, um
   trilho no alto que acende quando ela aparece (funciona com quantas fileiras
   houver). Embaixo, um cartão com número grande vazado, tipo, título,
   instituição e descrição. No celular, o trilho vira vertical à esquerda e se
   preenche com a rolagem. Campos vazios não aparecem. */
export function Journey() {
  const site = useSite();
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const items = site.journey;

  return (
    <section id="jornada" className="scroll-mt-16 py-20 sm:py-28">
      <div className={wrap}>
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em]">{t(ui.journeyTitle)}</h2>
          <p className="font-mono text-sm text-muted-foreground">({String(items.length).padStart(2, '0')})</p>
        </Reveal>

        <div ref={ref} className="relative">
          {/* trilho: horizontal no desktop, vertical no celular */}
          <div aria-hidden className="absolute top-0 left-[11px] h-full w-px bg-border md:hidden" />
          <motion.div aria-hidden style={{ height: fill }} className="absolute top-0 left-[11px] w-px bg-signal md:hidden" />

          <ol className={`grid gap-10 md:gap-8 ${items.length > 1 ? 'md:grid-cols-2' : ''} ${items.length > 2 ? 'lg:grid-cols-3' : ''}`}>
              {items.map((j, i) => (
                <li key={i} className="relative pl-12 md:pt-14 md:pl-0">
                  {/* trilho de cada etapa no computador: acende quando aparece (funciona com quantas fileiras houver) */}
                  <span aria-hidden className="absolute top-[11px] left-0 hidden h-px w-full bg-border md:block" />
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, delay: (i % 3) * 0.15, ease: [0.22, 0.9, 0.28, 1] }}
                    className="absolute top-[11px] left-0 hidden h-px w-full origin-left bg-signal md:block"
                  />
                  <span className="absolute top-0 left-0 grid size-[23px] place-items-center rounded-full border border-signal bg-background">
                    <span className="size-2 rounded-full bg-signal" />
                  </span>
                  <Reveal delay={i * 0.12} className="h-full">
                    <article className="h-full rounded-[2rem] border border-border bg-card p-7 sm:p-9">
                      <div className="flex items-start justify-between gap-4">
                        {t(j.kind) ? <span className="rounded-full bg-signal/10 px-3 py-1 text-sm text-signal">{t(j.kind)}</span> : <span />}
                        <span
                          aria-hidden
                          className="text-[4.5rem] leading-[0.8] font-semibold tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--border)] sm:text-[6rem]"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-10 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{t(j.title)}</h3>
                      {(typeof j.org === 'string' ? j.org : t(j.org)) && (
                        <p className="mt-2 font-medium text-foreground/80">{typeof j.org === 'string' ? j.org : t(j.org)}</p>
                      )}
                      {t(j.text) && <p className="mt-6 max-w-md text-pretty text-muted-foreground">{t(j.text)}</p>}
                    </article>
                  </Reveal>
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
