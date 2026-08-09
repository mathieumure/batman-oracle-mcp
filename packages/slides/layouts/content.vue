<script setup>
import Background from '../components/Background.vue'

defineProps({
  columns: { type: Number, default: 1 },
  background: { type: String, default: '/assets/images/background.svg' },
})
</script>

<template>
  <div class="content-layout">
    <Background :src="background" />
    <h1 v-if="$slots.title" class="content-title"><slot name="title" /></h1>
    <div
      class="content-body"
      :style="{ gridTemplateColumns: columns > 1 ? `repeat(${columns}, 1fr)` : '1fr' }"
    >
      <div class="content-col"><slot /></div>
      <div v-if="columns > 1" class="content-col"><slot name="col-2" /></div>
    </div>
  </div>
</template>

<style scoped>
.content-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.content-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.content-body {
  display: grid;
  grid-template-rows: 1fr;
  gap: 2.5rem;
  flex: 1;
  min-height: 0;
}
.content-col {
  min-height: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-secondary, #ccc);
}
.content-col :deep(ul) {
  padding-left: 1.2rem;
}
</style>
