<script setup lang="ts">
defineProps<{src: string}>();
</script>

<template>
  <iframe :src="src" />
</template>

<style scoped>
iframe {
  width: 100%;
  height: 100%;
  zoom: calc(1 / var(--slidev-slide-scale));
}
</style>
