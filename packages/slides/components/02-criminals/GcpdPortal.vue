<script setup>
import { ref } from 'vue';
import { onSlideLeave } from '@slidev/client';
import ScaledIframe from '../ScaledIframe.vue';

const open = ref(false);

function consult() {
  open.value = true;
}

onSlideLeave(() => {
  open.value = false;
});
</script>

<template>
  <div class="gcpd-portal">
    <MacWindow title="https://gcpd.gov" height="500px" content-bg="#000" style="width: min(78%, 720px)">
      <div class="gcpd-home">
        <img class="gcpd-badge" src="../../pages/02-criminals/assets/gcpd.jpg" alt="GCPD" />
        <button type="button" class="gcpd-cta" @click.stop="consult">
          <svg class="gcpd-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
            <ellipse cx="12" cy="6" rx="7" ry="2.6" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="M5 6v8.5c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6V6" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="M5 10.2c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6" fill="none" stroke="currentColor" stroke-width="1.7" />
          </svg>
          Consulter la base de données
        </button>
      </div>
    </MacWindow>

    <div v-if="open" class="gcpd-overlay" @click.stop>
      <div class="gcpd-swagger" :class="{ in: open }">
        <MacWindow title="https://api.gcpd.com/swagger" height="500px" style="width: 100%">
          <ScaledIframe src="http://127.0.0.1:8080/swagger" />
        </MacWindow>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gcpd-portal {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 4rem;
}

.gcpd-home {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;
  padding: 1.2rem 1.5rem 1.6rem;
  background: #000;
}

.gcpd-badge {
  width: min(78%, 280px);
  height: auto;
  object-fit: contain;
}

.gcpd-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 0;
  border-radius: 4px;
  padding: 0.55rem 1.1rem;
  background: #fff;
  color: #111;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.gcpd-cta-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.gcpd-cta:hover {
  background: #f2f2f2;
}

.gcpd-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 4rem;
  background: rgba(0, 0, 0, 0.45);
}

.gcpd-swagger {
  width: min(92%, 980px);
  opacity: 0;
  transform: scale(0.84) translateY(22px);
}

.gcpd-swagger.in {
  animation: popup-in 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
