'use server';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { adminBase, isAdminEmail } from '@/lib/admin';
import { supabaseConfigured } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

const GENERIC = 'Não foi possível entrar.';

/* Chave do limitador: hash do IP + segredo da rota (nunca o IP em claro). */
async function attemptKey(scope: string) {
  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'desconhecido';
  return createHash('sha256').update(`${scope}|${ip}|${process.env.ADMIN_PATH ?? ''}`).digest('hex');
}

async function allowAttempt(scope: string) {
  const db = await createClient();
  const { data, error } = await db.rpc('register_login_attempt', { p_key: await attemptKey(scope) });
  return !error && data === true;
}

function base() {
  const b = adminBase();
  if (!b || !supabaseConfigured) redirect('/');
  return b;
}

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(12).max(128),
});

export async function signIn(_: string | null, form: FormData): Promise<string | null> {
  const b = base();
  if (!(await allowAttempt('login'))) return 'Muitas tentativas. Aguarde 15 minutos.';
  const parsed = loginSchema.safeParse({ email: form.get('email'), password: form.get('password') });
  if (!parsed.success || !isAdminEmail(parsed.data.email)) return GENERIC;
  const db = await createClient();
  const { error } = await db.auth.signInWithPassword(parsed.data);
  if (error) return GENERIC;
  redirect(b);
}

/* Começa o cadastro do autenticador: devolve o QR code e a chave. */
export async function startEnroll(): Promise<{ factorId: string; qr: string; secret: string } | { error: string }> {
  base();
  const db = await createClient();
  const { data: claims } = await db.auth.getClaims();
  if (!claims?.claims || !isAdminEmail(claims.claims.email)) return { error: GENERIC };
  // limpa tentativas de cadastro anteriores que não foram confirmadas
  const { data: list } = await db.auth.mfa.listFactors();
  const verified = list?.totp?.some((f) => f.status === 'verified');
  if (verified) return { error: 'Já existe um autenticador cadastrado.' };
  for (const f of list?.all ?? []) if (f.status !== 'verified') await db.auth.mfa.unenroll({ factorId: f.id });
  const { data, error } = await db.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Portfólio ${Date.now()}` });
  if (error || !data) return { error: 'Não foi possível iniciar o cadastro.' };
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
}

const codeSchema = z.object({ factorId: z.string().min(1).max(64), code: z.string().regex(/^\d{6}$/) });

export async function verifyCode(_: string | null, form: FormData): Promise<string | null> {
  const b = base();
  if (!(await allowAttempt('mfa'))) return 'Muitas tentativas. Aguarde 15 minutos.';
  const parsed = codeSchema.safeParse({ factorId: form.get('factorId'), code: String(form.get('code') ?? '').replace(/\s/g, '') });
  if (!parsed.success) return 'Código inválido.';
  const db = await createClient();
  const { data: claims } = await db.auth.getClaims();
  if (!claims?.claims || !isAdminEmail(claims.claims.email)) return GENERIC;
  const { error } = await db.auth.mfa.challengeAndVerify(parsed.data);
  if (error) return 'Código inválido.';
  redirect(b);
}

/* Sai de todas as sessões, em todos os aparelhos. */
export async function signOut() {
  if (supabaseConfigured) await (await createClient()).auth.signOut({ scope: 'global' });
  redirect('/');
}
