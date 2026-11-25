import type { Metadata } from 'next';
import { PostList } from '@/components/site/lists';
import { Reveal } from '@/components/site/reveal';
import { getPosts } from '@/lib/content';

export const metadata: Metadata = { title: 'Novidades' };

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <>
      <Reveal>
        <h1 className="text-3xl font-medium tracking-[-0.04em]">Novidades</h1>
        <p className="mt-2 mb-12 text-muted-foreground">Lançamentos, atualizações e notas, do mais novo ao mais antigo.</p>
      </Reveal>
      <PostList posts={posts} />
    </>
  );
}
