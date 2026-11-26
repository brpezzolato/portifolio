import { createClient } from '@supabase/supabase-js';
import { supabaseConfigured, supabaseKey, supabaseUrl } from '@/lib/supabase/env';

/* Entrega o currículo como download, com nome de arquivo bonito, a partir do
   espaço de arquivos "cv" do Supabase (público, mas só o admin escreve).
   Sem currículo enviado, responde 404. */
export async function GET() {
  if (!supabaseConfigured) return new Response('Não encontrado', { status: 404 });
  const db = createClient(supabaseUrl!, supabaseKey!, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.storage.from('cv').download('curriculo.pdf');
  if (error || !data) return new Response('Não encontrado', { status: 404 });
  return new Response(data, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Bruno-Pezzolato-Curriculo.pdf"',
      'Cache-Control': 'public, max-age=0, s-maxage=300, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
