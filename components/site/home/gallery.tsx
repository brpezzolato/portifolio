'use client';

import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { site, ui } from '@/lib/site';
import { SectionTitle, wrap } from './shared';

/* Galeria de fotos (apresentações, eventos). Só aparece quando houver fotos
   em site.gallery. */
export function Gallery() {
  const { t } = useLang();
  if (site.gallery.length === 0) return null;
  return (
    <section id="galeria" className="scroll-mt-24 py-20 sm:py-28">
      <div className={wrap}>
        <Reveal>
          <SectionTitle title={t(ui.galleryTitle)} />
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.gallery.map((g, i) => (
            <li key={g.src}>
              <Reveal delay={i * 0.06}>
                <figure className="group overflow-hidden rounded-3xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={t(g.caption)} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <figcaption className="p-4 text-sm text-muted-foreground">{t(g.caption)}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
