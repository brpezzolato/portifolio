'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { adminBase, requireAdmin } from '@/lib/admin';
import { translate, type Target } from '@/lib/translate';

/* Todas as ações reverificam o admin (aal2) e usam o cliente da sessão:
   o banco aplica o RLS de novo. Nada usa a service_role. */

/* filled: campos traduzidos automaticamente (nome do campo → texto), para o
   painel mostrar na tela sem recarregar. */
export type FormState = { ok?: string; error?: string; filled?: Record<string, string> } | null;

const slug = z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug: só letras minúsculas, números e hífens.');
const httpsUrl = z
  .string()
  .trim()
  .max(500)
  .transform((v) => v || null)
  .refine((v) => v === null || /^https:\/\//.test(v), 'Links precisam começar com https://');
const bool = (v: FormDataEntryValue | null) => v === 'on' || v === 'true';
const go = (path: string): never => redirect(`${adminBase()}${path}`);
const message = (e: z.ZodError) => e.issues[0]?.message ?? 'Confira os campos.';

/* ---------- projetos ---------- */
const projectSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().max(400),
  body: z.string().max(50000),
  year: z.coerce.number().int().min(2000).max(2100),
  status: z.enum(['em-producao', 'em-construcao', 'arquivado']),
  stack: z.string().max(400).transform((v) => v.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 20)),
  url: httpsUrl,
  repo: httpsUrl,
  featured: z.boolean(),
  published: z.boolean(),
});

export async function saveProject(_: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const id = String(form.get('id') ?? '');
  const parsed = projectSchema.safeParse({
    slug: form.get('slug'),
    title: form.get('title'),
    summary: form.get('summary') ?? '',
    body: form.get('body') ?? '',
    year: form.get('year'),
    status: form.get('status'),
    stack: form.get('stack') ?? '',
    url: form.get('url') ?? '',
    repo: form.get('repo') ?? '',
    featured: bool(form.get('featured')),
    published: bool(form.get('published')),
  });
  if (!parsed.success) return { error: message(parsed.error) };
  const q = id ? db.from('pf_projects').update(parsed.data).eq('id', id) : db.from('pf_projects').insert(parsed.data);
  const { error } = await q;
  if (error) return { error: error.code === '23505' ? 'Já existe um projeto com esse slug.' : 'Não foi possível salvar.' };
  go('/projetos');
  return null;
}

export async function deleteProject(form: FormData) {
  const { db } = await requireAdmin();
  const id = z.uuid().safeParse(form.get('id'));
  if (id.success) await db.from('pf_projects').delete().eq('id', id.data);
  go('/projetos');
}

/* ---------- novidades ---------- */
const postSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(160),
  excerpt: z.string().trim().max(400),
  body: z.string().max(50000),
  kind: z.enum(['lancamento', 'atualizacao', 'nota']),
  project_slug: z.string().trim().max(80).transform((v) => (v && v !== 'nenhum' ? v : null)),
  published: z.boolean(),
  published_at: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data no formato DD/MM/AAAA.')
    .transform((v) => {
      const [d, m, y] = v.split('/').map(Number);
      return new Date(Date.UTC(y, m - 1, d, 12)).toISOString();
    }),
});

export async function savePost(_: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const id = String(form.get('id') ?? '');
  const parsed = postSchema.safeParse({
    slug: form.get('slug'),
    title: form.get('title'),
    excerpt: form.get('excerpt') ?? '',
    body: form.get('body') ?? '',
    kind: form.get('kind'),
    project_slug: form.get('project_slug') ?? '',
    published: bool(form.get('published')),
    published_at: form.get('published_at'),
  });
  if (!parsed.success) return { error: message(parsed.error) };
  const q = id ? db.from('pf_posts').update(parsed.data).eq('id', id) : db.from('pf_posts').insert(parsed.data);
  const { error } = await q;
  if (error) return { error: error.code === '23505' ? 'Já existe uma novidade com esse slug.' : 'Não foi possível salvar.' };
  go('/novidades');
  return null;
}

export async function deletePost(form: FormData) {
  const { db } = await requireAdmin();
  const id = z.uuid().safeParse(form.get('id'));
  if (id.success) await db.from('pf_posts').delete().eq('id', id.data);
  go('/novidades');
}

/* ---------- mensagens ---------- */
export async function deleteMessage(form: FormData) {
  const { db } = await requireAdmin();
  const id = z.uuid().safeParse(form.get('id'));
  if (id.success) await db.from('pf_contact_messages').delete().eq('id', id.data);
  go('/mensagens');
}

/* ---------- conteúdo do site ---------- */
const t = z.object({ pt: z.string().trim().max(1200), en: z.string().trim().max(1200), es: z.string().trim().max(1200).default('') });
const settingsSchema = z.object({
  email: z.union([z.literal(''), z.email('E-mail inválido. Confira o endereço.').max(254)]),
  github: httpsUrl,
  linkedin: httpsUrl,
  status: t,
  tagline: t,
  hook: t,
  short: t,
  intro: t,
  bio: t,
  stack: z.string().max(600),
  chips: z.array(t).max(6),
  skills: z.array(z.object({ title: t, detail: t })).max(8),
  journey: z.array(z.object({ title: t, org: t, kind: t, text: t })).max(60),
  auto_translate: z.string().optional(),
});

/* Monta objeto aninhado a partir de nomes como "skills.0.title.pt". */
function nested(form: FormData) {
  const root: Record<string, unknown> = {};
  for (const [key, raw] of form.entries()) {
    if (key.startsWith('$') || typeof raw !== 'string') continue;
    const parts = key.split('.');
    let node: Record<string, unknown> | unknown[] = root;
    parts.forEach((p, i) => {
      const last = i === parts.length - 1;
      const nextIsIndex = /^\d+$/.test(parts[i + 1] ?? '');
      const k: string | number = /^\d+$/.test(p) ? Number(p) : p;
      const holder = node as Record<string | number, unknown>;
      if (last) holder[k] = raw;
      else {
        holder[k] ??= nextIsIndex ? [] : {};
        node = holder[k] as Record<string, unknown>;
      }
    });
  }
  return root;
}

const filled = (o: { pt: string; en: string; es?: string }) => o.pt !== '' || o.en !== '' || !!o.es;

type Text = { pt: string; en: string; es: string };
const get = (obj: unknown, path: (string | number)[]): unknown =>
  path.reduce<unknown>((n, k) => (n && typeof n === 'object' ? (n as Record<string | number, unknown>)[k] : undefined), obj);

/* Traduz automaticamente do português para inglês e espanhol, campo a campo.
   Traduz quando o idioma está vazio, ou quando o português mudou desde o
   último salvamento e aquele idioma não foi mexido à mão. O que você
   escreveu manualmente em EN/ES nunca é sobrescrito. */
async function autoTranslate(d: Record<string, unknown>, prev: unknown) {
  const jobs: { name: string; text: Text; target: Target; pt: string }[] = [];
  const visit = (node: unknown, path: (string | number)[]) => {
    if (Array.isArray(node)) return node.forEach((v, i) => visit(v, [...path, i]));
    if (!node || typeof node !== 'object') return;
    const o = node as Record<string, unknown>;
    if (typeof o.pt === 'string' && typeof o.en === 'string') {
      const text = o as unknown as Text;
      if (!text.pt) return;
      const before = get(prev, path) as Partial<Text> | undefined;
      for (const target of ['en', 'es'] as const) {
        const changedPt = before?.pt !== undefined && before.pt !== text.pt;
        const untouched = (before?.[target] ?? '') === text[target];
        if (!text[target] || (changedPt && untouched)) jobs.push({ name: [...path, target].join('.'), text, target, pt: text.pt });
      }
      return;
    }
    for (const [k, v] of Object.entries(o)) visit(v, [...path, k]);
  };
  visit(d, []);

  const filledOut: Record<string, string> = {};
  let failed = 0;
  // poucos pedidos por vez, para não estourar o serviço gratuito
  for (let i = 0; i < jobs.length; i += 4) {
    await Promise.all(
      jobs.slice(i, i + 4).map(async (j) => {
        const out = await translate(j.pt, j.target);
        if (out === null) failed++;
        else {
          j.text[j.target] = out;
          filledOut[j.name] = out;
        }
      }),
    );
  }
  return { filled: filledOut, failed };
}

/* Botão "Traduzir" de um campo: devolve inglês e espanhol do texto em português. */
export async function translateText(pt: string): Promise<{ en?: string; es?: string; error?: string }> {
  await requireAdmin();
  const src = String(pt ?? '').slice(0, 1200);
  if (!src.trim()) return { error: 'Escreva o texto em português primeiro.' };
  const [en, es] = await Promise.all([translate(src, 'en'), translate(src, 'es')]);
  if (en === null || es === null) return { error: 'O tradutor gratuito não respondeu agora. Tente de novo em instantes.' };
  return { en, es };
}

export async function saveSettings(_: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = settingsSchema.safeParse(nested(form));
  if (!parsed.success) return { error: message(parsed.error) };
  const d = parsed.data;
  const links = [
    d.github && { label: 'GitHub', href: d.github },
    d.linkedin && { label: 'LinkedIn', href: d.linkedin },
  ].filter(Boolean);
  // mantém o que não vem deste formulário (ex.: a data do currículo)
  const { data: row } = await db.from('pf_site_settings').select('data').eq('id', 1).maybeSingle();
  const tr =
    d.auto_translate === 'on' || d.auto_translate === 'true'
      ? await autoTranslate(
          { status: d.status, tagline: d.tagline, hook: d.hook, short: d.short, intro: d.intro, bio: d.bio, chips: d.chips, skills: d.skills, journey: d.journey },
          row?.data,
        )
      : { filled: {}, failed: 0 };
  const data = {
    ...((row?.data ?? {}) as Record<string, unknown>),
    email: d.email,
    links,
    status: d.status,
    tagline: d.tagline,
    hook: d.hook,
    short: d.short,
    intro: d.intro,
    bio: d.bio,
    stack: d.stack.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 30),
    chips: d.chips.filter(filled),
    skills: d.skills.filter((s) => filled(s.title)),
    journey: d.journey.filter((j) => filled(j.title)),
  };
  const { error } = await db.from('pf_site_settings').update({ data }).eq('id', 1);
  if (error) return { error: 'Não foi possível salvar.' };
  const n = Object.keys(tr.filled).length;
  const extra = [
    n ? `${n} ${n === 1 ? 'tradução feita' : 'traduções feitas'} automaticamente` : '',
    tr.failed ? `${tr.failed} não ${tr.failed === 1 ? 'pôde ser traduzida' : 'puderam ser traduzidas'} agora (tente salvar de novo)` : '',
  ].filter(Boolean);
  return { ok: ['Conteúdo salvo. Já está no ar.', ...extra].join(' · '), filled: tr.filled };
}
