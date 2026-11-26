import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { secureCookie, supabaseKey, supabaseUrl } from './env';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, { ...options, ...secureCookie }),
          );
        } catch {
          // Server Components não gravam cookie; o proxy renova a sessão.
        }
      },
    },
  });
}
