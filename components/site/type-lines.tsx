'use client';

import { useEffect, useState } from 'react';

/* Digitação de verdade: as linhas são escritas caractere a caractere, com
   cursor piscando no fim. Começa quando a abertura (preloader) termina. */
export function TypeLines({
  lines,
  className,
  lineClassNames = [],
  speed = 55,
  delay = 0,
  keepCaret = true,
}: {
  lines: string[];
  className?: string;
  lineClassNames?: string[];
  speed?: number;
  delay?: number;
  keepCaret?: boolean;
}) {
  const total = lines.reduce((n, l) => n + l.length, 0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(total);
      setStarted(true);
      setDone(true);
      return;
    }
    let alive = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const start = async () => {
      await wait(250 + delay);
      if (alive) setStarted(true);
      for (let i = 1; i <= total && alive; i++) {
        setCount(i);
        // pausa um pouco mais em espaço, vírgula e fim de linha: parece mão humana
        let acc = 0;
        let ch = '';
        for (const l of lines) {
          if (i <= acc + l.length) {
            ch = l[i - acc - 1];
            break;
          }
          acc += l.length;
        }
        const endOfLine = lines.some((_, k) => lines.slice(0, k + 1).join('').length === i);
        await wait(endOfLine ? 380 : ch === ' ' ? speed * 1.4 : speed * (0.6 + Math.random() * 0.8));
      }
      if (alive) setDone(true);
    };
    const w = window as Window & { __introDone?: boolean };
    if (w.__introDone) start();
    else window.addEventListener('intro:done', start, { once: true });
    return () => {
      alive = false;
      window.removeEventListener('intro:done', start);
    };
  }, [lines, total, speed, delay]);

  let used = 0;
  const caretLine = (() => {
    let acc = 0;
    for (let k = 0; k < lines.length; k++) {
      acc += lines[k].length;
      if (count < acc || k === lines.length - 1) return k;
    }
    return lines.length - 1;
  })();

  return (
    <span className={className}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, k) => {
        const shown = Math.max(0, Math.min(line.length, count - used));
        used += line.length;
        return (
          <span key={k} aria-hidden className={`block ${lineClassNames[k] ?? ''}`}>
            <span>{line.slice(0, shown)}</span>
            {k === caretLine && started && (keepCaret || !done) && (
              <span
                className={`ml-[0.04em] inline-block h-[0.82em] w-[0.06em] translate-y-[0.08em] bg-signal ${done ? 'animate-[blink_1s_steps(1)_infinite]' : ''}`}
              />
            )}
            {/* reserva a altura da linha antes de ser digitada */}
            {shown === 0 && <span className="invisible">.</span>}
          </span>
        );
      })}
    </span>
  );
}
