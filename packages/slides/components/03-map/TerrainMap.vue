<script setup>
import { computed } from 'vue';
import { useNav } from '@slidev/client';

const { clicks } = useNav();
const flood = computed(() => clicks.value >= 1);
const filters = computed(() => clicks.value >= 2);

const pins = [
  { name: 'terrain-pin-1', x: 28, y: 42 },
  { name: 'terrain-pin-2', x: 54, y: 28 },
  { name: 'terrain-pin-3', x: 71, y: 63 },
];

const extra = [
  [12, 18, 0], [16, 32, 0.12], [11, 48, 0], [18, 62, 0.28],
  [14, 76, 0.08], [22, 20, 0], [26, 34, 0.2], [20, 50, 0],
  [24, 64, 0.36], [30, 16, 0], [33, 30, 0.16], [29, 54, 0],
  [32, 68, 0.24], [36, 80, 0], [38, 18, 0.32], [42, 34, 0],
  [39, 50, 0.1], [44, 62, 0], [41, 76, 0.4], [48, 14, 0],
  [50, 28, 0.18], [46, 44, 0], [52, 56, 0.08], [48, 70, 0.44],
  [54, 80, 0], [58, 16, 0.22], [61, 32, 0], [57, 46, 0.14],
  [62, 60, 0], [58, 74, 0.3], [66, 20, 0], [69, 36, 0.06],
  [64, 50, 0.38], [70, 64, 0], [66, 78, 0.16], [74, 14, 0],
  [78, 28, 0.26], [73, 44, 0], [76, 58, 0.1], [80, 72, 0],
  [84, 20, 0.34], [88, 36, 0], [83, 50, 0.18], [87, 64, 0],
  [84, 78, 0.42], [8, 28, 0], [9, 66, 0.2], [92, 24, 0],
  [91, 52, 0.12], [90, 76, 0], [34, 42, 0.48], [56, 52, 0],
  [72, 22, 0.08], [25, 78, 0], [47, 22, 0.28], [63, 40, 0],
  [15, 40, 0.16], [81, 42, 0.36], [37, 58, 0], [53, 38, 0.22],
  [3, 11, 0.14], [12, 10, 0], [22, 11, 0.26], [33, 10, 0.08],
  [44, 11, 0], [55, 10, 0.2], [66, 11, 0], [77, 10, 0.32],
  [88, 11, 0], [97, 11, 0.18], [2.5, 22, 0], [2.5, 36, 0.24],
  [2.5, 50, 0], [2.5, 64, 0.36], [2.5, 78, 0.1], [3, 92, 0],
  [14, 97, 0.16], [25, 98, 0], [36, 97, 0.28], [47, 98, 0],
  [58, 97, 0.12], [69, 98, 0], [80, 97, 0.3], [91, 98, 0],
  [97, 92, 0.08], [97.5, 78, 0], [97.5, 64, 0.22], [97.5, 50, 0],
  [97.5, 36, 0.4], [97.5, 22, 0], [8, 96, 0.18], [97, 96, 0.34],
];
</script>

<template>
  <div class="terrain">
    <div class="frame">
      <svg class="fake" viewBox="0 0 800 420" aria-hidden="true">
        <rect width="800" height="420" fill="#161616" />
        <path
          fill="#1c2430"
          d="M0 250 C 140 210, 220 280, 340 240 S 520 180, 800 220 V 420 H 0 Z"
        />
        <path
          fill="none"
          stroke="#2a2a2a"
          stroke-width="14"
          d="M0 80 H800 M0 160 H800 M0 240 H800 M0 320 H800"
        />
        <path
          fill="none"
          stroke="#2a2a2a"
          stroke-width="14"
          d="M80 0 V420 M200 0 V420 M360 0 V420 M520 0 V420 M660 0 V420"
        />
        <path
          fill="none"
          stroke="#3a3a3a"
          stroke-width="8"
          d="M0 110 L180 90 L340 140 L520 70 L800 120"
        />
        <path
          fill="none"
          stroke="#3a3a3a"
          stroke-width="8"
          d="M120 0 L200 180 L160 420"
        />
        <path
          fill="none"
          stroke="#505c7c"
          stroke-width="18"
          stroke-linecap="round"
          d="M-20 300 C 180 260, 300 340, 480 300 S 720 250, 820 280"
        />
        <path
          fill="#202020"
          d="M430 150 h90 v70 h-90 z M250 200 h70 v50 h-70 z M580 250 h80 v60 h-80 z"
        />
      </svg>
      <MapPin
        v-for="pin in pins"
        :key="pin.name"
        :name="pin.name"
        class="spot"
        :style="{ left: pin.x + '%', top: pin.y + '%' }"
      />
      <template v-for="(pos, i) in extra" :key="'extra-' + i">
        <MapPin
          v-if="flood"
          :name="'extra-' + i"
          class="spot extra"
          :style="{
            left: pos[0] + '%',
            top: pos[1] + '%',
            animationDelay: pos[2] + 's',
          }"
        />
      </template>
      <span v-if="filters" class="filters">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16l-6 7v6l-4-2v-4z" />
        </svg>
        Filtres
      </span>
    </div>
  </div>
</template>

<style scoped>
.terrain {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2.4rem 2.8rem;
}

.frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1.5px dashed #6e5a10;
  border-radius: 8px;
  background: #141414;
}

.fake {
  display: block;
  width: 100%;
  height: 100%;
}

.spot {
  position: absolute;
  z-index: 3;
  width: 1.9rem;
  height: 2.5rem;
  transform: translate(-50%, -100%);
}

.extra {
  z-index: 2;
  animation: pop 0.35s ease both;
}

.filters {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  border: 0;
  border-radius: 6px;
  background: #fff;
  color: #111;
  font-size: 0.82rem;
  font-weight: 700;
  animation: chip-pop 0.35s ease;
}

.filters svg {
  width: 0.95rem;
  height: 0.95rem;
  fill: #111;
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.72);
  }

  70% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1.08);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
}

@keyframes chip-pop {
  0% {
    opacity: 0;
    transform: scale(0.72);
  }

  70% {
    opacity: 1;
    transform: scale(1.08);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
