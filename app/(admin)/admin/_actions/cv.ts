'use server';

import { requireAdmin } from '@/lib/admin';

export type CvState = { ok?: string; error?: string } | null;

const MAX = 4 * 1024 * 1024;

/* Grava a data do envio no conteúdo do site (o resto do conteúdo fica igual). */
async function stamp(db: Awaited<ReturnType<typeof requireAdmin>>['db'], value: string | null) {
  const { data } = await db.from('pf_site_settings').select('data').eq('id', 1).maybeSingle();
  const current = (data?.data ?? {}) as Record<string, unknown>;
  return db.from('pf_site_settings').update({ data: { ...current, cv: value } }).eq('id', 1);
}

/* Envia (ou troca) o currículo. Aceita só PDF de verdade, até 4 MB: confere o
   tipo, o tamanho e a assinatura "%PDF-" no começo do arquivo. */
export async function uploadCv(_: CvState, form: FormData): Promise<CvState> {
  const { db } = await requireAdmin();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) return { error: 'Escolha um arquivo PDF.' };
  if (file.size > MAX) return { error: 'O PDF pode ter no máximo 4 MB.' };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isPdf = bytes.length > 5 && String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-';
  if (!isPdf || (file.type && file.type !== 'application/pdf')) return { error: 'O arquivo precisa ser um PDF.' };

  const { error } = await db.storage.from('cv').upload('curriculo.pdf', bytes, {
    contentType: 'application/pdf',
    upsert: true,
    cacheControl: '300',
  });
  if (error) return { error: 'Não foi possível enviar agora. Tente de novo.' };
  const { error: e2 } = await stamp(db, new Date().toISOString());
  if (e2) return { error: 'O arquivo foi enviado, mas não deu para atualizar o site.' };
  return { ok: 'Currículo enviado. Já está disponível no site.' };
}

export async function removeCv(): Promise<CvState> {
  const { db } = await requireAdmin();
  await db.storage.from('cv').remove(['curriculo.pdf']);
  const { error } = await stamp(db, null);
  if (error) return { error: 'Não foi possível remover agora.' };
  return { ok: 'Currículo removido do site.' };
}
