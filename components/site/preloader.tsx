'use client';

import { useEffect, useState } from 'react';

const NAME = 'bruno pezzolato';

/* Abertura: o nome é digitado no centro, uma linha fina enche embaixo e o
   painel sobe como uma cortina. Uma vez por sessão; depois avisa a página
   (evento intro:done) para a digitação do título começar. */
export function Preloader() {
  const [typed, setTyped] = useState(0);
  const [bar, setBar] = useState(0);
  const [state, setState] = useState<'on' | 'leaving' | 'off'>('on');

  useEffect(() => {
    const w = window as Window & { __introDone?: boolean };
    const finish = () => {
      w.__introDone = true;
      window.dispatchEvent(new Event('intro:done'));
    };
    let seen = false;
    try {
      seen = sessionStorage.getItem('intro') === '1';
      sessionStorage.setItem('intro', '1');
    } catch {}
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('off');
      finish();
      return;
    }
    let alive = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(200);
      for (let i = 1; i <= NAME.length && alive; i++) {
        setTyped(i);
        setBar(i / NAME.length);
        await wait(NAME[i - 1] === ' ' ? 90 : 45 + Math.random() * 40);
      }
      await wait(350);
      if (!alive) return;
      setState('leaving');
      await wait(450);
      finish();
      await wait(500);
      if (alive) setState('off');
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state === 'off') return null;
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[90] grid place-items-center bg-background transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] ${
        state === 'leaving' ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'
      }`}
    >
      <div className="w-[min(80vw,22rem)]">
        <p className="font-mono text-lg tracking-tight text-foreground">
          {NAME.slice(0, typed)}
          <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-[blink_1s_steps(1)_infinite] bg-signal" />
        </p>
        <div className="mt-4 h-px w-full bg-border">
          <div className="h-px bg-foreground transition-[width] duration-200 ease-out" style={{ width: `${bar * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
