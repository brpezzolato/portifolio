import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { contentSecurityPolicy, createNonce } from '@/lib/csp';
import { supabaseConfigured, supabaseKey, supabaseUrl } from '@/lib/supabase/env';

/* Toda requisição passa aqui:
   1. CSP com nonce novo (só roda script carimbado pelo Next).
   2. /admin: sem sessão de um e-mail autorizado, a rota "não existe" (404),
      em vez de um redirecionamento que denunciaria o painel.
   O Server Component do painel confere de novo; o banco confere uma terceira
   vez (RLS). Nenhuma camada confia na anterior. */
export async function proxy(request: NextRequest) {
  const csp = contentSecurityPolicy(createNonce(), {
    supabaseUrl,
    dev: process.env.NODE_ENV === 'development',
  });
  request.headers.set('Content-Security-Policy', csp);

  const path = request.nextUrl.pathname;
  const isAdmin = path === '/admin' || path.startsWith('/admin/');
  const isLogin = path === '/admin/entrar';

  let response = NextResponse.next({ request });

  if (isAdmin) {
    let email: unknown = null;
    if (supabaseConfigured) {
      const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookies) {
            cookies.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookies.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      });
      // Verifica o JWT localmente (assinatura), sem ida ao servidor de Auth.
      const { data } = await supabase.auth.getClaims();
      email = data?.claims?.email;
    }
    const allowed = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const authorized =
      typeof email === 'string' && allowed.includes(email.toLowerCase());

    if (!authorized && !isLogin) {
      response = NextResponse.rewrite(new URL('/_nao-existe', request.url), {
        request,
        status: 404,
      });
    }
    if (authorized && isLogin) {
      response = NextResponse.redirect(new URL('/admin', request.url));
    }
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};
