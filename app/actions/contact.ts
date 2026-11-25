'use server';

import { z } from 'zod';
import { supabaseConfigured } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

export type ContactState = { status: 'idle' | 'ok' | 'invalid' | 'fail' };

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0), // armadilha: humanos não veem este campo
});

/* Grava a mensagem no Supabase. O público só pode INSERIR na tabela
   (supabase/migrations/0002), nunca ler: quem lê é você, pelo painel. */
export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: form.get('name'),
    email: form.get('email'),
    message: form.get('message'),
    website: form.get('website') ?? '',
  });
  if (!parsed.success) {
    // robô que preencheu a armadilha recebe "ok" e é ignorado
    if (form.get('website')) return { status: 'ok' };
    return { status: 'invalid' };
  }
  if (!supabaseConfigured) return { status: 'fail' };
  const db = await createClient();
  const { website: _hp, ...row } = parsed.data;
  void _hp;
  const { error } = await db.from('contact_messages').insert(row);
  return { status: error ? 'fail' : 'ok' };
}
