-- Portfólio: projetos e novidades.
-- Regra geral: o público só LÊ o que está publicado; só quem está na tabela
-- `admins` escreve. Nada depende do front-end para ser seguro.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Ninguém lê nem escreve `admins` pela API (nem anônimo, nem logado).
-- Você se adiciona uma vez pelo SQL Editor:
--   insert into public.admins (user_id) values ('<seu auth.users.id>');
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

-- security definer + search_path vazio: a função lê `admins` sem expor a tabela.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create type public.project_status as enum ('em-producao', 'em-construcao', 'arquivado');
create type public.post_kind as enum ('lancamento', 'atualizacao', 'nota');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  summary text not null check (char_length(summary) <= 400),
  body text not null default '' check (char_length(body) <= 50000),
  year int not null check (year between 2000 and 2100),
  status public.project_status not null default 'em-construcao',
  stack text[] not null default '{}',
  url text check (url is null or url ~ '^https://'),
  repo text check (repo is null or repo ~ '^https://'),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  excerpt text not null check (char_length(excerpt) <= 400),
  body text not null default '' check (char_length(body) <= 50000),
  kind public.post_kind not null default 'atualizacao',
  project_slug text references public.projects (slug) on update cascade on delete set null,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_published_at_idx on public.posts (published_at desc) where published;

alter table public.projects enable row level security;
alter table public.posts enable row level security;

-- Leitura pública: só publicado. Admin vê rascunhos também.
create policy "projetos publicados são públicos" on public.projects
  for select to anon, authenticated
  using (published or (select public.is_admin()));

create policy "novidades publicadas são públicas" on public.posts
  for select to anon, authenticated
  using ((published and published_at <= now()) or (select public.is_admin()));

-- Escrita: só admin, só logado.
create policy "admin escreve projetos" on public.projects
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admin escreve novidades" on public.posts
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Anônimo nunca escreve, mesmo se uma policy for afrouxada por engano.
revoke insert, update, delete on public.projects, public.posts from anon;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();
