import 'server-only';

/* Quem pode entrar no painel: e-mails em ADMIN_EMAILS (separados por vírgula).
   É só a primeira barreira — a do banco é a tabela `admins` + RLS. */
export function isAdminEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
