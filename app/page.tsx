import { About } from '@/components/site/home/about';
import { Contact } from '@/components/site/home/contact';
import { Gallery } from '@/components/site/home/gallery';
import { Hero } from '@/components/site/home/hero';
import { Journey } from '@/components/site/home/journey';
import { News } from '@/components/site/home/news';
import { Projects } from '@/components/site/home/projects';
import { getPosts, getProjects } from '@/lib/content';

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  // destaques primeiro, completando até 3 para a grade não ficar com buraco
  const top = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 3);
  return (
    <>
      <Hero stats={{ projects: projects.length, news: posts.length }} />
      <About />
      <Projects projects={top} />
      <Journey />
      <Gallery />
      <News posts={posts.slice(0, 3)} />
      <Contact />
    </>
  );
}
