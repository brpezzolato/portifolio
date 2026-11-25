'use client';

import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/components/site/providers';
import { projectStatusLabel } from '@/lib/format';
import { ui } from '@/lib/site';
import type { Project } from '@/lib/types';

/* Prévia gerada por projeto (sem imagem): degradê com matiz próprio,
   grade de pontos e a inicial gigante. Zoom suave no hover. */
function hue(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export function ProjectCard({ p }: { p: Project }) {
  const { t } = useLang();
  const h = hue(p.slug);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.3)]">
                    <Link href={`/projetos/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden>
                      <div
                        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{
                          background: `radial-gradient(120% 90% at 20% 10%, hsl(${h} 85% 72%), transparent 60%), radial-gradient(90% 80% at 90% 90%, hsl(${(h + 60) % 360} 80% 65%), transparent 60%), hsl(${(h + 200) % 360} 40% 92%)`,
                        }}
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(rgb(0_0_0/0.12)_1px,transparent_1px)] [background-size:14px_14px]" />
                      <span className="absolute -bottom-6 left-5 text-[9rem] leading-none font-semibold tracking-tighter text-white/80 mix-blend-overlay transition-transform duration-700 group-hover:-translate-y-2">
                        {p.title.charAt(0)}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-medium tracking-tight">{p.title}</h3>
                        <Badge variant={p.status === 'arquivado' ? 'mono' : 'signal'}>{projectStatusLabel[p.status]}</Badge>
                      </div>
                      <p className="mt-2 text-muted-foreground">{p.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex gap-4 pt-6 text-sm">
                        <Link href={`/projetos/${p.slug}`} className="inline-flex items-center gap-1 font-medium hover:text-signal">
                          {t(ui.details)} <ArrowUpRight className="size-4" />
                        </Link>
                        {p.repo && (
                          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Code2 className="size-4" /> {t(ui.code)}
                          </a>
                        )}
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            {t(ui.demo)} <ArrowUpRight className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
  );
}
