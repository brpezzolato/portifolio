import 'server-only';
import { notFound } from 'next/navigation';
import { supabaseConfigured } from './supabase/env';
import { createClient } from './supabase/server';

/* Regras do painel, verificadas no servidor a cada página e a cada ação.
   Três barreiras independentes:
   1. rota escondida (proxy.ts) — sem ela, /admin responde 404;
   2. aqui: e-mail na lista ADMIN_EMAILS + sessão de dois fatores (aal2);
   3. no banco: RLS com is_admin() (tabela admins + aal2). */

export function adminBase(): string | null {
  const p = process.env.ADMIN_PATH ?? '';
  return /^[a-z0-9-]{16,64}$/.test(p) ? `/${p}` : null;
}

export function isAdminEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export type AuthState =
  | { step: 'login' }
  | { step: 'enroll' } // senha ok, ainda sem autenticador cadastrado
  | { step: 'verify'; factorId: string } // senha ok, falta o código
  | { step: 'admin'; email: string };

export async function getAuthState(): Promise<AuthState> {
  if (!supabaseConfigured || !adminBase()) notFound();
  const db = await createClient();
  const { data } = await db.auth.getClaims();
  const claims = data?.claims;
  if (!claims || !isAdminEmail(claims.email)) return { step: 'login' };
  if (claims.aal === 'aal2') return { step: 'admin', email: String(claims.email) };
  const { data: factors } = await db.auth.mfa.listFactors();
  const totp = factors?.totp?.find((f) => f.status === 'verified');
  return totp ? { step: 'verify', factorId: totp.id } : { step: 'enroll' };
}

/* Para páginas e ações do painel: só passa admin com aal2. */
export async function requireAdmin() {
  const state = await getAuthState();
  if (state.step !== 'admin') notFound();
  return { db: await createClient(), email: state.email };
}
