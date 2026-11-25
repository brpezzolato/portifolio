'use client';

import { useEffect, useState } from 'react';

/* Hora local de São Paulo, ao vivo. */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={className}>
      São Paulo <span className="tabular-nums">{now ?? '--:--:--'}</span>
    </span>
  );
}
