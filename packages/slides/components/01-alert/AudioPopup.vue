<script setup>
import { ref } from 'vue';
import { onSlideEnter, onSlideLeave } from '@slidev/client';

const audio = ref(null);
const playing = ref(false);
const open = ref(false);
const current = ref(0);
const duration = ref(0);

function pad(n) {
  return String(n).padStart(2, '0');
}

function alfredStamp(date = new Date(Date.now() - 86_400_000)) {
  return `alfred-${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
}

const fileName = ref(alfredStamp());

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

async function toggle() {
  const el = audio.value;
  if (!el) return;
  if (playing.value) {
    el.pause();
    playing.value = false;
    return;
  }
  try {
    await el.play();
    playing.value = true;
  } catch {
    playing.value = false;
  }
}

function onTime() {
  const el = audio.value;
  if (!el) return;
  current.value = el.currentTime;
  duration.value = el.duration || 0;
}

function onEnded() {
  playing.value = false;
  current.value = 0;
}

function resetAudio() {
  audio.value?.pause();
  if (audio.value) audio.value.currentTime = 0;
  playing.value = false;
  current.value = 0;
}

onSlideEnter(() => {
  fileName.value = alfredStamp();
  open.value = false;
  requestAnimationFrame(() => {
    open.value = true;
  });
});

onSlideLeave(() => {
  open.value = false;
  resetAudio();
});
</script>

<template>
  <div class="audio-stage">
    <div class="audio-window" :class="{ in: open }">
      <MacWindow title="Bat-USB" height="168px" style="width: 100%">
        <div class="player">
          <button type="button" class="player-play" :aria-pressed="playing" @click.stop="toggle">
            <svg v-if="!playing" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.4 5.6v12.8L18.8 12z" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3.4v14H7zm6.6 0H17v14h-3.4z" fill="currentColor" />
            </svg>
          </button>
          <div class="player-main">
            <p class="player-title">{{ fileName }}</p>
            <div class="player-bar">
              <span class="player-time">{{ formatTime(current) }}</span>
              <span class="player-track">
                <span
                  class="player-fill"
                  :style="{ width: duration ? `${(current / duration) * 100}%` : '0%' }"
                />
              </span>
              <span class="player-time">{{ duration ? formatTime(duration) : '-:--' }}</span>
            </div>
          </div>
          <audio
            ref="audio"
            src="../../pages/01-alert/assets/alfred.mp3"
            preload="metadata"
            @timeupdate="onTime"
            @loadedmetadata="onTime"
            @ended="onEnded"
          />
        </div>
      </MacWindow>
    </div>
  </div>
</template>

<style scoped>
.audio-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.audio-window {
  width: min(78%, 620px);
  opacity: 0;
  transform: scale(0.84) translateY(22px);
}

.audio-window.in {
  animation: popup-in 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.player {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 0 1.4rem;
  background: #ececec;
}

.player-play {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #1d1d1f;
  color: #fff;
  cursor: pointer;
}

.player-play svg {
  width: 22px;
  height: 22px;
}

.player-play:hover {
  background: #2c2c2e;
}

.player-main {
  flex: 1;
  min-width: 0;
}

.player-title {
  margin: 0 0 0.55rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.88rem;
  font-weight: 600;
  color: #222;
}

.player-bar {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.player-time {
  width: 2.2rem;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.68rem;
  color: #666;
  font-variant-numeric: tabular-nums;
}

.player-track {
  position: relative;
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: #c8c8c8;
  overflow: hidden;
}

.player-fill {
  display: block;
  height: 100%;
  background: #1d1d1f;
}

@keyframes popup-in {
  from {
    opacity: 0;
    transform: scale(0.84) translateY(22px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
