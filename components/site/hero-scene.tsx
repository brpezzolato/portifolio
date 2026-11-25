'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* Cena do herói, em tela cheia: partículas finas atravessando da esquerda
   para a direita (um fluxo de dados) e, à frente delas, a orbe lisa em
   shader. A orbe se adapta ao tema: perolada no claro, preta no escuro. */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float t;
uniform float energy;
varying vec3 vN;
varying vec3 vV;
varying float vNoise;
${NOISE}
float field(vec3 n){
  return snoise(n*.9+vec3(0.,0.,t*.14))*(.045+energy*.035)+snoise(n*2.2-vec3(t*.1))*.008;
}
vec3 displace(vec3 n){return n*(1.+field(n));}
void main(){
  vec3 n=normalize(position);
  vec3 up=abs(n.y)>.99?vec3(1.,0.,0.):vec3(0.,1.,0.);
  vec3 ta=normalize(cross(up,n));vec3 tb=cross(n,ta);
  float e=.012;
  vec3 p=displace(n);
  vec3 pa=displace(normalize(n+ta*e));
  vec3 pb=displace(normalize(n+tb*e));
  vec3 nn=normalize(cross(pa-p,pb-p));
  if(dot(nn,n)<0.) nn=-nn;
  vNoise=field(n)*6.;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  vN=normalize(normalMatrix*nn);
  vV=-mv.xyz;
  gl_Position=projectionMatrix*mv;
}`;

const FRAG = /* glsl */ `
uniform vec3 ice;
uniform vec3 violet;
uniform float dark;
varying vec3 vN;
varying vec3 vV;
varying float vNoise;
void main(){
  vec3 N=normalize(vN);vec3 V=normalize(vV);
  float fr=pow(1.-max(dot(N,V),0.),2.4);
  vec3 L=normalize(vec3(-.5,.8,.6));
  float dif=max(dot(N,L),0.);
  float spec=pow(max(dot(reflect(-L,N),V),0.),70.);
  vec3 rim=mix(ice,violet,smoothstep(-.4,.6,vNoise)*.7);
  // claro: pérola com sombra fria e borda colorida
  vec3 pearl=mix(vec3(.80,.84,.93),vec3(.995),dif*.85+.15);
  vec3 light=mix(pearl,rim,fr*.85)+vec3(1.)*spec*.25;
  // escuro: corpo preto e borda acesa
  vec3 night=vec3(.01)+rim*fr*.95+vec3(1.)*spec*.18+ice*.02*(1.-fr);
  gl_FragColor=vec4(mix(light,night,dark),1.);
}`;

export function HeroScene({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 7;

    const isDark = () => document.documentElement.classList.contains('dark');
    const uniforms = {
      t: { value: 0 },
      energy: { value: 0 },
      dark: { value: isDark() ? 1 : 0 },
      ice: { value: new THREE.Color('#10b981') },
      violet: { value: new THREE.Color('#06b6d4') },
    };
    const geo = new THREE.SphereGeometry(1, 200, 200);
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    const orb = new THREE.Mesh(geo, mat);
    scene.add(orb);

    // Partículas: caixa larga atrás da orbe, cada uma com sua velocidade.
    const N = 1100;
    const pos = new Float32Array(N * 3);
    const speed = new Float32Array(N);
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (rnd() - 0.5) * 16;
      pos[i * 3 + 1] = (rnd() - 0.5) * 8;
      pos[i * 3 + 2] = -1.5 - rnd() * 5;
      speed[i] = 0.004 + rnd() * 0.012;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pmat = new THREE.PointsMaterial({ size: 0.035, transparent: true, depthWrite: false, opacity: 0.55 });
    const particles = new THREE.Points(pgeo, pmat);
    scene.add(particles);

    // cores da orbe vêm da paleta (variáveis --orb-a/--orb-b no <html>)
    const readOrb = () => {
      const cs = getComputedStyle(document.documentElement);
      const a = cs.getPropertyValue('--orb-a').trim();
      const b = cs.getPropertyValue('--orb-b').trim();
      if (a) uniforms.ice.value.set(a);
      if (b) uniforms.violet.value.set(b);
    };
    const paint = () => {
      readOrb();
      const d = isDark();
      uniforms.dark.value = d ? 1 : 0;
      pmat.color.set(d ? '#8fa0c8' : '#7b8496');
      pmat.opacity = d ? 0.5 : 0.45;
    };
    paint();
    const mo = new MutationObserver(() => {
      paint();
      renderer.render(scene, camera);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    const onPalette = () => {
      paint();
      renderer.render(scene, camera);
    };
    window.addEventListener('palette:change', onPalette);

    let halfW = 1;
    let halfH = 1;
    let wide = true;
    const size = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      halfH = Math.tan(THREE.MathUtils.degToRad(17.5)) * 7;
      halfW = halfH * camera.aspect;
      wide = w >= 1024;
      orb.scale.setScalar(wide ? Math.min(1.25, halfH * 0.46) : Math.min(1.0, halfW * 0.7));
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
    let raf = 0;
    const t0 = performance.now();
    const frame = (move: boolean) => {
      const t = (performance.now() - t0) / 1000;
      uniforms.t.value = t;
      const bx = 0;
      const by = wide ? 0.02 : -halfH * 0.04;
      orb.position.x = bx + (move ? Math.sin(t * 0.21) * 0.12 : 0);
      orb.position.y = by + (move ? Math.cos(t * 0.17) * 0.1 : 0);
      orb.rotation.y += (mx * 0.6 - orb.rotation.y) * 0.03 + 0.0008;
      orb.rotation.x += (my * 0.35 - orb.rotation.x) * 0.03;
      if (move) {
        for (let i = 0; i < N; i++) {
          pos[i * 3] += speed[i];
          if (pos[i * 3] > 8) pos[i * 3] = -8;
        }
        pgeo.attributes.position.needsUpdate = true;
      }
      particles.position.x = -mx * 0.3;
      particles.position.y = my * 0.2;
      renderer.render(scene, camera);
    };
    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible) return;
      frame(true);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) loop();
    });
    io.observe(el);
    if (reduce) frame(false);
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('palette:change', onPalette);
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      mat.dispose();
      pgeo.dispose();
      pmat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className={`[&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:size-full ${className ?? ''}`}
    />
  );
}
