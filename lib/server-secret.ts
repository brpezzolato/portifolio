import 'server-only';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

/* Segredo que só o servidor do site conhece (PF_SERVER_SECRET, na Vercel).
   As funções públicas do banco (limite de tentativas e envio de contato)
   recusam qualquer chamada sem ele, então ninguém as usa direto pela API do
   Supabase. O banco guarda só o SHA-256 (tabela pf_config). */
export function serverSecret(): string | null {
  const s = process.env.PF_SERVER_SECRET ?? '';
  return s.length >= 32 ? s : null;
}

/* IP do visitante. Na Vercel, x-real-ip e x-forwarded-for são gravados
   pela própria plataforma (o valor mandado pelo navegador é descartado). */
async function clientIp() {
  const h = await headers();
  return h.get('x-real-ip') || (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'desconhecido';
}

/* Chave do limitador: hash do escopo + IP + segredo (o IP nunca vai em claro
   para o banco, e sem o segredo não dá para calcular a chave de ninguém). */
export async function attemptKey(scope: string) {
  return createHash('sha256').update(`${scope}|${await clientIp()}|${serverSecret() ?? ''}`).digest('hex');
}
