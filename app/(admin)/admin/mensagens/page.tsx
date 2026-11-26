import { Inbox, Reply } from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import { deleteMessage } from '../_actions/content';
import { ConfirmDelete } from '../_components/confirm-delete';
import { EmptyState, PageHeader } from '../_components/ui';

const time = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

/* Mensagens do formulário de contato. Texto exibido como texto (nunca HTML). */
export default async function AdminMessages() {
  const { db } = await requireAdmin();
  const { data } = await db.from('pf_contact_messages').select('id,name,email,message,created_at').order('created_at', { ascending: false }).limit(200);
  const rows = data ?? [];
  return (
    <>
      <PageHeader
        eyebrow="Geral"
        title="Mensagens"
        description={rows.length ? `${rows.length} ${rows.length === 1 ? 'mensagem' : 'mensagens'} pelo formulário de contato.` : 'O que chega pelo formulário de contato do site.'}
      />
      {rows.length === 0 ? (
        <EmptyState icon={Inbox} title="Caixa vazia" text="Quando alguém escrever pelo formulário do site, a mensagem aparece aqui." />
      ) : (
        <ul className="space-y-3">
          {rows.map((m) => (
            <li key={m.id} className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-signal/10 text-sm font-semibold text-signal uppercase">
                  {m.name.trim().slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-medium">{m.name}</p>
                    <time dateTime={m.created_at} className="text-xs text-muted-foreground">
                      {formatDate(m.created_at)} · {time(m.created_at)}
                    </time>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                  <p className="mt-4 text-[0.95rem] leading-relaxed whitespace-pre-wrap text-pretty">{m.message}</p>
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent('Re: seu contato pelo portfólio')}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm text-background transition-opacity hover:opacity-90"
                    >
                      <Reply className="size-4" /> Responder
                    </a>
                    <ConfirmDelete id={m.id} what={`mensagem de ${m.name}`} action={deleteMessage} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
