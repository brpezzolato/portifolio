import 'server-only';
import { seedPosts, seedProjects } from './seed';
import { supabaseConfigured } from './supabase/env';
import { createClient } from './supabase/server';
import type { Post, Project } from './types';

/* Leitura pública. Com Supabase configurado, lê só o que o RLS libera
   (published = true); sem ele, usa o conteúdo de exemplo de lib/seed.ts. */

type ProjectRow = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  year: number;
  status: Project['status'];
  stack: string[];
  url: string | null;
  repo: string | null;
  featured: boolean;
};

type PostRow = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  kind: Post['kind'];
  published_at: string;
  project_slug: string | null;
};

const toPost = (r: PostRow): Post => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  body: r.body,
  kind: r.kind,
  publishedAt: r.published_at,
  projectSlug: r.project_slug,
});

const PROJECT_COLUMNS =
  'slug,title,summary,body,year,status,stack,url,repo,featured';
const POST_COLUMNS =
  'slug,title,excerpt,body,kind,published_at,project_slug';

export async function getProjects(): Promise<Project[]> {
  if (!supabaseConfigured)
    return [...seedProjects].sort((a, b) => b.year - a.year);
  const db = await createClient();
  const { data, error } = await db
    .from('projects')
    .select(PROJECT_COLUMNS)
    .order('year', { ascending: false })
    .returns<ProjectRow[]>();
  if (error) throw new Error('Não foi possível carregar os projetos.');
  return data;
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getPosts(limit?: number): Promise<Post[]> {
  if (!supabaseConfigured) {
    const sorted = [...seedPosts].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt),
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }
  const db = await createClient();
  let query = db
    .from('posts')
    .select(POST_COLUMNS)
    .order('published_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query.returns<PostRow[]>();
  if (error) throw new Error('Não foi possível carregar as novidades.');
  return data.map(toPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
