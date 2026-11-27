import 'server-only';

/* Tradução automática gratuita, sem conta, sem chave e sem custo:
   1. Google Tradutor pelo endereço público (translate.googleapis.com, o mesmo
      tipo de acesso usado por extensões de navegador);
   2. se ele falhar, MyMemory (api.mymemory.translated.net), que aceita até
      500 caracteres por pedido — textos longos vão em pedaços entre frases.
   Se os dois falharem, devolve null e o painel avisa: nada é salvo errado. */

export type Target = 'en' | 'es';
const PAIR: Record<Target, string> = { en: 'pt-BR|en-US', es: 'pt-BR|es-ES' };

async function google(text: string, target: Target): Promise<string | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    const segs = Array.isArray(json) && Array.isArray(json[0]) ? (json[0] as unknown[]) : null;
    const out = segs?.map((sg) => (Array.isArray(sg) && typeof sg[0] === 'string' ? sg[0] : '')).join('');
    return out?.trim() ? out.trim() : null;
  } catch {
    return null;
  }
}
const MAX = 450;

function chunks(text: string): string[] {
  if (text.length <= MAX) return [text];
  const parts = text.match(/[^.!?;:\n]+[.!?;:\n]*\s*/g) ?? [text];
  const out: string[] = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + p).length > MAX && cur) {
      out.push(cur);
      cur = '';
    }
    // frase sozinha maior que o limite: corta entre palavras
    if (p.length > MAX) {
      for (const w of p.split(/(\s+)/)) {
        if ((cur + w).length > MAX && cur) {
          out.push(cur);
          cur = '';
        }
        cur += w;
      }
    } else cur += p;
  }
  if (cur) out.push(cur);
  return out;
}

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

async function one(text: string, target: Target): Promise<string | null> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(PAIR[target])}`;
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const json = (await res.json()) as { responseStatus?: number | string; responseData?: { translatedText?: string } };
    const out = json.responseData?.translatedText;
    if (Number(json.responseStatus) !== 200 || !out || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(out)) return null;
    return decode(out);
  } catch {
    return null;
  }
}

/* Traduz do português para o idioma pedido, preservando espaços nas pontas. */
export async function translate(text: string, target: Target): Promise<string | null> {
  const src = text.trim();
  if (!src) return '';
  const g = await google(src, target);
  if (g) return g;
  const pieces = chunks(src);
  const done: string[] = [];
  for (const p of pieces) {
    const t = await one(p.trim(), target);
    if (t === null) return null;
    done.push(t);
  }
  return done.join(' ').replace(/\s+/g, ' ').trim();
}
