/*
 * Política de conteúdo das páginas (Content-Security-Policy), montada a cada
 * pedido no proxy com um nonce novo: só roda script que o Next carimbou com
 * ele (`strict-dynamic` deixa esses scripts carregarem os pedaços do app).
 * Estilo segue com 'unsafe-inline' porque o Motion anima via `style`,
 * que nonce não cobre.
 */

/** Nonce de uso único, em base64. */
export function createNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

export function contentSecurityPolicy(nonce: string, { dev }: { dev: boolean }) {
  // Tudo passa pelo servidor do site: o navegador não fala com o Supabase.
  const connect = ["'self'"];
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connect.join(' ')}`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(dev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}
