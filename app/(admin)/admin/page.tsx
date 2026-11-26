import Link from 'next/link';
import { adminBase, getAuthState, requireAdmin } from '@/lib/admin';
import { EnrollForm, LoginForm, VerifyForm } from './_components/auth-flow';

/* Entrada do painel: decide a etapa (senha → autenticador → painel). */
export default async function AdminHome() {
  const state = await getAuthState();
  if (state.step === 'login') return <LoginForm />;
  if (state.step === 'enroll') return <EnrollForm />;
  if (state.step === 'verify') return <VerifyForm factorId={state.factorId} />;

  const { db } = await requireAdmin();
  const base = adminBase()!;
  const count = async (table: string) => (await db.from(table).select('*', { count: 'exact', head: true })).count ?? 0;
  const [projects, posts, messages] = await Promise.all([count('projects'), count('posts'), count('contact_messages')]);
  const cards = [
    { n: projects, label: 'Projetos', href: '/projetos' },
    { n: posts, label: 'Novidades', href: '/novidades' },
    { n: messages, label: 'Mensagens', href: '/mensagens' },
  ];
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Visão geral</h1>
      <p className="mt-1 text-muted-foreground">Tudo o que aparece no site é editado daqui.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={`${base}${c.href}`} className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-foreground/20">
            <p className="text-4xl font-semibold tracking-tight text-signal">{c.n}</p>
            <p className="mt-1 text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href={`${base}/projetos/novo`} className="rounded-3xl bg-foreground p-6 text-background transition-opacity hover:opacity-90">
          <p className="text-xl font-medium">Novo projeto</p>
          <p className="text-sm text-background/60">Cadastre e publique quando quiser.</p>
        </Link>
        <Link href={`${base}/novidades/novo`} className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-foreground/20">
          <p className="text-xl font-medium">Nova novidade</p>
          <p className="text-sm text-muted-foreground">Lançamentos, atualizações e notas.</p>
        </Link>
      </div>
    </div>
  );
}
