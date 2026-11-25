'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HeroScene } from '@/components/site/hero-scene';
import { useLang } from '@/components/site/providers';
import { TypeLines } from '@/components/site/type-lines';
import { site } from '@/lib/site';

/* Herói com a orbe no centro e o nome separado nos cantos ("Bruno" no alto
   à esquerda, "Pezzolato" embaixo à direita). Ao rolar, a cena fica presa
   na tela e as duas palavras deslizam até o centro, empilhadas na frente da
   orbe: Bruno em cima, Pezzolato embaixo. */

type Delta = { x: number; y: number };
const ease = (v: number) => {
  const p = Math.min(1, Math.max(0, v / 0.75));
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
};

function Word({ children, progress, delta, className, innerRef }: {
  children: string;
  progress: MotionValue<number>;
  delta: Delta;
  className: string;
  innerRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const x = useTransform(progress, (v) => ease(v) * delta.x);
  const y = useTransform(progress, (v) => ease(v) * delta.y);
  return (
    <motion.span ref={innerRef} style={{ x, y }} className={className}>
      {children}
    </motion.span>
  );
}

export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [first, ...rest] = site.name.split(' ');
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);
  const [da, setDa] = useState<Delta>({ x: 0, y: 0 });
  const [db, setDb] = useState<Delta>({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const fade = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Mede onde cada palavra está (sem as transformações) e quanto precisa
  // andar até o centro empilhado.
  const measure = () => {
    const s = stage.current;
    if (!s || !a.current || !b.current) return;
    const W = s.clientWidth;
    const H = s.clientHeight;
    const box = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      let n: HTMLElement | null = el;
      while (n && n !== s) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    const A = box(a.current);
    const B = box(b.current);
    const gap = A.h * 0.02;
    setDa({ x: W / 2 - (A.x + A.w / 2), y: H / 2 - A.h / 2 - gap - (A.y + A.h / 2) });
    setDb({ x: W / 2 - (B.x + B.w / 2), y: H / 2 + B.h / 2 + gap - (B.y + B.h / 2) });
  };
  useLayoutEffect(measure, []);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  const word = 'block text-[clamp(3.5rem,12vw,11.5rem)] leading-[0.8] font-semibold tracking-[-0.06em] will-change-transform';

  return (
    <section id="inicio" ref={section} className={reduce ? 'relative' : 'relative h-[190svh]'}>
      <div ref={stage} className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
        <HeroScene className="absolute inset-0" />
        <div className="pointer-events-none relative mx-auto grid h-full max-w-[1400px] grid-rows-[1fr_auto_1fr] px-5 pt-24 pb-24 sm:px-8">
          <h1 className="contents">
            <span className="self-end">
              <Word innerRef={a} progress={scrollYProgress} delta={da} className={`${word} w-fit`}>
                {first}
              </Word>
              <motion.span style={{ opacity: fade }} className="mt-5 block max-w-[16rem] text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium tracking-tight text-foreground/80 sm:max-w-none">
                <TypeLines key={t(site.tagline)} lines={[t(site.tagline)]} speed={55} />
              </motion.span>
            </span>
            <span className="row-start-2 block h-[min(38svh,60vw)]" aria-hidden />
            <span className="self-start justify-self-end">
              <Word innerRef={b} progress={scrollYProgress} delta={db} className={`${word} w-fit text-right`}>
                {rest.join(' ')}
              </Word>
            </span>
          </h1>
        </div>
        <motion.div
          style={{ opacity: fade }}
          className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 pb-8 text-sm text-muted-foreground sm:px-8"
        >
          <span className="flex items-center gap-2">
            <span className="signal-dot size-1.5!" />
            {t(site.status)}
          </span>
          <span className="hidden text-right sm:block">{t(site.short)}</span>
        </motion.div>
      </div>
    </section>
  );
}
