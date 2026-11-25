import { About } from '@/components/site/home/about';
import { Contact } from '@/components/site/home/contact';
import { Gallery } from '@/components/site/home/gallery';
import { Hero } from '@/components/site/home/hero';
import { Journey } from '@/components/site/home/journey';
import { KineticSkills } from '@/components/site/home/kinetic-skills';
import { News } from '@/components/site/home/news';
import { Projects } from '@/components/site/home/projects';
import { getPosts, getProjects } from '@/lib/content';

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  return (
    <>
      <Hero />
      <About stats={{ projects: projects.length, news: posts.length }} />
      <KineticSkills />
      <Projects projects={ordered} />
      <Journey />
      <Gallery />
      <News posts={posts.slice(0, 4)} />
      <Contact />
    </>
  );
}
