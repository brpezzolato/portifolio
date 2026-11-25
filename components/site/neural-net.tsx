'use client';

import { useEffect, useRef } from 'react';

/* Rede neural viva: camadas de neurônios, sinapses finas e pulsos de luz
   correndo da entrada para a saída. Passe o mouse num neurônio para ver as
   ligações dele. */
const LAYERS = [4, 7, 7, 5, 2];

export function NeuralNet({ labels }: { labels: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(cv);
    const ink = css.getPropertyValue('--foreground').trim() || '#f7f7f7';
    const sig = css.getPropertyValue('--signal').trim() || '#9ad8ff';

    type Node = { x: number; y: number; l: number; heat: number };
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let W = 0;
    let H = 0;
    let hover = -1;
    const pulses: { e: number; p: number; v: number }[] = [];

    const layout = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = [];
      edges = [];
      const padX = Math.min(60, W * 0.06);
      LAYERS.forEach((n, l) => {
        const x = padX + (l * (W - padX * 2)) / (LAYERS.length - 1);
        for (let i = 0; i < n; i++) nodes.push({ x, y: ((i + 1) * H) / (n + 1), l, heat: 0 });
      });
      let off = 0;
      for (let l = 0; l < LAYERS.length - 1; l++) {
        const next = off + LAYERS[l];
        for (let a = 0; a < LAYERS[l]; a++)
          for (let b = 0; b < LAYERS[l + 1]; b++) edges.push([off + a, next + b]);
        off = next;
      }
    };

    const spawn = () => {
      const starts = edges.map((e, i) => [e, i] as const).filter(([e]) => nodes[e[0]].l === 0);
      const [, i] = starts[(Math.random() * starts.length) | 0];
      pulses.push({ e: i, p: 0, v: 0.012 + Math.random() * 0.01 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      edges.forEach(([a, b]) => {
        const lit = hover === a || hover === b;
        ctx.strokeStyle = lit ? sig : ink;
        ctx.globalAlpha = lit ? 0.55 : 0.06;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pu = pulses[k];
        const [a, b] = edges[pu.e];
        const A = nodes[a];
        const B = nodes[b];
        const x = A.x + (B.x - A.x) * pu.p;
        const y = A.y + (B.y - A.y) * pu.p;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
        g.addColorStop(0, sig);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        pu.p += pu.v;
        if (pu.p >= 1) {
          B.heat = 1;
          pulses.splice(k, 1);
          const outs = edges.map((e, i) => [e, i] as const).filter(([e]) => e[0] === b);
          if (outs.length && Math.random() < 0.85) {
            const [, i] = outs[(Math.random() * outs.length) | 0];
            pulses.push({ e: i, p: 0, v: pu.v });
          }
        }
      }
      nodes.forEach((n, i) => {
        const r = i === hover ? 6 : 4;
        ctx.fillStyle = '#030303';
        ctx.strokeStyle = n.heat > 0.05 || i === hover ? sig : ink;
        ctx.globalAlpha = 0.35 + n.heat * 0.65;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (n.heat > 0.05) {
          ctx.fillStyle = sig;
          ctx.globalAlpha = n.heat;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        n.heat *= 0.94;
      });
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let visible = false;
    let last = 0;
    const loop = (t: number) => {
      if (!visible) return;
      if (t - last > 260 && pulses.length < 24) {
        spawn();
        last = t;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      hover = -1;
      let best = 22;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < best) {
          best = d;
          hover = i;
        }
      });
      if (reduce) draw();
    };
    const onLeave = () => {
      hover = -1;
      if (reduce) draw();
    };
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);

    const ro = new ResizeObserver(() => {
      layout();
      draw();
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
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div>
      <canvas ref={ref} aria-hidden className="h-[clamp(260px,38vw,420px)] w-full" />
      <ol className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {labels.map((l, i) => (
          <li key={l} className="border-t border-border pt-3">
            <span className="font-mono text-xs text-muted-foreground">camada {i}</span>
            <p className="mt-1 text-sm">{l}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
