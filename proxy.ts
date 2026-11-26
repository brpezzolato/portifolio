import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { contentSecurityPolicy, createNonce } from '@/lib/csp';
import { supabaseConfigured, supabaseKey, supabaseUrl } from '@/lib/supabase/env';

/* Toda requisição passa aqui:
   1. CSP com nonce novo (só roda script carimbado pelo Next).
   2. Painel em rota escondida: o endereço secreto (ADMIN_PATH, só no
      servidor) é reescrito internamente para /admin. Quem acessa /admin
      direto, ou qualquer outro caminho, recebe 404 — o painel "não existe".
      Sem ADMIN_PATH configurado, o painel fica desligado.
   3. Nas rotas do painel: sessão do Supabase renovada, nada em cache e
      nada indexado. Quem decide se a pessoa entra é o servidor (lib/admin.ts)
      e o banco (RLS); esta camada só esconde. */

const ADMIN_PATH = process.env.ADMIN_PATH ?? '';
const adminEnabled = /^[a-z0-9-]{16,64}$/.test(ADMIN_PATH);

function hidden(request: NextRequest, csp: string) {
  const res = NextResponse.rewrite(new URL('/_nao-existe', request.url), { request, status: 404 });
  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export async function proxy(request: NextRequest) {
  const csp = contentSecurityPolicy(createNonce(), {
    supabaseUrl,
    dev: process.env.NODE_ENV === 'development',
  });
  request.headers.set('Content-Security-Policy', csp);

  const path = request.nextUrl.pathname;

  // /admin direto nunca abre
  if (path === '/admin' || path.startsWith('/admin/')) return hidden(request, csp);

  const secret = adminEnabled && (path === `/${ADMIN_PATH}` || path.startsWith(`/${ADMIN_PATH}/`));
  if (!secret) {
    const res = NextResponse.next({ request });
    res.headers.set('Content-Security-Policy', csp);
    return res;
  }

  // rota secreta → /admin interno
  const target = request.nextUrl.clone();
  target.pathname = '/admin' + path.slice(ADMIN_PATH.length + 1);
  let response = NextResponse.rewrite(target, { request });

  if (supabaseConfigured) {
    const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookies) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.rewrite(target, { request });
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, { ...options, sameSite: 'strict', secure: process.env.NODE_ENV !== 'development' }),
          );
        },
      },
    });
    // renova a sessão (verifica o JWT localmente)
    await supabase.auth.getClaims();
  }

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};
