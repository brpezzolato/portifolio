import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import { deleteMessage } from '../_actions/content';

/* Mensagens do formulário de contato. Texto exibido como texto (nunca HTML). */
export default async function AdminMessages() {
  const { db } = await requireAdmin();
  const { data } = await db.from('contact_messages').select('id,name,email,message,created_at').order('created_at', { ascending: false }).limit(200);
  const rows = data ?? [];
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Mensagens</h1>
      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">Nenhuma mensagem ainda.</p>
      ) : (
        <ul className="grid gap-4">
          {rows.map((m) => (
            <li key={m.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-signal hover:underline">{m.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <time className="text-sm text-muted-foreground">{formatDate(m.created_at)}</time>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <Button type="submit" variant="ghost" size="icon" aria-label="Apagar mensagem">
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-pretty">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
