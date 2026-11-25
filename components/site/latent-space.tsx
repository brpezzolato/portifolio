'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Item = { slug: string; title: string; status: string };

/* Projetos como clusters num espaço latente (à la t-SNE): cada projeto é uma
   nuvem de pontos que deriva devagar. Passar o mouse num rótulo acende a
   nuvem; clicar abre o projeto. */
export function LatentSpace({ items }: { items: Item[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);
  activeRef.current = active;

  // Centros fixos (proporções), para os rótulos HTML baterem com o canvas.
  const centers = items.map((_, i) => {
    const preset = [
      [0.28, 0.42],
      [0.68, 0.32],
      [0.58, 0.74],
      [0.18, 0.78],
      [0.84, 0.66],
    ][i % 5];
    return { x: preset[0], y: preset[1] };
  });

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(cv);
    const ink = css.getPropertyValue('--foreground').trim() || '#f7f7f7';
    const sig = css.getPropertyValue('--signal').trim() || '#9ad8ff';
    let s = 42;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
    const pts = centers.flatMap((c, k) =>
      Array.from({ length: 140 }, () => ({ k, ox: gauss() * 0.06, oy: gauss() * 0.06, ph: rnd() * 6.28 })),
    );
    const noise = Array.from({ length: 160 }, () => ({ x: rnd(), y: rnd(), ph: rnd() * 6.28 }));
    let W = 0;
    let H = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const a = activeRef.current;
      noise.forEach((p) => {
        ctx.fillStyle = ink;
        ctx.globalAlpha = 0.12;
        ctx.fillRect(p.x * W + Math.sin(t + p.ph) * 3, p.y * H + Math.cos(t + p.ph) * 3, 1.2, 1.2);
      });
      pts.forEach((p) => {
        const c = centers[p.k];
        const lit = a === p.k;
        const x = (c.x + p.ox * (lit ? 1.25 : 1)) * W + Math.sin(t * 0.8 + p.ph) * 2.5;
        const y = (c.y + p.oy * (lit ? 1.25 : 1)) * H + Math.cos(t * 0.7 + p.ph) * 2.5;
        ctx.fillStyle = lit ? sig : ink;
        ctx.globalAlpha = lit ? 0.9 : a === -1 ? 0.45 : 0.15;
        ctx.beginPath();
        ctx.arc(x, y, lit ? 1.8 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
    let raf = 0;
    let visible = false;
    const loop = (now: number) => {
      if (!visible) return;
      draw(now / 1000);
      raf = requestAnimationFrame(loop);
    };
    const ro = new ResizeObserver(() => {
      size();
      draw(0);
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <div className="relative h-[clamp(320px,44vw,520px)] overflow-hidden rounded-3xl border border-border bg-card/40">
      <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />
      <span className="absolute top-4 left-4 font-mono text-xs text-muted-foreground">z₁</span>
      <span className="absolute right-4 bottom-4 font-mono text-xs text-muted-foreground">z₂</span>
      {items.map((it, i) => (
        <Link
          key={it.slug}
          href={`/projetos/${it.slug}`}
          onPointerEnter={() => setActive(i)}
          onPointerLeave={() => setActive(-1)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(-1)}
          className="absolute -translate-x-1/2 translate-y-[calc(-100%-3.2rem)] rounded-full border border-border bg-background/80 px-3 py-1 text-sm whitespace-nowrap backdrop-blur transition-colors hover:border-signal hover:text-signal"
          style={{ left: `${centers[i].x * 100}%`, top: `${centers[i].y * 100}%` }}
        >
          {it.title}
          <span className="ml-2 font-mono text-[0.7rem] text-muted-foreground">{it.status}</span>
        </Link>
      ))}
    </div>
  );
}
