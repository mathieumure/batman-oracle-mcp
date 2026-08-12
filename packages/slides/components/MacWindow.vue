<script setup>
defineProps({
  title: { type: String, default: 'code.ts' },
  height: { type: String, default: '260px' },
  label: { type: String, default: '' },
});
</script>

<template>
  <div class="mac-window">
    <div class="mac-titlebar">
      <span class="mac-btn mac-close" />
      <span class="mac-btn mac-minimize" />
      <span class="mac-btn mac-maximize" />
      <span class="mac-title">{{ title }}</span>
      <span v-if="label" class="mac-label">{{ label }}</span>
      <slot name="titlebar-actions" />
    </div>
    <div class="mac-content" :style="{ height }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.mac-window {
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #ddd;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
.mac-titlebar {
  background: linear-gradient(to bottom, #f6f6f6, #e8e8e8);
  padding: 8px 10px 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid #d0d0d0;
  border-radius: 6px 6px 0 0;
}
.mac-btn {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.mac-close {
  background: #ff5f56;
}
.mac-minimize {
  background: #ffbd2e;
}
.mac-maximize {
  background: #27ca40;
}
.mac-title {
  margin-left: 6px;
  color: #666;
  font-size: 11px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  flex: 1;
}
.mac-label {
  font-size: 9px;
  color: #888;
  background: #e0e0e0;
  border: 1px solid #ccc;
  padding: 1px 6px;
  border-radius: 3px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
.mac-content {
  background: #f5f5f5;
  overflow: auto;
  border-radius: 0 0 6px 6px;
}
.mac-content :deep(.slidev-monaco-container),
.mac-content :deep(.monaco-editor),
.mac-content :deep(.shiki) {
  border-radius: 0 0 6px 6px;
}
</style>
