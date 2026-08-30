<script setup>
import { ref } from 'vue';
import { onSlideEnter, onSlideLeave, useIsSlideActive } from '@slidev/client';

const WAIT_MS = 2200;
const RING_COUNT = 4;

const listening = ref(false);
const waiting = ref(false);
const noAnswer = ref(false);
const finishing = ref(false);
const settled = ref(Array.from({ length: RING_COUNT }, () => false));
const started = ref(Array.from({ length: RING_COUNT }, () => false));
const isActive = useIsSlideActive();
let waitTimer = null;

function isTalkKey(event) {
  return event.key === 't' || event.key === 'T';
}

function clearWait() {
  if (waitTimer) {
    clearTimeout(waitTimer);
    waitTimer = null;
  }
}

function resetRings() {
  finishing.value = false;
  settled.value = Array.from({ length: RING_COUNT }, () => false);
  started.value = Array.from({ length: RING_COUNT }, () => false);
}

function settleUnstarted() {
  settled.value = settled.value.map((done, index) => done || !started.value[index]);
  if (settled.value.every(Boolean)) finishing.value = false;
}

function reset() {
  clearWait();
  listening.value = false;
  waiting.value = false;
  noAnswer.value = false;
  resetRings();
}

function onKeyDown(event) {
  if (!isActive.value || !isTalkKey(event) || event.repeat) return;
  event.preventDefault();
  clearWait();
  waiting.value = false;
  noAnswer.value = false;
  resetRings();
  listening.value = true;
}

function onKeyUp(event) {
  if (!isActive.value || !isTalkKey(event) || !listening.value) return;
  event.preventDefault();
  listening.value = false;
  finishing.value = false;
  settled.value = Array.from({ length: RING_COUNT }, () => true);
  waiting.value = true;
  waitTimer = setTimeout(() => {
    waiting.value = false;
    finishing.value = false;
    settled.value = Array.from({ length: RING_COUNT }, () => true);
    noAnswer.value = true;
    waitTimer = null;
  }, WAIT_MS);
}

function onRingStart(index) {
  if (finishing.value || noAnswer.value) return;
  const next = [...started.value];
  next[index] = true;
  started.value = next;
}

function onRingEnd(index) {
  if (!finishing.value && !noAnswer.value) return;
  const next = [...settled.value];
  next[index] = true;
  settled.value = next;
  if (next.every(Boolean)) finishing.value = false;
}

onSlideEnter(() => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
});

onSlideLeave(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  reset();
});
</script>

<template>
  <div class="ptt">
    <div class="ptt-orb" :class="{ listening, waiting, finishing, waving: listening || finishing }">
      <span
        v-for="index in RING_COUNT"
        :key="index"
        class="ptt-ring"
        :class="{ settled: settled[index - 1] }"
        :style="{ animationDelay: `${(index - 1) * 0.35}s` }"
        @animationstart="onRingStart(index - 1)"
        @animationend="onRingEnd(index - 1)"
      />
      <span class="ptt-glow" :class="{ on: listening || waiting }" />
      <img
        src="../../pages/01-alert/assets/batman-logo.svg"
        alt=""
        class="ptt-bat"
        :class="{ fail: noAnswer }"
      />
      <p v-if="waiting" class="ptt-status ptt-loading" aria-live="polite">
        <span /><span /><span />
      </p>
      <p v-else-if="noAnswer" class="ptt-status ptt-silence">
        Aucune réponse
      </p>
    </div>
  </div>
</template>

<style scoped>
.ptt {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ptt-orb {
  position: relative;
  width: min(78vmin, 640px);
  height: min(78vmin, 640px);
}

.ptt-ring {
  position: absolute;
  inset: 22%;
  border-radius: 50%;
  border: 1.5px solid color-mix(in srgb, var(--color-yellow) 50%, transparent);
  opacity: 0;
  transform: scale(0.7);
  pointer-events: none;
}

.ptt-orb.waving .ptt-ring:not(.settled) {
  animation: ptt-pulse 2.2s ease-out infinite;
}

.ptt-ring.settled {
  animation: none;
  opacity: 0;
}

.ptt-glow {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  width: 46%;
  height: 28%;
  border-radius: 50%;
  background: var(--color-yellow);
  filter: blur(36px);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.25s ease;
}

.ptt-glow.on {
  opacity: 0.32;
}

.ptt-bat {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  width: min(26vmin, 200px);
  transform: translate(-50%, -50%);
}

.ptt-bat.fail {
  animation: ptt-shake 0.5s ease;
}

.ptt-status {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: calc(50% + 8.5rem);
  margin: 0;
  white-space: nowrap;
  transform: translateX(-50%);
}

.ptt-silence {
  font-family: Trajan, serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.ptt-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
}

.ptt-loading span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-gold);
  opacity: 0.45;
  animation: ptt-dot 1s ease-in-out infinite;
}

.ptt-loading span:nth-child(2) {
  animation-delay: 0.15s;
}

.ptt-loading span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes ptt-pulse {
  0% {
    opacity: 0.65;
    transform: scale(0.75);
  }
  100% {
    opacity: 0;
    transform: scale(2.85);
  }
}

@keyframes ptt-dot {
  0%,
  80%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@keyframes ptt-shake {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }
  20% {
    transform: translate(calc(-50% - 7px), -50%);
  }
  40% {
    transform: translate(calc(-50% + 7px), -50%);
  }
  60% {
    transform: translate(calc(-50% - 4px), -50%);
  }
  80% {
    transform: translate(calc(-50% + 4px), -50%);
  }
}
</style>
