<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import { onSlideLeave, useNav } from '@slidev/client';

const TEXT = 'Montre-moi les derniers crimes dans la ville de Gotham.';

const { clicks } = useNav();
const typed = ref('');
const showSchema = computed(() => clicks.value >= 2);
const showZod = computed(() => clicks.value >= 3);
const showCaret = computed(() => clicks.value < 2 && typed.value.length < TEXT.length);

let timer;

function stopType() {
  clearInterval(timer);
  timer = undefined;
}

function typeText() {
  stopType();
  typed.value = '';
  let i = 0;
  timer = setInterval(() => {
    i += 1;
    typed.value = TEXT.slice(0, i);
    if (i >= TEXT.length) stopType();
  }, 28);
}

watch(
  clicks,
  (n) => {
    if (n < 1) {
      stopType();
      typed.value = '';
      return;
    }
    if (n >= 2) {
      stopType();
      typed.value = TEXT;
      return;
    }
    typeText();
  },
  { immediate: true },
);

onSlideLeave(() => {
  stopType();
  typed.value = '';
});

onUnmounted(stopType);
</script>

<template>
  <div class="filters">
    <div class="cite">
      <img
        class="claude"
        src="../../pages/02-criminals/assets/logos/claude.svg"
        alt="Claude"
      />
      <p>
        <span>{{ typed }}</span>
        <span v-if="showCaret" class="caret" />
      </p>
      <span class="marks" aria-hidden="true">“”</span>
    </div>

    <svg class="arrow" :class="{ ready: showSchema }" viewBox="0 0 24 56" aria-hidden="true">
      <path d="M12 4 V52" />
      <path d="M5 13 L12 4 L19 13" />
      <path d="M5 43 L12 52 L19 43" />
    </svg>

    <div class="schema-wrap" :class="{ ready: showSchema }">
      <pre class="schema"><span class="hi">inputSchema</span> {
  city,
  suspect,
  ...
}</pre>
      <img
        v-if="showZod"
        class="zod"
        src="../../pages/02-criminals/assets/logos/zod.svg"
        alt="Zod"
      />
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
  height: 100%;
  padding: 2.4rem 3.2rem;
}

.cite {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: min(46rem, 100%);
  min-height: 4.6rem;
  padding: 1.15rem 3.2rem 1.15rem 1.15rem;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  background: #161616;
}

.claude {
  flex: 0 0 2.3rem;
  width: 2.3rem;
  height: 2.3rem;
}

.cite p {
  margin: 0;
  min-height: 1.5em;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
}

.caret {
  display: inline-block;
  width: 0.12rem;
  height: 1.05em;
  margin-left: 0.12rem;
  background: #988829;
  vertical-align: -0.15em;
  animation: blink 0.7s steps(1) infinite;
}

.marks {
  position: absolute;
  top: 0.4rem;
  right: 0.9rem;
  color: #988829;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2.2rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.04em;
}

.arrow {
  flex: 0 0 2.6rem;
  width: 1.4rem;
  height: 2.6rem;
  fill: none;
  stroke: #988829;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  visibility: hidden;
}

.schema-wrap {
  position: relative;
  visibility: hidden;
}

.arrow.ready,
.schema-wrap.ready {
  visibility: visible;
}

.schema {
  margin: 0;
  min-width: 18rem;
  padding: 0.95rem 1.2rem;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #141414;
  color: #d4d4d4;
  font-size: 0.88rem;
  line-height: 1.6;
  white-space: pre;
}

.hi {
  color: #988829;
}

.zod {
  position: absolute;
  right: -0.7rem;
  bottom: -0.75rem;
  width: 3.2rem;
  height: 3.2rem;
  animation: pop 0.35s ease both;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0.72);
  }

  70% {
    opacity: 1;
    transform: scale(1.08);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
