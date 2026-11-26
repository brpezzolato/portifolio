import { adminBase, getAuthState, requireAdmin } from '@/lib/admin';
import { AdminShell } from './_components/shell';

/* Moldura do painel. Só aparece para admin com dois fatores; antes disso,
   a página mostra apenas o fluxo de entrada. */
export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const state = await getAuthState();
  if (state.step !== 'admin') return <>{children}</>;
  const { db } = await requireAdmin();
  const { count } = await db.from('pf_contact_messages').select('*', { count: 'exact', head: true });
  return (
    <AdminShell base={adminBase()!} email={state.email} messages={count ?? 0}>
      {children}
    </AdminShell>
  );
}
