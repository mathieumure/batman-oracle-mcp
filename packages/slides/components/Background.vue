<script setup>
defineProps({
  src: { type: String, default: '' },
})
</script>

<template>
  <img v-if="src" :src="src" class="layout-bg" alt="" />
</template>

<style scoped>
.layout-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
</style>
