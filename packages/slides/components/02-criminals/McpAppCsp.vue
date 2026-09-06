<script setup>
import { computed } from 'vue';
import { useNav } from '@slidev/client';

const { clicks } = useNav();

const showWorld = computed(() => clicks.value >= 2);
const showSandbox = computed(() => clicks.value >= 3);
const showWikia = computed(() => clicks.value >= 4);
const showMeta = computed(() => clicks.value >= 5);
const showHeader = computed(() => clicks.value >= 6);

const photoLink = computed(() => {
  if (clicks.value >= 6) return 'ok';
  if (clicks.value >= 4) return 'blocked';
  return '';
});
</script>

<template>
  <div class="csp">
    <div class="diagram">
      <div class="sat photo" :class="[photoLink, { ready: showWorld }]">
        <div class="sat-card">
          <span class="sat-tag">img</span>
          <svg class="pic" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.2" cy="10.2" r="1.6" />
            <path d="M4.2 16.8 L9 12.4 L12.6 15.6 L16 12.8 L19.8 16.8" />
          </svg>
        </div>
        <div class="sat-meta">
          <code v-if="showWikia" class="pop">static.wikia.nocookie.net</code>
        </div>
      </div>

      <div class="link" :class="[photoLink, { ready: showWorld }]">
        <svg viewBox="0 0 80 24" aria-hidden="true">
          <path d="M70 12 H14" />
          <path d="M24 5 L12 12 L24 19" />
        </svg>
        <span v-if="photoLink === 'blocked'" class="mark pop">✕</span>
        <span v-else-if="photoLink === 'ok'" class="mark ok pop">✓</span>
      </div>

      <div class="core">
        <h1 v-if="clicks === 0" class="title">Ce n'est pas un bug...</h1>
        <div v-else class="iframe pop" :class="{ sandbox: showSandbox }">
          <div v-if="showSandbox" class="cage pop">
            <span>sandbox</span>
          </div>
          <span class="iframe-tag">Notre iframe</span>
          <div class="cards">
            <div v-for="n in 3" :key="n" class="card">
              <span class="skel image" />
              <span class="skel line" />
              <span class="skel line short" />
            </div>
          </div>
        </div>
      </div>

      <div class="link out" :class="{ ready: showWorld }">
        <svg viewBox="0 0 80 24" aria-hidden="true">
          <path d="M10 12 H66" />
          <path d="M56 5 L68 12 L56 19" />
        </svg>
      </div>

      <div class="sat fetch" :class="{ ready: showWorld }">
        <div class="sat-card">
          <span class="sat-tag">fetch</span>
          <code class="fetch-fn">GET</code>
        </div>
        <div class="sat-meta" />
      </div>
    </div>

    <div class="explain" :class="{ ready: showWikia }">
      <h2 class="csp-name">Content Security Policy - <span>CSP</span></h2>
      <p class="lead">Le widget a le droit de charger quoi ?</p>
      <div class="how" :class="{ ready: showMeta }">
        <pre class="code"><span class="tag">resource</span><span class="hi">_meta.ui.csp</span> = {
  <span class="hi">resourceDomains</span>: [
    'https://static.wikia.nocookie.net'
  ]
}</pre>
        <span class="how-sep late" :class="{ ready: showHeader }">→</span>
        <pre class="code late" :class="{ ready: showHeader }"><span class="tag">header</span>Content-Security-Policy:
  <span class="hi">img-src</span> https://static.wikia.nocookie.net</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.csp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2.2rem 2rem 1.6rem;
}

.diagram {
  display: grid;
  grid-template-columns: 14rem 5.2rem minmax(17rem, 20rem) 5.2rem 14rem;
  column-gap: 0.55rem;
  grid-template-rows: auto;
  align-items: stretch;
  align-content: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 3.9rem;
}

.core {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.4rem;
  overflow: visible;
}

.title {
  margin: 0;
  font-size: 2.1rem;
  font-weight: 800;
  color: var(--text-primary, #fff);
  text-align: center;
  line-height: 1.15;
  white-space: nowrap;
}

.iframe {
  position: relative;
  width: 100%;
  padding: 1.15rem 0.85rem 0.85rem;
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

.cage {
  position: absolute;
  inset: -1.25rem;
  border: 2px solid #988829;
  border-radius: 16px;
  pointer-events: none;
}

.cage span {
  position: absolute;
  top: -0.55rem;
  right: 0.75rem;
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  background: #988829;
  color: #141414;
  font-size: 0.58rem;
  font-weight: 800;
}

.cards {
  display: flex;
  gap: 0.5rem;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.4rem;
  border-radius: 8px;
  background: #1e1e1e;
}

.skel {
  display: block;
  border-radius: 4px;
  background: #2f2f2f;
}

.skel.image {
  height: 3.6rem;
  border-radius: 6px;
}

.skel.line {
  height: 0.4rem;
  width: 88%;
}

.skel.line.short {
  width: 58%;
}

.sat,
.link {
  visibility: hidden;
  opacity: 0;
}

.sat.ready,
.link.ready {
  visibility: visible;
  opacity: 1;
}

.sat {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sat-card {
  position: relative;
  width: 8.6rem;
  height: 100%;
  min-height: 7.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #141414;
}

.sat-tag {
  position: absolute;
  top: -0.5rem;
  left: 0.55rem;
  padding: 0.06rem 0.4rem;
  border-radius: 999px;
  background: #3a3a3a;
  color: #fff;
  font-size: 0.55rem;
  font-weight: 800;
}

.pic {
  width: 2.8rem;
  height: 2.8rem;
  fill: none;
  stroke: #888;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pic circle {
  fill: #888;
  stroke: none;
}

.sat.blocked .sat-card {
  border-color: #a33;
}

.sat.ok .sat-card {
  border-color: #6a9a4a;
}

.fetch-fn {
  color: #d4d4d4;
  font-size: 1.05rem;
  font-weight: 700;
}

.sat-meta {
  position: absolute;
  top: calc(100% + 0.55rem);
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  width: 16rem;
  text-align: center;
  transform: translateX(-50%);
}

.sat-meta code {
  color: #eee;
  font-size: 0.78rem;
  word-break: break-all;
}

.map {
  color: #988829;
  font-size: 0.78rem;
  font-weight: 700;
}

.map.mute {
  color: rgba(255, 255, 255, 0.45);
}

.link {
  position: relative;
  display: flex;
  align-items: center;
}

.link svg {
  width: 100%;
  height: 1.8rem;
  overflow: visible;
  fill: none;
  stroke: #988829;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.link.blocked svg {
  stroke: #c44;
}

.link.ok svg {
  stroke: #6a9a4a;
}

.mark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.35rem;
  height: 1.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #c44;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  transform: translate(-50%, -50%);
}

.mark.pop {
  animation: mark-pop 0.35s ease;
}

.mark.ok {
  background: #6a9a4a;
}

.explain {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.95rem;
  max-width: 52rem;
  margin-top: 0.55rem;
  visibility: hidden;
  opacity: 0;
}

.explain.ready {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.35s ease;
}

.csp-name {
  margin: 0.15rem 0 0.2rem;
  color: #fff;
  font-size: 1.75rem;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
}

.csp-name span {
  color: #988829;
}

.lead {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.45;
  text-align: center;
}

.how {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  min-height: 6.4rem;
  margin-top: 0.35rem;
  visibility: hidden;
}

.how.ready {
  visibility: visible;
}

.code {
  position: relative;
  margin: 0;
  min-width: 18rem;
  padding: 1.05rem 0.85rem 0.7rem;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #141414;
  color: #d4d4d4;
  font-size: 0.68rem;
  line-height: 1.45;
  white-space: pre;
}

.code .tag {
  position: absolute;
  top: -0.5rem;
  left: 0.65rem;
  padding: 0.06rem 0.4rem;
  border-radius: 999px;
  background: #3a3a3a;
  color: #fff;
  font-family: inherit;
  font-size: 0.52rem;
  font-weight: 800;
}

.hi {
  color: #988829;
}

.late {
  visibility: hidden;
}

.late.ready {
  visibility: visible;
}

.how-sep {
  color: #988829;
  font-size: 1.35rem;
  font-weight: 700;
}

.pop {
  animation: pop 0.35s ease;
}

.sat.ready,
.link.ready {
  animation: pop 0.35s ease;
}

@keyframes mark-pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.72);
  }

  70% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
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
