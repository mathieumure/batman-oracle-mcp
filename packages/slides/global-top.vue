<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useNav } from '@slidev/client';

const TRIGGER_PAGES = [1,7,12,17,24,28,34,38];
const SWARM_TOTAL = 1.8;
const NAV_AT = SWARM_TOTAL * 0.5;
const COUNT = 17000;
const WAVE_GATES = [0, 0.12, 0.35, 0.58];

const nav = useNav();
const { currentPage, clicks, clicksTotal } = nav;
const canvas = ref(null);
const active = ref(false);

let raf = 0;
let bats = [];
let W = 0;
let H = 0;
let origNext = null;
let origNextSlide = null;

const easeIn = (u) => u * u * (3 - 2 * u) * 0.35 + u * 0.65;

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function shouldRunExit() {
  if (TRIGGER_PAGES.length && !TRIGGER_PAGES.includes(currentPage.value)) return false;
  return true;
}

function willAdvanceSlideOnNext() {
  return clicks.value >= clicksTotal.value;
}

function swarmProgress(t) {
  const u = Math.min(1, t / SWARM_TOTAL);
  return u ** 2.2;
}

function spawn() {
  const count = COUNT;
  const unit = Math.min(W, H) / 900;
  bats = Array.from({ length: count }, (_, i) => {
    const d = Math.random() ** 2.2;
    const size = (16 + d * 120) * Math.max(unit, 0.6);
    const wave = Math.min(WAVE_GATES.length - 1, Math.floor((i / count) * WAVE_GATES.length));
    return {
      size,
      waveThreshold: WAVE_GATES[wave],
      delay: Math.random() * 0.35,
      dur: 1.6 - d * 0.5 + Math.random() * 0.4,
      x0: -W * 0.1 + Math.random() * W * 1.2,
      y0: H * (0.95 + Math.random() * 0.4),
      dx: (Math.random() - 0.3) * W * 0.5,
      dy: -(H * 1.6 + Math.random() * H * 0.4),
      amp: 20 + Math.random() * 70,
      freq: 2 + Math.random() * 4,
      ph: Math.random() * Math.PI * 2,
      flap: 14 + Math.random() * 8 - d * 4,
      px: 0,
    };
  }).sort((a, b) => a.size - b.size);
}

function drawBat(ctx, b, x, y, tilt, t) {
  const s = b.size;
  const L = s / 2;
  const A = Math.sin(t * b.flap + b.ph) * 0.9;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);

  for (const side of [1, -1]) {
    ctx.save();
    ctx.scale(side, 1);
    ctx.rotate(-A);
    ctx.beginPath();
    ctx.moveTo(0, -0.05 * L);
    ctx.quadraticCurveTo(0.45 * L, -0.4 * L, L, -0.1 * L);
    ctx.quadraticCurveTo(0.85 * L, 0.1 * L, 0.72 * L, 0.3 * L);
    ctx.quadraticCurveTo(0.55 * L, 0.12 * L, 0.42 * L, 0.32 * L);
    ctx.quadraticCurveTo(0.25 * L, 0.15 * L, 0.1 * L, 0.36 * L);
    ctx.lineTo(0, 0.2 * L);
    ctx.closePath();
    ctx.fill();
    if (s > 40) ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.ellipse(0, 0.04 * s, 0.06 * s, 0.12 * s, 0, 0, Math.PI * 2);
  ctx.arc(0, -0.1 * s, 0.05 * s, 0, Math.PI * 2);
  ctx.moveTo(-0.05 * s, -0.12 * s);
  ctx.lineTo(-0.04 * s, -0.22 * s);
  ctx.lineTo(-0.01 * s, -0.14 * s);
  ctx.moveTo(0.05 * s, -0.12 * s);
  ctx.lineTo(0.04 * s, -0.22 * s);
  ctx.lineTo(0.01 * s, -0.14 * s);
  ctx.fill();

  ctx.restore();
}

function drawSwarmFrame(ctx, t) {
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#05070b';
  ctx.strokeStyle = 'rgba(130, 160, 210, 0.28)';
  ctx.lineWidth = 1;

  const progress = swarmProgress(t);
  for (const b of bats) {
    if (progress < b.waveThreshold) continue;
    const u = (t - b.delay) / b.dur;
    if (u < 0 || u > 1) continue;
    const e = easeIn(u);
    const x = b.x0 + b.dx * e + Math.sin(u * b.freq + b.ph) * b.amp;
    const y = b.y0 + b.dy * e;
    const tilt = Math.max(-0.5, Math.min(0.5, (x - (b.px || x)) * 0.08));
    b.px = x;
    drawBat(ctx, b, x, y, tilt, t);
  }
}

function runExit(advanceSlide) {
  const c = canvas.value;
  if (!c || active.value) return Promise.resolve();

  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  c.width = W * dpr;
  c.height = H * dpr;
  const ctx = c.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  spawn();
  active.value = true;
  const swarmStart = performance.now();
  let navDone = false;

  return new Promise((resolve) => {
    const frame = (now) => {
      const t = (now - swarmStart) / 1000;

      drawSwarmFrame(ctx, t);
      if (!navDone && t >= NAV_AT) {
        navDone = true;
        Promise.resolve(advanceSlide());
      }
      if (t >= SWARM_TOTAL) {
        ctx.clearRect(0, 0, W, H);
        active.value = false;
        resolve();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  });
}

function startExitIfNeeded(advance) {
  if (active.value) return Promise.resolve();
  return runExit(advance);
}

function onKeyDown(event) {
  if (event.key !== 'ArrowRight' && event.key !== ' ' && event.key !== 'PageDown') return;
  if (event.target?.closest('input, textarea, [contenteditable="true"]')) return;
  if (!shouldRunExit() || !willAdvanceSlideOnNext() || reducedMotion()) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  startExitIfNeeded(() => origNext());
}

onMounted(() => {
  origNext = nav.next.bind(nav);
  origNextSlide = nav.nextSlide.bind(nav);

  nav.next = async (...args) => {
    if (shouldRunExit() && willAdvanceSlideOnNext() && !reducedMotion()) return startExitIfNeeded(() => origNext(...args));
    return origNext(...args);
  };

  nav.nextSlide = async (...args) => {
    if (shouldRunExit() && !reducedMotion()) return startExitIfNeeded(() => origNextSlide(...args));
    return origNextSlide(...args);
  };

  window.addEventListener('keydown', onKeyDown, true);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener('keydown', onKeyDown, true);
  if (origNext) nav.next = origNext;
  if (origNextSlide) nav.nextSlide = origNextSlide;
});
</script>

<template>
  <canvas ref="canvas" v-show="active" class="bat-swarm" />
</template>

<style scoped>
.bat-swarm {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}
</style>
