'use client';

import { cn } from 'cn';

/* Passa a posição do mouse para o CSS (--x/--y) e a borda acende ali. */
export function Spotlight({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('spotlight-card', className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
      }}
    />
  );
}
