import Link from 'next/link';
import { AiOrb } from '@/components/site/ai-orb';
import { PostList, ProjectList } from '@/components/site/lists';
import { NiceLink } from '@/components/site/nice-link';
import { Reveal } from '@/components/site/reveal';
import { ScrollWords } from '@/components/site/scroll-words';
import { TypeLines } from '@/components/site/type-lines';
import { getPosts, getProjects } from '@/lib/content';
import { site } from '@/lib/site';

function Block({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="py-16 sm:py-20">
      <Reveal className="mb-6 flex items-baseline justify-between">
        <h2 className="text-sm text-muted-foreground">{title}</h2>
        {href && (
          <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Ver tudo
          </Link>
        )}
      </Reveal>
      {children}
    </section>
  );
}

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts(3)]);

  return (
    <>
      {/* Herói: a orbe ao centro; nome e uma frase digitada embaixo dela */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-16 text-center">
        <AiOrb className="relative aspect-square w-[min(72vw,46svh)]" />
        <div className="-mt-[min(8vw,5svh)]">
          <Reveal delay={0.1}>
            <p className="text-sm text-muted-foreground">{site.name}</p>
          </Reveal>
          <h1 className="mt-3 text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.05] font-medium tracking-[-0.04em]">
            <TypeLines lines={[site.tagline]} speed={60} />
          </h1>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-5 max-w-md text-muted-foreground">{site.short}</p>
          </Reveal>
        </div>
        <span
          aria-hidden
          className="absolute bottom-8 left-1/2 h-10 w-px -translate-x-1/2 overflow-hidden bg-border after:absolute after:inset-x-0 after:top-0 after:h-1/2 after:animate-[drip_2.2s_ease-in-out_infinite] after:bg-foreground"
        />
      </section>

      <div className="mx-auto max-w-2xl px-5">
        <Block title="Sobre">
          <ScrollWords
            text={site.manifesto}
            className="text-[clamp(1.4rem,3.2vw,2rem)] leading-[1.3] font-medium tracking-[-0.025em]"
          />
        </Block>

        <Block title="Projetos" href="/projetos">
          <ProjectList projects={projects} />
        </Block>

        <Block title="Novidades" href="/novidades">
          <PostList posts={posts} />
        </Block>

        <Block title="Contato">
          <Reveal>
            <p className="text-[clamp(1.4rem,3.2vw,2rem)] leading-[1.3] font-medium tracking-[-0.025em]">
              Quer conversar sobre dados, IA ou um projeto?{' '}
              <NiceLink href={`mailto:${site.email}`} className="text-signal">
                Escreva para mim.
              </NiceLink>
            </p>
            <ul className="mt-8 flex gap-6 text-sm text-muted-foreground">
              <li>
                <NiceLink href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </NiceLink>
              </li>
              {site.links.map((l) => (
                <li key={l.href}>
                  <NiceLink href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                    {l.label}
                  </NiceLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </Block>
      </div>
    </>
  );
}
