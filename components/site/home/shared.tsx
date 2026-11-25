'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export const wrap = 'mx-auto w-full max-w-[1280px] px-5 sm:px-8';

export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
      <div>
        {eyebrow && <p className="mb-3 text-sm text-signal">{eyebrow}</p>}
        <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* Número que conta de 0 até o valor quando aparece na tela. */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setN(to);
    const c = animate(0, to, { duration: 1.4, ease: [0.22, 0.9, 0.28, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref} className="tabular-nums">{n}</span>;
}
