'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/* Duas faixas de palavras enormes que deslizam em sentidos opostos
   conforme a rolagem. Uma cheia, outra só no contorno. */
export function Kinetic({ top, bottom }: { top: string[]; bottom: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-30%', '0%']);
  const row = (words: string[]) => [...words, ...words, ...words];
  return (
    <div ref={ref} aria-label={[...top, ...bottom].join(', ')} className="overflow-hidden py-10 sm:py-16">
      <motion.p aria-hidden style={{ x: x1 }} className="flex gap-10 text-[clamp(3rem,9vw,8.5rem)] leading-none font-semibold tracking-[-0.05em] whitespace-nowrap">
        {row(top).map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            {w}
            <span className="inline-block size-[0.18em] rounded-full bg-signal" />
          </span>
        ))}
      </motion.p>
      <motion.p
        aria-hidden
        style={{ x: x2 }}
        className="mt-4 flex gap-10 text-[clamp(3rem,9vw,8.5rem)] leading-none font-semibold tracking-[-0.05em] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_var(--foreground)] opacity-60"
      >
        {row(bottom).map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </motion.p>
    </div>
  );
}
