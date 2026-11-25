'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/* Orbe de assistente, no espírito do Jarvis: uma esfera fina de partículas,
   anéis de órbita e um núcleo de luz. Enquanto a transcrição embaixo está
   sendo digitada, a orbe "fala" (a deformação segue um envelope de voz);
   nas pausas ela só respira. */

const VERT = /* glsl */ `
uniform float t;
uniform float amp;
uniform float px;
varying float vD;
float n(vec3 p){return sin(p.x*2.1+t)*sin(p.y*2.4+t*1.3)*sin(p.z*1.8+t*.7);}
void main(){
  vec3 q = normalize(position);
  float idle = n(q*1.6 + t*.1) * .025;
  float voice = (n(q*3.4 - t*.6) * .07 + sin(q.y*9. - t*7.) * .025) * amp;
  float d = idle + voice;
  vec3 p = position + q*d;
  vD = d;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = (1.15 + amp*.9) * px * (3.4 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform vec3 tint;
uniform float amp;
varying float vD;
void main(){
  float a = smoothstep(.5, .05, length(gl_PointCoord - .5));
  vec3 c = mix(vec3(.82), tint, clamp(.35 + vD*6. + amp*.4, 0., 1.));
  gl_FragColor = vec4(c, a * (.32 + amp*.25));
}`;

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(190,230,255,0.9)');
  r.addColorStop(0.25, 'rgba(120,200,255,0.35)');
  r.addColorStop(1, 'rgba(120,200,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function JarvisOrb({ lines }: { lines: string[] }) {
  const host = useRef<HTMLDivElement>(null);
  const speaking = useRef(false);
  const [shown, setShown] = useState<{ prev: string; cur: string }>({ prev: '', cur: '' });

  // Transcrição digitada: liga/desliga a "fala" da orbe.
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown({ prev: '', cur: lines[0] ?? '' });
      return;
    }
    let alive = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(900);
      let i = 0;
      let prev = '';
      while (alive) {
        const line = lines[i % lines.length];
        speaking.current = true;
        for (let c = 1; c <= line.length && alive; c++) {
          setShown({ prev, cur: line.slice(0, c) });
          await wait(line[c - 1] === ' ' ? 45 : 28 + Math.random() * 30);
        }
        speaking.current = false;
        await wait(2200);
        prev = line;
        i++;
      }
    })();
    return () => {
      alive = false;
    };
  }, [lines]);

  // Cena three.js.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // sem WebGL: fica o brilho em CSS do contêiner
    }
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 7;

    const tint = new THREE.Color('#8fd3ff');
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { t: { value: 0 }, amp: { value: 0 }, px: { value: dpr }, tint: { value: tint } },
    });
    const geo = new THREE.IcosahedronGeometry(1.15, 30);
    const orb = new THREE.Points(geo, mat);
    scene.add(orb);

    const ringMat = new THREE.MeshBasicMaterial({
      color: tint,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    // Anéis inclinados (nunca de perfil, senão viram uma linha reta).
    const rings = [1.5, 1.66, 1.82].map((r, i) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 6, 220), ringMat.clone());
      m.rotation.set(1.0 + i * 0.12, (i - 1) * 0.9, i * 0.4);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.22 - i * 0.06;
      scene.add(m);
      return m;
    });

    const tex = glowTexture();
    const core = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    core.scale.setScalar(1.6);
    scene.add(core);

    const size = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();

    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove);

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) loop();
    });
    io.observe(el);

    let amp = 0;
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible) return;
      const t = (performance.now() - t0) / 1000;
      const target = speaking.current
        ? 0.45 + 0.55 * Math.abs(Math.sin(t * 11) * Math.sin(t * 6.7 + 1.3))
        : 0.04;
      amp += (target - amp) * 0.12;
      mat.uniforms.t.value = t;
      mat.uniforms.amp.value = amp;
      orb.rotation.y += (mx * 0.5 - orb.rotation.y) * 0.03 + 0.001;
      orb.rotation.x += (my * 0.3 - orb.rotation.x) * 0.03;
      rings.forEach((r, i) => {
        r.rotation.z += 0.0015 * (i % 2 ? -1 : 1);
        r.scale.setScalar(1 + amp * 0.03 * (i + 1));
      });
      core.scale.setScalar(1.35 + amp * 0.7);
      (core.material as THREE.SpriteMaterial).opacity = 0.55 + amp * 0.45;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    if (!reduce) loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      mat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      tex.dispose();
      core.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <figure className="relative flex min-w-0 flex-col items-center">
      <div
        ref={host}
        aria-hidden
        className="relative aspect-square w-full max-w-[18rem] sm:max-w-[24rem] lg:max-w-[28rem] bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--signal)_14%,transparent),transparent)] [&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:size-full"
      />
      <figcaption className="-mt-4 min-h-[4.5rem] w-full max-w-sm text-center text-sm leading-relaxed">
        <span className="sr-only">{lines.join(' ')}</span>
        <span aria-hidden className="block truncate text-muted-foreground/50">
          {shown.prev}
        </span>
        <span aria-hidden className="text-foreground/90">
          {shown.cur}
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-signal" />
        </span>
      </figcaption>
    </figure>
  );
}
