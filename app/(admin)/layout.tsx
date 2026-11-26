import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: 'no-referrer',
};

/* Painel: layout próprio, sem cabeçalho/rodapé/animações do site. */
export default function AdminRoot({ children }: LayoutProps<'/'>) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
