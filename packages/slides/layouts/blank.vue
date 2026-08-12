<script setup>
import Background from '../components/Background.vue';

defineProps({
  background: { type: String, default: '' },
});
</script>

<template>
  <div class="blank-layout">
    <Background :src="background" />
    <slot />
  </div>
</template>

<style scoped>
.blank-layout {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: var(--color-navy, #1a1a1a);
  color: var(--text-primary, #fff);
}
</style>
