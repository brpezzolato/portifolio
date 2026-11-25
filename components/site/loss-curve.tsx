'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

type Epoch = { label: string; title: string; detail: string };

/* Trajetória contada como um treino: a curva de perda desce a cada época.
   A curva é ilustrativa; as épocas são reais. */
export function LossCurve({ epochs }: { epochs: Epoch[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const n = epochs.length;
  const xs = epochs.map((_, i) => 6 + (i * 88) / Math.max(n - 1, 1));
  // y cresce para baixo no SVG: a perda começa no alto e desce.
  const f = (x: number) => 90 - (12 + 70 * Math.exp(-(x - 4) / 28));
  const path = Array.from({ length: 50 }, (_, i) => {
    const x = 2 + (i * 96) / 49;
    return `${i ? 'L' : 'M'}${x.toFixed(2)},${f(x).toFixed(2)}`;
  }).join(' ');

  return (
    <div ref={ref}>
      <div className="relative">
        <svg viewBox="0 0 100 90" preserveAspectRatio="none" className="h-[clamp(180px,24vw,280px)] w-full overflow-visible">
          {[20, 45, 70].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--border)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {/* A curva entra da esquerda para a direita (recorte animado). */}
        <motion.svg
          viewBox="0 0 100 90"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
          initial={{ clipPath: reduce ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          animate={{ clipPath: inView || reduce ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          transition={{ duration: 1.8, ease: [0.22, 0.9, 0.28, 1] }}
        >
          <path d={path} fill="none" stroke="var(--signal)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </motion.svg>
        {xs.map((x, i) => (
          <span
            key={i}
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-signal bg-background"
            style={{ left: `${x}%`, top: `${(f(x) / 90) * 100}%` }}
          />
        ))}
        <span className="absolute top-0 right-0 font-mono text-xs text-muted-foreground">perda ↓</span>
      </div>
      <ol className="mt-6 grid gap-6" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
        {epochs.map((e) => (
          <li key={e.title} className="border-t border-border pt-3">
            <span className="font-mono text-xs text-signal">{e.label}</span>
            <p className="mt-1 text-lg font-medium tracking-tight">{e.title}</p>
            <p className="text-sm text-muted-foreground">{e.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
