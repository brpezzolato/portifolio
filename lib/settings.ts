import 'server-only';
import { site as defaults } from './site';
import { supabaseConfigured } from './supabase/env';
import { createClient } from './supabase/server';

/* Conteúdo editável do site (textos, links, competências, jornada…).
   Fica numa linha da tabela site_settings; o que não estiver lá cai nos
   valores de lib/site.ts. */
export type SiteData = Omit<typeof defaults, 'url'>;

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is Json => isObj(v) && typeof v.pt === 'string' && typeof v.en === 'string';

function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  // Texto em idiomas: vale o que foi salvo no painel. Um idioma que ainda não
  // foi salvo fica vazio (o site cai para o inglês), em vez de herdar o texto
  // padrão, que poderia não corresponder ao português editado.
  if (isText(base) && isObj(over)) {
    return { pt: String(over.pt ?? ''), en: String(over.en ?? ''), es: String(over.es ?? '') } as T;
  }
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (isObj(base) && isObj(over)) {
    const out: Json = { ...base };
    for (const k of Object.keys(base)) out[k] = merge((base as Json)[k], over[k]);
    return out as T;
  }
  return (typeof over === typeof base || base === null ? over : base) as T;
}

export async function getSiteData(): Promise<SiteData> {
  const { url: _u, ...base } = defaults;
  void _u;
  if (!supabaseConfigured) return base as SiteData;
  try {
    const db = await createClient();
    const { data } = await db.from('pf_site_settings').select('data').eq('id', 1).maybeSingle();
    return merge(base as SiteData, data?.data);
  } catch {
    return base as SiteData;
  }
}
