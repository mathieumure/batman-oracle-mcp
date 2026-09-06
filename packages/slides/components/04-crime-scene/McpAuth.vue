<script setup>
import { computed } from 'vue';
import { useNav } from '@slidev/client';

const { clicks } = useNav();
const showConfig = computed(() => clicks.value >= 4);
</script>

<template>
  <div class="auth">
    <div class="diagram">
      <div class="node">
        <img src="../../pages/02-criminals/assets/logos/claude.svg" alt="" />
        <span>Agent</span>
      </div>

      <div class="link" :class="{ ok: showConfig }">
        <svg viewBox="0 0 80 24" aria-hidden="true">
          <path d="M10 12 H66" />
          <path d="M56 5 L68 12 L56 19" />
        </svg>
        <span v-if="!showConfig" class="mark pop">✕</span>
        <span v-else class="mark ok pop">✓</span>
      </div>

      <div class="slot tool-wrap">
        <span class="tag on">tool</span>
        <div class="tool" :class="{ denied: !showConfig }">
          <pre>get_crime_scene</pre>
          <p class="status" :class="showConfig ? 'ok' : 'err'">
            {{ showConfig ? 'Bearer' : '401' }}
          </p>
        </div>
      </div>
    </div>

    <div class="explain">
      <h2 v-click="1">OAuth</h2>
      <div class="how">
        <div class="slot">
          <span class="tag" :class="{ on: clicks >= 2 }">401</span>
          <div v-click="2" class="card">
            <pre>WWW-Authenticate:
  resource_metadata=
    /.well-known/oauth-protected-resource</pre>
          </div>
        </div>
        <div v-click="3" class="sep">
          <span class="line" />
          <span class="verb">GET</span>
          <span class="chevron">→</span>
        </div>
        <div class="slot">
          <span class="tag" :class="{ on: clicks >= 4 }">config</span>
          <div v-click="4" class="card">
            <pre>{
  <span class="hi">authorization_servers</span>: ["auth.gcpd.com"],
  <span class="hi">scopes_supported</span>: ["mcp:tools"]
}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem 2rem 1.6rem;
}

.diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;
  width: min(100%, 52rem);
  margin-bottom: 2.6rem;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
}

.node img {
  width: 2.8rem;
  height: 2.8rem;
}

.link {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 10rem;
}

.link svg {
  width: 100%;
  height: 2.4rem;
  fill: none;
  stroke: #c44;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.link.ok svg {
  stroke: #6a9a4a;
}

.mark {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  background: #c44;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
  transform: translate(-50%, -50%);
}

.mark.ok {
  background: #6a9a4a;
}

.tool-wrap {
  flex: 0 0 auto;
  min-width: 22rem;
}

.tool {
  width: 100%;
  padding: 1.25rem 1.4rem 1.15rem;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  background: #141414;
}

.tool.denied {
  border-color: #c44;
}

.tool pre {
  margin: 0;
  color: #d4d4d4;
  font-size: 1.15rem;
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
  visibility: hidden;
}

.tag.on {
  visibility: visible;
}

.status {
  margin: 0.5rem 0 0;
  min-height: 1.4rem;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.2;
}

.status.err {
  color: #c44;
}

.status.ok {
  color: #6a9a4a;
}

.explain {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  width: 100%;
}

.explain h2 {
  margin: 0.3rem 0;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 800;
}

.how {
  display: flex;
  align-items: stretch;
  gap: 1.1rem;
  width: 100%;
  padding-top: 0;
}

.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.slot.tool-wrap {
  flex: 0 0 auto;
}

.card {
  width: 100%;
  height: 100%;
  padding: 1.05rem 1rem 0.9rem;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  background: #141414;
}

.card pre {
  margin: 0;
  color: #d4d4d4;
  font-size: 0.8rem;
  line-height: 1.5;
  white-space: pre;
}

.hi {
  color: #e4c44a;
  font-weight: 800;
}

.sep {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  align-self: center;
  gap: 0.7rem;
}

.line {
  width: 1.15rem;
  height: 2px;
  background: #988829;
}

.verb {
  padding: 0.16rem 0.42rem;
  border-radius: 6px;
  background: #988829;
  color: #111;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.chevron {
  color: #988829;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1;
}

.pop {
  animation: pop 0.35s ease;
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.72);
  }

  70% {
    transform: translate(-50%, -50%) scale(1.08);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
