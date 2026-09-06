<script setup>
import { computed, ref } from 'vue';
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client';

const props = defineProps({
  split: { type: Boolean, default: false },
});

const { clicks } = useNav();
const flood = computed(() => !props.split && clicks.value >= 1);
const showConsumer = computed(() => props.split && clicks.value >= 1);
const lowered = ref(false);

onSlideEnter(() => {
  if (!props.split) return;
  lowered.value = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      lowered.value = true;
    });
  });
});

onSlideLeave(() => {
  lowered.value = false;
});
</script>

<template>
  <div class="split">
    <div class="main" :class="{ cut: split }">
      <div class="server">
        <img
          class="mcp"
          src="../../pages/02-criminals/assets/mcp.png"
          alt=""
        />
        <span>Crime Map</span>
      </div>

      <svg class="across in" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>

      <div class="slot content-slot">
        <p v-if="split" class="label">ce que Claude lit</p>
        <Transition name="swap" mode="out-in">
          <pre :key="split ? 'cut' : flood ? 'flood' : 'empty'" class="box content"><span class="hi">structuredContent</span><template v-if="split"> {
  "total": 47,
  "city": "Gotham"
}</template><template v-else-if="flood"> {
  "crimes": [
    { "id": "c-1", "lat": 40.71, "lng": -74.00 },
    { "id": "c-2", "lat": 40.73, "lng": -73.98 },
    { "id": "c-3", "lat": 40.75, "lng": -74.02 },
    { "id": "c-4", "lat": 40.68, "lng": -73.95 },
    { "id": "c-5", "lat": 40.81, "lng": -73.96 },
    { "id": "c-6", "lat": 40.70, "lng": -74.01 },
    { ... }
  ]
}
<span class="more">+ 12 000 lines</span></template><template v-else> { }</template></pre>
        </Transition>
      </div>

      <svg class="across out" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>

      <img
        class="claude"
        src="../../pages/02-criminals/assets/logos/claude.svg"
        alt="Claude"
      />

      <svg v-if="split" class="across in-meta" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>

      <div v-if="split" class="slot meta-slot">
        <p class="label">ce que le widget lit</p>
        <pre class="box meta"><span class="hi">_meta</span> {
  "city": "Gotham",
  "center": { "lat": 40.71, "lng": -74.00 },
  "crimes": [
    { "id": "c-1", "lat": 40.71, "lng": -74.00 },
    { "id": "c-2", "lat": 40.73, "lng": -73.98 },
    { ... }
  ]
}</pre>
      </div>

      <div v-if="split" class="block">
        <svg class="across" :class="{ dead: !showConsumer }" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
        <span v-if="!showConsumer" class="mark">✕</span>
      </div>

      <div v-if="split" class="widget" :class="{ ready: showConsumer }">iframe</div>
    </div>

    <div class="gauge">
      <span>Contexte de l'agent</span>
      <div class="track">
        <div
          class="fill"
          :class="{ hot: flood || (split && !lowered), calm: split && lowered }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.split {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 2rem 3.2rem 1.6rem;
}

.main {
  display: grid;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  grid-template-columns: auto auto 30rem auto auto;
  column-gap: 0.7rem;
  row-gap: 0.85rem;
}

.main.cut .server {
  grid-row: 1 / 3;
}

.server {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  grid-column: 1;
  grid-row: 1;
  view-transition-name: split-mcp;
}

.mcp {
  width: 2.4rem;
  height: 2.4rem;
  object-fit: contain;
}

.server span {
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
}

.in {
  grid-column: 2;
  grid-row: 1;
  view-transition-name: split-arrow-in;
}

.content-slot {
  grid-column: 3;
  grid-row: 1;
}

.content {
  width: 30rem;
  box-sizing: border-box;
  view-transition-name: split-content;
}

.out {
  grid-column: 4;
  grid-row: 1;
  view-transition-name: split-arrow-out;
}

.claude {
  width: 1.9rem;
  height: 1.9rem;
  grid-column: 5;
  grid-row: 1;
  view-transition-name: split-claude;
}

.in-meta {
  grid-column: 2;
  grid-row: 2;
}

.meta-slot {
  grid-column: 3;
  grid-row: 2;
}

.meta {
  width: 30rem;
  box-sizing: border-box;
}

.slot {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.45rem;
}

.label {
  margin: 0;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
}

.block {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 4;
  grid-row: 2;
}

.widget {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 5;
  grid-row: 2;
  width: 4.4rem;
  height: 2.2rem;
  border: 1.5px dashed #6e5a10;
  border-radius: 6px;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  visibility: hidden;
}

.widget.ready {
  visibility: visible;
}

.across {
  width: 1.7rem;
  height: 1.7rem;
  fill: #988829;
}

.across.dead {
  fill: #c44;
}

.mark {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  background: #c44;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  transform: translate(-50%, -50%);
}

.box {
  padding: 0.85rem 1.1rem;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #141414;
}

pre {
  margin: 0;
  color: #d4d4d4;
  font-size: 0.78rem;
  line-height: 1.5;
  white-space: pre;
}

.hi {
  color: #988829;
}

.more {
  display: block;
  margin-top: 0.3rem;
  color: #888;
  font-size: 0.68rem;
}

.gauge {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: min(36rem, 100%);
  margin: 0.8rem auto 0;
  view-transition-name: split-gauge;
}

.gauge span {
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}

.track {
  box-sizing: border-box;
  height: 0.65rem;
  overflow: hidden;
  border: 1px solid #fff;
  border-radius: 999px;
  background: #2a2a2a;
}

.fill {
  width: 0;
  height: 100%;
  border-radius: 999px;
  background: #988829;
  transition: width 0.7s ease, background-color 0.7s ease;
}

.fill.hot {
  width: 94%;
  background: #c23b3b;
}

.fill.calm {
  width: 14%;
  background: #988829;
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: translateY(0.4rem) scale(0.98);
}
</style>
