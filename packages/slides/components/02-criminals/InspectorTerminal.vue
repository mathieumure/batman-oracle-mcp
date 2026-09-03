<script setup>
import { ref, watch } from 'vue';
import { onSlideLeave, useNav } from '@slidev/client';
import ScaledIframe from '../ScaledIframe.vue';

const WAIT_MS = 1400;
const { clicks } = useNav();
const showInspector = ref(false);
let timer;

watch(clicks, (n) => {
  clearTimeout(timer);
  if (n >= 2) {
    timer = setTimeout(() => {
      showInspector.value = true;
    }, WAIT_MS);
    return;
  }
  showInspector.value = false;
});

onSlideLeave(() => {
  clearTimeout(timer);
  showInspector.value = false;
});
</script>

<template>
  <div class="inspector-stage">
    <MacWindow title="Bat-Terminal" height="240px" content-bg="#1c1c1c" style="width: min(78%, 720px)">
      <div class="term">
        <p class="term-line">
          <span class="term-prompt">➜</span>
          <span class="term-path">~</span>
          <span v-click class="term-cmd">
            <span class="term-npx">npx</span>
            @modelcontextprotocol/inspector
          </span>
        </p>
        <p v-click class="term-line term-load">
          <span class="term-dot" />
          <span class="term-dot" />
          <span class="term-dot" />
        </p>
      </div>
    </MacWindow>

    <div v-if="showInspector" class="inspector-overlay">
      <div class="inspector-win">
        <MacWindow title="MCP Inspector" height="500px" style="width: 100%">
          <ScaledIframe src="http://localhost:6274/" />
        </MacWindow>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inspector-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 4rem;
}

.term {
  height: 100%;
  padding: 1rem 1.15rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e8e8e8;
}

.term-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
}

.term-load {
  margin-top: 0.45rem;
  gap: 0.35rem;
  animation: pop-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.term-prompt {
  color: #27ca40;
  font-weight: 700;
}

.term-path {
  color: #7ab7ff;
}

.term-cmd {
  color: #f5f5f5;
  animation: pop-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.term-npx {
  color: #e6c34a;
}

.term-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c8c8c8;
  opacity: 0.4;
  animation: term-dot 1s ease-in-out infinite;
}

.term-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.term-dot:nth-child(3) {
  animation-delay: 0.3s;
}

.inspector-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 4rem;
  background: rgba(0, 0, 0, 0.45);
}

.inspector-win {
  width: min(92%, 980px);
  animation: pop-in 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes pop-in {
  from {
    opacity: 0;
    transform: scale(0.84) translateY(18px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes term-dot {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}
</style>
