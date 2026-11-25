import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { site } from '@/lib/site';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#030303',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description: site.intro,
  openGraph: { type: 'website', title: site.name, description: site.intro },
  formatDetection: { telephone: false },
};

/* O nonce da CSP (proxy.ts) muda a cada pedido: a página é montada no pedido,
   senão uma casca estática sairia com os scripts bloqueados. */
export const instant = false;

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  await connection();
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh overflow-x-clip font-sans antialiased`}
      >
        <div aria-hidden className="site-backdrop" />
        <div aria-hidden className="site-grain" />
        <TooltipProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl px-5 pt-28 pb-24 sm:px-8">
            {children}
          </main>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
