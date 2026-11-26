-- Endurecimento do portfólio (revisão de segurança, 2026-11-26).
-- Aplicado como migration "pf_hardening".
--
-- 1. As funções que o público alcança (limite de tentativas e envio de
--    contato) passam a exigir um segredo que só o servidor do site conhece
--    (variável PF_SERVER_SECRET na Vercel). O banco guarda só o SHA-256 dele,
--    numa tabela fechada. Assim ninguém chama essas funções direto pela API
--    do Supabase para encher as tabelas ou fugir do limite.
-- 2. O público não insere mais direto em pf_contact_messages: só pela função
--    pf_send_contact, que limita por visitante e no total por hora.
-- 3. Privilégios enxutos: tira TRUNCATE/REFERENCES/TRIGGER e tudo o que o RLS
--    já negava, para não depender de uma camada só.
--
-- O hash do segredo NÃO fica neste arquivo (o repositório é público).
-- Para trocar o segredo: gere outro, ponha em PF_SERVER_SECRET e rode
--   update public.pf_config set v = '<sha256 hex do segredo>' where k = 'server_secret_sha256';

create table public.pf_config (k text primary key, v text not null);
alter table public.pf_config enable row level security;
revoke all on public.pf_config from anon, authenticated;
insert into public.pf_config (k, v) values ('server_secret_sha256', 'DEFINIDO-FORA-DO-REPOSITORIO');

create or replace function public.pf_check_secret(p_secret text)
returns boolean language sql stable security definer set search_path = '' as $$
  select p_secret is not null and exists (
    select 1 from public.pf_config
    where k = 'server_secret_sha256'
      and v = encode(pg_catalog.sha256(pg_catalog.convert_to(p_secret, 'UTF8')), 'hex')
  );
$$;
revoke all on function public.pf_check_secret(text) from public, anon, authenticated;

-- conta uma tentativa para a chave; false se passou do limite (uso interno)
create or replace function public.pf_take_attempt(p_key text, p_max int)
returns boolean language plpgsql security definer set search_path = '' as $$
declare recent int;
begin
  if p_key is null or char_length(p_key) <> 64 then return false; end if;
  delete from public.pf_login_attempts where created_at < now() - interval '1 day';
  select count(*) into recent from public.pf_login_attempts
    where key = p_key and created_at > now() - interval '15 minutes';
  if recent >= p_max then return false; end if;
  insert into public.pf_login_attempts (key) values (p_key);
  return true;
end; $$;
revoke all on function public.pf_take_attempt(text, int) from public, anon, authenticated;

drop function public.pf_register_login_attempt(text);
create function public.pf_register_login_attempt(p_secret text, p_key text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not public.pf_check_secret(p_secret) then return false; end if;
  return public.pf_take_attempt(p_key, 5);
end; $$;
revoke all on function public.pf_register_login_attempt(text, text) from public;
grant execute on function public.pf_register_login_attempt(text, text) to anon, authenticated;

-- contato: 3 por visitante a cada 15 min e no máximo 30 por hora no total
create or replace function public.pf_send_contact(p_secret text, p_key text, p_name text, p_email text, p_message text)
returns text language plpgsql security definer set search_path = '' as $$
begin
  if not public.pf_check_secret(p_secret) then return 'denied'; end if;
  if (select count(*) from public.pf_contact_messages where created_at > now() - interval '1 hour') >= 30 then
    return 'limit';
  end if;
  if not public.pf_take_attempt(p_key, 3) then return 'limit'; end if;
  insert into public.pf_contact_messages (name, email, message) values (p_name, p_email, p_message);
  return 'ok';
end; $$;
revoke all on function public.pf_send_contact(text, text, text, text, text) from public;
grant execute on function public.pf_send_contact(text, text, text, text, text) to anon, authenticated;

drop policy "pf qualquer um envia mensagem" on public.pf_contact_messages;
create index if not exists pf_contact_messages_created_at_idx on public.pf_contact_messages (created_at desc);

-- privilégios enxutos (o RLS continua valendo por cima)
revoke all on public.pf_projects, public.pf_posts, public.pf_site_settings, public.pf_contact_messages from anon, authenticated;
grant select on public.pf_projects, public.pf_posts, public.pf_site_settings to anon, authenticated;
grant insert, update, delete on public.pf_projects, public.pf_posts to authenticated;
grant update on public.pf_site_settings to authenticated;
grant select, delete on public.pf_contact_messages to authenticated;

-- função de gatilho não precisa ser chamável pela API
revoke all on function public.pf_touch_updated_at() from public, anon, authenticated;
