<script setup>
import { computed } from 'vue';
import { useNav } from '@slidev/client';

const props = defineProps({
  from: { type: String, required: true },
  kind: { type: String, default: 'text' },
  at: { type: Number, default: null },
});

const { clicks } = useNav();
const visible = computed(() => props.at == null || clicks.value >= props.at);
</script>

<template>
  <p v-if="visible && kind === 'text'" class="bubble fade" :class="from">
    <slot />
  </p>

  <pre v-else-if="visible && kind === 'json'" class="json fade">{
  "criminals": [
    {
      "name": "Joker",
      "picture": "https://static.wikia.nocookie.net/joker.jpg",
      "details": {
        "realName": "unknown",
        "aliases": ["Clown Prince of Crime"],
        "status": "wanted"
      }
    },
    {
      "name": "Penguin",
      "picture": "https://static.wikia.nocookie.net/penguin.jpg",
      "details": {
        "realName": "Oswald Cobblepot",
        "aliases": ["The Penguin"],
        "status": "jailed"
      }
    },
    {
      "name": "Riddler",
      "picture": "https://static.wikia.nocookie.net/riddler.jpg",
      "details": {
        "realName": "Edward Nygma",
        "aliases": ["The Riddler"],
        "status": "wanted"
      }
    },
    { ... }
  ]
}
<span class="json-more">+ 24 000 lines</span></pre>

  <div v-else-if="visible && kind === 'widget'" class="iframe fade">
    <span class="iframe-tag">iframe</span>
    <div class="cards">
      <div v-for="n in 3" :key="n" class="card">
        <span class="skel image" />
        <span class="skel line" />
        <span class="skel line short" />
        <span class="skel btn" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bubble {
  margin: 0;
  max-width: 90%;
  padding: 0.4rem 0.6rem;
  border-radius: 10px;
  font-size: 0.72rem;
  line-height: 1.35;
}

.bubble.me {
  align-self: flex-end;
  background: #3a3a3a;
}

.bubble.bot {
  align-self: flex-start;
  background: #262626;
  color: #bbb;
}

.json {
  align-self: flex-start;
  flex-shrink: 0;
  margin: 0;
  max-width: 96%;
  padding: 0.65rem 0.8rem;
  border-radius: 10px;
  background: #141414;
  color: #d4d4d4;
  font-size: 0.68rem;
  line-height: 1.45;
  white-space: pre;
}

.json-more {
  display: block;
  margin-top: 0.35rem;
  color: #888;
  font-size: 0.62rem;
}

.iframe {
  align-self: stretch;
  position: relative;
  margin-top: 0.15rem;
  padding: 1rem 0.8rem 0.8rem;
  border: 1.5px dashed #6e5a10;
  border-radius: 8px;
  background: #141414;
}

.iframe-tag {
  position: absolute;
  top: -0.55rem;
  left: 0.7rem;
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  background: #6e5a10;
  color: #fff;
  font-size: 0.58rem;
  font-weight: 800;
}

.cards {
  display: flex;
  gap: 0.55rem;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.45rem;
  border-radius: 8px;
  background: #1e1e1e;
}

.skel {
  display: block;
  border-radius: 4px;
  background: #2f2f2f;
}

.skel.image {
  height: 4.4rem;
  border-radius: 6px;
}

.skel.line {
  height: 0.45rem;
  width: 88%;
}

.skel.line.short {
  width: 58%;
}

.skel.btn {
  width: 3.4rem;
  height: 0.85rem;
  margin-top: 0.15rem;
  border-radius: 999px;
}

.fade {
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
