import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatShortDate, projectStatusLabel } from '@/lib/format';
import type { Post, Project } from '@/lib/types';
import { Reveal } from './reveal';

/* Linhas mínimas: título à esquerda, um dado à direita. No hover a linha
   desliza um pouco e a seta aparece. */
const row =
  'group flex items-baseline justify-between gap-6 border-b border-border py-5 transition-colors hover:border-foreground/30';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t border-border">
      {projects.map((p, i) => (
        <li key={p.slug}>
          <Reveal delay={i * 0.06}>
            <Link href={`/projetos/${p.slug}`} className={row}>
              <span className="min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                <span className="block text-lg tracking-tight">{p.title}</span>
                <span className="mt-0.5 block truncate text-sm text-muted-foreground">{p.summary}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                {projectStatusLabel[p.status]}
                <ArrowUpRight className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="border-t border-border">
      {posts.map((p, i) => (
        <li key={p.slug}>
          <Reveal delay={i * 0.06}>
            <Link href={`/novidades/${p.slug}`} className={row}>
              <span className="min-w-0 truncate tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                {p.title}
              </span>
              <time dateTime={p.publishedAt} className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                {formatShortDate(p.publishedAt)}
              </time>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
