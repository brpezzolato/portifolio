'use client';

import { useEffect, useState } from 'react';

/* Palavra que se digita, espera e se apaga, em loop. */
export function TypedWord({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0] ?? '');

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let alive = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      let i = 0;
      await wait(2600);
      while (alive) {
        const cur = words[i % words.length];
        for (let c = cur.length; c >= 0 && alive; c--) {
          setText(cur.slice(0, c));
          await wait(35);
        }
        i++;
        const next = words[i % words.length];
        for (let c = 1; c <= next.length && alive; c++) {
          setText(next.slice(0, c));
          await wait(70);
        }
        await wait(2400);
      }
    })();
    return () => {
      alive = false;
    };
  }, [words]);

  return (
    <span className="whitespace-nowrap">
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden>{text}</span>
      <span aria-hidden className="ml-1 inline-block h-[0.8em] w-[0.06em] translate-y-[0.06em] animate-pulse bg-foreground" />
    </span>
  );
}
