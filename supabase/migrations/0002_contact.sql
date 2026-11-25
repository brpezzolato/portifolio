-- Mensagens do formulário de contato.
-- Público: só INSERE (com limites de tamanho). Ninguém lê pela API, exceto admin.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "qualquer um envia mensagem" on public.contact_messages
  for insert to anon, authenticated
  with check (true);

create policy "admin lê mensagens" on public.contact_messages
  for select to authenticated
  using ((select public.is_admin()));

create policy "admin apaga mensagens" on public.contact_messages
  for delete to authenticated
  using ((select public.is_admin()));

revoke update on public.contact_messages from anon, authenticated;
