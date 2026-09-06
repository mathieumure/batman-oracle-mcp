<script setup>
defineProps({
  name: { type: String, required: true },
});
</script>

<template>
  <span class="pin" :style="{ viewTransitionName: name }">
    <svg viewBox="0 0 24 32" aria-hidden="true">
      <path fill="#988829" d="M12 0C6.5 0 2 4.5 2 10c0 7.5 10 22 10 22s10-14.5 10-22C22 4.5 17.5 0 12 0z" />
      <circle cx="12" cy="10" r="3.6" fill="#141414" />
    </svg>
  </span>
</template>

<style scoped>
.pin {
  display: inline-flex;
  width: 1.55rem;
  height: 2.05rem;
}

svg {
  width: 100%;
  height: 100%;
}
</style>
