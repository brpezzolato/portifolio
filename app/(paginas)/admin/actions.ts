'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { isAdminEmail } from '@/lib/admin';
import { supabaseConfigured } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  email: z.email().max(254),
  password: z.string().min(12).max(128),
});

// Mensagem única para qualquer falha: não revela se o e-mail existe.
const GENERIC = 'Não foi possível entrar.';

export async function signIn(_: string | null, form: FormData) {
  if (!supabaseConfigured) return 'Supabase ainda não configurado (.env.local).';
  const parsed = schema.safeParse({
    email: form.get('email'),
    password: form.get('password'),
  });
  if (!parsed.success || !isAdminEmail(parsed.data.email)) return GENERIC;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return GENERIC;
  redirect('/admin');
}

export async function signOut() {
  if (supabaseConfigured) await (await createClient()).auth.signOut();
  redirect('/');
}
