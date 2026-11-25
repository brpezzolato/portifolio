'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { formatDate, formatShortDate, postKindLabel } from '@/lib/format';
import { ui } from '@/lib/site';
import type { Post } from '@/lib/types';
import { wrap } from './shared';

/* Novidades: a mais recente em destaque à esquerda, as outras em lista
   compacta à direita. Na página /novidades, todas em lista. */
export function News({ posts, standalone = false }: { posts: Post[]; standalone?: boolean }) {
  const { t } = useLang();
  const [first, ...others] = posts;
  const Row = ({ p }: { p: Post }) => (
    <Link href={`/novidades/${p.slug}`} className="group flex items-baseline justify-between gap-6 border-b border-border py-5">
      <span className="min-w-0">
        <span className="block text-sm text-muted-foreground">{postKindLabel[p.kind]}</span>
        <span className="mt-1 block text-lg font-medium tracking-tight transition-colors group-hover:text-signal">{p.title}</span>
      </span>
      <time dateTime={p.publishedAt} className="shrink-0 font-mono text-xs text-muted-foreground">{formatShortDate(p.publishedAt)}</time>
    </Link>
  );

  if (standalone)
    return (
      <section className={`${wrap} pt-36 pb-24`}>
        <h1 className="mb-10 text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em]">{t(ui.newsTitle)}</h1>
        <div className="border-t border-border">{posts.map((p) => <Row key={p.slug} p={p} />)}</div>
      </section>
    );

  if (!first) return null;
  return (
    <section id="novidades" className="scroll-mt-10 py-20 sm:py-28">
      <div className={`${wrap} grid gap-10 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-7">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em]">{t(ui.newsTitle)}</h2>
          </div>
          <Link href={`/novidades/${first.slug}`} className="group block rounded-[2rem] bg-foreground p-8 text-background transition-transform duration-500 hover:-translate-y-1 sm:p-10">
            <span className="flex items-center justify-between text-sm text-background/60">
              <span>{postKindLabel[first.kind]}</span>
              <time dateTime={first.publishedAt}>{formatDate(first.publishedAt)}</time>
            </span>
            <span className="mt-16 block text-3xl font-medium tracking-[-0.04em] sm:text-5xl">{first.title}</span>
            <span className="mt-4 block max-w-lg text-background/70">{first.excerpt}</span>
            <ArrowUpRight className="mt-8 size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5 lg:pt-24">
          <div className="border-t border-border">{others.map((p) => <Row key={p.slug} p={p} />)}</div>
          <Link href="/novidades" className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            {t(ui.allNews)} <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
