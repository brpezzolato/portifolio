import type { Metadata } from 'next';
import { News } from '@/components/site/home/news';
import { getPosts } from '@/lib/content';

export const metadata: Metadata = { title: 'Novidades' };

export default async function PostsPage() {
  return <News posts={await getPosts()} standalone />;
}
