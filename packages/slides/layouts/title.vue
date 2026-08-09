<script setup>
import Background from '../components/Background.vue'

defineProps({
  align: { type: String, default: 'center' }, // 'center' | 'left'
  background: { type: String, default: '/assets/images/bg-cave-drip.svg' },
  numberSize: { type: String, default: '5rem' },
  titleSize: { type: String, default: '5rem' },
})
</script>

<template>
  <div class="title-layout" :class="`align-${align}`">
    <Background :src="background" />
    <div v-if="$slots.number" class="title-number" :style="{ fontSize: numberSize }">
      <slot name="number" />
    </div>
    <h1 :style="{ fontSize: titleSize }"><slot /></h1>
    <p v-if="$slots.subtitle" class="title-subtitle"><slot name="subtitle" /></p>
  </div>
</template>

<style scoped>
.title-layout {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 6rem;
  gap: 0.75rem;
}
.title-layout.align-center {
  align-items: center;
  text-align: center;
}
.title-layout.align-left {
  align-items: flex-start;
  text-align: left;
}
.title-number * {
  font-weight: 800;
  color: var(--color-gold, currentColor);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
h1 * {
  line-height: 1.15;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.title-subtitle {
  font-size: 1.15rem;
  max-width: 32rem;
  margin: 0.5rem 0 0;
  color: var(--text-secondary, #ccc);
}
</style>
