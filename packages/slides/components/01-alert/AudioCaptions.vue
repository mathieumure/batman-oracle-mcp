<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import lines, { timecode } from '../../pages/01-alert/assets/alfred.ts';

const props = defineProps({
  current: { type: Number, default: 0 },
});

const paragraphs = (() => {
  const result = [];
  let offset = 0;
  for (const line of lines) {
    const words = line.trim().split(/\s+/).filter(Boolean);
    result.push(words.map((word, i) => ({ word, index: offset + i })));
    offset += words.length;
  }
  return result;
})();

const visibleCount = computed(() => {
  const t = props.current + 0.04;
  let count = 0;
  for (let i = 0; i < timecode.length; i++) {
    if (t >= timecode[i].start) count = i + 1;
    else break;
  }
  return count;
});

const activeIndex = computed(() => Math.max(0, visibleCount.value - 1));

function paragraphVisible(words) {
  return words.some(({ index }) => index < visibleCount.value);
}

const captionsEl = ref(null);

watch(visibleCount, async () => {
  await nextTick();
  const el = captionsEl.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
});
</script>

<template>
  <div
    ref="captionsEl"
    v-if="visibleCount > 0"
    class="captions"
    aria-live="polite"
  >
    <p
      v-for="(words, pi) in paragraphs"
      v-show="paragraphVisible(words)"
      :key="pi"
      class="captions-paragraph"
    >
      <span
        v-for="{ word, index } in words"
        v-show="index < visibleCount"
        :key="index"
        class="caption-word"
        :class="{ active: index === activeIndex }"
      >{{ word }}</span>
    </p>
  </div>
</template>

<style scoped>
.captions {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.65rem 1.1rem 0.85rem;
  border-top: 1px solid #d4d4d4;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.88rem;
  line-height: 1.55;
  color: #3a3a3c;
}

.captions-paragraph {
  margin: 0 0 0.65rem;
  display: flex;
  flex-wrap: wrap;
}

.captions-paragraph:last-child {
  margin-bottom: 0;
}

.caption-word {
  margin-right: 0.28em;
  transition: color 0.12s ease;
}

.caption-word.active {
  color: #1d1d1f;
  font-weight: 700;
}
</style>
