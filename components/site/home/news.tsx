'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { formatShortDate, postKindLabel } from '@/lib/format';
import { ui } from '@/lib/site';
import type { Post } from '@/lib/types';
import { SectionTitle, wrap } from './shared';

export function News({ posts, standalone = false }: { posts: Post[]; standalone?: boolean }) {
  const { t } = useLang();
  return (
    <section id="novidades" className={standalone ? 'pt-36 pb-24' : 'scroll-mt-24 py-20 sm:py-28'}>
      <div className={wrap}>
        <Reveal>
          <SectionTitle title={t(ui.newsTitle)}>
            {!standalone && <Link href="/novidades" className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              {t(ui.allNews)}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>}
          </SectionTitle>
        </Reveal>
        <ul className="border-t border-border">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 0.06}>
                <Link
                  href={`/novidades/${p.slug}`}
                  className="group grid gap-2 border-b border-border py-7 sm:grid-cols-[8rem_10rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
                >
                  <time dateTime={p.publishedAt} className="font-mono text-sm text-muted-foreground">{formatShortDate(p.publishedAt)}</time>
                  <span className="text-sm text-signal">{postKindLabel[p.kind]}</span>
                  <span className="min-w-0">
                    <span className="block text-xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">{p.title}</span>
                    <span className="mt-1 block text-muted-foreground">{p.excerpt}</span>
                  </span>
                  <ArrowUpRight className="hidden size-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-foreground sm:block" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
