import { LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import { signOut } from '../_actions/auth';

export default async function AdminSecurity() {
  const { db, email } = await requireAdmin();
  const { data } = await db.auth.mfa.listFactors();
  const factors = data?.totp ?? [];
  const rows = [
    ['Rota do painel', 'Escondida (variável ADMIN_PATH). /admin responde 404.'],
    ['Conta', email],
    ['Dois fatores', factors.length ? `Ativo desde ${formatDate(factors[0].created_at)}` : 'Não configurado'],
    ['Banco de dados', 'RLS em todas as tabelas; escrita só com sessão de dois fatores.'],
    ['Tentativas de login', 'Máximo de 5 a cada 15 minutos por endereço.'],
  ];
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Segurança</h1>
      <ul className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
        {rows.map(([k, v]) => (
          <li key={k} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">{k}</span>
            <span className="flex items-center gap-2 text-sm sm:text-right">
              {k === 'Dois fatores' && <ShieldCheck className="size-4 text-signal" />}
              {v}
            </span>
          </li>
        ))}
      </ul>
      <form action={signOut} className="mt-6">
        <Button type="submit" variant="outline" size="pill" className="h-11 px-6">
          <LogOut data-icon="inline-start" /> Sair de todas as sessões
        </Button>
      </form>
    </div>
  );
}
