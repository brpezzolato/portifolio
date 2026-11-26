import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import { headers } from 'next/headers';
import { Providers } from '@/components/site/providers';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { TooltipProvider } from '@/components/ui/tooltip';
import { site } from '@/lib/site';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f6' },
    { media: '(prefers-color-scheme: dark)', color: '#030303' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Ciência de Dados`, template: `%s · ${site.name}` },
  description: site.intro.pt,
  openGraph: { type: 'website', title: site.name, description: site.intro.pt },
  formatDetection: { telephone: false },
};

/* O nonce da CSP (proxy.ts) muda a cada pedido: a página é montada no pedido,
   senão uma casca estática sairia com os scripts bloqueados. */
export const instant = false;

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  await connection();
  // nonce da CSP (proxy.ts), repassado ao script do tema (next-themes)
  const csp = (await headers()).get('content-security-policy') ?? '';
  const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh overflow-x-clip font-sans antialiased`}
      >
        <div aria-hidden className="site-backdrop" />
        <div aria-hidden className="site-grain" />
        <Providers nonce={nonce}>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
