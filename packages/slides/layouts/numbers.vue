<script setup>
import Background from '../components/Background.vue';

defineProps({
  columns: { type: Number, default: 3 },
  background: { type: String, default: '/assets/images/bg-cave-stalactites.svg' },
});
</script>

<template>
  <div class="numbers-layout">
    <Background :src="background" />
    <h1 v-if="$slots.title" class="numbers-title"><slot name="title" /></h1>
    <div class="numbers-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <div v-for="n in 6" v-show="$slots[`item-${n}`]" :key="n" class="numbers-item">
        <slot :name="`item-${n}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.numbers-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.numbers-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  text-align: center;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.numbers-grid {
  flex: 1;
  display: grid;
  gap: 2rem 2.5rem;
  align-content: center;
}
.numbers-item {
  text-align: center;
}
.numbers-item :deep(.item-number) {
  display: block;
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-yellow, currentColor);
  line-height: 1;
  margin-bottom: 0.25rem;
}
.numbers-item :deep(h3) {
  margin: 0.25rem 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary, #fff);
}
.numbers-item :deep(p) {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary, #ccc);
}
</style>
