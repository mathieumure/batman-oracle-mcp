<script setup>
import Background from '../components/Background.vue'

defineProps({
  background: { type: String, default: '/assets/images/bg-cave-canyon.svg' },
})
</script>

<template>
  <div class="thanks-layout">
    <Background :src="background" />
    <div class="thanks-body">
      <h1><slot /></h1>
      <p v-if="$slots.question" class="thanks-question"><slot name="question" /></p>
    </div>
  </div>
</template>

<style scoped>
.thanks-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3.5rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.thanks-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
h1 {
  font-size: 5rem;
  font-weight: 800;
  margin: 0;
  text-transform: uppercase;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.thanks-question {
  font-size: 1.5rem;
  text-transform: uppercase;
  font-weight: 900;
  margin: 0;
  color: var(--text-primary, #fff);
}
</style>
