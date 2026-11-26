'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, FileText } from 'lucide-react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { useSite } from '@/components/site/site-data';
import { ui } from '@/lib/site';
import { wrap } from './shared';

/* Currículo: cartão escuro largo com texto à esquerda e, à direita, uma
   "folha" estilizada que se inclina ao passar o mouse, com o botão de
   download. Só aparece quando há um currículo enviado pelo painel. */
export function Resume() {
  const site = useSite();
  const { t, lang } = useLang();
  const reduce = useReducedMotion();
  if (!site.cv) return null;

  const updated = new Date(site.cv).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section id="curriculo" className="scroll-mt-20 py-12 sm:py-16">
      <div className={wrap}>
        <Reveal>
          <div className="group relative grid overflow-hidden rounded-[2.25rem] bg-foreground text-background md:grid-cols-[1.15fr_1fr]">
            <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-signal/35 blur-[100px]" />

            {/* texto */}
            <div className="relative flex flex-col justify-between gap-10 p-8 sm:p-12">
              <div>
                <p className="flex items-center gap-2 text-sm text-background/60">
                  <span className="signal-dot size-1.5!" />
                  {t(ui.cvLabel)}
                </p>
                <h2 className="mt-6 max-w-md text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance">
                  {t(ui.cvTitle)}
                </h2>
                <p className="mt-5 max-w-md text-pretty text-background/70">{t(ui.cvText)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="/curriculo"
                  download
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-background px-6 text-base font-medium text-foreground transition-transform hover:-translate-y-0.5"
                >
                  {t(ui.downloadCv)}
                  <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                </a>
                <p className="text-sm text-background/50">
                  {t(ui.cvFile)} · {t(ui.cvUpdated)} {updated}
                </p>
              </div>
            </div>

            {/* folha */}
            <div className="relative hidden items-center justify-center overflow-hidden p-12 md:flex">
              <motion.a
                href="/curriculo"
                download
                aria-hidden
                tabIndex={-1}
                initial={false}
                whileHover={reduce ? undefined : { rotate: -2, y: -8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="relative aspect-[1/1.3] w-full max-w-[16rem] rotate-3 rounded-2xl bg-background p-6 text-foreground shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]"
              >
                <span className="absolute top-0 right-0 size-12 rounded-tr-2xl rounded-bl-2xl bg-signal" />
                <FileText className="size-6 text-signal" />
                <p className="mt-4 text-lg leading-tight font-semibold tracking-tight">{site.name}</p>
                <p className="text-xs text-muted-foreground">{t(site.short)}</p>
                <div className="mt-6 space-y-2.5">
                  {[100, 86, 92, 64, 0, 100, 78, 90, 55].map((w, i) =>
                    w === 0 ? (
                      <div key={i} className="h-2" />
                    ) : (
                      <div key={i} className="h-1.5 rounded-full bg-foreground/10" style={{ width: `${w}%` }} />
                    ),
                  )}
                </div>
              </motion.a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
