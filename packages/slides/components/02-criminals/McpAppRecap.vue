<script setup>
import { computed } from 'vue';
import { useNav } from '@slidev/client';

const { clicks } = useNav();
const showPins = computed(() => clicks.value >= 1);
</script>

<template>
  <div class="recap">
    <h1>Une première interface</h1>
    <div class="row">
      <div class="pane">
        <span class="tag">JSON</span>
        <pre>{
  "criminals": [
    { "name": "Joker", ... },
    { "name": "Penguin", ... },
    { ... }
  ]
}
<span class="more">+ 24 000 lines</span></pre>
      </div>

      <svg class="arrow" viewBox="0 0 80 24" aria-hidden="true">
        <path d="M10 12 H66" />
        <path d="M56 5 L68 12 L56 19" />
      </svg>

      <div class="pane ui">
        <span class="tag">UI</span>
        <div class="cards">
          <div v-for="n in 3" :key="n" class="card">
            <span class="skel image" />
            <span class="skel line" />
            <span class="skel line short" />
            <span class="pin-slot">
              <MapPin v-if="showPins" class="pop" :name="`terrain-pin-${n}`" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.4rem;
  width: 100%;
  height: 100%;
  padding: 2.4rem 3.2rem;
}

h1 {
  margin: 0;
  color: var(--text-primary, #fff);
  font-size: 1.85rem;
  font-weight: 800;
  text-align: center;
}

.row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 1.4rem;
  width: 100%;
}

.pane {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 22rem;
  padding: 1.15rem 0.85rem 0.85rem;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #141414;
}

.tag {
  position: absolute;
  top: -0.55rem;
  left: 0.7rem;
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  background: #6e5a10;
  color: #fff;
  font-size: 0.58rem;
  font-weight: 800;
}

pre {
  margin: 0;
  color: #d4d4d4;
  font-size: 0.68rem;
  line-height: 1.45;
  white-space: pre;
}

.more {
  display: block;
  margin-top: 0.35rem;
  color: #888;
  font-size: 0.62rem;
}

.arrow {
  flex: 0 0 4.2rem;
  align-self: center;
  height: 1.8rem;
  fill: none;
  stroke: #988829;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cards {
  display: flex;
  flex: 1;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.4rem;
  border-radius: 8px;
  background: #1e1e1e;
}

.skel {
  display: block;
  border-radius: 4px;
  background: #2f2f2f;
}

.skel.image {
  flex: 1;
  min-height: 3.2rem;
  border-radius: 6px;
}

.pin-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.05rem;
  margin-top: 0.15rem;
}

.pop {
  animation: pop 0.35s ease;
}

@keyframes pop {
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

.skel.line {
  height: 0.4rem;
  width: 88%;
}

.skel.line.short {
  width: 58%;
}
</style>
