import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FileText, FolderKanban, LogOut, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isAdminEmail } from '@/lib/admin';
import { getPosts, getProjects } from '@/lib/content';
import { formatShortDate } from '@/lib/format';
import { supabaseConfigured } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';
import { signOut } from './actions';

export const metadata: Metadata = {
  title: 'Painel',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Segunda barreira (a primeira é o proxy.ts; a terceira, o RLS).
  if (!supabaseConfigured) notFound();
  const { data } = await (await createClient()).auth.getClaims();
  if (!isAdminEmail(data?.claims?.email)) notFound();

  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  return (
    <div className="pt-6">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Painel</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Publicar</h1>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="pill" type="submit">
            <LogOut data-icon="inline-start" /> Sair
          </Button>
        </form>
      </div>
      <Tabs defaultValue="novidades">
        <TabsList>
          <TabsTrigger value="novidades"><FileText /> Novidades</TabsTrigger>
          <TabsTrigger value="projetos"><FolderKanban /> Projetos</TabsTrigger>
        </TabsList>
        <TabsContent value="novidades" className="mt-6 space-y-3">
          <Button variant="default" size="pill"><Plus data-icon="inline-start" /> Nova novidade</Button>
          {posts.map((p) => (
            <Card key={p.slug} size="sm">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription className="font-mono text-xs">{formatShortDate(p.publishedAt)} · /{p.slug}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="projetos" className="mt-6 space-y-3">
          <Button variant="default" size="pill"><Plus data-icon="inline-start" /> Novo projeto</Button>
          {projects.map((p) => (
            <Card key={p.slug} size="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{p.title} {p.featured && <Badge variant="mono">destaque</Badge>}</CardTitle>
                <CardDescription className="font-mono text-xs">{p.year} · /{p.slug}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
