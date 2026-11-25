import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatShortDate, postKindLabel } from '@/lib/format';
import type { Post } from '@/lib/types';

/* Linha do tempo estilo changelog: data em mono à esquerda, trilho fino,
   e o ponto do item acende no hover. */
export function PostTimeline({ posts }: { posts: Post[] }) {
  if (posts.length === 0)
    return <p className="text-muted-foreground">Nada publicado ainda.</p>;
  return (
    <ol className="relative">
      {posts.map((post) => (
        <li key={post.slug} className="group relative grid grid-cols-[4.5rem_1fr] gap-x-6 sm:grid-cols-[6rem_1fr]">
          <time
            dateTime={post.publishedAt}
            className="pt-5 text-right font-mono text-xs text-muted-foreground tabular-nums"
          >
            {formatShortDate(post.publishedAt)}
          </time>
          <div className="relative border-l border-border pb-2 pl-6">
            <span
              aria-hidden
              className="absolute top-6 -left-[4.5px] size-2 rounded-full border border-border bg-background transition-colors group-hover:border-foreground group-hover:bg-foreground"
            />
            <Link
              href={`/novidades/${post.slug}`}
              className="-mx-3 block rounded-xl px-3 py-4 outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Badge variant="mono">{postKindLabel[post.kind]}</Badge>
                {post.projectSlug && (
                  <span className="font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                    / {post.projectSlug}
                  </span>
                )}
              </div>
              <h3 className="font-medium tracking-tight">{post.title}</h3>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
