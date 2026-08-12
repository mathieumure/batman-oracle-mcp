<script setup>
import { useSlideContext } from '@slidev/client';

const { $frontmatter } = useSlideContext();
</script>

<template>
  <div v-if="$frontmatter.note" class="demo-note">
    {{ $frontmatter.note }}
  </div>
</template>

<style scoped>
.demo-note {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 90%;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  color: var(--color-yellow, #fdff00);
  font-family: ui-monospace, 'SF Mono', 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  text-align: center;
  white-space: nowrap;
  z-index: 10;
}
</style>
