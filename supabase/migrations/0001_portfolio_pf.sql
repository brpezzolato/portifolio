-- Portfólio do Bruno, no projeto Supabase próprio "portfólio".
-- (O prefixo pf_ ficou de quando o banco dividia projeto com outro app.)
-- Aplicado em 2026-11-26 como migration "portfolio_pf_init".

create table public.pf_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.pf_admins enable row level security;
revoke all on public.pf_admins from anon, authenticated;

-- admin = está em pf_admins E sessão com dois fatores (aal2)
create or replace function public.pf_is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.pf_admins where user_id = (select auth.uid()))
     and coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2';
$$;
revoke all on function public.pf_is_admin() from public;
grant execute on function public.pf_is_admin() to anon, authenticated;

create or replace function public.pf_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

create table public.pf_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  summary text not null default '' check (char_length(summary) <= 400),
  body text not null default '' check (char_length(body) <= 50000),
  year int not null check (year between 2000 and 2100),
  status text not null default 'em-construcao' check (status in ('em-producao','em-construcao','arquivado')),
  stack text[] not null default '{}',
  url text check (url is null or url ~ '^https://'),
  repo text check (repo is null or repo ~ '^https://'),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pf_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  excerpt text not null default '' check (char_length(excerpt) <= 400),
  body text not null default '' check (char_length(body) <= 50000),
  kind text not null default 'atualizacao' check (kind in ('lancamento','atualizacao','nota')),
  project_slug text references public.pf_projects (slug) on update cascade on delete set null,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index pf_posts_published_at_idx on public.pf_posts (published_at desc) where published;
create index pf_posts_project_slug_idx on public.pf_posts (project_slug);

alter table public.pf_projects enable row level security;
alter table public.pf_posts enable row level security;

create policy "pf projetos publicados são públicos" on public.pf_projects
  for select to anon, authenticated using (published or (select public.pf_is_admin()));
create policy "pf novidades publicadas são públicas" on public.pf_posts
  for select to anon, authenticated using ((published and published_at <= now()) or (select public.pf_is_admin()));
create policy "pf admin insere projetos" on public.pf_projects for insert to authenticated with check ((select public.pf_is_admin()));
create policy "pf admin altera projetos" on public.pf_projects for update to authenticated using ((select public.pf_is_admin())) with check ((select public.pf_is_admin()));
create policy "pf admin apaga projetos" on public.pf_projects for delete to authenticated using ((select public.pf_is_admin()));
create policy "pf admin insere novidades" on public.pf_posts for insert to authenticated with check ((select public.pf_is_admin()));
create policy "pf admin altera novidades" on public.pf_posts for update to authenticated using ((select public.pf_is_admin())) with check ((select public.pf_is_admin()));
create policy "pf admin apaga novidades" on public.pf_posts for delete to authenticated using ((select public.pf_is_admin()));
revoke insert, update, delete on public.pf_projects, public.pf_posts from anon;

create trigger pf_projects_touch before update on public.pf_projects for each row execute function public.pf_touch_updated_at();
create trigger pf_posts_touch before update on public.pf_posts for each row execute function public.pf_touch_updated_at();

-- mensagens do contato: público só insere; admin lê e apaga
create table public.pf_contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);
alter table public.pf_contact_messages enable row level security;
create policy "pf qualquer um envia mensagem" on public.pf_contact_messages for insert to anon, authenticated with check (true);
create policy "pf admin lê mensagens" on public.pf_contact_messages for select to authenticated using ((select public.pf_is_admin()));
create policy "pf admin apaga mensagens" on public.pf_contact_messages for delete to authenticated using ((select public.pf_is_admin()));
revoke update on public.pf_contact_messages from anon, authenticated;

-- conteúdo editável (uma linha)
create table public.pf_site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now()
);
insert into public.pf_site_settings (id) values (1);
alter table public.pf_site_settings enable row level security;
create policy "pf conteúdo do site é público" on public.pf_site_settings for select to anon, authenticated using (true);
create policy "pf admin edita o conteúdo" on public.pf_site_settings for update to authenticated using ((select public.pf_is_admin())) with check ((select public.pf_is_admin()));
revoke insert, delete on public.pf_site_settings from anon, authenticated;
revoke update on public.pf_site_settings from anon;
create trigger pf_site_settings_touch before update on public.pf_site_settings for each row execute function public.pf_touch_updated_at();

-- limite de tentativas de login (5 por chave a cada 15 min); tabela fechada
create table public.pf_login_attempts (key text not null, created_at timestamptz not null default now());
create index pf_login_attempts_key_idx on public.pf_login_attempts (key, created_at desc);
alter table public.pf_login_attempts enable row level security;
revoke all on public.pf_login_attempts from anon, authenticated;

create or replace function public.pf_register_login_attempt(p_key text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare recent int;
begin
  if p_key is null or char_length(p_key) <> 64 then return false; end if;
  delete from public.pf_login_attempts where created_at < now() - interval '1 day';
  select count(*) into recent from public.pf_login_attempts where key = p_key and created_at > now() - interval '15 minutes';
  if recent >= 5 then return false; end if;
  insert into public.pf_login_attempts (key) values (p_key);
  return true;
end; $$;
revoke all on function public.pf_register_login_attempt(text) from public;
grant execute on function public.pf_register_login_attempt(text) to anon, authenticated;
