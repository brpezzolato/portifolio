export type ProjectStatus = 'em-producao' | 'em-construcao' | 'arquivado';

export type Project = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  year: number;
  status: ProjectStatus;
  stack: string[];
  url?: string | null;
  repo?: string | null;
  featured: boolean;
};

export type PostKind = 'lancamento' | 'atualizacao' | 'nota';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  kind: PostKind;
  publishedAt: string; // ISO
  projectSlug?: string | null;
};
