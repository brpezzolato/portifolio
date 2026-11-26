import { Preloader } from '@/components/site/preloader';
import { SiteDataProvider } from '@/components/site/site-data';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SmoothScroll } from '@/components/site/smooth-scroll';
import { getSiteData } from '@/lib/settings';

/* Site público: conteúdo editável vem do banco (com reserva em lib/site.ts). */
export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const data = await getSiteData();
  return (
    <SiteDataProvider value={data}>
      <Preloader />
      <SmoothScroll />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </SiteDataProvider>
  );
}
