'use client';

import { HeroScene } from '@/components/site/hero-scene';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { TypeLines } from '@/components/site/type-lines';
import { site } from '@/lib/site';

/* Herói centralizado: a orbe no meio, o nome dividido em volta dela
   (primeiro nome no alto à esquerda, com a frase digitada logo abaixo;
   sobrenome embaixo à direita). Cantos com o essencial. */
export function Hero() {
  const { t } = useLang();
  const [first, ...rest] = site.name.split(' ');
  return (
    <section id="inicio" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <HeroScene className="absolute inset-0" />
      <div className="pointer-events-none relative mx-auto grid h-full max-w-[1400px] grid-rows-[1fr_auto_1fr] px-5 pt-20 pb-28 sm:px-8 sm:pb-32">
        <h1 className="contents">
          <Reveal className="self-end">
            <span className="block text-[clamp(3.5rem,12vw,11.5rem)] leading-[0.8] font-semibold tracking-[-0.06em]">{first}</span>
            <span className="mt-5 block max-w-[16rem] text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium tracking-tight text-foreground/80 sm:max-w-none">
              <TypeLines key={t(site.tagline)} lines={[t(site.tagline)]} speed={55} />
            </span>
          </Reveal>
          <span className="row-start-2 block h-[min(38svh,60vw)]" aria-hidden />
          <Reveal delay={0.1} className="self-start justify-self-end">
            <span className="block text-right text-[clamp(3.5rem,12vw,11.5rem)] leading-[0.8] font-semibold tracking-[-0.06em]">{rest.join(' ')}</span>
          </Reveal>
        </h1>
      </div>
      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 pb-24 text-sm text-muted-foreground sm:px-8 sm:pb-8">
        <span className="flex items-center gap-2">
          <span className="signal-dot size-1.5!" />
          {t(site.status)}
        </span>
        <span className="hidden text-right sm:block">{t(site.short)}</span>
      </div>
    </section>
  );
}
