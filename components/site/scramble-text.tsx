'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '01<>/[]{}#%&*+=▓▒░ABCDEFabcdef';

/* Texto que se "decodifica": cada caractere sorteia símbolos até assentar,
   da esquerda para a direita. O HTML do servidor já traz o texto final. */
export function ScrambleText({
  text,
  delay = 0,
  duration = 900,
  className,
  hover = false,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  hover?: boolean;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = (wait: number) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now() + wait;
    const tick = (now: number) => {
      const p = Math.max(0, (now - start) / duration);
      const settled = Math.floor(p * text.length);
      setOut(
        text
          .split('')
          .map((ch, i) =>
            ch === ' ' || i < settled ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0],
          )
          .join(''),
      );
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    run(delay);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      aria-label={text}
      onPointerEnter={hover ? () => run(0) : undefined}
    >
      <span aria-hidden>{out}</span>
    </span>
  );
}
