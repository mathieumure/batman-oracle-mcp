<script setup>
import Background from '../components/Background.vue';

defineProps({
  side: { type: String, default: 'right' }, // 'right' | 'left'
  background: { type: String, default: '/assets/images/background.svg' },
});
</script>

<template>
  <div class="mockup-layout" :class="`side-${side}`">
    <Background :src="background" />
    <div class="mockup-text">
      <h1 v-if="$slots.title"><slot name="title" /></h1>
      <div class="mockup-desc"><slot /></div>
    </div>
    <div class="mockup-content">
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped>
.mockup-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3.5rem 4rem;
  display: flex;
  align-items: center;
  gap: 3rem;
}
.mockup-layout.side-left {
  flex-direction: row-reverse;
}
.mockup-text {
  flex: 1;
}
.mockup-text h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 1rem;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.mockup-desc {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-secondary, #ccc);
}
.mockup-content {
  flex: 1.2;
}
</style>
