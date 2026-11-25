import type { Post, Project } from './types';

/* Conteúdo de exemplo: usado enquanto o Supabase não está configurado
   (sem NEXT_PUBLIC_SUPABASE_URL). Troque à vontade. */

export const seedProjects: Project[] = [
  {
    slug: 'vetra',
    title: 'Vetra',
    summary:
      'Seu dinheiro, visto por inteiro: cofrinhos, bancos e faturas numa visão clara, com assistente e desbloqueio por biometria.',
    body: '## O problema\n\nO dinheiro fica espalhado em vários bancos e cofrinhos, e ninguém sabe ao certo quanto rende.\n\n## O que eu construí\n\n- Conexão com bancos via Open Finance\n- Rendimento líquido de cada cofrinho\n- Assistente financeiro em linguagem natural\n- PWA com Face ID / passkeys\n\n## Stack\n\nNext.js, Supabase com RLS, shadcn/ui e Base UI.',
    year: 2026,
    status: 'em-construcao',
    stack: ['Next.js', 'Supabase', 'shadcn/ui', 'PWA'],
    url: null,
    repo: null,
    featured: true,
  },
  {
    slug: 'portfolio',
    title: 'Este portfólio',
    summary:
      'O site que você está vendo: um diário público dos meus projetos, com painel próprio e segurança levada a sério.',
    body: '## Por quê\n\nQueria um lugar meu para registrar cada projeto e cada novidade.\n\n## Como\n\nNext.js 16, Tailwind v4, shadcn/ui (Base UI) e Supabase. CSP com nonce por pedido, RLS em todas as tabelas e painel escondido.',
    year: 2026,
    status: 'em-construcao',
    stack: ['Next.js', 'Tailwind', 'Supabase'],
    url: null,
    repo: null,
    featured: true,
  },
  {
    slug: 'projeto-exemplo',
    title: 'Projeto exemplo',
    summary:
      'Um espaço reservado para o seu próximo projeto. Descreva em uma frase o problema e a solução.',
    body: 'Conte a história do projeto aqui, em Markdown.',
    year: 2025,
    status: 'arquivado',
    stack: ['TypeScript'],
    url: null,
    repo: null,
    featured: false,
  },
];

export const seedPosts: Post[] = [
  {
    slug: 'portfolio-no-ar',
    title: 'Comecei meu portfólio',
    excerpt:
      'Primeiro esboço no ar: Next.js, shadcn e Supabase, com o mesmo DNA visual do Vetra.',
    body: 'Hoje começou este site. A ideia é simples: **cada projeto e cada novidade ganham um registro aqui**.\n\n- Visual monocromático, herdado do Vetra\n- Liquid glass só nos controles\n- Painel privado para publicar',
    kind: 'lancamento',
    publishedAt: '2026-11-25T12:00:00.000Z',
    projectSlug: 'portfolio',
  },
  {
    slug: 'vetra-conexoes',
    title: 'Vetra: nova tela de conexões',
    excerpt:
      'Reorganizei como os bancos se conectam e acabei com os lançamentos duplicados depois da troca de conexão.',
    body: 'Uma varredura de duplicados roda depois de cada troca de conexão, e a tela mostra o frescor de cada banco.',
    kind: 'atualizacao',
    publishedAt: '2026-11-20T12:00:00.000Z',
    projectSlug: 'vetra',
  },
  {
    slug: 'nota-sobre-seguranca',
    title: 'Segurança não é um recurso, é o chão',
    excerpt:
      'Por que todo projeto meu começa com CSP, RLS e o mínimo de superfície exposta.',
    body: 'Uma nota curta sobre como eu penso segurança desde o primeiro commit.',
    kind: 'nota',
    publishedAt: '2026-11-12T12:00:00.000Z',
    projectSlug: null,
  },
];
