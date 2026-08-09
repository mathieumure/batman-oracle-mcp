<script setup>
defineProps({
  name: { type: String, required: true }, // 'bat-01' .. 'bat-08'
})
</script>

<template>
  <img :src="`/assets/images/bats/${name}.svg`" alt="" class="decoration" />
</template>

<style scoped>
.decoration {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
}
</style>
