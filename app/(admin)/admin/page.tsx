import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Circle, FileBadge, FileText, FolderKanban, Inbox, Plus } from 'lucide-react';
import { adminBase, getAuthState, requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import { getSiteData } from '@/lib/settings';
import { EnrollForm, LoginForm, VerifyForm } from './_components/auth-flow';
import { StatusPill } from './_components/ui';

const greeting = () => {
  const h = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Sao_Paulo' }));
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
};

/* Entrada do painel: decide a etapa (senha → autenticador → painel). */
export default async function AdminHome() {
  const state = await getAuthState();
  if (state.step === 'login') return <LoginForm />;
  if (state.step === 'enroll') return <EnrollForm />;
  if (state.step === 'verify') return <VerifyForm factorId={state.factorId} />;

  const { db } = await requireAdmin();
  const base = adminBase()!;
  const [{ data: projects }, { data: posts }, { data: messages, count: msgCount }, site] = await Promise.all([
    db.from('pf_projects').select('id,title,published,updated_at').order('updated_at', { ascending: false }),
    db.from('pf_posts').select('id,title,published,published_at').order('published_at', { ascending: false }),
    db.from('pf_contact_messages').select('id,name,message,created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(3),
    getSiteData(),
  ]);
  const p = projects ?? [];
  const n = posts ?? [];

  const stats = [
    { label: 'Projetos', value: p.length, sub: `${p.filter((x) => x.published).length} publicados`, href: '/projetos', icon: FolderKanban },
    { label: 'Novidades', value: n.length, sub: `${n.filter((x) => x.published).length} publicadas`, href: '/novidades', icon: FileText },
    { label: 'Mensagens', value: msgCount ?? 0, sub: 'pelo formulário', href: '/mensagens', icon: Inbox },
    { label: 'Currículo', value: site.cv ? 'No ar' : '—', sub: site.cv ? `desde ${formatDate(site.cv)}` : 'não enviado', href: '/curriculo', icon: FileBadge },
  ];

  const todo = [
    { done: !site.email.includes('exemplo.com'), label: 'Colocar seu e-mail de contato', href: '/conteudo' },
    { done: !site.links.some((l) => l.href.includes('seu-usuario')), label: 'Colocar o link do seu LinkedIn', href: '/conteudo' },
    { done: Boolean(site.cv), label: 'Enviar o currículo em PDF', href: '/curriculo' },
    { done: p.some((x) => x.published), label: 'Publicar pelo menos um projeto', href: '/projetos' },
  ];
  const pending = todo.filter((t) => !t.done).length;

  return (
    <>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-signal" />
            Visão geral
          </p>
          <h1 className="text-[clamp(1.9rem,3.5vw,2.6rem)] leading-none font-semibold tracking-[-0.04em]">{greeting()}, Bruno.</h1>
          <p className="mt-3 text-muted-foreground">Tudo o que aparece no site é editado daqui.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm transition-colors hover:bg-muted"
        >
          Abrir o site <ArrowUpRight className="size-4" />
        </a>
      </header>

      {/* números */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={`${base}${s.href}`} className="group rounded-3xl border border-border bg-card p-5 transition-colors hover:border-foreground/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-muted-foreground transition-colors group-hover:text-signal" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* ações rápidas */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Link href={`${base}/projetos/novo`} className="group relative overflow-hidden rounded-3xl bg-foreground p-6 text-background">
          <span aria-hidden className="absolute -top-12 -right-12 size-40 rounded-full bg-signal/40 blur-3xl" />
          <span className="relative flex items-center justify-between">
            <span>
              <span className="block text-lg font-medium">Novo projeto</span>
              <span className="block text-sm text-background/60">Cadastre e publique quando quiser.</span>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-background/10 transition-transform group-hover:rotate-90">
              <Plus className="size-5" />
            </span>
          </span>
        </Link>
        <Link href={`${base}/novidades/novo`} className="group rounded-3xl border border-border bg-card p-6 transition-colors hover:border-foreground/20">
          <span className="flex items-center justify-between">
            <span>
              <span className="block text-lg font-medium">Nova novidade</span>
              <span className="block text-sm text-muted-foreground">Lançamentos, atualizações e notas.</span>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-muted transition-transform group-hover:rotate-90">
              <Plus className="size-5" />
            </span>
          </span>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          {/* mensagens recentes */}
          <section className="rounded-3xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-semibold tracking-tight">Mensagens recentes</h2>
              <Link href={`${base}/mensagens`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                Ver todas <ArrowRight className="size-3.5" />
              </Link>
            </div>
            {(messages ?? []).length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
            ) : (
              <ul className="divide-y divide-border">
                {(messages ?? []).map((m) => (
                  <li key={m.id} className="flex gap-3 px-6 py-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-signal/10 text-xs font-semibold text-signal uppercase">
                      {m.name.trim().slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{m.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{m.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* últimas novidades */}
          <section className="rounded-3xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-semibold tracking-tight">Últimas novidades</h2>
              <Link href={`${base}/novidades`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                Ver todas <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {n.slice(0, 4).map((x) => (
                <li key={x.id}>
                  <Link href={`${base}/novidades/${x.id}`} className="group flex items-center gap-3 px-6 py-3.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium group-hover:text-signal">{x.title}</span>
                      <span className="block text-xs text-muted-foreground">{formatDate(x.published_at)}</span>
                    </span>
                    <StatusPill published={x.published} />
                  </Link>
                </li>
              ))}
              {n.length === 0 && <li className="px-6 py-8 text-sm text-muted-foreground">Nenhuma novidade ainda.</li>}
            </ul>
          </section>
        </div>

        {/* pendências */}
        <aside className="self-start rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">Para deixar pronto</h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {todo.length - pending}/{todo.length}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-signal transition-[width]" style={{ width: `${((todo.length - pending) / todo.length) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-1">
            {todo.map((t) => (
              <li key={t.label}>
                <Link
                  href={`${base}${t.href}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-muted"
                >
                  {t.done ? <CheckCircle2 className="size-4 shrink-0 text-signal" /> : <Circle className="size-4 shrink-0 text-muted-foreground" />}
                  <span className={t.done ? 'text-muted-foreground line-through' : ''}>{t.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {pending === 0 && <p className="mt-3 text-sm text-signal">Tudo pronto.</p>}
        </aside>
      </div>
    </>
  );
}
