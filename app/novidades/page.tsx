import type { Metadata } from 'next';
import { PostTimeline } from '@/components/site/post-timeline';
import { Reveal } from '@/components/site/reveal';
import { getPosts } from '@/lib/content';

export const metadata: Metadata = { title: 'Novidades' };

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <>
      <Reveal>
        <header className="pt-10 pb-12">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Changelog pessoal</p>
          <h1 className="text-sheen mt-2 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Novidades</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Lançamentos, atualizações e notas rápidas, em ordem do mais novo.
          </p>
        </header>
      </Reveal>
      <Reveal delay={0.05}>
        <PostTimeline posts={posts} />
      </Reveal>
    </>
  );
}
