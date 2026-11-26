-- Primeiro admin automático (2026-11-26, migration "pf_admin_bootstrap").
-- Quando o usuário com o e-mail de pf_config.admin_email existe e está com o
-- e-mail confirmado, entra em pf_admins. Um cadastro com o mesmo e-mail que
-- não foi confirmado (sem acesso à caixa de entrada) não vira admin.
-- O e-mail fica fora do repositório:
--   insert into public.pf_config (k, v) values ('admin_email', '<seu e-mail>');

create or replace function public.pf_auto_admin()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) = (select lower(v) from public.pf_config where k = 'admin_email') then
    insert into public.pf_admins (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end; $$;
revoke all on function public.pf_auto_admin() from public, anon, authenticated;

create trigger pf_auto_admin after insert or update of email_confirmed_at on auth.users
  for each row execute function public.pf_auto_admin();
