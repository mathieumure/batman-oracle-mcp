<script setup>
import { nextTick, ref, watch } from 'vue';
import { onSlideEnter, useNav } from '@slidev/client';

const props = defineProps({
  pinBottom: { type: Boolean, default: false },
});

const { clicks } = useNav();
const thread = ref(null);

async function stickBottom() {
  if (!props.pinBottom || !thread.value) return;
  await nextTick();
  thread.value.scrollTop = thread.value.scrollHeight;
}

onSlideEnter(stickBottom);
watch(clicks, stickBottom);
</script>

<template>
  <div class="chat">
    <MacWindow title="claude.ai" height="480px" content-bg="#1a1a1a" style="width: min(78%, 720px)">
      <div class="claude">
        <div class="claude-top">
          <img class="brand-logo" src="../../pages/02-criminals/assets/logos/claude.svg" alt="" />
          <span class="claude-name">Claude</span>
        </div>
        <div ref="thread" class="claude-thread" @wheel.stop>
          <slot />
        </div>
        <div class="claude-input">
          <span class="claude-placeholder">Répondre à Claude…</span>
          <span class="claude-send" />
        </div>
      </div>
    </MacWindow>
  </div>
</template>

<style scoped>
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem 3.2rem;
  view-transition-name: mcp-app-chat;
}

.claude {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #eee;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.claude-top {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #2c2c2c;
}

.brand-logo {
  width: 14px;
  height: 14px;
}

.claude-name {
  font-size: 0.75rem;
  font-weight: 600;
}

.claude-thread {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.7rem 0.8rem;
  overflow-y: scroll;
}

.claude-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.6rem 0.6rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid #333;
  border-radius: 12px;
  background: #111;
}

.claude-placeholder {
  flex: 1;
  font-size: 0.66rem;
  color: #777;
}

.claude-send {
  width: 8px;
  height: 8px;
  border-right: 2px solid #888;
  border-top: 2px solid #888;
  transform: rotate(45deg);
}
</style>
