'use client';

import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { HeroScene } from '@/components/site/hero-scene';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { TypeLines } from '@/components/site/type-lines';
import { site, ui } from '@/lib/site';
import { cn } from 'cn';
import { CountUp, wrap } from './shared';

export function Hero({ stats }: { stats: { projects: number; news: number } }) {
  const { t } = useLang();
  const items = [
    { n: stats.projects, l: t(ui.statProjects) },
    { n: site.stack.length, l: t(ui.statStack) },
    { n: stats.news, l: t(ui.statNews) },
  ];
  return (
    <section id="inicio" className="relative flex min-h-[100svh] scroll-mt-0 flex-col justify-center overflow-hidden">
      <HeroScene className="absolute inset-0" />
      <div className={`${wrap} relative pt-[48svh] pb-16 lg:pt-28`}>
        <div className="max-w-2xl">
          <Reveal>
            <Badge variant="signal" className="h-7 px-3 text-sm">
              <span className="signal-dot size-1.5!" />
              {t(site.status)}
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
              {site.name}
            </h1>
          </Reveal>
          <p className="mt-5 text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium tracking-[-0.03em] text-foreground/80">
            <TypeLines key={t(site.tagline)} lines={[t(site.tagline)]} speed={55} />
          </p>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">{t(site.intro)}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#projetos" className={cn(buttonVariants({ variant: 'glass', size: 'pill' }))}>
                {t(ui.seeProjects)} <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href="#contato" className={cn(buttonVariants({ variant: 'glass-quiet', size: 'pill' }))}>
                {t(ui.contact)}
              </Link>
              {site.cv && (
                <a href={site.cv} download className={cn(buttonVariants({ variant: 'ghost', size: 'pill' }))}>
                  <Download data-icon="inline-start" /> {t(ui.downloadCv)}
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
              {items.map((s) => (
                <div key={s.l}>
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="text-4xl font-semibold tracking-[-0.04em]">
                    <CountUp to={s.n} />
                  </dd>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
