<script setup>
import Background from '../components/Background.vue'

defineProps({
  columns: { type: Number, default: 2 },
  background: { type: String, default: '/assets/images/background.svg' },
})
</script>

<template>
  <div class="team-layout">
    <Background :src="background" />
    <h1 v-if="$slots.title" class="team-title"><slot name="title" /></h1>
    <div class="team-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <div v-for="n in 6" v-show="$slots[`person-${n}`]" :key="n" class="team-member">
        <slot :name="`person-${n}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.team-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  text-align: center;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.team-grid {
  flex: 1;
  display: grid;
  gap: 2.5rem;
  align-content: center;
  justify-items: center;
}
.team-member {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.team-member::before {
  content: '';
  display: block;
  width: 8rem;
  height: 8rem;
  border-radius: 999px;
  margin: 0 auto 0.75rem;
  background: var(--color-slate, #ccc);
  opacity: 0.5;
}
.team-member:has(:deep(img))::before {
  display: none;
}
.team-member :deep(img) {
  width: 10rem;
  height: 10rem;
  border-radius: 999px;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border: 3px solid #fff;
}
.team-member :deep(h3) {
  margin: 0;
  font-size: 2rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-primary, #fff);
}
.team-member :deep(p) {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary, #ccc);
}
</style>
