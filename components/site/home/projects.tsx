'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { ui } from '@/lib/site';
import type { Project } from '@/lib/types';
import { ProjectCard } from './project-card';
import { wrap } from './shared';

/* Home: a seção prende na tela e os cartões passam na horizontal enquanto
   se rola para baixo (desktop). No celular, empilham. */
export function Projects({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${Math.max(0, projects.length - 2) * 34}%`]);

  const Head = (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="font-mono text-sm text-muted-foreground">({String(projects.length).padStart(2, '0')})</p>
        <h2 className="mt-2 text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em]">{t(ui.nav.projetos)}</h2>
      </div>
      <Link href="/projetos" className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        {t(ui.allProjects)}
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );

  return (
    <section id="projetos" className="scroll-mt-0">
      {/* desktop: trilho horizontal */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${100 + projects.length * 45}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <div className={wrap}>{Head}</div>
          <motion.ul style={{ x }} className="mt-12 flex gap-8 pl-[max(2rem,calc((100vw-1280px)/2+2rem))]">
            {projects.map((p) => (
              <li key={p.slug} className="w-[30rem] shrink-0">
                <ProjectCard p={p} />
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
      {/* celular e tablet: pilha */}
      <div className={`${wrap} py-20 lg:hidden`}>
        <Reveal>{Head}</Reveal>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 0.06} className="h-full">
                <ProjectCard p={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Página /projetos: grade simples com os mesmos cartões. */
export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  return (
    <section className={`${wrap} pt-36 pb-24`}>
      <Reveal>
        <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em]">{t(ui.nav.projetos)}</h1>
      </Reveal>
      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 0.06} className="h-full">
              <ProjectCard p={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
