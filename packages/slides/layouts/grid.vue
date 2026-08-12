<script setup>
import Background from '../components/Background.vue';

defineProps({
  columns: { type: Number, default: 2 },
  background: { type: String, default: '/assets/images/bg-cave-hills.svg' },
});
</script>

<template>
  <div class="grid-layout">
    <Background :src="background" />
    <h1 v-if="$slots.title" class="grid-title"><slot name="title" /></h1>
    <div class="grid-body" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <div v-for="n in 6" v-show="$slots[`item-${n}`]" :key="n" class="grid-cell">
        <slot :name="`item-${n}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.grid-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.grid-body {
  flex: 1;
  display: grid;
  gap: 1.5rem;
}
.grid-cell {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
}
.grid-cell :deep(h3) {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary, #fff);
}
.grid-cell :deep(p) {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary, #ccc);
}
</style>
