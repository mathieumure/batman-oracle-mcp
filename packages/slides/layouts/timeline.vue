<script setup>
import Background from '../components/Background.vue';

defineProps({
  steps: { type: Number, default: 4 },
  background: { type: String, default: '/assets/images/bg-cave-cove.svg' },
});
</script>

<template>
  <div class="timeline-layout">
    <Background :src="background" />
    <h1 v-if="$slots.title" class="timeline-title"><slot name="title" /></h1>
    <div class="timeline-body">
      <div class="timeline-track" :style="{ gridTemplateColumns: `repeat(${steps}, 1fr)` }">
        <div v-for="n in steps" :key="n" class="timeline-step">
          <div v-if="$slots[`heading-${n}`]" class="step-heading">
            <slot :name="`heading-${n}`" />
          </div>
          <div class="step-node">
            <span class="step-index">{{ String(n).padStart(2, '0') }}</span>
          </div>
          <div v-if="$slots[`desc-${n}`]" class="step-desc">
            <slot :name="`desc-${n}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3.5rem 4rem;
  display: flex;
  flex-direction: column;
}
.timeline-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.timeline-body {
  flex: 1;
  display: flex;
  align-items: center;
}
.timeline-track {
  width: 100%;
  display: grid;
  align-items: center;
  column-gap: 2rem;
}
.timeline-step {
  position: relative;
  text-align: center;
  padding: 0 1rem;
}
.timeline-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 3rem;
  right: -1.25rem;
  width: 0.5rem;
  height: 2px;
  background: var(--color-slate, currentColor);
  opacity: 0.6;
}
.step-heading {
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #fff);
}
.step-node {
  position: relative;
  z-index: 1;
}
.step-index {
  font-size: 3.25rem;
  font-weight: 800;
  color: var(--color-gold, currentColor);
  padding: 0 0.5rem;
}
.step-desc {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary, #ccc);
}
</style>
