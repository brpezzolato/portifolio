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
  const p = Math.min(1, Math.max(0, v / 0.55));
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
};

/* Palavra da frase de efeito: acende e sobe conforme a rolagem. */
function HookWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [14, 0]);
  const blur = useTransform(progress, range, ['blur(6px)', 'blur(0px)']);
  return (
    <motion.span aria-hidden style={{ opacity, y, filter: blur }} className="inline-block whitespace-pre">
      {children}{' '}
    </motion.span>
  );
}

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
  const [hb, setHb] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const fade = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const chipsIn = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const chipsY = useTransform(scrollYProgress, [0.82, 0.92], [16, 0]);
  const hookWords = t(site.hook).split(' ');

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
    setHb(B.h);
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
    <section id="inicio" ref={section} className={reduce ? 'relative' : 'relative h-[250svh]'}>
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
        {/* depois que o nome se junta: frase de efeito + etiquetas */}
        {!reduce && (
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 px-5 text-center"
            style={{ marginTop: hb + hb * 0.04 + 28 }}
          >
            <p className="mx-auto max-w-3xl text-[clamp(1.25rem,2.4vw,2rem)] leading-snug font-medium tracking-[-0.03em]">
              <span className="sr-only">{t(site.hook)}</span>
              {hookWords.map((w, i) => {
                const start = 0.6 + (i / hookWords.length) * 0.2;
                return (
                  <HookWord key={`${w}-${i}`} progress={scrollYProgress} range={[start, start + 0.06]}>
                    {w}
                  </HookWord>
                );
              })}
            </p>
            <motion.ul style={{ opacity: chipsIn, y: chipsY }} className="mt-6 flex flex-wrap justify-center gap-2">
              {site.chips.map((c) => (
                <li key={c.pt} className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
                  <span className="size-1.5 rounded-full bg-signal" />
                  {t(c)}
                </li>
              ))}
            </motion.ul>
          </div>
        )}
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
