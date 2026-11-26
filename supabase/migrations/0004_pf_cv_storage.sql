-- Currículo em PDF (2026-11-26, migration "pf_cv_storage").
-- Bucket público "cv" com um único arquivo, curriculo.pdf (até 4 MB, só PDF).
-- Só o admin com dois fatores envia, troca ou apaga. O site entrega o arquivo
-- pela rota /curriculo, já com nome de download.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cv', 'cv', true, 4194304, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 4194304, allowed_mime_types = array['application/pdf'];

create policy "pf admin lê o cv" on storage.objects for select to authenticated
  using (bucket_id = 'cv' and (select public.pf_is_admin()));
create policy "pf admin envia o cv" on storage.objects for insert to authenticated
  with check (bucket_id = 'cv' and name = 'curriculo.pdf' and (select public.pf_is_admin()));
create policy "pf admin troca o cv" on storage.objects for update to authenticated
  using (bucket_id = 'cv' and (select public.pf_is_admin()))
  with check (bucket_id = 'cv' and name = 'curriculo.pdf' and (select public.pf_is_admin()));
create policy "pf admin apaga o cv" on storage.objects for delete to authenticated
  using (bucket_id = 'cv' and (select public.pf_is_admin()));
