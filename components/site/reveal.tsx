'use client';

import { motion, useReducedMotion } from 'motion/react';

/* Entrada suave ao aparecer na tela (sobe 12px e desfoca de leve). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 0.9, 0.28, 1] }}
    >
      {children}
    </motion.div>
  );
}
