import { CheckCircle2, CircleAlert, KeyRound, LogOut, Lock, Route, ShieldCheck, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import { signOut } from '../_actions/auth';
import { PageHeader } from '../_components/ui';

export default async function AdminSecurity() {
  const { db, email } = await requireAdmin();
  const { data } = await db.auth.mfa.listFactors();
  const factor = data?.totp?.find((f) => f.status === 'verified');

  const checks = [
    { icon: Route, title: 'Endereço escondido', text: 'O painel só abre no endereço secreto. /admin responde 404.' },
    { icon: KeyRound, title: 'Senha + código', text: factor ? `Autenticador ativo desde ${formatDate(factor.created_at)}.` : 'Autenticador ainda não cadastrado.', warn: !factor },
    { icon: Lock, title: 'Banco protegido', text: 'Regras de acesso em todas as tabelas: escrever só com sessão de dois fatores.' },
    { icon: Timer, title: 'Limite de tentativas', text: '5 tentativas de login a cada 15 minutos por endereço.' },
    { icon: ShieldCheck, title: 'Contato com limite', text: '3 mensagens por visitante a cada 15 minutos e 30 por hora no total.' },
    { icon: Lock, title: 'Sessão blindada', text: 'Cookie inacessível a scripts, só HTTPS e só neste site.' },
  ];

  return (
    <>
      <PageHeader eyebrow="Conta" title="Segurança" description="Como o painel está protegido e o controle das suas sessões." />

      <div className="grid gap-3 sm:grid-cols-2">
        {checks.map((c) => (
          <div key={c.title} className="flex gap-4 rounded-3xl border border-border bg-card p-5">
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${c.warn ? 'bg-destructive/10 text-destructive' : 'bg-signal/10 text-signal'}`}>
              <c.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-medium">
                {c.title}
                {c.warn ? <CircleAlert className="size-4 text-destructive" /> : <CheckCircle2 className="size-4 text-signal" />}
              </p>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Sessões</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Conectado como <span className="text-foreground">{email}</span>. Sair encerra o acesso em todos os aparelhos.
          </p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="pill" className="h-11 px-5">
            <LogOut data-icon="inline-start" /> Sair de todas as sessões
          </Button>
        </form>
      </section>
    </>
  );
}
