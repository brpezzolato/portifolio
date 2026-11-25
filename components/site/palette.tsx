'use client';

import { useEffect, useState } from 'react';
import { palettes, type Palette } from '@/lib/palettes';
import { cn } from 'cn';

/* Aplica uma paleta (acento + cores da orbe) por variáveis CSS no <html>.
   Com ?paletas na URL, mostra um seletor flutuante com as 10 opções;
   ?paleta=<id> abre direto numa delas. */
function apply(p: Palette) {
  const r = document.documentElement.style;
  r.setProperty('--p-light', p.light);
  r.setProperty('--p-dark', p.dark);
  r.setProperty('--orb-a', p.orb[0]);
  r.setProperty('--orb-b', p.orb[1]);
  window.dispatchEvent(new Event('palette:change'));
}

export function PalettePicker() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const id = q.get('paleta');
    const found = palettes.find((p) => p.id === id);
    if (found) {
      apply(found);
      setCurrent(found.id);
    }
    if (q.has('paletas') || id) setShow(true);
  }, []);

  if (!show) return null;
  const pick = (p: Palette) => {
    apply(p);
    setCurrent(p.id);
    const u = new URL(window.location.href);
    u.searchParams.set('paleta', p.id);
    u.searchParams.set('paletas', '');
    window.history.replaceState(null, '', u.toString().replace('paletas=', 'paletas'));
  };
  const active = palettes.find((p) => p.id === current);

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[min(calc(100vw-2rem),44rem)] -translate-x-1/2 rounded-3xl border border-border bg-background/90 p-3 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.4)] backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between px-1 text-sm">
        <span className="font-medium">Paleta: {active ? active.name : 'escolha uma'}</span>
        <span className="text-muted-foreground">{palettes.findIndex((p) => p.id === current) + 1 || '–'} / 10</span>
      </div>
      <ul className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {palettes.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => pick(p)}
              aria-label={`${i + 1}. ${p.name}`}
              aria-pressed={current === p.id}
              title={p.name}
              className={cn(
                'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl ring-offset-2 ring-offset-background transition-transform hover:scale-105',
                current === p.id && 'ring-2 ring-foreground',
              )}
              style={{ background: `linear-gradient(135deg, ${p.orb[0]}, ${p.orb[1]})` }}
            >
              <span className="text-xs font-semibold text-white mix-blend-difference">{i + 1}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
