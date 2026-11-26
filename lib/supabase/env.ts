/* As duas chaves públicas do Supabase. A publishable key vai no navegador e
   NÃO é segredo: quem protege os dados é o RLS (supabase/migrations). */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/* O site não usa Supabase no navegador, então o cookie de sessão pode ser
   httpOnly (script nenhum lê), só HTTPS e só no próprio site (strict). */
export const secureCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict' as const,
};
