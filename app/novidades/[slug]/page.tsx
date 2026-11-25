import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Markdown } from '@/components/site/markdown';
import { Reveal } from '@/components/site/reveal';
import { getPost } from '@/lib/content';
import { formatDate, postKindLabel } from '@/lib/format';

export async function generateMetadata({
  params,
}: PageProps<'/novidades/[slug]'>): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: PageProps<'/novidades/[slug]'>) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-2xl pt-6">
      <Link href="/novidades" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Novidades
      </Link>
      <Reveal>
        <header className="pt-8 pb-8">
          <div className="flex items-center gap-2">
            <Badge variant="mono">{postKindLabel[post.kind]}</Badge>
            <time dateTime={post.publishedAt} className="font-mono text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </time>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          {post.projectSlug && (
            <Link href={`/projetos/${post.projectSlug}`} className="mt-4 inline-block font-mono text-xs tracking-wider text-muted-foreground uppercase hover:text-foreground">
              / {post.projectSlug} ↗
            </Link>
          )}
        </header>
      </Reveal>
      <Separator className="mb-8" />
      <Reveal>
        <Markdown>{post.body}</Markdown>
      </Reveal>
    </article>
  );
}
