<script setup>
import { onUnmounted, ref } from 'vue';
import { onSlideEnter, onSlideLeave } from '@slidev/client';

const PROMPTS = [
  'Redonne-moi les données mises à jour.',
  'Affiche-moi les nouvelles data.',
  'Affiche-moi à nouveau le composant.',
  'Encore les preuves.',
];

const REPLIES = [
  'C\'est à jour.',
  'Voici le dossier.',
  'Je remets le widget.',
  'Les dernières preuves.',
];

const log = ref([]);
const typed = ref('');
const messages = ref([]);

const LIMIT = 10;

let version = 18;
let versionTimer;
let chatTimer;
let promptIndex = 0;
let charIndex = 0;
let bumps = 0;

function stop() {
  clearInterval(versionTimer);
  clearTimeout(chatTimer);
  versionTimer = undefined;
  chatTimer = undefined;
}

function bumpVersion() {
  if (bumps >= LIMIT) {
    clearInterval(versionTimer);
    versionTimer = undefined;
    return;
  }
  bumps += 1;
  version += 1;
  log.value = [...log.value, version].slice(-7);
}

function later(fn, ms) {
  clearTimeout(chatTimer);
  chatTimer = setTimeout(fn, ms);
}

function typeTick() {
  const prompt = PROMPTS[promptIndex % PROMPTS.length];
  charIndex += 1;
  typed.value = prompt.slice(0, charIndex);
  if (charIndex < prompt.length) {
    later(typeTick, 28);
    return;
  }
  later(sendPrompt, 280);
}

function sendPrompt() {
  const prompt = PROMPTS[promptIndex % PROMPTS.length];
  messages.value.push({ from: 'me', text: prompt });
  typed.value = '';
  later(reply, 450);
}

function reply() {
  messages.value.push({
    from: 'bot',
    text: REPLIES[promptIndex % REPLIES.length],
    version,
  });
  if (messages.value.length > 14) {
    messages.value.splice(0, 2);
  }
  promptIndex += 1;
  charIndex = 0;
  if (promptIndex < LIMIT) {
    later(typeTick, 900);
  }
}

function start() {
  stop();
  version = 18;
  log.value = [18];
  typed.value = '';
  messages.value = [];
  promptIndex = 0;
  charIndex = 0;
  bumps = 0;
  versionTimer = setInterval(bumpVersion, 1400);
  later(typeTick, 400);
}

onSlideEnter(start);
onSlideLeave(() => {
  stop();
  typed.value = '';
  messages.value = [];
});
onUnmounted(stop);
</script>

<template>
  <div class="live">
    <div class="feed">
      <img src="../../pages/03-map/assets/gcpd-logo.png" alt="GCPD" />
      <p class="label">GCPD · live</p>
      <ul>
        <li
          v-for="(item, i) in log"
          :key="item"
          :class="{ fresh: i === log.length - 1 }"
        >
          Nouvelle version <span>v.{{ item }}</span>
        </li>
      </ul>
    </div>

    <McpAppChat
      pin-bottom
      height="420px"
      width="100%"
      :input="typed"
      :scroll-key="messages.length"
    >
      <template v-for="(msg, i) in messages" :key="i">
        <McpAppMessage :from="msg.from">{{ msg.text }}</McpAppMessage>
        <div v-if="msg.version" class="remount">
          <span class="tag">iframe</span>
          <p>Dossier Alfred · v.{{ msg.version }}</p>
        </div>
      </template>
    </McpAppChat>
  </div>
</template>

<style scoped>
.live {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
  padding: 1.6rem 1.8rem;
}

.feed {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15.5rem;
  padding: 1.2rem 1rem 1rem;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  background: #141414;
}

.feed img {
  width: 4.8rem;
  height: auto;
  margin-bottom: 0.55rem;
}

.label {
  margin: 0 0 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.72rem;
  font-weight: 600;
}

.feed ul {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feed li {
  display: flex;
  justify-content: space-between;
  padding: 0.22rem 0.4rem;
  color: rgba(255, 255, 255, 0.38);
  font-size: 0.7rem;
  font-weight: 700;
}

.feed li.fresh {
  color: #988829;
  animation: pop 0.35s ease;
}

.live :deep(.chat) {
  padding: 0;
  width: min(60%, 36rem);
  height: auto;
}

.remount {
  align-self: stretch;
  position: relative;
  margin-top: 0.1rem;
  padding: 0.7rem 0.75rem 0.55rem;
  border: 1.5px dashed #6e5a10;
  border-radius: 8px;
  background: #141414;
}

.tag {
  position: absolute;
  top: -0.45rem;
  left: 0.65rem;
  padding: 0.06rem 0.4rem;
  border-radius: 999px;
  background: #6e5a10;
  color: #fff;
  font-size: 0.52rem;
  font-weight: 800;
}

.remount p {
  margin: 0;
  color: #d4d4d4;
  font-size: 0.72rem;
  font-weight: 700;
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: translateY(4px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
