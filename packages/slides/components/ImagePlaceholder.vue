<script setup>
defineProps({
  label: { type: String, default: 'Image' },
  ratio: { type: String, default: '16 / 10' },
})
</script>

<template>
  <div class="image-placeholder" :style="{ aspectRatio: ratio }">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
      <circle cx="8" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M4 17l5-5 4 4 3-3 4 4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span>{{ label }}</span>
  </div>
</template>

<style scoped>
.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  border: 2px dashed rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.85rem;
}
</style>
