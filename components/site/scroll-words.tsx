'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, type RefObject } from 'react';

/* Parágrafo que se preenche palavra a palavra conforme a rolagem. */
/* Por padrão acompanha o próprio parágrafo; com `target`, acompanha outro
   elemento (útil quando o parágrafo fica preso com position: sticky). */
export function ScrollWords({
  text,
  className,
  target,
  offset = ['start 0.85', 'end 0.4'],
}: {
  text: string;
  className?: string;
  target?: RefObject<HTMLElement | null>;
  offset?: [string, string];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({ target: target ?? ref, offset: offset as any });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Word key={`${text}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline-block whitespace-pre">
      {children}{' '}
    </motion.span>
  );
}
