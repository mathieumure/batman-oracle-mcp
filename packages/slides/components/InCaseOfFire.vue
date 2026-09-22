<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { onSlideLeave, useIsSlideActive } from '@slidev/client';
import defaultVideo from '../assets/Full_demo_mcp.webm';

const props = defineProps({
  src: {
    type: String,
    default: defaultVideo,
  },
  label: {
    type: String,
    default: "En cas d'incendie",
  },
});

const open = ref(false);
const playing = ref(false);
const videoEl = ref(null);
const isActive = useIsSlideActive();

function resetVideo() {
  const el = videoEl.value;
  if (!el) return;
  el.pause();
  el.currentTime = 0;
  playing.value = false;
}

async function togglePlay() {
  const el = videoEl.value;
  if (!el) return;
  if (playing.value) {
    el.pause();
    return;
  }
  try {
    await el.play();
  } catch {}
}

function close() {
  open.value = false;
  resetVideo();
}

async function openVideo() {
  open.value = true;
  await nextTick();
  try {
    await videoEl.value?.play();
    playing.value = true;
  } catch {
    playing.value = false;
  }
}

function onVideoPlay() {
  playing.value = true;
}

function onVideoPause() {
  playing.value = false;
}

function onKeyDown(event) {
  if (!isActive.value || !open.value || event.key !== 'Escape') return;
  event.preventDefault();
  close();
}

watch(open, (visible) => {
  if (visible) window.addEventListener('keydown', onKeyDown);
  else window.removeEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});

onSlideLeave(() => {
  close();
});
</script>

<template>
  <button
    type="button"
    class="fire-trigger"
    :aria-label="props.label"
    @click.stop="openVideo"
  >
    🛟
  </button>

  <Teleport to="body">
    <div v-if="open" class="fire-overlay" @click.self="close">
      <button type="button" class="fire-close" aria-label="Fermer" @click.stop="close">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 7l10 10M17 7 7 17"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <video
        ref="videoEl"
        class="fire-video"
        :src="props.src"
        playsinline
        @click.stop
        @play="onVideoPlay"
        @pause="onVideoPause"
        @ended="onVideoPause"
      />
      <button
        type="button"
        class="fire-play"
        :aria-label="playing ? 'Pause' : 'Lecture'"
        :aria-pressed="playing"
        @click.stop="togglePlay"
      >
        <svg v-if="!playing" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.4 5.6v12.8L18.8 12z" fill="currentColor" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 5h3.4v14H7zm6.6 0H17v14h-3.4z" fill="currentColor" />
        </svg>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.fire-trigger {
  position: absolute;
  top: 2.2rem;
  right: 2.4rem;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--color-gold) 35%, #3a4154);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-navy) 88%, #000);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
  color: #e53935;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.fire-trigger:hover {
  border-color: var(--color-gold);
}

.fire-trigger svg {
  width: 1.35rem;
  height: 1.35rem;
}

.fire-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
}

.fire-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.fire-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
}

.fire-close svg {
  width: 1.1rem;
  height: 1.1rem;
}

.fire-close:hover {
  background: rgba(255, 255, 255, 0.22);
}

.fire-play {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  cursor: pointer;
  transform: translateX(-50%);
}

.fire-play svg {
  width: 1.35rem;
  height: 1.35rem;
}

.fire-play:hover {
  background: rgba(255, 255, 255, 0.28);
}
</style>
