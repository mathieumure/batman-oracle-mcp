<script setup>
import { computed } from 'vue';
import { useNav } from '@slidev/client';

const { clicks } = useNav();
const showPositions = computed(() => clicks.value >= 1);
const showDots = computed(() => clicks.value >= 2);
const showNeed = computed(() => clicks.value >= 3);
</script>

<template>
  <div class="recap">
    <div class="row">
      <p>Contexte</p>
      <div class="gauge">
        <div class="fill" />
      </div>
      <span class="check">✓</span>
    </div>

    <div v-if="showPositions" class="row pop">
      <p>Positions</p>
      <div class="pins">
        <CrimePin name="recap-loc-1" />
        <span class="trail" />
        <CrimePin name="recap-loc-2" />
      </div>
      <span class="check">✓</span>
    </div>

    <div v-if="showDots" class="row pop">
      <p>{{ showNeed ? 'Preuves' : '...' }}</p>
      <img
        v-if="showNeed"
        class="gcpd"
        src="../../pages/03-map/assets/gcpd-logo.png"
        alt="GCPD"
      />
    </div>
  </div>
</template>

<style scoped>
.recap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.8rem;
  width: 100%;
  height: 100%;
  padding: 2.4rem 3.2rem;
}

.row {
  display: grid;
  grid-template-columns: 14rem 12rem 2rem;
  align-items: center;
  justify-items: center;
  column-gap: 1.2rem;
}

.row p {
  margin: 0;
  justify-self: start;
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
}

.gauge {
  box-sizing: border-box;
  width: 12rem;
  height: 0.55rem;
  border: 1px solid #fff;
  border-radius: 999px;
  background: #2a2a2a;
  view-transition-name: split-gauge;
}

.fill {
  width: 14%;
  height: 100%;
  border-radius: 999px;
  background: #988829;
}

.pins {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 12rem;
}

.trail {
  flex: 1;
  height: 0.28rem;
  margin: 0 0.15rem;
  background-image: radial-gradient(circle, #fff 1.15px, transparent 1.25px);
  background-repeat: repeat-x;
  background-position: center;
  background-size: 0.52rem 0.28rem;
}

.check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  background: #6a9a4a;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
}

.gcpd {
  width: 12rem;
  max-height: 3.2rem;
  object-fit: contain;
}

.pop {
  animation: pop 0.35s ease;
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: translateY(0.35rem);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}
</style>
