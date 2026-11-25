'use client';

import { useEffect, useState } from 'react';

/* Abertura curta, uma vez por sessão: contador de 0 a 100 "carregando os
   pesos do modelo". O conteúdo já está renderizado embaixo. */
export function Preloader() {
  const [n, setN] = useState(0);
  const [state, setState] = useState<'on' | 'leaving' | 'off'>('on');

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('intro') === '1';
      sessionStorage.setItem('intro', '1');
    } catch {}
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('off');
      return;
    }
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1300);
      setN(Math.round((1 - (1 - p) ** 3) * 100));
      if (p < 1) id = requestAnimationFrame(tick);
      else {
        setState('leaving');
        setTimeout(() => setState('off'), 700);
      }
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  if (state === 'off') return null;
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[90] flex flex-col justify-between bg-background p-5 font-mono text-xs text-muted-foreground transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] sm:p-8 ${
        state === 'leaving' ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'
      }`}
    >
      <span>carregando pesos do modelo…</span>
      <div className="flex items-end justify-between">
        <span>bruno.pezzolato / portfólio</span>
        <span className="text-[clamp(4rem,16vw,12rem)] leading-none font-semibold tracking-tighter text-foreground tabular-nums">
          {String(n).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}
