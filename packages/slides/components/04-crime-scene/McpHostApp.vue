<script setup>
import { onUnmounted, ref } from 'vue';
import { onSlideEnter, onSlideLeave } from '@slidev/client';

const mode = ref(null);
const version = ref(24);
const from = ref(24);
const remounts = ref([]);
const flash = ref(false);

let flashTimer;

function stop() {
  clearTimeout(flashTimer);
  flashTimer = undefined;
}

function reset() {
  stop();
  mode.value = null;
  version.value = 24;
  from.value = 24;
  remounts.value = [];
  flash.value = false;
}

function onSync(event) {
  event.stopPropagation();
  mode.value = 'sync';
  remounts.value = [];
  from.value = version.value;
  version.value += 1;
  flash.value = true;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => {
    flash.value = false;
  }, 400);
}

function onChat(event) {
  event.stopPropagation();
  mode.value = 'chat';
  version.value += 1;
  remounts.value = [...remounts.value, version.value].slice(-3);
  flash.value = true;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => {
    flash.value = false;
  }, 400);
}

onSlideEnter(reset);
onSlideLeave(reset);
onUnmounted(stop);
</script>

<template>
  <div class="host">
    <div class="stage">
      <div class="rail">
        <div class="diagram">
          <div class="slot">
            <span class="tag on">widget</span>
            <div class="card widget">
              <p>Dossier GCPD</p>
              <p class="ver" :class="{ on: flash }">
                <template v-if="mode === 'sync'">v.{{ from }} → v.{{ version }}</template>
                <template v-else>v.{{ version }}</template>
              </p>
              <div class="actions">
                <button
                  type="button"
                  class="btn sync"
                  :class="{ on: mode === 'sync' }"
                  @click.stop="onSync"
                >
                  Sync
                </button>
                <button
                  type="button"
                  class="btn chat"
                  :class="{ on: mode === 'chat' }"
                  @click.stop="onChat"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>

          <div class="link" :class="{ via: mode === 'chat' }">
            <svg viewBox="0 0 80 24" aria-hidden="true">
              <path d="M10 12 H66" />
              <path d="M56 5 L68 12 L56 19" />
            </svg>
          </div>

          <div class="node" :class="{ dim: mode !== 'chat' }">
            <img src="../../pages/02-criminals/assets/logos/claude.svg" alt="" />
            <span>Agent Chat</span>
          </div>

          <div class="link" :class="{ via: mode === 'chat' }">
            <svg viewBox="0 0 80 24" aria-hidden="true">
              <path d="M10 12 H66" />
              <path d="M56 5 L68 12 L56 19" />
            </svg>
          </div>

          <div class="slot tool-wrap">
            <span class="tag on">tool</span>
            <div class="card tool">
              <pre>get_forensics_residues</pre>
            </div>
          </div>
        </div>

        <div class="bypass-wrapper" :class="{ on: mode === 'sync' }">
          <div class="bypass" :class="{ on: mode === 'sync' }">
            <svg viewBox="0 0 320 56" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <path d="M16 10 C 16 46, 304 46, 304 18" />
              <g transform="translate(305 18) rotate(-45)">
                <path d="M-12 -7 L0 0 L-12 7" />
              </g>
            </svg>
          </div>
          <div class="sync-label" :class="{ on: mode === 'sync' }">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36" />
            </svg>
            Mise à jour sur place
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="remounts" :class="{ on: mode === 'chat' }">
          <div v-for="(item, i) in remounts" :key="i" class="remount">
            <span class="iframe-tag">iframe</span>
            <p>Dossier Alfred · v.{{ item }}</p>
          </div>
        </div>

        <div class="visibility-explanation" :class="{ on: mode === 'sync' }">
          <p class="visibility-title">Contrôler la visibilité du tool</p>
          <pre class="meta-visibility">{
  <span class="hi">visibility</span>: ['app']
}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.host {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1.1rem 2rem 0.9rem;
}

.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 0.7rem;
}

.diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  width: 100%;
}

.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tag {
  position: relative;
  z-index: 2;
  top: 0.55rem;
  padding: 0.08rem 0.5rem;
  border-radius: 999px;
  background: #6e5a10;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  line-height: 1.2;
}

.card {
  padding: 1rem 1rem 0.85rem;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  background: #141414;
}

.widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  min-width: 12.2rem;
}

.widget p {
  margin: 0;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
}

.ver {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.82rem;
  font-weight: 800;
}

.ver.on {
  color: #988829;
}

.actions {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.15rem;
}

.btn {
  padding: 0.2rem 0.7rem;
  border: 0;
  border-radius: 6px;
  background: #2a2a2a;
  color: #d4d4d4;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
}

.btn.sync.on {
  background: #988829;
  color: #111;
}

.btn.chat.on {
  background: #d97757;
  color: #111;
}

.tool pre {
  margin: 0;
  color: #d4d4d4;
  font-size: 0.95rem;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
}

.node img {
  width: 2.4rem;
  height: 2.4rem;
}

.node.dim {
  opacity: 0.28;
}

.link {
  position: relative;
  display: flex;
  align-items: center;
  width: 5.4rem;
  flex-shrink: 0;
  opacity: 0.18;
}

.link svg {
  width: 100%;
  height: 2.2rem;
  fill: none;
  stroke: #666;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.link.via {
  opacity: 1;
}

.link.via svg {
  stroke: #d97757;
}

.bypass-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22rem;
  gap: 0.3rem;
  margin-top: -0.2rem;
}

.bypass {
  position: relative;
  width: 100%;
  visibility: hidden;
}

.bypass svg {
  display: block;
  width: 100%;
  height: auto;
  fill: none;
  stroke: #666;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.bypass.on {
  visibility: visible;
}

.bypass.on svg {
  stroke: #6a9a4a;
}

.sync-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.92rem;
  font-weight: 600;
  visibility: hidden;
}

.sync-label.on {
  visibility: visible;
  color: #6a9a4a;
}

.sync-label svg {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 5.6rem;
}

.remounts {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.6rem;
  visibility: hidden;
}

.remounts.on {
  visibility: visible;
}

.remount {
  position: relative;
  min-width: 10.5rem;
  padding: 0.7rem 0.75rem 0.5rem;
  border: 1.5px dashed #6e5a10;
  border-radius: 8px;
  background: #141414;
}

.iframe-tag {
  position: absolute;
  top: -0.45rem;
  left: 0.6rem;
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

.visibility-explanation {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
  visibility: hidden;
}

.visibility-explanation.on {
  visibility: visible;
}

.visibility-title {
  margin: 0;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
}

.meta-visibility {
  margin: 0;
  padding: 0.7rem 1.1rem 0.6rem;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  background: #141414;
  color: #d4d4d4;
  font-size: 0.88rem;
  line-height: 1.4;
  white-space: pre;
  align-self: center;
}

.hi {
  color: #e4c44a;
  font-weight: 800;
}
</style>
