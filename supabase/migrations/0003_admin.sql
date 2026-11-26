-- Painel administrativo: autenticação forte e conteúdo editável.

-- 1) Admin só com sessão de dois fatores (senha + autenticador = aal2).
--    Sem o código do app autenticador, a sessão é aal1 e o banco recusa
--    qualquer escrita, mesmo com a senha certa.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  )
  and coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2';
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2) Conteúdo editável do site (uma única linha, id = 1).
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict do nothing;
alter table public.site_settings enable row level security;

create policy "conteúdo do site é público" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admin edita o conteúdo" on public.site_settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
revoke insert, delete on public.site_settings from anon, authenticated;
revoke update on public.site_settings from anon;

create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- 3) Limite de tentativas de login: 5 por chave (IP com hash) a cada 15 min.
--    A tabela não é acessível pela API; só a função mexe nela.
create table public.login_attempts (
  key text not null,
  created_at timestamptz not null default now()
);
create index login_attempts_key_idx on public.login_attempts (key, created_at desc);
alter table public.login_attempts enable row level security;
revoke all on public.login_attempts from anon, authenticated;

create or replace function public.register_login_attempt(p_key text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent int;
begin
  if p_key is null or char_length(p_key) <> 64 then
    return false;
  end if;
  delete from public.login_attempts where created_at < now() - interval '1 day';
  select count(*) into recent from public.login_attempts
    where key = p_key and created_at > now() - interval '15 minutes';
  if recent >= 5 then
    return false;
  end if;
  insert into public.login_attempts (key) values (p_key);
  return true;
end;
$$;
revoke all on function public.register_login_attempt(text) from public;
grant execute on function public.register_login_attempt(text) to anon, authenticated;
